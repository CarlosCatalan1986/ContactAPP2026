// Pruebas automatizadas (Node 18+, sin dependencias): `npm test` o `node --test tests/`
import test from 'node:test'
import assert from 'node:assert/strict'
import { buildVCard, decodeCard, encodeCard, escapeV, validate, vcfFileName } from '../src/lib/vcard.js'

const card = {
  nombre: 'Carlos', apellido: 'Catalán', empresa: 'ACL', cargo: 'Gerente',
  telefono: '+56 9 1234 5678', email: 'carlos@ejemplo.cl', web: 'ejemplo.cl',
  direccion: 'Av. Siempre Viva 742, Santiago', nota: 'Hola; nos vemos',
}

test('vCard 3.0 con estructura válida para Contactos de Android', () => {
  const v = buildVCard(card)
  assert.ok(v.startsWith('BEGIN:VCARD\r\nVERSION:3.0'))
  assert.ok(v.endsWith('END:VCARD'))
  assert.match(v, /\r\nN:Catalán;Carlos;;;\r\n/)
  assert.match(v, /\r\nFN:Carlos Catalán\r\n/)
  assert.match(v, /TEL;TYPE=CELL:\+56912345678/)
  assert.match(v, /EMAIL;TYPE=INTERNET:carlos@ejemplo\.cl/)
  assert.match(v, /URL:https:\/\/ejemplo\.cl/)
})

test('escapa caracteres especiales (RFC 6350)', () => {
  assert.equal(escapeV('a;b,c\\d\ne'), 'a\\;b\\,c\\\\d\\ne')
  assert.match(buildVCard(card), /ADR;TYPE=WORK:;;Av. Siempre Viva 742\\, Santiago;;;;/)
  assert.match(buildVCard(card), /NOTE:Hola\\; nos vemos/)
})

test('omite campos vacíos', () => {
  const v = buildVCard({ nombre: 'Ana', telefono: '123456789' })
  assert.ok(!v.includes('ORG:'))
  assert.ok(!v.includes('EMAIL'))
})

test('validación: nombre obligatorio y al menos un medio de contacto', () => {
  assert.ok(validate({}).nombre)
  assert.ok(validate({ nombre: 'Ana' }).telefono)
  assert.deepEqual(validate({ nombre: 'Ana', email: 'ana@x.cl' }), {})
})

test('validación: formatos inválidos', () => {
  assert.ok(validate({ nombre: 'A', email: 'malo@' }).email)
  assert.ok(validate({ nombre: 'A', telefono: 'abc' }).telefono)
  assert.ok(validate({ nombre: 'A', email: 'a@b.cl', web: 'no es web' }).web)
})

test('enlace compartible: ida y vuelta con tildes y ñ', () => {
  const token = encodeCard({ ...card, nombre: 'Íñigo' })
  assert.match(token, /^[A-Za-z0-9_-]+$/)
  const back = decodeCard(token)
  assert.equal(back.nombre, 'Íñigo')
  assert.equal(back.email, card.email)
})

test('token corrupto no rompe la app', () => {
  assert.equal(decodeCard('%%%'), null)
})

test('nombre de archivo .vcf seguro', () => {
  assert.equal(vcfFileName(card), 'carlos-catalan.vcf')
  assert.equal(vcfFileName({}), 'contacto.vcf')
})
