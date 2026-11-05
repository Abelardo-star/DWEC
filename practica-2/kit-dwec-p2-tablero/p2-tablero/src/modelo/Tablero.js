// Tablero.js — Bloque A · ✍️ A3 (el tablero) y A5 (reglas).
// En el bloque C volverás aquí para ✍️ C4 (toJSON y desdeJSON).
// El tablero TIENE tres columnas: es composición, no hereda de nadie.
import { Columna } from "./Columna.js";
import { ColumnaLlenaError, MovimientoNoPermitidoError } from "./errores.js";
import { Tarea } from "./Tarea.js";
import { TareaRecurrente } from "./TareaRecurrente.js";
import { aDatos, desdeDatos } from "./serializar.js";

export class Tablero {
  static COLUMNAS = Object.freeze(["Por hacer", "En curso", "Hecho"]);
  static VERSION_DATOS = 1; // (bloque C) si algún día cambia el formato guardado, se sube
  // Privado: #columnas, un Map nombre → Columna
  #columnas

  // ✍️ A3 ──────────────────────────────────────────────────────────────────────
  constructor(limiteEnCurso = 3) {
    // Crea las tres columnas; solo «En curso» lleva límite WIP (limiteEnCurso)
    this.#columnas = new Map(
      Tablero.COLUMNAS.map((nombre) => [
        nombre, 
        nombre === "En curso" ? new Columna(nombre, limiteEnCurso) : new Columna(nombre),
      ])
    );
  }

  // static desde(datos, limiteEnCurso): un Tablero con una tarea por cada objeto de datos
  //   (usa crearTarea)
  static desde(datos, limiteEnCurso) {
    const tablero = new Tablero(limiteEnCurso);
    for (const d of datos) tablero.crearTarea(d);
    return tablero;
  }

  // columna(nombre): la Columna, o un Error si no existe (que el mensaje lleve el nombre)
  // get columnas: array con las tres columnas, en orden

  columna(nombre){
    const columna = this.#columnas.get(nombre);
    if(!columna) throw new Error(`No existe la columna: ${nombre}`);
    return columna;
  }

  get columnas(){
    return Tablero.COLUMNAS.map((nombre) => this.#columnas.get(nombre));
  }

  // crearTarea(datos): TareaRecurrente si datos trae cadaDias, Tarea si no → a «Por hacer»
  //   y la devuelve. datos es un objeto { titulo, prioridad, limite, cadaDias }: saca cada campo
  //   y pásaselo al constructor, en su orden (new Tarea(datos) NO vale: espera el título)
  crearTarea(datos){
     const { titulo, prioridad, limite, cadaDias } = datos;
     const tarea =
      cadaDias != null ? new TareaRecurrente(titulo, prioridad, limite, cadaDias): new Tarea(titulo, prioridad, limite);
     this.columna("Por hacer").añadir(tarea);
     return tarea;
  }
  // buscar(id): la tarea, esté en la columna que esté, o null
   buscar(id) {
    for (const columna of this.columnas) {
      const tarea = columna.tareas.find((t) => t.id === id);
      if (tarea) return tarea;
    }
    return null;
  }
  // dondeEsta(id): la Columna donde está, o null
  dondeEsta(id) {
    return this.columnas.find((c) => c.tiene(id)) ?? null;
  }

  // mover(id, destino): Error si no existe la tarea · Error si la columna destino está llena
  //   (¡comprueba ANTES de quitarla de su columna, o se perdería!) · la mueve y la devuelve
  mover(id, destino){
    return this.#trasladar(id, destino);
  }

  // completar(id): la mueve a «Hecho» y añade a «Por hacer» lo que devuelva tarea.alCompletar()
  //   ⚠️ Sin preguntar si es recurrente: eso es el polimorfismo
  completar(id){
    const tarea = this.#trasladar(id, "Hecho")
    const nuevas = [tarea.alCompletar()].flat().filter(Boolean);
    for (const nueva of nuevas) this.columna("Por hacer").añadir(nueva);
    return tarea;
  }

  // resumen(hoy = new Date()): { porHacer, enCurso, hecho, vencidas }
  //   vencidas = las que estaVencida(hoy) y NO están en «Hecho»
  resumen(hoy = new Date()) {
    let vencidas = 0;
    for (const columna of this.columnas) {
      if (columna.nombre === "Hecho") continue;
      for (const tarea of columna.tareas) {
        if (tarea.estaVencida(hoy)) vencidas++;
      }
    }
    return {
      porHacer: this.columna("Por hacer").tareas.length,
      enCurso: this.columna("En curso").tareas.length,
      hecho: this.columna("Hecho").tareas.length,
      vencidas,
    };
  }


  // ✍️ A5 · Reglas (vuelves a mover y completar) ─────────────────────────────────
  //   - Columna llena → ColumnaLlenaError (en vez de un Error cualquiera)
  //   - Sacar una tarea de «Hecho», o «moverla» a la columna en la que ya está →
  //     MovimientoNoPermitidoError. Todo se comprueba ANTES de tocar nada.
  //   Pista: mover y completar hacen casi lo mismo. Un método privado #trasladar(id, destino)
  //   con las comprobaciones evita escribirlas dos veces.
 #trasladar(id, destino) {
    const origen = this.dondeEsta(id);
    if (!origen) throw new Error(`No existe la tarea ${id}`);
    const hasta = this.columna(destino);

    if (origen.nombre === "Hecho" || origen === hasta) {
      throw new MovimientoNoPermitidoError(id, origen.nombre, hasta.nombre);
    }
    if (hasta.llena) throw new ColumnaLlenaError(hasta);

    const tarea = origen.quitar(id);
    hasta.añadir(tarea);
    return tarea;
  }
  // ✍️ C4 (bloque C) ────────────────────────────────────────────────────────────
  // toJSON(): { version, limiteEnCurso, columnas: { "Por hacer": [datos…], … } }
  //   JSON.stringify(tablero) lo llama solo. Sin él sale "{}": los # no se ven. Usa aDatos.

  /** Lo contrario de toJSON: el MISMO tablero (columnas, ids y límite WIP). Lanza si no encaja. */
  static desdeJSON(datos) {
    throw new Error("Sin hacer");
  }
}

// Comprueba con:  docker compose run --rm web npm test bloque-a
(void Columna,
  ColumnaLlenaError,
  MovimientoNoPermitidoError,
  Tarea,
  TareaRecurrente,
  aDatos,
  desdeDatos); // (borra esta línea cuando los uses)
