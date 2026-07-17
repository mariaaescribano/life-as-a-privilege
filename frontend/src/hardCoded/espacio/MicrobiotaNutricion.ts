import type { NutrienteTarjeta } from "./NutrientesNutricion";

// Apartado «Microbiota» del recorrido de Nutrición. Tres moléculas que produce
// la microbiota, cada una abre su ficha tipo cómic (como las tarjetas de los
// grupos de nutrientes).
//
// TEXTO PROVISIONAL — la usuaria pasará el definitivo. Fotos PENDIENTES:
// /img/nutri/nutrientes/microbiota/<key>.png
export const MICROBIOTA_TARJETAS: NutrienteTarjeta[] = [
  {
    key: "propionato",
    titulo: "Propionato",
    foto: "/recorrido/nutricion/moleculas/propionato.png",
    parrafos: [
      "Es otro de los ácidos grasos de cadena corta que las bacterias fabrican al fermentar la fibra.",
      "Viaja hasta el hígado, donde participa en la regulación de la producción de glucosa y del metabolismo del colesterol.",
      "También ayuda a prolongar la sensación de saciedad, influyendo en el apetito.",
    ],
  },
  {
    key: "acetato",
    titulo: "Acetato",
    foto: "/recorrido/nutricion/moleculas/acetato.png",
    parrafos: [
      "Es uno de los ácidos grasos de cadena corta que las bacterias fabrican al fermentar la fibra.",
      "Se absorbe y viaja por la sangre, donde sirve de fuente de energía y de molécula que ayuda a regular el metabolismo.",
    ],
  },
  {
    key: "butirato",
    titulo: "Butirato",
    foto: "/recorrido/nutricion/moleculas/butirato.png",
    parrafos: [
      "Es el ácido graso de cadena corta preferido por las células del colon: es su principal alimento.",
      "Ayuda a mantener sana y unida la pared intestinal y participa en la regulación de la inflamación y del sistema inmunitario.",
    ],
  },
];
