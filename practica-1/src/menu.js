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

