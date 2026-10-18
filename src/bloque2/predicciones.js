// 🔮 Bloque 2 · ¿Qué da?  (mismas instrucciones que en el bloque 1)
//
//   const f = (a, b = 2) => a * b;
//   const cuantos = (...cosas) => cosas.length;
//   const ficha = () => { id: 1 };
//   const doble = (n) => n * 2;
//   function saludar(nombre) { return "Hola " + nombre; }

export const predicciones = {
  p1: 6, // f(3)
  p2: 6, // f(3, undefined)
  p3: 0, // f(3, null)
  p4: 2, // cuantos("a", "b")
  p5: 1, // cuantos([1, 2, 3])
  p6: "undefined", // typeof ficha()
  p7: 9, // Math.max(...[4, 9, 2])
  p8: [2,4,6], // [1, 2, 3].map(doble)
  p9: "Hola Ana", // lo que imprime el console.log de saludar
};
