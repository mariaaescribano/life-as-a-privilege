import React, { useState } from "react";
import {
  Box, Flex, Text,
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
} from "@chakra-ui/react";
import { neuropsicologiaTxt } from "../../GlobalVariables";

const TINTA = neuropsicologiaTxt;
const PAPEL = "#fbf4e8";

interface Seccion { titulo: string; cuerpo: string[] }
interface Ayuda { ejemplo: Seccion; ayuda: Seccion; orientacion: Seccion }

// ── Contenido por página del recorrido (editable) ──
export const AYUDA_RECORRIDO: Record<string, Ayuda> = {
  inicio: {
    ejemplo: {
      titulo: "Un ejemplo",
      cuerpo: [
        "El Recorrido te lleva de tu historia a tus patrones y a su raíz.",
        "Por ejemplo: recordarás un año de tu vida, marcarás lo que dejó huella, nombrarás un nudo como «miedo al rechazo» y descubrirás de dónde nace.",
      ],
    },
    ayuda: {
      titulo: "¿Cómo funciona?",
      cuerpo: [
        "Avanza por las etapas en orden, sin prisa.",
        "Todo lo que escribes se guarda solo y es solo para ti.",
        "Puedes volver atrás cuando quieras.",
      ],
    },
    orientacion: {
      titulo: "Orientación",
      cuerpo: [
        "No es un test ni hay respuestas correctas.",
        "La idea es que tú construyas tus propias conexiones.",
        "Si puedes, comparte el proceso con alguien de confianza.",
      ],
    },
  },
  problema: {
    ejemplo: {
      titulo: "Un ejemplo",
      cuerpo: [
        "Escribe con tus palabras lo que hoy te pesa.",
        "Por ejemplo: «Me cuesta poner límites y acabo agotada por complacer a los demás.»",
      ],
    },
    ayuda: {
      titulo: "¿Cómo se hace?",
      cuerpo: [
        "Escribe libremente, sin ordenar ni corregir.",
        "No tienes que encontrar la causa: solo describir lo que sientes hoy.",
        "Pulsa Guardar cuando quieras.",
      ],
    },
    orientacion: {
      titulo: "Orientación",
      cuerpo: [
        "Nombrar el problema ya es empezar a mirarlo.",
        "No busques la palabra perfecta; busca la honesta.",
      ],
    },
  },
  "linea-de-vida": {
    ejemplo: {
      titulo: "Un ejemplo",
      cuerpo: [
        "Reconstruye tu vida año a año, como las páginas de un libro.",
        "Por ejemplo, en «Año 8»: «Nos mudamos de ciudad. Me costó hacer amigos. Me sentía solo.»",
      ],
    },
    ayuda: {
      titulo: "¿Cómo se hace?",
      cuerpo: [
        "Toca un año para abrir su página y responder lo que recuerdes.",
        "Si no recuerdas nada de un año, márcalo como «sin recuerdos».",
        "Recorre toda tu vida, desde que naciste hasta hoy.",
      ],
    },
    orientacion: {
      titulo: "Orientación",
      cuerpo: [
        "No necesitas recordarlo todo ni en orden.",
        "Escribe lo que surja; un pequeño detalle puede abrir una puerta.",
      ],
    },
  },
  huellas: {
    ejemplo: {
      titulo: "Un ejemplo",
      cuerpo: [
        "Relee tu historia y marca con ◈ lo que dejó huella en ti.",
        "Por ejemplo, marcarías: «La muerte de mi abuela» o «El día que aprobé el examen».",
      ],
    },
    ayuda: {
      titulo: "¿Cómo se hace?",
      cuerpo: [
        "Pulsa ◈ junto a un recuerdo para marcarlo como huella.",
        "Vuelve a pulsarlo para quitarlo.",
        "Pasa las páginas para recorrer todos tus años.",
      ],
    },
    orientacion: {
      titulo: "Orientación",
      cuerpo: [
        "Una huella no es solo lo doloroso: también lo que te formó.",
        "Marca lo que aún resuena, aunque no sepas por qué.",
      ],
    },
  },
  nudos: {
    ejemplo: {
      titulo: "Un ejemplo",
      cuerpo: [
        "Un nudo es un patrón o conflicto que te acompaña hoy.",
        "Por ejemplo: «Miedo al rechazo», «Necesidad de control», «No sentirme suficiente».",
      ],
    },
    ayuda: {
      titulo: "¿Cómo se hace?",
      cuerpo: [
        "Escribe un nudo y pulsa Añadir.",
        "Puedes inspirarte en los ejemplos sugeridos.",
        "Quita con la ✕ los que no sientas tuyos.",
      ],
    },
    orientacion: {
      titulo: "Orientación",
      cuerpo: [
        "No busques explicaciones perfectas.",
        "Observa simplemente lo que sientes presente en tu vida ahora.",
      ],
    },
  },
  heridas: {
    ejemplo: {
      titulo: "Un ejemplo",
      cuerpo: [
        "Una herida une una experiencia con la creencia que dejó en ti.",
        "Huella: «Mis padres discutían mucho cuando era pequeño».",
        "Nudo: «Miedo al conflicto».",
        "Y tú escribes: «Aprendí que cuando alguien levanta la voz algo malo va a pasar; por eso evito discutir, aunque me calle lo que siento.»",
      ],
    },
    ayuda: {
      titulo: "¿Cómo se hace?",
      cuerpo: [
        "Pulsa «+ Añadir herida» para crear una.",
        "Toca (o arrastra) las huellas y los nudos que sientas relacionados: se añaden a la herida activa y se iluminan con su color.",
        "Ponle un título y describe qué dejó en ti esa experiencia.",
      ],
    },
    orientacion: {
      titulo: "Orientación",
      cuerpo: [
        "No busques la herida «correcta». Busca la que reconoces.",
        "Una experiencia puede dejar varias creencias; y una creencia venir de varias experiencias.",
        "Nombrarla y verla con claridad ya es un paso.",
      ],
    },
  },
  integracion: {
    ejemplo: {
      titulo: "Un ejemplo",
      cuerpo: [
        "Relaciona un nudo con un arquetipo de tu carta astral.",
        "Por ejemplo: «Soledad» + «Saturno en Casa 1» → «Aprendí pronto a sostenerme sola.»",
      ],
    },
    ayuda: {
      titulo: "¿Cómo se hace?",
      cuerpo: [
        "Crea una relación con «+ Añadir relación».",
        "Toca (o arrastra) nudos y arquetipos para reunirlos; el ojo de cada carta abre su lectura.",
        "Ponle título y escribe lo que tú ves.",
      ],
    },
    orientacion: {
      titulo: "Orientación",
      cuerpo: [
        "La plataforma no interpreta por ti: la comprensión la escribes tú.",
        "Deja que los símbolos dialoguen; no busques respuestas rápidas.",
      ],
    },
  },
  mapa: {
    ejemplo: {
      titulo: "Un ejemplo",
      cuerpo: [
        "El mapa reúne tus heridas y relaciones en una sola imagen.",
        "Verás cómo se conectan las piezas de tu historia.",
      ],
    },
    ayuda: {
      titulo: "¿Cómo se lee?",
      cuerpo: [
        "Observa el mapa con calma.",
        "Cada conexión nace de lo que tú has unido en las etapas anteriores.",
      ],
    },
    orientacion: {
      titulo: "Orientación",
      cuerpo: [
        "No estás viendo una explicación, sino cómo se relacionan las piezas de tu historia.",
        "Vuelve cuando quieras: tu mapa irá cambiando contigo.",
      ],
    },
  },
};

function BotonAyuda({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <Box as="button" onClick={onClick}
         px={{ base: 4, md: 5 }} py={2} borderRadius="full" bg={TINTA} color={PAPEL}
         border={`1.5px solid ${PAPEL}55`} fontFamily="'EB Garamond', serif" fontWeight="700"
         fontSize={{ base: "xs", md: "sm" }} letterSpacing="0.03em" cursor="pointer" whiteSpace="nowrap"
         boxShadow={`0 6px 18px rgba(94,45,16,0.4)`} transition="all 0.18s"
         _hover={{ transform: "translateY(-2px)", boxShadow: `0 10px 26px rgba(94,45,16,0.5)` }}>
      {children}
    </Box>
  );
}

/** Grupo fijo de 3 botones de ayuda (abajo a la derecha) + su popup, común a
 *  todo el recorrido de psicología. `pagina` elige el contenido. */
export function AyudaRecorrido({ pagina }: { pagina: keyof typeof AYUDA_RECORRIDO }) {
  const [abierto, setAbierto] = useState<keyof Ayuda | null>(null);
  const contenido = AYUDA_RECORRIDO[pagina];
  if (!contenido) return null;
  const sec = abierto ? contenido[abierto] : null;

  return (
    <>
      <Flex position="fixed" bottom={{ base: 4, md: 6 }} right={{ base: 4, md: 6 }} zIndex={20}
            direction="column" align="flex-end" gap={2}>
        <BotonAyuda onClick={() => setAbierto("ejemplo")}>Ejemplo</BotonAyuda>
        <BotonAyuda onClick={() => setAbierto("ayuda")}>¿Necesitas ayuda?</BotonAyuda>
        <BotonAyuda onClick={() => setAbierto("orientacion")}>Orientación</BotonAyuda>
      </Flex>

      <Modal isOpen={!!sec} onClose={() => setAbierto(null)} isCentered scrollBehavior="inside" size={{ base: "sm", md: "md" }}>
        <ModalOverlay bg="rgba(40,20,8,0.6)" sx={{ backdropFilter: "blur(5px)" }} />
        <ModalContent bg={PAPEL} borderRadius="2xl" boxShadow={`0 24px 60px rgba(40,20,8,0.5)`} overflow="hidden" mx={4}
                      fontFamily="'EB Garamond', serif">
          <ModalCloseButton color={TINTA} zIndex={2} />
          <ModalBody px={{ base: 6, md: 9 }} py={{ base: 7, md: 9 }}>
            {sec && (
              <Flex direction="column" gap={4}>
                <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" textAlign="center">
                  {sec.titulo}
                </Text>
                <Box h="1px" w="55%" maxW="220px" mx="auto" bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />
                <Flex direction="column" gap={3}>
                  {sec.cuerpo.map((p, i) => (
                    <Text key={i} color={TINTA} fontSize={{ base: "md", md: "lg" }} lineHeight="1.7"
                          fontStyle={abierto === "ejemplo" && i >= 1 ? "italic" : "normal"}>
                      {p}
                    </Text>
                  ))}
                </Flex>
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
