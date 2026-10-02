## Modelo de Datos

Cada producto del catálogo es un objeto con estas 7 propiedades:

- **`id`** (`string`): Un código único para buscar el juego sin equivocarnos (ej: `'GAME-001'`).
- **`title`** (`string`): El nombre del juego (ej: `'Chrono Trigger'`).
- **`platform`** (`string`): La consola donde se juega (ej: `'SNES'`).
- **`category`** (`string`): El género para poder filtrar (ej: `'RPG'`, `'Lucha'`).
- **`basePrice`** (`number`): El precio de partida en euros antes de los descuentos.
- **`status`** (`string`): El estado del producto. Usa exactamente uno de los 4 textos que pide el enunciado: `'nuevo-precintado'`, `'usado-como-nuevo'`, `'usado-caja-danada'` o `'solo-cartucho'`.
- **`stock`** (`number`): La cantidad de unidades que quedan a la venta.