import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text, SimpleGrid } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesTcm } from "../../components/metodo/IlustracionesTcm";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceTcm } from "../../components/metodo/IndiceTcm";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { API_URL, tcmBg, tcmNom, tcmTxt, TCMIcon } from "../../GlobalVariables";
import {
  ELEMENTOS, ORDEN_ELEMENTOS, puntuaciones, elementoPredominante, elementosAApoyar,
  balanceElemento, viajeCompleto, type DatosTcm, type Elemento, type Balance,
} from "../../components/metodo/tcmRecorrido";
import { ICONO_ELEMENTO } from "../../components/metodo/tcmElementosContenido";

const TINTA = tcmTxt;
const INK_SHADOW = `0 1px 3px ${tcmBg}f5, 0 0 8px ${tcmBg}cc`;
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${tcmTxt}1a, 0 0 48px ${tcmTxt}10`;

// Coordenadas de los 5 vértices del pentágono, empezando arriba.
const CX = 160, CY = 172, R_REF = 106, FOTO_R = 24;
function vertice(i: number, radio: number) {
  const ang = (-90 + i * 72) * (Math.PI / 180);
  return { x: CX + radio * Math.cos(ang), y: CY + radio * Math.sin(ang) };
}

// ── Estado de cada elemento (leído de los tests de balance) ──────────────────
const ESTADO_LABEL: Record<Balance, string> = {
  equilibrio: "En equilibrio",
  exceso: "En exceso",
  deficiencia: "En deficiencia",
};
// Verde = equilibrio, rojo = exceso, ámbar = deficiencia (misma paleta de los elementos).
const ESTADO_COLOR: Record<Balance, string> = {
  equilibrio: "#6f9463",
  exceso: "#d1495b",
  deficiencia: "#c8963e",
};

/** Descripción del estado, reutilizando el contenido ya definido en ELEMENTOS. */
function textoEstado(el: Elemento, balance: Balance): string {
  const E = ELEMENTOS[el];
  if (balance === "equilibrio") {
    return E.emocion.split("En desequilibrio")[0].replace(/^En equilibrio:\s*/i, "").replace(/\.\s*$/, "").trim();
  }
  const prefijo = balance === "exceso" ? "exceso" : "deficiencia";
  const linea = E.desequilibrios.find((d) => d.toLowerCase().startsWith(prefijo));
  return linea ? linea.replace(/^(Exceso|Deficiencia):\s*/i, "").trim() : "";
}

export default function MetodoTcmPerfil() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DatosTcm>({});
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesTcm();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!me.data?.tcm_suscrito) { navigate("/metodo/tcm"); return; }

        const res = await axios.get(`${API_URL}/metodo-tcm/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const d: DatosTcm = res.data?.data ?? {};
        // El perfil completo requiere haber recorrido los cinco elementos.
        if (!viajeCompleto(d)) { navigate("/metodo/tcm/elementos"); return; }
        setData(d);
      } catch {
        navigate("/metodo/tcm");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const puntos = useMemo(() => puntuaciones(data), [data]);
  const predominante = useMemo(() => elementoPredominante(data), [data]);
  const aApoyar = useMemo(() => elementosAApoyar(data), [data]);
  const maxPunto = Math.max(1, ...ORDEN_ELEMENTOS.map((el) => puntos[el]));

  // Estado (equilibrio/exceso/deficiencia) de cada elemento a partir de sus tests.
  const estados = useMemo(() => {
    const out: Partial<Record<Elemento, Balance | null>> = {};
    for (const el of ORDEN_ELEMENTOS) {
      out[el] = balanceElemento(el, data.elementos?.[el]?.miniTest?.respuestas);
    }
    return out;
  }, [data]);

  const puntosPoligono = ORDEN_ELEMENTOS.map((el, i) => {
    const radio = 32 + (puntos[el] / maxPunto) * (R_REF - 32);
    const v = vertice(i, radio);
    return `${v.x},${v.y}`;
  }).join(" ");

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  const elPred = ELEMENTOS[predominante];

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={7}>

          <MetodoStepHeader
            icon={<TCMIcon size={{ base: "40px", md: "56px" }} />}
            title="Tu perfil energético"
            pageLabel="7/12"
            compact
            bgColor={`${tcmBg}dd`}
            color={tcmTxt}
            nom={tcmNom}
            mb={0}
            prev={{ label: "← Los 5 elementos", onClick: () => navigate("/metodo/tcm/elementos") }}
            extra={ilustracionesBtn}
          />

          {/* ── Síntesis introductoria ── */}
          <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
            <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 6, md: 8 }} py={{ base: 5, md: 6 }}>
              <Text color={TINTA} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" mb={2}
                    style={{ textShadow: INK_SHADOW }}>
                Ya has recorrido los cinco elementos
              </Text>
              <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.8"
                    style={{ textShadow: INK_SHADOW }}>
                No eres un elemento: eres un equilibrio. Este es tu retrato completo, integrando tu punto de
                partida y lo que has ido descubriendo en cada elemento. Recuerda que es una fotografía de este
                momento, no una etiqueta fija: cambia contigo.
              </Text>
            </Box>
          </Box>

          {/* ── La estrella de los 5 elementos (equilibrio completo) ── */}
          <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
            <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 3, md: 5 }} py={{ base: 3, md: 4 }}>
              <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" textAlign="center" mb={0.5}
                    style={{ textShadow: INK_SHADOW }}>
                Tu equilibrio completo
              </Text>
              <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} textAlign="center" opacity={0.85} mb={0.5}
                    lineHeight="1.7" style={{ textShadow: INK_SHADOW }}>
                Cuanto más lejos del centro, más presente y demandante está ese elemento en ti.
              </Text>

              <Flex justify="center">
                <Box as="svg" viewBox="0 0 320 320" w={{ base: "300px", md: "380px" }} h="auto" overflow="visible">
                  <defs>
                    {ORDEN_ELEMENTOS.map((el, i) => {
                      const v = vertice(i, R_REF);
                      return (
                        <clipPath id={`tcm-clip-${el}`} key={el}>
                          <circle cx={v.x} cy={v.y} r={FOTO_R} />
                        </clipPath>
                      );
                    })}
                  </defs>

                  <polygon
                    points={ORDEN_ELEMENTOS.map((_, i) => { const v = vertice(i, R_REF); return `${v.x},${v.y}`; }).join(" ")}
                    fill="none" stroke={`${tcmTxt}44`} strokeWidth={1}
                  />
                  {ORDEN_ELEMENTOS.map((_, i) => {
                    const v = vertice(i, R_REF);
                    return <line key={i} x1={CX} y1={CY} x2={v.x} y2={v.y} stroke={`${tcmTxt}22`} strokeWidth={1} />;
                  })}
                  <polygon points={puntosPoligono} fill={`${tcmTxt}33`} stroke={tcmTxt} strokeWidth={2} />
                  {ORDEN_ELEMENTOS.map((el, i) => {
                    const radio = 32 + (puntos[el] / maxPunto) * (R_REF - 32);
                    const v = vertice(i, radio);
                    return <circle key={el} cx={v.x} cy={v.y} r={4} fill={ELEMENTOS[el].color} stroke="white" strokeWidth={1} />;
                  })}
                  {ORDEN_ELEMENTOS.map((el, i) => {
                    const v = vertice(i, R_REF);
                    const label = vertice(i, R_REF + 46);
                    return (
                      <g key={el}>
                        <circle cx={v.x} cy={v.y} r={FOTO_R + 2} fill={tcmBg} opacity={0.55} />
                        <image href={ICONO_ELEMENTO[el]} x={v.x - FOTO_R} y={v.y - FOTO_R}
                               width={FOTO_R * 2} height={FOTO_R * 2}
                               clipPath={`url(#tcm-clip-${el})`} preserveAspectRatio="xMidYMid slice" />
                        <circle cx={v.x} cy={v.y} r={FOTO_R} fill="none" stroke="white" strokeWidth={2}
                                style={{ filter: `drop-shadow(0 0 5px ${ELEMENTOS[el].color})` }} />
                        <text x={label.x} y={label.y} fill="white" fontSize={13} fontWeight={700}
                              textAnchor="middle" dominantBaseline="middle"
                              style={{ textShadow: "0 1px 4px rgba(58,10,10,0.95)" }}>
                          {ELEMENTOS[el].nombre}
                        </text>
                      </g>
                    );
                  })}
                </Box>
              </Flex>
            </Box>
          </Box>

          {/* ── El estado de cada elemento ── */}
          <Panel titulo="El estado de cada elemento" color={tcmTxt} full>
            <Flex direction="column" gap={4}>
              {ORDEN_ELEMENTOS.map((el) => {
                const E = ELEMENTOS[el];
                const estado = estados[el] ?? null;
                return (
                  <Flex key={el} align="flex-start" gap={4}
                        borderTop={el === ORDEN_ELEMENTOS[0] ? undefined : `1px solid ${tcmTxt}22`}
                        pt={el === ORDEN_ELEMENTOS[0] ? 0 : 4}>
                    <Box flexShrink={0} w="46px" h="46px" borderRadius="full" overflow="hidden"
                         border={`2px solid ${E.color}`}
                         style={{ boxShadow: `0 0 8px ${E.color}88` }}>
                      <img src={ICONO_ELEMENTO[el]} alt={E.nombre}
                           style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </Box>
                    <Box flex="1">
                      <Flex align="center" gap={3} wrap="wrap" mb={1}>
                        <Text color="white" fontSize={{ base: "lg", md: "xl" }} fontWeight="700">
                          {E.nombre}
                        </Text>
                        {estado ? (
                          <Box px={2.5} py={0.5} borderRadius="full"
                               bg={`${ESTADO_COLOR[estado]}33`} border={`1px solid ${ESTADO_COLOR[estado]}`}>
                            <Text color="white" fontSize="xs" fontWeight={700} letterSpacing="0.04em">
                              {ESTADO_LABEL[estado]}
                            </Text>
                          </Box>
                        ) : (
                          <Text color="rgba(255,255,255,0.55)" fontSize="xs" fontStyle="italic">
                            sin datos suficientes
                          </Text>
                        )}
                      </Flex>
                      <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.7">
                        {estado ? textoEstado(el, estado) : E.significado}
                      </Text>
                    </Box>
                  </Flex>
                );
              })}
            </Flex>
          </Panel>

          {/* ── Predominante · a apoyar ── */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} w="100%">
            <Panel titulo="Elemento predominante" color={elPred.color}>
              <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" mb={1}>
                {elPred.nombre}
              </Text>
              <Text color="rgba(255,255,255,0.9)" fontSize="sm" lineHeight="1.7">
                Es el que más presencia y demanda tiene hoy en ti. Escucharlo es la clave de tu reequilibrio.
              </Text>
            </Panel>
            <Panel titulo="Elemento(s) que piden apoyo" color={ELEMENTOS[aApoyar[0] ?? predominante].color}>
              <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" mb={1}>
                {aApoyar.map((el) => ELEMENTOS[el].nombre).join(" · ")}
              </Text>
              <Text color="rgba(255,255,255,0.9)" fontSize="sm" lineHeight="1.7">
                Son los que menos presencia tienen hoy: cuidarlos reequilibra el conjunto.
              </Text>
            </Panel>
          </SimpleGrid>

          <Text color="rgba(255,255,255,0.6)" fontSize="xs" fontStyle="italic" textAlign="center" maxW="620px"
                lineHeight="1.6">
            Esta valoración tiene un fin educativo y de autoconocimiento. No constituye un diagnóstico clínico
            ni sustituye la valoración de un profesional cualificado.
          </Text>
        </Flex>
      </Flex>

      {ilustracionesModal}

      <IndiceTcm />

      <BotonCompania color={tcmTxt} bgColor={tcmBg} disciplinaNom={tcmNom} />

      <SiteFooter />
    </Box>
  );
}

function Panel({ titulo, color, children, full }: {
  titulo: string; color: string; children: React.ReactNode; full?: boolean;
}) {
  return (
    <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}
         gridColumn={full ? { md: "1 / -1" } : undefined}>
      <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
      <Box position="relative" zIndex={1} px={{ base: 6, md: 8 }} py={{ base: 5, md: 6 }}>
        <Text color={color} fontSize={{ base: "xs", md: "sm" }} fontWeight={700} letterSpacing="0.1em"
              textTransform="uppercase" mb={3} style={{ textShadow: INK_SHADOW }}>
          {titulo}
        </Text>
        <Box h="1px" w="100%" mb={4} bg={`${color}88`} />
        {children}
      </Box>
    </Box>
  );
}
