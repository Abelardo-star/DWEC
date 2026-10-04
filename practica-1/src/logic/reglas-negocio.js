//TABLA A
const Estado_producto = {
    'nuevo-precintado' : 0.25,
    'usado-como-nuevo' : 0.00,
    'usado-caja-danada' : -0.15,
    'solo-cartucho' : -0.30
}
//TABLA B
function obtenerDescuento(cantidad){
    if (cantidad >= 4) return 0.10;
    if (cantidad >= 2) return 0.05;
    return 0.00;
}

//TABLA C
 const Stock_bajo = 3;

 const esStockBajo = (stock) => stock < Stock_bajo;

// Función para modificar el precio según el estado del producto
function aplicarAjustePorEstado(catalog, idBuscar = null) {
  if (idBuscar !== null) {
    let juegoEncontrado = null;

    for (let i = 0; i < catalog.length; i++) {
      if (catalog[i].id === idBuscar) {
        juegoEncontrado = catalog[i];
        break;
      }
    }

    if (juegoEncontrado !== null) {
      const ajuste = Estado_producto[juegoEncontrado.status] ?? 0;
      return { ...juegoEncontrado,  basePrice: juegoEncontrado.basePrice * (1 + ajuste)};
    }

    return null;
  }

  const catalogoActualizado = new Array(catalog.length);
  for (let j = 0; j < catalog.length; j++) {
    const elemento = catalog[j];
    const factor = Estado_producto[elemento.status] ?? 0;
    
    catalogoActualizado[j] = { ...elemento,   basePrice: elemento.basePrice * (1 + factor)};
  }

  return catalogoActualizado;
}
// Función para aplicar el descuento por stock
function aplicarDescuento(catalog, idBuscar = null) {
  if (idBuscar !== null) {
    let juego = null;

    for (let k = 0; k < catalog.length; k++) {
      if (catalog[k].id === idBuscar) {
        juego = catalog[k];
        break;
      }
    }

    if (juego !== null) {
      const porcentajeDescuento = obtenerDescuento(juego.stock);
      
      return {...juego,basePrice: juego.basePrice * (1 - porcentajeDescuento)};
    }

    return null;
  }

  const catalogoActualizado = new Array(catalog.length);

  for (let m = 0; m < catalog.length; m++) {
    const item = catalog[m];
    const descuentoAplicar = obtenerDescuento(item.stock);

    catalogoActualizado[m] = {  ...item, basePrice: item.basePrice * (1 - descuentoAplicar)};
  }

  return catalogoActualizado;
}

