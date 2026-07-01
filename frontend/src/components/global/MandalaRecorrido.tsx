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
      { src: "/capturasRecorrido/astro/1.png", titulo: "1. Mini comic: Entiende tu carta astral" },
      { src: "/capturasRecorrido/astro/2.png", titulo: "2. Tu Sol, Luna y Ascendente" },
      { src: "/capturasRecorrido/astro/3.png", titulo: "3. Tus arquetipos: cada arquetipo de tu carta" },
      { src: "/capturasRecorrido/astro/4.png", titulo: "4. Lectura de tu carta astral" },
      { src: "/capturasRecorrido/astro/5.png", titulo: "5. Tus casas y su significado" },
      { src: "/capturasRecorrido/astro/6.png", titulo: "6. Las relaciones entre tus arquetipos" },
      { src: "/capturasRecorrido/astro/7.png", titulo: "Cursos orientativos de Astrología" },
      { src: "/capturasRecorrido/astro/biblio1.png", titulo: "Biblioteca de ilustraciones" },
      { src: "/capturasRecorrido/astro/biblio2.png", titulo: "Ejemplo" },
    ],
    link: "/espacio/questions/" + astrologiaNom,
    enabled: true,
    renderIcon: (size) => <AstrologiaIcon size={size} />,
  },
  {
    nom: neuropsicologiaNom,
    bg: neuropsicologiaBg,
    txt: neuropsicologiaTxt,
    desc: recorridoContenido.psicologia.desc,
    capturas: [
      { src: "/capturasRecorrido/psico/1.png",  titulo: "1. Tu punto de partida" },
      { src: "/capturasRecorrido/psico/2.png",  titulo: "2. Tus problemas actuales" },
      { src: "/capturasRecorrido/psico/3.png",  titulo: "3. Tu Línea de Vida" },
      { src: "/capturasRecorrido/psico/4.png",  titulo: "4. Huellas: qué te marcó" },
      { src: "/capturasRecorrido/psico/5.png",  titulo: "5. Nudos: patrones que se repiten" },
      { src: "/capturasRecorrido/psico/6.png",  titulo: "6. Tus necesidades" },
      { src: "/capturasRecorrido/psico/7.png",  titulo: "7. Tus heridas" },
      { src: "/capturasRecorrido/psico/8.png",  titulo: "8. Relación: integra heridas y arquetipos" },
      { src: "/capturasRecorrido/psico/9.png",  titulo: "9. Integración: tu mapa" },
      { src: "/capturasRecorrido/psico/10.png", titulo: "10. Tu compromiso" },
      { src: "/capturasRecorrido/psico/cursos.png", titulo: "Cursos orientativos de Psicología" },
    ],
    link: "/espacio/questions/" + neuropsicologiaNom,
    enabled: true,
    renderIcon: (size) => <NeuropsicologiaIcon size={{ base: size, md: size }} />,
  },
  {
    nom: ayurvedaNom,
    bg: ayurvedaBg,
    txt: ayurvedaTxt,
    desc: recorridoContenido.ayurveda.desc,
    capturas: [],
    link: "/espacio/questions/" + ayurvedaNomLink,
    enabled: false,
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
  disc, index, step, x, y, circleSize, iconSize, onSelect,
}: {
  disc: Disciplina;
  index: number;
  step: number;
  x: number;
  y: number;
  circleSize: string;
  iconSize: string;
  onSelect: () => void;
}) => {
  const [entered, setEntered] = useState(false);
  const hasBg = hasDisciplinaBg(disc.nom);

  return (
    <MotionBox
      position="absolute"
      cursor={disc.enabled ? "pointer" : "default"}
      onClick={disc.enabled ? onSelect : undefined}
      initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
      animate={{ scale: 1, opacity: 1, x, y }}
      transition={entered ? { duration: 0.15 } : { duration: 0.7, delay: index * 0.06 }}
      onAnimationComplete={() => { if (!entered) setEntered(true); }}
      whileHover={disc.enabled ? { scale: 1.18 } : {}}
      style={{ filter: disc.enabled ? undefined : "grayscale(0.55)" }}
    >
      <Box
        position="relative"
        w={circleSize}
        h={circleSize}
        borderRadius="full"
        overflow="hidden"
        bg={hasBg ? "transparent" : disc.bg}
        border={`3px solid ${disc.txt}`}
        opacity={disc.enabled ? 1 : 0.5}
        boxShadow={disc.enabled
          ? `0 0 20px ${disc.txt}bb, 0 2px 14px ${disc.txt}97`
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
const CapturasModal = ({ disc, onClose }: { disc: Disciplina; onClose: () => void }) => {
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
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
                filter: `drop-shadow(0 0 10px ${glowColor}) drop-shadow(0 14px 40px rgba(0,0,0,0.55))`,
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
