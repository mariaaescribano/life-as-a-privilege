import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import { API_URL, tcmBg, tcmNom, tcmTxt } from "../../GlobalVariables";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { Reveal } from "../global/Reveal";
import { glowHeader } from "./FotoBox";
import { useT } from "../../i18n";
import type { DatosTcm } from "./tcmRecorrido";
import {
  BLOQUES, ENUNCIADO, FRASES_BLOQUE, NO, NOMBRE_BLOQUE, PIE_BLOQUE, SI,
  TOTAL_FRASES_CONSTITUCION, constitucionCompleta, respondidasConstitucion,
  respuestasConstitucion,
} from "./tcmConstitucion";

// ─────────────────────────────────────────────────────────────────────────
// El test de la Constitución, EN LA PROPIA PÁGINA (como el de Ayurveda).
//
// Antes era un popup a pantalla completa de 200 frases que había que hacer de
// una sentada. Ahora son 50 frases (ver `tcmConstitucion.ts`) y se responden
// aquí mismo, bajando: dos bloques —cómo eres y cómo va tu cuerpo— con las
// frases MEZCLADAS entre elementos, que no se vea de qué elemento es cada una.
//
// Y SE GUARDA SOLO: cada «Sí/No» viaja a la BD en el momento. Si se va a mitad,
// al volver está lo que llevaba (regla de la casa: prerrellenar siempre lo que
// ya rellenó). El resultado —el pentágono de arriba— aparece en cuanto está la
// última frase; el paso siguiente sigue pidiendo el test ENTERO.
// ─────────────────────────────────────────────────────────────────────────

const INK_SHADOW = `0 1px 3px ${tcmBg}f5, 0 0 8px ${tcmBg}cc`;

export function TestConstitucion({
  data,
  onChangeData,
  onCompletar,
}: {
  data: DatosTcm;
  onChangeData: (next: DatosTcm) => void;
  /** Se llama cuando la última frase acaba de contestarse. */
  onCompletar?: () => void;
}) {
  const t = useT();
  const guardadas = useMemo(() => respuestasConstitucion(data), [data]);
  const [respuestas, setRespuestas] = useState<Record<string, string>>(guardadas);
  // Con el test ya hecho se enseña plegado; «Repetir» vuelve a abrir las frases.
  const [abierto, setAbierto] = useState(!constitucionCompleta(guardadas));

  // La copia más fresca de los datos: el blob `data` se REEMPLAZA entero en
  // cada PATCH, así que hay que construirlo siempre sobre lo último que hay.
  const dataRef = useRef(data);
  useEffect(() => { dataRef.current = data; }, [data]);

  const hechas = useMemo(() => respondidasConstitucion(respuestas), [respuestas]);
  const completo = hechas === TOTAL_FRASES_CONSTITUCION;

  const responder = (key: string, valor: string) => {
    const next = { ...respuestas, [key]: valor };
    setRespuestas(next);
    void guardar(next);
    if (respondidasConstitucion(next) === TOTAL_FRASES_CONSTITUCION) onCompletar?.();
  };

  const guardar = async (r: Record<string, string>) => {
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
  };

  // ── Hecho y plegado: solo el aviso y el botón de repetirlo ──────────────
  if (completo && !abierto) {
    return (
      <Reveal inView direction="up" distance={16} duration={0.6} amount={0.3} w="100%" display="flex">
        <Caja>
          <Flex direction="column" align="center" gap={3} textAlign="center">
            <Text color={tcmTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight="800">
              {t("metodo.tcm.constitucion.hecho")}
            </Text>
            <Text color={tcmTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.7" maxW="520px" opacity={0.92}>
              {t("metodo.tcm.constitucion.hechoTexto")}
            </Text>
            <Boton onClick={() => setAbierto(true)} tenue>
              {t("metodo.tcm.constitucion.repetir")}
            </Boton>
          </Flex>
        </Caja>
      </Reveal>
    );
  }

  // ── El test abierto ─────────────────────────────────────────────────────
  let n = 0;
  return (
    <Flex direction="column" align="center" gap={5} w="100%">

      {/* Cuánto llevas. Se queda a la vista mientras respondes. */}
      <Reveal direction="up" distance={14} delay={0.12} duration={0.6} w="100%" display="flex" justifyContent="center">
        <Box w="100%" maxW="520px">
          <Box h="6px" w="100%" borderRadius="full" bg="rgba(255,255,255,0.25)" overflow="hidden">
            <Box h="100%" borderRadius="full" bg={tcmTxt} transition="width 0.3s ease"
                 w={`${Math.round((hechas / TOTAL_FRASES_CONSTITUCION) * 100)}%`} />
          </Box>
          {/* Sobre el turquesa: blanco y sin sombra (regla de la casa). */}
          <Text color="white" fontSize="sm" textAlign="center" mt={1.5} opacity={0.9}>
            {t("metodo.tcm.constitucion.llevas", { hechas, total: TOTAL_FRASES_CONSTITUCION })}
          </Text>
          <Text color="white" fontSize="xs" fontStyle="italic" textAlign="center" mt={1} opacity={0.8} lineHeight="1.6">
            {t("metodo.tcm.constitucion.seGuardaSolo")}
          </Text>
        </Box>
      </Reveal>

      {/* Los dos bloques: cómo eres y cómo va tu cuerpo */}
      {BLOQUES.map((bloque) => {
        const frases = FRASES_BLOQUE[bloque];
        const desde = n;
        n += frases.length;
        return (
          <Reveal key={bloque} inView direction="up" distance={24} duration={0.6} amount={0.08}
                  w="100%" display="flex">
            <Caja>
              <Text color={tcmTxt} fontSize={{ base: "sm", md: "md" }} fontWeight="800"
                    letterSpacing="0.16em" textTransform="uppercase" opacity={0.85}>
                {NOMBRE_BLOQUE[bloque]}
              </Text>
              <Text color={tcmTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight="800" mt={1}>
                {ENUNCIADO[bloque]}
              </Text>
              <Text color={tcmTxt} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" opacity={0.85} mb={5}>
                {PIE_BLOQUE[bloque]}
              </Text>

              {frases.map((f, i) => (
                <Box key={f.key} mb={i === frases.length - 1 ? 0 : 4}>
                  <Text color={tcmTxt} fontSize={{ base: "md", md: "lg" }} fontWeight="600" mb={2}>
                    {desde + i + 1}. {f.texto}
                  </Text>
                  <Flex gap={2.5}>
                    {[{ v: SI, r: t("metodo.tcm.constitucion.si") },
                      { v: NO, r: t("metodo.tcm.constitucion.no") }].map(({ v, r }) => {
                      const sel = respuestas[f.key] === v;
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
                  {i < frases.length - 1 && <Box h="1px" w="100%" mt={4} bg={`${tcmTxt}33`} />}
                </Box>
              ))}
            </Caja>
          </Reveal>
        );
      })}

      {/* Al terminar: subir al pentágono, que está arriba del todo. */}
      <Flex direction="column" align="center" gap={2}>
        {!completo && (
          <Text color="white" fontSize="sm" fontStyle="italic" textAlign="center" maxW="560px" lineHeight="1.7">
            {t("metodo.tcm.constitucion.faltan", { faltan: TOTAL_FRASES_CONSTITUCION - hechas })}
          </Text>
        )}
        {completo && (
          <Boton onClick={() => { setAbierto(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
            {t("metodo.tcm.constitucion.verResultado")}
          </Boton>
        )}
      </Flex>
    </Flex>
  );
}

// La caja de la casa: la pintura de TCM detrás, velo fino y el halo del header.
function Caja({ children }: { children: React.ReactNode }) {
  return (
    <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={glowHeader(tcmTxt)}>
      <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
      <Box position="absolute" inset={0} bg={`${tcmBg}b3`} />
      <Box position="relative" px={{ base: 5, md: 8 }} py={{ base: 5, md: 8 }}
           style={{ textShadow: INK_SHADOW }}>
        {children}
      </Box>
    </Box>
  );
}

function Boton({ children, onClick, tenue }: {
  children: React.ReactNode; onClick: () => void; tenue?: boolean;
}) {
  return (
    <Box as="button" onClick={onClick}
         mt={2} px={{ base: 8, md: 11 }} py={{ base: 2.5, md: 3 }} borderRadius="full"
         bg={tenue ? "transparent" : tcmTxt}
         color={tenue ? tcmTxt : tcmBg}
         border={`${tenue ? 1 : 2}px solid ${tenue ? `${tcmTxt}88` : "rgba(255,255,255,0.75)"}`}
         fontFamily="'EB Garamond', serif" fontSize={{ base: "md", md: "lg" }} fontWeight="800"
         letterSpacing="0.06em" cursor="pointer" transition="transform 0.18s ease"
         boxShadow={tenue ? "none" : glowHeader(tcmTxt)} style={{ textShadow: "none" }}
         _hover={{ transform: "translateY(-2px)", ...(tenue ? { bg: `${tcmTxt}22` } : {}) }}>
      {children}
    </Box>
  );
}
