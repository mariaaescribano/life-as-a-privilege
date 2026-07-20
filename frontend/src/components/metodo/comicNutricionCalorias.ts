import type { Vineta } from "./ComicViewer";

// Cómic de transición «Las calorías no existen» (moléculas / ATP / valores
// nutricionales). Va ENTRE la portada de Nutrición (/metodo/nutricion) y la
// pantalla de Los nutrientes (/metodo/nutricion/nutrientes): se abre al pulsar
// «Comenzar» y termina navegando a nutrientes.
//
// Imágenes: /viñetas/nutricion/calorias/calorias1.png … calorias9.png
// (mientras no existan, el ComicViewer pinta un placeholder «próximamente»).
export const NUTRICION_CALORIAS: Vineta[] = [
  {
    src: "/viñetas/nutricion/calorias/calorias1.png",
    paragraphs: [
      "Las calorías no existen físicamente. Lo que realmente existe son las moléculas que forman los alimentos y lo que nuestras células pueden hacer con ellas.",
      "Las calorías son simplemente una forma de medir cuánta energía puede obtener el cuerpo de esas moléculas.",
    ],
  },
  {
    src: "/viñetas/nutricion/calorias/calorias2.png",
    paragraphs: [
      "Cuando comemos, nuestras enzimas van desmontando los alimentos poco a poco hasta separar todas sus moléculas: glucosa, aminoácidos, ácidos grasos, vitaminas, minerales...",
      "Esas son las verdaderas «piezas» con las que trabaja el organismo.",
    ],
  },
  {
    src: "/viñetas/nutricion/calorias/calorias3.png",
    paragraphs: [
      "A partir de ahí, cada molécula puede seguir un camino distinto.",
      "Por ejemplo, la glucosa suele utilizarse para obtener energía mediante la respiración celular.",
      "Los ácidos grasos pueden servir para construir membranas celulares, fabricar hormonas, almacenarse como reserva o producir energía.",
      "Los aminoácidos se utilizan para fabricar proteínas, como el músculo, las enzimas o los anticuerpos.",
    ],
  },
  {
    src: "/viñetas/nutricion/calorias/calorias4.png",
    paragraphs: [
      "Cuando una célula obtiene energía de la glucosa mediante la respiración celular, esa energía se almacena temporalmente en una molécula llamada ATP (adenosín trifosfato).",
    ],
  },
  {
    src: "/viñetas/nutricion/calorias/calorias5.png",
    paragraphs: [
      "La energía no es una molécula, pero el ATP es la molécula que almacena la energía.",
      "Se guarda hasta que hace falta, entonces se transporta hasta dónde se necesita.",
    ],
  },
  {
    src: "/viñetas/nutricion/calorias/calorias6.png",
    paragraphs: [
      "Cuando una enzima o cualquier otra maquinaria celular necesita realizar una misión, utiliza el ATP.",
      "Al liberar la energía almacenada en él, la célula puede mover un músculo, fabricar una proteína, enviar una señal nerviosa o llevar a cabo miles de procesos diferentes -gracias a las enzimas.",
    ],
  },
  {
    src: "/viñetas/nutricion/calorias/calorias7.png",
    paragraphs: [
      "Por eso, los valores nutricionales describen las moléculas y materiales que contiene un alimento: proteínas, grasas, carbohidratos, vitaminas y minerales.",
    ],
  },
  {
    src: "/viñetas/nutricion/calorias/calorias8.png",
    paragraphs: [
      "Las calorías, en cambio, no son un ingrediente, sino una medida de la cantidad de energía que las células pueden obtener de ese alimento. Cuantas más calorías, más ATP.",
    ],
  },
  {
    src: "/viñetas/nutricion/calorias/calorias9.png",
    paragraphs: [
      "No comemos calorías. Comemos moléculas.",
      "Algunas se convierten en energía y otras se convierten, literalmente, en nuestro propio cuerpo.",
    ],
  },
];
