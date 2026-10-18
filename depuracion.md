# 🐞 Bloque D · Mi informe de depuración

Rellena una ficha por bug. Sustituye cada `____` por lo que hayas visto TÚ en las DevTools.
Ejemplo de cómo se escribe una variable vista en el panel «Ámbito» (Scope): `i = 1`, `texto = "3"`.

## 👀 Ejemplo (ya resuelto) · Total del ticket

- **Síntoma:** sale 85 € y debería salir 105 €.
- **Breakpoint en:** `caja.js:17` (la línea `const linea = lineas[i];`)
- **Lo que vi:** en la primera parada `i = 1` y `linea` es el Zelda: el Tetris (posición 0) no se suma nunca.
- **Por qué falla:** el bucle empieza en 1 y los arrays empiezan en 0.
- **Arreglo:** `for (let i = 0; ...)`.

## Bug 1 · Añadir unidades

- **Síntoma:** Al sumar 3 unidades a las 2 que ya hay de Zelda, aparece 23 en lugar de 5.
- **Breakpoint en:** caja.js, en la línea const nuevas = actuales + textoDelUsuario;, dentro de sumarUnidades.
- **Lo que vi:** actuales = 2 y textoDelUsuario = 3. Después de ejecutar la línea, nuevas = 23.
- **Por qué falla:** El texto que se introduce es una cadena de texto y el + suma las cadenas en vez de sumar los numeros
- **Arreglo:** Se convierte el texto a numero antes de sumarlo y si se cancela o se introduce algo no valido , se quedan las unidades anteriores

## Bug 2 · Stock de cada producto

- **Síntoma:**  Sonic 2 aparece con «sin datos» aunque su stock es 0.
- **Breakpoint en:**  caja.js, en la línea const stock = producto.stock || "sin datos";, dentro de stockTexto. Usé la condición producto.titulo === "Sonic 2".
- **Lo que vi:**  El producto era Sonic 2 y producto.stock = 0. Después de ejecutar la línea, stock = "sin datos".
- **Por qué falla:** El operador || ve el 0 como un valor falso y lo sustituye por «sin datos».
- **Arreglo:** Cambiar || por ??, para que aparezca «sin datos» solamente cuando el stock no esté definido.


## Bug 3 · Ordenar por precio

- **Síntoma:**  Al ordenar los productos por precio, también cambia el orden del catálogo original.
- **Breakpoint en:** caja.js, en la línea const ordenados = productos.sort((a, b) => a.precio - b.precio);, dentro de ordenarPorPrecio.
- **Lo que vi:**  productos === PRODUCTOS daba true y, después de ejecutar la línea, ordenados === productos también daba true.
- **Por qué falla:**  sort() ordena el propio array y modifica la lista original.
- **Arreglo:** Hacer una copia antes de ordenar con const ordenados = [...productos].sort((a, b) => a.precio - b.precio);.

## Bug 4 · Descuento por volumen

- **Síntoma:**  Al comprar 4 unidades de Crash Bandicoot, se aplica un descuento del 5 % en vez del 10 %.
- **Breakpoint en:** caja.js, en la condición if (unidades > 4), dentro de precioConDescuento. La condición del breakpoint era unidades === 4.
- **Lo que vi:** precio = 25, unidades = 4 y descuento = 0 antes de ejecutar la condición.
- **Por qué falla:** La condición unidades > 4 no se cumple cuando hay exactamente 4 unidades, así que el programa pasa al segundo if y aplica el 5 %.
- **Arreglo:**  Cambiar unidades > 4 por unidades >= 4, para que el descuento del 10 % se aplique desde las 4 unidades.
