# Despliegue — app-contactapp

Destino elegido: **Gratis · Vercel (frontend) + Render (backend)**

## 1. Backend en Render (Web Service Python · plan free)
1. Sube el repo a GitHub (`render.yaml` en la raíz).
2. Render → **New → Blueprint** → elige el repo → **Apply**. Crea `app-contactapp-api`.
3. En *Environment* completa `LLM_API_KEY` sólo si usarás un LLM (opcional).
4. Verifica: `https://app-contactapp-api.onrender.com/api/health` → `{"ok": true, ...}`

> Plan free: se duerme tras 15 min sin tráfico (≈1 min en despertar) y el disco es efímero:
> `data/*.json` (agentes, proyectos, memoria) se reinicia en cada deploy/reinicio.
> Para persistir usa un plan pago con Persistent Disk o una base de datos.

## 2. Frontend en Vercel (Hobby)
1. Vercel → **Add New → Project** → importa el repo.
2. **Root Directory:** `frontend` (Vercel detecta Vite y usa `frontend/vercel.json`).
3. **Environment Variables:** `VITE_BACKEND_URL = https://app-contactapp-api.onrender.com` (Production y Preview).
4. Deploy → `https://app-contactapp.vercel.app`

## 3. Conectar ambos
- El frontend usa `VITE_BACKEND_URL` para REST y deriva el WebSocket: `wss://app-contactapp-api.onrender.com/ws/office`
- El backend acepta el origen vía `CORS_ORIGINS=https://app-contactapp.vercel.app` y previews con `CORS_ORIGIN_REGEX` (ya en `render.yaml`).
- Si Vercel te asigna otro dominio, actualiza `CORS_ORIGINS` en Render y redeploya.

## 4. CI/CD (GitHub Actions)
`.github/workflows/ci.yml`: smoke test del backend + build del frontend en cada push/PR.
Opcional: secret `RENDER_DEPLOY_HOOK` para disparar el deploy desde el pipeline.

## Archivos generados
| Archivo | Para qué |
|---|---|
| `render.yaml` | Blueprint del backend en Render (free) |
| `backend/Dockerfile` | Imagen del backend (alternativa `runtime: docker` u otra nube) |
| `backend/.dockerignore` | Excluye venv, datos y secretos de la imagen |
| `frontend/vercel.json` | Build Vite + SPA rewrites + caché de assets |
| `frontend/.env.production.example` | `VITE_BACKEND_URL` apuntando a Render |
| `.github/workflows/ci.yml` | Pipeline CI/CD |
