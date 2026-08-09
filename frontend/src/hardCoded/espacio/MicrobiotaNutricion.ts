import type { NutrienteTarjeta } from "./NutrientesNutricion";

// Apartado «Microbiota» del recorrido de Nutrición. Primero, las bacterias más
// conocidas de la microbiota intestinal (MICROBIOTA_BACTERIAS); después de un
// separador con el mandala, las moléculas que fabrican (MICROBIOTA_TARJETAS).
// Cada tarjeta abre su ficha tipo cómic (como las tarjetas de los grupos de
// nutrientes).
//
// Cada bacteria tiene su color de acento propio (para la ilustración; la tarjeta
// usa la paleta de Nutrición). Fotos PENDIENTES:
// /recorrido/nutricion/bacterias/<key>.png
export const MICROBIOTA_BACTERIAS: NutrienteTarjeta[] = [
  {
    key: "bifidobacterium",
    titulo: "Bifidobacterium longum",
    color: "#2f6fd6", // azul zafiro
    foto: "/recorrido/nutricion/bacterias/bifidobacterium.webp",
    parrafos: [
      "Es una de las bacterias beneficiosas más abundantes en el intestino humano, especialmente durante la infancia.",
      "Ayuda a digerir ciertos carbohidratos, produce ácidos grasos de cadena corta y contribuye a mantener la barrera intestinal y el equilibrio del sistema inmunitario.",
    ],
  },
  {
    key: "lactobacillus",
    titulo: "Lactobacillus rhamnosus",
    color: "#2fbf87", // verde esmeralda
    foto: "/recorrido/nutricion/bacterias/lactobacillus.webp",
    parrafos: [
      "Produce ácido láctico, contribuyendo a mantener un ambiente intestinal saludable y dificultando el crecimiento de microorganismos patógenos.",
      "También participa en la regulación de la respuesta inmunitaria y es uno de los probióticos más estudiados.",
    ],
  },
  {
    key: "akkermansia",
    titulo: "Akkermansia muciniphila",
    color: "#22c7d6", // turquesa brillante
    foto: "/recorrido/nutricion/bacterias/akkermansia.webp",
    parrafos: [
      "Vive adherida a la capa de moco del intestino y participa en su renovación.",
      "Su presencia se asocia con una mejor salud metabólica y con una mayor integridad de la barrera intestinal.",
    ],
  },
  {
    key: "faecalibacterium",
    titulo: "Faecalibacterium prausnitzii",
    color: "#f0a63c", // naranja ámbar
    foto: "/recorrido/nutricion/bacterias/faecalibacterium.webp",
    parrafos: [
      "Es uno de los principales productores de butirato en el colon.",
      "Ese ácido graso es una importante fuente de energía para las células intestinales y tiene propiedades antiinflamatorias, por lo que se considera un indicador de una microbiota saludable.",
    ],
  },
  {
    key: "bacteroides",
    titulo: "Bacteroides thetaiotaomicron",
    color: "#e6b422", // dorado intenso
    foto: "/recorrido/nutricion/bacterias/bacteroides.webp",
    parrafos: [
      "Es una de las bacterias intestinales más abundantes en los adultos.",
      "Tiene una extraordinaria capacidad para degradar polisacáridos complejos de la dieta, facilitando la obtención de nutrientes y colaborando con el metabolismo humano.",
    ],
  },
  {
    key: "ecoli",
    titulo: "Escherichia coli (comensal)",
    color: "#d1495b", // rojo carmín
    foto: "/recorrido/nutricion/bacterias/ecoli.webp",
    parrafos: [
      "Aunque algunas cepas pueden causar enfermedad, la mayoría de las que forman parte de la microbiota intestinal son inofensivas e incluso beneficiosas.",
      "Participan en la síntesis de vitamina K, compiten con microorganismos patógenos (ocupan todo el espacio y consumen los nutrientes del intestino antes de que los 'malos' los consuman) y contribuyen al equilibrio del ecosistema intestinal.",
    ],
  },
];

export const MICROBIOTA_TARJETAS: NutrienteTarjeta[] = [
  {
    key: "propionato",
    titulo: "Propionato",
    foto: "/recorrido/nutricion/moleculas/propionato.webp",
    parrafos: [
      "Es otro de los ácidos grasos de cadena corta que las bacterias fabrican al fermentar la fibra.",
      "Viaja hasta el hígado, donde participa en la regulación de la producción de glucosa y del metabolismo del colesterol.",
      "También ayuda a prolongar la sensación de saciedad, influyendo en el apetito.",
    ],
  },
  {
    key: "acetato",
    titulo: "Acetato",
    foto: "/recorrido/nutricion/moleculas/acetato.webp",
    parrafos: [
      "Es uno de los ácidos grasos de cadena corta que las bacterias fabrican al fermentar la fibra.",
      "Se absorbe y viaja por la sangre, donde se transforma en acetil-CoA, la molécula clave que empieza la respiración celular en las mitocondrias.",
    ],
  },
  {
    key: "butirato",
    titulo: "Butirato",
    foto: "/recorrido/nutricion/moleculas/butirato.webp",
    parrafos: [
      "Es el ácido graso de cadena corta preferido por las células del colon: es su principal alimento.",
      "Ayuda a mantener sana y unida la pared intestinal y participa en la regulación de la inflamación y del sistema inmunitario.",
    ],
  },
];
