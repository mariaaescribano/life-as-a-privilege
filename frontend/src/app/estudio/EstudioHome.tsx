import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { EstudioLayout } from "../../components/estudio/EstudioLayout";
import { PlanetaEstudioBox } from "../../components/estudio/PlanetaEstudioBox";
import { PlanetaInfoModal } from "../../components/estudio/PlanetaInfoModal";
import { SPACE_IMG } from "../../components/metodo/SpaceBg";
import { CUERPOS, type CuerpoKey } from "../../components/metodo/astrologiaData";
import { Breathe, Float, Reveal, RevealItem, RevealStagger } from "../../components/global/Reveal";
import { useImagesReady } from "../../hooks/useImagesReady";
import { LifeLoading } from "../../components/global/LifeLoading";
import { AstrologiaIcon, astrologiaTxt } from "../../GlobalVariables";

/* ── Textos de la portada del estudio ── */
const TITULO = "Estudio estadístico sobre astrología";

const DESCRIPCION = [
  "Participa en el mayor estudio estadístico sobre arquetipos astrológicos en español. Responde un breve cuestionario personalizado según tu carta natal y descubre hasta qué punto conectas con cada uno de tus arquetipos. Tus respuestas, siempre anónimas, contribuirán a una investigación colectiva sobre astrología basada en datos.",
];

export default function EstudioHome() {
  const navigate = useNavigate();
  // Popup de «qué es este arquetipo». Aquí todavía no hay carta, así que los
  // boxes no preguntan nada: explican.
  const [info, setInfo] = useState<CuerpoKey | null>(null);
  // La portada no se pinta hasta que el cielo está descargado: el botón EMPEZAR
  // y los boxes lo llevan de fondo y quedaría feo entrando a trozos.
  const fotosListas = useImagesReady([SPACE_IMG, "/img/icono/life.png"]);

  if (!fotosListas) return <LifeLoading />;

  const cuerpoInfo = info ? CUERPOS.find((c) => c.key === info) ?? null : null;

  return (
    <EstudioLayout>
      <Flex direction="column" align="center" w="100%" maxW="1240px" gap={{ base: 8, md: 10 }}>
        {/* ── MANDALA ── */}
        <Reveal direction="down" distance={18} duration={0.8}>
          <Float amplitude={7} duration={6}>
            <Image
              src="/img/icono/life.png"
              alt=""
              h={{ base: "72px", md: "104px" }}
              objectFit="contain"
              style={{
                filter:
                  "drop-shadow(0 0 12px rgba(255,255,255,0.62)) drop-shadow(0 0 26px rgba(255,255,255,0.34)) drop-shadow(0 0 54px rgba(180,255,245,0.26))",
              }}
            />
          </Float>
        </Reveal>

        {/* ── TÍTULO ── */}
        <RevealStagger
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={{ base: 3, md: 4 }}
          stagger={0.1}
          delayChildren={0.25}
          textAlign="center"
        >
          <RevealItem>
            <Text
              color="white"
              fontSize={{ base: "3xl", md: "5xl" }}
              fontWeight="700"
              lineHeight="1.12"
              letterSpacing="0.06em"
              textTransform="uppercase"
              maxW="760px"
              textShadow="0 0 16px rgba(255,255,255,0.6), 0 0 38px rgba(180,255,245,0.32), 0 0 72px rgba(255,255,255,0.18)"
            >
              {TITULO}
            </Text>
          </RevealItem>

          <RevealItem w="100%" maxW="560px">
            <Box h="1px" bgGradient="linear(to-r, transparent, rgba(255,255,255,0.55), transparent)" />
          </RevealItem>

          {DESCRIPCION.map((p, i) => (
            <RevealItem key={i}>
              <Text
                color="rgba(255,255,255,0.9)"
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="1.85"
                maxW="720px"
                textShadow="0 0 10px rgba(255,255,255,0.22)"
              >
                {p}
              </Text>
            </RevealItem>
          ))}
        </RevealStagger>

        {/* ── BOTÓN EMPEZAR ──
            Icono de Astrología a la izquierda, sin foto de fondo: solo el
            contorno y su color. Respira despacio para que la portada no se
            quede quieta del todo. */}
        <Reveal direction="up" distance={20} duration={0.8} delay={0.7} w="100%" maxW="420px">
          <Breathe scale={0.015} duration={5.5}>
            <Flex
              as="button"
              onClick={() => navigate("/estudio/datos")}
              position="relative"
              overflow="hidden"
              align="center"
              justify="center"
              gap={4}
              w="100%"
              px={{ base: 7, md: 9 }}
              py={{ base: 5, md: 6 }}
              borderRadius="full"
              border={`2px solid ${astrologiaTxt}`}
              cursor="pointer"
              transition="transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease"
              boxShadow={`0 0 18px rgba(255,255,255,0.18), 0 0 42px ${astrologiaTxt}22`}
              _hover={{
                transform: "translateY(-2px)",
                borderColor: astrologiaTxt,
                boxShadow: `0 0 26px rgba(255,255,255,0.32), 0 0 62px ${astrologiaTxt}3a`,
              }}
            >
              <Flex position="relative" zIndex={1} align="center" gap={4}>
                <AstrologiaIcon size={{ base: "30px", md: "36px" }} />
                <Text
                  color={astrologiaTxt}
                  fontSize={{ base: "xl", md: "2xl" }}
                  fontWeight="700"
                  letterSpacing="0.24em"
                  textTransform="uppercase"
                  style={{ textShadow: `0 0 14px rgba(255,255,255,0.5), 0 0 32px ${astrologiaTxt}66` }}
                >
                  Empezar
                </Text>
              </Flex>
            </Flex>
          </Breathe>
        </Reveal>

        {/* ── SEPARADOR ── */}
        <Reveal direction="none" duration={0.9} delay={0.95} w="100%" maxW="560px">
          <Box h="1px" bgGradient="linear(to-r, transparent, rgba(255,255,255,0.55), transparent)" />
        </Reveal>

        {/* ── LOS ARQUETIPOS ──
            Son los MISMOS boxes que se encontrará al responder (mismo componente),
            aquí en su forma desnuda: icono y nombre. Al pinchar no salen preguntas
            —todavía no hay carta—, sale un popup explicando qué es ese arquetipo. */}
        <Reveal direction="up" distance={16} duration={0.7} delay={1.05}>
          <Text color="white" fontSize={{ base: "xl", md: "3xl" }} fontWeight="700"
                letterSpacing="0.08em" textTransform="uppercase" textAlign="center"
                textShadow="0 0 14px rgba(255,255,255,0.5), 0 0 32px rgba(180,255,245,0.28)">
            Los arquetipos del estudio
          </Text>
        </Reveal>

        {/* En móvil uno debajo de otro; dos en tablet, tres en escritorio. */}
        <RevealStagger
          display="grid"
          w="100%"
          gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
          gap={{ base: 4, md: 6 }}
          stagger={0.05}
          delayChildren={1.2}
        >
          {CUERPOS.map((c) => (
            <RevealItem key={c.key}>
              <PlanetaEstudioBox cuerpo={c} onClick={() => setInfo(c.key)} />
            </RevealItem>
          ))}
        </RevealStagger>
      </Flex>

      <PlanetaInfoModal isOpen={!!cuerpoInfo} onClose={() => setInfo(null)} cuerpo={cuerpoInfo} />
    </EstudioLayout>
  );
}
