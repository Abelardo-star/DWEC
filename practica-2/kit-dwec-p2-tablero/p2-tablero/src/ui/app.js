// app.js — Bloque B · ✍️ B4, B5 y B6. Conecta el modelo (el tablero) con la página: pinta, escucha y avisa.
// Usa tus piezas: crearTarjeta/pintarLista, leerFormulario/mostrarErrores y delegar.
// La estructura de la página (ids, data-*) está en index.html y NO se cambia: la usan los tests.
import { ErrorTablero } from "../modelo/errores.js";
import { delegar } from "./delegacion.js";
import { leerFormulario, mostrarErrores } from "./formulario.js";
import { pintarLista } from "./tarjeta.js";
import { fechaATexto } from "../modelo/serializar.js";

/** Botones de cada tarjeta según su columna: [texto, data-accion] */
const ACCIONES = {
  "Por hacer": [["Empezar →", "empezar"]],
  "En curso": [
    ["← Volver", "volver"],
    ["✓ Completar", "completar"],
  ],
  Hecho: [],
};
const crear = (etiqueta, datos) => Object.assign(document.createElement(etiqueta),
  datos);

function crearFormulario(tarea) {
  const form = crear("form", { noValidate: true });
  form.dataset.form = "fecha";
  const etiqueta = crear("label", {
    textContent: `Fecha límite nueva de «$
{tarea.titulo}»` });
  etiqueta.append(
    crear("input", {
      name: "limite", type: "date", value:
        fechaATexto(tarea.limite)
    }),
  );
  const error = crear("p", { className: "error" });
  error.dataset.errorDe = "limite";
  const enviar = crear("button", { type: "submit", textContent: "Guardar" });
  form.append(etiqueta, error, enviar, crearBoton("Cancelar", "cancelar"));
  return form;
}

//Crear Boton
function crearBoton(texto, accion){
  const boton = crear("button" , {type:"button", textContent: texto});
  boton.dataset.accion = accion;
  return boton;
}

// ✍️ B6 · validar(datos) → { campo: "mensaje" } con los errores (objeto vacío si todo está bien)
//   - titulo: obligatorio y como mucho 80 caracteres
//   - cadaDias (si viene): entero mayor que 0. Si es correcto pero no hay limite, el error va
//     en «limite»: una tarea que se repite necesita fecha límite
export function validar(datos) {
  const errores = {};
  const titulo = datos.titulo ?? "";

  if (titulo.length === 0) {
    errores.titulo = "El título es obligatorio";
  } else if (titulo.length > 80) {
    errores.titulo = "El título no puede superar las 80 palabras";
  }

  if (datos?.cadaDias !== undefined) {
    if (!Number.isInteger(datos.cadaDias) || datos.cadaDias <= 0) {
      errores.cadaDias = "El numero tiene que ser un entero mayor que 0";
    } else if (!datos.limite) {
      errores.limite = "Una tarea que se repite necesita una fecha máxima";
    }
  }

  return errores;
}

/**
 * Arranca la interfaz dentro de raiz (el <main id="app">). Los listeners se ponen UNA vez aquí;
 * pintar() solo cambia nodos, así que repintar no los duplica.
 * opciones.hoy: fecha fija para los tests · opciones.alCambiar(tablero): tras cada cambio (UD6)
 */
export function iniciarApp(raiz, tablero, { hoy = null, alCambiar = () => {} } = {}) {
  const form = raiz.querySelector("#form-alta");
  const aviso = raiz.querySelector("#aviso");
  const columnas = raiz.querySelector("#columnas");
  const resumen = raiz.querySelector("#resumen");

  // ✍️ B4 · pintar(): deja la página igual que el modelo cada vez que se llama, y NO pone listeners
  //   - cada columna ([data-columna="…"]): sus tareas en el orden de ordenadas(), con pintarLista en su
  //     .lista, y en cada .tarjeta sus botones según ACCIONES: <button type="button" data-accion="…">
  //   - el .contador de cada columna: (n), o (n/límite) en la que tiene límite WIP
  //   - [data-dato="progreso"]: hechas ÷ total en %, redondeado (con el tablero vacío, 0 %)
  //   - [data-dato="vencidas"]: las vencidas de tablero.resumen(ahora)
  //   La fecha de hoy: const ahora = hoy ?? new Date();  (los tests pasan una fija)
  function pintar() {
    const ahora = hoy ?? new Date();
    let total = 0;
    let hechas = 0;

    for (const columna of tablero.columnas) {
      const zona = columnas.querySelector(`[data-columna="${columna.nombre}"]`);
      const lista = zona.querySelector(".lista");
      const tareas = columna.ordenadas(ahora);

      pintarLista(lista, tareas, ahora);

      for (const tarjeta of lista.querySelectorAll(".tarjeta")) {
        for (const [texto, accion] of ACCIONES[columna.nombre]) {
          const boton = document.createElement("button");
          boton.type = "button";
          boton.dataset.accion = accion;
          boton.textContent = texto;
          tarjeta.append(boton);
        }
        const tarea = tablero.buscar(Number(tarjeta.dataset));
        if (columna.nombre === "Por hacer" && tarea?.limite)
          tarjeta.append(crearBoton("Cambiar fecha y empezar", "fecha"));
      }

      zona.querySelector(".contador").textContent =
        columna.limiteWip === null
          ? `(${tareas.length})`
          : `(${tareas.length}/${columna.limiteWip})`;

      total += tareas.length;
      if (columna.nombre === "Hecho") hechas = tareas.length;
    }

    const progreso = total === 0 ? 0 : Math.round((hechas / total) * 100);
    resumen.querySelector('[data-dato="progreso"]').textContent = `${progreso} %`;
    resumen.querySelector('[data-dato="vencidas"]').textContent = tablero.resumen(ahora).vencidas;
  }

  // 👀 Resuelto: avisar("texto") enseña el aviso; avisar("") lo esconde
  function avisar(mensaje) {
    aviso.textContent = mensaje;
    aviso.hidden = mensaje === "";
  }

  // ✍️ B5 · UN listener, puesto UNA vez aquí (nunca dentro de pintar): clic en los botones de las
  //   tarjetas, con delegar sobre `columnas`. empezar → «En curso», volver → «Por hacer», completar.
  //   Tras cada cambio que sale bien: avisar(""), pintar() y alCambiar(tablero).
  //   Si el tablero lanza un ErrorTablero → avisar(error.message) y no se repinta.
  //   Cualquier otro error → se relanza (es un fallo del programa).
  //   Pista: una función cambiar(accion) con el try/catch te sirve también para el B6.
  function cambiar(accion) {
    try {
      accion();
      avisar("");
      pintar();
      alCambiar(tablero);
    } catch (error) {
      if (error instanceof ErrorTablero) {
        avisar(error.message);
      } else {
        throw error;
      }
    }
  }
  delegar(columnas, "click", "[data-accion]", (boton) => {
    const tarjeta = boton.closest(".tarjeta");
    const id = Number(tarjeta?.dataset.id);
    if (!id) return;

    const accion = boton.dataset.accion;

    cambiar(() => {
      if (accion === "empezar") {
        tablero.mover(id, "En curso");
      } else if (accion === "volver") {
        tablero.mover(id, "Por hacer");
      } else if (accion === "completar") {
        tablero.completar(id);
      }
      if (accion === "fecha") {
        // TU TURNO: añade crearFormulario(tarea) a ESA tarjeta y pon el foco en su input
        columnas.querySelector("form")?.remove();
        const formulario = crearFormulario(tablero.buscar(id));
        tarjeta.append(formulario);
        return;
      }
      if (accion === "cancelar") return columnas.querySelector("form")?.remove();
    });
  });
  delegar(columnas, "submit", "form", (formulario, evento) => {
    evento.preventDefault();                                    // sin recargar la página
    const tarea = tablero.buscar(Number(formulario.closest(".tarjeta").dataset.id));
    const valor = formulario.elements.limite.value.trim();     // SIEMPRE un string
    const mensaje = revisar(valor, tarea, tablero, hoy ?? new Date());
    mostrarErrores(formulario, { limite: mensaje });          // pinta o borra el mensaje bajo el campo
    if (mensaje === "") cambiar(() => aplicar(tablero, tarea, valor));
  });

  // ✍️ B6 · submit de `form`: preventDefault, leerFormulario, validar y mostrarErrores. Si hay errores,
  //   no se crea nada. Si no, tablero.crearTarea(datos) (como un cambio más) y form.reset().
  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const datos = leerFormulario(form);
    const errores = validar(datos);
    mostrarErrores(form, errores);

    if (Object.keys(errores).length > 0) return;
    cambiar(() => {
      tablero.crearTarea(datos);
      form.reset();
    });
  });
  pintar();
  return { pintar };
}
function revisar(valor, tarea, tablero, hoy) {
  // TU TURNO: las dos comprobaciones del punto 4 del enunciado, 
  // con sus mensajes EXACTOS
  const parrafos = form.querySelectorAll("p[data-error-de]");

  parrafos.forEach((p) => {
    const campo = p.dataset.errorDe;
    const control = form.elements[campo];

    if (tarea[campo]) {
      p.textContent = tarea[campo];
      control.setAttribute("aria-invalid", "true");
    } else {
      p.textContent = "";
      control.removeAttribute("aria-invalid");
    }
    if(valor === "vacio"){
      throw new RangeError(`Elige una fecha`)
    }
  });

  return "";
}

function aplicar(tablero, tarea, valor) {
  cambiar(() => {
    if (valor === "empezar") {
      tablero.mover(tarea.id, "En curso");
    } else if (valor === "volver") {
      tablero.mover(tarea.id, "Por hacer");
    } else if (valor === "completar") {
      tablero.completar(tarea.id);
    }

  });
}

//(void ACCIONES, ErrorTablero, delegar, leerFormulario, mostrarErrores, pintarLista); // (borra esta línea cuando los uses)
