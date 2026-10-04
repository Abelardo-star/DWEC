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

 function esStockBajo(stock) {
  return stock < Stock_bajo;
}

//funcion para modificar el estado del producto

function aplicarAjustePorEstado(idBuscar) {
  if (idBuscar === undefined) {
    idBuscar = null;
  }

  if (idBuscar !== null) {
    var juegoEncontrado = null;

    for (var i = 0; i < catalog.length; i++) {
      if (catalog[i].id === idBuscar) {
        juegoEncontrado = catalog[i];
        break;
      }
    }

    if (juegoEncontrado !== null) {
      var multiplicadorEstado = Estado_producto[juegoEncontrado.status];
      juegoEncontrado.basePrice = juegoEncontrado.basePrice * multiplicadorEstado;
    }

    return juegoEncontrado;
  }

  for (var j = 0; j < catalog.length; j++) {
    var elemento = catalog[j];
    var factor = Estado_producto[elemento.status];
    elemento.basePrice = elemento.basePrice * factor;
  }

  return catalog;
}

//funcion para aplicarle el descuento

