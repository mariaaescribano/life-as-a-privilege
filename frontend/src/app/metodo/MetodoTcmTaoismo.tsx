import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { TcmLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesTcm } from "../../components/metodo/IlustracionesTcm";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceTcm } from "../../components/metodo/IndiceTcm";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { Reveal } from "../../components/global/Reveal";
import { API_URL, tcmBg, tcmNom, tcmTxt, TCMIcon } from "../../GlobalVariables";
import {
  LEYES_TAO, TAOISMO_INTRO, TAOISMO_CIERRE, FOTO_LEY, type LeyTao,
} from "../../components/metodo/tcmTaoismoContenido";

const INK_SHADOW = `0 1px 3px ${tcmBg}f5, 0 0 8px ${tcmBg}cc`;
const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${tcmTxt}1a, 0 0 48px ${tcmTxt}10`;

export default function MetodoTcmTaoismo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesTcm();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
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
    return <TcmLoading />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        {/* 850px = el ancho del MetodoStepHeader: ninguna caja de la página se
            sale de la cabecera. */}
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<TCMIcon size={{ base: "40px", md: "56px" }} />}
            title="Taoísmo"
            pageLabel="7/9"
            compact
            bgColor={`${tcmBg}dd`}
            color={tcmTxt}
            nom={tcmNom}
            mb={0}
            prev={{ label: "← Lee tu lengua", onClick: () => navigate("/metodo/tcm/lengua/leer") }}
            extra={ilustracionesBtn}
            next={{ label: "Tu cocina →", onClick: () => navigate("/metodo/tcm/recetas") }}
          />
          </Reveal>

          {/* Cita de apertura (sin sombra: va sobre el turquesa limpio) */}
          <Reveal direction="up" distance={20} delay={0.12} duration={0.65} display="flex" justifyContent="center">
          <Flex direction="column" align="center" gap={2} maxW="680px">
            <Text color="white" fontStyle="italic" fontSize={{ base: "lg", md: "xl" }} lineHeight="1.8"
                  textAlign="center">
              «El Tao que puede ser nombrado no es el Tao eterno.»
            </Text>
            <Text color="white" fontSize={{ base: "md", md: "lg" }} fontWeight={600} letterSpacing="0.06em"
                  textAlign="center" opacity={0.85}>
              — Lao-Tse
            </Text>
          </Flex>
          </Reveal>

          {/* ── BOX 1 · de dónde viene todo esto ── */}
          <Reveal direction="up" distance={28} scaleFrom={0.98} delay={0.2} duration={0.7} w="100%">
          <Panel titulo="La mirada de la que nace esta medicina">
            <Flex direction="column" gap={4}>
              {TAOISMO_INTRO.map((p, i) => (
                <Text key={i} color={tcmTxt} fontSize={{ base: "md", md: "lg" }} lineHeight="1.9"
                      style={{ textShadow: INK_SHADOW }}>
                  {p}
                </Text>
              ))}
            </Flex>
          </Panel>
          </Reveal>

          <Reveal inView direction="up" distance={16} duration={0.6} amount={0.4} display="flex" justifyContent="center">
          <Text color="white" fontStyle="italic" fontSize={{ base: "md", md: "lg" }} lineHeight="1.7"
                textAlign="center" maxW="680px" mt={1}>
            Diez leyes, diez ideas. Cada una con su reflejo en el cuerpo.
          </Text>
          </Reveal>

          {/* ── LAS LEYES · una tarjeta por ley, a lo ancho ──
              Una sola columna: las ilustraciones son CUADRADAS y van al lado del
              texto (como los boxes de cómic), así que cada tarjeta necesita el
              ancho entero. */}
          <Box display="grid" gridTemplateColumns="1fr" gap={{ base: 5, md: 6 }} w="100%">
            {LEYES_TAO.map((ley, i) => (
              <Reveal key={ley.key} inView direction="up" distance={26} scaleFrom={0.98} duration={0.7}
                      amount={0.15} w="100%" h="100%">
                <LeyCard ley={ley} numero={i + 1} />
              </Reveal>
            ))}
          </Box>

          {/* ── CIERRE ── */}
          <Reveal inView direction="up" distance={24} scaleFrom={0.98} duration={0.7} amount={0.2} w="100%">
          <Panel titulo="Y entonces, ¿qué es curarse?">
            <Text color={tcmTxt} fontSize={{ base: "md", md: "lg" }} lineHeight="1.9"
                  style={{ textShadow: INK_SHADOW }}>
              {TAOISMO_CIERRE.texto}
            </Text>
            <Box h="1px" w="100%" my={{ base: 5, md: 6 }} bgGradient={`linear(to-r, transparent, ${tcmTxt}, transparent)`} />
            <Text color={tcmTxt} fontStyle="italic" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8"
                  textAlign="center" style={{ textShadow: INK_SHADOW }}>
              {TAOISMO_CIERRE.cita}
            </Text>
            <Text color={tcmTxt} fontSize={{ base: "sm", md: "md" }} fontWeight={600} letterSpacing="0.06em"
                  textAlign="center" mt={2} opacity={0.85} style={{ textShadow: INK_SHADOW }}>
              {TAOISMO_CIERRE.autor}
            </Text>
          </Panel>
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

// ── Tarjeta de una ley ───────────────────────────────────────────────────────
// Las ilustraciones son CUADRADAS (1:1), así que van enteras a la izquierda y el
// texto a la derecha —la estructura de los boxes con ilustración del recorrido—.
// En móvil la foto pasa arriba, cuadrada y a todo el ancho. MIENTRAS NO HAYA
// FOTO, el hueco enseña el carácter chino en grande: la tarjeta se sostiene
// igual y no queda ningún hueco ni foto rota.
function LeyCard({ ley, numero }: { ley: LeyTao; numero: number }) {
  const [sinFoto, setSinFoto] = useState(false);

  return (
    <Box position="relative" w="100%" h="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}
         display="flex" flexDirection="column">
      <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />

      <Flex position="relative" zIndex={1} direction={{ base: "column", md: "row" }} align="stretch" h="100%">
        {/* Ilustración cuadrada */}
        <Box position="relative" flexShrink={0} overflow="hidden" bg={`${tcmBg}88`}
             w={{ base: "100%", md: "300px" }}
             sx={{ aspectRatio: "1" }}
             alignSelf={{ base: "auto", md: "flex-start" }}
             m={{ base: 0, md: 5 }}
             borderRadius={{ base: 0, md: "xl" }}>
          {!sinFoto && (
            <Image src={encodeURI(FOTO_LEY(ley.key))} alt="" w="100%" h="100%" objectFit="cover"
                   onError={() => setSinFoto(true)} />
          )}
          {/* Velo inferior para que el carácter y el número se lean sobre la foto */}
          <Box position="absolute" inset={0} pointerEvents="none"
               bgGradient={`linear(to-t, ${tcmBg}e0, ${tcmBg}33 45%, transparent)`} />

          {/* Número de la ley, arriba a la izquierda */}
          <Flex position="absolute" top="10px" left="10px" align="center" justify="center"
                w={{ base: "26px", md: "30px" }} h={{ base: "26px", md: "30px" }} borderRadius="full"
                bg={`${tcmBg}dd`} border={`1px solid ${tcmTxt}66`}>
            <Text color={tcmTxt} fontSize={{ base: "xs", md: "sm" }} fontWeight={800} lineHeight="1">
              {numero}
            </Text>
          </Flex>

          {/* El carácter chino: grande si no hay foto, montado abajo si la hay */}
          <Flex position="absolute" inset={0} align={sinFoto ? "center" : "flex-end"}
                justify={sinFoto ? "center" : "flex-start"} px={{ base: 5, md: 5 }} pb={sinFoto ? 0 : 3}>
            <Text color={tcmTxt} lineHeight="1" fontWeight={700}
                  fontSize={sinFoto ? { base: "6xl", md: "7xl" } : { base: "4xl", md: "5xl" }}
                  style={{ textShadow: `0 2px 10px ${tcmBg}, 0 0 26px ${tcmBg}` }}>
              {ley.hanzi}
            </Text>
          </Flex>
        </Box>

        {/* Texto */}
        <Box flex="1" minW={0} px={{ base: 6, md: 7 }} py={{ base: 5, md: 6 }}>
        <Text color={tcmTxt} fontSize="xs" fontWeight={700} letterSpacing="0.14em" textTransform="uppercase"
              opacity={0.75} style={{ textShadow: INK_SHADOW }}>
          {ley.pinyin}
        </Text>
        <Text color={tcmTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight={800} lineHeight="1.2" mt={0.5}
              style={{ textShadow: INK_SHADOW }}>
          {ley.nombre}
        </Text>

        <Text color={tcmTxt} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" fontWeight={600}
              lineHeight="1.6" mt={3} style={{ textShadow: INK_SHADOW }}>
          {ley.esencia}
        </Text>

        <Text color={tcmTxt} fontSize={{ base: "md", md: "lg" }} lineHeight="1.85" mt={3}
              style={{ textShadow: INK_SHADOW }}>
          {ley.texto}
        </Text>

        {/* En tu cuerpo · el puente con la medicina */}
        <Flex gap={2.5} align="flex-start" mt={4} pt={4} borderTop={`1px solid ${tcmTxt}33`}>
          <Box flexShrink={0} mt={{ base: "9px", md: "10px" }} w="5px" h="5px" borderRadius="full"
               bg={tcmTxt} boxShadow={`0 0 6px ${tcmTxt}`} />
          <Text color={tcmTxt} fontSize={{ base: "sm", md: "md" }} lineHeight="1.7" opacity={0.92}
                style={{ textShadow: INK_SHADOW }}>
            {ley.enTuCuerpo}
          </Text>
        </Flex>
        </Box>
      </Flex>
    </Box>
  );
}

// ── Box común de la página (misma caja que el resto del recorrido de TCM) ────
function Panel({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
      <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
      <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 6, md: 8 }}>
        {titulo && (
          <>
            <Text color={tcmTxt} fontSize={{ base: "xs", md: "sm" }} fontWeight={700} letterSpacing="0.1em"
                  textTransform="uppercase" mb={3} style={{ textShadow: INK_SHADOW }}>
              {titulo}
            </Text>
            <Box h="1px" w="100%" mb={4} bg={`${tcmTxt}88`} />
          </>
        )}
        {children}
      </Box>
    </Box>
  );
}
