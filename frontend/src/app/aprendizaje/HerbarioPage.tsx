import React, { useEffect, useMemo, useState } from "react";
import { Box, Flex, Grid, HStack, Image, Text } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { DisciplineHeader } from "../../components/global/DisciplineHeader";
import {
  API_URL, nutricionBg, nutricionTxt, FitoterapiaIcon,
} from "../../GlobalVariables";
import { plantas, type Planta } from "../../components/recursos/fitoterapia/PlantasData";

const CARD_COLOR  = nutricionTxt;
const MODAL_COLOR = nutricionBg;

/* ══════════════════════════════════════════════
   SVG — ESQUINA BOTÁNICA
══════════════════════════════════════════════ */
const DECO_COLOR = nutricionTxt;

const BotanicalCorner = ({ flip = false }: { flip?: boolean }) => (
  <Box
    position="absolute"
    top={flip ? "auto" : 0} bottom={flip ? 0 : "auto"}
    left={flip ? "auto" : 0} right={flip ? 0 : "auto"}
    transform={flip ? "rotate(180deg)" : "none"}
    opacity={0.18} pointerEvents="none" zIndex={0}
  >
    <svg width="170" height="170" viewBox="0 0 170 170" fill="none">
      <path d="M 10 160 C 22 124 55 88 90 58 C 118 34 142 18 162 8" stroke={DECO_COLOR} strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M 30 136 C 10 122 8 102 22 92 C 40 104 44 124 30 136 Z" fill={DECO_COLOR}/>
      <path d="M 30 136 C 24 116 18 98 22 92" stroke={DECO_COLOR} strokeWidth="0.9" fill="none"/>
      <path d="M 58 108 C 72 92 74 72 60 62 C 44 72 42 92 58 108 Z" fill={DECO_COLOR}/>
      <path d="M 58 108 C 56 90 54 74 60 62" stroke={DECO_COLOR} strokeWidth="0.9" fill="none"/>
      <path d="M 88 78 C 72 64 70 46 84 38 C 102 48 104 66 88 78 Z" fill={DECO_COLOR}/>
      <path d="M 88 78 C 82 62 80 48 84 38" stroke={DECO_COLOR} strokeWidth="0.9" fill="none"/>
      <path d="M 118 50 C 130 36 134 18 120 10 C 104 18 100 36 118 50 Z" fill={DECO_COLOR}/>
      <path d="M 118 50 C 116 34 114 20 120 10" stroke={DECO_COLOR} strokeWidth="0.9" fill="none"/>
      <circle cx="10" cy="158" r="5.5" fill={DECO_COLOR}/>
      <circle cx="5"  cy="148" r="4"   fill={DECO_COLOR}/>
      <circle cx="18" cy="149" r="4"   fill={DECO_COLOR}/>
      <circle cx="6"  cy="138" r="2.5" fill={DECO_COLOR} opacity="0.7"/>
      <circle cx="162" cy="9"  r="4"   fill={DECO_COLOR}/>
      <circle cx="158" cy="4"  r="2.8" fill={DECO_COLOR} opacity="0.8"/>
      <circle cx="167" cy="5"  r="2.5" fill={DECO_COLOR} opacity="0.7"/>
    </svg>
  </Box>
);

/* ══════════════════════════════════════════════
   SVG — ABEJITA
══════════════════════════════════════════════ */
const BeeDecoration = ({ size = 52, opacity = 0.13, style = {} }: { size?: number; opacity?: number; style?: React.CSSProperties }) => (
  <Box position="absolute" pointerEvents="none" zIndex={0} style={{ opacity, ...style }}>
    <svg width={size} height={size} viewBox="0 0 52 52" fill="none">
      <ellipse cx="16" cy="19" rx="11" ry="6" fill={DECO_COLOR} opacity={0.55} transform="rotate(-30 16 19)"/>
      <ellipse cx="36" cy="19" rx="11" ry="6" fill={DECO_COLOR} opacity={0.55} transform="rotate(30 36 19)"/>
      <ellipse cx="26" cy="32" rx="9" ry="12" fill={DECO_COLOR}/>
      <rect x="17.5" y="28" width="17" height="3.5" rx="1.75" fill="white" opacity={0.45}/>
      <rect x="17.5" y="34" width="17" height="3.5" rx="1.75" fill="white" opacity={0.38}/>
      <circle cx="26" cy="19" r="6" fill={DECO_COLOR}/>
      <circle cx="23.5" cy="18.5" r="1.2" fill="white" opacity={0.7}/>
      <circle cx="28.5" cy="18.5" r="1.2" fill="white" opacity={0.7}/>
      <path d="M23 14 C21 10 17 8 16 5" stroke={DECO_COLOR} strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="15.5" cy="4.5" r="2.2" fill={DECO_COLOR}/>
      <path d="M29 14 C31 10 35 8 36 5" stroke={DECO_COLOR} strokeWidth="1.6" strokeLinecap="round"/>
      <circle cx="36.5" cy="4.5" r="2.2" fill={DECO_COLOR}/>
      <path d="M26 44 L24 49 L26 47 L28 49 Z" fill={DECO_COLOR}/>
    </svg>
  </Box>
);

/* ══════════════════════════════════════════════
   SVG — DIVIDER
══════════════════════════════════════════════ */
const BotanicalDivider = ({ color }: { color: string }) => (
  <Flex align="center" gap={3} my={6}>
    <Box flex="1" h="1px" bg={color} opacity={0.2} />
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <path d="M10 1 C5 6 5 14 10 19 C15 14 15 6 10 1 Z" fill={color} opacity="0.45"/>
      <path d="M1 10 C6 5 14 5 19 10 C14 15 6 15 1 10 Z" fill={color} opacity="0.3"/>
    </svg>
    <Box flex="1" h="1px" bg={color} opacity={0.2} />
  </Flex>
);

/* ══════════════════════════════════════════════
   YOUTUBE EMBED
══════════════════════════════════════════════ */
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
    <Box mb={5} borderRadius="xl" overflow="hidden" border={`1px solid ${color}30`} bg={color + "0d"}
      h={{ base: "210px", md: "270px" }} display="flex" alignItems="center" justifyContent="center"
    >
      {embedUrl ? (
        <iframe src={embedUrl} width="100%" height="100%"
          style={{ border: "none", display: "block" }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen title="Vídeo de la planta"
        />
      ) : (
        <Flex direction="column" align="center" justify="center" gap={4} w="100%" h="100%">
          <Box w="66px" h="66px" borderRadius="full" bg={color + "18"} border={`1.5px solid ${color}35`}
            display="flex" alignItems="center" justifyContent="center"
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

/* ══════════════════════════════════════════════
   SECCIÓN MODAL
══════════════════════════════════════════════ */
const SeccionModal = ({ titulo, color, textMid, children }: { titulo: string; color: string; textMid: string; children: React.ReactNode }) => (
  <Box mb={2}>
    <Flex align="center" gap={2} mb={3}>
      <Box w="3px" h="20px" borderRadius="full" bg={color} opacity={0.7} />
      <Text color={textMid} fontSize={{ base: "xs", md: "sm" }} fontWeight="700"
        letterSpacing="0.12em" textTransform="uppercase" fontFamily="'EB Garamond', serif"
      >
        {titulo}
      </Text>
    </Flex>
    {children}
  </Box>
);

/* ══════════════════════════════════════════════
   MODAL DE PLANTA
══════════════════════════════════════════════ */
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

  const textDark     = nutricionTxt;
  const textMid      = "#2b5e25";
  const accentBg     = MODAL_COLOR + "12";
  const accentBorder = MODAL_COLOR + "40";

  return (
    <Box position="fixed" inset={0} zIndex={1000}
      bg="rgba(5,40,10,0.60)"
      sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
      display="flex" alignItems="center" justifyContent="center"
      px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}
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
        <BotanicalCorner />
        <BotanicalCorner flip />
        <BeeDecoration size={62} opacity={0.11} style={{ top: "22%", right: "12px" }} />
        <BeeDecoration size={40} opacity={0.08} style={{ top: "55%", left: "18px", transform: "rotate(-15deg) scaleX(-1)" }} />
        <BeeDecoration size={30} opacity={0.07} style={{ bottom: "18%", right: "60px", transform: "rotate(10deg)" }} />

        <Box position="relative" zIndex={2} px={{ base: 6, md: 10 }} pt={10} pb={10}>
          {/* Cerrar */}
          <Box as="button" position="absolute" top="14px" right="14px"
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

          {/* Nombre */}
          <Box textAlign="center" mb={6}>
            <HStack spacing={3} align="center" alignItems="center" justifyContent="center">
              <Box as="svg" xmlns="http://www.w3.org/2000/svg" h={{ base: "28px", md: "34px" }} viewBox="0 -960 960 960" w={{ base: "28px", md: "34px" }} fill={nutricionTxt}>
                <path d="m720-600-32 28q-14 13-33 13t-33-11q-14-11-19-28t1-36l16-50-34-20q-16-9-22.5-26t-1.5-34q5-17 20-26.5t34-9.5h40l12-38q6-19 20.5-30.5T720-880q17 0 31.5 11.5T772-838l12 38h40q19 0 33.5 9.5T878-764q7 18 0 35t-22 25l-36 20 16 50q6 19 1 36.5T818-570q-15 11-33.5 11T752-572l-32-28Zm28.5-91.5Q760-703 760-720t-11.5-28.5Q737-760 720-760t-28.5 11.5Q680-737 680-720t11.5 28.5Q703-680 720-680t28.5-11.5ZM552-244q23 60-15 112T430-80q-33 0-62.5-17T324-142q-83 12-137.5-42.5T142-324q-30-17-46-46.5T80-438q0-61 55.5-98.5T244-552l62 26q20-31 53-50.5t71-21.5v-82h60v90q37 11 61 34.5t41 65.5h88v60h-82q-2 38-20.5 71T528-306l24 62Zm-248 24q0-27 4.5-52.5T322-322q-23 11-49.5 15.5T220-304q0 39 22.5 61.5T304-220Zm-74-164q32 0 56.5-8t63.5-32l-120-50q-29-12-49.5.5T160-434q0 26 17 38t53 12Zm200 224q25 0 40.5-17.5T478-214l-54-136q-19 32-29.5 64T384-228q0 33 11.5 50.5T430-160Zm66-222q10-10 16-26.5t6-34.5q0-32-21-54t-52-22q-18 0-34 6t-27 17l78 36 34 78Zm-174 60Z"/>
              </Box>
              <Text color={textDark} fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700"
                fontFamily="'EB Garamond', serif" letterSpacing="0.03em" lineHeight="1.1"
              >
                {planta.nombre}
              </Text>
            </HStack>
            <Text color={textMid} fontSize={{ base: "sm", md: "md" }}
              fontStyle="italic" letterSpacing="0.06em" mt={1} opacity={0.8}
            >
              {planta.nombreCientifico}
            </Text>
          </Box>

          <YoutubePlayer videoUrl={planta.videoUrl} color={MODAL_COLOR} />
          <BotanicalDivider color={nutricionTxt} />

          <Text color={textDark} fontSize={{ base: "md", md: "lg" }} lineHeight="1.85" opacity={0.85}>
            {planta.uso}
          </Text>

          <BotanicalDivider color={nutricionTxt} />

          <SeccionModal titulo="Beneficios" color={nutricionTxt} textMid={textMid}>
            <Flex direction="column" gap={2}>
              {planta.beneficios.map((b, i) => (
                <Flex key={i} gap={3} align="flex-start">
                  <Box mt="9px" w="8px" h="8px" borderRadius="full" bg={nutricionTxt} flexShrink={0} opacity={0.65} />
                  <Text color={textDark} fontSize={{ base: "sm", md: "md" }} lineHeight="1.8" opacity={0.85}>{b}</Text>
                </Flex>
              ))}
            </Flex>
          </SeccionModal>

          <BotanicalDivider color={nutricionTxt} />

          <SeccionModal titulo="Forma de uso" color={nutricionTxt} textMid={textMid}>
            <Box bg={accentBg} border={`1px solid ${accentBorder}`} borderRadius="xl" px={5} py={4}>
              <Text color={textDark} fontSize={{ base: "sm", md: "md" }} lineHeight="1.9" opacity={0.88}>
                {planta.formaDeUso}
              </Text>
            </Box>
          </SeccionModal>

          {planta.datosCuriosos && planta.datosCuriosos.length > 0 && (
            <>
              <BotanicalDivider color={nutricionTxt} />
              <SeccionModal titulo="Datos curiosos" color={nutricionTxt} textMid={textMid}>
                <Flex direction="column" gap={3}>
                  {planta.datosCuriosos.map((d, i) => (
                    <Flex key={i} gap={3} align="flex-start">
                      <Box flexShrink={0} mt="3px" w="22px" h="22px" borderRadius="full"
                        bg={nutricionTxt + "20"} border={`1px solid ${nutricionTxt}55`}
                        display="flex" alignItems="center" justifyContent="center" fontSize="10px"
                      >
                        <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                          <path d="M5 0 L6.18 3.82 L10 5 L6.18 6.18 L5 10 L3.82 6.18 L0 5 L3.82 3.82 Z" fill={nutricionTxt} opacity="0.8"/>
                        </svg>
                      </Box>
                      <Text color={textDark} fontSize={{ base: "sm", md: "md" }} lineHeight="1.8" opacity={0.85}>{d}</Text>
                    </Flex>
                  ))}
                </Flex>
              </SeccionModal>
            </>
          )}

          {planta.precauciones && planta.precauciones.length > 0 && (
            <>
              <BotanicalDivider color="#b05a2a" />
              <SeccionModal titulo="Precauciones" color="#b05a2a" textMid="#8a3e18">
                <Box bg="rgba(176,90,42,0.08)" border="1px solid rgba(176,90,42,0.28)" borderRadius="xl" px={5} py={4}>
                  <Flex direction="column" gap={2}>
                    {planta.precauciones.map((p, i) => (
                      <Flex key={i} gap={3} align="flex-start">
                        <Text flexShrink={0} mt="-1px" fontSize="14px" color="#b05a2a" lineHeight="1.8">⚠</Text>
                        <Text color={textDark} fontSize={{ base: "sm", md: "md" }} lineHeight="1.8" opacity={0.85}>{p}</Text>
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

/* ══════════════════════════════════════════════
   SVG — CORAZONES
══════════════════════════════════════════════ */
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

/* ══════════════════════════════════════════════
   CARD DE PLANTA
══════════════════════════════════════════════ */
function PlantCard({ planta, isFavorite, onOpen, onToggleFavorite, showFavorite }: {
  planta: Planta; isFavorite: boolean; onOpen: () => void;
  onToggleFavorite: () => void; showFavorite: boolean;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <Flex
      align="center"
      gap={{ base: 3, md: 4 }}
      bg={nutricionBg}
      border={`1px solid ${nutricionTxt}22`}
      sx={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
      borderRadius="2xl"
      px={{ base: 4, md: 5 }}
      py={{ base: 4, md: 4 }}
      boxShadow="0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"
      cursor="pointer"
      onClick={onOpen}
      transition="all 0.22s ease"
      _hover={{ transform: "translateY(-4px)" }}
    >
      <Box
        w={{ base: "74px", md: "86px" }} h={{ base: "74px", md: "86px" }}
        borderRadius="xl" overflow="hidden" flexShrink={0}
        bg={CARD_COLOR + "28"} border={`2px solid ${CARD_COLOR}50`}
        display="flex" alignItems="center" justifyContent="center"
      >
        {!imgError ? (
          <Image src={planta.foto} alt={planta.nombre} w="100%" h="100%" objectFit="cover" onError={() => setImgError(true)} />
        ) : (
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M18 3 C11 9 8 18 10 27 C16 29 26 24 30 16 C33 9 27 3 18 3 Z" fill={CARD_COLOR} opacity="0.7"/>
            <path d="M18 3 C18 15 16 23 10 27" stroke="white" strokeWidth="1.2" fill="none" opacity="0.5"/>
          </svg>
        )}
      </Box>

      <Box flex="1" minW={0}>
        <Text color={nutricionTxt} fontWeight="700" fontSize={{ base: "lg", md: "xl" }} letterSpacing="0.02em" lineHeight="1.2">
          {planta.nombre}
        </Text>
        <Text color={nutricionTxt + "88"} fontSize="xs" fontStyle="italic" letterSpacing="0.04em" mt="4px">
          {planta.nombreCientifico}
        </Text>
      </Box>

      {showFavorite && (
        <Box
          as="button"
          w={{ base: "42px", md: "46px" }} h={{ base: "42px", md: "46px" }}
          borderRadius="full"
          bg={CARD_COLOR + "20"} border={`1.5px solid ${CARD_COLOR}60`}
          display="flex" alignItems="center" justifyContent="center"
          color={CARD_COLOR} flexShrink={0}
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
}

/* ══════════════════════════════════════════════
   PÁGINA
══════════════════════════════════════════════ */
export default function HerbarioPage({ favoritesOnly = false }: { favoritesOnly?: boolean }) {
  const navigate = useNavigate();
  const [selected, setSelected]   = useState<Planta | null>(null);
  const [favoritos, setFavoritos] = useState<Set<number>>(new Set());
  const userId = sessionStorage.getItem("userId");

  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, []);

  /* Cargar favoritos */
  useEffect(() => {
    if (!userId) return;
    axios.get(`${API_URL}/fitoterapia/${userId}`)
      .then((res) => {
        const ids: number[] = (res.data || []).map((f: { idPlanta: number }) => f.idPlanta);
        setFavoritos(new Set(ids));
      })
      .catch(() => {});
  }, [userId]);

  /* Toggle favorito */
  const toggleFavorite = async (plantaId: number) => {
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

  /* Favoritos primero / solo favoritos */
  const plantasMostradas = useMemo(() => {
    if (favoritesOnly) return plantas.filter(p => favoritos.has(p.id));
    return [...plantas].sort((a, b) => {
      const aFav = favoritos.has(a.id) ? 0 : 1;
      const bFav = favoritos.has(b.id) ? 0 : 1;
      return aFav - bFav;
    });
  }, [favoritos, favoritesOnly]);

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      <Box flex="1">
        <Flex
          direction="column" alignItems="center"
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 14, md: 20 }}
          gap={{ base: 4, md: 5 }}
        >
          <DisciplineHeader
            icon={<FitoterapiaIcon size={{ base: "40px", md: "50px" }} color={nutricionTxt} />}
            title={favoritesOnly ? "Mis plantas favoritas" : "Herbario"}
            bgColor={nutricionBg}
            color={nutricionTxt}
            onIconClick={() => navigate("/aprendizaje/cursosModalidad/nutricion")}
          />

          {favoritesOnly && plantasMostradas.length === 0 && (
            <Text color="rgba(255,255,255,0.75)" fontSize={{ base: "lg", md: "xl" }}
              fontStyle="italic" textAlign="center" mt={4}
            >
              Aún no tienes plantas marcadas como favoritas.
            </Text>
          )}

          <Grid
            w="100%" maxW="900px"
            templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }}
            gap={{ base: 3, md: 4 }}
          >
            {plantasMostradas.map((p) => (
              <PlantCard
                key={p.id} planta={p}
                isFavorite={favoritos.has(p.id)}
                onOpen={() => setSelected(p)}
                onToggleFavorite={() => toggleFavorite(p.id)}
                showFavorite={!!userId}
              />
            ))}
          </Grid>
        </Flex>
      </Box>

      <SiteFooter />

      {selected && <PlantModal planta={selected} onClose={() => setSelected(null)} />}
    </Box>
  );
}
