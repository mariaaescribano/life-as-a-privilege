import type { Vineta } from "./ComicViewer";

// Cómic de transición «Lo integral»: qué distingue al grano entero de la harina
// refinada. Va ENTRE la página de El hambre (/metodo/nutricion/hambre) y el
// plato de Harvard (/metodo/nutricion/plato): se abre al pulsar «Crea tu plato →»
// y termina navegando allí. Enlaza lo aprendido en El hambre (glucosa/saciedad)
// con el grano entero que recomienda el plato de Harvard.
//
// Imágenes: /viñetas/nutricion/integral/integral1.png … integral4.png (PENDIENTES).
export const NUTRICION_INTEGRAL: Vineta[] = [
  {
    src: "/viñetas/nutricion/integral/integral1.webp",
    titulo: "La naturaleza creó un alimento completo",
    paragraphs: [
      "Cada parte del grano tiene una función: el salvado protege, el germen nutre y el endospermo aporta energía.",
    ],
  },
  {
    src: "/viñetas/nutricion/integral/integral2.webp",
    titulo: "Qué se pierde al refinar",
    paragraphs: [
      "Para fabricar harina blanca, la industria separa el salvado y el germen. Solo conserva el endospermo, la parte más rica en almidón.",
      "Con el salvado y el germen también desaparecen gran parte de la fibra, vitaminas, minerales, antioxidantes y grasas saludables.",
    ],
  },
  {
    src: "/viñetas/nutricion/integral/integral3.webp",
    titulo: "La harina blanca",
    paragraphs: [
      "El endospermo se muele hasta obtener un polvo muy fino: la harina blanca. Es más fácil de conservar y trabajar, pero nutricionalmente es un alimento mucho más simple.",
      "Sin la fibra del grano entero, el almidón se digiere mucho más rápido, elevando la glucosa en sangre y reduciendo la sensación de saciedad.",
    ],
  },
  {
    src: "/viñetas/nutricion/integral/integral4.webp",
    titulo: "Lo que separamos",
    paragraphs: [
      "La naturaleza unió estas tres partes por una razón.",
      "Nosotros las separamos... y después intentamos recuperar sus beneficios añadiendo fibra y vitaminas por otro lado.",
    ],
  },
];
