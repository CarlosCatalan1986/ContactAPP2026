# ContactAPP

> Proyecto **P-C6E9D1** de la Oficina Virtual Multi-Agente.
> Misión: Necesito que me puedas desarrollar una aplicación para Android donde pueda enviar mis datos como contacto y se puedan guardar esta información en mi celular sin necesidad de tener la misma aplicación, solores corporativos negro y morado más necesito que crees un logo corporativo

App móvil instalable en Android (PWA) para **compartir tus datos de contacto con un QR**:

| Modo | Qué hace quien recibe |
|---|---|
| QR directo (vCard) | Escanea con la cámara → «Agregar contacto». Sin internet y **sin instalar nada**. |
| QR con enlace | Abre una página con tu tarjeta y el botón «Guardar en mis contactos» (.vcf). |
| Compartir .vcf | Envía el archivo por WhatsApp, correo o Bluetooth (hoja nativa de Android). |

Tus datos se guardan sólo en tu teléfono; el enlace lleva la tarjeta dentro de la URL (`#c=…`) y no pasa por ningún servidor.
Colores corporativos: morado, negro · Logo: `frontend/public/logo.svg`.

## Ejecutar
```bash
cd frontend
npm install
npm test        # pruebas de vCard, validaciones y enlace (node --test)
npm run dev     # http://localhost:5173
npm run build   # genera dist/ (estático)
```

## Instalar en Android
Abrir la URL publicada en Chrome → menú ⋮ → **Instalar app** / Agregar a la pantalla principal.

## Publicar gratis (Vercel)
Vercel → Add New Project → este repo → **Root Directory: `frontend`** (preset Vite). No requiere backend ni variables de entorno.
