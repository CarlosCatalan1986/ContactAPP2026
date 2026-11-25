// Lógica pura de la tarjeta de contacto (sin DOM): vCard 3.0, validación y enlace compartible.
// Probada con `node --test` (tests/vcard.test.js).

export const FIELDS = ['nombre', 'apellido', 'empresa', 'cargo', 'telefono', 'email', 'web', 'direccion', 'nota']

export const emptyCard = () => Object.fromEntries(FIELDS.map((f) => [f, '']))

/** Escapa texto según RFC 6350 (\\, coma, punto y coma, saltos de línea). */
export function escapeV(value = '') {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .trim()
}

const clean = (c) => Object.fromEntries(FIELDS.map((f) => [f, String(c?.[f] ?? '').trim()]))

export function fullName(c) {
  const x = clean(c)
  return [x.nombre, x.apellido].filter(Boolean).join(' ')
}

/** Genera la vCard 3.0 (compatible con la app Contactos de Android e iOS). */
export function buildVCard(card) {
  const c = clean(card)
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${escapeV(c.apellido)};${escapeV(c.nombre)};;;`,
    `FN:${escapeV(fullName(c))}`,
  ]
  if (c.empresa) lines.push(`ORG:${escapeV(c.empresa)}`)
  if (c.cargo) lines.push(`TITLE:${escapeV(c.cargo)}`)
  if (c.telefono) lines.push(`TEL;TYPE=CELL:${c.telefono.replace(/[^\d+]/g, '')}`)
  if (c.email) lines.push(`EMAIL;TYPE=INTERNET:${c.email}`)
  if (c.web) lines.push(`URL:${/^https?:\/\//i.test(c.web) ? c.web : `https://${c.web}`}`)
  if (c.direccion) lines.push(`ADR;TYPE=WORK:;;${escapeV(c.direccion)};;;;`)
  if (c.nota) lines.push(`NOTE:${escapeV(c.nota)}`)
  lines.push('END:VCARD')
  return lines.join('\r\n')
}

/** Valida la tarjeta. Devuelve { campo: mensaje } (vacío = válida). */
export function validate(card) {
  const c = clean(card)
  const e = {}
  if (!c.nombre) e.nombre = 'El nombre es obligatorio'
  if (c.nombre.length > 60) e.nombre = 'Máximo 60 caracteres'
  if (!c.telefono && !c.email) e.telefono = 'Ingresa al menos un teléfono o un email'
  if (c.telefono && !/^\+?[\d\s()-]{7,20}$/.test(c.telefono)) e.telefono = 'Teléfono inválido (ej. +56 9 1234 5678)'
  if (c.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email)) e.email = 'Email inválido'
  if (c.web && !/^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(c.web)) e.web = 'Sitio web inválido'
  return e
}

/** Nombre de archivo seguro para el .vcf */
export function vcfFileName(card) {
  const base = fullName(card)
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase()
  return `${base || 'contacto'}.vcf`
}

// --- Enlace compartible: los datos viajan en el #hash (nunca llegan a un servidor) ---
const toB64Url = (str) => {
  const bytes = new TextEncoder().encode(str)
  let bin = ''
  bytes.forEach((b) => { bin += String.fromCharCode(b) })
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
const fromB64Url = (s) => {
  const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4))
  return new TextDecoder().decode(Uint8Array.from(bin, (ch) => ch.charCodeAt(0)))
}

export function encodeCard(card) {
  const c = clean(card)
  const compact = Object.fromEntries(Object.entries(c).filter(([, v]) => v))
  return toB64Url(JSON.stringify(compact))
}

export function decodeCard(token) {
  try {
    const data = JSON.parse(fromB64Url(token))
    return { ...emptyCard(), ...clean(data) }
  } catch {
    return null
  }
}
