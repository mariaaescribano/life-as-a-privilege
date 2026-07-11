import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
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
  LENGUA_DIMENSIONES, LENGUA_ZONAS,
  type DimensionLengua, type OpcionLengua,
} from "../../components/metodo/tcmLenguaContenido";

const INK_SHADOW = `0 1px 3px ${tcmBg}f5, 0 0 8px ${tcmBg}cc`;
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${tcmTxt}1a, 0 0 48px ${tcmTxt}10`;

// Consejos prácticos de observación (Módulo "el método"): breves, no teoría.
const COMO_MIRAR = [
  "Por la mañana, antes de comer o beber (el café, la remolacha o la cúrcuma tiñen la lengua).",
  "Con luz natural siempre que puedas.",
  "Saca la lengua relajada, sin forzarla, y solo unos segundos.",
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

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="960px" gap={7}>

          <MetodoStepHeader
            icon={<TCMIcon size={{ base: "40px", md: "56px" }} />}
            title="Tu lengua"
            pageLabel="10/12"
            compact
            bgColor={`${tcmBg}dd`}
            color={tcmTxt}
            nom={tcmNom}
            mb={0}
            prev={{ label: "← Diagnóstico", onClick: () => navigate("/metodo/tcm/diagnostico") }}
            extra={ilustracionesBtn}
            next={{ label: "Lee tu lengua →", onClick: () => navigate("/metodo/tcm/lengua/leer") }}
          />

          <Text color="white" fontStyle="italic" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8"
                textAlign="center" maxW="680px" style={{ textShadow: INK_SHADOW }}>
            La lengua es el espejo de las vísceras. Se lee por capas: el color, la forma, el movimiento,
            la saburra, la humedad y los pequeños detalles. Aprende a reconocer cada una y luego mira la tuya.
          </Text>

          {/* ── Cómo mirar (práctico) ── */}
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

          {/* ── Las dimensiones (cajitas ilustradas) ── */}
          {LENGUA_DIMENSIONES.map((d) => (
            <DimensionBloque key={d.dim} dimension={d} />
          ))}

          {/* ── Mapa de las zonas ── */}
          <Panel titulo="El mapa de la lengua" color={tcmTxt}>
            <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  lineHeight="1.7" mb={4} maxW="640px" style={{ textShadow: INK_SHADOW }}>
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
          </Panel>

          <Text color="rgba(255,255,255,0.6)" fontSize="xs" fontStyle="italic" textAlign="center" maxW="680px"
                lineHeight="1.6">
            Material con fin formativo. El diagnóstico por la lengua es una herramienta propia de la Medicina
            Tradicional China; no constituye un diagnóstico médico ni sustituye la valoración de un
            profesional sanitario cualificado.
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

// ── Bloque de una dimensión (título + subtítulo + cajitas de variantes) ──────
function DimensionBloque({ dimension }: { dimension: DimensionLengua }) {
  return (
    <Panel titulo={dimension.titulo} color={tcmTxt}>
      <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8" mb={5}
            maxW="700px" style={{ textShadow: INK_SHADOW }}>
        {dimension.subtitulo}
      </Text>
      <Flex wrap="wrap" gap={{ base: 3, md: 4 }} justify="center">
        {dimension.opciones.map((op) => (
          <VarianteCard key={op.key} opcion={op} />
        ))}
      </Flex>
    </Panel>
  );
}

// ── Cajita ilustrada: foto + nombre + lectura ────────────────────────────────
function VarianteCard({ opcion }: { opcion: OpcionLengua }) {
  return (
    <Box w={{ base: "100%", sm: "calc(50% - 8px)", md: "calc(33.333% - 11px)" }}
         borderRadius="xl" overflow="hidden" bg="rgba(0,0,0,0.28)"
         border={`1px solid ${opcion.equilibrio ? `${tcmTxt}88` : "rgba(255,255,255,0.16)"}`}
         boxShadow={opcion.equilibrio ? `0 0 16px ${tcmTxt}44` : "none"}
         sx={{ backdropFilter: "blur(6px)" }}>
      <LenguaImg src={opcion.src} alt={opcion.nombre} />
      <Box px={4} py={3.5}>
        <Flex align="center" gap={2} mb={1.5}>
          <Text color="white" fontSize={{ base: "sm", md: "md" }} fontWeight={700}
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.85)" }}>
            {opcion.nombre}
          </Text>
          {opcion.equilibrio && (
            <Text color={tcmTxt} fontSize="2xs" fontWeight={700} letterSpacing="0.06em"
                  textTransform="uppercase">· sana</Text>
          )}
        </Flex>
        <Text color="rgba(255,255,255,0.85)" fontSize={{ base: "xs", md: "sm" }} lineHeight="1.6"
              style={{ textShadow: "0 1px 3px rgba(0,0,0,0.8)" }}>
          {opcion.lectura}
        </Text>
      </Box>
    </Box>
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
