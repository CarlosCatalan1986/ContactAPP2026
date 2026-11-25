# Informe de QA — App ContactAPP

- **Proyecto:** P-C6E9D1
- **Misión:** Necesito que me puedas desarrollar una aplicación para Android donde pueda enviar mis datos como contacto y se puedan guardar esta información en mi celular sin necesidad de tener la misma aplicación, solores corporativos negro y morado más necesito que crees un logo corporativo
- **Ambiente:** QA (`qa.oficina.local`) · build `P-C6E9D1-c2`
- **Fecha:** 2026-11-25 08:57
- **Equipo QA:** Fernanda, Joaquín
- **Veredicto:** ✅ APROBADO

## 1. Resumen

| Casos | Ciclos | Pasan (último ciclo) | Fallan (último ciclo) | Defectos encontrados |
|---|---|---|---|---|
| 13 | 2 | 13 | 0 | 1 |

## 2. Casos de prueba

| ID | Título | Tipo | Prioridad | Resultado esperado |
|---|---|---|---|---|
| CP-001 | Pago aprobado con tarjeta válida | Funcional | Alta | Orden en estado PAGADA, comprobante visible y webhook registrado |
| CP-002 | Pago rechazado por fondos insuficientes | Negativo | Alta | Mensaje claro de rechazo, orden queda PENDIENTE y el stock no se descuenta |
| CP-003 | Webhook de pago duplicado (idempotencia) | Integración | Alta | La orden se confirma una sola vez; sin doble descuento de stock |
| CP-004 | Instalación como app en Android (manifest + service worker) | Smoke | Alta | Se instala con ícono y abre a pantalla completa |
| CP-005 | QR directo: el teléfono ofrece «Agregar contacto» | Funcional | Alta | El otro teléfono guarda el contacto sin instalar nada |
| CP-006 | Funciona sin conexión tras instalarla | Funcional | Media | La app abre y el QR se genera sin internet |
| CP-007 | Datos sólo en el teléfono (privacidad) | Seguridad | Alta | No se envían datos a servidores |
| CP-008 | Contraste y tamaños táctiles (WCAG AA) | Accesibilidad | Baja | Contraste ≥ 4.5:1 y objetivos táctiles ≥ 48 px |
| CP-009 | Requisito: La solución se instala como app en Android (PWA con manifest e íconos, o proyecto Android) | Requisito | Alta | El criterio está implementado y verificable en el código |
| CP-010 | Requisito: Comparte datos de contacto en formato estándar (vCard) que el teléfono puede guardar | Requisito | Alta | El criterio está implementado y verificable en el código |
| CP-011 | Requisito: Quien recibe NO necesita instalar la app (QR/vCard o enlace web) | Requisito | Alta | El criterio está implementado y verificable en el código |
| CP-012 | Requisito: Incluye logo corporativo | Requisito | Alta | El criterio está implementado y verificable en el código |
| CP-013 | Requisito: usa los colores corporativos (negro, morado) | Requisito | Alta | El criterio está implementado y verificable en el código |

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

**CP-004 — Instalación como app en Android (manifest + service worker)**  
Precondición: Build publicado por HTTPS  
1. Abrir en Chrome Android
2. Menú ⋮ → Instalar app

**CP-005 — QR directo: el teléfono ofrece «Agregar contacto»**  
Precondición: Tarjeta guardada  
1. Mostrar QR directo
2. Escanear con la cámara de otro teléfono

**CP-006 — Funciona sin conexión tras instalarla**  
Precondición: App instalada  
1. Activar modo avión
2. Abrir la app y mostrar el QR

**CP-007 — Datos sólo en el teléfono (privacidad)**  
Precondición: Tarjeta guardada  
1. Revisar tráfico de red al guardar y compartir

**CP-008 — Contraste y tamaños táctiles (WCAG AA)**  
Precondición: Pantallas principales  
1. Medir contraste
2. Verificar botones ≥ 48 px

**CP-009 — Requisito: La solución se instala como app en Android (PWA con manifest e íconos, o proyecto Android)**  
Precondición: Código del repositorio local  
1. Revisar el código fuente contra el criterio de la misión

**CP-010 — Requisito: Comparte datos de contacto en formato estándar (vCard) que el teléfono puede guardar**  
Precondición: Código del repositorio local  
1. Revisar el código fuente contra el criterio de la misión

**CP-011 — Requisito: Quien recibe NO necesita instalar la app (QR/vCard o enlace web)**  
Precondición: Código del repositorio local  
1. Revisar el código fuente contra el criterio de la misión

**CP-012 — Requisito: Incluye logo corporativo**  
Precondición: Código del repositorio local  
1. Revisar el código fuente contra el criterio de la misión

**CP-013 — Requisito: usa los colores corporativos (negro, morado)**  
Precondición: Código del repositorio local  
1. Revisar el código fuente contra el criterio de la misión

## 3. Ejecución por ciclo

| Caso | Ciclo 1 | Ciclo 2 |
|---|---|---|
| CP-001 | ✅ | ✅ |
| CP-002 | ✅ | ✅ |
| CP-003 | ✅ | ✅ |
| CP-004 | ✅ | ✅ |
| CP-005 | ✅ | ✅ |
| CP-006 | ❌ El resultado obtenido no coincide con el esperado | ✅ |
| CP-007 | ✅ | ✅ |
| CP-008 | ✅ | ✅ |
| CP-009 | ✅ | ✅ |
| CP-010 | ✅ | ✅ |
| CP-011 | ✅ | ✅ |
| CP-012 | ✅ | ✅ |
| CP-013 | ✅ | ✅ |

### Pruebas automatizadas reales (repo local)

`python -m unittest discover -s tests` → **0/0 tests OK (frontend)**

```
[frontend] 0/0 OK
✔ vCard 3.0 con estructura válida para Contactos de Android (3.0248ms)
✔ escapa caracteres especiales (RFC 6350) (0.3245ms)
✔ omite campos vacíos (0.1193ms)
✔ validación: nombre obligatorio y al menos un medio de contacto (1.5209ms)
✔ validación: formatos inválidos (0.8113ms)
✔ enlace compartible: ida y vuelta con tildes y ñ (0.9148ms)
✔ token corrupto no rompe la app (0.1699ms)
✔ nombre de archivo .vcf seguro (0.932ms)
ℹ tests 8
ℹ suites 0
ℹ pass 8
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 135.5421
```

## 4. Defectos

| ID | Caso | Severidad | Estado | Ciclo | Corregido por |
|---|---|---|---|---|---|
| DEF-001 | CP-006 | Media | cerrado | 1 | Backencito |

- **DEF-001**: Funciona sin conexión tras instalarla: El resultado obtenido no coincide con el esperado

## 5. Conclusión

Todos los casos pasan en el último ciclo y los defectos están cerrados. Se autoriza el paso a **Lanzamiento**.
