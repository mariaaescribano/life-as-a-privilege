import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Collapse, Flex, Grid, HStack, Image, Input, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../global/SiteHeader";
import { SaberMasButton } from "../../global/SaberMasButton";
import {
  API_URL,
  fitoterapiaBg,
  FitoterapiaIcon,
  FitoterapiaIconOscuro,
  fitoterapiaNom,
  fitoterapiaTxt,
} from "../../../GlobalVariables";
import { plantas, type Planta } from "./PlantasData";
import { DisciplineHeader } from "../../global/DisciplineHeader";
import SiteFooter from "../../global/Footer";
import { ContactModal } from "../../global/ContactModal";

const CARD_COLOR  = fitoterapiaTxt;  // #d5ffd5
const MODAL_COLOR = fitoterapiaBg;   // #0e590d

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
    opacity={0.18}
    pointerEvents="none"
    zIndex={0}
  >
    <svg width="170" height="170" viewBox="0 0 170 170" fill="none">
      <path d="M 10 160 C 22 124 55 88 90 58 C 118 34 142 18 162 8" stroke={fitoterapiaBg} strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M 30 136 C 10 122 8 102 22 92 C 40 104 44 124 30 136 Z" fill={fitoterapiaBg}/>
      <path d="M 30 136 C 24 116 18 98 22 92" stroke={fitoterapiaBg} strokeWidth="0.9" fill="none"/>
      <path d="M 58 108 C 72 92 74 72 60 62 C 44 72 42 92 58 108 Z" fill={fitoterapiaBg}/>
      <path d="M 58 108 C 56 90 54 74 60 62" stroke={fitoterapiaBg} strokeWidth="0.9" fill="none"/>
      <path d="M 88 78 C 72 64 70 46 84 38 C 102 48 104 66 88 78 Z" fill={fitoterapiaBg}/>
      <path d="M 88 78 C 82 62 80 48 84 38" stroke={fitoterapiaBg} strokeWidth="0.9" fill="none"/>
      <path d="M 118 50 C 130 36 134 18 120 10 C 104 18 100 36 118 50 Z" fill={fitoterapiaBg}/>
      <path d="M 118 50 C 116 34 114 20 120 10" stroke={fitoterapiaBg} strokeWidth="0.9" fill="none"/>
      <circle cx="10" cy="158" r="5.5" fill={fitoterapiaBg}/>
      <circle cx="5"  cy="148" r="4"   fill={fitoterapiaBg}/>
      <circle cx="18" cy="149" r="4"   fill={fitoterapiaBg}/>
      <circle cx="6"  cy="138" r="2.5" fill={fitoterapiaBg} opacity="0.7"/>
      <circle cx="162" cy="9"  r="4"   fill={fitoterapiaBg}/>
      <circle cx="158" cy="4"  r="2.8" fill={fitoterapiaBg} opacity="0.8"/>
      <circle cx="167" cy="5"  r="2.5" fill={fitoterapiaBg} opacity="0.7"/>
    </svg>
  </Box>
);

/* ═══════════════════════════════════════════
   SVG — ABEJITA DECORATIVA
═══════════════════════════════════════════ */
const BeeDecoration = ({
  size = 52, opacity = 0.13, style = {},
}: {
  size?: number; opacity?: number; style?: React.CSSProperties;
}) => (
  <Box position="absolute" pointerEvents="none" zIndex={0} style={{ opacity, ...style }}>
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      {/* Alas */}
      <ellipse cx="16" cy="19" rx="11" ry="6" fill={fitoterapiaBg} opacity={0.55}
        transform="rotate(-30 16 19)"/>
      <ellipse cx="36" cy="19" rx="11" ry="6" fill={fitoterapiaBg} opacity={0.55}
        transform="rotate(30 36 19)"/>
      {/* Cuerpo */}
      <ellipse cx="26" cy="32" rx="9" ry="12" fill={fitoterapiaBg}/>
      {/* Rayas */}
      <rect x="17.5" y="28" width="17" height="3.5" rx="1.75" fill="white" opacity={0.45}/>
      <rect x="17.5" y="34" width="17" height="3.5" rx="1.75" fill="white" opacity={0.38}/>
      {/* Cabeza */}
      <circle cx="26" cy="19" r="6" fill={fitoterapiaBg}/>
      {/* Ojos */}
      <circle cx="23.5" cy="18.5" r="1.2" fill="white" opacity={0.7}/>
      <circle cx="28.5" cy="18.5" r="1.2" fill="white" opacity={0.7}/>
      {/* Antenas */}
      <path d="M23 14 C21 10 17 8 16 5" stroke={fitoterapiaBg} strokeWidth="1.6"
        strokeLinecap="round"/>
      <circle cx="15.5" cy="4.5" r="2.2" fill={fitoterapiaBg}/>
      <path d="M29 14 C31 10 35 8 36 5" stroke={fitoterapiaBg} strokeWidth="1.6"
        strokeLinecap="round"/>
      <circle cx="36.5" cy="4.5" r="2.2" fill={fitoterapiaBg}/>
      {/* Aguijón */}
      <path d="M26 44 L24 49 L26 47 L28 49 Z" fill={fitoterapiaBg}/>
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
   YOUTUBE EMBED
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
      mb={5} borderRadius="xl" overflow="hidden"
      border={`1px solid ${color}30`} bg={color + "0d"}
      h={{ base: "210px", md: "270px" }}
      display="flex" alignItems="center" justifyContent="center"
    >
      {embedUrl ? (
        <iframe
          src={embedUrl} width="100%" height="100%"
          style={{ border: "none", display: "block" }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen title="Vídeo de la planta"
        />
      ) : (
        <Flex direction="column" align="center" justify="center" gap={4} w="100%" h="100%">
          <Box
            w="66px" h="66px" borderRadius="full"
            bg={color + "18"} border={`1.5px solid ${color}35`}
            display="flex" alignItems="center" justifyContent="center"
            position="relative"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M10 7.5v13l11-6.5-11-6.5z" fill={color} opacity="0.65"/>
              <path d="M22 5 C18 7 17 12 19 16 C22 13 23 9 22 5 Z" fill={color} opacity="0.30"/>
            </svg>
          </Box>
          <Text color={color} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" opacity={0.65} letterSpacing="0.04em">
            Vídeo próximamente
          </Text>
        </Flex>
      )}
    </Box>
  );
};

/* ═══════════════════════════════════════════
   SVG — CORAZONES
═══════════════════════════════════════════ */
const HeartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);

const HeartIconFilled = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
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
const PlantModal = ({ planta, onClose }: { planta: Planta; onClose: () => void }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const textDark     = fitoterapiaBg;
  const textMid      = "#2d7a2b";
  const accentBg     = MODAL_COLOR + "12";
  const accentBorder = MODAL_COLOR + "40";

  return (
    <Box
      position="fixed" inset={0} zIndex={1000}
      bg="rgba(5,40,10,0.60)"
      sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ base: 4, md: 6 }}
      py={{ base: 4, md: 6 }}
      onClick={onClose}
    >
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        position="relative"
        w={{ base: "95%", md: "640px" }}
        maxH={{ base: "88vh", md: "88vh" }}
        overflowY="auto"
        borderRadius="24px"
        bg="#fdf7ee"
        boxShadow="0 32px 80px rgba(0,0,0,0.45), 0 4px 16px rgba(0,0,0,0.15)"
        sx={{
          "&::-webkit-scrollbar": { width: "5px" },
          "&::-webkit-scrollbar-track": { bg: "transparent" },
          "&::-webkit-scrollbar-thumb": { bg: MODAL_COLOR + "55", borderRadius: "full" },
        }}
      >
        {/* Decoraciones botánicas en esquinas */}
        <BotanicalCorner />
        <BotanicalCorner flip />

        {/* Abejitas decorativas de fondo */}
        <BeeDecoration size={62} opacity={0.11}
          style={{ top: "22%", right: "12px" }} />
        <BeeDecoration size={40} opacity={0.08}
          style={{ top: "55%", left: "18px", transform: "rotate(-15deg) scaleX(-1)" }} />
        <BeeDecoration size={30} opacity={0.07}
          style={{ bottom: "18%", right: "60px", transform: "rotate(10deg)" }} />

        {/* Contenido */}
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
            <HStack spacing={3} align="center" alignItems={"center"} justifyContent={"center"}>
              <FitoterapiaIconOscuro />

              <Text
                color={textDark}
                fontSize={{ base: "3xl", md: "4xl" }}
                fontWeight="700"
                fontFamily="'EB Garamond', serif"
                letterSpacing="0.03em"
                lineHeight="1.1"
              >
                {planta.nombre}
              </Text>
            </HStack>
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
                    mt="9px" w="8px" h="8px"
                    borderRadius="full"
                    bg={MODAL_COLOR}
                    flexShrink={0}
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

        </Box>
      </Box>
    </Box>
  );
};

/* ═══════════════════════════════════════════
   TARJETA DE PLANTA (vertical, 3 columnas)
═══════════════════════════════════════════ */
const PlantCard = ({
  planta,
  isFavorite,
  onOpen,
  onToggleFavorite,
  showFavorite = true,
}: {
  planta: Planta;
  isFavorite: boolean;
  onOpen: () => void;
  onToggleFavorite: () => void;
  showFavorite?: boolean;
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
      boxShadow= "0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"
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

      {/* Corazón — solo si el usuario está logado */}
      {showFavorite && (
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
          _hover={{ transform: "scale(1.15)" }}
          onClick={(e: React.MouseEvent) => { e.stopPropagation(); onToggleFavorite(); }}
          cursor="pointer"
        >
          {isFavorite ? <HeartIconFilled /> : <HeartIcon />}
        </Box>
      )}
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

// #region main

const FitoterapiaRecursos = () => {
  const navigate = useNavigate();
  const [selected, setSelected]   = useState<Planta | null>(null);
  const [search, setSearch]       = useState("");
  const [favoritos, setFavoritos] = useState<Set<number>>(new Set());
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const [saberMasOpen, setSaberMasOpen] = useState(false);
  const gridReveal                = useReveal();
  const userId                    = sessionStorage.getItem("userId");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  /* Cargar favoritos al montar */
  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) return;
    axios
      .get(`${API_URL}/fitoterapia/${userId}`)
      .then((res) => {
        const ids: number[] = (res.data || []).map((f: { idPlanta: number }) => f.idPlanta);
        setFavoritos(new Set(ids));
      })
      .catch(() => {});
  }, []);

  /* Toggle favorito */
  const toggleFavorite = async (plantaId: number) => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) return;

    const esFavorito = favoritos.has(plantaId);
    try {
      if (esFavorito) {
        await axios.delete(`${API_URL}/fitoterapia/${userId}/${plantaId}`);
        setFavoritos((prev) => { const n = new Set(prev); n.delete(plantaId); return n; });
      } else {
        await axios.post(`${API_URL}/fitoterapia`, { idPlanta: plantaId, idUser: userId });
        setFavoritos((prev) => new Set(prev).add(plantaId));
      }
    } catch (e) {
      console.error("Error al gestionar favorito", e);
    }
  };

  /* Filtrar + ordenar (favoritos primero) */
  const plantasMostradas = useMemo(() => {
    const filtradas = search.trim()
      ? plantas.filter((p) =>
          p.nombre.toLowerCase().includes(search.toLowerCase()) ||
          p.nombreCientifico.toLowerCase().includes(search.toLowerCase())
        )
      : [...plantas];

    return filtradas.sort((a, b) => {
      const aFav = favoritos.has(a.id) ? 0 : 1;
      const bFav = favoritos.has(b.id) ? 0 : 1;
      return aFav - bFav;
    });
  }, [search, favoritos]);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">

      {/* HEADER */}
      <SiteHeader variant="auto" />

      {/* MAIN */}
      <Flex
        direction="column"
        alignItems="center"
        flex="1"
        px={{ base: 5, md: 10, lg: 16 }}
        pt={{ base: 10, md: 14 }}
      >
        <DisciplineHeader
          icon={<FitoterapiaIcon size={{ base: "35px", md: "45px" }} />}
          title={fitoterapiaNom}
          subtitle="Plantas comunes"
          bgColor={fitoterapiaBg}
          color={fitoterapiaTxt}
          onIconClick={() => navigate("/aprendizaje/modulosPage/Fitoterapia/fito-curso-1")}
        />

        {/* BUSCADOR */}
        <Box w="100%" maxW="500px" mx="auto" mt={3} mb={{base:10, md: 20}} position="relative">
          <Box
            position="absolute" left="18px" top="50%"
            transform="translateY(-50%)"
            color="rgba(255,255,255,0.38)"
            pointerEvents="none" zIndex={1}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </Box>
          <Input
            type="text"
            placeholder="Buscar planta..."
            opacity={0.7}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            pl="46px" pr={5} h="50px"
            bg= {fitoterapiaBg}
            border="1px solid rgba(255,255,255,0.20)"
            borderRadius="full"
            color="white"
            fontSize="md"
            fontFamily="'EB Garamond', serif"
            letterSpacing="0.04em"
            _placeholder={{ color: "rgba(255,255,255,0.35)" }}
            _focus={{
              borderColor: `${fitoterapiaTxt}90`,
              boxShadow: `0 0 0 2px ${fitoterapiaTxt}25`,
              opacity:`0.5`,
              outline: "none",
            }}
            sx={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          />
        </Box>

        {/* GRID DE PLANTAS */}
        <Box
          ref={gridReveal.ref}
          w="100%"
          mb={{ base: 6, md: 8 }}
        >
          {plantasMostradas.length === 0 ? (
            <Flex justify="center" py={16}>
              <Text color="rgba(255,255,255,0.45)" fontStyle="italic" fontSize="lg">
                No se encontraron plantas con ese nombre.
              </Text>
            </Flex>
          ) : (
            <Grid
              templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }}
              gap={{ base: 5, md: 6 }}
              mx="auto"
            >
              {plantasMostradas.map((p, i) => (
                <Box
                  key={p.id}
                  opacity={gridReveal.visible ? 1 : 0}
                  transform={gridReveal.visible ? "none" : "translateY(24px)"}
                  transition={`opacity 0.55s ease ${i * 0.07}s, transform 0.55s ease ${i * 0.07}s`}
                >
                  <PlantCard
                    planta={p}
                    isFavorite={favoritos.has(p.id)}
                    onOpen={() => setSelected(p)}
                    onToggleFavorite={() => toggleFavorite(p.id)}
                    showFavorite={!!userId}
                  />
                </Box>
              ))}
            </Grid>
          )}
        </Box>

        {/* AVISO LEGAL — discreto y desplegable */}
        <Box w="100%" maxW="600px" mt={4} mb={{ base: 14, md: 20 }} mx="auto">
          <Flex
            as="button"
            w="100%"
            align="center"
            justify="center"
            gap={3}
            px={{ base: 5, md: 6 }}
            py={3}
            bg={`${fitoterapiaBg}55`}
            border={`1px solid ${fitoterapiaTxt}22`}
            borderRadius={disclaimerOpen ? "xl xl 0 0" : "xl"}
            cursor="pointer"
            onClick={() => setDisclaimerOpen((o) => !o)}
            transition="border-radius 0.2s"
            sx={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
          >
            <Flex align="center" gap={2.5}>
              <Box color={`${fitoterapiaTxt}88`} flexShrink={0}>
                <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="currentColor">
                  <path d="M480-280q17 0 28.5-11.5T520-320v-160q0-17-11.5-28.5T480-520q-17 0-28.5 11.5T440-480v160q0 17 11.5 28.5T480-280Zm0-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>
                </svg>
              </Box>
              <Text
                color={`${fitoterapiaTxt}99`}
                fontSize="md"
                letterSpacing="0.12em"
                textTransform="uppercase"
                fontFamily="'EB Garamond', serif"
              >
                Información importante
              </Text>
            </Flex>
            <Text
              color={`${fitoterapiaTxt}66`}
              fontSize="sm"
              transition="transform 0.22s"
              transform={disclaimerOpen ? "rotate(180deg)" : "rotate(0deg)"}
            >
              ▾
            </Text>
          </Flex>
          <Collapse in={disclaimerOpen} animateOpacity>
            <Box
              px={{ base: 5, md: 6 }}
              py={4}
              bg={`${fitoterapiaBg}33`}
              border={`1px solid ${fitoterapiaTxt}22`}
              borderTop="none"
              borderRadius="0 0 xl xl"
              sx={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
            >
              <Text
                color={`${fitoterapiaTxt}cc`}
                fontSize={{ base: "lg", md: "xl" }}
                lineHeight="1.85"
                letterSpacing="0.02em"
                fontFamily="'EB Garamond', serif"
                fontStyle="italic"
              >
                Esta información está científicamente demostrada y todas las plantas son muy recomendadas a casi toda la población, pero en caso de embarazo, lactancia, alguna enfermedad o patología, por favor, habla con tu médico. Gracias por tu comprensión y por cuidarte con coherencia.
              </Text>
            </Box>
          </Collapse>
        </Box>
      </Flex>

      {/* <SaberMasButton onClick={() => setSaberMasOpen(true)} color={fitoterapiaTxt} bgColor={fitoterapiaBg} /> */}

      {/* FOOTER */}
      <SiteFooter />

      <ContactModal
        isOpen={saberMasOpen}
        onClose={() => setSaberMasOpen(false)}
        title="¿Quieres saber más?"
        icon={<FitoterapiaIcon size={{ base: "24px", md: "24px" }} />}
        subtitle="Déjame tus datos y cuéntame en qué puedo ayudarte."
        bgColor={fitoterapiaBg}
        color={fitoterapiaTxt}
        emailSubject={`Quiero saber más — ${fitoterapiaNom}`}
        showDescription
      />

      {/* MODAL */}
      {selected && (
        <PlantModal planta={selected} onClose={() => setSelected(null)} />
      )}
    </Box>
  );
};

export default FitoterapiaRecursos;
