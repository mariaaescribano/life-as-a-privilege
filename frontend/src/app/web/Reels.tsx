import React, { useState, useEffect, useRef, useCallback } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";

/* ─────────────────────────────────────────────
   DATOS — cambia embedUrl por tu URL de YouTube:
   https://www.youtube.com/embed/TU_VIDEO_ID
   o por la URL directa de tu archivo de vídeo.
───────────────────────────────────────────── */
type Reel = {
  titulo: string;
  subtitulo: string;
  tag: string;
  tagColor: string;
  embedUrl: string;
};

const reels: Reel[] = [
  {
    titulo: "El cuerpo habla",
    subtitulo: "Aprende a escuchar las señales que tu cuerpo te envía cada día",
    tag: "Fisiología",
    tagColor: "#6bc4c8",
    embedUrl: "", // ← pega aquí tu URL embed
  },
  {
    titulo: "Neuroplasticidad en acción",
    subtitulo: "Tu cerebro puede cambiar a cualquier edad: así es cómo",
    tag: "Neuropsicología",
    tagColor: "#9b8ec4",
    embedUrl: "",
  },
  {
    titulo: "El arte del equilibrio",
    subtitulo: "La Medicina Tradicional China y la armonía interior",
    tag: "TCM",
    tagColor: "#c4916b",
    embedUrl: "",
  },
  {
    titulo: "Nutrición consciente",
    subtitulo: "Comer para vivir, no vivir para comer: la ciencia detrás",
    tag: "Nutrición",
    tagColor: "#6bc48a",
    embedUrl: "",
  },
  {
    titulo: "Los astros y tu biología",
    subtitulo: "Cómo los ciclos cósmicos influyen en tu cuerpo y mente",
    tag: "Astrología",
    tagColor: "#c4c46b",
    embedUrl: "",
  },
];

/* ─── SVG chevrones ─── */
const ChevronLeft = () => (
  <svg width="22" height="22" viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
  >
    <polyline points="15,18 9,12 15,6" />
  </svg>
);

const ChevronRight = () => (
  <svg width="22" height="22" viewBox="0 0 24 24"
    fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
  >
    <polyline points="9,18 15,12 9,6" />
  </svg>
);

/* ─── Placeholder cuando no hay vídeo ─── */
const ReelPlaceholder = ({ reel }: { reel: Reel }) => (
  <Box
    w="100%" h="100%"
    display="flex" flexDirection="column"
    alignItems="center" justifyContent="center"
    bg={`linear-gradient(160deg, ${reel.tagColor}28 0%, rgba(0,0,0,0.82) 100%)`}
    px={8} textAlign="center" gap={5}
  >
    {/* Icono de play */}
    <Box
      w="80px" h="80px" borderRadius="full"
      border={`1.5px solid ${reel.tagColor}88`}
      bg="rgba(255,255,255,0.05)"
      display="flex" alignItems="center" justifyContent="center"
      boxShadow={`0 0 32px ${reel.tagColor}44`}
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <polygon points="8,5 21,12 8,19" fill="white" opacity="0.85" />
      </svg>
    </Box>

    {/* Tag */}
    <Box
      px={3} py={1} borderRadius="full"
      bg={reel.tagColor + "22"}
      border={`1px solid ${reel.tagColor}55`}
    >
      <Text color={reel.tagColor} fontSize="10px" fontWeight="700" letterSpacing="0.14em">
        {reel.tag.toUpperCase()}
      </Text>
    </Box>

    {/* Título y subtítulo */}
    <Box>
      <Text
        color="white" fontSize={{ base: "xl", md: "2xl" }}
        fontWeight="700" lineHeight="1.3" letterSpacing="0.02em" mb={3}
      >
        {reel.titulo}
      </Text>
      <Text color="rgba(255,255,255,0.52)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.7">
        {reel.subtitulo}
      </Text>
    </Box>

    <Text
      color="rgba(255,255,255,0.20)" fontSize="10px"
      letterSpacing="0.12em" fontStyle="italic" mt={2}
    >
      Próximamente
    </Text>
  </Box>
);

/* ─── Hook de reveal por IntersectionObserver ─── */
const useReveal = (threshold = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

/* ═══════════════════════════════════════════
   PÁGINA PRINCIPAL
═══════════════════════════════════════════ */
const ReelsPage = () => {
  const [current, setCurrent] = useState(0);
  const [contentVisible, setContentVisible] = useState(true);
  const pendingIdx = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const titleReveal  = useReveal();
  const viewerReveal = useReveal();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  /* Navegación con fade */
  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= reels.length || !contentVisible) return;
    setContentVisible(false);
    pendingIdx.current = index;
  }, [contentVisible]);

  useEffect(() => {
    if (!contentVisible && pendingIdx.current !== null) {
      const t = setTimeout(() => {
        setCurrent(pendingIdx.current!);
        pendingIdx.current = null;
        setContentVisible(true);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [contentVisible]);

  /* Teclado */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft")  goTo(current - 1);
      if (e.key === "ArrowRight") goTo(current + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current, goTo]);

  const reel = reels[current];
  const isFirst = current === 0;
  const isLast  = current === reels.length - 1;

  return (
    <Box
      minH="100vh" display="flex" flexDirection="column"
      bg="#008080" fontFamily="'EB Garamond', serif"
    >
      <SiteHeader variant="auto" />

      {/* ── TÍTULO ── */}
      <Box
        ref={titleReveal.ref}
        textAlign="center"
        pt={{ base: 10, md: 14 }}
        pb={{ base: 6, md: 8 }}
        px={{ base: 6, md: 10 }}
        opacity={titleReveal.visible ? 1 : 0}
        transform={titleReveal.visible ? "none" : "translateY(-18px)"}
        transition="opacity 0.75s ease, transform 0.75s ease"
      >
        <Text
          color="white"
          fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
          fontWeight="700"
          letterSpacing="0.04em"
          lineHeight="1.2"
          textShadow="0 2px 10px rgba(0,100,90,0.45)"
          mb={3}
        >
          Reels educativos y transformadores
        </Text>
        <Text
          color="rgba(255,255,255,0.55)"
          fontSize={{ base: "sm", md: "lg" }}
          letterSpacing="0.08em"
          fontStyle="italic"
        >
          Conocimiento que transforma · Un reel a la vez
        </Text>
      </Box>

      {/* ── VISOR ── */}
      <Flex
        ref={viewerReveal.ref}
        flex="1"
        direction="column"
        align="center"
        pb={{ base: 14, md: 20 }}
        opacity={viewerReveal.visible ? 1 : 0}
        transform={viewerReveal.visible ? "none" : "translateY(28px)"}
        transition="opacity 0.75s ease 0.2s, transform 0.75s ease 0.2s"
      >

        {/* Fila: flecha ← | vídeo | flecha → */}
        <Flex align="center" gap={{ base: 3, md: 7 }}>

          {/* ── Flecha izquierda ── */}
          <Box
            as="button"
            onClick={() => goTo(current - 1)}
            w={{ base: "40px", md: "50px" }}
            h={{ base: "40px", md: "50px" }}
            borderRadius="full"
            bg="rgba(255,255,255,0.10)"
            border="1.5px solid rgba(255,255,255,0.28)"
            display="flex" alignItems="center" justifyContent="center"
            color="white"
            cursor={isFirst ? "not-allowed" : "pointer"}
            opacity={isFirst ? 0.22 : 1}
            transition="all 0.22s ease"
            _hover={!isFirst ? {
              bg: "rgba(255,255,255,0.20)",
              borderColor: "rgba(255,255,255,0.6)",
              transform: "scale(1.1)",
            } : {}}
            sx={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
            flexShrink={0}
          >
            <ChevronLeft />
          </Box>

          {/* ── Contenedor del vídeo ── */}
          <Box
            /* Ancho fijo → el aspect-ratio calcula la altura */
            w={{ base: "260px", sm: "300px", md: "340px" }}
            sx={{ aspectRatio: "9 / 16" }}
            borderRadius="2xl"
            overflow="hidden"
            border="1px solid rgba(255,255,255,0.22)"
            boxShadow="0 16px 60px rgba(0,0,0,0.45), 0 4px 16px rgba(0,0,0,0.25)"
            position="relative"
            bg="rgba(0,0,0,0.55)"
            onTouchStart={(e: React.TouchEvent) => {
              touchStartX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e: React.TouchEvent) => {
              if (touchStartX.current === null) return;
              const delta = touchStartX.current - e.changedTouches[0].clientX;
              if (Math.abs(delta) > 45) goTo(delta > 0 ? current + 1 : current - 1);
              touchStartX.current = null;
            }}
          >
            {/* Contenido animado */}
            <Box
              w="100%" h="100%"
              opacity={contentVisible ? 1 : 0}
              transform={contentVisible ? "scale(1)" : "scale(0.97)"}
              transition="opacity 0.3s ease, transform 0.3s ease"
            >
              {reel.embedUrl ? (
                <iframe
                  key={current}
                  src={reel.embedUrl}
                  style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={reel.titulo}
                />
              ) : (
                <ReelPlaceholder reel={reel} />
              )}
            </Box>

            {/* Overlay inferior — solo si hay vídeo real */}
            {reel.embedUrl && (
              <Box
                position="absolute" bottom={0} left={0} right={0}
                pt={10} pb={4} px={5}
                bg="linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%)"
                pointerEvents="none"
              >
                <Box
                  display="inline-block" px={2} py="2px"
                  borderRadius="full" bg={reel.tagColor + "30"} mb={2}
                >
                  <Text color={reel.tagColor} fontSize="9px" fontWeight="700" letterSpacing="0.12em">
                    {reel.tag.toUpperCase()}
                  </Text>
                </Box>
                <Text color="white" fontSize="md" fontWeight="700" lineHeight="1.3">
                  {reel.titulo}
                </Text>
                <Text color="rgba(255,255,255,0.65)" fontSize="xs" lineHeight="1.55" mt={1}>
                  {reel.subtitulo}
                </Text>
              </Box>
            )}
          </Box>

          {/* ── Flecha derecha ── */}
          <Box
            as="button"
            onClick={() => goTo(current + 1)}
            w={{ base: "40px", md: "50px" }}
            h={{ base: "40px", md: "50px" }}
            borderRadius="full"
            bg="rgba(255,255,255,0.10)"
            border="1.5px solid rgba(255,255,255,0.28)"
            display="flex" alignItems="center" justifyContent="center"
            color="white"
            cursor={isLast ? "not-allowed" : "pointer"}
            opacity={isLast ? 0.22 : 1}
            transition="all 0.22s ease"
            _hover={!isLast ? {
              bg: "rgba(255,255,255,0.20)",
              borderColor: "rgba(255,255,255,0.6)",
              transform: "scale(1.1)",
            } : {}}
            sx={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
            flexShrink={0}
          >
            <ChevronRight />
          </Box>
        </Flex>

        {/* ── Contador + dots ── */}
        <Flex direction="column" align="center" mt={8} gap={3}>
          <Text
            color="rgba(255,255,255,0.38)"
            fontSize="xs" letterSpacing="0.16em" fontWeight="500"
          >
            {current + 1} / {reels.length}
          </Text>

          <Flex gap={2} align="center">
            {reels.map((_, i) => (
              <Box
                key={i}
                as="button"
                onClick={() => goTo(i)}
                h="7px"
                w={i === current ? "26px" : "7px"}
                borderRadius="full"
                bg={i === current ? "white" : "rgba(255,255,255,0.28)"}
                transition="all 0.35s ease"
                cursor="pointer"
                _hover={{ bg: i === current ? "white" : "rgba(255,255,255,0.55)" }}
              />
            ))}
          </Flex>
        </Flex>

        {/* Hint teclado — solo desktop */}
        <Text
          display={{ base: "none", md: "block" }}
          color="rgba(255,255,255,0.18)"
          fontSize="xs" letterSpacing="0.08em"
          fontStyle="italic" mt={5}
        >
          ← → para navegar con el teclado · desliza en móvil
        </Text>
      </Flex>

      {/* ── FOOTER ── */}
      <SiteFooter />
    </Box>
  );
};

export default ReelsPage;
