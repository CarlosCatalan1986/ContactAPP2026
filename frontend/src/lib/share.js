// Acciones del navegador: descargar/compartir .vcf (Android abre la app Contactos para guardarlo).
import { buildVCard, vcfFileName } from './vcard.js'

export function vcfBlob(card) {
  return new Blob([buildVCard(card)], { type: 'text/vcard;charset=utf-8' })
}

export function downloadVcf(card) {
  const url = URL.createObjectURL(vcfBlob(card))
  const a = Object.assign(document.createElement('a'), { href: url, download: vcfFileName(card) })
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

/** Comparte el .vcf con la hoja nativa de Android (WhatsApp, correo, Bluetooth…). */
export async function shareVcf(card) {
  const file = new File([vcfBlob(card)], vcfFileName(card), { type: 'text/vcard' })
  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file], title: 'Mi contacto' })
    return true
  }
  return false
}

export async function shareLink(url, title) {
  if (navigator.share) {
    await navigator.share({ url, title })
    return 'shared'
  }
  await navigator.clipboard.writeText(url)
  return 'copied'
}
