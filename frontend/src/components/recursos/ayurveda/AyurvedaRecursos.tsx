import React, { useEffect, useState } from "react";
import { Box, Collapse, Flex, Grid, Text } from "@chakra-ui/react";
import SiteHeader from "../../global/SiteHeader";
import SiteFooter from "../../global/Footer";
import { DisciplineHeader } from "../../global/DisciplineHeader";
import {
  AyurvedaIcon,
  ayurvedaBg,
  ayurvedaNom,
  ayurvedaTxt,
  VataIcon,
  PittaIcon,
  KaphaIcon,
  vataColor,
  pittaColor,
  kaphaColor,
} from "../../../GlobalVariables";
import {
  letraAyu2,
  letraAyu5,
  letraAyu6,
  letraAyu7,
} from "../../../hardCoded/aprendizajes/Ayurveda/LetraAyurveda";

const BG     = ayurvedaBg;
const ACCENT = ayurvedaTxt;
const GLOW   = `0 4px 24px rgba(152,126,55,0.18), 0 1px 6px rgba(0,0,0,0.08)`;

/* ══════════════════════════════════════════
   ELEMENT ICONS
══════════════════════════════════════════ */
const EterIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.5" fill={color} stroke="none" />
  </svg>
);

const AguaIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3 C9 7 5 11 5 15 a7 7 0 0 0 14 0 C19 11 15 7 12 3 Z" />
    <path d="M9 16 a3 3 0 0 0 3 2.5" strokeWidth="1.2" opacity="0.6" />
  </svg>
);

const FuegoIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C12 2 9.5 6 9.5 9.5C9.5 9.5 8 8.5 8 6.5C8 6.5 5 9.5 5 13.5C5 17.6 8.1 21 12 21C15.9 21 19 17.6 19 13.5C19 9 12 2 12 2ZM12 19C10.3 19 9 17.6 9 15.8C9 14.5 9.8 13.4 10.5 12.5C10.5 13.8 11.4 14.8 12.5 15C12.5 15 11.5 13.5 12.5 12C13.5 10.5 14 9 14 9C14 9 16 11 16 13.5C16 16.5 14.2 19 12 19Z" opacity="0.9"/>
  </svg>
);

const AireIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round">
    <path d="M3 8 h11 a3 3 0 1 0-3-3" />
    <path d="M3 12 h14" />
    <path d="M3 16 h9 a3 3 0 1 1-3 3" />
  </svg>
);

const TierraIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21 V12" />
    <path d="M12 12 C12 7 19 4 21 3 C21 10 16 13 12 12 Z" />
    <path d="M12 15 C12 11 6 9 3 7 C3 13 7 16 12 15 Z" />
  </svg>
);

/* ══════════════════════════════════════════
   DATA
══════════════════════════════════════════ */
const ELEMENTOS = [
  { nombre: "Éter",   color: "#7c5cbf", Icon: EterIcon   },
  { nombre: "Agua",   color: "#2b9a9a", Icon: AguaIcon   },
  { nombre: "Fuego",  color: "#c0522a", Icon: FuegoIcon  },
  { nombre: "Aire",   color: "#3d82c0", Icon: AireIcon   },
  { nombre: "Tierra", color: "#3a8a5c", Icon: TierraIcon },
];

type DoshaKey = "vata" | "pitta" | "kapha";

const DOSHAS: {
  key: DoshaKey;
  nombre: string;
  color: string;
  subtitulo: string;
  elementos: { nombre: string; color: string; Icon: React.FC<{ color: string }> }[];
  descripcion: string;
  letra: string;
  video: string;
  icon: (size: string) => React.ReactNode;
}[] = [
  {
    key: "vata",
    nombre: "Vata",
    color: vataColor,
    subtitulo: "Aire · Éter",
    elementos: [ELEMENTOS[3], ELEMENTOS[0]], // Aire + Éter
    descripcion:
      "Vata es la energía del movimiento: ligera, rápida, creativa e intuitiva. Las personas Vata son entusiastas e imaginativas, aunque tienden a la dispersión y la irregularidad. Para equilibrarse necesita rutina, calor y alimentos nutritivos que anclen su energía.",
    letra: letraAyu5,
    video: "5WfC9mGUndM",
    icon: (size) => <VataIcon size={size} color={vataColor} />,
  },
  {
    key: "pitta",
    nombre: "Pitta",
    color: pittaColor,
    subtitulo: "Fuego · Agua",
    elementos: [ELEMENTOS[2], ELEMENTOS[1]], // Fuego + Agua
    descripcion:
      "Pitta es la energía de la transformación: intensa, decidida y precisa. Las personas Pitta son líderes naturales con gran capacidad de ejecución, aunque pueden caer en la irritabilidad y el exceso de calor. Para equilibrarse necesita frescor, moderación y calma.",
    letra: letraAyu6,
    video: "mWy5tkGplz0",
    icon: (size) => <PittaIcon size={size} color={pittaColor} />,
  },
  {
    key: "kapha",
    nombre: "Kapha",
    color: kaphaColor,
    subtitulo: "Tierra · Agua",
    elementos: [ELEMENTOS[4], ELEMENTOS[1]], // Tierra + Agua
    descripcion:
      "Kapha es la energía de la estructura: estable, resistente y profundamente afectuosa. Las personas Kapha son constantes y pacientes, aunque tienden al apego y la resistencia al cambio. Para equilibrarse necesita movimiento, estimulación y una dieta ligera.",
    letra: letraAyu7,
    video: "8cPUwuSFnWQ",
    icon: (size) => <KaphaIcon size={size} color={kaphaColor} />,
  },
];

const ELEMENTOS_VIDEO = "gdr9WTsvmn8";

/* ══════════════════════════════════════════
   YOUTUBE EMBED
══════════════════════════════════════════ */
function YoutubeEmbed({ videoId, color }: { videoId: string; color: string }) {
  return (
    <Box
      borderRadius="xl"
      overflow="hidden"
      border={`1px solid ${color}30`}
      w="100%"
      sx={{ aspectRatio: "16/9" }}
    >
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0`}
        width="100%"
        height="100%"
        style={{ border: "none", display: "block" }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Video"
      />
    </Box>
  );
}

/* ══════════════════════════════════════════
   ELEMENTOS MODAL
══════════════════════════════════════════ */
function ElementosModal({ onClose }: { onClose: () => void }) {
  const [letraOpen, setLetraOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  return (
    <Box
      position="fixed" inset={0} zIndex={1000}
      bg="rgba(0,0,0,0.60)"
      sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
      display="flex" alignItems="center" justifyContent="center"
      px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}
      onClick={onClose}
    >
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        position="relative"
        w={{ base: "95%", md: "620px" }}
        maxH={{ base: "90vh", md: "88vh" }}
        overflowY="auto"
        borderRadius="24px"
        bg={BG}
        boxShadow={`0 32px 80px rgba(0,0,0,0.45), 0 0 40px ${ACCENT}30`}
        border={`1.5px solid ${ACCENT}40`}
        sx={{
          "&::-webkit-scrollbar": { width: "5px" },
          "&::-webkit-scrollbar-thumb": { bg: ACCENT + "44", borderRadius: "full" },
        }}
      >
        <Box
          as="button" position="absolute" top="14px" right="14px"
          w="34px" h="34px" borderRadius="full"
          bg={ACCENT + "12"} border={`1px solid ${ACCENT}30`}
          display="flex" alignItems="center" justifyContent="center"
          color={ACCENT} fontSize="15px" fontWeight="700"
          cursor="pointer" transition="all 0.18s"
          _hover={{ bg: ACCENT + "22" }}
          onClick={onClose}
        >✕</Box>

        <Box px={{ base: 6, md: 10 }} pt={8} pb={9}>
          {/* Título */}
          <Flex align="center" gap={3} mb={6}>
            <AyurvedaIcon size={{ base: "28px", md: "32px" }} />
            <Text
              color={ACCENT}
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="700"
              fontFamily="'EB Garamond', serif"
              lineHeight="1"
            >
              Los Cinco Elementos
            </Text>
          </Flex>

          {/* Video */}
          <YoutubeEmbed videoId={ELEMENTOS_VIDEO} color={ACCENT} />

          {/* Descripción */}
          <Box
            w="100%"
            bg={BG}
            border={`1px solid ${ACCENT}44`}
            borderRadius="2xl"
            px={{ base: 6, md: 10 }}
            boxShadow={GLOW}
            py={{ base: 4, md: 6 }}
            mt={{ base: 5, md: 7 }}
            mb={{ base: 5, md: 7 }}
          >
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color={ACCENT}
              lineHeight="1.8"
              fontStyle="italic"
              letterSpacing="0.02em"
              fontFamily="'EB Garamond', serif"
            >
             Conoce los cinco elementos fundamentales que componen toda la naturaleza y la energía vital que los anima.
            </Text>
          </Box>

          {/* Transcripción plegable */}
          <Flex
            as="button"
            w="100%"
            boxShadow={GLOW}
            align="center"
            justify="space-between"
            px={{ base: 6, md: 10 }}
            py={{ base: 3, md: 4 }}
            bg={BG}
            border={`1px solid ${ACCENT}44`}
            borderRadius={letraOpen ? "2xl 2xl 0 0" : "2xl"}
            cursor="pointer"
            onClick={() => setLetraOpen((o) => !o)}
            transition="border-radius 0.2s"
          >
            <Text
              color={ACCENT}
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="600"
              letterSpacing="0.04em"
              fontFamily="'EB Garamond', serif"
            >
              Transcripción
            </Text>
            <Text
              color={ACCENT} fontSize="xl"
              transition="transform 0.25s"
              transform={letraOpen ? "rotate(180deg)" : "rotate(0deg)"}
            >
              ▾
            </Text>
          </Flex>
          <Collapse in={letraOpen} animateOpacity>
            <Box
              px={{ base: 6, md: 10 }}
              py={{ base: 5, md: 7 }}
              bg={BG}
              border={`1px solid ${ACCENT}44`}
              borderTop="none"
              borderRadius="0 0 2xl 2xl"
            >
              <Text
                color={ACCENT}
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="2"
                letterSpacing="0.02em"
                whiteSpace="pre-wrap"
                fontFamily="'EB Garamond', serif"
              >
                {letraAyu2}
              </Text>
            </Box>
          </Collapse>
        </Box>
      </Box>
    </Box>
  );
}

/* ══════════════════════════════════════════
   DOSHA MODAL
══════════════════════════════════════════ */
function DoshaModal({
  dosha,
  onClose,
}: {
  dosha: (typeof DOSHAS)[0];
  onClose: () => void;
}) {
  const [letraOpen, setLetraOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  return (
    <Box
      position="fixed" inset={0} zIndex={1000}
      bg="rgba(0,0,0,0.60)"
      sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
      display="flex" alignItems="center" justifyContent="center"
      px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}
      onClick={onClose}
    >
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        position="relative"
        w={{ base: "95%", md: "620px" }}
        maxH={{ base: "90vh", md: "88vh" }}
        overflowY="auto"
        borderRadius="24px"
        bg={BG}
        boxShadow={`0 32px 80px rgba(0,0,0,0.45), 0 0 40px ${dosha.color}30`}
        border={`1.5px solid ${dosha.color}40`}
        sx={{
          "&::-webkit-scrollbar": { width: "5px" },
          "&::-webkit-scrollbar-thumb": { bg: dosha.color + "44", borderRadius: "full" },
        }}
      >
        {/* Botón cerrar */}
        <Box
          as="button" position="absolute" top="14px" right="14px"
          w="34px" h="34px" borderRadius="full"
          bg={dosha.color + "12"} border={`1px solid ${dosha.color}30`}
          display="flex" alignItems="center" justifyContent="center"
          color={dosha.color} fontSize="15px" fontWeight="700"
          cursor="pointer" transition="all 0.18s"
          _hover={{ bg: dosha.color + "22" }}
          onClick={onClose}
        >✕</Box>

        <Box px={{ base: 6, md: 10 }} pt={8} pb={9}>
          {/* Título */}
          <Flex align="center" gap={3} mb={6}>
            <Box flexShrink={0}>{dosha.icon("32px")}</Box>
            <Box>
              <Text
                color={dosha.color}
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="700"
                fontFamily="'EB Garamond', serif"
                lineHeight="1"
              >
                {dosha.nombre}
              </Text>
              <Text color={dosha.color} fontSize="sm" opacity={0.65} mt={0.5}>
                {dosha.subtitulo}
              </Text>
            </Box>
          </Flex>

          {/* Video */}
          <YoutubeEmbed videoId={dosha.video} color={dosha.color} />

          {/* Descripción */}
          <Box
            w="100%"
            bg={BG}
            border={`1px solid ${dosha.color}44`}
            borderRadius="2xl"
            px={{ base: 6, md: 10 }}
            boxShadow={GLOW}
            py={{ base: 4, md: 6 }}
            mt={{ base: 5, md: 7 }}
            mb={{ base: 5, md: 7 }}
          >
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color={dosha.color}
              lineHeight="1.8"
              fontStyle="italic"
              letterSpacing="0.02em"
              fontFamily="'EB Garamond', serif"
            >
              {dosha.descripcion}
            </Text>
          </Box>

          {/* Transcripción plegable */}
          <Flex
            as="button"
            w="100%"
            boxShadow={GLOW}
            align="center"
            justify="space-between"
            px={{ base: 6, md: 10 }}
            py={{ base: 3, md: 4 }}
            bg={BG}
            border={`1px solid ${dosha.color}44`}
            borderRadius={letraOpen ? "2xl 2xl 0 0" : "2xl"}
            cursor="pointer"
            onClick={() => setLetraOpen((o) => !o)}
            transition="border-radius 0.2s"
          >
            <Text
              color={dosha.color}
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="600"
              letterSpacing="0.04em"
              fontFamily="'EB Garamond', serif"
            >
              Transcripción
            </Text>
            <Text
              color={dosha.color} fontSize="xl"
              transition="transform 0.25s"
              transform={letraOpen ? "rotate(180deg)" : "rotate(0deg)"}
            >
              ▾
            </Text>
          </Flex>
          <Collapse in={letraOpen} animateOpacity>
            <Box
              px={{ base: 6, md: 10 }}
              py={{ base: 5, md: 7 }}
              bg={BG}
              border={`1px solid ${dosha.color}44`}
              borderTop="none"
              borderRadius="0 0 2xl 2xl"
            >
              <Text
                color={dosha.color}
                fontSize={{ base: "md", md: "lg" }}
                lineHeight="2"
                letterSpacing="0.02em"
                whiteSpace="pre-wrap"
                fontFamily="'EB Garamond', serif"
              >
                {dosha.letra}
              </Text>
            </Box>
          </Collapse>
        </Box>
      </Box>
    </Box>
  );
}

/* ══════════════════════════════════════════
   PÁGINA PRINCIPAL
══════════════════════════════════════════ */
export default function AyurvedaRecursos() {
  const [elementosModalOpen, setElementosModalOpen] = useState(false);
  const [openDosha, setOpenDosha]   = useState<(typeof DOSHAS)[0] | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      <Flex
        direction="column"
        alignItems="center"
        flex="1"
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 10, md: 14 }}
        pb={{ base: 14, md: 20 }}
        gap={{ base: 6, md: 8 }}
      >
        <DisciplineHeader
          icon={<AyurvedaIcon size={{ base: "35px", md: "45px" }} />}
          title={ayurvedaNom}
          bgColor={BG}
          color={ACCENT} mb={{ base: 0, md: 0 }}
        />

        {/* ── Card: Cinco Elementos ── */}
        <Box
          w="100%"
          bg={BG}
          mt="20px"
          borderRadius="2xl"
          boxShadow={GLOW}
          border={`1px solid ${ACCENT}22`}
          px={{ base: 5, md: 10 }}
          py={{ base: 6, md: 8 }}
          position="relative"
        >
          {/* Título centrado */}
          <Flex align="center" justify="center" gap={3} mb={6}>
            <Box flexShrink={0}>
              <AyurvedaIcon size={{ base: "24px", md: "28px" }} />
            </Box>
            <Text
              color={ACCENT}
              fontSize={{ base: "xl", md: "2xl" }}
              fontWeight="700"
              fontFamily="'EB Garamond', serif"
            >
              Los Cinco Elementos
            </Text>
          </Flex>

          {/* Elementos en horizontal — móvil: 3+2 centrado, desktop: fila */}
          <Flex
            justify="center"
            gap={{ base: 3, md: 8 }}
            flexWrap={{ base: "wrap", md: "nowrap" }}
            maxW={{ base: "230px", md: "none" }}
            mx={{ base: "auto", md: "unset" }}
            mb={6}
          >
            {ELEMENTOS.map((el) => (
              <Flex key={el.nombre} direction="column" align="center" gap={2} w={{ base: "62px", md: "auto" }}>
                <Box
                  w={{ base: "62px", md: "76px" }}
                  h={{ base: "62px", md: "76px" }}
                  borderRadius="full"
                  border={`2px solid ${el.color}55`}
                  bg={el.color + "0e"}
                  boxShadow={`0 0 16px ${el.color}22`}
                  display="flex" alignItems="center" justifyContent="center"
                >
                  <el.Icon color={el.color} />
                </Box>
                <Text
                  color={el.color}
                  fontSize={{ base: "xs", md: "sm" }}
                  fontWeight="600"
                  fontFamily="'EB Garamond', serif"
                  letterSpacing="0.04em"
                >
                  {el.nombre}
                </Text>
              </Flex>
            ))}
          </Flex>

          {/* Botón "Ver video" → abre modal */}
          <Flex justify="flex-end" mt={2}>
            <Box
              as="button"
              onClick={() => setElementosModalOpen(true)}
              display="flex" alignItems="center" gap={2}
              px={4} py={2} borderRadius="full"
              border={`1px solid ${ACCENT}44`}
              bg="transparent"
              color={ACCENT} cursor="pointer"
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="600" letterSpacing="0.05em"
              transition="all 0.2s"
              _hover={{ bg: ACCENT + "14", borderColor: ACCENT + "88" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Ver video
            </Box>
          </Flex>
        </Box>

        {/* ── Cards: Los Doshas ── */}
        <Box w="100%">
          <Flex align="center" gap={3} mb={5}>
            <Box h="1px" flex="1" bg={`rgba(255,255,255,0.2)`} />
            <Text
              color="rgba(255,255,255,0.75)"
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="600"
              fontFamily="'EB Garamond', serif"
              letterSpacing="0.06em"
            >
              Los Doshas
            </Text>
            <Box h="1px" flex="1" bg={`rgba(255,255,255,0.2)`} />
          </Flex>

          <Grid
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
            gap={{ base: 4, md: 5 }}
          >
            {DOSHAS.map((dosha) => (
              <Box
                key={dosha.key}
                bg={BG}
                borderRadius="2xl"
                border={`1.5px solid ${dosha.color}40`}
                boxShadow={`0 4px 20px ${dosha.color}22`}
                px={{ base: 5, md: 6 }}
                py={{ base: 5, md: 6 }}
                cursor="pointer"
                transition="all 0.22s ease"
                onClick={() => setOpenDosha(dosha)}
              >
                {/* Dosha header */}
                <Flex align="center" gap={3} mb={4}>
                  <Box flexShrink={0}>{dosha.icon("28px")}</Box>
                  <Box>
                    <Text
                      color={dosha.color}
                      fontSize={{ base: "xl", md: "2xl" }}
                      fontWeight="700"
                      fontFamily="'EB Garamond', serif"
                      lineHeight="1"
                    >
                      {dosha.nombre}
                    </Text>
                    <Text
                      color={dosha.color} fontSize="xs"
                      opacity={0.65} mt={0.5}
                      letterSpacing="0.04em"
                    >
                      {dosha.subtitulo}
                    </Text>
                  </Box>
                </Flex>

                {/* Elementos */}
                <Flex gap={3} mb={4}>
                  {dosha.elementos.map((el) => (
                    <Flex key={el.nombre} align="center" gap={1.5}>
                      <Box
                        w="34px" h="34px" borderRadius="full"
                        border={`1.5px solid ${el.color}50`}
                        bg={el.color + "0e"}
                        display="flex" alignItems="center" justifyContent="center"
                        flexShrink={0}
                      >
                        <el.Icon color={el.color} />
                      </Box>
                      <Text
                        color={ACCENT} fontSize="xs"
                        fontFamily="'EB Garamond', serif"
                        fontWeight="500" opacity={0.75}
                      >
                        {el.nombre}
                      </Text>
                    </Flex>
                  ))}
                </Flex>

                {/* Descripción breve */}
                <Text
                  color={dosha.color}
                  fontSize={{ base: "sm", md: "sm" }}
                  lineHeight="1.75"
                  fontFamily="'EB Garamond', serif"
                  noOfLines={3}
                  opacity={0.85}
                >
                  {dosha.descripcion}
                </Text>

                {/* Botón "Ver vídeo" */}
                <Flex justify="flex-end" mt={3}>
                  <Box
                    display="flex" alignItems="center" gap={2}
                    px={4} py={2} borderRadius="full"
                    border={`1px solid ${dosha.color}44`}
                    bg="transparent"
                    color={dosha.color} cursor="pointer"
                    fontFamily="'EB Garamond', serif"
                    fontSize={{ base: "sm", md: "md" }}
                    fontWeight="600" letterSpacing="0.05em"
                    transition="all 0.2s"
                    _hover={{ bg: dosha.color + "14", borderColor: dosha.color + "88" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Ver vídeo
                  </Box>
                </Flex>
              </Box>
            ))}
          </Grid>
        </Box>
      </Flex>

      <SiteFooter />

      {/* Modal cinco elementos */}
      {elementosModalOpen && (
        <ElementosModal onClose={() => setElementosModalOpen(false)} />
      )}

      {/* Modal del dosha */}
      {openDosha && (
        <DoshaModal dosha={openDosha} onClose={() => setOpenDosha(null)} />
      )}
    </Box>
  );
}
