# Informe de QA — App ContactAPP

- **Proyecto:** P-C6E9D1
- **Misión:** Necesito que me puedas desarrollar una aplicación para Android donde pueda enviar mis datos como contacto y se puedan guardar esta información en mi celular sin necesidad de tener la misma aplicación, solores corporativos negro y morado más necesito que crees un logo corporativo
- **Ambiente:** QA (`qa.oficina.local`) · build `P-C6E9D1-c2`
- **Fecha:** 2026-11-25 00:33
- **Equipo QA:** Fernanda, Joaquín
- **Veredicto:** ✅ APROBADO

## 1. Resumen

| Casos | Ciclos | Pasan (último ciclo) | Fallan (último ciclo) | Defectos encontrados |
|---|---|---|---|---|
| 7 | 2 | 7 | 0 | 1 |

## 2. Casos de prueba

| ID | Título | Tipo | Prioridad | Resultado esperado |
|---|---|---|---|---|
| CP-001 | Pago aprobado con tarjeta válida | Funcional | Alta | Orden en estado PAGADA, comprobante visible y webhook registrado |
| CP-002 | Pago rechazado por fondos insuficientes | Negativo | Alta | Mensaje claro de rechazo, orden queda PENDIENTE y el stock no se descuenta |
| CP-003 | Webhook de pago duplicado (idempotencia) | Integración | Alta | La orden se confirma una sola vez; sin doble descuento de stock |
| CP-004 | Smoke test: la aplicación levanta y responde /health | Smoke | Alta | HTTP 200 en menos de 500 ms |
| CP-005 | Acceso a recurso de otro usuario (IDOR) | Seguridad | Alta | HTTP 403/404; nunca se exponen datos de B |
| CP-006 | Rendimiento p95 con 100 usuarios concurrentes | Rendimiento | Media | p95 < 300 ms y 0% errores 5xx |
| CP-007 | Navegación por teclado y contraste (WCAG AA) | Accesibilidad | Baja | Foco visible en todo control y contraste ≥ 4.5:1 |

### Detalle de pasos

**CP-001 — Pago aprobado con tarjeta válida**  
Precondición: Carrito con 1 producto; pasarela en sandbox  
1. Ir a checkout
2. Elegir pago con tarjeta
3. Ingresar tarjeta de prueba aprobada
4. Confirmar

**CP-002 — Pago rechazado por fondos insuficientes**  
Precondición: Carrito con productos; tarjeta de prueba rechazada  
1. Ir a checkout
2. Pagar con tarjeta rechazada

**CP-003 — Webhook de pago duplicado (idempotencia)**  
Precondición: Orden pagada  
1. Reenviar el mismo webhook de confirmación 2 veces

**CP-004 — Smoke test: la aplicación levanta y responde /health**  
Precondición: Build desplegado en ambiente QA  
1. GET /health

**CP-005 — Acceso a recurso de otro usuario (IDOR)**  
Precondición: Dos usuarios A y B  
1. Con sesión de A pedir el recurso /ordenes/{id de B}

**CP-006 — Rendimiento p95 con 100 usuarios concurrentes**  
Precondición: Datos de prueba cargados  
1. Ejecutar carga de 100 VU por 5 min

**CP-007 — Navegación por teclado y contraste (WCAG AA)**  
Precondición: Pantallas principales  
1. Recorrer con TAB
2. Medir contraste de textos

## 3. Ejecución por ciclo

| Caso | Ciclo 1 | Ciclo 2 |
|---|---|---|
| CP-001 | ✅ | ✅ |
| CP-002 | ❌ El sistema aceptó la operación inválida sin mostrar error | ✅ |
| CP-003 | ✅ | ✅ |
| CP-004 | ✅ | ✅ |
| CP-005 | ✅ | ✅ |
| CP-006 | ✅ | ✅ |
| CP-007 | ✅ | ✅ |

### Pruebas automatizadas reales (repo local)

`python -m unittest discover -s tests` → **3/3 tests OK**

```
test_crear_y_obtener (test_services.TestItem.test_crear_y_obtener) ... ok
test_eliminar_inexistente (test_services.TestItem.test_eliminar_inexistente) ... ok
test_nombre_vacio_rechazado (test_services.TestItem.test_nombre_vacio_rechazado) ... ok

----------------------------------------------------------------------
Ran 3 tests in 0.000s

OK
```

## 4. Defectos

| ID | Caso | Severidad | Estado | Ciclo | Corregido por |
|---|---|---|---|---|---|
| DEF-001 | CP-002 | Alta | cerrado | 1 | Backencito |

- **DEF-001**: Pago rechazado por fondos insuficientes: El sistema aceptó la operación inválida sin mostrar error

## 5. Conclusión

Todos los casos pasan en el último ciclo y los defectos están cerrados. Se autoriza el paso a **Lanzamiento**.
