# Imagen del backend (Render runtime: docker, o cualquier nube con contenedores)
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# REQS=requirements.txt para incluir CrewAI
ARG REQS=requirements-sim.txt
COPY requirements*.txt ./
RUN pip install -r "$REQS"

COPY . .
RUN useradd --create-home appuser && chown -R appuser /app
USER appuser

EXPOSE 10000
HEALTHCHECK --interval=30s --timeout=5s CMD python -c "import urllib.request,os;urllib.request.urlopen(f'http://127.0.0.1:{os.getenv(\"PORT\",\"10000\")}/api/health')"
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-10000}"]
