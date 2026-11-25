"""Servicios de dominio: repositorios en memoria con reglas de negocio."""
from __future__ import annotations

from itertools import count
from typing import Generic, Optional, TypeVar

from pydantic import BaseModel

from app.models import Item, ItemIn

T = TypeVar("T", bound=BaseModel)


class NotFound(Exception):
    pass


class Repo(Generic[T]):
    def __init__(self, model: type[T]):
        self.model = model
        self.items: dict[int, T] = {}
        self._ids = count(1)

    def create(self, data: BaseModel) -> T:
        obj = self.model(id=next(self._ids), **data.model_dump())
        self.items[obj.id] = obj
        return obj

    def list(self) -> list[T]:
        return list(self.items.values())

    def get(self, item_id: int) -> T:
        if item_id not in self.items:
            raise NotFound(item_id)
        return self.items[item_id]

    def update(self, item_id: int, data: BaseModel) -> T:
        self.get(item_id)
        obj = self.model(id=item_id, **data.model_dump())
        self.items[item_id] = obj
        return obj

    def delete(self, item_id: int) -> None:
        self.get(item_id)
        del self.items[item_id]


items = Repo(Item)
