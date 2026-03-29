import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Collapse, Flex, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import SiteHeader from "../../global/SiteHeader";
import SiteFooter from "../../global/Footer";
import { DisciplineHeader } from "../../global/DisciplineHeader";
import { ContactModal } from "../../global/ContactModal";
import { SaberMasButton } from "../../global/SaberMasButton";
import { FloatingActionButton } from "../../aprendizaje/FloatingActionButton";
import { astrologiaBg, astrologiaNom, astrologiaTxt, AstrologiaIcon } from "../../../GlobalVariables";
import { modulosAstrologiaCurso0 } from "../../../hardCoded/aprendizajes/Astrologia/ModulosAstrologia";
import type { Submodulo } from "../../../dtos/aprendizaje.type";

const popIn = keyframes`
  from { opacity: 0; transform: scale(0.2); }
  to   { opacity: 1; transform: scale(1); }
`;

/* ══════════════════════════════════════════════
   PLANETAS
══════════════════════════════════════════════ */
interface Planet {
  key: string;
  label: string;
  symbol: string;
  color: string;
}

const PLANETS: Planet[] = [
  { key: "sol",        label: "Sol",        symbol: "\u2609", color: "#FFD97D" },
  { key: "luna",       label: "Luna",       symbol: "\u263D", color: "#C8C8E8" },
  { key: "mercurio",   label: "Mercurio",   symbol: "\u263F", color: "#A8B8C8" },
  { key: "venus",      label: "Venus",      symbol: "\u2640", color: "#FFB8D0" },
  { key: "marte",      label: "Marte",      symbol: "\u2642", color: "#FF7055" },
  { key: "jupiter",    label: "Júpiter",    symbol: "\u2643", color: "#FFBA60" },
  { key: "saturno",    label: "Saturno",    symbol: "\u2644", color: "#E0CC80" },
  { key: "urano",      label: "Urano",      symbol: "\u2645", color: "#80EFD8" },
  { key: "neptuno",    label: "Neptuno",    symbol: "\u2646", color: "#6090FF" },
  { key: "pluton",     label: "Plutón",     symbol: "\u2647", color: "#B080E0" },
  { key: "ascendente", label: "Ascendente", symbol: "\u2191", color: astrologiaTxt },
];

/* Mapa planeta → submodule */
const PLANET_SUB: Record<string, Submodulo> = {
  ascendente: modulosAstrologiaCurso0[2].submodules[0],
  sol:        modulosAstrologiaCurso0[2].submodules[1],
  luna:       modulosAstrologiaCurso0[2].submodules[2],
  mercurio:   modulosAstrologiaCurso0[2].submodules[3],
  venus:      modulosAstrologiaCurso0[2].submodules[4],
  marte:      modulosAstrologiaCurso0[2].submodules[5],
  jupiter:    modulosAstrologiaCurso0[3].submodules[0],
  saturno:    modulosAstrologiaCurso0[3].submodules[1],
  urano:      modulosAstrologiaCurso0[3].submodules[2],
  neptuno:    modulosAstrologiaCurso0[3].submodules[3],
  pluton:     modulosAstrologiaCurso0[3].submodules[4],
};

/* ══════════════════════════════════════════════
   FONDO ESPACIAL
══════════════════════════════════════════════ */
const SpaceBg = () => (
  <Box position="absolute" inset="0" pointerEvents="none" overflow="hidden" borderRadius="inherit">
    <Box
      as="img" src="/img/astrologia/space.jpg" alt=""
      position="absolute" inset="0" w="100%" h="100%"
      style={{ objectFit: "cover", objectPosition: "center" }}
    />
    <Box position="absolute" inset="0" style={{ background: "rgba(8,13,30,0.55)" }} />
  </Box>
);

/* ══════════════════════════════════════════════
   SÍMBOLO DE PLANETA
══════════════════════════════════════════════ */
const PlanetGlyph = ({ symbol, size = 32, color }: { symbol: string; size?: number; color: string }) => (
  <svg viewBox="0 0 36 36" width={size} height={size} style={{ flexShrink: 0, filter: `drop-shadow(0 0 6px ${color}99)` }}>
    <text x="18" y="27" textAnchor="middle" fontSize="26"
      fontFamily="'Times New Roman', Georgia, 'DejaVu Serif', serif"
      fill={color}>
      {symbol}{"\uFE0E"}
    </text>
  </svg>
);

/* ══════════════════════════════════════════════
   CÍRCULO DE PLANETA
══════════════════════════════════════════════ */
const PlanetCircle = ({ planet, onClick, size }: { planet: Planet; onClick: () => void; size: number }) => (
  <Flex direction="column" align="center" gap={1.5} style={{ width: size + 24 }}>
    <Box
      as="button" onClick={onClick}
      w={`${size}px`} h={`${size}px`}
      borderRadius="full"
      bg={`${astrologiaBg}dd`}
      border={`1.5px solid ${planet.color}74`}
      boxShadow={`0 0 28px ${planet.color}66, 0 0 56px ${planet.color}28, inset 0 0 16px ${planet.color}14`}
      display="flex" alignItems="center" justifyContent="center"
      cursor="pointer" transition="all 0.26s ease" overflow="hidden"
      _hover={{ border: `1.5px solid ${planet.color}99`, transform: "scale(1.08)" }}
    >
      <PlanetGlyph symbol={planet.symbol} size={Math.round(size * 0.5)} color={planet.color} />
    </Box>
    <Text
      color={`${astrologiaTxt}cc`} fontSize="xs"
      fontFamily="'EB Garamond', serif" letterSpacing="0.08em"
      textTransform="uppercase" lineHeight="1" userSelect="none"
      textAlign="center" noOfLines={1}
    >
      {planet.label}
    </Text>
  </Flex>
);

/* ══════════════════════════════════════════════
   MODAL DE PLANETA
══════════════════════════════════════════════ */
const PlanetModal = ({ submodule, planet, onClose }: { submodule: Submodulo; planet: Planet; onClose: () => void }) => {
  const [letraOpen, setLetraOpen] = useState(false);

  return (
    <Box
      position="fixed" inset="0" zIndex={1000}
      display="flex" alignItems="center" justifyContent="center"
      px={4}
      onClick={onClose}
    >
      <Box position="absolute" inset="0" bg="rgba(0,0,0,0.80)" />

      <Box
        position="relative"
        filter={`drop-shadow(0 0 10px ${planet.color}bb) drop-shadow(0 0 20px ${planet.color}66)`}
        borderRadius="2xl"
        style={{ overflow: "clip" }}
        w="100%" maxW="660px"
        maxH="92vh"
        display="flex" flexDirection="column"
        boxShadow={`0 12px 60px rgba(0,0,0,0.8), 0 0 60px ${planet.color}18`}
        onClick={(e) => e.stopPropagation()}
      >
        <SpaceBg />

        {/* Botón X */}
        <Box position="absolute" top={3} right={3} zIndex={2}>
          <Box
            as="button" onClick={onClose}
            w="30px" h="30px" borderRadius="full"
            display="flex" alignItems="center" justifyContent="center"
            bg="rgba(0,0,0,0.5)"
            border={`1px solid ${astrologiaTxt}33`}
            color={`${astrologiaTxt}88`}
            cursor="pointer" transition="all 0.15s"
            _hover={{ color: astrologiaTxt, borderColor: `${astrologiaTxt}77`, bg: "rgba(0,0,0,0.7)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor">
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
            </svg>
          </Box>
        </Box>

        <Box
          position="relative" zIndex={1}
          px={6} py={7}
          display="flex" flexDirection="column" gap={4}
          overflowY="auto" flex="1"
        >
          {/* Título */}
          <Box
            bg={astrologiaBg}
            border={`1.5px solid ${planet.color}44`}
            borderRadius="xl"
            px={6} py={5}
            boxShadow={`0 0 28px ${planet.color}22, inset 0 0 20px rgba(0,0,0,0.3)`}
          >
            <Flex align="center" justify="center" gap={3}>
              <PlanetGlyph symbol={planet.symbol} size={30} color={planet.color} />
              <Text
                color={astrologiaTxt}
                fontSize="2xl" fontWeight="700"
                fontFamily="'EB Garamond', serif" letterSpacing="0.07em"
                style={{ textShadow: `0 0 10px ${planet.color}bb, 0 0 20px ${planet.color}66` }}
              >
                {submodule.nom}
              </Text>
            </Flex>
          </Box>

          {/* Vídeo */}
          {submodule.video && (
            <Box
              borderRadius="xl" overflow="hidden"
              border={`1px solid ${astrologiaTxt}22`}
              style={{ aspectRatio: "16/9", flexShrink: 0 }}
              boxShadow={`0 4px 24px rgba(0,0,0,0.55), 0 0 24px ${planet.color}18`}
            >
              <iframe
                style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                src={`https://www.youtube.com/embed/${submodule.video}`}
                title={submodule.nom}
                allowFullScreen
              />
            </Box>
          )}

          {/* Descripción */}
          <Box
            bg={astrologiaBg}
            border={`1px solid ${astrologiaTxt}22`}
            borderRadius="xl"
            px={5} py={3}
            boxShadow={`0 0 16px ${astrologiaTxt}10, inset 0 0 12px rgba(0,0,0,0.25)`}
          >
            <Text
              color={`${astrologiaTxt}cc`}
              fontSize={{ base: "lg", md: "xl" }}
              fontFamily="'EB Garamond', serif"
              fontStyle="italic"
              lineHeight="1.8" letterSpacing="0.02em"
              textAlign="center"
            >
              {submodule.descripcion}
            </Text>
          </Box>

          {/* Transcripción */}
          {submodule.letra && (
            <Box>
              <Flex
                as="button" w="100%"
                align="center" justify="space-between"
                px={5} py={3}
                bg={astrologiaBg}
                border={`1px solid ${astrologiaTxt}22`}
                borderRadius={letraOpen ? "xl xl 0 0" : "xl"}
                cursor="pointer"
                onClick={() => setLetraOpen(!letraOpen)}
                transition="border-radius 0.2s"
              >
                <Text color={astrologiaTxt} fontSize="md" fontWeight="600"
                  fontFamily="'EB Garamond', serif" letterSpacing="0.04em">
                  Transcripción
                </Text>
                <Text color={astrologiaTxt} fontSize="xl"
                  transition="transform 0.25s"
                  transform={letraOpen ? "rotate(180deg)" : "rotate(0deg)"}>
                  ▾
                </Text>
              </Flex>
              <Collapse in={letraOpen} animateOpacity>
                <Box
                  px={5} py={4}
                  bg={astrologiaBg}
                  border={`1px solid ${astrologiaTxt}22`}
                  borderTop="none"
                  borderRadius="0 0 xl xl"
                >
                  <Text
                    color={`${astrologiaTxt}cc`}
                    fontSize={{ base: "md", md: "lg" }}
                    fontFamily="'EB Garamond', serif"
                    lineHeight="2" letterSpacing="0.02em"
                    whiteSpace="pre-wrap"
                  >
                    {submodule.letra}
                  </Text>
                </Box>
              </Collapse>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

/* ══════════════════════════════════════════════
   CARD PLEGABLE — OBTÉN TU CARTA ASTRAL
══════════════════════════════════════════════ */
const ObtenerCartaCard = () => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const URL_CARTA = "https://carta-natal.es/carta.php";

  const handleCopy = () => {
    navigator.clipboard.writeText(URL_CARTA).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Box
      w="100%" maxW="1100px"
      position="relative" overflow="hidden"
      border={`1.5px solid ${astrologiaTxt}28`}
      borderRadius="3xl"
      boxShadow={`0 4px 32px rgba(0,0,0,0.6), 0 0 60px ${astrologiaTxt}18`}
    >
      <SpaceBg />

      {/* Header clickeable */}
      <Flex
        as="button"
        w="100%"
        align="center" justify="space-between"
        px={{ base: 6, md: 8 }} py={{ base: 5, md: 6 }}
        cursor="pointer"
        onClick={() => setOpen(!open)}
        position="relative" zIndex={1}
        transition="all 0.18s"
        _hover={{ bg: `${astrologiaTxt}08` }}
      >
        <Flex align="center" gap={3}>
          <Box
            w="36px" h="36px" borderRadius="full"
            bg={`${astrologiaTxt}0c`}
            border={`1px solid ${astrologiaTxt}2a`}
            display="flex" alignItems="center" justifyContent="center"
            color={astrologiaTxt}
            boxShadow={`0 0 10px ${astrologiaTxt}22`}
            flexShrink={0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
              <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Zm-20 200h80v-200h-80v200Zm40-280q17 0 28.5-11.5T540-600q0-17-11.5-28.5T500-640q-17 0-28.5 11.5T460-600q0 17 11.5 28.5T500-560Z"/>
            </svg>
          </Box>
          <Text
            color={astrologiaTxt}
            fontSize={{ base: "xl", md: "2xl" }} fontWeight="700"
            fontFamily="'EB Garamond', serif" letterSpacing="0.06em"
            style={{ textShadow: `0 0 14px ${astrologiaTxt}cc, 0 0 28px ${astrologiaTxt}66` }}
            textAlign="left"
          >
            Obtén tu Carta Astral
          </Text>
        </Flex>
        <Text
          color={astrologiaTxt} fontSize="2xl"
          transition="transform 0.3s"
          transform={open ? "rotate(180deg)" : "rotate(0deg)"}
          flexShrink={0}
        >
          ▾
        </Text>
      </Flex>

      {/* Contenido plegable */}
      <Collapse in={open} animateOpacity>
        <Box
          position="relative" zIndex={1}
          px={{ base: 6, md: 8 }} pb={{ base: 6, md: 8 }}
          display="flex" flexDirection="column" gap={4}
          borderTop={`1px solid ${astrologiaTxt}18`}
          pt={5}
        >
          {/* Paso 1 */}
          <Box
            bg={`${astrologiaBg}bb`}
            border={`1px solid ${astrologiaTxt}22`}
            borderRadius="xl"
            px={5} py={4}
          >
            <Flex align="center" gap={2} mb={3}>
              <Box
                w="28px" h="28px" borderRadius="full"
                bg={`${astrologiaTxt}15`}
                border={`1px solid ${astrologiaTxt}33`}
                display="flex" alignItems="center" justifyContent="center"
                flexShrink={0}
              >
                <Text color={astrologiaTxt} fontSize="sm" fontWeight="700" fontFamily="'EB Garamond', serif">1</Text>
              </Box>
              <Text color={astrologiaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="600"
                fontFamily="'EB Garamond', serif" letterSpacing="0.04em">
                Ve a esta web
              </Text>
            </Flex>

            <Box
              bg={`${astrologiaBg}88`}
              border={`1px solid ${astrologiaTxt}22`}
              borderRadius="lg"
              px={4} py={3}
              display="flex" flexDirection={{ base: "column", sm: "row" }}
              alignItems={{ base: "stretch", sm: "center" }}
              gap={3}
            >
              <Text
                color={`${astrologiaTxt}cc`}
                fontSize={{ base: "sm", md: "md" }}
                fontFamily="monospace"
                letterSpacing="0.02em"
                flex="1"
                userSelect="all"
              >
                {URL_CARTA}
              </Text>
              <Box
                as="button"
                onClick={handleCopy}
                px={4} py={2}
                borderRadius="lg"
                bg={copied ? `${astrologiaTxt}22` : `${astrologiaTxt}11`}
                border={`1px solid ${copied ? astrologiaTxt + "55" : astrologiaTxt + "2a"}`}
                color={astrologiaTxt}
                cursor="pointer"
                transition="all 0.2s"
                display="flex" alignItems="center" gap={2}
                flexShrink={0}
                _hover={{ bg: `${astrologiaTxt}1e`, borderColor: `${astrologiaTxt}44` }}
              >
                {copied ? (
                  <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor">
                    <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor">
                    <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z"/>
                  </svg>
                )}
                <Text fontSize="sm" fontFamily="'EB Garamond', serif" fontWeight="600">
                  {copied ? "¡Copiado!" : "Copiar"}
                </Text>
              </Box>
            </Box>

            <Text
              color={`${astrologiaTxt}88`}
              fontSize="sm" fontFamily="'EB Garamond', serif"
              fontStyle="italic" mt={2}
            >
              Pega esta web en tu navegador
            </Text>
          </Box>

          {/* Paso 2 */}
          <Box
            bg={`${astrologiaBg}bb`}
            border={`1px solid ${astrologiaTxt}22`}
            borderRadius="xl"
            px={5} py={4}
          >
            <Flex align="center" gap={2}>
              <Box
                w="28px" h="28px" borderRadius="full"
                bg={`${astrologiaTxt}15`}
                border={`1px solid ${astrologiaTxt}33`}
                display="flex" alignItems="center" justifyContent="center"
                flexShrink={0}
              >
                <Text color={astrologiaTxt} fontSize="sm" fontWeight="700" fontFamily="'EB Garamond', serif">2</Text>
              </Box>
              <Text color={astrologiaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="600"
                fontFamily="'EB Garamond', serif" letterSpacing="0.04em">
                Rellena los datos
              </Text>
            </Flex>
            <Text
              color={`${astrologiaTxt}88`}
              fontSize="sm" fontFamily="'EB Garamond', serif"
              fontStyle="italic" mt={2} ml="40px"
            >
              Introduce tu fecha, hora y lugar de nacimiento
            </Text>
          </Box>

          {/* Paso 3 */}
          <Box
            bg={`${astrologiaBg}bb`}
            border={`1px solid ${astrologiaTxt}22`}
            borderRadius="xl"
            px={5} py={4}
            display="flex" flexDirection="column" gap={4}
          >
            <Flex align="center" gap={2}>
              <Box
                w="28px" h="28px" borderRadius="full"
                bg={`${astrologiaTxt}15`}
                border={`1px solid ${astrologiaTxt}33`}
                display="flex" alignItems="center" justifyContent="center"
                flexShrink={0}
              >
                <Text color={astrologiaTxt} fontSize="sm" fontWeight="700" fontFamily="'EB Garamond', serif">3</Text>
              </Box>
              <Text color={astrologiaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="600"
                fontFamily="'EB Garamond', serif" letterSpacing="0.04em">
                ¡Ya lo tienes!
              </Text>
            </Flex>

            {/* Imagen centrada */}
            <Box
              borderRadius="xl"
              overflow="hidden"
              border={`1px solid ${astrologiaTxt}22`}
              boxShadow={`0 4px 24px rgba(0,0,0,0.55), 0 0 24px ${astrologiaTxt}18`}
              h={{ base: "200px", md: "280px" }}
              w="100%"
            >
              <Box
                as="img"
                src="/img/astrologia/curso0.png"
                alt="Carta Astral"
                w="100%" h="100%"
                style={{ objectFit: "cover", objectPosition: "center center" }}
              />
            </Box>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

/* ══════════════════════════════════════════════
   PÁGINA PRINCIPAL
══════════════════════════════════════════════ */
export default function CartaAstralRecursos() {
  const navigate = useNavigate();
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [saberMasOpen, setSaberMasOpen] = useState(false);
  const chartWrapperRef = useRef<HTMLDivElement>(null);
  const [wrapperWidth, setWrapperWidth] = useState(0);

  /* ── Geometría ── */
  const N       = PLANETS.length;
  const PSIZE   = 100;
  const CENTER  = 310;
  const R       = 290;
  const PAD     = 28;
  const LABEL_H = 44;

  const containerSide = Math.round(2 * (R + PSIZE / 2 + PAD));
  const cx = containerSide / 2;
  const cy = containerSide / 2;
  const containerH = containerSide + LABEL_H + PAD;

  const getPlanetPos = (i: number) => {
    const angle = (2 * Math.PI / N) * i - Math.PI / 2;
    return {
      x: Math.round(cx + R * Math.cos(angle) - PSIZE / 2),
      y: Math.round(cy + R * Math.sin(angle) - PSIZE / 2),
    };
  };

  const chartScale   = wrapperWidth > 0 ? Math.min(1, wrapperWidth / containerSide) : 1;
  const chartOffsetX = Math.max(0, (wrapperWidth - containerSide * chartScale) / 2);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const el = chartWrapperRef.current;
    if (!el) return;
    const update = () => setWrapperWidth(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      <Box flex="1">
        <Flex
          direction="column" alignItems="center"
          px={{ base: 4, md: 8, lg: 14 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 14, md: 20 }}
          gap={6}
        >
          <DisciplineHeader
            icon={<AstrologiaIcon size={{ base: "40px", md: "56px" }} />}
            title="Carta Astral"
            subtitle="Recursos del curso"
            bgColor={`${astrologiaBg}dd`}
            color={astrologiaTxt}
            maxW="1100px"
            onIconClick={() => navigate("/aprendizaje/modulosPage/Astrología/astro-curso-0")}
          />

          {/* Card plegable: Obtén tu Carta Astral */}
          <ObtenerCartaCard />

          {/* Card circular de planetas */}
          <Box
            w="100%" maxW="1100px"
            position="relative" overflow="hidden"
            border={`1.5px solid ${astrologiaTxt}28`}
            borderRadius="3xl"
            px={{ base: 4, md: 8 }}
            pt={{ base: 8, md: 10 }}
            pb={{ base: 6, md: 8 }}
            boxShadow={`0 4px 24px rgba(0,0,0,0.5), 0 0 48px ${astrologiaTxt}14`}
          >
            <SpaceBg />

            <Box position="relative" zIndex={1}>
              {/* Título */}
              <Flex justify="center" align="center" gap={2.5} mb={{ base: 6, md: 8 }}>
                <Box flex="1" h="1px" bg={`${astrologiaTxt}1a`} borderRadius="full" />
                <Text
                  color={astrologiaTxt} fontSize={{ base: "xl", md: "2xl" }} fontWeight="700"
                  fontFamily="'EB Garamond', serif" letterSpacing="0.08em"
                  filter={`drop-shadow(0 0 8px ${astrologiaTxt}55)`}
                >
                  Los Planetas
                </Text>
                <Box flex="1" h="1px" bg={`${astrologiaTxt}1a`} borderRadius="full" />
              </Flex>

              {/* Chart responsivo */}
              <Box
                ref={chartWrapperRef}
                w="100%" mb={3}
                style={{ height: containerH * chartScale, overflow: "hidden" }}
              >
                <Box
                  position="relative"
                  style={{
                    width: containerSide,
                    height: containerH,
                    transform: `translateX(${chartOffsetX}px) scale(${chartScale})`,
                    transformOrigin: "top left",
                  }}
                >
                  {/* SVG: órbita y líneas radiales */}
                  <svg
                    style={{ position: "absolute", top: 0, left: 0, overflow: "visible", pointerEvents: "none" }}
                    width={containerSide} height={containerH}
                  >
                    <circle
                      cx={cx} cy={cy} r={R}
                      fill="none"
                      stroke={`${astrologiaTxt}14`}
                      strokeWidth="1"
                      strokeDasharray="4 8"
                    />
                    {PLANETS.map((p, i) => {
                      const pos = getPlanetPos(i);
                      return (
                        <line
                          key={p.key}
                          x1={pos.x + PSIZE / 2} y1={pos.y + PSIZE / 2}
                          x2={cx} y2={cy}
                          stroke={`${p.color}18`}
                          strokeWidth="1"
                          strokeDasharray="3 7"
                        />
                      );
                    })}
                  </svg>

                  {/* Círculos de planeta */}
                  {PLANETS.map((planet, i) => {
                    const pos = getPlanetPos(i);
                    return (
                      <Box
                        key={planet.key}
                        position="absolute"
                        style={{ left: pos.x - 12, top: pos.y }}
                        animation={`${popIn} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.15}s both`}
                      >
                        <PlanetCircle
                          planet={planet}
                          size={PSIZE}
                          onClick={() => setSelectedPlanet(planet)}
                        />
                      </Box>
                    );
                  })}

                  {/* Imagen central: carta astral */}
                  <Box
                    position="absolute"
                    style={{ left: cx - CENTER / 2, top: cy - CENTER / 2 }}
                    w={`${CENTER}px`} h={`${CENTER}px`}
                    borderRadius="full" overflow="hidden"
                    border={`2.5px solid ${astrologiaTxt}55`}
                    boxShadow={`0 0 24px ${astrologiaTxt}44, 0 0 48px ${astrologiaTxt}18`}
                    flexShrink={0}
                  >
                    <Box
                      as="img"
                      src="/img/astrologia/cartastralej.png"
                      alt="Carta Astral"
                      w="100%" h="100%"
                      style={{ objectFit: "cover", objectPosition: "center center" }}
                    />
                  </Box>
                </Box>
              </Box>

              <Text
                color={`${astrologiaTxt}66`}
                fontSize="sm" textAlign="center"
                fontFamily="'EB Garamond', serif" fontStyle="italic"
              >
                Toca un planeta para ver su lección
              </Text>
            </Box>
          </Box>

          <SaberMasButton onClick={() => setSaberMasOpen(true)} color={astrologiaTxt} bgColor={astrologiaBg} />
        </Flex>
      </Box>

      <SiteFooter />

      <ContactModal
        isOpen={saberMasOpen}
        onClose={() => setSaberMasOpen(false)}
        title="¿Quieres saber más?"
        icon={<AstrologiaIcon size={{ base: "24px", md: "24px" }} />}
        subtitle="Déjame tus datos y cuéntame en qué puedo ayudarte."
        bgColor={astrologiaBg}
        color={astrologiaTxt}
        emailSubject={`Quiero saber más — ${astrologiaNom}`}
        showDescription
      />

      {selectedPlanet && PLANET_SUB[selectedPlanet.key] && (
        <PlanetModal
          planet={selectedPlanet}
          submodule={PLANET_SUB[selectedPlanet.key]}
          onClose={() => setSelectedPlanet(null)}
        />
      )}

      <FloatingActionButton
        config={{ label: "Servicios Astrológicos", action: "astrologia-services" }}
        color={astrologiaTxt}
        bgColor={astrologiaBg}
        icon={<AstrologiaIcon size="22px" />}
      />
    </Box>
  );
}
