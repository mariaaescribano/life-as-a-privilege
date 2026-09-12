import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Flex, Modal, ModalContent, ModalOverlay, Text } from "@chakra-ui/react";
import axios from "axios";
import { API_URL, tcmBg, tcmNom, tcmTxt } from "../../GlobalVariables";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { glowHeader } from "./FotoBox";
import { flushSaves } from "../../utils/flushSaves";
import type { DatosTcm } from "./tcmRecorrido";
import {
  ENUNCIADO, GRUPOS_CONSTITUCION, NOMBRE_BLOQUE, NO, SI,
  TOTAL_FRASES_CONSTITUCION, constitucionCompleta, respondidasConstitucion,
  respondidasGrupo, respuestasConstitucion,
} from "./tcmConstitucion";

// ─────────────────────────────────────────────────────────────────────────
// El test de la Constitución (paso 3 de Medicina China).
//
// Son 200 frases, así que NO van todas en una lista: se pasan de diez en diez
// grupos (los cinco elementos × los dos bloques). El elemento de cada grupo NO
// se enseña —saber que estás en «el bloque de la Madera» condiciona lo que
// respondes—: arriba solo se lee el bloque y el «3 de 10».
//
// SE HACE DE UNA SENTADA. A media escritura no se guarda NADA: el test solo
// viaja a la BD cuando está entero, porque una constitución a medias no dice
// nada (los porcentajes se calculan sobre lo contestado y un test abandonado
// daría un elemento falso). El aviso está a la vista dentro del popup y, si
// intenta salir a medias, se le pregunta antes.
//
// Es un popup a pantalla completa con la pintura de TCM de fondo: la misma
// sensación inmersiva de los cómics, no una página con una caja.
// ─────────────────────────────────────────────────────────────────────────

export function TestConstitucionModal({
  abierto,
  data,
  onChangeData,
  onClose,
  onCompletar,
}: {
  abierto: boolean;
  data: DatosTcm;
  onChangeData: (next: DatosTcm) => void;
  onClose: () => void;
  /** Se llama al terminar la última frase y pulsar «Ver mi resultado». */
  onCompletar?: () => void;
}) {
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [idx, setIdx] = useState(0);
  const [confirmarSalida, setConfirmarSalida] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // La copia más fresca de los datos: el blob `data` se REEMPLAZA entero en
  // cada PATCH, así que hay que construirlo siempre sobre lo último que hay.
  const dataRef = useRef(data);
  useEffect(() => { dataRef.current = data; }, [data]);

  // Al abrir: si ya hizo el test entero, se le enseñan sus marcas (que no tenga
  // que acordarse de lo que puso); si no, se empieza limpio por la primera
  // pantalla, porque lo de la vez que abandonó no se guardó.
  useEffect(() => {
    if (!abierto) return;
    const guardadas = respuestasConstitucion(data);
    setRespuestas(constitucionCompleta(guardadas) ? guardadas : {});
    setIdx(0);
    setConfirmarSalida(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierto]);

  const responder = (key: string, valor: string) => {
    setRespuestas((prev) => ({ ...prev, [key]: valor }));
  };

  // ── Guardado · UNA sola vez, con el test terminado ───────────────────────
  const guardarResultado = async (r: Record<string, string>) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const next: DatosTcm = { ...dataRef.current, constitucion: { respuestas: r } };
    dataRef.current = next;
    onChangeData(next);
    if (!userId || !token) return;
    try {
      await axios.patch(`${API_URL}/metodo-tcm/${userId}`, { data: next },
        { headers: { Authorization: `Bearer ${token}` } });
    } catch { /* el estado local ya refleja el cambio */ }
    // El paso siguiente se desbloquea con esto guardado: que salga antes de
    // navegar o la página de al lado rebotaría.
    await flushSaves();
  };

  // ── Navegación entre grupos ─────────────────────────────────────────────
  const grupo = GRUPOS_CONSTITUCION[idx];
  const hechasGrupo = grupo ? respondidasGrupo(grupo, respuestas) : 0;
  const grupoCompleto = !!grupo && hechasGrupo === grupo.frases.length;
  const hechasTotal = useMemo(() => respondidasConstitucion(respuestas), [respuestas]);
  const ultimo = idx === GRUPOS_CONSTITUCION.length - 1;
  const todoHecho = constitucionCompleta(respuestas);

  const irA = (n: number) => {
    setIdx(n);
    scrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  /** La X y el clic fuera: si lleva frases sin terminar, se le pregunta. */
  const intentarCerrar = () => {
    if (!todoHecho && hechasTotal > 0) { setConfirmarSalida(true); return; }
    onClose();
  };

  const terminar = async () => {
    await guardarResultado(respuestas);
    onCompletar?.();
    onClose();
  };

  if (!grupo) return null;

  const puedeSeguir = ultimo ? todoHecho : grupoCompleto;

  return (
    <Modal isOpen={abierto} onClose={intentarCerrar} size="full" scrollBehavior="inside" motionPreset="none">
      <ModalOverlay bg="rgba(0,0,0,0.85)" sx={{ backdropFilter: "blur(20px)" }} />
      <ModalContent bg={tcmBg} border="none" borderRadius="0" boxShadow="none" m={0}
                    minH="100dvh" fontFamily="'EB Garamond', serif" overflow="hidden"
                    sx={{ transform: "none !important" }}>

        {/* La pintura de TCM a pantalla completa: el popup ES el fondo. */}
        <DisciplinaBgLayer nom={tcmNom} borderRadius="0" blur />
        <Box position="absolute" inset={0} bg={`${tcmBg}b8`} pointerEvents="none" />

        {/* Cerrar (arriba a la derecha) */}
        <Box as="button" onClick={intentarCerrar} position="fixed" top={{ base: 3, md: 5 }} right={{ base: 3, md: 5 }}
             zIndex={20} w="42px" h="42px" borderRadius="full" bg="rgba(0,0,0,0.45)"
             border={`1px solid ${tcmTxt}99`} color={tcmTxt} fontSize="xl" fontWeight="700"
             display="flex" alignItems="center" justifyContent="center"
             _hover={{ bg: "rgba(0,0,0,0.65)" }} aria-label="Cerrar el test">
          ✕
        </Box>

        <Box ref={scrollRef as any} position="relative" zIndex={1} flex="1" overflowY="auto"
             px={{ base: 4, md: 10 }} pt={{ base: 7, md: 10 }} pb={{ base: 10, md: 14 }}>
          <Flex direction="column" align="center" w="100%" maxW="820px" mx="auto" gap={6}
                style={{ textShadow: `0 1px 3px ${tcmBg}f5, 0 0 8px ${tcmBg}cc` }}>

            {/* Cabecera: bloque + en qué pantalla va */}
            <Flex direction="column" align="center" gap={1.5} textAlign="center">
              <Text color={tcmTxt} fontSize={{ base: "xl", md: "3xl" }} fontWeight="800"
                    letterSpacing="0.14em" textTransform="uppercase">
                Tu constitución
              </Text>
              <Text color="white" fontSize={{ base: "md", md: "lg" }} fontStyle="italic" opacity={0.92}>
                {NOMBRE_BLOQUE[grupo.bloque]} · {idx + 1} de {GRUPOS_CONSTITUCION.length}
              </Text>
            </Flex>

            {/* Barra de avance, la cuenta de frases y el aviso de que esto no
                se guarda hasta el final. Todo DENTRO del test. */}
            <Box w="100%" maxW="520px">
              <Box h="6px" w="100%" borderRadius="full" bg="rgba(255,255,255,0.25)" overflow="hidden">
                <Box h="100%" borderRadius="full" bg={tcmTxt} transition="width 0.3s ease"
                     w={`${Math.round((hechasTotal / TOTAL_FRASES_CONSTITUCION) * 100)}%`} />
              </Box>
              <Text color="white" fontSize="sm" textAlign="center" mt={1.5} opacity={0.9}>
                {hechasTotal} / {TOTAL_FRASES_CONSTITUCION}
              </Text>
              <Text color="white" fontSize="xs" fontStyle="italic" textAlign="center" mt={1} opacity={0.8}
                    lineHeight="1.6">
                El test se hace de una sentada: si sales antes de terminarlo no se guarda
                nada de lo que lleves. Solo se guarda tu resultado, al final.
              </Text>
            </Box>

            {/* La caja con las frases */}
            <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={glowHeader(tcmTxt)}>
              <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
              <Box position="absolute" inset={0} bg={`${tcmBg}b3`} borderRadius="2xl" />
              <Box position="relative" px={{ base: 4, md: 8 }} py={{ base: 5, md: 8 }}>
                <Text color={tcmTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="800" mb={1}>
                  {ENUNCIADO[grupo.bloque]}
                </Text>
                <Text color={tcmTxt} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" opacity={0.85} mb={5}>
                  {grupo.bloque === "psicologico"
                    ? "Responde sin pensarlo mucho: lo primero que te salga."
                    : "Responde por lo que te pasa de forma habitual, no por algo puntual."}
                </Text>

                {grupo.frases.map((f, i) => {
                  const valor = respuestas[f.key];
                  return (
                    <Box key={f.key} mb={i === grupo.frases.length - 1 ? 0 : 4}>
                      <Text color={tcmTxt} fontSize={{ base: "md", md: "lg" }} fontWeight="600" mb={2}>
                        {i + 1}. {f.texto}
                      </Text>
                      <Flex gap={2.5}>
                        {[{ v: SI, r: "Sí" }, { v: NO, r: "No" }].map(({ v, r }) => {
                          const sel = valor === v;
                          return (
                            <Box key={v} as="button" onClick={() => responder(f.key, v)}
                                 px={{ base: 6, md: 8 }} py={1.5} borderRadius="full"
                                 bg={sel ? tcmTxt : "rgba(0,0,0,0.25)"}
                                 color={sel ? tcmBg : tcmTxt}
                                 border={`1px solid ${sel ? tcmTxt : `${tcmTxt}66`}`}
                                 fontSize={{ base: "md", md: "lg" }} fontWeight="700"
                                 fontFamily="'EB Garamond', serif" cursor="pointer" transition="all 0.15s"
                                 style={{ textShadow: "none" }}
                                 _hover={sel ? {} : { bg: `${tcmTxt}22` }}>
                              {r}
                            </Box>
                          );
                        })}
                      </Flex>
                      {i < grupo.frases.length - 1 && (
                        <Box h="1px" w="100%" mt={4} bg={`${tcmTxt}33`} />
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* Pie: cuántas van de este grupo y el botón de avanzar */}
            <Flex w="100%" align="center" justify="space-between" gap={4} wrap="wrap">
              <Text color="white" fontSize={{ base: "sm", md: "md" }} fontStyle="italic">
                {hechasGrupo} / {grupo.frases.length} en esta pantalla
              </Text>
              <Flex gap={3} ml="auto">
                {idx > 0 && (
                  <Box as="button" onClick={() => irA(idx - 1)}
                       px={{ base: 6, md: 8 }} py={2.5} borderRadius="full"
                       bg="rgba(0,0,0,0.3)" border="1px solid rgba(255,255,255,0.6)" color="white"
                       fontFamily="'EB Garamond', serif" fontSize={{ base: "md", md: "lg" }} fontWeight="700"
                       cursor="pointer" _hover={{ bg: "rgba(255,255,255,0.14)" }}>
                    ← Atrás
                  </Box>
                )}
                <Box as="button"
                     onClick={() => { if (ultimo) { if (todoHecho) void terminar(); } else if (grupoCompleto) irA(idx + 1); }}
                     opacity={puedeSeguir ? 1 : 0.45}
                     cursor={puedeSeguir ? "pointer" : "not-allowed"}
                     title={puedeSeguir ? undefined : "Responde todas las frases para seguir"}
                     px={{ base: 7, md: 10 }} py={2.5} borderRadius="full"
                     bg={tcmTxt} color={tcmBg} border="2px solid rgba(255,255,255,0.75)"
                     fontFamily="'EB Garamond', serif" fontSize={{ base: "md", md: "lg" }} fontWeight="800"
                     letterSpacing="0.06em" transition="all 0.18s ease"
                     boxShadow={glowHeader(tcmTxt)} style={{ textShadow: "none" }}
                     _hover={puedeSeguir ? { transform: "translateY(-2px)" } : {}}>
                  {ultimo ? "Ver mi resultado" : "Siguiente →"}
                </Box>
              </Flex>
            </Flex>
          </Flex>
        </Box>

        {/* ── Salir a medias: se avisa de que se pierde ────────────────── */}
        {confirmarSalida && (
          <Flex position="fixed" inset={0} zIndex={30} align="center" justify="center"
                bg="rgba(0,0,0,0.72)" px={5}>
            <Box position="relative" w="100%" maxW="440px" borderRadius="2xl" overflow="hidden"
                 boxShadow={glowHeader(tcmTxt)}>
              <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
              <Box position="absolute" inset={0} bg={`${tcmBg}e6`} />
              <Flex position="relative" direction="column" gap={4} px={{ base: 6, md: 8 }} py={{ base: 6, md: 7 }}>
                <Text color={tcmTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight="800">
                  ¿Salir del test?
                </Text>
                <Text color={tcmTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.7">
                  Llevas {hechasTotal} de {TOTAL_FRASES_CONSTITUCION} frases y no se guarda nada
                  hasta el final: si sales ahora, la próxima vez empezarás de cero. Solo se
                  guarda tu resultado cuando terminas el test entero.
                </Text>
                <Flex gap={3} wrap="wrap" justify="flex-end">
                  <Box as="button" onClick={() => setConfirmarSalida(false)}
                       px={{ base: 5, md: 7 }} py={2.5} borderRadius="full"
                       bg={tcmTxt} color={tcmBg} fontFamily="'EB Garamond', serif"
                       fontSize={{ base: "md", md: "lg" }} fontWeight="800" cursor="pointer"
                       _hover={{ transform: "translateY(-2px)" }} transition="transform 0.15s ease">
                    Seguir con el test
                  </Box>
                  <Box as="button" onClick={() => { setConfirmarSalida(false); onClose(); }}
                       px={{ base: 5, md: 7 }} py={2.5} borderRadius="full"
                       bg="transparent" border={`1px solid ${tcmTxt}88`} color={tcmTxt}
                       fontFamily="'EB Garamond', serif" fontSize={{ base: "md", md: "lg" }}
                       fontWeight="700" cursor="pointer" _hover={{ bg: `${tcmTxt}22` }}>
                    Salir y perderlo
                  </Box>
                </Flex>
              </Flex>
            </Box>
          </Flex>
        )}
      </ModalContent>
    </Modal>
  );
}
