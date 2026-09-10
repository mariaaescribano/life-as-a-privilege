import React, { useEffect, useState } from "react";
import { useT } from "../../i18n";
import { Box, Flex, Text, Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";
import axios from "axios";
import { ComicViewer } from "./ComicViewer";
import { TcmLoader } from "./comicLoaders";
import { API_URL } from "../../GlobalVariables";
import {
  ELEMENTOS, ESCALAS, testsDeElemento, testCompleto, respondidasTest,
  puntoRespuesta, puntosElemento,
  type DatosTcm, type Elemento, type TestElemento,
} from "./tcmRecorrido";
import { FOTO_ELEMENTO, COMIC_ELEMENTO } from "./tcmElementosContenido";
import { pasosElementoEn } from "./tcmElementosEn";
import { useIdioma } from "../../i18n";

// Preposición del título del test según el género del elemento ("de la Madera",
// "del Fuego"…), para que quede "TEST DE LA MADERA".
const TEST_PREP: Record<Elemento, string> = {
  madera: "de la", fuego: "del", tierra: "de la", metal: "del", agua: "del",
};

// ─────────────────────────────────────────────────────────────────────────
// Modal reutilizable con el cómic de un elemento (viñetas + tests de balance
// embebidos). Autoguarda cada respuesta y, al terminar, marca el elemento como
// leído. Lo usan tanto la página de Los Cinco Elementos como el Diagnóstico.
// ─────────────────────────────────────────────────────────────────────────
export function ElementoComicModal({
  elemento,
  data,
  onChangeData,
  onClose,
  onComplete,
}: {
  elemento: Elemento | null;
  data: DatosTcm;
  onChangeData: (next: DatosTcm) => void;
  onClose: () => void;
  /** Se llama al terminar el cómic (además de marcar el elemento como leído). */
  onComplete?: (el: Elemento) => void;
}) {
  const { idioma } = useIdioma();
  // Respuestas del mini-test embebido en el cómic del elemento abierto.
  const [respuestasTest, setRespuestasTest] = useState<Record<string, string>>({});

  // Al abrir un elemento, prerrellenamos con lo ya respondido (que no se repita).
  useEffect(() => {
    if (elemento) setRespuestasTest(data.elementos?.[elemento]?.miniTest?.respuestas ?? {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elemento]);

  // Persiste el estado del elemento (respuestas + puntos, y opcionalmente leído).
  const persistir = async (el: Elemento, respuestas: Record<string, string>, leido?: boolean) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const puntos = puntosElemento(el, respuestas);
    const next: DatosTcm = {
      ...data,
      elementos: {
        ...data.elementos,
        [el]: {
          ...data.elementos?.[el],
          ...(leido ? { leido: true } : {}),
          miniTest: { respuestas, puntos },
        },
      },
    };
    onChangeData(next);
    if (userId && token) {
      try {
        await axios.patch(`${API_URL}/metodo-tcm/${userId}`, { data: next },
          { headers: { Authorization: `Bearer ${token}` } });
      } catch { /* el estado local ya refleja el cambio */ }
    }
  };

  // Autoguardado: cada vez que el usuario marca una opción, se guarda al instante.
  const elegirTest = (preguntaKey: string, opcionKey: string) => {
    if (!elemento) return;
    const next = { ...respuestasTest, [preguntaKey]: opcionKey };
    setRespuestasTest(next);
    void persistir(elemento, next);
  };

  const marcarLeido = async (el: Elemento) => {
    await persistir(el, respuestasTest, true);
  };

  return (
    <Modal isOpen={!!elemento} onClose={onClose} size="full" scrollBehavior="outside" motionPreset="none">
      <ModalOverlay bg="rgba(0,0,0,0.85)" sx={{ backdropFilter: "blur(20px)" }} />
      <ModalContent bg="transparent" border="none" borderRadius="0" boxShadow="none" m={0} minH="100dvh" position="relative" sx={{ transform: "none !important" }}>
        {elemento && (() => {
          // El español manda: de él salen el orden, las fotos y los tests. Del
          // inglés, solo el texto de las viñetas.
          const pasos = idioma === "en"
            ? pasosElementoEn(elemento, COMIC_ELEMENTO[elemento])
            : COMIC_ELEMENTO[elemento];
          const tests = testsDeElemento(elemento);
          const vinetas = pasos.map((p) => ({
            src: p.src,
            paragraphs: p.tipo === "vineta" ? p.paragraphs : (p.intro ?? []),
          }));
          const testDePaso = (i: number): TestElemento | null => {
            const p = pasos[i];
            if (p?.tipo !== "test" || !p.testKey) return null;
            return tests.find((t) => t.key === p.testKey) ?? null;
          };
          const cabecera = `Test ${TEST_PREP[elemento]} ${ELEMENTOS[elemento].nombre}`;
          return (
            <ComicViewer
              key={elemento}
              vinetas={vinetas}
              themeColor={ELEMENTOS[elemento].color}
              textColor="#ffffff"
              // Sombra oscura, nítida y sin halo blanco: máximo contraste entre
              // la letra (blanca) y su sombra, para que el texto destaque más.
              textShadow="0 2px 5px rgba(0,0,0,1), 0 0 3px rgba(0,0,0,0.98), 0 6px 20px rgba(0,0,0,0.85)"
              disciplinaBgImage={FOTO_ELEMENTO[elemento]}
              disciplinaBgColor={ELEMENTOS[elemento].color}
              // Animación de carga (yin-yang) y barra de scroll en BLANCO, para
              // que casen con la letra blanca del cómic y quede limpio.
              loader={<TcmLoader color="#ffffff" />}
              scrollbarColor="#ffffff"
              // No mostramos el cómic hasta que la foto del elemento (fondo) esté
              // totalmente cargada: mientras, el loader de TCM a pantalla completa.
              esperarFondo
              sinSaltar
              // La tinta china es muy clara (niebla casi blanca) y aquí se
              // escribe en blanco: sin apagar un poco la foto, el texto y los
              // enunciados del test se pierden contra el cuadro.
              veloOscuro={0.4}
              // Sin `fondoNitido`: usamos EXACTAMENTE el mismo box, estructura y
              // fondo que las Ilustraciones de TCM (mismo glow de color, mismo
              // velo y desenfoque), por coherencia. Solo cambian la foto y el
              // color de acento de cada elemento.
              bloqueado={(i) => {
                if (pasos[i]?.tipo !== "test") return false;
                const t = testDePaso(i);
                return !t || !testCompleto(t, respuestasTest);
              }}
              sinFoto={(i) => pasos[i]?.tipo === "test"}
              separarFrases
              pageExtra={(i, api) => {
                if (pasos[i]?.tipo !== "test") return null;
                const t = testDePaso(i);
                if (!t) return null;
                const idx = tests.findIndex((x) => x.key === t.key);
                return (
                  <TestEscalaComic
                    key={t.key}
                    test={t}
                    testNum={idx + 1}
                    testTotal={tests.length}
                    cabecera={cabecera}
                    respuestas={respuestasTest}
                    onElegir={elegirTest}
                    color={ELEMENTOS[elemento].color}
                    completo={testCompleto(t, respuestasTest)}
                    onContinuar={api.goNext}
                  />
                );
              }}
              onClose={onClose}
              onComplete={() => { const el = elemento; onClose(); if (el) { void marcarLeido(el); onComplete?.(el); } }}
            />
          );
        })()}
      </ModalContent>
    </Modal>
  );
}

// ── Test de escala (0-4) embebido en el cómic del elemento ──────────────────
// Los tres cuestionarios se responden aquí: una frase por línea y, debajo, los
// cinco botones de la escala. El número es lo que se guarda (como texto), y el
// rótulo de la escala se enseña arriba una sola vez y en el botón elegido, para
// no repetir cinco palabras largas en cada frase.
function TestEscalaComic({
  test, testNum, testTotal, cabecera, respuestas, onElegir, color, completo, onContinuar,
}: {
  test: TestElemento;
  testNum: number;
  testTotal: number;
  cabecera: string;
  respuestas: Record<string, string>;
  onElegir: (preguntaKey: string, opcionKey: string) => void;
  color: string;
  completo: boolean;
  onContinuar: () => void;
}) {
  const t = useT();
  const [guardado, setGuardado] = useState(false);
  const rotulos = ESCALAS[test.escala];
  const hechas = respondidasTest(test, respuestas);
  const totalFrases = test.preguntas.length;

  return (
    <Flex direction="column" gap={5} textAlign="left">
      <Box>
        <Text color="white" fontSize={{ base: "lg", md: "2xl" }} fontWeight="800" letterSpacing="0.14em"
              textAlign="center" textTransform="uppercase" style={{ textShadow: "0 2px 6px rgba(0,0,0,1), 0 0 4px rgba(0,0,0,1)" }}>
          {cabecera}{testTotal > 1 ? ` · ${testNum} de ${testTotal}` : ""}
        </Text>
        <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "md", md: "lg" }} fontStyle="italic"
              textAlign="center" mt={1.5} style={{ textShadow: "0 2px 6px rgba(0,0,0,1), 0 0 4px rgba(0,0,0,1)" }}>
          {test.titulo}
        </Text>
        <Box mt={3} h="1px" w="100%" bgGradient={`linear(to-r, transparent, ${color}cc, transparent)`} />
      </Box>

      {/* Enunciado del cuestionario + la escala, una sola vez arriba */}
      {test.enunciado && (
        <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "md", md: "lg" }} lineHeight="1.65"
              style={{ textShadow: "0 2px 6px rgba(0,0,0,1), 0 0 4px rgba(0,0,0,1)" }}>
          {test.enunciado}
        </Text>
      )}

      <Box borderRadius="lg" px={{ base: 3.5, md: 5 }} py={{ base: 3, md: 3.5 }}
           bg="rgba(0,0,0,0.42)" border={`1px solid ${color}66`} sx={{ backdropFilter: "blur(8px)" }}>
        <Text color="white" fontSize={{ base: "sm", md: "md" }} fontWeight="700" mb={2}
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>
          {t("metodo.tcm.el.respondeEscala")}
        </Text>
        <Flex wrap="wrap" gap={{ base: 2, md: 3.5 }}>
          {rotulos.map((r, n) => (
            <Flex key={n} align="center" gap={1.5}>
              <Text color={color} fontSize={{ base: "sm", md: "md" }} fontWeight="800"
                    style={{ textShadow: "0 1px 4px rgba(0,0,0,0.95)" }}>{n}</Text>
              <Text color="rgba(255,255,255,0.88)" fontSize={{ base: "xs", md: "sm" }}
                    style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>{r}</Text>
            </Flex>
          ))}
        </Flex>
      </Box>

      {test.preguntas.map((q, i) => {
        const valor = puntoRespuesta(respuestas[q.key]);
        return (
          <Box key={q.key}>
            <Text color="white" fontSize={{ base: "lg", md: "xl" }} fontWeight="700" mb={2.5}
                  style={{ textShadow: "0 2px 6px rgba(0,0,0,1), 0 0 4px rgba(0,0,0,1)" }}>
              {i + 1}. {q.texto}
            </Text>
            <Flex align="center" gap={{ base: 2, md: 2.5 }} wrap="wrap">
              {rotulos.map((rotulo, n) => {
                const sel = valor === n;
                return (
                  <Box key={n} as="button" title={rotulo}
                       onClick={() => { setGuardado(false); onElegir(q.key, String(n)); }}
                       w={{ base: "42px", md: "48px" }} h={{ base: "42px", md: "48px" }}
                       flexShrink={0} borderRadius="full"
                       display="flex" alignItems="center" justifyContent="center"
                       bg={sel ? color : "rgba(0,0,0,0.42)"}
                       border={`1px solid ${sel ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.22)"}`}
                       color="white" fontFamily="'EB Garamond', serif"
                       fontSize={{ base: "lg", md: "xl" }} fontWeight="800"
                       cursor="pointer" transition="all 0.15s"
                       boxShadow={sel ? `0 0 16px ${color}` : "none"}
                       _hover={{ bg: sel ? color : "rgba(0,0,0,0.6)", transform: "translateY(-1px)" }}
                       sx={{ backdropFilter: "blur(8px)" }}
                       style={{ textShadow: "0 1px 4px rgba(0,0,0,0.95)" }}>
                    {n}
                  </Box>
                );
              })}
              {/* El rótulo de lo elegido, al lado: así la escala no hay que
                  releerla arriba en cada frase. */}
              {valor !== null && (
                <Text color="white" fontSize={{ base: "sm", md: "md" }} fontWeight="700" fontStyle="italic"
                      ml={1} style={{ textShadow: `0 1px 4px rgba(0,0,0,0.95), 0 0 12px ${color}` }}>
                  {rotulos[valor]}
                </Text>
              )}
            </Flex>
            {/* Separador tras cada frase: da aire al test */}
            <Box h="1px" w="100%" mt={5} bgGradient={`linear(to-r, transparent, ${color}55, transparent)`} />
          </Box>
        );
      })}

      <Flex justify="flex-end" align="center" gap={3} mt={1}>
        <Text color="rgba(255,255,255,0.8)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" mr="auto"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>
          {hechas} / {totalFrases} {t("metodo.tcm.el.frasesHechas")}
        </Text>
        {guardado && (
          <Text color="white" fontSize={{ base: "sm", md: "md" }} fontWeight="700" fontStyle="italic"
                style={{ textShadow: `0 1px 4px rgba(0,0,0,0.85), 0 0 12px ${color}` }}>
            {t("metodo.guardadoOk")}
          </Text>
        )}
        <Box as="button"
          onClick={() => { if (guardado) { onContinuar(); } else if (completo) { setGuardado(true); } }}
          opacity={!guardado && !completo ? 0.45 : 1}
          cursor={!guardado && !completo ? "not-allowed" : "pointer"}
          px={{ base: 9, md: 10 }} py={3.5} borderRadius="full" bg={color} border="2px solid rgba(255,255,255,0.85)"
          color="white" fontFamily="'EB Garamond', serif" fontSize={{ base: "lg", md: "xl" }} fontWeight="800"
          letterSpacing="0.1em" transition="all 0.18s ease" boxShadow={`0 0 22px ${color}, 0 4px 18px rgba(0,0,0,0.5)`}
          _hover={!guardado && !completo ? {} : { bg: color, transform: "translateY(-2px)", boxShadow: `0 0 34px ${color}, 0 6px 24px rgba(0,0,0,0.55)` }}
          style={{ textShadow: "0 1px 5px rgba(0,0,0,0.95), 0 0 3px rgba(0,0,0,0.9)" }}>
          {guardado ? "Continuar →" : "Guardar"}
        </Box>
      </Flex>
    </Flex>
  );
}
