import React, { useEffect, useState } from "react";
import { Box, Flex, Text, Modal, ModalOverlay, ModalContent } from "@chakra-ui/react";
import axios from "axios";
import { ComicViewer } from "./ComicViewer";
import { TcmLoader } from "./comicLoaders";
import { API_URL } from "../../GlobalVariables";
import {
  ELEMENTOS, testsDeElemento, testCompleto, puntosElemento,
  type DatosTcm, type Elemento, type PreguntaTest, type TestElemento,
} from "./tcmRecorrido";
import { FOTO_ELEMENTO, COMIC_ELEMENTO } from "./tcmElementosContenido";

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
  // Respuestas del mini-test embebido en el cómic del elemento abierto.
  const [respuestasTest, setRespuestasTest] = useState<Record<string, string>>({});

  // Al abrir un elemento, prerrellenamos con lo ya respondido (que no se repita).
  useEffect(() => {
    if (elemento) setRespuestasTest(data.elementos?.[elemento]?.miniTest?.respuestas ?? {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elemento]);

  // Persiste el estado del elemento (respuestas + puntos, y opcionalmente leído).
  const persistir = async (el: Elemento, respuestas: Record<string, string>, leido?: boolean) => {
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
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
      <ModalContent bg="transparent" border="none" borderRadius="0" boxShadow="none" m={0} minH="100vh" position="relative" sx={{ transform: "none !important" }}>
        {elemento && (() => {
          const pasos = COMIC_ELEMENTO[elemento];
          const tests = testsDeElemento(elemento);
          const miniTest = ELEMENTOS[elemento].miniTest; // legacy (elementos sin migrar)
          const vinetas = pasos.map((p) => ({
            src: p.src,
            paragraphs: p.tipo === "vineta" ? p.paragraphs : (p.intro ?? []),
          }));
          const legacyRespondido = miniTest.every((q) => !!respuestasTest[q.key]);
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
              // Sin `fondoNitido`: usamos EXACTAMENTE el mismo box, estructura y
              // fondo que las Ilustraciones de TCM (mismo glow de color, mismo
              // velo y desenfoque), por coherencia. Solo cambian la foto y el
              // color de acento de cada elemento.
              bloqueado={(i) => {
                if (pasos[i]?.tipo !== "test") return false;
                const t = testDePaso(i);
                return t ? !testCompleto(t, respuestasTest) : !legacyRespondido;
              }}
              sinFoto={(i) => pasos[i]?.tipo === "test"}
              separarFrases
              pageExtra={(i, api) => {
                if (pasos[i]?.tipo !== "test") return null;
                const t = testDePaso(i);
                if (t) {
                  const idx = tests.findIndex((x) => x.key === t.key);
                  return (
                    <TestBalanceComic
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
                }
                return (
                  <MiniTestComic
                    titulo={cabecera}
                    preguntas={miniTest}
                    respuestas={respuestasTest}
                    onElegir={elegirTest}
                    color={ELEMENTOS[elemento].color}
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

// ── Mini-test embebido en el cómic del elemento (legacy) ────────────────────
function MiniTestComic({
  titulo, preguntas, respuestas, onElegir, color,
}: {
  titulo: string;
  preguntas: PreguntaTest[];
  respuestas: Record<string, string>;
  onElegir: (preguntaKey: string, opcionKey: string) => void;
  color: string;
}) {
  const faltan = preguntas.some((q) => !respuestas[q.key]);
  return (
    <Flex direction="column" gap={5} textAlign="left">
      <Box>
        <Text color="white" fontSize={{ base: "lg", md: "2xl" }} fontWeight="800" letterSpacing="0.14em"
              textAlign="center" textTransform="uppercase" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>
          {titulo}
        </Text>
        <Box mt={3} h="1px" w="100%" bgGradient={`linear(to-r, transparent, ${color}cc, transparent)`} />
      </Box>

      {preguntas.map((q, i) => (
        <Box key={q.key}>
          <Text color="white" fontSize={{ base: "md", md: "lg" }} fontWeight="700" mb={2.5}
                style={{ textShadow: "0 2px 6px rgba(0,0,0,1), 0 0 4px rgba(0,0,0,1)" }}>
            {i + 1}. {q.pregunta}
          </Text>
          <Flex direction="column" gap={2}>
            {q.opciones.map((op) => {
              const sel = respuestas[q.key] === op.key;
              return (
                <Box key={op.key} as="button" onClick={() => onElegir(q.key, op.key)} textAlign="left"
                  px={{ base: 3.5, md: 4 }} py={{ base: 2, md: 2.5 }} borderRadius="lg"
                  bg={sel ? `${color}44` : "rgba(255,255,255,0.08)"}
                  border={`1px solid ${sel ? color : "rgba(255,255,255,0.15)"}`}
                  color="white" fontFamily="'EB Garamond', serif" fontSize={{ base: "sm", md: "md" }}
                  lineHeight="1.5" cursor="pointer" transition="all 0.15s"
                  boxShadow={sel ? `0 0 14px ${color}88` : "none"}
                  _hover={{ bg: sel ? `${color}55` : "rgba(255,255,255,0.14)" }}
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.85)" }}>
                  {op.texto}
                </Box>
              );
            })}
          </Flex>
          {/* Separador tras cada pregunta: da aire al test */}
          <Box h="1px" w="100%" mt={5} bgGradient={`linear(to-r, transparent, ${color}55, transparent)`} />
        </Box>
      ))}
      <Text color="rgba(255,255,255,0.75)" fontSize="xs" fontStyle="italic"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.85)" }}>
        {faltan ? "Responde para continuar →" : "¡Listo! Ya puedes continuar →"}
      </Text>
    </Flex>
  );
}

// ── Test de balance (A/B/C = equilibrio/exceso/deficiencia) ─────────────────
function TestBalanceComic({
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
  const [guardado, setGuardado] = useState(false);
  return (
    <Flex direction="column" gap={5} textAlign="left">
      <Box>
        <Text color="white" fontSize={{ base: "lg", md: "2xl" }} fontWeight="800" letterSpacing="0.14em"
              textAlign="center" textTransform="uppercase" style={{ textShadow: "0 2px 6px rgba(0,0,0,1), 0 0 4px rgba(0,0,0,1)" }}>
          {cabecera}{testTotal > 1 ? ` · ${testNum} de ${testTotal}` : ""}
        </Text>
        {test.titulo && (
          <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "md", md: "lg" }} fontStyle="italic"
                textAlign="center" mt={1.5} style={{ textShadow: "0 2px 6px rgba(0,0,0,1), 0 0 4px rgba(0,0,0,1)" }}>
            {test.titulo}
          </Text>
        )}
        <Box mt={3} h="1px" w="100%" bgGradient={`linear(to-r, transparent, ${color}cc, transparent)`} />
      </Box>

      {test.preguntas.map((q, i) => (
        <Box key={q.key}>
          <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" mb={3}
                style={{ textShadow: "0 2px 6px rgba(0,0,0,1), 0 0 4px rgba(0,0,0,1)" }}>
            {i + 1}. {q.pregunta}{q.opcional ? " (opcional)" : ""}
          </Text>
          <Flex direction="column" gap={2}>
            {q.opciones.map((op) => {
              const sel = respuestas[q.key] === op.key;
              return (
                <Box key={op.key} as="button" onClick={() => { setGuardado(false); onElegir(q.key, op.key); }}
                  textAlign="left" px={{ base: 4, md: 5 }} py={{ base: 2.5, md: 3 }} borderRadius="lg"
                  bg={sel ? `${color}66` : "rgba(0,0,0,0.42)"}
                  border={`1px solid ${sel ? color : "rgba(255,255,255,0.22)"}`}
                  color="white" fontFamily="'EB Garamond', serif" fontSize={{ base: "lg", md: "xl" }}
                  lineHeight="1.55" cursor="pointer" transition="all 0.15s"
                  boxShadow={sel ? `0 0 14px ${color}88` : "none"}
                  _hover={{ bg: sel ? `${color}77` : "rgba(0,0,0,0.55)" }}
                  sx={{ backdropFilter: "blur(8px)" }}
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.9)" }}>
                  {op.texto}
                </Box>
              );
            })}
          </Flex>
          {/* Separador tras cada pregunta: da aire al test */}
          <Box h="1px" w="100%" mt={5} bgGradient={`linear(to-r, transparent, ${color}55, transparent)`} />
        </Box>
      ))}

      <Flex justify="flex-end" align="center" gap={3} mt={1}>
        {guardado && (
          <Text color="white" fontSize={{ base: "sm", md: "md" }} fontWeight="700" fontStyle="italic"
                style={{ textShadow: `0 1px 4px rgba(0,0,0,0.85), 0 0 12px ${color}` }}>
            Guardado ✓
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
