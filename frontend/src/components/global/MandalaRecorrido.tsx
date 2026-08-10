import { Box, Flex, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DisciplinaBgLayer, hasDisciplinaBg } from "./DisciplinaBgLayer";
import { type DisciplinaClave } from "../../data/recorridoContenido";
import { useRecorridoContenido } from "../../data/useRecorridoContenido";
import { useIdioma, useT, type Texto } from "../../i18n";
import { useNombreDisciplinaEnMapa } from "../../i18n/nombreDisciplina";
import { useNavigate } from "react-router-dom";
import { DisciplinaVideoBox } from "../metodo/DisciplinaVideoBox";
import { presentacionPorKey } from "../../data/presentacionDisciplinas";
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

/**
 * Una captura real de la plataforma + su mini texto descriptivo.
 * El pie va bilingüe aquí mismo (y no en el diccionario) porque cada frase
 * describe UNA captura concreta: separarlos solo haría más fácil que se
 * desparejen. Se lee con `segunIdioma(...)`.
 */
type Captura = { src: string; titulo: Texto };

type Disciplina = {
  nom: string;
  /** Clave de su contenido: la frase y los puntos se piden AL PINTAR, para que
   *  cambien de idioma (ver `useRecorridoContenido`). */
  clave: DisciplinaClave;
  bg: string;
  txt: string;
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
    clave: "astrologia",
    bg: astrologiaBg,
    txt: astrologiaTxt,
    capturas: [
      { src: "/capturasRecorrido/astro/1.png",  titulo: { es: "Tus datos para que te haga la lectura.", en: "Your details, so I can do your reading." } },
      { src: "/capturasRecorrido/astro/2.png",  titulo: { es: "Minicomic: entiende qué es una carta astral", en: "Mini-comic: what a birth chart actually is" } },
      { src: "/capturasRecorrido/astro/3.png",  titulo: { es: "Básico", en: "The basics" } },
      { src: "/capturasRecorrido/astro/4.png",  titulo: { es: "La lectura de todas las partes de ti", en: "The reading of every part of you" } },
      { src: "/capturasRecorrido/astro/5.png",  titulo: { es: "Tus nudos, conflictos y dones", en: "Your knots, conflicts and gifts" } },
      { src: "/capturasRecorrido/astro/6.png",  titulo: { es: "Ejemplo", en: "Example" } },
      { src: "/capturasRecorrido/astro/7.png",  titulo: { es: "Léelos todos", en: "Read them all" } },
      { src: "/capturasRecorrido/astro/8.png",  titulo: { es: "Las áreas de tu Vida y cómo te mueves por ellas", en: "The areas of your Life, and how you move through them" } },
      { src: "/capturasRecorrido/astro/9.png",  titulo: { es: "Ejemplo", en: "Example" } },
      { src: "/capturasRecorrido/astro/10.png", titulo: { es: "¿Cómo te llevas contigo?", en: "How do you get along with yourself?" } },
      { src: "/capturasRecorrido/astro/11.png", titulo: { es: "Tus patrones y su para qué", en: "Your patterns, and what they're for" } },
      { src: "/capturasRecorrido/astro/13.png", titulo: { es: "Ejemplo", en: "Example" } },
      { src: "/capturasRecorrido/astro/14.png", titulo: { es: "No te quedarán dudas de quién eres", en: "You'll be left in no doubt about who you are" } },
      { src: "/capturasRecorrido/astro/15.png", titulo: { es: "Llamada si lo deseas", en: "A call, if you want one" } },
      { src: "/capturasRecorrido/astro/16.png", titulo: { es: "Cursos de acceso libre", en: "Freely available courses" } },
      { src: "/capturasRecorrido/astro/18.png", titulo: { es: "No te olvides de las Ilustraciones", en: "Don't forget the Illustrations" } },
      { src: "/capturasRecorrido/astro/19.png", titulo: { es: "Ejemplo", en: "Example" } },
      { src: "/capturasRecorrido/astro/20.png", titulo: { es: "Ejemplo", en: "Example" } },
      { src: "/capturasRecorrido/astro/21.png", titulo: { es: "Ejemplo", en: "Example" } },
    ],
    link: "/espacio/questions/" + astrologiaNom,
    enabled: true,
    video: "/videos/astrovideo.mp4",
    renderIcon: (size) => <AstrologiaIcon size={size} />,
  },
  {
    nom: neuropsicologiaNom,
    clave: "psicologia",
    bg: neuropsicologiaBg,
    txt: neuropsicologiaTxt,
    capturas: [
      { src: "/capturasRecorrido/psico/1.png",  titulo: { es: "Bienvenido a la segunda disciplina.", en: "Welcome to the second discipline." } },
      { src: "/capturasRecorrido/psico/2.png",  titulo: { es: "Introducción", en: "Introduction" } },
      { src: "/capturasRecorrido/psico/3.png",  titulo: { es: "Aviso", en: "A note" } },
      { src: "/capturasRecorrido/psico/20.png", titulo: { es: "En cualquier momento puedes agendar una llamada.", en: "You can book a call at any time." } },
      { src: "/capturasRecorrido/psico/4.png",  titulo: { es: "Tus problemas", en: "Your problems" } },
      { src: "/capturasRecorrido/psico/5.png",  titulo: { es: "Tu edad para tu línea de Vida", en: "Your age, for your Life line" } },
      { src: "/capturasRecorrido/psico/6.png",  titulo: { es: "Línea de Vida", en: "Life line" } },
      { src: "/capturasRecorrido/psico/7.png",  titulo: { es: "Ejemplo de año", en: "A sample year" } },
      { src: "/capturasRecorrido/psico/8.png",  titulo: { es: "Rellena poco a poco", en: "Fill it in little by little" } },
      { src: "/capturasRecorrido/psico/9.png",  titulo: { es: "Rellena poco a poco", en: "Fill it in little by little" } },
      { src: "/capturasRecorrido/psico/10.png", titulo: { es: "¿Qué experiencia te marcó?", en: "Which experience marked you?" } },
      { src: "/capturasRecorrido/psico/11.png", titulo: { es: "Tus nudos", en: "Your knots" } },
      { src: "/capturasRecorrido/psico/12.png", titulo: { es: "Las necesidades en la infancia", en: "Childhood needs" } },
      { src: "/capturasRecorrido/psico/13.png", titulo: { es: "Ejemplo", en: "Example" } },
      { src: "/capturasRecorrido/psico/14.png", titulo: { es: "Tus heridas", en: "Your wounds" } },
      { src: "/capturasRecorrido/psico/15.png", titulo: { es: "Relaciona heridas con tus arquetipos", en: "Link your wounds to your archetypes" } },
      { src: "/capturasRecorrido/psico/16.png", titulo: { es: "Ejemplo", en: "Example" } },
      { src: "/capturasRecorrido/psico/17.png", titulo: { es: "Intégralas en la persona que eres hoy", en: "Integrate them into the person you are today" } },
      { src: "/capturasRecorrido/psico/18.png", titulo: { es: "Comprométete", en: "Commit" } },
      { src: "/capturasRecorrido/psico/19.png", titulo: { es: "No te olvides de los cursos", en: "Don't forget the courses" } },
    ],
    link: "/espacio/questions/" + neuropsicologiaNom,
    enabled: true,
    video: "/videos/psicovideo.mp4",
    renderIcon: (size) => <NeuropsicologiaIcon size={{ base: size, md: size }} />,
  },
  {
    nom: ayurvedaNom,
    clave: "ayurveda",
    bg: ayurvedaBg,
    txt: ayurvedaTxt,
    capturas: [
      { src: "/capturasRecorrido/hinduismo/1.png",  titulo: { es: "Bienvenido a la tercera disciplina: Ayurveda", en: "Welcome to the third discipline: Ayurveda" } },
      { src: "/capturasRecorrido/hinduismo/2.png",  titulo: { es: "Introducción", en: "Introduction" } },
      { src: "/capturasRecorrido/hinduismo/3.png",  titulo: { es: "Aviso", en: "A note" } },
      { src: "/capturasRecorrido/hinduismo/4.png",  titulo: { es: "El test", en: "The test" } },
      { src: "/capturasRecorrido/hinduismo/5.png",  titulo: { es: "El test", en: "The test" } },
      { src: "/capturasRecorrido/hinduismo/6.png",  titulo: { es: "Tu resultado", en: "Your result" } },
      { src: "/capturasRecorrido/hinduismo/7.png",  titulo: { es: "Las energías", en: "The energies" } },
      { src: "/capturasRecorrido/hinduismo/8.png",  titulo: { es: "" } },
      { src: "/capturasRecorrido/hinduismo/9.png",  titulo: { es: "" } },
      { src: "/capturasRecorrido/hinduismo/10.png", titulo: { es: "" } },
      { src: "/capturasRecorrido/hinduismo/11.png", titulo: { es: "" } },
      { src: "/capturasRecorrido/hinduismo/12.png", titulo: { es: "" } },
      { src: "/capturasRecorrido/hinduismo/13.png", titulo: { es: "Con test interactivos", en: "With interactive tests" } },
      { src: "/capturasRecorrido/hinduismo/14.png", titulo: { es: "" } },
      { src: "/capturasRecorrido/hinduismo/17.png", titulo: { es: "Actividad: crea tu día", en: "Activity: build your day" } },
      { src: "/capturasRecorrido/hinduismo/18.png", titulo: { es: "¡Muy bien, creaste tu día!", en: "Nicely done — you built your day!" } },
      { src: "/capturasRecorrido/hinduismo/19.png", titulo: { es: "Descárgalo en PDF", en: "Download it as a PDF" } },
      { src: "/capturasRecorrido/hinduismo/20.png", titulo: { es: "" } },
      { src: "/capturasRecorrido/hinduismo/21.png", titulo: { es: "Descarga en PDF tu mapa", en: "Download your map as a PDF" } },
      { src: "/capturasRecorrido/hinduismo/23.png", titulo: { es: "No te olvides de las ilustraciones", en: "Don't forget the illustrations" } },
      { src: "/capturasRecorrido/hinduismo/24.png", titulo: { es: "Ejemplo", en: "Example" } },
      { src: "/capturasRecorrido/hinduismo/25.png", titulo: { es: "Ejemplo", en: "Example" } },
      { src: "/capturasRecorrido/hinduismo/26.png", titulo: { es: "Ejemplo", en: "Example" } },
    ],
    link: "/espacio/questions/" + ayurvedaNomLink,
    enabled: true,
    video: "/videos/hinduismovideo.mp4",
    renderIcon: (size) => <AyurvedaIcon size={{ base: size, md: size }} />,
  },
  {
    nom: tcmNom,
    clave: "tcm",
    bg: tcmBg,
    txt: tcmTxt,
    capturas: [],
    link: "/espacio/questions/" + tcmNomLink,
    enabled: false,
    video: "/videos/tcm.mp4",
    renderIcon: (size) => <TCMIcon size={{ base: size, md: size }} />,
  },
  {
    nom: fisiologiaNom,
    clave: "fisiologia",
    bg: fisiologiaBg,
    txt: fisiologiaTxt,
    capturas: [],
    link: "/espacio/questions/" + fisiologiaNom,
    enabled: false,
    video: "/videos/fisiologia.mp4",
    renderIcon: (size) => <FisiologiaIcon size={size} />,
  },
  {
    nom: nutricionNom,
    clave: "nutricion",
    bg: nutricionBg,
    txt: nutricionTxt,
    capturas: [],
    link: "/espacio/questions/" + nutricionNomLink,
    enabled: false,
    video: "/videos/nutricion.mp4",
    renderIcon: (size) => <NutricionIcon size={{ base: size, md: size }} />,
  },
  {
    nom: cabalaNom,
    clave: "cabala",
    bg: cabalaBg,
    txt: cabalaTxt,
    capturas: [],
    link: "/espacio/questions/" + cabalaNom,
    enabled: false,
    video: "/videos/cabala.mp4",
    renderIcon: (size) => <CabalaIcon size={size} />,
  },
  {
    nom: culturaNom,
    clave: "cultura",
    bg: culturaBg,
    txt: culturaTxt,
    capturas: [],
    link: "/aprendizaje/cursos/" + culturaNomLink,
    enabled: false,
    video: "/videos/cultura.mp4",
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
      // Los ocho salen del centro y se colocan UNO DETRÁS DE OTRO, girando el
      // círculo. Con 0.06s de hueco los ocho estaban puestos en medio segundo y
      // se leía como un bloque; con 0.18s se sigue el recorrido de uno en uno.
      // (Al terminar la entrada, `entered` deja los cambios de selección en
      // 0.25s, sin arrastrar este retraso a cada clic.)
      transition={entered ? { duration: 0.25 } : { duration: 0.65, delay: index * 0.18 }}
      onAnimationComplete={() => { if (!entered) setEntered(true); }}
      whileHover={{ scale: isSelected ? 1.2 : 1.1 }}
      style={{ filter: isSelected ? undefined : "grayscale(0.6)", zIndex: isSelected ? 3 : undefined }}
      // Los números y el círculo son un control, no texto: no seleccionables
      // (nunca se pintan de azul al arrastrar el ratón).
      sx={{ userSelect: "none", WebkitUserSelect: "none", WebkitTapHighlightColor: "transparent" }}
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
  const { segunIdioma } = useIdioma();
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
              alt={`${disc.nom} — ${segunIdioma(captura.titulo)}`}
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
          {segunIdioma(captura.titulo)}
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
  const t = useT();
  const { segunIdioma } = useIdioma();
  const nombreEnMapa = useNombreDisciplinaEnMapa();
  const contenido = useRecorridoContenido();
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
            {nombreEnMapa(disc.nom)}
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
                  alt={`${disc.nom} — ${segunIdioma(captura.titulo)}`}
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
              {t("comun.proximamente")}
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
            {segunIdioma(captura.titulo) || " "}
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
            {contenido[disc.clave].desc}
          </Text>
        </Box>
      )}
    </Flex>
  );
};

// ── Rejilla de los OCHO vídeos («El Mapa por dentro») ────────────────────────
// Dos filas de cuatro en ordenador, cuatro filas de dos en móvil, y los ocho
// moviéndose a la vez: es la única parte de la página de venta que no promete
// nada, solo enseña.
//
// Lo que se reproduce en la baldosa NO es el vídeo de muestra: es un clip corto
// y mudo (`/videos/muestra/<clave>.mp4`, ~200 KB) que genera
// `scripts/video/muestras.mjs`. Los ocho originales pesan 53 MB juntos y aquí
// habría que cargarlos TODOS: sería, con diferencia, la pantalla más cara de la
// web. Al pulsar una baldosa sí se abre el vídeo entero, en el popup de siempre.
//
// Tres cosas que no son adorno:
//   · van MUDOS. El autoplay sin permiso solo existe para vídeo sin sonido.
//   · el clip no se pide hasta que su baldosa asoma, y en cuanto se va de la
//     pantalla se pausa: ocho decodificadores abiertos calientan el móvil.
//   · quien pide menos movimiento o menos datos al sistema (`prefers-reduced-
//     motion`, `saveData`) ve el primer fotograma quieto y pulsa si quiere.

/** ¿Este navegador está pidiendo que le ahorremos movimiento o datos? */
const ahorroActivo = () => {
  if (typeof window === "undefined") return false;
  const menosMovimiento = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const conexion = (navigator as { connection?: { saveData?: boolean } }).connection;
  return !!menosMovimiento || !!conexion?.saveData;
};

const VideoMuestraCard = ({
  disc, step, index, onOpen,
}: {
  disc: Disciplina;
  step: number;
  index: number;
  onOpen: () => void;
}) => {
  const nombreEnMapa = useNombreDisciplinaEnMapa();
  const t = useT();
  const ref = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  // `pedir` = ya se puede bajar el clip (la baldosa ha asomado). Una vez true no
  // vuelve a false: el vídeo ya está en caché, quitarlo no ahorra nada.
  const [pedir, setPedir] = useState(false);
  const [ahorro] = useState(ahorroActivo);
  const clip = `/videos/muestra/${disc.clave}.mp4`;

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo) return;
    let temporizador = 0;

    const obs = new IntersectionObserver(
      ([e]) => {
        const video = videoRef.current;
        if (e.isIntersecting) {
          // Escalonado por posición: si los ocho piden su clip en el mismo
          // milisegundo, la primera fila tarda más en arrancar que si esperan
          // su turno.
          temporizador = window.setTimeout(() => setPedir(true), index * 180);
          if (!ahorro) void video?.play().catch(() => { /* el navegador manda */ });
        } else {
          window.clearTimeout(temporizador);
          video?.pause();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(nodo);
    return () => { window.clearTimeout(temporizador); obs.disconnect(); };
  }, [index, ahorro]);

  // Al llegar el src hay que pedir el play otra vez: cuando el observador lo
  // pidió, el <video> todavía no tenía nada que reproducir.
  useEffect(() => {
    if (!pedir || ahorro) return;
    void videoRef.current?.play().catch(() => { /* el navegador manda */ });
  }, [pedir, ahorro]);

  return (
    <Box
      ref={ref}
      role="group"
      onClick={onOpen}
      position="relative"
      w="100%"
      borderRadius="2xl"
      overflow="hidden"
      cursor="pointer"
      bg={disc.bg}
      sx={{ aspectRatio: "1 / 1" }}
      boxShadow={`0 6px 22px rgba(0,0,0,0.28), 0 0 18px ${disc.txt}33`}
      transition="transform 0.3s ease, box-shadow 0.3s ease"
      _hover={{ transform: "translateY(-4px)", boxShadow: `0 12px 30px rgba(0,0,0,0.34), 0 0 28px ${disc.txt}66` }}
    >
      {/* Debajo del vídeo, el fondo de la disciplina: es lo que se ve mientras
          el clip carga, en vez de un cuadro negro. */}
      <DisciplinaBgLayer nom={disc.nom} borderRadius="2xl" />

      <Box
        as="video"
        ref={videoRef as React.RefObject<HTMLVideoElement>}
        src={pedir ? clip : undefined}
        position="absolute"
        inset={0}
        w="100%"
        h="100%"
        objectFit="cover"
        // `muted` y `playsInline` son obligatorios para que el móvil deje
        // reproducir sin pedir permiso (y sin ponerse a pantalla completa).
        muted
        loop
        playsInline
        preload={ahorro ? "metadata" : "auto"}
      />

      {/* Velo de abajo: sin él, el rótulo se pierde en cuanto el vídeo tiene un
          fotograma claro. */}
      <Box
        position="absolute"
        inset={0}
        bgGradient="linear(to-t, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.22) 34%, transparent 62%)"
        pointerEvents="none"
      />

      {/* Rótulo: nº + nombre de la disciplina, abajo a la izquierda. */}
      <Flex
        position="absolute"
        bottom={{ base: 2.5, md: 3.5 }}
        left={{ base: 3, md: 4 }}
        right={{ base: 3, md: 4 }}
        align="baseline"
        gap={1.5}
        pointerEvents="none"
      >
        <Text color={disc.txt} fontWeight="700" fontSize={{ base: "xs", md: "sm" }} lineHeight="1.2" flexShrink={0}
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.85)" }}>
          {step}.
        </Text>
        <Text color="white" fontWeight="700" fontSize={{ base: "xs", md: "sm" }} lineHeight="1.2"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.85)" }}>
          {nombreEnMapa(disc.nom, true)}
        </Text>
      </Flex>

      {/* Que la baldosa se abre: un ▶ arriba a la derecha, discreto, que se
          enciende al pasar por encima. En móvil no hay hover, así que se queda
          siempre a media luz. */}
      <Flex
        position="absolute"
        top={{ base: 2.5, md: 3 }}
        right={{ base: 2.5, md: 3 }}
        align="center"
        gap={1.5}
        px={2}
        py={1}
        borderRadius="full"
        bg="rgba(0,0,0,0.45)"
        border={`1px solid ${disc.txt}88`}
        opacity={0.75}
        transition="opacity 0.25s ease"
        _groupHover={{ opacity: 1 }}
        pointerEvents="none"
      >
        <Box as="span" color={disc.txt} fontSize="10px" lineHeight="1">▶</Box>
        <Text color="white" fontSize="2xs" letterSpacing="0.06em" display={{ base: "none", md: "block" }}>
          {t("elMetodo.muestra")}
        </Text>
      </Flex>
    </Box>
  );
};

export const RecorridoVideosMuestra = () => {
  const [abierto, setAbierto] = useState<Disciplina | null>(null);

  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [abierto]);

  // Solo las que tienen vídeo. Ahora mismo son las ocho; si a alguna se le
  // quitara, la rejilla se recompone sola en vez de dejar un hueco negro.
  const conVideo = disciplinas
    .map((disc, i) => ({ disc, step: i + 1 }))
    .filter(({ disc }) => !!disc.video);

  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
        gap={{ base: 3, md: 5 }}
        w="100%"
      >
        {conVideo.map(({ disc, step }, i) => (
          <VideoMuestraCard
            key={disc.nom}
            disc={disc}
            step={step}
            index={i}
            onOpen={() => setAbierto(disc)}
          />
        ))}
      </Box>

      {abierto && <VideoMuestraModal disc={abierto} onClose={() => setAbierto(null)} />}
    </>
  );
};

// ── Cuadrícula de carruseles (2 columnas → 4 filas × 2) ──────────────────────
// Las capturas reales de cada disciplina, en carrusel. No se usa en ninguna
// página ahora mismo: en /elMetodo, «El Mapa por dentro» enseña los ocho vídeos
// (RecorridoVideosMuestra), que se ven de un golpe y sin tener que pasar fotos.
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

// ── Popup del vídeo de muestra ───────────────────────────────────────────────
// Mismo velo oscuro con blur que el modal de disciplina de arriba (/elMetodo),
// pero SIN caja contenedora: el propio vídeo lleva el borde y el brillo de la
// disciplina directamente. La caja es CUADRADA (1:1) en móvil y en ordenador,
// que es la proporción en la que se graban los vídeos del recorrido. La X flota
// sobre la esquina del vídeo.
const VideoMuestraModal = ({ disc, onClose }: { disc: Disciplina; onClose: () => void }) => {
  const accent = disc.txt;
  // ¿El vídeo es cuadrado? Se sabe al cargar sus metadatos. La caja SIEMPRE es
  // 1:1; lo que cambia es cómo se encaja el vídeo dentro:
  //   · cuadrado (los nuevos, 1080×1080) → `cover`: encaje exacto, no se recorta.
  //   · vertical (astro/psico/hinduismo, 1080×1920) → `contain`: se ve entero,
  //     con franjas a los lados. Con `cover` perderían el 44% de su alto —
  //     media pantalla de la app cortada por arriba y por abajo.
  // Mientras no se sepa, `contain`: más vale una franja que un recorte.
  const [cuadrado, setCuadrado] = useState<boolean | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Cada vídeo tiene su propia proporción: al cambiar de disciplina, a cero.
  useEffect(() => { setCuadrado(null); }, [disc.video]);

  return (
    <Box
      position="fixed"
      inset={0}
      zIndex={300}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="rgba(0,0,0,0.85)"
      sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
      onClick={onClose}
      px={{ base: 5, md: 10 }}
    >
      {/* El vídeo ES el elemento con el brillo (sin caja alrededor). La caja es
          CUADRADA (1:1), la proporción en la que se graban los vídeos del
          recorrido. Antes era 4:5, así que a un vídeo cuadrado le recortaba los
          lados. */}
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        position="relative"
        borderRadius="2xl"
        overflow="hidden"
        bg="#000"
        border={`1.5px solid ${accent}66`}
        boxShadow={`0 0 0 1px ${accent}55, 0 0 45px ${accent}66, 0 0 90px ${accent}33, 0 22px 70px rgba(0,0,0,0.6)`}
        w={{ base: "min(92vw, 420px)", md: "auto" }}
        h={{ base: "auto", md: "min(80vh, 600px)" }}
        maxH="88vh"
        sx={{ aspectRatio: "1 / 1" }}
      >
        {/* X cerrar — flota sobre la esquina del propio vídeo */}
        <Box
          position="absolute"
          top={3}
          right={3}
          as="button"
          onClick={onClose}
          color={accent}
          fontSize="md"
          cursor="pointer"
          bg="rgba(0,0,0,0.5)"
          border={`1px solid ${accent}66`}
          borderRadius="full"
          w="38px"
          h="38px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          _hover={{ bg: "rgba(0,0,0,0.7)", borderColor: accent }}
          transition="all 0.2s"
          zIndex={2}
          sx={{ backdropFilter: "blur(4px)" }}
        >
          ✕
        </Box>

        {disc.video && (
          <Box
            as="video"
            key={disc.video}
            src={disc.video}
            autoPlay
            // Los vídeos son mudos, pero llevan pista de audio en silencio y sin
            // `muted` Chrome/Safari bloquean el autoPlay (se abrían parados).
            muted
            controls
            playsInline
            w="100%"
            h="100%"
            onLoadedMetadata={(e: React.SyntheticEvent<HTMLVideoElement>) => {
              const v = e.currentTarget;
              if (!v.videoWidth || !v.videoHeight) return;
              // Margen del 2% para no descartar un 1080×1081 por un píxel.
              setCuadrado(Math.abs(v.videoWidth / v.videoHeight - 1) < 0.02);
            }}
            // Cuadrado → `cover` (encaje exacto en la caja 1:1, sin recorte).
            // Vertical → `contain`, para verlo entero en vez de perder el 44%.
            sx={{ objectFit: cuadrado ? "cover" : "contain" }}
          />
        )}
      </Box>
    </Box>
  );
};

// -- Box de al lado del mandala ------------------------------------------------
// El box vive en components/metodo/DisciplinaVideoBox.tsx porque lo comparte con
// la presentacion de cada disciplina (/d/:disciplina): es el box donde se decide
// la compra y tiene que verse igual en los dos sitios. Aqui solo se le pasan los
// datos de la disciplina seleccionada en el mandala.
const VideoBox = ({ disc, step, onVerVideo }: { disc: Disciplina; step: number; onVerVideo: () => void }) => {
  const contenido = useRecorridoContenido();
  const navigate = useNavigate();
  // Presentación pública de esta disciplina (/d/:disciplina). La búsqueda acepta
  // el nombre interno, así que «Hinduismo» encuentra su ficha igual.
  const presentacion = presentacionPorKey(disc.nom);
  return (
    <DisciplinaVideoBox
      nom={disc.nom}
      bg={disc.bg}
      txt={disc.txt}
      videoIntro={contenido[disc.clave].videoIntro}
      paso={step}
      renderIcon={disc.renderIcon}
      tieneVideo={!!disc.video}
      onVerVideo={onVerVideo}
      // Sin precio en el mandala: aquí el visitante todavía está descubriendo
      // qué es cada disciplina. En su hueco, el «Saber más» en grande.
      sinPrecio
      onSaberMas={presentacion ? () => navigate(`/d/${presentacion.key}`) : undefined}
    />
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
  // La que sale seleccionada al llegar. NO es la primera del orden (Astrología):
  // de entrada, la astrología echa para atrás a parte de quien llega, y es lo
  // primero que vería del Mapa. Psicología entra a todo el mundo, así que es la
  // que abre el mandala. El ORDEN y los números de paso no se tocan: Astrología
  // sigue siendo la 1, solo cambia por cuál se empieza a mirar.
  const inicial =
    disciplinas.find((d) => d.clave === "psicologia" && d.enabled && d.video) ??
    disciplinas.find((d) => d.enabled && d.video) ??
    disciplinas[0];
  const [selectedNom, setSelectedNom] = useState(inicial.nom);
  // Disciplina cuyo vídeo de muestra está abierto en el popup (null = cerrado).
  const [videoModal, setVideoModal] = useState<Disciplina | null>(null);

  useEffect(() => {
    document.body.style.overflow = videoModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [videoModal]);

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

      {/* ── Box de al lado del mandala (derecha) ── */}
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
            <VideoBox disc={selected} step={selectedIndex + 1} onVerVideo={() => setVideoModal(selected)} />
          </MotionBox>
        </AnimatePresence>
      </Box>

      {/* Popup del vídeo de muestra (mismo estilo que el modal de disciplina) */}
      {videoModal && <VideoMuestraModal disc={videoModal} onClose={() => setVideoModal(null)} />}
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
