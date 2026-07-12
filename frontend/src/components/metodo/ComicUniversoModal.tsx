import React from "react";
import {
  Modal,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { ComicViewer } from "./ComicViewer";
import type { Vineta } from "./ComicViewer";

// Datos del cómic del Inicio de Todo. Lo único que cambia respecto a los
// otros cómics son las viñetas (foto + texto). El frontend del cómic
// (layout, animaciones, navegación) es el mismo en todos: ComicViewer.

// Se exporta para reutilizarlo como intro de Astrología (cómic del Origen «según
// la espiritualidad») sin duplicar el contenido.
export const ORIGEN_ESPIRITUALIDAD: Vineta[] = [
  {
    src: "/viñetas/comicInicio/viñeta1.png",
    paragraphs: [
      "Al principio existía lo infinito.",
      "Luz y sombra, lo femenino y lo masculino, todo unido en fusión. Todos eran Uno, Uno eran todos.",
    ],
  },
  {
    src: "/viñetas/comicInicio/viñeta2.png",
    paragraphs: [
      "Un día, lo infinito quiso saber qué se siente al recibir Amor.",
      "Para poder sentirlo, tuvo que manifestarse en dos.",
    ],
  },
  {
    src: "/viñetas/comicInicio/viñeta3.png",
    paragraphs: [
      "Así nacieron la vasija que sostiene y la luz que se entrega.",
      "Yang, Purusha, Or: el portador y dador de luz. Yin, Prakriti, Kli: la energía que recibe, contiene y transforma para crear.",
    ],
  },
  {
    src: "/viñetas/comicInicio/viñeta4.png",
    paragraphs: [
      "Pero lo infinito quería más. Quería experimentarse desde todos los puntos de vista que fuese capaz de imaginar.",
      "Y dentro de ese límite que se había puesto, empezó a presionar hacia fuera.",
    ],
  },
  {
    src: "/viñetas/comicInicio/viñeta5.png",
    paragraphs: [
      "Estalló. La primera expansión.",
      "La ciencia la llama Big Bang y la fecha hace 13.800 millones de años.",
    ],
  },
  {
    src: "/viñetas/comicInicio/viñeta6.png",
    paragraphs: [
      "En los primeros minutos, esa energía se hizo materia.",
      "Miles de millones de partículas distintas. Había un plan. Había un propósito. No había prisa.",
    ],
  },
  {
    src: "/viñetas/comicInicio/viñeta7.png",
    paragraphs: [
      "La materia se buscó a sí misma. Se agrupó en estrellas.",
      "Dentro de ellas, por gravedad, nacieron los elementos pesados: el carbono, el oxígeno, el hierro. Todo lo que hoy existe.",
    ],
  },
  {
    src: "/viñetas/comicInicio/viñeta8.png",
    paragraphs: [
      "Las estrellas murieron y con su polvo nacieron los planetas, la naturaleza y nosotros.",
      "El hierro de tu sangre estuvo dentro de una estrella. Esto no es metáfora.",
    ],
  },
  {
    src: "/viñetas/comicInicio/viñeta9.png",
    paragraphs: [
      "Ese polvo estelar se unió para formar planetas. El nuestro halló el lugar perfecto.",
      "A lo largo de la historia, las culturas han hablado de elementos distintos. Sin embargo, todas están de acuerdo en una cosa: tierra, agua, fuego, aire y energía se unen para crear la Vida.",
    ],
  },
  {
    src: "/viñetas/comicInicio/viñeta10.png",
    paragraphs: [
      "Y la materia, en algún momento, empezó a copiarse, duplicarse y expandirse.",
      "Eso somos: un préstamo de polvo de estrellas. Una inversión del Universo. Las moléculas de cada célula que permiten que te llames «yo» existen desde hace más de 13.800 millones de años.",
    ],
  },
  {
    src: "/viñetas/comicInicio/viñeta11.png",
    paragraphs: [
      "Todo lo que ves es una manifestación distinta de Dios. Tú eres parte de lo divino, pero se te ha olvidado.",
      "La Cábala lo llama el exilio de la chispa: la luz que olvidó de dónde venía.",
    ],
  },
  {
    src: "/viñetas/comicInicio/viñeta12.png",
    paragraphs: [
      "No estás aquí por casualidad ni por castigo. No has sido abandonado ni expulsado.",
      "Estás aquí para recordar que eres una manifestación de Dios y estás formado por Amor.",
      "Para recordarlo, atravesarás cosas difíciles y dolorosas. Forma parte del camino. El propósito es no convertir el dolor en sufrimiento, sino aprender a aceptarlo."
    ],
  },
  {
    src: "/viñetas/comicInicio/viñeta13.png",
    paragraphs: [
      "En el instante exacto en que naciste, el cielo tenía una configuración que no se repetirá.",
      "Esa es tu carta natal. Te dice desde dónde y para qué actúas. Es tu camino para volver a casa.",
    ],
  },
  {
    src: "/viñetas/comicInicio/viñeta14.png",
    paragraphs: [
      "El Mapa te acompañará a través de las ocho disciplinas que te ayudarán a entenderte y recordar el sentido de tu Vida.",
      "Obtendrás herramientas que te ayudarán en tu camino, el cual tienes que caminar con tu valentía y fortaleza. Nadie hará por ti lo que tú puedes hacer por ti.",
    ],
  },
];

interface ComicUniversoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ComicUniversoModal({ isOpen, onClose }: ComicUniversoModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered scrollBehavior="outside">
      <ModalOverlay bg="rgba(0,0,0,0.95)" sx={{ backdropFilter: "blur(24px)" }} />
      <ModalContent
        bg="transparent"
        border="none"
        borderRadius="0"
        boxShadow="none"
        m={0}
        fontFamily="'EB Garamond', serif"
        minH="100vh"
      >
        {/* key={isOpen}: al reabrir el modal, ComicViewer se remonta y
            empieza desde la viñeta 1 con estado limpio. */}
        <ComicViewer key={String(isOpen)} vinetas={ORIGEN_ESPIRITUALIDAD} onClose={onClose} />
      </ModalContent>
    </Modal>
  );
}
