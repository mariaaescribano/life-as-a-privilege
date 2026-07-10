import { Box, Flex, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DisciplinaBgLayer, hasDisciplinaBg } from "./DisciplinaBgLayer";
import { recorridoContenido } from "../../data/recorridoContenido";
import {
  astrologiaBg, AstrologiaIcon, astrologiaNom, astrologiaTxt,
  ayurvedaBg, AyurvedaIcon, ayurvedaNom, ayurvedaNomLink, ayurvedaTxt,
  culturaBg, CulturaIcon, culturaNom, culturaNomLink, culturaTxt,
  cabalaBg, CabalaIcon, cabalaNom, cabalaTxt,
  fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt,
  neuropsicologiaBg, NeuropsicologiaIcon, neuropsicologiaNom, neuropsicologiaTxt,
  nutricionBg, NutricionIcon, nutricionNom, nutricionNomLink, nutricionTxt,
  tcmBg, TCMIcon, tcmNom, tcmNomLink, tcmTxt,
} from "../../GlobalVariables";

const MotionBox = motion(Box);

/** Una captura real de la plataforma + su mini texto descriptivo. */
type Captura = { src: string; titulo: string };

type Disciplina = {
  nom: string;
  bg: string;
  txt: string;
  desc: string;
  /** Capturas reales de la plataforma. Vacío = aún no disponible. */
  capturas: Captura[];
  /** Ruta a la que lleva el botón "Explorar disciplina". */
  link: string;
  /** Por ahora solo Astrología está abierta. */
  enabled: boolean;
  /** Vídeo 9:16 de recorrido de la disciplina (se recorta a 1:1 en pantalla).
   *  Sin vídeo = aún no disponible en el mandala-vídeo. */
  video?: string;
  renderIcon: (size: string) => React.ReactNode;
};

// Orden del Recorrido (igual que las cards de /elMetodo): cada disciplina lleva
// su número de paso. Solo Astrología está abierta de momento; el resto se ven
// dentro del mandala (para mostrar la estructura completa) pero aún no abren.
const disciplinas: Disciplina[] = [
  {
    nom: astrologiaNom,
    bg: astrologiaBg,
    txt: astrologiaTxt,
    desc: recorridoContenido.astrologia.desc,
    capturas: [
      { src: "/capturasRecorrido/astro/1.png",  titulo: "Tus datos para que te haga la lectura." },
      { src: "/capturasRecorrido/astro/2.png",  titulo: "Minicomic: entiende qué es una carta astral" },
      { src: "/capturasRecorrido/astro/3.png",  titulo: "Básico" },
      { src: "/capturasRecorrido/astro/4.png",  titulo: "La lectura de todas las partes de ti" },
      { src: "/capturasRecorrido/astro/5.png",  titulo: "Tus nudos, conflictos y dones" },
      { src: "/capturasRecorrido/astro/6.png",  titulo: "Ejemplo" },
      { src: "/capturasRecorrido/astro/7.png",  titulo: "Léelos todos" },
      { src: "/capturasRecorrido/astro/8.png",  titulo: "Las áreas de tu vida y cómo te mueves por ellas" },
      { src: "/capturasRecorrido/astro/9.png",  titulo: "Ejemplo" },
      { src: "/capturasRecorrido/astro/10.png", titulo: "¿Cómo te llevas contigo?" },
      { src: "/capturasRecorrido/astro/11.png", titulo: "Tus patrones y su para qué" },
      { src: "/capturasRecorrido/astro/13.png", titulo: "Ejemplo" },
      { src: "/capturasRecorrido/astro/14.png", titulo: "No te quedarán dudas de quién eres" },
      { src: "/capturasRecorrido/astro/15.png", titulo: "Llamada si lo deseas" },
      { src: "/capturasRecorrido/astro/16.png", titulo: "Cursos de acceso libre" },
      { src: "/capturasRecorrido/astro/18.png", titulo: "No te olvides de las Ilustraciones" },
      { src: "/capturasRecorrido/astro/19.png", titulo: "Ejemplo" },
      { src: "/capturasRecorrido/astro/20.png", titulo: "Ejemplo" },
      { src: "/capturasRecorrido/astro/21.png", titulo: "Ejemplo" },
    ],
    link: "/espacio/questions/" + astrologiaNom,
    enabled: true,
    video: "/videos/astrovideo.mp4",
    renderIcon: (size) => <AstrologiaIcon size={size} />,
  },
  {
    nom: neuropsicologiaNom,
    bg: neuropsicologiaBg,
    txt: neuropsicologiaTxt,
    desc: recorridoContenido.psicologia.desc,
    capturas: [
      { src: "/capturasRecorrido/psico/1.png",  titulo: "Bienvenido a la segunda disciplina." },
      { src: "/capturasRecorrido/psico/2.png",  titulo: "Introducción" },
      { src: "/capturasRecorrido/psico/3.png",  titulo: "Aviso" },
      { src: "/capturasRecorrido/psico/20.png", titulo: "En cualquier momento puedes agendar una llamada." },
      { src: "/capturasRecorrido/psico/4.png",  titulo: "Tus problemas" },
      { src: "/capturasRecorrido/psico/5.png",  titulo: "Tu edad para tu línea de Vida" },
      { src: "/capturasRecorrido/psico/6.png",  titulo: "Línea de Vida" },
      { src: "/capturasRecorrido/psico/7.png",  titulo: "Ejemplo de año" },
      { src: "/capturasRecorrido/psico/8.png",  titulo: "Rellena poco a poco" },
      { src: "/capturasRecorrido/psico/9.png",  titulo: "Rellena poco a poco" },
      { src: "/capturasRecorrido/psico/10.png", titulo: "¿Qué experiencia te marcó?" },
      { src: "/capturasRecorrido/psico/11.png", titulo: "Tus nudos" },
      { src: "/capturasRecorrido/psico/12.png", titulo: "Las necesidades en la infancia" },
      { src: "/capturasRecorrido/psico/13.png", titulo: "Ejemplo" },
      { src: "/capturasRecorrido/psico/14.png", titulo: "Tus heridas" },
      { src: "/capturasRecorrido/psico/15.png", titulo: "Relaciona heridas con tus arquetipos" },
      { src: "/capturasRecorrido/psico/16.png", titulo: "Ejemplo" },
      { src: "/capturasRecorrido/psico/17.png", titulo: "Intégralas en la persona que eres hoy" },
      { src: "/capturasRecorrido/psico/18.png", titulo: "Comprométete" },
      { src: "/capturasRecorrido/psico/19.png", titulo: "No te olvides de los cursos" },
    ],
    link: "/espacio/questions/" + neuropsicologiaNom,
    enabled: true,
    video: "/videos/psicovideo.mp4",
    renderIcon: (size) => <NeuropsicologiaIcon size={{ base: size, md: size }} />,
  },
  {
    nom: ayurvedaNom,
    bg: ayurvedaBg,
    txt: ayurvedaTxt,
    desc: recorridoContenido.ayurveda.desc,
    capturas: [
      { src: "/capturasRecorrido/hinduismo/1.png",  titulo: "Bienvenido a la tercera disciplina: Ayurveda" },
      { src: "/capturasRecorrido/hinduismo/2.png",  titulo: "Introducción" },
      { src: "/capturasRecorrido/hinduismo/3.png",  titulo: "Aviso" },
      { src: "/capturasRecorrido/hinduismo/4.png",  titulo: "El test" },
      { src: "/capturasRecorrido/hinduismo/5.png",  titulo: "El test" },
      { src: "/capturasRecorrido/hinduismo/6.png",  titulo: "Tu resultado" },
      { src: "/capturasRecorrido/hinduismo/7.png",  titulo: "Las energías" },
      { src: "/capturasRecorrido/hinduismo/8.png",  titulo: "" },
      { src: "/capturasRecorrido/hinduismo/9.png",  titulo: "" },
      { src: "/capturasRecorrido/hinduismo/10.png", titulo: "" },
      { src: "/capturasRecorrido/hinduismo/11.png", titulo: "" },
      { src: "/capturasRecorrido/hinduismo/12.png", titulo: "" },
      { src: "/capturasRecorrido/hinduismo/13.png", titulo: "Con test interactivos" },
      { src: "/capturasRecorrido/hinduismo/14.png", titulo: "" },
      { src: "/capturasRecorrido/hinduismo/17.png", titulo: "Actividad: crea tu día" },
      { src: "/capturasRecorrido/hinduismo/18.png", titulo: "¡Muy bien, creaste tu día!" },
      { src: "/capturasRecorrido/hinduismo/19.png", titulo: "Descárgalo en PDF" },
      { src: "/capturasRecorrido/hinduismo/20.png", titulo: "" },
      { src: "/capturasRecorrido/hinduismo/21.png", titulo: "Descarga en PDF tu recorrido" },
      { src: "/capturasRecorrido/hinduismo/23.png", titulo: "No te olvides de las ilustraciones" },
      { src: "/capturasRecorrido/hinduismo/24.png", titulo: "Ejemplo" },
      { src: "/capturasRecorrido/hinduismo/25.png", titulo: "Ejemplo" },
      { src: "/capturasRecorrido/hinduismo/26.png", titulo: "Ejemplo" },
    ],
    link: "/espacio/questions/" + ayurvedaNomLink,
    enabled: true,
    video: "/videos/hinduismovideo.mp4",
    renderIcon: (size) => <AyurvedaIcon size={{ base: size, md: size }} />,
  },
  {
    nom: tcmNom,
    bg: tcmBg,
    txt: tcmTxt,
    desc: recorridoContenido.tcm.desc,
    capturas: [],
    link: "/espacio/questions/" + tcmNomLink,
    enabled: false,
    renderIcon: (size) => <TCMIcon size={{ base: size, md: size }} />,
  },
  {
    nom: fisiologiaNom,
    bg: fisiologiaBg,
    txt: fisiologiaTxt,
    desc: recorridoContenido.fisiologia.desc,
    capturas: [],
    link: "/espacio/questions/" + fisiologiaNom,
    enabled: false,
    renderIcon: (size) => <FisiologiaIcon size={size} />,
  },
  {
    nom: nutricionNom,
    bg: nutricionBg,
    txt: nutricionTxt,
    desc: recorridoContenido.nutricion.desc,
    capturas: [],
    link: "/espacio/questions/" + nutricionNomLink,
    enabled: false,
    renderIcon: (size) => <NutricionIcon size={{ base: size, md: size }} />,
  },
  {
    nom: cabalaNom,
    bg: cabalaBg,
    txt: cabalaTxt,
    desc: recorridoContenido.cabala.desc,
    capturas: [],
    link: "/espacio/questions/" + cabalaNom,
    enabled: false,
    renderIcon: (size) => <CabalaIcon size={size} />,
  },
  {
    nom: culturaNom,
    bg: culturaBg,
    txt: culturaTxt,
    desc: recorridoContenido.cultura.desc,
    capturas: [],
    link: "/aprendizaje/cursos/" + culturaNomLink,
    enabled: false,
    renderIcon: (size) => <CulturaIcon size={{ base: size, md: size }} />,
  },
];

// ── Círculo del mandala ──────────────────────────────────────────────────────
const MandalaCircle = ({
  disc, index, step, x, y, circleSize, iconSize, onSelect, isSelected = false,
}: {
  disc: Disciplina;
  index: number;
  step: number;
  x: number;
  y: number;
  circleSize: string;
  iconSize: string;
  onSelect: () => void;
  isSelected?: boolean;
}) => {
  const [entered, setEntered] = useState(false);
  const hasBg = hasDisciplinaBg(disc.nom);

  return (
    <MotionBox
      position="absolute"
      cursor="pointer"
      onClick={onSelect}
      initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
      animate={{ scale: isSelected ? 1.14 : 1, opacity: 1, x, y }}
      transition={entered ? { duration: 0.25 } : { duration: 0.7, delay: index * 0.06 }}
      onAnimationComplete={() => { if (!entered) setEntered(true); }}
      whileHover={{ scale: isSelected ? 1.2 : 1.1 }}
      style={{ filter: isSelected ? undefined : "grayscale(0.6)", zIndex: isSelected ? 3 : undefined }}
    >
      <Box
        position="relative"
        w={circleSize}
        h={circleSize}
        borderRadius="full"
        overflow="hidden"
        bg={hasBg ? "transparent" : disc.bg}
        border={`3px solid ${disc.txt}`}
        opacity={isSelected ? 1 : 0.5}
        boxShadow={isSelected
          ? `0 0 22px ${disc.txt}, 0 0 44px ${disc.txt}aa, 0 2px 16px rgba(0,0,0,0.4)`
          : `0 0 10px ${disc.txt}55, 0 2px 10px rgba(0,0,0,0.3)`}
        display="flex"
        justifyContent="center"
        alignItems="center"
        transition="box-shadow 0.25s ease"
      >
        {hasBg && <DisciplinaBgLayer nom={disc.nom} borderRadius="full" />}
        <Box position="relative" zIndex={1} display="flex" alignItems="center" justifyContent="center">
          {disc.renderIcon(iconSize)}
        </Box>
      </Box>

      {/* Número de paso del recorrido */}
      <Box
        position="absolute"
        top="-6px"
        right="-6px"
        w={{ base: "20px", md: "24px" }}
        h={{ base: "20px", md: "24px" }}
        borderRadius="full"
        bg={disc.bg}
        border={`1.5px solid ${disc.txt}`}
        display="flex"
        alignItems="center"
        justifyContent="center"
        zIndex={2}
        boxShadow={`0 0 8px ${disc.txt}88`}
      >
        <Text color={disc.txt} fontWeight="700" fontSize={{ base: "10px", md: "12px" }} lineHeight="1">
          {step}
        </Text>
      </Box>
    </MotionBox>
  );
};

// ── Flecha de navegación flotante — bien visible sobre cualquier foto ────────
// Círculo oscuro semitransparente + chevron en el color de la disciplina, con
// glow suave, para que destaque tanto sobre fotos claras como oscuras.
const PanelArrow = ({
  side, color, onClick,
}: {
  side: "left" | "right";
  color: string;
  onClick: () => void;
}) => (
  <Box
    as="button"
    aria-label={side === "left" ? "Anterior" : "Siguiente"}
    onClick={(e: React.MouseEvent) => { e.stopPropagation(); onClick(); }}
    position="absolute"
    top="50%"
    left={side === "left" ? { base: "8px", md: "20px" } : "auto"}
    right={side === "right" ? { base: "8px", md: "20px" } : "auto"}
    transform="translateY(-50%)"
    zIndex={5}
    w={{ base: "46px", md: "58px" }}
    h={{ base: "46px", md: "58px" }}
    borderRadius="full"
    bg="rgba(0,0,0,0.5)"
    border={`1.5px solid ${color}aa`}
    color={color}
    display="flex"
    alignItems="center"
    justifyContent="center"
    cursor="pointer"
    boxShadow={`0 4px 18px rgba(0,0,0,0.5), 0 0 16px ${color}44`}
    sx={{ WebkitTapHighlightColor: "transparent", userSelect: "none", backdropFilter: "blur(4px)" }}
    _hover={{ bg: "rgba(0,0,0,0.68)", borderColor: color, boxShadow: `0 6px 22px rgba(0,0,0,0.6), 0 0 26px ${color}88` }}
    _active={{ transform: "translateY(-50%) scale(0.93)" }}
    transition="background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease"
  >
    <Box
      as="svg"
      viewBox="0 0 24 24"
      w={{ base: "24px", md: "28px" }}
      h={{ base: "24px", md: "28px" }}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {side === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </Box>
  </Box>
);

// ── Lightbox de capturas ──────────────────────────────────────────────────────
// Solo la FOTO, sin caja que la sostenga, para que el usuario se fije en ella.
// Sobre el fondo oscuro flotan: la X de cerrar, las flechas (bien visibles) y
// un pie discreto con el título de la captura + progreso. La imagen mantiene
// siempre `contain` (nunca se deforma) y cambia con una transición suave.
const CapturasModal = ({ disc, startIndex = 0, onClose }: { disc: Disciplina; startIndex?: number; onClose: () => void }) => {
  const [[page, direction], setPage] = useState<[number, number]>([startIndex, 0]);
  const total = disc.capturas.length;
  const accent = disc.txt;
  const base = disc.bg;
  // Color de la luz de la foto: normalmente el fondo de la disciplina, pero en
  // las de fondo oscuro (Astrología, Medicina China, Fisiología, Cábala y
  // Cultura) usamos su color de texto para que la luz se note.
  const glowDisciplinasOscuras = [astrologiaNom, tcmNom, fisiologiaNom, cabalaNom, culturaNom];
  const glowColor = glowDisciplinasOscuras.includes(disc.nom) ? accent : base;

  // `page` puede crecer/decrecer sin límite (para saber la dirección); el índice
  // real se obtiene con módulo, de modo que la navegación es circular.
  const idx = ((page % total) + total) % total;
  const captura = disc.capturas[idx];

  const paginate = (dir: number) => setPage(([p]) => [p + dir, dir]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setPage(([p]) => [p + 1, 1]);
      if (e.key === "ArrowLeft") setPage(([p]) => [p - 1, -1]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const darkShadow = "0 1px 3px rgba(0,0,0,0.9), 0 0 14px rgba(0,0,0,0.7)";

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir >= 0 ? 50 : -50 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir >= 0 ? -50 : 50 }),
  };

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={300}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="rgba(0,0,0,0.9)"
      sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
      onClick={onClose}
    >
      {/* X cerrar */}
      <Box
        position="absolute"
        top={{ base: 4, md: 6 }}
        right={{ base: 4, md: 6 }}
        as="button"
        onClick={(e: React.MouseEvent) => { e.stopPropagation(); onClose(); }}
        color={accent}
        fontSize="md"
        cursor="pointer"
        bg="rgba(0,0,0,0.5)"
        border={`1px solid ${accent}66`}
        borderRadius="full"
        w="40px"
        h="40px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxShadow={`0 2px 12px rgba(0,0,0,0.5)`}
        _hover={{ bg: "rgba(0,0,0,0.7)", borderColor: accent }}
        transition="all 0.2s"
        zIndex={6}
      >
        ✕
      </Box>

      {/* Flechas flotantes */}
      {total > 1 && <PanelArrow side="left" color={accent} onClick={() => paginate(-1)} />}
      {total > 1 && <PanelArrow side="right" color={accent} onClick={() => paginate(1)} />}

      {/* LA FOTO — protagonista absoluta, sin caja. contain para no deformar. */}
      <Box
        position="absolute"
        inset={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={{ base: "64px", md: "110px" }}
        py={{ base: "72px", md: "88px" }}
        overflow="hidden"
        onClick={onClose}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <MotionBox
            key={idx}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: "easeInOut" }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <Image
              src={captura.src}
              alt={`${disc.nom} — ${captura.titulo}`}
              maxW={{ base: "100%", md: "620px" }}
              maxH={{ base: "100%", md: "68vh" }}
              w="auto"
              h="auto"
              objectFit="contain"
              display="block"
              borderRadius="lg"
              sx={{
                filter: `drop-shadow(0 0 6px ${glowColor}66) drop-shadow(0 12px 34px rgba(0,0,0,0.5))`,
              }}
            />
          </MotionBox>
        </AnimatePresence>
      </Box>

      {/* PIE discreto — título de la captura + progreso, flotando sobre el fondo */}
      <Flex
        position="absolute"
        bottom={{ base: 4, md: 6 }}
        left={0}
        right={0}
        direction="column"
        align="center"
        gap={1}
        px={{ base: "72px", md: "120px" }}
        pointerEvents="none"
        zIndex={4}
      >
        <Text
          color="rgba(255,255,255,0.9)"
          fontFamily="'EB Garamond', serif"
          fontSize={{ base: "xs", md: "sm" }}
          fontStyle="italic"
          letterSpacing="0.04em"
          textAlign="center"
          lineHeight="1.4"
          noOfLines={2}
          style={{ textShadow: darkShadow }}
        >
          {captura.titulo}
        </Text>
        {total > 1 && (
          <Text
            color={accent}
            fontFamily="'EB Garamond', serif"
            fontSize={{ base: "2xs", md: "xs" }}
            fontWeight="600"
            letterSpacing="0.2em"
            opacity={0.7}
            style={{ textShadow: darkShadow }}
          >
            {idx + 1} / {total}
          </Text>
        )}
      </Flex>
    </Box>
  );
};

// ── Flecha pequeña para los carruseles en cuadrícula ─────────────────────────
const CardArrow = ({
  side, color, onClick,
}: {
  side: "left" | "right";
  color: string;
  onClick: () => void;
}) => (
  <Box
    as="button"
    aria-label={side === "left" ? "Anterior" : "Siguiente"}
    onClick={(e: React.MouseEvent) => { e.stopPropagation(); onClick(); }}
    position="absolute"
    top="50%"
    left={side === "left" ? { base: "8px", md: "10px" } : "auto"}
    right={side === "right" ? { base: "8px", md: "10px" } : "auto"}
    transform="translateY(-50%)"
    zIndex={3}
    w={{ base: "34px", md: "38px" }}
    h={{ base: "34px", md: "38px" }}
    borderRadius="full"
    bg="rgba(0,0,0,0.42)"
    border={`1px solid ${color}88`}
    color={color}
    display="flex"
    alignItems="center"
    justifyContent="center"
    cursor="pointer"
    boxShadow={`0 2px 10px rgba(0,0,0,0.4), 0 0 12px ${color}33`}
    sx={{ WebkitTapHighlightColor: "transparent", userSelect: "none", backdropFilter: "blur(3px)" }}
    _hover={{ bg: "rgba(0,0,0,0.62)", borderColor: color, boxShadow: `0 4px 14px rgba(0,0,0,0.5), 0 0 18px ${color}77` }}
    _active={{ transform: "translateY(-50%) scale(0.92)" }}
    transition="background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease"
  >
    <Box
      as="svg"
      viewBox="0 0 24 24"
      w={{ base: "18px", md: "20px" }}
      h={{ base: "18px", md: "20px" }}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {side === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </Box>
  </Box>
);

// ── Tarjeta-carrusel de una disciplina ───────────────────────────────────────
// Muestra las capturas reales de la disciplina en un carrusel embebido (sin
// popup): cabecera con nº + nombre, la captura con flechas, pie de foto y una
// barra de progreso. Al hacer clic en la foto se abre en grande (lightbox).
// Las disciplinas sin capturas se muestran como "Próximamente".
const CarruselCard = ({
  disc, step, onOpen,
}: {
  disc: Disciplina;
  step: number;
  onOpen: (startIndex: number) => void;
}) => {
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const hasBg = hasDisciplinaBg(disc.nom);
  const total = disc.capturas.length;
  const disponible = disc.enabled && total > 0;
  const accent = disc.txt;
  // Psicología e Hinduismo: las flechas y los números (nº de paso y contador)
  // usan el COLOR DE FONDO (bg) de la disciplina, no el de texto.
  const usaBgAcento = disc.nom === neuropsicologiaNom || disc.nom === ayurvedaNom;
  const acentoNum = usaBgAcento ? disc.bg : accent;

  const idx = total ? ((page % total) + total) % total : 0;
  const captura = disponible ? disc.capturas[idx] : null;
  const paginate = (dir: number) => setPage(([p]) => [p + dir, dir]);

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir >= 0 ? 30 : -30 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir >= 0 ? -30 : 30 }),
  };

  // ── Paleta de la disciplina ──
  // El fondo del box es la imagen propia de la disciplina; el texto va en su
  // color (txt). Sin bordes ni brillos: plano y limpio. La captura se muestra
  // encima, centrada, y el box nunca es más alto que la pantalla.
  const bg = disc.bg;
  // Halo del color de la disciplina alrededor del texto: solo para que se lea
  // sobre la imagen de fondo. No es brillo del box.
  const textGlow = `0 1px 3px ${bg}, 0 0 10px ${bg}, 0 0 20px ${bg}`;

  return (
    <Flex
      direction="column"
      position="relative"
      borderRadius="2xl"
      overflow="hidden"
      bg={bg}
    >
      {/* Fondo del box: la imagen propia de la disciplina (estrellas/acuarela) */}
      <DisciplinaBgLayer nom={disc.nom} borderRadius="2xl" />

      {/* Cabecera: nº + icono + nombre */}
      <Flex align="center" gap={3} px={{ base: 4, md: 5 }} py={{ base: 3, md: 4 }} position="relative" zIndex={1}>
        <Box
          position="relative"
          w={{ base: "40px", md: "46px" }}
          h={{ base: "40px", md: "46px" }}
          borderRadius="full"
          overflow="hidden"
          flexShrink={0}
          bg={hasBg ? "transparent" : disc.bg}
          border={`2px solid ${accent}`}
          display="flex"
          alignItems="center"
          justifyContent="center"
          opacity={disponible ? 1 : 0.6}
          style={{ filter: disponible ? undefined : "grayscale(0.5)" }}
        >
          {hasBg && <DisciplinaBgLayer nom={disc.nom} borderRadius="full" />}
          <Box position="relative" zIndex={1} display="flex" alignItems="center" justifyContent="center">
            {disc.renderIcon("28px")}
          </Box>
        </Box>
        <Flex align="baseline" gap={2} minW={0}>
          <Text
            color={accent}
            fontFamily="'EB Garamond', serif"
            fontWeight="700"
            fontSize={{ base: "lg", md: "xl" }}
            lineHeight="1.1"
            opacity={disponible ? 0.85 : 0.6}
            textShadow={textGlow}
          >
            {step}.
          </Text>
          <Text
            color={accent}
            fontFamily="'EB Garamond', serif"
            fontWeight="700"
            fontSize={{ base: "lg", md: "xl" }}
            lineHeight="1.35"
            letterSpacing="0.02em"
            pb="0.12em"
            whiteSpace="nowrap"
            opacity={disponible ? 1 : 0.65}
            textShadow={textGlow}
          >
            {disc.nom}
          </Text>
        </Flex>
      </Flex>

      {/* Marco de la captura — la imagen sobre el fondo de la disciplina, sin
          bordes ni brillo. Altura acotada al viewport para que el box entero
          quepa siempre en pantalla. */}
      <Box
        position="relative"
        zIndex={1}
        sx={{ height: "clamp(200px, 44vh, 430px)" }}
        mx={{ base: 2.5, md: 3 }}
        mt={{ base: 1, md: 1.5 }}
        overflow="hidden"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {disponible && captura ? (
          <>
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <MotionBox
                key={idx}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: "easeInOut" }}
                w="100%"
                h="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Image
                  src={captura.src}
                  alt={`${disc.nom} — ${captura.titulo}`}
                  w="100%"
                  h="100%"
                  objectFit="contain"
                  cursor="zoom-in"
                  onClick={() => onOpen(idx)}
                  sx={{ filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.32))" }}
                />
              </MotionBox>
            </AnimatePresence>

            {total > 1 && <CardArrow side="left" color={acentoNum} onClick={() => paginate(-1)} />}
            {total > 1 && <CardArrow side="right" color={acentoNum} onClick={() => paginate(1)} />}

            {/* Contador */}
            {total > 1 && (
              <Box
                position="absolute"
                top="10px"
                right="10px"
                px="10px"
                py="3px"
                borderRadius="full"
                bg="rgba(0,0,0,0.5)"
                zIndex={3}
                sx={{ backdropFilter: "blur(3px)" }}
              >
                <Text color={acentoNum} fontFamily="'EB Garamond', serif" fontWeight="600" fontSize="xs" letterSpacing="0.1em">
                  {idx + 1} / {total}
                </Text>
              </Box>
            )}
          </>
        ) : (
          // Placeholder "Próximamente"
          <Flex direction="column" align="center" justify="center" gap={4} px={5} textAlign="center">
            <Box
              position="relative"
              w={{ base: "64px", md: "76px" }}
              h={{ base: "64px", md: "76px" }}
              borderRadius="full"
              overflow="hidden"
              bg={hasBg ? "transparent" : disc.bg}
              border={`2px solid ${accent}`}
              display="flex"
              alignItems="center"
              justifyContent="center"
              opacity={0.5}
              style={{ filter: "grayscale(0.55)" }}
            >
              {hasBg && <DisciplinaBgLayer nom={disc.nom} borderRadius="full" />}
              <Box position="relative" zIndex={1} display="flex" alignItems="center" justifyContent="center">
                {disc.renderIcon("40px")}
              </Box>
            </Box>
            <Text
              color={accent}
              fontFamily="'EB Garamond', serif"
              fontStyle="italic"
              fontSize={{ base: "sm", md: "md" }}
              letterSpacing="0.14em"
              textTransform="uppercase"
              opacity={0.85}
              textShadow={textGlow}
            >
              Próximamente
            </Text>
          </Flex>
        )}
      </Box>

      {/* Pie de foto + barra de progreso */}
      {disponible && captura ? (
        <Flex direction="column" gap={2.5} px={{ base: 4, md: 5 }} pt={{ base: 3, md: 4 }} pb={{ base: 4, md: 5 }} position="relative" zIndex={1}>
          <Text
            color={accent}
            fontFamily="'EB Garamond', serif"
            fontSize={{ base: "sm", md: "md" }}
            fontStyle="italic"
            lineHeight="1.4"
            textAlign="center"
            minH={{ base: "2.6em", md: "2.8em" }}
            noOfLines={2}
            opacity={0.95}
            textShadow={textGlow}
          >
            {captura.titulo || " "}
          </Text>
          {total > 1 && (
            <Box position="relative" h="3px" w="100%" borderRadius="full" bg={`${accent}2b`} overflow="hidden">
              <Box
                position="absolute"
                left={0}
                top={0}
                h="100%"
                borderRadius="full"
                bg={accent}
                w={`${((idx + 1) / total) * 100}%`}
                transition="width 0.28s ease"
              />
            </Box>
          )}
        </Flex>
      ) : (
        <Box pb={{ base: 4, md: 5 }} pt={{ base: 3, md: 4 }} px={{ base: 4, md: 5 }} position="relative" zIndex={1}>
          <Text
            color={accent}
            fontFamily="'EB Garamond', serif"
            fontSize={{ base: "sm", md: "md" }}
            fontStyle="italic"
            textAlign="center"
            lineHeight="1.4"
            opacity={0.8}
            textShadow={textGlow}
          >
            {disc.desc}
          </Text>
        </Box>
      )}
    </Flex>
  );
};

// ── Cuadrícula de carruseles (2 columnas → 4 filas × 2) ──────────────────────
export const RecorridoCarruseles = () => {
  const [selected, setSelected] = useState<{ disc: Disciplina; start: number } | null>(null);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
        gap={{ base: 5, md: 7 }}
        w="100%"
      >
        {/* Por ahora solo se muestran las disciplinas que ya tienen capturas.
            Las demás quedan ocultas y aparecerán solas (con su nº de paso
            correcto) en cuanto se les suban capturas a `disc.capturas`. */}
        {disciplinas.map((disc, i) =>
          disc.capturas.length > 0 ? (
            <CarruselCard
              key={disc.nom}
              disc={disc}
              step={i + 1}
              onOpen={(start) => setSelected({ disc, start })}
            />
          ) : null,
        )}
      </Box>

      {selected && (
        <CapturasModal
          disc={selected.disc}
          startIndex={selected.start}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
};

// ── Box de vídeo de una disciplina ───────────────────────────────────────────
// Fondo = imagen propia de la disciplina. Cabecera "nº. Nombre" + separador
// horizontal y, debajo, el vídeo 9:16 recortado a 1:1 (sin tocar el original:
// object-fit cover recorta arriba/abajo en pantalla).
const VideoBox = ({ disc, step }: { disc: Disciplina; step: number }) => {
  const accent = disc.txt;
  const hasBg = hasDisciplinaBg(disc.nom);
  const textGlow = `0 1px 3px ${disc.bg}, 0 0 10px ${disc.bg}, 0 0 20px ${disc.bg}`;

  return (
    <Flex
      direction="column"
      position="relative"
      borderRadius="2xl"
      overflow="hidden"
      bg={disc.bg}
      boxShadow={`0 10px 34px rgba(0,0,0,0.32), 0 0 26px ${accent}44`}
    >
      {/* Fondo del box: imagen propia de la disciplina */}
      <DisciplinaBgLayer nom={disc.nom} borderRadius="2xl" />

      {/* Cabecera: nº + icono + nombre */}
      <Flex align="center" gap={3} px={{ base: 5, md: 6 }} pt={{ base: 4, md: 5 }} pb={{ base: 3, md: 3 }} position="relative" zIndex={1}>
        <Box
          position="relative"
          w={{ base: "40px", md: "46px" }}
          h={{ base: "40px", md: "46px" }}
          borderRadius="full"
          overflow="hidden"
          flexShrink={0}
          bg={hasBg ? "transparent" : disc.bg}
          border={`2px solid ${accent}`}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {hasBg && <DisciplinaBgLayer nom={disc.nom} borderRadius="full" />}
          <Box position="relative" zIndex={1} display="flex" alignItems="center" justifyContent="center">
            {disc.renderIcon("28px")}
          </Box>
        </Box>
        <Flex align="baseline" gap={2} minW={0}>
          <Text
            color={accent}
            fontFamily="'EB Garamond', serif"
            fontWeight="700"
            fontSize={{ base: "xl", md: "2xl" }}
            lineHeight="1.1"
            opacity={0.9}
            textShadow={textGlow}
          >
            {step}.
          </Text>
          <Text
            color={accent}
            fontFamily="'EB Garamond', serif"
            fontWeight="700"
            fontSize={{ base: "xl", md: "2xl" }}
            lineHeight="1.35"
            letterSpacing="0.02em"
            pb="0.12em"
            whiteSpace="nowrap"
            textShadow={textGlow}
          >
            {disc.nom}
          </Text>
        </Flex>
      </Flex>

      {/* Separador horizontal */}
      <Box
        mx={{ base: 5, md: 6 }}
        h="1px"
        position="relative"
        zIndex={1}
        bg={`linear-gradient(to right, transparent, ${accent}bb, transparent)`}
      />

      {/* Vídeo 9:16 recortado a cuadrado (1:1), o placeholder "En desarrollo"
          para las disciplinas que aún no están disponibles. */}
      <Box
        position="relative"
        zIndex={1}
        m={{ base: 4, md: 5 }}
        borderRadius="xl"
        overflow="hidden"
        sx={{ aspectRatio: "1 / 1" }}
        boxShadow="0 6px 22px rgba(0,0,0,0.35)"
      >
        {disc.video ? (
          <Box
            as="video"
            key={disc.video}
            src={disc.video}
            autoPlay
            muted
            loop
            playsInline
            w="100%"
            h="100%"
            sx={{ objectFit: "cover", objectPosition: "center" }}
          />
        ) : (
          <Flex
            w="100%"
            h="100%"
            direction="column"
            align="center"
            justify="center"
            gap={4}
            px={5}
            textAlign="center"
            bg="rgba(0,0,0,0.32)"
            sx={{ backdropFilter: "blur(2px)" }}
          >
            <Box
              as="svg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              w={{ base: "40px", md: "48px" }}
              h={{ base: "40px", md: "48px" }}
              fill={accent}
              opacity={0.9}
              style={{ filter: `drop-shadow(0 0 10px ${accent}88)` }}
            >
              <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/>
            </Box>
            <Text
              color={accent}
              fontFamily="'EB Garamond', serif"
              fontStyle="italic"
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="600"
              letterSpacing="0.16em"
              textTransform="uppercase"
              textShadow={textGlow}
            >
              En desarrollo
            </Text>
          </Flex>
        )}
      </Box>
    </Flex>
  );
};

// ── Mandala + vídeo en fila ───────────────────────────────────────────────────
// A la izquierda el mandala interactivo; a la derecha el box de la disciplina
// seleccionada con su vídeo. Al pulsar un círculo (solo las disciplinas
// disponibles), el box de la derecha se actualiza.
export const RecorridoMandalaVideo = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const firstEnabled = disciplinas.find((d) => d.enabled && d.video) ?? disciplinas[0];
  const [selectedNom, setSelectedNom] = useState(firstEnabled.nom);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const selectedIndex = disciplinas.findIndex((d) => d.nom === selectedNom);
  const selected = disciplinas[selectedIndex];

  const isXs = windowWidth < 380;
  const isSm = windowWidth < 480;
  const isMd = windowWidth < 768;
  const isLg = windowWidth < 1024;

  // Mandala algo más contenido que el de página completa, porque va en fila
  // junto al vídeo. (Tamaños reducidos ~10% para que respire mejor.)
  const size       = isXs ? 216 : isSm ? 257 : isMd ? 297 : isLg ? 360 : 414;
  const radius     = isXs ? 94 : isSm ? 115 : isMd ? 135 : isLg ? 151 : 171;
  const circleSize = isXs ? "52px" : isSm ? "59px" : isMd ? "68px" : "83px";
  const centerSize = isXs ? "101px" : isSm ? "112px" : isMd ? "130px" : "158px";
  // Alto ceñido al diámetro real del mandala (2·(radio + medio círculo) + badge),
  // para no dejar hueco muerto arriba/abajo, sobre todo en móvil.
  const containerH = isXs ? "270px" : isSm ? "320px" : isMd ? "375px" : "470px";
  const iconSize   = isXs ? "31px" : isSm ? "38px" : isMd ? "45px" : "47px";

  const angleStep = (2 * Math.PI) / disciplinas.length;

  return (
    <Flex
      direction={{ base: "column", lg: "row" }}
      align="center"
      justify="center"
      gap={{ base: 6, lg: 10 }}
      w="100%"
    >
      {/* ── Mandala (izquierda) ── */}
      <Box
        position="relative"
        w={{ base: "100%", lg: "auto" }}
        h={containerH}
        flexShrink={0}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box position="relative" w={`${size}px`} h={`${size}px`} display="flex" justifyContent="center" alignItems="center">
          {/* life.png de fondo del mandala */}
          <Box
            position="absolute"
            w="100%"
            h="100%"
            backgroundImage="url('/img/icono/life.png')"
            backgroundSize="90%"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            opacity={0.13}
            zIndex={0}
            pointerEvents="none"
          />

          {/* Centro */}
          <MotionBox
            position="absolute"
            w={centerSize}
            h={centerSize}
            borderRadius="full"
            overflow="hidden"
            boxShadow="0 8px 32px rgba(0,0,0,0.35), 0 0 28px rgba(107,196,200,0.55), 0 0 60px rgba(107,196,200,0.25)"
            border="4px solid rgba(255,255,255,0.75)"
            zIndex={1}
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="rgba(255,255,255,0.06)"
            sx={{ backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <Image
              src="/img/icono/life.png"
              alt=""
              w="70%"
              h="70%"
              objectFit="contain"
              style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.5))" }}
            />
          </MotionBox>

          {/* Círculos */}
          {disciplinas.map((disc, index) => {
            const angle = angleStep * index - Math.PI / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            return (
              <MandalaCircle
                key={disc.nom}
                disc={disc}
                index={index}
                step={index + 1}
                x={x}
                y={y}
                circleSize={circleSize}
                iconSize={iconSize}
                isSelected={disc.nom === selectedNom}
                onSelect={() => setSelectedNom(disc.nom)}
              />
            );
          })}
        </Box>
      </Box>

      {/* ── Box de vídeo (derecha) ── */}
      <Box w={{ base: "100%", lg: "auto" }} flex={{ lg: 1 }} maxW={{ base: "396px", lg: "450px" }}>
        <AnimatePresence mode="wait">
          <MotionBox
            key={selected.nom}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            w="100%"
          >
            <VideoBox disc={selected} step={selectedIndex + 1} />
          </MotionBox>
        </AnimatePresence>
      </Box>
    </Flex>
  );
};

// ── Mandala interactivo ──────────────────────────────────────────────────────
const MandalaRecorrido = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const [selected, setSelected] = useState<Disciplina | null>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  const isXs = windowWidth < 380;
  const isSm = windowWidth < 480;
  const isMd = windowWidth < 768;

  const size       = isXs ? 240 : isSm ? 285 : isMd ? 330 : 560;
  const radius     = isXs ? 104 : isSm ? 128 : isMd ? 150 : 208;
  const circleSize = isXs ? "60px" : isSm ? "68px" : isMd ? "78px" : "112px";
  const centerSize = isXs ? "116px" : isSm ? "128px" : isMd ? "148px" : "208px";
  const containerH = isXs ? "400px" : isSm ? "455px" : isMd ? "505px" : "600px";
  const iconSize   = isXs ? "36px" : isSm ? "44px" : isMd ? "52px" : "58px";

  const angleStep = (2 * Math.PI) / disciplinas.length;

  return (
    <>
      <Box
        position="relative"
        w="100%"
        h={containerH}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box position="relative" w={`${size}px`} h={`${size}px`} display="flex" justifyContent="center" alignItems="center">
          {/* life.png de fondo del mandala */}
          <Box
            position="absolute"
            w="100%"
            h="100%"
            backgroundImage="url('/img/icono/life.png')"
            backgroundSize="90%"
            backgroundPosition="center"
            backgroundRepeat="no-repeat"
            opacity={0.13}
            zIndex={0}
            pointerEvents="none"
          />

          {/* Centro */}
          <MotionBox
            position="absolute"
            w={centerSize}
            h={centerSize}
            borderRadius="full"
            overflow="hidden"
            boxShadow="0 8px 32px rgba(0,0,0,0.35), 0 0 28px rgba(107,196,200,0.55), 0 0 60px rgba(107,196,200,0.25)"
            border="4px solid rgba(255,255,255,0.75)"
            zIndex={10}
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="rgba(255,255,255,0.06)"
            sx={{ backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <Image
              src="/img/icono/life.png"
              alt=""
              w="70%"
              h="70%"
              objectFit="contain"
              style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,0.5))" }}
            />
          </MotionBox>

          {/* Círculos */}
          {disciplinas.map((disc, index) => {
            const angle = angleStep * index - Math.PI / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            return (
              <MandalaCircle
                key={disc.nom}
                disc={disc}
                index={index}
                step={index + 1}
                x={x}
                y={y}
                circleSize={circleSize}
                iconSize={iconSize}
                onSelect={() => setSelected(disc)}
              />
            );
          })}
        </Box>
      </Box>

      {selected && <CapturasModal disc={selected} onClose={() => setSelected(null)} />}
    </>
  );
};

export default MandalaRecorrido;
