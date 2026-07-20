import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import { useInView, useReducedMotion } from "framer-motion";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesTcm } from "../../components/metodo/IlustracionesTcm";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceTcm } from "../../components/metodo/IndiceTcm";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import { API_URL, tcmBg, tcmNom, tcmTxt, TCMIcon } from "../../GlobalVariables";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import {
  LENGUA_DIMENSIONES, LENGUA_ZONAS,
  type LenguaDim, type OpcionLengua,
} from "../../components/metodo/tcmLenguaContenido";

const MAPA_LENGUA = "/recorrido/tcm/lengua/mapalengua.png";

// ── Agrupación visual de las cajitas de lengua ──────────────────────────────
// Las 30 fotos se reparten en grupos que llenan filas completas de 3 (6 ó 3 por
// box) para que la página se vea uniforme. Es solo presentación: la herramienta
// «Lee tu lengua» sigue usando las dimensiones (color/forma/saburra/humedad) tal
// cual, sin verse afectada.
const dimOf = (d: LenguaDim) => LENGUA_DIMENSIONES.find((x) => x.dim === d)!;
const opOf = (d: LenguaDim, key: string) => dimOf(d).opciones.find((o) => o.key === key)!;
const sin = (d: LenguaDim, keys: string[]) => dimOf(d).opciones.filter((o) => !keys.includes(o.key));

interface GrupoLengua { titulo: string; subtitulo: string; opciones: OpcionLengua[]; }
const GRUPOS_LENGUA: GrupoLengua[] = [
  // El color (6)
  { titulo: dimOf("color").titulo, subtitulo: dimOf("color").subtitulo, opciones: dimOf("color").opciones },
  // El cuerpo · la forma (6): forma ×5 + la lengua estable (referencia de movimiento)
  { titulo: "El cuerpo · la forma", subtitulo: dimOf("forma").subtitulo,
    opciones: [...dimOf("forma").opciones, opOf("movimiento", "normal")] },
  // El cuerpo · el movimiento (3)
  { titulo: "El movimiento", subtitulo: dimOf("movimiento").subtitulo,
    opciones: sin("movimiento", ["normal"]) },
  // La superficie · la saburra (6)
  { titulo: dimOf("saburra").titulo, subtitulo: dimOf("saburra").subtitulo,
    opciones: sin("saburra", ["pelada"]) },
  // La superficie · humedad y detalles (6): saburra pelada + humedad ×4 + lengua sin puntos
  { titulo: "La superficie · humedad y detalles", subtitulo: dimOf("humedad").subtitulo,
    opciones: [opOf("saburra", "pelada"), ...dimOf("humedad").opciones, opOf("puntos", "normal")] },
  // Puntos y venas (3)
  { titulo: dimOf("puntos").titulo, subtitulo: dimOf("puntos").subtitulo,
    opciones: sin("puntos", ["normal"]) },
];

const INK_SHADOW = `0 1px 3px ${tcmBg}f5, 0 0 8px ${tcmBg}cc`;
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${tcmTxt}1a, 0 0 48px ${tcmTxt}10`;

// Consejos prácticos de observación (Módulo "el método"): breves, no teoría.
const COMO_MIRAR = [
  "Por la mañana, antes de lavarte los dientes y antes de comer o beber.",
  "Con luz natural siempre que puedas.",
  "Saca la lengua relajada y sin forzarla.",
  "Fíjate también en dónde aparece el cambio: cada zona habla de un órgano.",
];

export default function MetodoTcmLengua() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesTcm();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.tcm_suscrito) { navigate("/metodo/tcm"); return; }
      } catch {
        navigate("/metodo/tcm");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  // No mostramos la página hasta que el mapa y todas las fotos de lengua estén
  // descargados, para que las cajitas no aparezcan con el hueco vacío.
  const fotosListas = usePrecargarImagenes([
    encodeURI(MAPA_LENGUA),
    ...LENGUA_DIMENSIONES.flatMap((d) => d.opciones.map((o) => encodeURI(o.src))),
  ]);

  if (loading || !fotosListas) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="960px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<TCMIcon size={{ base: "40px", md: "56px" }} />}
            title="Tu lengua"
            pageLabel="5/7"
            compact
            bgColor={`${tcmBg}dd`}
            color={tcmTxt}
            nom={tcmNom}
            mb={0}
            prev={{ label: "← Diagnóstico", onClick: () => navigate("/metodo/tcm/diagnostico") }}
            extra={ilustracionesBtn}
            next={{ label: "Lee tu lengua →", onClick: () => navigate("/metodo/tcm/lengua/leer") }}
          />
          </Reveal>

          <Reveal direction="up" distance={20} delay={0.12} duration={0.65} display="flex" justifyContent="center">
          <Text color="white" fontStyle="italic" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8"
                textAlign="center" maxW="680px" style={{ textShadow: INK_SHADOW }}>
            La lengua es el espejo de las vísceras. Se lee por capas: el color, la forma, el movimiento,
            la saburra, la humedad y los pequeños detalles. Aprende a reconocer cada una y luego mira la tuya.
          </Text>
          </Reveal>

          {/* ── Cómo mirar (práctico) ── */}
          <Reveal direction="up" distance={26} scaleFrom={0.98} delay={0.2} duration={0.7} w="100%">
          <Panel titulo="Cómo mirar tu lengua" color={tcmTxt}>
            <Flex direction="column" gap={2.5}>
              {COMO_MIRAR.map((t, i) => (
                <Flex key={i} gap={2.5} align="flex-start">
                  <Box flexShrink={0} mt={{ base: "9px", md: "11px" }} w="5px" h="5px" borderRadius="full"
                       bg={tcmTxt} boxShadow={`0 0 6px ${tcmTxt}`} />
                  <Text color="rgba(255,255,255,0.94)" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8"
                        style={{ textShadow: INK_SHADOW }}>{t}</Text>
                </Flex>
              ))}
            </Flex>
          </Panel>
          </Reveal>

          {/* ── Mapa de las zonas (primero: foto a la izquierda + zonas a la derecha) ── */}
          <Reveal inView direction="up" distance={26} scaleFrom={0.98} duration={0.7} amount={0.15} w="100%">
          <Panel titulo="El mapa de la lengua" color={tcmTxt}>
            <Flex direction={{ base: "column", md: "row" }} gap={{ base: 5, md: 7 }} align={{ base: "stretch", md: "flex-start" }}>
              <Box flexShrink={0} w={{ base: "100%", md: "300px" }} borderRadius="xl" overflow="hidden"
                   border={`1px solid ${tcmTxt}55`} boxShadow={`0 0 18px ${tcmTxt}33`}>
                <img src={encodeURI(MAPA_LENGUA)} alt="Mapa de la lengua"
                     style={{ width: "100%", height: "auto", display: "block" }} />
              </Box>
              <Box flex="1" minW={0}>
                <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                      lineHeight="1.7" mb={4} style={{ textShadow: INK_SHADOW }}>
                  No solo importa qué cambia, sino en qué parte de la lengua aparece: cada zona se relaciona
                  con unos órganos.
                </Text>
                <Flex direction="column" gap={2.5}>
                  {LENGUA_ZONAS.map((z) => (
                    <Flex key={z.key} gap={2.5} align="flex-start">
                      <Box flexShrink={0} mt={{ base: "9px", md: "11px" }} w="5px" h="5px" borderRadius="full"
                           bg={tcmTxt} boxShadow={`0 0 6px ${tcmTxt}`} />
                      <Text color="rgba(255,255,255,0.94)" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8"
                            style={{ textShadow: INK_SHADOW }}>
                        <Text as="span" fontWeight={700} color="white">{z.zona}:</Text> {z.organos}.
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              </Box>
            </Flex>
          </Panel>
          </Reveal>

          {/* ── Las capas de observación (cajitas ilustradas, agrupadas de 6) ── */}
          {GRUPOS_LENGUA.map((g) => (
            <Reveal key={g.titulo} inView direction="up" distance={26} scaleFrom={0.98} duration={0.7} amount={0.12} w="100%">
              <DimensionBloque grupo={g} />
            </Reveal>
          ))}

          <Reveal inView direction="up" distance={14} duration={0.6} amount={0.5} display="flex" justifyContent="center">
          <Text color="rgba(255,255,255,0.6)" fontSize="xs" fontStyle="italic" textAlign="center" maxW="680px"
                lineHeight="1.6">
            Material con fin formativo. El diagnóstico por la lengua es una herramienta propia de la Medicina
            Tradicional China; no constituye un diagnóstico médico ni sustituye la valoración de un
            profesional sanitario cualificado.
          </Text>
          </Reveal>

          {/* Acceso discreto a «Lee tu lengua» abajo a la derecha, para no tener
              que volver a subir al header. */}
          <Reveal inView direction="up" distance={12} duration={0.5} amount={0.5} w="100%" display="flex" justifyContent="flex-end">
          <Box
            as="button"
            onClick={() => navigate("/metodo/tcm/lengua/leer")}
            display="inline-flex"
            alignItems="center"
            gap={2}
            px={5}
            py={2.5}
            borderRadius="full"
            bg="rgba(255,255,255,0.06)"
            color={tcmTxt}
            border={`1px solid ${tcmTxt}55`}
            fontFamily="'EB Garamond', serif"
            fontWeight={600}
            fontSize={{ base: "sm", md: "md" }}
            letterSpacing="0.04em"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ bg: `${tcmTxt}22`, borderColor: tcmTxt, transform: "translateY(-1px)" }}
            style={{ textShadow: INK_SHADOW }}
          >
            Lee tu lengua →
          </Box>
          </Reveal>
        </Flex>
      </Flex>

      {ilustracionesModal}

      <IndiceTcm />

      <BotonCompania color={tcmTxt} bgColor={tcmBg} disciplinaNom={tcmNom} />

      <SiteFooter />
    </Box>
  );
}

// ── Bloque de una dimensión (título + subtítulo + cajitas de variantes) ──────
// Las cajitas se ordenan por longitud de descripción para que las de textos
// parecidos caigan juntas en la misma fila → alturas uniformes.
function DimensionBloque({ grupo }: { grupo: GrupoLengua }) {
  const opciones = [...grupo.opciones].sort((a, b) => a.lectura.length - b.lectura.length);
  // Las cajitas de lengua aparecen UNA A UNA cuando la fila asoma en pantalla.
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const enter = reduce || inView;
  return (
    <Panel titulo={grupo.titulo} color={tcmTxt}>
      <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" mb={5}
            maxW="700px" style={{ textShadow: INK_SHADOW }}>
        {grupo.subtitulo}
      </Text>
      {/* align=stretch → todas las cajitas de una fila comparten la misma altura */}
      <Flex ref={ref} wrap="wrap" gap={{ base: 3, md: 4 }} justify="center" align="stretch">
        {opciones.map((op, i) => (
          <VarianteCard key={op.key} opcion={op} index={i} enter={enter} />
        ))}
      </Flex>
    </Panel>
  );
}

// ── Cajita ilustrada: foto + título · separador · texto (todas mismo alto/ancho) ─
function VarianteCard({ opcion, index, enter }: { opcion: OpcionLengua; index: number; enter: boolean }) {
  return (
    <Flex direction="column"
          w={{ base: "100%", sm: "calc(50% - 8px)", md: "calc(33.333% - 11px)" }}
          borderRadius="xl" overflow="hidden" bg="rgba(0,0,0,0.28)"
          border={`1px solid ${opcion.equilibrio ? `${tcmTxt}88` : "rgba(255,255,255,0.16)"}`}
          boxShadow={opcion.equilibrio ? `0 0 16px ${tcmTxt}44` : "none"}
          opacity={enter ? 1 : 0}
          transform={enter ? "translateY(0) scale(1)" : "translateY(18px) scale(0.97)"}
          transition="opacity 0.55s ease, transform 0.55s cubic-bezier(0.22,1,0.36,1)"
          sx={{ backdropFilter: "blur(6px)", transitionDelay: `${index * 0.07}s` }}>
      <LenguaImg src={opcion.src} alt={opcion.nombre} />
      {/* flex=1 para que el bloque de texto rellene la altura estirada de la fila */}
      <Flex direction="column" flex="1" px={4} py={3.5}>
        <Flex align="center" gap={2}>
          <Text color="white" fontSize={{ base: "sm", md: "md" }} fontWeight={700}
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.85)" }}>
            {opcion.nombre}
          </Text>
          {opcion.equilibrio && (
            <Text color={tcmTxt} fontSize="2xs" fontWeight={700} letterSpacing="0.06em"
                  textTransform="uppercase">· sana</Text>
          )}
        </Flex>
        <Box h="1px" w="100%" my={2.5} bgGradient={`linear(to-r, ${tcmTxt}aa, transparent)`} />
        <Text color="rgba(255,255,255,0.85)" fontSize={{ base: "xs", md: "sm" }} lineHeight="1.6"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>
          {opcion.lectura}
        </Text>
      </Flex>
    </Flex>
  );
}

// ── Imagen de lengua con marco cuadrado (funciona aunque falte el PNG) ───────
function LenguaImg({ src, alt }: { src: string; alt: string }) {
  return (
    <Box w="100%" sx={{ aspectRatio: "1 / 1" }} bg="rgba(255,255,255,0.04)"
         display="flex" alignItems="center" justifyContent="center">
      <img src={encodeURI(src)} alt={alt}
           style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Box>
  );
}

function Panel({ titulo, color, children }: {
  titulo: string; color: string; children: React.ReactNode;
}) {
  return (
    <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
      <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
      <Box position="relative" zIndex={1} px={{ base: 6, md: 8 }} py={{ base: 5, md: 6 }}>
        {titulo && (
          <>
            <Text color={color} fontSize={{ base: "sm", md: "md" }} fontWeight={700} letterSpacing="0.1em"
                  textTransform="uppercase" mb={3} style={{ textShadow: INK_SHADOW }}>
              {titulo}
            </Text>
            <Box h="1px" w="100%" mb={4} bg={`${color}88`} />
          </>
        )}
        {children}
      </Box>
    </Box>
  );
}
