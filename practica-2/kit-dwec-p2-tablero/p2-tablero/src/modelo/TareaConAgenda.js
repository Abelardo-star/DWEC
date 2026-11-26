import { AgendaNoValidaError } from "./errores.js";
import { Tarea } from "./Tarea.js";//hereda de tarea

export class TareaConAgenda extends Tarea {

    #duracion
    #puntos

    constructor(titulo, prioridad, limite, duracion) {
        // 2 · Llama al constructor del padre (super) con lo que es de Tarea, ANTES de usar this.
        super(titulo, prioridad, limite);
        this.#duracion = duracion;
        this.#puntos = [];
    }

    get duracion() {
        return this.#duracion;
    }

    set duracion(value) {
        if (!Number.isInteger(value) && value < 1) {
            throw new RangeError(`La duracion debe ser un entero de 1 o mas minutos: ${value}`);
        }
        this.#duracion = value;
    }

    get puntos(){
        return [...this.#puntos];
    }

    set puntos(value){
        this.#puntos = value;
    }

    planificar(nombre, minutos){
        if(Number.isInteger(minutos) && minutos < 1){
            throw new RangeError(`Los minutos tienen que ser numeros entereos y mayores que 0`);
        }
        if(this.puntos.filter((p) => p.nombre == nombre)){
            throw new RangeError(`Ya hay un punto con ese nombre ${nombre}`);
        }
        this.#puntos.push((nombre, minutos));
    }
    comprobarPaso(desde) {
        const total = this.#puntos.reduce((suma, p) => suma + p.minutos, 0);
        if (desde === "Por hacer" && (total === 0 || total > this.#duracion))
            throw new AgendaNoValidaError(total, this.#duracion);
    }

}