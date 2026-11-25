# App ContactAPP

> Proyecto **P-C6E9D1** generado por la Oficina Virtual Multi-Agente.
> Misión: Necesito que me puedas desarrollar una aplicación para Android donde pueda enviar mis datos como contacto y se puedan guardar esta información en mi celular sin necesidad de tener la misma aplicación, solores corporativos negro y morado más necesito que crees un logo corporativo

Entidades del dominio: **Item**.

## Estructura
```
backend/   FastAPI + servicios de dominio + tests (unittest)
frontend/  React + Vite (consume VITE_BACKEND_URL)
docs/      arquitectura, plan, seguridad e informe de QA
```

## Ejecutar en local
```bash
# Backend
cd backend && python -m venv .venv && . .venv/Scripts/activate   # Linux/macOS: . .venv/bin/activate
pip install -r requirements.txt
python -m unittest discover -s tests -v
uvicorn main:app --reload --port 8000

# Frontend
cd frontend && npm install && npm run dev
```

## Flujo
Análisis → Desarrollo (rama `develop`) → QA → aprobación del responsable → merge a `main` + tag → push.
