import React, { useState } from "react";
import {
  Box, Flex, Text,
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
} from "@chakra-ui/react";
import { neuropsicologiaBg, neuropsicologiaNom, neuropsicologiaTxt } from "../../GlobalVariables";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { AgendarLlamada } from "../global/AgendarLlamada";
import { CursoCardDetalle } from "../aprendizaje/CursoCardDetalle";
import { useCursosData } from "../../data/cursosApi";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";

const TINTA = neuropsicologiaTxt;
const PAPEL = "#fbf4e8";
// Halo claro para que la tinta se lea sobre el fondo de acuarela (igual que en
// el resto del recorrido de psicología).
const INK_SHADOW = `0 1px 2px ${PAPEL}, 0 0 6px ${PAPEL}, 0 0 13px ${neuropsicologiaBg}`;

// Curso (de acceso libre) que se muestra en el popup «Orientación» de cada
// página del recorrido. Varía por página: añade aquí la pareja página → id de
// curso. Las páginas sin entrada no muestran curso (cae al texto de siempre).
// Los ids salen de la tabla `curso` (GET /cursos).
const ORIENTACION_CURSO: Partial<Record<string, string>> = {
  inicio: "cd03ced9-f239-4236-93d4-31eb2e995ef6",          // Psicología · «La Autoestima»
  problema: "bf6d66b3-48e1-46f7-90c3-639c7f0f0bc4",        // Psicología · «El Trauma»
  "linea-de-vida": "bf6d66b3-48e1-46f7-90c3-639c7f0f0bc4", // Psicología · «El Trauma»
};

// Box de «Ejemplo» con fondo de psicología y una lista de ejemplos, por página.
// Las páginas con entrada aquí abren este box elegante en vez del popup de texto
// de siempre. Edita/añade ejemplos libremente.
const EJEMPLOS_BOX: Partial<Record<string, { titulo: string; ejemplos: string[] }>> = {
  problema: {
    titulo: "Ejemplos de problemas",
    ejemplos: [
      "Me cuesta poner límites y acabo agotada por complacer a los demás.",
      "Haga lo que haga, siento que nunca soy suficiente.",
      "Me cuesta confiar; siempre espero que tarde o temprano me fallen.",
      "Necesito tenerlo todo bajo control y vivo en tensión.",
      "Evito los conflictos y me callo lo que de verdad siento.",
      "Me cuesta estar sola y busco constantemente aprobación.",
      "Aplazo lo importante y luego me castigo por no avanzar.",
    ],
  },
};

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
         position="relative" overflow="hidden"
         px={{ base: 4, md: 5 }} py={2} borderRadius="full"
         border={`1.5px solid ${TINTA}`} fontFamily="'EB Garamond', serif" fontWeight="700"
         fontSize={{ base: "xs", md: "sm" }} letterSpacing="0.03em" cursor="pointer" whiteSpace="nowrap"
         boxShadow={`0 6px 18px rgba(94,45,16,0.4)`} transition="all 0.18s"
         _hover={{ transform: "translateY(-2px)", boxShadow: `0 10px 26px rgba(94,45,16,0.5)` }}>
      {/* Fondo: imagen de la disciplina (psicología) recortada al pill */}
      <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="full" />
      <Box as="span" position="relative" zIndex={1} color={TINTA}
           style={{ textShadow: `0 1px 2px ${PAPEL}, 0 0 8px ${PAPEL}` }}>
        {children}
      </Box>
    </Box>
  );
}

/** Grupo fijo de botones de ayuda (abajo a la derecha) + sus popups, común a
 *  todo el recorrido de psicología. `pagina` elige el contenido.
 *
 *  La página `inicio` es especial: solo muestra «¿Necesitas ayuda?» (que abre la
 *  reserva de llamada para hacer el recorrido acompañado) y «Orientación» (que
 *  abre un popup con un curso de acceso libre). El resto de páginas mantiene los
 *  3 botones informativos de siempre. */
export function AyudaRecorrido({ pagina }: { pagina: keyof typeof AYUDA_RECORRIDO }) {
  const [abierto, setAbierto] = useState<keyof Ayuda | null>(null);
  // Popups especiales de la página inicio.
  const [acompPreguntaOpen, setAcompPreguntaOpen] = useState(false); // paso previo "¿Necesitas ayuda?"
  const [companiaOpen, setCompaniaOpen] = useState(false);           // calendario de reserva
  const [cursoOpen, setCursoOpen] = useState(false);
  const [ejemplosOpen, setEjemplosOpen] = useState(false);           // box de ejemplos (págs. con EJEMPLOS_BOX)

  const contenido = AYUDA_RECORRIDO[pagina];
  const esInicio = pagina === "inicio";

  // Curso de acceso libre de esta página (si lo hay).
  const { cursosData } = useCursosData();
  const cursoId = ORIENTACION_CURSO[pagina as string];
  const curso = cursoId
    ? Object.values(cursosData).flatMap((m) => m.cursos).find((c) => c.id === cursoId)
    : undefined;

  // Box de ejemplos de esta página (si lo hay).
  const ejemplosBox = EJEMPLOS_BOX[pagina as string];

  // Bloquea el scroll del fondo mientras cualquier popup esté abierto.
  useLockBodyScroll(!!abierto || acompPreguntaOpen || companiaOpen || cursoOpen || ejemplosOpen);

  if (!contenido) return null;
  const sec = abierto ? contenido[abierto] : null;

  return (
    <>
      <Flex position="fixed" bottom={{ base: 4, md: 6 }} right={{ base: 4, md: 6 }} zIndex={20}
            direction="column" align="flex-end" gap={2}>
        {esInicio ? (
          <>
            <BotonAyuda onClick={() => setAcompPreguntaOpen(true)}>¿Necesitas ayuda?</BotonAyuda>
            <BotonAyuda onClick={() => setCursoOpen(true)}>Orientación</BotonAyuda>
          </>
        ) : (
          <>
            <BotonAyuda onClick={() => (ejemplosBox ? setEjemplosOpen(true) : setAbierto("ejemplo"))}>Ejemplo</BotonAyuda>
            <BotonAyuda onClick={() => setAcompPreguntaOpen(true)}>¿Necesitas ayuda?</BotonAyuda>
            <BotonAyuda onClick={() => (curso ? setCursoOpen(true) : setAbierto("orientacion"))}>Orientación</BotonAyuda>
          </>
        )}
      </Flex>

      {/* Popup informativo (páginas no-inicio) */}
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

      {/* Popup previo «¿Necesitas ayuda?» → invita a hacerlo acompañado */}
      {acompPreguntaOpen && (
        <Box position="fixed" inset={0} zIndex={2300} display="flex" alignItems="center" justifyContent="center"
             px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }} bg="rgba(60,34,12,0.6)"
             sx={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
             onClick={() => setAcompPreguntaOpen(false)} fontFamily="'EB Garamond', serif">
          <Box onClick={(e: React.MouseEvent) => e.stopPropagation()} position="relative" w="100%" maxW="460px"
               borderRadius="2xl" overflow="hidden" boxShadow={`0 30px 80px rgba(40,18,4,0.55)`}>
            <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 9, md: 14 }} py={{ base: 12, md: 16 }} textAlign="center">
              <Box as="button" onClick={() => setAcompPreguntaOpen(false)} position="absolute" top={3} right={3}
                   w="34px" h="34px" borderRadius="full" bg="rgba(255,251,243,0.7)" border={`1px solid ${TINTA}44`}
                   color={TINTA} display="flex" alignItems="center" justifyContent="center" fontSize="md" cursor="pointer"
                   _hover={{ bg: "rgba(255,251,243,0.95)", borderColor: TINTA }}>✕</Box>
              <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" lineHeight="1.4" mb={5} style={{ textShadow: INK_SHADOW }}>
                ¿Prefieres hacerlo acompañado?
              </Text>
              <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} opacity={0.85} lineHeight="1.8" mb={7}>
                Puedes recorrer este camino junto a María. Agenda una llamada y hazlo acompañado.
              </Text>
              <Box as="button" onClick={() => { setAcompPreguntaOpen(false); setCompaniaOpen(true); }}
                   px={9} py={3} borderRadius="full" bg={TINTA} color={PAPEL} border={`1px solid ${TINTA}`}
                   fontFamily="'EB Garamond', serif" fontWeight="700" fontSize={{ base: "md", md: "lg" }} letterSpacing="0.06em"
                   cursor="pointer" boxShadow={`0 6px 20px rgba(94,45,16,0.32)`} transition="all 0.2s"
                   _hover={{ transform: "translateY(-2px)", boxShadow: `0 10px 28px rgba(94,45,16,0.42)` }}>
                Agenda tu llamada →
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* Popup «¿Necesitas ayuda?» → recorrido acompañado (reserva de llamada) */}
      {companiaOpen && (
        <Box position="fixed" inset={0} zIndex={2300} display="flex" alignItems="flex-start" justifyContent="center"
             px={{ base: 3, md: 10 }} py={{ base: 5, md: 10 }} bg="rgba(60,34,12,0.62)"
             sx={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
             onClick={() => setCompaniaOpen(false)} fontFamily="'EB Garamond', serif" overflowY="auto">
          <Box onClick={(e: React.MouseEvent) => e.stopPropagation()} position="relative" w="100%" maxW="640px" my="auto">
            <Box as="button" onClick={() => setCompaniaOpen(false)} position="absolute" top={3} right={3} zIndex={2}
                 w="36px" h="36px" borderRadius="full"
                 bg="rgba(255,251,243,0.85)" border={`1px solid ${TINTA}44`} color={TINTA}
                 display="flex" alignItems="center" justifyContent="center" fontSize="lg" cursor="pointer"
                 _hover={{ bg: "#fff" }}>✕</Box>
            <AgendarLlamada
              color={neuropsicologiaTxt}
              bgColor={neuropsicologiaBg}
              disciplinaNom={neuropsicologiaNom}
              precio={60}
              titulo="¿Prefieres compañía?"
              subtitulo="Recorre el camino junto a María. Agenda una llamada · horario peninsular España"
            />
          </Box>
        </Box>
      )}

      {/* Popup «Ejemplo» → box elegante con varios ejemplos (págs. con EJEMPLOS_BOX) */}
      {ejemplosOpen && ejemplosBox && (
        <Box position="fixed" inset={0} zIndex={2300} display="flex" alignItems="center" justifyContent="center"
             px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }} bg="rgba(60,34,12,0.6)"
             sx={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
             onClick={() => setEjemplosOpen(false)} fontFamily="'EB Garamond', serif" overflowY="auto">
          <Box onClick={(e: React.MouseEvent) => e.stopPropagation()} position="relative" w="100%" maxW="520px" my="auto"
               borderRadius="2xl" overflow="hidden" boxShadow={`0 30px 80px rgba(40,18,4,0.55)`}>
            <DisciplinaBgLayer nom={neuropsicologiaNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 9, md: 12 }}
                 maxH={{ base: "calc(100vh - 64px)", md: "calc(100vh - 96px)" }} overflowY="auto"
                 sx={{ "&::-webkit-scrollbar": { width: "6px" }, "&::-webkit-scrollbar-thumb": { background: `${TINTA}55`, borderRadius: "9999px" } }}>
              <Box as="button" onClick={() => setEjemplosOpen(false)} position="absolute" top={3} right={3} zIndex={2}
                   w="34px" h="34px" borderRadius="full" bg="rgba(255,251,243,0.7)" border={`1px solid ${TINTA}44`}
                   color={TINTA} display="flex" alignItems="center" justifyContent="center" fontSize="md" cursor="pointer"
                   _hover={{ bg: "rgba(255,251,243,0.95)", borderColor: TINTA }}>✕</Box>
              <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" textAlign="center" lineHeight="1.3"
                    pr={6} style={{ textShadow: INK_SHADOW }}>
                {ejemplosBox.titulo}
              </Text>
              <Box h="1px" w="55%" maxW="220px" mx="auto" my={5} bgGradient={`linear(to-r, transparent, ${TINTA}66, transparent)`} />
              <Flex direction="column" gap={3}>
                {ejemplosBox.ejemplos.map((ej, i) => (
                  <Box key={i} px={{ base: 4, md: 5 }} py={3} borderRadius="xl"
                       bg="rgba(255,251,243,0.14)" border={`1px solid ${TINTA}33`}
                       sx={{ backdropFilter: "blur(4px)" }}>
                    <Text color={TINTA} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.7">
                      «{ej}»
                    </Text>
                  </Box>
                ))}
              </Flex>
            </Box>
          </Box>
        </Box>
      )}

      {/* Popup «Orientación» → curso de acceso libre */}
      {cursoOpen && (
        <Box position="fixed" inset={0} zIndex={2300} display="flex" alignItems="center" justifyContent="center"
             px={{ base: 4, md: 10 }} py={{ base: 6, md: 10 }} bg="rgba(40,20,8,0.7)"
             sx={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
             onClick={() => setCursoOpen(false)} fontFamily="'EB Garamond', serif" overflowY="auto">
          <Box onClick={(e: React.MouseEvent) => e.stopPropagation()} position="relative" w="100%" maxW="460px" my="auto">
            <Flex align="center" justify="space-between" gap={3} mb={4}>
              <Text color={PAPEL} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" letterSpacing="0.03em"
                    style={{ textShadow: `0 1px 3px rgba(0,0,0,0.5), 0 0 16px rgba(255,251,243,0.35)` }}>
                Orientación de acceso libre
              </Text>
              <Box as="button" onClick={() => setCursoOpen(false)}
                   w="36px" h="36px" borderRadius="full" flexShrink={0}
                   bg="rgba(255,251,243,0.85)" border={`1px solid ${TINTA}44`} color={TINTA}
                   display="flex" alignItems="center" justifyContent="center" fontSize="lg" cursor="pointer"
                   _hover={{ bg: "#fff" }}>✕</Box>
            </Flex>
            {curso ? (
              <CursoCardDetalle curso={curso} color={neuropsicologiaTxt} bgColor={neuropsicologiaBg} nom={neuropsicologiaNom} />
            ) : (
              <Text color={PAPEL} fontStyle="italic" opacity={0.85}>
                El curso estará disponible pronto.
              </Text>
            )}
          </Box>
        </Box>
      )}
    </>
  );
}
