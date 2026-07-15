import type { NutrienteTarjeta } from "./NutrientesNutricion";

// Apartado «Microbiota» del recorrido de Nutrición. Tres moléculas que produce
// la microbiota, cada una abre su ficha tipo cómic (como las tarjetas de los
// grupos de nutrientes).
//
// TEXTO PROVISIONAL — la usuaria pasará el definitivo. Fotos PENDIENTES:
// /img/nutri/nutrientes/microbiota/<key>.png
export const MICROBIOTA_TARJETAS: NutrienteTarjeta[] = [
  {
    key: "glutamato",
    titulo: "Glutamato",
    foto: "/img/nutri/nutrientes/microbiota/glutamato.png",
    parrafos: [
      "El glutamato es uno de los principales mensajeros químicos del cerebro. Algunas bacterias de la microbiota pueden producirlo o influir en sus niveles.",
      "Es una de las vías por las que el intestino y el cerebro se comunican constantemente.",
    ],
  },
  {
    key: "acetato",
    titulo: "Acetato",
    foto: "/img/nutri/nutrientes/microbiota/acetato.png",
    parrafos: [
      "Es uno de los ácidos grasos de cadena corta que las bacterias fabrican al fermentar la fibra.",
      "Se absorbe y viaja por la sangre, donde sirve de fuente de energía y de molécula que ayuda a regular el metabolismo.",
    ],
  },
  {
    key: "butirato",
    titulo: "Butirato",
    foto: "/img/nutri/nutrientes/microbiota/butirato.png",
    parrafos: [
      "Es el ácido graso de cadena corta preferido por las células del colon: es su principal alimento.",
      "Ayuda a mantener sana y unida la pared intestinal y participa en la regulación de la inflamación y del sistema inmunitario.",
    ],
  },
];
