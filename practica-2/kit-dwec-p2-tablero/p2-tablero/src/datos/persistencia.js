// persistencia.js — Bloque C · ✍️ C5 y C6. Guardar el tablero tras cada cambio y recuperarlo al abrir la página.
// Usa guardar, cargar y borrar (almacen.js, resuelto), tu obtenerJSON (red.js) y Tablero.desdeJSON.
import { Tablero } from "../modelo/Tablero.js";
import { borrar, cargar, guardar } from "./almacen.js";
import { obtenerJSON } from "./red.js";

export const CLAVE = "dwec-p2-tablero";

// ✍️ C5 · guardarTablero(tablero, storage = localStorage): guarda el tablero en CLAVE
export function guardarTablero(tablero, storage = localStorage) {
  // Guarda el tablero en CLAVE. guardar()
  guardar(CLAVE, tablero, storage);
}

// ✍️ C6 · async arrancar({ storage = localStorage, fetchFn = fetch, url = "/tareas-iniciales.json",
//                  limiteEnCurso = 3 } = {}) → { tablero, origen, error? }
//   Los tres casos («guardado», «inicial» y «vacio») están en el enunciado (bloque C).
export async function arrancar({
  storage = localStorage,
  fetchFn = fetch,
  url = "/tareas-iniciales.json",
  limiteEnCurso = 3,
} = {}) {
  // Buscamos si hay algo guardado. Si está vacío o el JSON está roto, devuelve null.
  const guardado = cargar(CLAVE, null, storage);

  // Si había algo guardado, intentamos reconstruir el tablero con su versión e ids.
  if (guardado !== null) {
    try {
      const tablero = Tablero.desdeJSON(guardado);
      return { tablero, origen: "guardado" };
    } catch {
      // Si es JSON pero de otra versión o no válido, lo borramos y bajamos la CLAVE.
      borrar(CLAVE, storage);
    }
  }

  // Si no había datos guardados o se borraron, pedimos las tareas iniciales.
  try {
    //el await va dentro del try, si la promesa se rechaza lo recoge el catch
    const datos = await obtenerJSON(url, fetchFn);
    const tablero = Tablero.desde(datos, limiteEnCurso);
    return { tablero, origen: "inicial" };
  } catch (error) {
    // Si falla la red, el servidor o el JSON, devolvemos un tablero vacío sin lanzar error.
    return {
      tablero: new Tablero(limiteEnCurso),
      origen: "vacio",
      error: error.message,
    };
  }
}

//(void Tablero, borrar, cargar, guardar, obtenerJSON); // (borra esta línea cuando los uses)
