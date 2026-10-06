import {
  esStockBajo,
  crearContador,
  buscarProductoPorTermino,
  procesarVenta,
  procesarReposicion,
  obtenerDatosInforme
} from './logic.js';

export function menuPrincipal(catalog = []) {
  let catalogoActual = [...catalog];
  const contadorSesion = crearContador();

  let opcion;

  do {
    console.log("=== RETROSTOCK: MENÚ PRINCIPAL ===");
    console.log("1. Ver Catálogo");
    console.log("2. Buscar Producto");
    console.log("3. Registrar una Venta");
    console.log("4. Reponer Stock");
    console.log("5. Informe de Caja");
    console.log("6. Salir");

    opcion = Number(prompt("Introduzca una opción (1-6): "));
  }
}
