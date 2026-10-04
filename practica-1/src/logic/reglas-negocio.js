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

 //closure
 const crearContador = () => {
  let totalFacturado = 0; 

  return {
    registrarVenta: (monto) => {
      totalFacturado += monto;
      return totalFacturado;
    },
    obtenerTotal: () => totalFacturado
  };
};

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

//Funciones para logica del menu

// 1. Buscar producto
export function buscarProductoPorTermino(catalog, busqueda) {
  if (!busqueda) return null;
  const termino = busqueda.toLowerCase();
  
  return catalog.find(
    (item) => item.id === busqueda || item.title.toLowerCase().indexOf(termino) !== -1
  ) ?? null;
}

// 2. Procesar una venta 
export function procesarVenta(catalog, idVenta, cantidad, contadorSesion) {
  const productoAjustado = aplicarAjustePorEstado(catalog, idVenta);
  
  if (!productoAjustado || cantidad !== cantidad || cantidad <= 0 || cantidad > productoAjustado.stock) {
    return null;
  }

  const productoConDescuento = aplicarDescuento([productoAjustado], idVenta, cantidad);
  const precioUnitarioFinal = productoConDescuento.basePrice;
  const totalVenta = precioUnitarioFinal * cantidad;

  contadorSesion.registrarVenta(totalVenta);

  const nuevoCatalogo = catalog.map((p) => {
    if (p.id === idVenta) {
      return { ...p, stock: p.stock - cantidad };
    }
    return p;
  });

  const productoActualizado = nuevoCatalogo.find((p) => p.id === idVenta);

  return {
    nuevoCatalogo: nuevoCatalogo,
    precioUnitarioFinal: precioUnitarioFinal,
    totalVenta: totalVenta,
    nuevoStock: productoActualizado.stock
  };
}
// 3. Reposición de stock
export function procesarReposicion(catalog, idReponer, cantidad) {
  const producto = catalog.find((p) => p.id === idReponer);

  if (!producto || cantidad !== cantidad || cantidad <= 0) {
    return null;
  }

  const nuevoCatalogo = catalog.map((p) => {
    if (p.id === idReponer) {
      return { ...p, stock: p.stock + cantidad };
    }
    return p;
  });

  const productoActualizado = nuevoCatalogo.find((p) => p.id === idReponer);

  return {
    nuevoCatalogo: nuevoCatalogo,
    titulo: productoActualizado.title,
    nuevoStock: productoActualizado.stock
  };
}

// 4. Calcular datos
export function obtenerDatosInforme(catalog, contadorSesion) {
  const totalFacturado = contadorSesion.obtenerTotal();

  const valorTotalStock = catalog.reduce((acumulador, prod) => {
    return acumulador + prod.basePrice * prod.stock;
  }, 0);

  let hayStockBajo = false;
  for (let i = 0; i < catalog.length; i++) {
    if (esStockBajo(catalog[i].stock)) {
      hayStockBajo = true;
      break;
    }
  }

  return {
    totalFacturado: totalFacturado,
    valorTotalStock: valorTotalStock,
    hayStockBajo: hayStockBajo
  };
}
