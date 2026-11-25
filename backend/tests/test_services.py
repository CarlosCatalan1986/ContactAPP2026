"""Pruebas automatizadas de dominio (unittest, sin dependencias extra).

Ejecutar:  cd backend && python -m unittest discover -s tests -v
"""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from pydantic import ValidationError  # noqa: E402

from app import services  # noqa: E402
from app.models import ItemIn  # noqa: E402


class TestItem(unittest.TestCase):
    def setUp(self):
        services.items.items.clear()

    def test_crear_y_obtener(self):
        obj = services.items.create(ItemIn(nombre="Demo"))
        self.assertEqual(services.items.get(obj.id).nombre, "Demo")

    def test_nombre_vacio_rechazado(self):
        with self.assertRaises(ValidationError):
            ItemIn(nombre="")

    def test_eliminar_inexistente(self):
        with self.assertRaises(services.NotFound):
            services.items.delete(999)


if __name__ == "__main__":
    unittest.main()
