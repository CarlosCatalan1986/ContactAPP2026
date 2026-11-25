import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
const ENTITIES = [{ id: 'items', label: 'Item', amount: null }]

export default function App() {
  const [tab, setTab] = useState(ENTITIES[0])
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ nombre: '', descripcion: '', amount: '' })
  const [error, setError] = useState('')

  const load = () => fetch(`${API}/api/${tab.id}`).then((r) => r.json()).then(setItems).catch(() => setError('Backend no disponible'))
  useEffect(() => { load() }, [tab]) // eslint-disable-line

  const create = async (e) => {
    e.preventDefault()
    const body = { nombre: form.nombre, descripcion: form.descripcion }
    if (tab.amount) body[tab.amount] = Number(form.amount || 0)
    const r = await fetch(`${API}/api/${tab.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (!r.ok) { setError('Datos inválidos'); return }
    setForm({ nombre: '', descripcion: '', amount: '' }); setError(''); load()
  }

  return (
    <main style={{ fontFamily: 'system-ui', maxWidth: 820, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>App ContactAPP</h1>
      <nav style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {ENTITIES.map((e) => (
          <button key={e.id} onClick={() => setTab(e)} style={{ fontWeight: tab.id === e.id ? 700 : 400 }}>{e.label}</button>
        ))}
      </nav>
      <form onSubmit={create} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <input required placeholder="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} />
        <input placeholder="Descripción" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
        {tab.amount && <input type="number" min="0" step="0.01" placeholder={tab.amount} value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })} />}
        <button>Crear {tab.label}</button>
      </form>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <table width="100%" cellPadding="6" style={{ borderCollapse: 'collapse' }}>
        <thead><tr><th align="left">ID</th><th align="left">Nombre</th>{tab.amount && <th align="right">{tab.amount}</th>}<th>Estado</th></tr></thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.id} style={{ borderTop: '1px solid #ddd' }}>
              <td>{it.id}</td><td>{it.nombre}</td>{tab.amount && <td align="right">{it[tab.amount]}</td>}<td>{it.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
