import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
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
  LEYES_TAO, TAOISMO_INTRO, TAOISMO_CIERRE, type LeyTao,
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
        <Flex direction="column" align="center" w="100%" maxW="1080px" gap={7}>

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
            next={{ label: "Recetas →", onClick: () => navigate("/metodo/tcm/recetas") }}
          />
          </Reveal>

          {/* Cita de apertura (sin sombra: va sobre el turquesa limpio) */}
          <Reveal direction="up" distance={20} delay={0.12} duration={0.65} display="flex" justifyContent="center">
          <Flex direction="column" align="center" gap={2} maxW="680px">
            <Text color="white" fontStyle="italic" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8"
                  textAlign="center">
              «El Tao que puede ser nombrado no es el Tao eterno.»
            </Text>
            <Text color={tcmTxt} fontSize={{ base: "sm", md: "md" }} fontWeight={600} letterSpacing="0.06em"
                  textAlign="center">
              — Lao-Tse
            </Text>
          </Flex>
          </Reveal>

          {/* ── BOX 1 · de dónde viene todo esto ── */}
          <Reveal direction="up" distance={28} scaleFrom={0.98} delay={0.2} duration={0.7} w="100%">
          <Panel titulo="La mirada de la que nace esta medicina">
            <Flex direction="column" gap={4}>
              {TAOISMO_INTRO.map((p, i) => (
                <Text key={i} color="rgba(255,255,255,0.94)" fontSize={{ base: "md", md: "lg" }} lineHeight="1.9"
                      style={{ textShadow: INK_SHADOW }}>
                  {p}
                </Text>
              ))}
            </Flex>
          </Panel>
          </Reveal>

          <Reveal inView direction="up" distance={16} duration={0.6} amount={0.4} display="flex" justifyContent="center">
          <Text color="white" fontStyle="italic" fontSize={{ base: "sm", md: "md" }} lineHeight="1.7"
                textAlign="center" maxW="680px" mt={1} style={{ textShadow: INK_SHADOW }}>
            Estas son las leyes del Tao. Léelas despacio: cada una tiene su reflejo en tu cuerpo
            y una práctica pequeña para llevarla al día a día.
          </Text>
          </Reveal>

          {/* ── LAS LEYES · dos columnas en escritorio, una en móvil ── */}
          <Box display="grid" gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={{ base: 5, md: 6 }} w="100%">
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
            <Text color="rgba(255,255,255,0.94)" fontSize={{ base: "md", md: "lg" }} lineHeight="1.9"
                  style={{ textShadow: INK_SHADOW }}>
              {TAOISMO_CIERRE.texto}
            </Text>
            <Box h="1px" w="100%" my={{ base: 5, md: 6 }} bgGradient="linear(to-r, transparent, #ffffff, transparent)" />
            <Text color="white" fontStyle="italic" fontSize={{ base: "md", md: "lg" }} lineHeight="1.8"
                  textAlign="center" style={{ textShadow: INK_SHADOW }}>
              {TAOISMO_CIERRE.cita}
            </Text>
            <Text color={tcmTxt} fontSize={{ base: "sm", md: "md" }} fontWeight={600} letterSpacing="0.06em"
                  textAlign="center" mt={2} style={{ textShadow: INK_SHADOW }}>
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
// Cabecera con el hanzi grande, el número y el nombre; después la esencia, los
// párrafos, y dos apartados marcados: «En tu cuerpo» y «Pruébalo».
function LeyCard({ ley, numero }: { ley: LeyTao; numero: number }) {
  return (
    <Box position="relative" w="100%" h="100%" borderRadius="2xl" overflow="hidden" boxShadow={CAJA_GLOW}>
      <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" />
      <Box position="relative" zIndex={1} px={{ base: 6, md: 8 }} py={{ base: 6, md: 7 }}>

        {/* Cabecera: hanzi + número/pinyin + nombre */}
        <Flex align="flex-start" gap={4}>
          <Flex flexShrink={0} align="center" justify="center" w={{ base: "56px", md: "64px" }}
                h={{ base: "56px", md: "64px" }} borderRadius="full" bg={`${tcmBg}cc`}
                border={`1px solid ${tcmTxt}66`} boxShadow={`0 0 18px ${tcmTxt}33`}>
            <Text color={tcmTxt} fontSize={{ base: "2xl", md: "3xl" }} fontWeight={700} lineHeight="1"
                  style={{ textShadow: `0 0 12px ${tcmTxt}55` }}>
              {ley.hanzi}
            </Text>
          </Flex>
          <Box minW={0}>
            <Text color={tcmTxt} fontSize="xs" fontWeight={700} letterSpacing="0.14em" textTransform="uppercase"
                  style={{ textShadow: INK_SHADOW }}>
              Ley {numero} · {ley.pinyin}
            </Text>
            <Text color="white" fontSize={{ base: "xl", md: "2xl" }} fontWeight={800} lineHeight="1.2" mt={1}
                  style={{ textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}>
              {ley.nombre}
            </Text>
          </Box>
        </Flex>

        <Box h="1px" w="100%" my={{ base: 4, md: 5 }} bgGradient="linear(to-r, transparent, #ffffff, transparent)" />

        {/* Esencia */}
        <Text color="white" fontSize={{ base: "md", md: "lg" }} fontStyle="italic" fontWeight={600}
              lineHeight="1.7" mb={4} style={{ textShadow: INK_SHADOW }}>
          {ley.esencia}
        </Text>

        {/* Desarrollo */}
        <Flex direction="column" gap={3.5}>
          {ley.texto.map((p, i) => (
            <Text key={i} color="rgba(255,255,255,0.94)" fontSize={{ base: "md", md: "lg" }} lineHeight="1.85"
                  style={{ textShadow: INK_SHADOW }}>
              {p}
            </Text>
          ))}
        </Flex>

        <Apartado titulo="En tu cuerpo" texto={ley.enTuCuerpo} />
        <Apartado titulo="Pruébalo" texto={ley.practica} />
      </Box>
    </Box>
  );
}

// ── Apartado marcado dentro de la tarjeta (etiqueta + texto) ─────────────────
function Apartado({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <>
      <Text color={tcmTxt} fontSize="xs" fontWeight={700} letterSpacing="0.1em" textTransform="uppercase"
            mt={6} mb={2} style={{ textShadow: `0 0 10px ${tcmTxt}55, ${INK_SHADOW}` }}>
        {titulo}
      </Text>
      <Flex gap={2.5} align="flex-start">
        <Box flexShrink={0} mt={{ base: "9px", md: "10px" }} w="5px" h="5px" borderRadius="full"
             bg={tcmTxt} boxShadow={`0 0 6px ${tcmTxt}`} />
        <Text color="rgba(255,255,255,0.94)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.75"
              style={{ textShadow: INK_SHADOW }}>
          {texto}
        </Text>
      </Flex>
    </>
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
