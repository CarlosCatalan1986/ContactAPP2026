import { useEffect, useMemo, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { buildVCard, decodeCard, emptyCard, encodeCard, fullName, validate } from './lib/vcard.js'
import { downloadVcf, shareLink, shareVcf } from './lib/share.js'

const STORAGE_KEY = 'app-contactapp:card'
const TITLE = 'ContactAPP'

const LABELS = {
  nombre: 'Nombre *', apellido: 'Apellido', empresa: 'Empresa', cargo: 'Cargo',
  telefono: 'Teléfono', email: 'Email', web: 'Sitio web', direccion: 'Dirección', nota: 'Nota',
}
const TYPES = { telefono: 'tel', email: 'email', web: 'url' }
const MODES = { telefono: 'tel', email: 'email', web: 'url' }

function loadCard() {
  try { return { ...emptyCard(), ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } } catch { return emptyCard() }
}

function Qr({ text }) {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current && text) {
      QRCode.toCanvas(ref.current, text, { errorCorrectionLevel: 'M', margin: 1, width: 640, color: { dark: '#000000', light: '#ffffff' } })
        .catch(() => {})
    }
  }, [text])
  return <div className="qr-wrap"><canvas ref={ref} aria-label="Código QR del contacto" /></div>
}

/** Vista de quien recibe el enlace: guarda el contacto sin instalar nada. */
function Received({ card }) {
  return (
    <div className="card">
      <p className="hint">Te compartieron un contacto</p>
      <p className="contact-name">{fullName(card)}</p>
      {(card.cargo || card.empresa) && <p className="contact-sub">{[card.cargo, card.empresa].filter(Boolean).join(' · ')}</p>}
      {card.telefono && <p className="contact-line">📞 <a href={`tel:${card.telefono}`} style={{ color: 'inherit' }}>{card.telefono}</a></p>}
      {card.email && <p className="contact-line">✉️ <a href={`mailto:${card.email}`} style={{ color: 'inherit' }}>{card.email}</a></p>}
      {card.web && <p className="contact-line">🌐 {card.web}</p>}
      {card.direccion && <p className="contact-line">📍 {card.direccion}</p>}
      <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={() => downloadVcf(card)}>Guardar en mis contactos</button>
      <p className="hint" style={{ marginTop: 10 }}>Se descarga un archivo de contacto (.vcf): ábrelo y tu teléfono lo guarda en Contactos.</p>
    </div>
  )
}

export default function App() {
  const received = useMemo(() => {
    const m = location.hash.match(/^#c=([\w-]+)/)
    return m ? decodeCard(m[1]) : null
  }, [])
  const [card, setCard] = useState(loadCard)
  const [tab, setTab] = useState(() => (validate(loadCard()) && Object.keys(validate(loadCard())).length ? 'editar' : 'compartir'))
  const [touched, setTouched] = useState({})
  const [mode, setMode] = useState('vcard')
  const [toast, setToast] = useState('')
  const errors = validate(card)
  const valid = Object.keys(errors).length === 0
  const link = `${location.origin}/#c=${encodeCard(card)}`

  const notify = (m) => { setToast(m); setTimeout(() => setToast(''), 2500) }
  const set = (k, v) => setCard((c) => ({ ...c, [k]: v }))
  const save = (e) => {
    e.preventDefault()
    setTouched(Object.fromEntries(Object.keys(LABELS).map((k) => [k, true])))
    if (!valid) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(card))
    notify('Tarjeta guardada en este teléfono')
    setTab('compartir')
  }

  return (
    <div className="app">
      <header>
        <img src="/logo.svg" alt="" />
        <div>
          <h1>{TITLE}</h1>
          <p>Tu contacto en un QR, sin que el otro instale nada</p>
        </div>
      </header>

      {received ? (
        <>
          <Received card={received} />
          <button className="btn btn-ghost" onClick={() => { history.replaceState(null, '', '/'); location.reload() }}>Crear mi propia tarjeta</button>
        </>
      ) : tab === 'editar' ? (
        <form className="card" onSubmit={save} noValidate>
          <div className="grid">
            {Object.entries(LABELS).map(([k, label]) => (
              <div key={k} className={['direccion', 'nota', 'email', 'web'].includes(k) ? 'full' : ''}>
                <label htmlFor={k}>{label}</label>
                {k === 'nota'
                  ? <textarea id={k} rows={2} maxLength={200} value={card[k]} onChange={(e) => set(k, e.target.value)} />
                  : <input id={k} type={TYPES[k] || 'text'} inputMode={MODES[k]} maxLength={k === 'nombre' ? 60 : 120}
                      autoComplete={{ nombre: 'given-name', apellido: 'family-name', empresa: 'organization', cargo: 'organization-title', telefono: 'tel', email: 'email', web: 'url', direccion: 'street-address' }[k]}
                      value={card[k]} onChange={(e) => set(k, e.target.value)} onBlur={() => setTouched((t) => ({ ...t, [k]: true }))} />}
                {touched[k] && errors[k] && <div className="error">{errors[k]}</div>}
              </div>
            ))}
          </div>
          <button className="btn btn-primary" style={{ marginTop: 16 }}>Guardar tarjeta</button>
        </form>
      ) : (
        <>
          {!valid ? (
            <div className="card">
              <p>Primero completa tu tarjeta.</p>
              <button className="btn btn-primary" onClick={() => setTab('editar')}>Crear mi tarjeta</button>
            </div>
          ) : (
            <div className="card">
              <p className="contact-name">{fullName(card)}</p>
              {(card.cargo || card.empresa) && <p className="contact-sub">{[card.cargo, card.empresa].filter(Boolean).join(' · ')}</p>}
              <div className="seg" role="tablist">
                <button className={mode === 'vcard' ? 'on' : ''} onClick={() => setMode('vcard')}>QR directo</button>
                <button className={mode === 'link' ? 'on' : ''} onClick={() => setMode('link')}>QR con enlace</button>
              </div>
              <Qr text={mode === 'vcard' ? buildVCard(card) : link} />
              <p className="hint" style={{ marginTop: 10 }}>
                {mode === 'vcard'
                  ? 'Que escaneen con la cámara: el teléfono ofrece «Agregar contacto». Funciona sin internet y sin instalar nada.'
                  : 'Que escaneen con la cámara: se abre una página con tu tarjeta y el botón «Guardar en mis contactos».'}
              </p>
              <div className="row" style={{ marginTop: 12 }}>
                <button className="btn btn-ghost" onClick={async () => {
                  try { if (!(await shareVcf(card))) { downloadVcf(card); notify('Archivo .vcf descargado') } } catch { /* cancelado */ }
                }}>Compartir .vcf</button>
                <button className="btn btn-ghost" onClick={async () => {
                  try { notify((await shareLink(link, fullName(card))) === 'copied' ? 'Enlace copiado' : 'Enlace compartido') } catch { /* cancelado */ }
                }}>Enviar enlace</button>
              </div>
            </div>
          )}
          <p className="hint">Tus datos se guardan sólo en este teléfono. El enlace lleva la tarjeta dentro de la URL y no pasa por ningún servidor.</p>
        </>
      )}

      {!received && (
        <nav className="tabs">
          <button className={tab === 'compartir' ? 'on' : ''} onClick={() => setTab('compartir')}>Compartir</button>
          <button className={tab === 'editar' ? 'on' : ''} onClick={() => setTab('editar')}>Mi tarjeta</button>
        </nav>
      )}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}
