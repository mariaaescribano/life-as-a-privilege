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
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { API_URL, tcmBg, tcmNom, tcmTxt, TCMIcon } from "../../GlobalVariables";
import {
  ELEMENTOS, ORDEN_ELEMENTOS, puntuaciones, elementoPredominante, elementosAApoyar,
  recomendacionesElemento, testInicialCompleto, type DatosTcm,
} from "../../components/metodo/tcmRecorrido";

const TINTA = tcmTxt;
const INK_SHADOW = `0 1px 3px ${tcmBg}f5, 0 0 8px ${tcmBg}cc`;

// Coordenadas de los 5 vértices del pentágono (viewBox 320×320), empezando arriba.
const CX = 160, CY = 165, R_REF = 120;
function vertice(i: number, radio: number) {
  const ang = (-90 + i * 72) * (Math.PI / 180);
  return { x: CX + radio * Math.cos(ang), y: CY + radio * Math.sin(ang) };
}

export default function MetodoTcmMapa() {
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
        // Sin test inicial no hay mapa que mostrar.
        if (!testInicialCompleto(d)) { navigate("/metodo/tcm/equilibrio"); return; }
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

  // Polígono de tu equilibrio (cada vértice escalado por su puntuación).
  const puntosPoligono = ORDEN_ELEMENTOS.map((el, i) => {
    const radio = 32 + (puntos[el] / maxPunto) * (R_REF - 32);
    const v = vertice(i, radio);
    return `${v.x},${v.y}`;
  }).join(" ");

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  const elPred = ELEMENTOS[predominante];
  const recs = recomendacionesElemento(aApoyar[0] ?? predominante);
  const tresRecomendaciones = [
    recs.estiloDeVida?.[0],
    recs.nutricion?.[0],
    recs.infusiones?.[0],
  ].filter(Boolean) as string[];

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={7}>

          <MetodoStepHeader
            icon={<TCMIcon size={{ base: "40px", md: "56px" }} />}
            title="Tu mapa energético"
            pageLabel="3/14"
            compact
            bgColor={`${tcmBg}dd`}
            color={tcmTxt}
            nom={tcmNom}
            mb={0}
            prev={{ label: "← El test", onClick: () => navigate("/metodo/tcm/equilibrio") }}
            extra={ilustracionesBtn}
            next={{
              label: "Los 5 elementos →",
              onClick: () => navigate("/metodo/tcm/elementos"),
            }}
          />

          {/* ── La estrella de los 5 elementos ── */}
          <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden">
            <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
            <Box position="relative" zIndex={1} px={{ base: 5, md: 9 }} py={{ base: 7, md: 8 }}>
              <Text color={TINTA} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" textAlign="center" mb={2}
                    style={{ textShadow: INK_SHADOW }}>
                Tu equilibrio ahora
              </Text>
              <Text color={TINTA} fontSize={{ base: "sm", md: "md" }} textAlign="center" opacity={0.85} mb={5}
                    lineHeight="1.7" style={{ textShadow: INK_SHADOW }}>
                Cuanto más lejos del centro, más presente está ese elemento en ti hoy.
              </Text>

              <Flex justify="center">
                <Box as="svg" viewBox="0 0 320 340" w={{ base: "280px", md: "360px" }} h="auto">
                  {/* pentágono de referencia */}
                  <polygon
                    points={ORDEN_ELEMENTOS.map((_, i) => { const v = vertice(i, R_REF); return `${v.x},${v.y}`; }).join(" ")}
                    fill="none" stroke={`${tcmTxt}44`} strokeWidth={1}
                  />
                  {/* radios */}
                  {ORDEN_ELEMENTOS.map((_, i) => {
                    const v = vertice(i, R_REF);
                    return <line key={i} x1={CX} y1={CY} x2={v.x} y2={v.y} stroke={`${tcmTxt}22`} strokeWidth={1} />;
                  })}
                  {/* tu polígono */}
                  <polygon points={puntosPoligono} fill={`${tcmTxt}33`} stroke={tcmTxt} strokeWidth={2} />
                  {/* vértices + etiquetas */}
                  {ORDEN_ELEMENTOS.map((el, i) => {
                    const radio = 32 + (puntos[el] / maxPunto) * (R_REF - 32);
                    const v = vertice(i, radio);
                    const label = vertice(i, R_REF + 22);
                    return (
                      <g key={el}>
                        <circle cx={v.x} cy={v.y} r={6} fill={ELEMENTOS[el].color} stroke="white" strokeWidth={1.5} />
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

          {/* ── Predominante · a apoyar ── */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} w="100%">
            <Panel titulo="Elemento predominante" color={elPred.color}>
              <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight="700" mb={1}>
                {elPred.nombre}
              </Text>
              <Text color="rgba(255,255,255,0.9)" fontSize="sm" lineHeight="1.7">
                {elPred.emocion}
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

          {/* ── Fortalezas · retos ── */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} w="100%">
            <Panel titulo="Tus fortalezas" color={tcmTxt}>
              <Flex direction="column" gap={1.5}>
                {elPred.fortalezas.map((f) => (
                  <Text key={f} color="rgba(255,255,255,0.92)" fontSize="sm" lineHeight="1.6">· {f}</Text>
                ))}
              </Flex>
            </Panel>
            <Panel titulo="Posibles retos" color={tcmTxt}>
              <Flex direction="column" gap={1.5}>
                {ELEMENTOS[aApoyar[0] ?? predominante].desequilibrios.map((d) => (
                  <Text key={d} color="rgba(255,255,255,0.92)" fontSize="sm" lineHeight="1.6">· {d}</Text>
                ))}
              </Flex>
            </Panel>
          </SimpleGrid>

          {/* ── 3 recomendaciones inmediatas ── */}
          <Panel titulo="Tres cuidados para empezar hoy" color={tcmTxt} full>
            <Flex direction="column" gap={2.5}>
              {tresRecomendaciones.map((r, i) => (
                <Flex key={i} align="flex-start" gap={3}>
                  <Box flexShrink={0} w="24px" h="24px" borderRadius="full" bg={`${tcmTxt}33`}
                       border={`1px solid ${tcmTxt}`} display="flex" alignItems="center" justifyContent="center"
                       color="white" fontWeight={700} fontSize="sm">{i + 1}</Box>
                  <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.6">{r}</Text>
                </Flex>
              ))}
            </Flex>
          </Panel>

          <Text color="rgba(255,255,255,0.6)" fontSize="xs" fontStyle="italic" textAlign="center" maxW="620px"
                lineHeight="1.6">
            Esta valoración tiene un fin educativo y de autoconocimiento. No constituye un diagnóstico clínico
            ni sustituye la valoración de un profesional cualificado.
          </Text>
        </Flex>
      </Flex>

      {ilustracionesModal}

      <BotonCompania color={tcmTxt} bgColor={tcmBg} disciplinaNom={tcmNom} />

      <SiteFooter />
    </Box>
  );
}

function Panel({ titulo, color, children, full }: {
  titulo: string; color: string; children: React.ReactNode; full?: boolean;
}) {
  return (
    <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden"
         gridColumn={full ? { md: "1 / -1" } : undefined}>
      <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
      <Box position="relative" zIndex={1} px={{ base: 6, md: 8 }} py={{ base: 5, md: 6 }}>
        <Text color={color} fontSize={{ base: "xs", md: "sm" }} fontWeight={700} letterSpacing="0.1em"
              textTransform="uppercase" mb={3} style={{ textShadow: INK_SHADOW }}>
          {titulo}
        </Text>
        {/* Separación horizontal entre el título y la respuesta: línea entera. */}
        <Box h="1px" w="100%" mb={4} bg={`${color}88`} />
        {children}
      </Box>
    </Box>
  );
}
