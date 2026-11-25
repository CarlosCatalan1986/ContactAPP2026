"""Modelos de dominio (Pydantic)."""
from typing import Optional

from pydantic import BaseModel, Field

class ItemIn(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=120)
    descripcion: str = Field("", max_length=1000)
    estado: str = "activo"


class Item(ItemIn):
    id: int
