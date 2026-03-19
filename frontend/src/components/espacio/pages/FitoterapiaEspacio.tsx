import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SiteHeader from "../../global/SiteHeader";
import {
  API_URL,
  fitoterapiaBg,
  FitoterapiaIcon,
  fitoterapiaNom,
  fitoterapiaTxt,
} from "../../../GlobalVariables";
import { plantas, type Planta } from "../../recursos/fitoterapia/PlantasData";
import { DisciplineHeader } from "../../global/DisciplineHeader";
import SiteFooter from "../../global/Footer";

const CARD_COLOR  = fitoterapiaTxt;
const MODAL_COLOR = fitoterapiaBg;

/* ═══════════════════════════════════════════
   SVG — ESQUINA BOTÁNICA
═══════════════════════════════════════════ */
const BotanicalCorner = ({ flip = false }: { flip?: boolean }) => (
  <Box
    position="absolute"
    top={flip ? "auto" : 0}
    bottom={flip ? 0 : "auto"}
    left={flip ? "auto" : 0}
    right={flip ? 0 : "auto"}
    transform={flip ? "rotate(180deg)" : "none"}
    opacity={0.17}
    pointerEvents="none"
    zIndex={0}
  >
    <svg width="170" height="170" viewBox="0 0 170 170" fill="none">
      <path d="M 10 160 C 22 124 55 88 90 58 C 118 34 142 18 162 8" stroke="#1e4a18" strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M 30 136 C 10 122 8 102 22 92 C 40 104 44 124 30 136 Z" fill="#1e4a18"/>
      <path d="M 58 108 C 72 92 74 72 60 62 C 44 72 42 92 58 108 Z" fill="#1e4a18"/>
      <path d="M 88 78 C 72 64 70 46 84 38 C 102 48 104 66 88 78 Z" fill="#1e4a18"/>
      <path d="M 118 50 C 130 36 134 18 120 10 C 104 18 100 36 118 50 Z" fill="#1e4a18"/>
      <circle cx="10" cy="158" r="5.5" fill="#1e4a18"/>
      <circle cx="162" cy="9"  r="4"   fill="#1e4a18"/>
    </svg>
  </Box>
);

/* ═══════════════════════════════════════════
   SVG — DIVIDER
═══════════════════════════════════════════ */
const BotanicalDivider = ({ color }: { color: string }) => (
  <Flex align="center" gap={3} my={6}>
    <Box flex="1" h="1px" bg={color} opacity={0.2} />
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M10 1 C5 6 5 14 10 19 C15 14 15 6 10 1 Z"  fill={color} opacity="0.45"/>
      <path d="M1 10 C6 5 14 5 19 10 C14 15 6 15 1 10 Z"  fill={color} opacity="0.3"/>
    </svg>
    <Box flex="1" h="1px" bg={color} opacity={0.2} />
  </Flex>
);

/* ═══════════════════════════════════════════
   YOUTUBE PLAYER
═══════════════════════════════════════════ */
const getEmbedUrl = (url: string): string => {
  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}?rel=0`;
  const long = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (long) return `https://www.youtube.com/embed/${long[1]}?rel=0`;
  return url;
};

const YoutubePlayer = ({ videoUrl, color }: { videoUrl?: string; color: string }) => {
  const embedUrl = videoUrl ? getEmbedUrl(videoUrl) : null;
  return (
    <Box
      mb={5}
      borderRadius="xl"
      overflow="hidden"
      border={`1px solid ${color}30`}
      bg={color + "0d"}
      h={{ base: "210px", md: "270px" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {embedUrl ? (
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: "none", display: "block" }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          title="Vídeo de la planta"
        />
      ) : (
        <Flex direction="column" align="center" justify="center" gap={4} w="100%" h="100%">
          <Box
            w="66px" h="66px" borderRadius="full"
            bg={color + "18"} border={`1.5px solid ${color}45`}
            display="flex" alignItems="center" justifyContent="center"
            boxShadow={`0 0 20px ${color}18`}
          >
            {/* Icono play con hojita superpuesta */}
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M10 7.5v13l11-6.5-11-6.5z" fill={color} opacity="0.65"/>
              <path d="M22 5 C18 7 17 12 19 16 C22 13 23 9 22 5 Z" fill={color} opacity="0.30"/>
            </svg>
          </Box>
          <Flex direction="column" align="center" gap={1}>
            <Text
              color={color}
              fontSize={{ base: "sm", md: "md" }}
              fontStyle="italic"
              letterSpacing="0.05em"
              opacity={0.65}
              fontFamily="'EB Garamond', serif"
            >
              Vídeo próximamente
            </Text>
            <Box w="32px" h="1px" bg={color} opacity={0.2} borderRadius="full" />
          </Flex>
        </Flex>
      )}
    </Box>
  );
};

/* ═══════════════════════════════════════════
   SVG — CORAZONES
═══════════════════════════════════════════ */
const HeartIconFilled = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

/* ═══════════════════════════════════════════
   SECCIÓN DEL MODAL
═══════════════════════════════════════════ */
const SeccionModal = ({
  titulo, color, textMid, children,
}: {
  titulo: string; color: string; textMid: string; children: React.ReactNode;
}) => (
  <Box mb={2}>
    <Flex align="center" gap={2} mb={3}>
      <Box w="3px" h="20px" borderRadius="full" bg={color} opacity={0.7} />
      <Text
        color={textMid}
        fontSize={{ base: "xs", md: "sm" }}
        fontWeight="700"
        letterSpacing="0.12em"
        textTransform="uppercase"
        fontFamily="'EB Garamond', serif"
      >
        {titulo}
      </Text>
    </Flex>
    {children}
  </Box>
);


/* ═══════════════════════════════════════════
   MODAL
═══════════════════════════════════════════ */
const PlantModal = ({
  planta,
  onClose,
  onRemove,
}: {
  planta: Planta;
  onClose: () => void;
  onRemove: () => void;
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const textDark     = "#1a3320";
  const textMid      = "#3d6b40";
  const accentBg     = MODAL_COLOR + "16";
  const accentBorder = MODAL_COLOR + "50";

  return (
    <Box
      position="fixed" inset={0} zIndex={1000}
      bg="rgba(0,32,10,0.65)"
      sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
      display="flex"
      alignItems={{ base: "flex-end", md: "center" }}
      justifyContent="center"
      px={{ base: 0, md: 6 }}
      py={{ base: 0, md: 6 }}
      onClick={onClose}
    >
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        position="relative"
        w={{ base: "100%", md: "640px" }}
        maxH={{ base: "92vh", md: "88vh" }}
        overflowY="auto"
        borderRadius={{ base: "24px 24px 0 0", md: "24px" }}
        bg="#f8f5ec"
        boxShadow="0 32px 80px rgba(0,0,0,0.50), 0 4px 16px rgba(0,0,0,0.18)"
        sx={{
          "&::-webkit-scrollbar": { width: "5px" },
          "&::-webkit-scrollbar-track": { bg: "transparent" },
          "&::-webkit-scrollbar-thumb": { bg: MODAL_COLOR + "55", borderRadius: "full" },
        }}
      >
        <BotanicalCorner />
        <BotanicalCorner flip />

        <Box position="relative" zIndex={2} px={{ base: 6, md: 10 }} pt={10} pb={10}>

          {/* Botón cerrar */}
          <Box
            as="button" position="absolute" top="14px" right="14px"
            w="34px" h="34px" borderRadius="full"
            bg="rgba(30,74,24,0.08)" border="1px solid rgba(30,74,24,0.18)"
            display="flex" alignItems="center" justifyContent="center"
            color={textMid} fontSize="16px" fontWeight="700"
            cursor="pointer" transition="all 0.18s"
            _hover={{ bg: "rgba(30,74,24,0.18)" }}
            onClick={onClose}
          >
            ✕
          </Box>

          {/* NOMBRE */}
          <Box textAlign="center" mb={6}>
            <Text
              color={textDark} fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="700" fontFamily="'EB Garamond', serif"
              letterSpacing="0.03em" lineHeight="1.1"
            >
              {planta.nombre}
            </Text>
            <Text
              color={textMid} fontSize={{ base: "sm", md: "md" }}
              fontStyle="italic" letterSpacing="0.06em" mt={1} opacity={0.8}
            >
              {planta.nombreCientifico}
            </Text>
          </Box>

          {/* VÍDEO */}
          <YoutubePlayer videoUrl={planta.videoUrl} color={MODAL_COLOR} />

          <BotanicalDivider color={MODAL_COLOR} />

          {/* USO */}
          <Text color={textDark} fontSize={{ base: "md", md: "lg" }} lineHeight="1.85" opacity={0.85}>
              {planta.uso}
            </Text>

          <BotanicalDivider color={MODAL_COLOR} />

          {/* BENEFICIOS */}
          <SeccionModal titulo="Beneficios" color={MODAL_COLOR} textMid={textMid}>
            <Flex direction="column" gap={2}>
              {planta.beneficios.map((b, i) => (
                <Flex key={i} gap={3} align="flex-start">
                  <Box
                    mt="9px" w={0} h={0} flexShrink={0}
                    borderTop="5px solid transparent"
                    borderBottom="5px solid transparent"
                    borderLeft={`9px solid ${MODAL_COLOR}`}
                    opacity={0.65}
                  />
                  <Text color={textDark} fontSize={{ base: "sm", md: "md" }} lineHeight="1.8" opacity={0.85}>
                    {b}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </SeccionModal>

          <BotanicalDivider color={MODAL_COLOR} />

          {/* FORMA DE USO */}
          <SeccionModal titulo="Forma de uso" color={MODAL_COLOR} textMid={textMid}>
            <Box bg={accentBg} border={`1px solid ${accentBorder}`} borderRadius="xl" px={5} py={4}>
              <Text color={textDark} fontSize={{ base: "sm", md: "md" }} lineHeight="1.9" opacity={0.88}>
                {planta.formaDeUso}
              </Text>
            </Box>
          </SeccionModal>

          {/* DATOS CURIOSOS */}
          {planta.datosCuriosos && planta.datosCuriosos.length > 0 && (
            <>
              <BotanicalDivider color={MODAL_COLOR} />
              <SeccionModal titulo="Datos curiosos" color={MODAL_COLOR} textMid={textMid}>
                <Flex direction="column" gap={3}>
                  {planta.datosCuriosos.map((d, i) => (
                    <Flex key={i} gap={3} align="flex-start">
                      <Box
                        flexShrink={0} mt="3px" w="22px" h="22px" borderRadius="full"
                        bg={MODAL_COLOR + "20"} border={`1px solid ${MODAL_COLOR}55`}
                        display="flex" alignItems="center" justifyContent="center" fontSize="10px"
                      >
                        <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                          <path d="M5 0 L6.18 3.82 L10 5 L6.18 6.18 L5 10 L3.82 6.18 L0 5 L3.82 3.82 Z" fill={MODAL_COLOR} opacity="0.8"/>
                        </svg>
                      </Box>
                      <Text color={textDark} fontSize={{ base: "sm", md: "md" }} lineHeight="1.8" opacity={0.85}>
                        {d}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              </SeccionModal>
            </>
          )}

          {/* PRECAUCIONES */}
          {planta.precauciones && planta.precauciones.length > 0 && (
            <>
              <BotanicalDivider color="#b05a2a" />
              <SeccionModal titulo="Precauciones" color="#b05a2a" textMid="#8a3e18">
                <Box
                  bg="rgba(176,90,42,0.08)" border="1px solid rgba(176,90,42,0.28)"
                  borderRadius="xl" px={5} py={4}
                >
                  <Flex direction="column" gap={2}>
                    {planta.precauciones.map((p, i) => (
                      <Flex key={i} gap={3} align="flex-start">
                        <Text flexShrink={0} mt="-1px" fontSize="14px" color="#b05a2a" lineHeight="1.8">⚠</Text>
                        <Text color={textDark} fontSize={{ base: "sm", md: "md" }} lineHeight="1.8" opacity={0.85}>
                          {p}
                        </Text>
                      </Flex>
                    ))}
                  </Flex>
                </Box>
              </SeccionModal>
            </>
          )}

          {/* BOTÓN ELIMINAR DE FAVORITAS */}
          <BotanicalDivider color={MODAL_COLOR} />
          <Flex justify="center">
            <Box
              as="button"
              onClick={onRemove}
              px={7} py={3}
              borderRadius="full"
              fontFamily="'EB Garamond', serif"
              fontSize={{ base: "md", md: "lg" }}
              fontWeight="600"
              letterSpacing="0.06em"
              border="1.5px solid rgba(176,90,42,0.45)"
              bg="rgba(176,90,42,0.08)"
              color="#8a3e18"
              cursor="pointer"
              transition="all 0.22s"
              _hover={{ bg: "rgba(176,90,42,0.18)", borderColor: "#b05a2a" }}
            >
              Eliminar de favoritas
            </Box>
          </Flex>

        </Box>
      </Box>
    </Box>
  );
};

/* ═══════════════════════════════════════════
   TARJETA DE PLANTA FAVORITA
═══════════════════════════════════════════ */
const PlantCard = ({
  planta,
  onOpen,
  onRemove,
}: {
  planta: Planta;
  onOpen: () => void;
  onRemove: () => void;
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <Flex
      align="center"
      gap={{ base: 3, md: 4 }}
      bg={fitoterapiaBg}
      border="1px solid rgba(255,255,255,0.30)"
      sx={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
      borderRadius="2xl"
      px={{ base: 4, md: 5 }}
      py={{ base: 4, md: 4 }}
      boxShadow="0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"
      cursor="pointer"
      onClick={onOpen}
      transition="all 0.22s ease"
      _hover={{ transform: "translateY(-12px)" }}
    >
      {/* Foto */}
      <Box
        w={{ base: "74px", md: "86px" }}
        h={{ base: "74px", md: "86px" }}
        borderRadius="xl" overflow="hidden" flexShrink={0}
        bg={CARD_COLOR + "28"} border={`2px solid ${CARD_COLOR}50`}
        display="flex" alignItems="center" justifyContent="center"
      >
        {!imgError ? (
          <Image
            src={planta.foto} alt={planta.nombre}
            w="100%" h="100%" objectFit="cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M18 3 C11 9 8 18 10 27 C16 29 26 24 30 16 C33 9 27 3 18 3 Z" fill={CARD_COLOR} opacity="0.7"/>
            <path d="M18 3 C18 15 16 23 10 27" stroke="white" strokeWidth="1.2" fill="none" opacity="0.5"/>
          </svg>
        )}
      </Box>

      {/* Nombres */}
      <Box flex="1" minW={0}>
        <Text
          color="white" fontWeight="700"
          fontSize={{ base: "lg", md: "xl" }}
          letterSpacing="0.02em" lineHeight="1.2"
        >
          {planta.nombre}
        </Text>
        <Text
          color="rgba(255,255,255,0.48)"
          fontSize="xs" fontStyle="italic"
          letterSpacing="0.04em" mt="4px"
        >
          {planta.nombreCientifico}
        </Text>
      </Box>

      {/* Corazón relleno — siempre favorita */}
      <Box
        as="button"
        w={{ base: "42px", md: "46px" }}
        h={{ base: "42px", md: "46px" }}
        borderRadius="full"
        bg={CARD_COLOR + "20"}
        border={`1.5px solid ${CARD_COLOR}60`}
        display="flex" alignItems="center" justifyContent="center"
        color={CARD_COLOR}
        flexShrink={0}
        transition="all 0.22s ease"
        _hover={{ transform: "scale(1.15)", opacity: 0.75 }}
        onClick={(e: React.MouseEvent) => { e.stopPropagation(); onRemove(); }}
        cursor="pointer"
      >
        <HeartIconFilled />
      </Box>
    </Flex>
  );
};

/* ═══════════════════════════════════════════
   HOOK REVEAL
═══════════════════════════════════════════ */
const useReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
};

/* ═══════════════════════════════════════════
   PÁGINA PRINCIPAL
═══════════════════════════════════════════ */
export default function FitoterapiaEspacio() {
  const navigate                    = useNavigate();
  const [selected, setSelected]     = useState<Planta | null>(null);
  const [favoritas, setFavoritas]   = useState<Planta[]>([]);
  const [loading, setLoading]       = useState(true);
  const gridReveal                  = useReveal();
  const userId                      = sessionStorage.getItem("userId");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  /* Cargar favoritas */
  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    axios
      .get(`${API_URL}/fitoterapia/${userId}`)
      .then((res) => {
        const ids: number[] = (res.data || []).map((f: { idPlanta: number }) => f.idPlanta);
        const plantasFav = plantas.filter((p) => ids.includes(p.id));
        setFavoritas(plantasFav);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  /* Eliminar de favoritas */
  const handleRemove = async (planta: Planta) => {
    if (!userId) return;
    try {
      await axios.delete(`${API_URL}/fitoterapia/${userId}/${planta.id}`);
      setFavoritas((prev) => prev.filter((p) => p.id !== planta.id));
      if (selected?.id === planta.id) setSelected(null);
    } catch (e) {
      console.error("Error al eliminar favorita", e);
    }
  };

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
      >
        <DisciplineHeader
          icon={<FitoterapiaIcon size={{ base: "35px", md: "45px" }} />}
          title={fitoterapiaNom}
          bgColor={fitoterapiaBg}
          color={fitoterapiaTxt}
        />

        {/* Subtítulo */}
        {/* <Text
          color={fitoterapiaTxt}
          fontSize={{ base: "lg", md: "xl" }}
          fontStyle="italic"
          letterSpacing="0.04em"
          opacity={0.7}
          mt={2}
          mb={10}
          textAlign="center"
        >
          Tus plantas favoritas
        </Text> */}

        {/* Contenido */}
        <Box ref={gridReveal.ref} w="100%" maxW="900px">

          {/* Sin sesión */}
          {!userId && (
            <Flex justify="center" py={16}>
              <Text color="rgba(255,255,255,0.45)" fontStyle="italic" fontSize="lg" textAlign="center">
                Inicia sesión para ver tus plantas favoritas.
              </Text>
            </Flex>
          )}

          {/* Cargando */}
          {userId && loading && (
            <Flex justify="center" py={16}>
              <Text color="rgba(255,255,255,0.45)" fontStyle="italic" fontSize="lg">
                Cargando tus favoritas...
              </Text>
            </Flex>
          )}

          {/* Sin favoritas */}
          {userId && !loading && favoritas.length === 0 && (
            <Flex direction="column" align="center" gap={6} py={20}>
              <Text
                color="rgba(255,255,255,0.40)"
                fontStyle="italic"
                fontSize={{ base: "lg", md: "xl" }}
                textAlign="center"
                letterSpacing="0.03em"
              >
                Aún no tienes plantas favoritas.
              </Text>
              <Box
                as="button"
                onClick={() => navigate(`/aprendizaje/cursosModalidad/${fitoterapiaNom}`)}
                display="flex"
                flexDirection="row"
                alignItems="center"
                gap={4}
                bg={fitoterapiaBg}
                border={`1.5px solid ${fitoterapiaTxt}35`}
                borderRadius="2xl"
                px={{ base: 8, md: 12 }}
                py={{ base: 7, md: 9 }}
                cursor="pointer"
                transition="all 0.25s ease"
                boxShadow={ "0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"}
                _hover={{
                  transform: "translateY(-4px)",
                  borderColor: `${fitoterapiaTxt}70`,
                }}
              >
                <Box color={fitoterapiaTxt} opacity={0.85} >
                  <FitoterapiaIcon size={{ base: "48px", md: "58px" }} />
                </Box>
                <Text
                  color={fitoterapiaTxt}
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight="500"
                  letterSpacing="0.06em"
                  textAlign="center"
                  lineHeight="1.5"
                >
                  Explorar el herbario
                </Text>
              </Box>
            </Flex>
          )}

          {/* Grid de favoritas */}
          {userId && !loading && favoritas.length > 0 && (
            <Grid
              templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }}
              gap={{ base: 5, md: 6 }}
            >
              {favoritas.map((p, i) => (
                <Box
                  key={p.id}
                  opacity={gridReveal.visible ? 1 : 0}
                  transform={gridReveal.visible ? "none" : "translateY(24px)"}
                  transition={`opacity 0.55s ease ${i * 0.07}s, transform 0.55s ease ${i * 0.07}s`}
                >
                  <PlantCard
                    planta={p}
                    onOpen={() => setSelected(p)}
                    onRemove={() => handleRemove(p)}
                  />
                </Box>
              ))}
            </Grid>
          )}

        </Box>
      </Flex>

      {/* FOOTER */}
      <SiteFooter />

      {/* MODAL */}
      {selected && (
        <PlantModal
          planta={selected}
          onClose={() => setSelected(null)}
          onRemove={() => handleRemove(selected)}
        />
      )}
    </Box>
  );
}
