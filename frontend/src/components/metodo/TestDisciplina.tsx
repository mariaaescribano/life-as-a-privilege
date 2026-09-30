import React, { useEffect, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useIdioma, useT, type Texto } from "../../i18n";
import { useNombreDisciplinaEnMapa } from "../../i18n/nombreDisciplina";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { PRESENTACIONES, type PresentacionDisciplina } from "../../data/presentacionDisciplinas";
import { Reveal } from "../global/Reveal";
import { LetrasVivas } from "../global/LetrasVivas";
import { PalabrasVivas } from "../global/PalabrasVivas";

/* ─────────────────────────────────────────────────────────────────────────────
 *  EL TEST DE «¿POR DÓNDE EMPIEZO?»
 *
 *  Ocho preguntas cortas (2 minutos) para orientar a quien no sabe con qué
 *  disciplina entrar en El Mapa. Cada respuesta reparte puntos entre las ocho
 *  disciplinas y al final gana la que más sume; el empate lo decide el orden
 *  del Mapa (la primera del recorrido propuesto).
 *
 *  Todo pasa EN MEMORIA: no se guarda nada en la base de datos ni en el
 *  navegador. Es un juego de orientación, no un diagnóstico.
 *
 *  El popup tiene dos caras: el cuestionario (una columna con scroll vertical)
 *  y, al terminar, el resultado en la misma tarjeta —el icono y la acuarela de
 *  la disciplina de fondo, con un botón que lleva a su presentación (/d/<key>,
 *  el mismo destino del «Saber más»)—.
 * ───────────────────────────────────────────────────────────────────────────── */

/** Las claves de puntuación son las mismas `key` de PRESENTACIONES. */
type ClaveTest =
  | "astrologia" | "psicologia" | "fisiologia" | "nutricion"
  | "ayurveda" | "tcm" | "cabala" | "cultura";

type Opcion = { texto: Texto; puntos: Partial<Record<ClaveTest, number>> };
type Pregunta = { texto: Texto; opciones: Opcion[] };

/** Los puntos: la disciplina principal de cada respuesta lleva 2 y, si la
 *  respuesta habla de dos mundos a la vez, la secundaria lleva 1. Ninguna
 *  respuesta es «mala»: todas suman a alguien. */
const PREGUNTAS: Pregunta[] = [
  {
    texto: {
      es: "¿Qué te trae hasta aquí?",
      en: "What brings you here?",
    },
    opciones: [
      { texto: { es: "Entender por qué repito los mismos patrones", en: "Understanding why I repeat the same patterns" }, puntos: { psicologia: 2 } },
      { texto: { es: "Encontrarme mejor en mi cuerpo", en: "Feeling better in my body" }, puntos: { fisiologia: 2 } },
      { texto: { es: "Buscar un sentido más profundo a mi vida", en: "Finding deeper meaning in my life" }, puntos: { cabala: 2 } },
      { texto: { es: "Curiosidad: me gusta comprenderlo todo", en: "Curiosity: I like to understand everything" }, puntos: { cultura: 2 } },
    ],
  },
  {
    texto: {
      es: "Tu energía del día a día…",
      en: "Your everyday energy…",
    },
    opciones: [
      { texto: { es: "Sube y baja según lo que como", en: "Rises and falls with what I eat" }, puntos: { nutricion: 2 } },
      { texto: { es: "Va de la mano de mis emociones", en: "Follows my emotions" }, puntos: { tcm: 1, psicologia: 1 } },
      { texto: { es: "Se resiente en cuanto pierdo mis rutinas", en: "Suffers as soon as I lose my routines" }, puntos: { ayurveda: 2 } },
      { texto: { es: "Es un misterio que me gustaría entender", en: "Is a mystery I'd like to understand" }, puntos: { fisiologia: 2 } },
    ],
  },
  {
    texto: {
      es: "¿Qué mapa te gustaría más tener delante?",
      en: "Which map would you most like to look at?",
    },
    opciones: [
      { texto: { es: "El de mi mente y mi historia", en: "The map of my mind and my story" }, puntos: { psicologia: 2 } },
      { texto: { es: "El del cielo del día en que nací", en: "The map of the sky on the day I was born" }, puntos: { astrologia: 2 } },
      { texto: { es: "El de mis órganos y sus emociones", en: "The map of my organs and their emotions" }, puntos: { tcm: 2 } },
      { texto: { es: "El del alma y sus fuerzas", en: "The map of the soul and its forces" }, puntos: { cabala: 2 } },
    ],
  },
  {
    texto: {
      es: "Con tu cuerpo, ¿cómo te llevas?",
      en: "How do you get along with your body?",
    },
    opciones: [
      { texto: { es: "Vivo en mi cabeza; lo escucho poco", en: "I live in my head; I rarely listen to it" }, puntos: { fisiologia: 2 } },
      { texto: { es: "Me manda señales que no sé leer", en: "It sends me signals I don't know how to read" }, puntos: { tcm: 2 } },
      { texto: { es: "Bien cuando mantengo mis hábitos y rutinas", en: "Well, as long as I keep my habits and routines" }, puntos: { ayurveda: 2 } },
      { texto: { es: "Depende mucho de cómo me alimento", en: "It depends a lot on how I eat" }, puntos: { nutricion: 2 } },
    ],
  },
  {
    texto: {
      es: "¿Qué opinas del horóscopo del periódico?",
      en: "What do you think of newspaper horoscopes?",
    },
    opciones: [
      { texto: { es: "Poca cosa: la carta natal de verdad es otra historia", en: "Not much: a real birth chart is another story" }, puntos: { astrologia: 2 } },
      { texto: { es: "Escepticismo, pero el simbolismo me intriga", en: "Sceptical, but the symbolism intrigues me" }, puntos: { astrologia: 1, cultura: 1 } },
      { texto: { es: "Prefiero lo que se puede medir y demostrar", en: "I prefer what can be measured and proven" }, puntos: { fisiologia: 2 } },
      { texto: { es: "Me llaman más otras tradiciones antiguas", en: "Other ancient traditions call to me more" }, puntos: { tcm: 1, ayurveda: 1 } },
    ],
  },
  {
    texto: {
      es: "Si pudieras hacerle una sola pregunta a alguien muy sabio…",
      en: "If you could ask one question of someone very wise…",
    },
    opciones: [
      { texto: { es: "¿Por qué sufro siempre por lo mismo?", en: "Why do I always suffer over the same things?" }, puntos: { psicologia: 2 } },
      { texto: { es: "¿Para qué estoy aquí?", en: "What am I here for?" }, puntos: { cabala: 2 } },
      { texto: { es: "¿Cómo se vive con más equilibrio?", en: "How does one live with more balance?" }, puntos: { ayurveda: 2 } },
      { texto: { es: "¿De dónde venimos?", en: "Where do we come from?" }, puntos: { cultura: 2 } },
    ],
  },
  {
    texto: {
      es: "En tu familia…",
      en: "In your family…",
    },
    opciones: [
      { texto: { es: "Hay historias que se repiten generación tras generación", en: "Some stories repeat generation after generation" }, puntos: { psicologia: 2 } },
      { texto: { es: "La mesa siempre fue importante (para bien o para mal)", en: "The table was always important (for better or worse)" }, puntos: { nutricion: 2 } },
      { texto: { es: "Había remedios y costumbres «de toda la vida»", en: "There were age-old remedies and customs" }, puntos: { tcm: 1, ayurveda: 1 } },
      { texto: { es: "Hay raíces que me gustaría conocer mejor", en: "There are roots I'd like to know better" }, puntos: { cultura: 1, cabala: 1 } },
    ],
  },
  {
    texto: {
      es: "Si El Mapa te regalara una sola cosa…",
      en: "If The Map could give you just one thing…",
    },
    opciones: [
      { texto: { es: "Paz con mi historia", en: "Peace with my story" }, puntos: { psicologia: 2 } },
      { texto: { es: "Un lenguaje para conocerme de verdad", en: "A language to truly know myself" }, puntos: { astrologia: 2 } },
      { texto: { es: "Energía y salud para el día a día", en: "Energy and health for everyday life" }, puntos: { nutricion: 1, fisiologia: 1 } },
      { texto: { es: "Una vida con más sentido", en: "A life with more meaning" }, puntos: { cabala: 2 } },
    ],
  },
];

/** Suma los puntos de las respuestas y devuelve la disciplina ganadora. El
 *  empate lo gana la que va antes en el orden del Mapa (PRESENTACIONES). */
function disciplinaGanadora(respuestas: (number | null)[]): PresentacionDisciplina {
  const suma: Record<string, number> = {};
  respuestas.forEach((elegida, i) => {
    if (elegida === null) return;
    const puntos = PREGUNTAS[i].opciones[elegida].puntos;
    for (const [clave, n] of Object.entries(puntos)) {
      suma[clave] = (suma[clave] ?? 0) + (n ?? 0);
    }
  });
  let ganadora = PRESENTACIONES[0];
  let mejor = -1;
  for (const p of PRESENTACIONES) {
    const s = suma[p.key] ?? 0;
    if (s > mejor) { mejor = s; ganadora = p; }
  }
  return ganadora;
}

export function TestDisciplinaModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const t = useT();
  const { segunIdioma } = useIdioma();
  const navigate = useNavigate();
  const nombreEnMapa = useNombreDisciplinaEnMapa();

  // Una entrada por pregunta: el índice de la opción elegida (null = sin
  // contestar). Vive solo en memoria: cerrar la pestaña lo borra todo.
  const [respuestas, setRespuestas] = useState<(number | null)[]>(
    () => PREGUNTAS.map(() => null),
  );
  const [resultado, setResultado] = useState<PresentacionDisciplina | null>(null);

  useLockBodyScroll(isOpen, { fijarFondo: true });

  // Escape cierra, como en los demás popups.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sinContestar = respuestas.filter((r) => r === null).length;
  const completo = sinContestar === 0;

  const elegir = (pregunta: number, opcion: number) =>
    setRespuestas((prev) => prev.map((r, i) => (i === pregunta ? opcion : r)));

  const terminar = () => {
    if (!completo) return;
    setResultado(disciplinaGanadora(respuestas));
  };

  const R = resultado;

  return (
    <Flex
      position="fixed"
      inset={0}
      zIndex={2000}
      align="center"
      justify="center"
      px={4}
      py={5}
      bg="rgba(0,0,0,0.72)"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      // El velo entra con un fundido suave; la tarjeta sube y se enfoca encima.
      sx={{
        "@keyframes testVelo": { from: { opacity: 0 }, to: { opacity: 1 } },
        animation: "testVelo 0.35s ease-out both",
        "@media (prefers-reduced-motion: reduce)": { animation: "none" },
      }}
    >
      <Reveal blur direction="up" distance={24} scaleFrom={0.955} duration={0.65} display="flex" justifyContent="center">
        <Flex
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          position="relative"
          direction="column"
          w="min(94vw, 620px)"
          maxH="88dvh"
          borderRadius="22px"
          overflow="hidden"
          bg="#008080"
          border="1px solid rgba(255,255,255,0.35)"
          boxShadow="0 26px 80px rgba(0,0,0,0.62)"
        >
          {/* El fondo del RESULTADO: la imagen de la disciplina ganadora, NÍTIDA
              (sin blur: la foto es el premio y tiene que verse). Las acuarelas
              claras llevan un velo oscuro moderado para que la letra del color
              de la disciplina respire; la foto del espacio de Astrología va sin
              velo porque ya es casi negra (media RGB 7,15,33). */}
          {R && (
            <DisciplinaBgLayer
              nom={R.nom}
              imageSrc={R.key === "astrologia" ? "/img/astrologia/space.webp" : undefined}
              borderRadius="22px"
              overlay={R.key === "astrologia" ? undefined : "rgba(0,0,0,0.42)"}
            />
          )}

          {/* X — siempre arriba a la derecha, por encima del scroll. */}
          <Flex
            as="button"
            onClick={onClose}
            aria-label={t("elMetodo.test.cerrar")}
            position="absolute"
            top="12px"
            right="12px"
            zIndex={3}
            w="32px"
            h="32px"
            align="center"
            justify="center"
            borderRadius="full"
            bg="rgba(255,255,255,0.14)"
            border="1px solid rgba(255,255,255,0.35)"
            color="white"
            fontSize="sm"
            cursor="pointer"
            _hover={{ bg: "rgba(255,255,255,0.3)" }}
            transition="background 0.2s ease"
          >
            ✕
          </Flex>

          {!R ? (
            /* ══ CARA 1: EL CUESTIONARIO (columna con scroll vertical) ══ */
            <>
              {/* Cabecera fija: no se va con el scroll. */}
              <Box px={{ base: 5, md: 8 }} pt={{ base: 6, md: 7 }} pb={4} textAlign="center" flexShrink={0}>
                <Text
                  color="white"
                  fontFamily="'EB Garamond', serif"
                  fontWeight="700"
                  fontSize={{ base: "2xl", md: "3xl" }}
                  letterSpacing="0.04em"
                  lineHeight="1.2"
                >
                  <LetrasVivas texto={t("elMetodo.test.titulo")} entrada activo={isOpen} repetir={false} altura={0}
                               periodo={1} paso={0.035} pasoEntrada={0.035} retraso={0.35} />
                </Text>
                <Text
                  color="rgba(255,255,255,0.8)"
                  fontFamily="'EB Garamond', serif"
                  fontStyle="italic"
                  fontSize={{ base: "sm", md: "md" }}
                  mt={1.5}
                >
                  <PalabrasVivas texto={t("elMetodo.test.sub")} retraso={0.6} total={0.7} />
                </Text>
                {/* La rayita de siempre hace de BARRA DE AVANCE: nace en el centro
                    al abrir y se llena hacia los lados según se contesta. */}
                <Box mx="auto" mt={4} h="1px" bg="rgba(255,255,255,0.22)" borderRadius="full" position="relative"
                     w={{ base: "150px", md: "190px" }}
                     sx={{
                       "@keyframes testRayaNace": { from: { transform: "scaleX(0)", opacity: 0 }, to: { transform: "scaleX(1)", opacity: 1 } },
                       animation: "testRayaNace 0.7s cubic-bezier(0.22,1,0.36,1) 0.5s both",
                       "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                     }}>
                  <Box position="absolute" left="50%" top="-0.5px" h="2px" borderRadius="full" bg="white"
                       w={`${((PREGUNTAS.length - sinContestar) / PREGUNTAS.length) * 100}%`}
                       transform="translateX(-50%)"
                       boxShadow="0 0 8px rgba(255,255,255,0.7)"
                       transition="width 0.6s cubic-bezier(0.22,1,0.36,1)" />
                </Box>
              </Box>

              {/* Las preguntas. La barra de scroll, pegada al borde derecho y
                  con el carril transparente. */}
              <Box
                flex="1"
                overflowY="auto"
                px={{ base: 5, md: 8 }}
                pb={{ base: 6, md: 7 }}
                sx={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(255,255,255,0.35) transparent",
                  "&::-webkit-scrollbar": { width: "6px", background: "transparent" },
                  "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.35)", borderRadius: "3px" },
                }}
              >
                {PREGUNTAS.map((p, i) => (
                  // Cada pregunta entra al llegar a ella (sube y se enfoca); la
                  // tres primeras (las que se ven al abrir) van en cascada tras el título;
                  // el resto entra al llegar a ellas, sin espera.
                  <Reveal key={i} inView amount={0.15} blur direction="up" distance={16} duration={0.6}
                          delay={i < 3 ? 0.5 + i * 0.15 : 0} mt={i === 0 ? 0 : 7}>
                  <Box>
                    <Text
                      color="white"
                      fontFamily="'EB Garamond', serif"
                      fontWeight="600"
                      fontSize={{ base: "lg", md: "xl" }}
                      lineHeight="1.35"
                      mb={3}
                    >
                      {i + 1}. {segunIdioma(p.texto)}
                    </Text>
                    <Flex direction="column" gap={2}>
                      {p.opciones.map((o, j) => {
                        const marcada = respuestas[i] === j;
                        // Neutras a propósito: si la píldora marcada se tiñera
                        // del color de su disciplina, el test se chivaría de
                        // hacia dónde apunta cada respuesta. El color es del
                        // RESULTADO, no del camino.
                        return (
                          <Reveal key={j} inView amount={0.2} direction="up" distance={10} duration={0.5}
                                  delay={(i < 3 ? 0.6 + i * 0.15 : 0.05) + j * 0.06}>
                          <Flex
                            as="button"
                            type="button"
                            w="100%"
                            onClick={() => elegir(i, j)}
                            aria-pressed={marcada}
                            align="center"
                            textAlign="left"
                            px={4}
                            py={2.5}
                            borderRadius="14px"
                            border={`1px solid ${marcada ? "white" : "rgba(255,255,255,0.3)"}`}
                            bg={marcada ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.05)"}
                            cursor="pointer"
                            // Al marcarla, un brillo blanco suave (neutro: el color es del
                            // resultado) y al pulsar se hunde un pelín.
                            boxShadow={marcada ? "0 0 16px rgba(255,255,255,0.28)" : "none"}
                            transition="all 0.28s cubic-bezier(0.22,1,0.36,1)"
                            _hover={{ borderColor: "white", bg: marcada ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.14)", transform: "translateX(3px)" }}
                            _active={{ transform: "scale(0.99)" }}
                          >
                            <Text
                              color="white"
                              fontFamily="'EB Garamond', serif"
                              fontSize={{ base: "md", md: "lg" }}
                              fontWeight={marcada ? "700" : "400"}
                              lineHeight="1.4"
                            >
                              {segunIdioma(o.texto)}
                            </Text>
                          </Flex>
                          </Reveal>
                        );
                      })}
                    </Flex>
                  </Box>
                  </Reveal>
                ))}

                {/* El botón de terminar, al final del propio scroll: cuando se
                    llega aquí ya está todo contestado (o casi). */}
                <Flex justify="center" mt={8}>
                  <Flex
                    as="button"
                    type="button"
                    onClick={terminar}
                    align="center"
                    justify="center"
                    px={{ base: 8, md: 12 }}
                    py={{ base: "12px", md: "14px" }}
                    borderRadius="full"
                    border={`1.5px solid ${completo ? "white" : "rgba(255,255,255,0.35)"}`}
                    bg={completo ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.05)"}
                    cursor={completo ? "pointer" : "not-allowed"}
                    opacity={completo ? 1 : 0.75}
                    _hover={completo ? { bg: "rgba(255,255,255,0.24)" } : {}}
                    transition="all 0.2s ease"
                    // Al contestar la última, el botón lo dice con un latido
                    // de luz (3 veces, no más: avisa, no insiste).
                    sx={completo ? {
                      "@keyframes testListo": {
                        "0%, 100%": { boxShadow: "0 0 0 rgba(255,255,255,0)" },
                        "50%": { boxShadow: "0 0 22px rgba(255,255,255,0.55)" },
                      },
                      animation: "testListo 1.8s ease-in-out 0.2s 3",
                      "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                    } : undefined}
                  >
                    <Text
                      color="white"
                      fontFamily="'EB Garamond', serif"
                      fontWeight="700"
                      fontSize={{ base: "md", md: "lg" }}
                      letterSpacing="0.1em"
                      textTransform="uppercase"
                    >
                      {completo
                        ? t("elMetodo.test.ver")
                        : t("elMetodo.test.faltan", { n: sinContestar })}
                    </Text>
                  </Flex>
                </Flex>
              </Box>
            </>
          ) : (
            /* ══ CARA 2: EL RESULTADO (misma tarjeta, fondo de la disciplina) ══
               Habla con la voz de la disciplina: su icono, su nombre y la rayita
               en SU color (Txt). El nombre lleva la sombra del color Bg de la
               disciplina —la misma de los títulos de sus páginas del recorrido
               (MetodoStepHeader)— y el botón va transparente: solo el Txt. */
            <Flex
              position="relative"
              zIndex={1}
              direction="column"
              align="center"
              textAlign="center"
              px={{ base: 6, md: 10 }}
              py={{ base: 12, md: 14 }}
              gap={0}
            >
              <Reveal blur direction="none" scaleFrom={0.7} duration={0.9}>
                <R.Icon size={{ base: "60px", md: "76px" }} />
              </Reveal>

              <Reveal direction="up" distance={10} duration={0.7} delay={0.35}>
              <Text
                color="rgba(255,255,255,0.82)"
                fontFamily="'EB Garamond', serif"
                fontStyle="italic"
                fontSize={{ base: "sm", md: "md" }}
                letterSpacing="0.14em"
                textTransform="uppercase"
                textShadow="0 1px 4px rgba(0,0,0,0.8)"
                mt={5}
              >
                {t("elMetodo.test.resultado")}
              </Text>
              </Reveal>

              <Text
                color={R.txt}
                fontFamily="'EB Garamond', serif"
                fontWeight="700"
                fontSize={{ base: "4xl", md: "5xl" }}
                lineHeight="1.1"
                letterSpacing="0.04em"
                textShadow={`0 1px 3px ${R.bg}f5, 0 0 8px ${R.bg}cc, 0 2px 16px ${R.bg}88`}
                mt={2}
              >
                <LetrasVivas key={R.nom} texto={nombreEnMapa(R.nom)} entrada repetir={false} altura={0}
                             periodo={1} paso={0.05} pasoEntrada={0.05} retraso={0.3} />
              </Text>

              {/* Rayita fina en el acento de la disciplina: separa sin adornar.
                  Se dibuja desde el centro al salir el nombre. */}
              <Box w="56px" h="1px" bg={R.txt} opacity={0.8} my={{ base: 4, md: 5 }}
                   sx={{
                     "@keyframes testRayaResultado": { from: { transform: "scaleX(0)", opacity: 0 }, to: { transform: "scaleX(1)", opacity: 0.8 } },
                     animation: "testRayaResultado 0.7s cubic-bezier(0.22,1,0.36,1) 1s both",
                     "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                   }} />

              {/* La frase del cartel de esa disciplina: su gancho. */}
              <Text
                color="rgba(255,255,255,0.94)"
                fontFamily="'EB Garamond', serif"
                fontStyle="italic"
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="1.7"
                maxW="420px"
                textShadow="0 1px 4px rgba(0,0,0,0.85)"
              >
                <PalabrasVivas texto={segunIdioma(R.gancho)} retraso={1.1} total={0.9} />
              </Text>

              <Reveal direction="up" distance={12} duration={0.7} delay={1.9}>
              <Flex
                as="button"
                type="button"
                onClick={() => navigate(`/d/${R.key}`)}
                align="center"
                justify="center"
                gap="10px"
                mt={{ base: 7, md: 8 }}
                px={{ base: 10, md: 12 }}
                py={{ base: "12px", md: "14px" }}
                borderRadius="full"
                // Transparente a propósito: la foto ya es el fondo y el botón
                // solo dibuja el Txt de la disciplina (borde y letra).
                bg="transparent"
                border={`1.5px solid ${R.txt}`}
                cursor="pointer"
                _hover={{
                  bg: `${R.txt}22`,
                  transform: "translateY(-1px)",
                }}
                _active={{ transform: "translateY(0)" }}
                transition="background 0.22s ease, transform 0.22s ease"
              >
                <Text
                  color={R.txt}
                  fontFamily="'EB Garamond', serif"
                  fontWeight="700"
                  fontSize={{ base: "md", md: "lg" }}
                  letterSpacing="0.1em"
                  textTransform="uppercase"
                >
                  {t("elMetodo.test.verDisciplina")}
                </Text>
              </Flex>
              </Reveal>
            </Flex>
          )}
        </Flex>
      </Reveal>
    </Flex>
  );
}
