# Despliegue — app-contactapp

App **100% cliente** (PWA): sólo se publica el frontend en **Vercel** (gratis). No hay backend.

1. Vercel → **Add New → Project** → importa este repo de GitHub.
2. **Root Directory: `frontend`** (preset Vite; usa `frontend/vercel.json`).
3. Deploy. No requiere variables de entorno ni backend.

URL prevista: `https://app-contactapp.vercel.app` (Vercel asigna otra si el nombre está tomado).
Para instalar en Android: abrir la URL en Chrome → ⋮ → **Instalar app**.

`.github/workflows/ci.yml` ejecuta `npm test` y `npm run build` en cada push.
