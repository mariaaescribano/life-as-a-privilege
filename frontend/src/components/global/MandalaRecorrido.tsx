import { Box, Flex, Image, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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

// ── Flecha (encima de la foto, en la barra superior del popup) ───────────────
const PanelArrow = ({
  side, color, onClick,
}: {
  side: "left" | "right";
  color: string;
  onClick: () => void;
}) => (
  <Box
    as="button"
    onClick={onClick}
    flexShrink={0}
    w={{ base: "38px", md: "44px" }}
    h={{ base: "38px", md: "44px" }}
    borderRadius="full"
    bg={`${color}1f`}
    border={`1px solid ${color}66`}
    color={color}
    display="flex"
    alignItems="center"
    justifyContent="center"
    fontSize={{ base: "xl", md: "2xl" }}
    lineHeight="1"
    cursor="pointer"
    boxShadow={`0 0 12px ${color}33`}
    sx={{ WebkitTapHighlightColor: "transparent", userSelect: "none" }}
    _hover={{ bg: `${color}33`, borderColor: color, boxShadow: `0 0 18px ${color}66` }}
    _active={{ transform: "scale(0.94)" }}
    transition="all 0.18s ease"
  >
    {side === "left" ? "‹" : "›"}
  </Box>
);

// ── Popup de capturas ─────────────────────────────────────────────────────────
// Diseño: barra superior con las flechas y el título de la captura, foto grande
// debajo y puntos indicadores. Se cierra con la X o pulsando fuera.
const CapturasModal = ({ disc, onClose }: { disc: Disciplina; onClose: () => void }) => {
  const [idx, setIdx] = useState(0);
  const total = disc.capturas.length;
  const hasBg = hasDisciplinaBg(disc.nom);

  const go = (dir: number) => setIdx((p) => (p + dir + total) % total);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx((p) => (p + 1) % total);
      if (e.key === "ArrowLeft") setIdx((p) => (p - 1 + total) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total, onClose]);

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
      px={{ base: 4, md: 10 }}
    >
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        bg={hasBg ? "transparent" : disc.bg + "f0"}
        border={`1.5px solid ${disc.txt}66`}
        sx={{ backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)" }}
        borderRadius="3xl"
        boxShadow={`0 0 0 1px ${disc.txt}55, 0 0 45px ${disc.txt}66, 0 0 90px ${disc.txt}33, 0 22px 70px rgba(0,0,0,0.6)`}
        maxW={{ base: "100%", md: "880px" }}
        w="100%"
        maxH="94vh"
        position="relative"
        overflow="hidden"
        display="flex"
        flexDirection="column"
      >
        {hasBg && <DisciplinaBgLayer nom={disc.nom} borderRadius="3xl" blur />}

        {/* X */}
        <Box
          position="absolute"
          top={5}
          right={5}
          as="button"
          onClick={onClose}
          color={disc.txt}
          fontSize="lg"
          cursor="pointer"
          bg={disc.txt + "22"}
          borderRadius="full"
          w="40px"
          h="40px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          _hover={{ bg: disc.txt + "44" }}
          transition="background 0.2s"
          zIndex={3}
        >
          ✕
        </Box>

        {/* Barra superior FIJA: flechas + título (siempre visible, nunca la
            tapa la foto). El pt deja hueco para la X de arriba a la derecha. */}
        <Flex
          flexShrink={0}
          align="center"
          gap={{ base: 3, md: 4 }}
          px={{ base: 5, md: 8 }}
          pt={{ base: "62px", md: "66px" }}
          pb={{ base: 3, md: 4 }}
          position="relative"
          zIndex={1}
        >
          {total > 1 && <PanelArrow side="left" color={disc.txt} onClick={() => go(-1)} />}
          <Flex direction="column" align="center" flex="1" minW={0}>
            <Text
              color={disc.txt}
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "sm", md: "md" }}
              fontStyle="italic"
              letterSpacing="0.05em"
              textAlign="center"
              lineHeight="1.3"
              textShadow={`0 1px 3px ${disc.bg}f5, 0 0 10px ${disc.bg}aa`}
            >
              {disc.capturas[idx].titulo}
            </Text>
          </Flex>
          {total > 1 && <PanelArrow side="right" color={disc.txt} onClick={() => go(1)} />}
        </Flex>

        {/* Foto — ocupa el espacio central que queda; se ajusta (contain) para
            no desbordar nunca sobre la barra de flechas ni los puntos. */}
        <Flex
          flex="1"
          minH={0}
          justify="center"
          align="center"
          px={{ base: 5, md: 8 }}
          position="relative"
          zIndex={1}
        >
          <Image
            key={disc.capturas[idx].src}
            src={disc.capturas[idx].src}
            alt={`${disc.nom} — ${disc.capturas[idx].titulo}`}
            maxW="100%"
            maxH={{ base: "calc(90vh - 190px)", md: "calc(94vh - 210px)" }}
            objectFit="contain"
            display="block"
            borderRadius="lg"
            sx={{ filter: "drop-shadow(0 14px 36px rgba(0,0,0,0.5))" }}
          />
        </Flex>

        {/* Puntos indicadores */}
        {total > 1 && (
          <Flex flexShrink={0} justify="center" gap={2} wrap="wrap" px={{ base: 5, md: 8 }} py={{ base: 4, md: 5 }} position="relative" zIndex={1}>
            {disc.capturas.map((_, i) => (
              <Box
                key={i}
                as="button"
                onClick={() => setIdx(i)}
                w={i === idx ? "22px" : "8px"}
                h="8px"
                borderRadius="full"
                bg={i === idx ? disc.txt : `${disc.txt}55`}
                cursor="pointer"
                transition="all 0.3s ease"
                boxShadow={i === idx ? `0 0 8px ${disc.txt}aa` : undefined}
              />
            ))}
          </Flex>
        )}
      </Box>
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
