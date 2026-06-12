import React from "react";
import type { Curso, ModalidadInfo } from "./cursos.type";
import type { Submodulo } from "../../dtos/aprendizaje.type";
import { astrologiaNom, astrologiaBg, astrologiaTxt, AstrologiaIcon } from "../../GlobalVariables";

export type { Curso, ModalidadInfo } from "./cursos.type";

/* ─────────────────────────────────────────────────────────────────────────
 *  Catálogo de cursos. Cada clave es el slug de la disciplina (el mismo que
 *  usan las tarjetas de /aprendizaje/aprendizajeHome). Un curso tiene módulos,
 *  y cada módulo submódulos = lecciones. Una lección puede ser de vídeo o de
 *  texto (tipo: 'texto' + contenido en Markdown, que se lee en
 *  /aprendizaje/leccion/:modalidad/:curso/:leccion).
 *
 *  Para AÑADIR un curso de texto usa los helpers `cursoTexto(...)` /
 *  `leccionTexto(...)` de abajo. Reemplaza el bloque EJEMPLO por el contenido real.
 * ───────────────────────────────────────────────────────────────────────── */

type DetallesLeccion = Submodulo["detalles"];
type LeccionDef = { id: string; nom: string; contenido: string };

// Helper: lección de texto con los campos mínimos.
function leccionTexto(modalidad: string, cursoId: string, det: DetallesLeccion, l: LeccionDef): Submodulo {
  return {
    id: l.id,
    cursoId,
    nom: l.nom,
    link: `/aprendizaje/leccion/${modalidad}/${cursoId}/${l.id}`,
    descripcion: "",
    video: "",
    letra: null,
    detalles: det,
    linkAnterior: "",
    linkNext: "",
    icon: null,
    tipo: "texto",
    contenido: l.contenido,
  };
}

// Helper: curso de texto con un módulo "Introducción" y sus lecciones.
function cursoTexto(
  modalidad: string,
  det: DetallesLeccion,
  id: string,
  titulo: string,
  foto: string,
  descripcion: string,
  lecciones: LeccionDef[],
  precio: number | null = null, // null = gratis ("Acceder"); número = de pago ("Pagar" → Stripe)
): Curso {
  return {
    id,
    titulo,
    foto,
    descripcion,
    precio,
    numLecciones: lecciones.length,
    icon: <AstrologiaIcon size={{ base: "40px", md: "48px" }} />,
    cursoLink: `/aprendizaje/modulosPage/${modalidad}/${id}`,
    modulos: [
      {
        title: "Introducción",
        icon: AstrologiaIcon,
        submodules: lecciones.map((l) => leccionTexto(modalidad, id, det, l)),
      },
    ],
  };
}

// ───────────────────────── EJEMPLO (borrable) ─────────────────────────
// Tres cursos de muestra para ver la fila de 3. Reemplaza por contenido real.
const EJ_MOD = astrologiaNom;
const EJ_DET = { color: astrologiaTxt, bgColor: astrologiaBg, icon: AstrologiaIcon };

export const cursosData: Record<string, ModalidadInfo> = {
  [EJ_MOD]: {
    nom: astrologiaNom,
    bgColor: astrologiaBg,
    color: astrologiaTxt,
    icon: <AstrologiaIcon size={{ base: "40px", md: "50px" }} />,
    cursos: [
      cursoTexto(
        EJ_MOD, EJ_DET,
        "fundamentos-astrologia",
        "Fundamentos de la Astrología",
        "/img/astrologia/space.jpg",
        "De dónde viene la astrología que uso en El Recorrido.",
        [
          {
            id: "origenes",
            nom: "Orígenes",
            contenido: `# Orígenes

La astrología es uno de los **sistemas simbólicos más antiguos** que tiene la humanidad para preguntarse *quién soy*.

No nació como una superstición: nació como una forma de **ordenar la experiencia** mirando al cielo.

## Por qué la uso en El Recorrido

- Es un punto de partida, no un destino.
- Ofrece un lenguaje para hablar de uno mismo sin juzgarse.
- Se cruza después con la psicología y el resto de disciplinas.

> No predice tu futuro: describe cómo estás configurado.`,
          },
          {
            id: "carta-natal",
            nom: "La carta natal",
            contenido: `## La carta natal

La carta natal es una **fotografía del cielo** en el momento de tu nacimiento.

1. Marca dónde estaba cada planeta.
2. Divide el cielo en doce casas.
3. Dibuja las relaciones (aspectos) entre los planetas.

Con eso obtenemos un mapa de tus *tensiones* y tus *facilidades*.`,
          },
        ],
      ),
      cursoTexto(
        EJ_MOD, EJ_DET,
        "arquetipos",
        "Los doce arquetipos",
        "/img/astrologia/arqyoutube.png",
        "Las energías que actúan dentro de ti.",
        [
          {
            id: "que-es-arquetipo",
            nom: "Qué es un arquetipo",
            contenido: `# Los doce arquetipos

Un arquetipo es un **patrón de energía** que todos llevamos dentro. La astrología los ordena en doce.

Reconocer cuál está tomando el control te permite **dejar de confundirte con él**.`,
          },
        ],
        5, // curso de pago (5 €) → botón "Pagar" conectado a Stripe
      ),
      cursoTexto(
        EJ_MOD, EJ_DET,
        "leer-carta",
        "Leer tu carta",
        "/img/astrologia/cartastralej.png",
        "Aprende a interpretarla por ti mismo.",
        [
          {
            id: "como-leer",
            nom: "Cómo se lee",
            contenido: `# Cómo se lee una carta

El objetivo no es depender de un intérprete, sino que **tú** puedas leerla.

Empezamos por lo esencial: Sol, Luna y Ascendente.`,
          },
        ],
      ),
    ],
  },
};
