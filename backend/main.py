"""API de «App ContactAPP» — generada por el equipo de la Oficina Virtual."""
import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app import services
from app.models import Item, ItemIn

app = FastAPI(title="App ContactAPP", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173").split(","),
    allow_methods=["*"], allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"ok": True}


@app.get("/api/items", response_model=list[Item])
def listar_items():
    return services.items.list()


@app.post("/api/items", response_model=Item, status_code=201)
def crear_items(body: ItemIn):
    return services.items.create(body)


@app.get("/api/items/{item_id}", response_model=Item)
def obtener_items(item_id: int):
    try:
        return services.items.get(item_id)
    except services.NotFound:
        raise HTTPException(404, "Item no encontrado")


@app.put("/api/items/{item_id}", response_model=Item)
def actualizar_items(item_id: int, body: ItemIn):
    try:
        return services.items.update(item_id, body)
    except services.NotFound:
        raise HTTPException(404, "Item no encontrado")


@app.delete("/api/items/{item_id}", status_code=204)
def eliminar_items(item_id: int):
    try:
        services.items.delete(item_id)
    except services.NotFound:
        raise HTTPException(404, "Item no encontrado")
