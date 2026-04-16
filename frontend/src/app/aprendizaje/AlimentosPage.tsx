import React, { useEffect, useState } from "react";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { DisciplineHeader } from "../../components/global/DisciplineHeader";
import { NutricionIcon, nutricionBg, nutricionTxt, API_URL } from "../../GlobalVariables";
import { alimentos, type Alimento } from "../../components/recursos/nutricion/AlimentosData";

const CARD_COLOR  = nutricionTxt;
const MODAL_COLOR = nutricionBg;

/* ══════════════════════════════════════════════
   SVG — ESQUINA BOTÁNICA
══════════════════════════════════════════════ */
const BotanicalCorner = ({ flip = false }: { flip?: boolean }) => (
  <Box
    position="absolute"
    top={flip ? "auto" : 0} bottom={flip ? 0 : "auto"}
    left={flip ? "auto" : 0} right={flip ? 0 : "auto"}
    transform={flip ? "rotate(180deg)" : "none"}
    opacity={0.18} pointerEvents="none" zIndex={0}
  >
    <svg width="170" height="170" viewBox="0 0 170 170" fill="none">
      <path d="M 10 160 C 22 124 55 88 90 58 C 118 34 142 18 162 8" stroke={nutricionTxt} strokeWidth="2.2" strokeLinecap="round"/>
      <path d="M 30 136 C 10 122 8 102 22 92 C 40 104 44 124 30 136 Z" fill={nutricionTxt}/>
      <path d="M 30 136 C 24 116 18 98 22 92" stroke={nutricionTxt} strokeWidth="0.9" fill="none"/>
      <path d="M 58 108 C 72 92 74 72 60 62 C 44 72 42 92 58 108 Z" fill={nutricionTxt}/>
      <path d="M 58 108 C 56 90 54 74 60 62" stroke={nutricionTxt} strokeWidth="0.9" fill="none"/>
      <path d="M 88 78 C 72 64 70 46 84 38 C 102 48 104 66 88 78 Z" fill={nutricionTxt}/>
      <path d="M 88 78 C 82 62 80 48 84 38" stroke={nutricionTxt} strokeWidth="0.9" fill="none"/>
      <path d="M 118 50 C 130 36 134 18 120 10 C 104 18 100 36 118 50 Z" fill={nutricionTxt}/>
      <path d="M 118 50 C 116 34 114 20 120 10" stroke={nutricionTxt} strokeWidth="0.9" fill="none"/>
      <circle cx="10" cy="158" r="5.5" fill={nutricionTxt}/>
      <circle cx="5"  cy="148" r="4"   fill={nutricionTxt}/>
      <circle cx="18" cy="149" r="4"   fill={nutricionTxt}/>
      <circle cx="6"  cy="138" r="2.5" fill={nutricionTxt} opacity="0.7"/>
      <circle cx="162" cy="9"  r="4"   fill={nutricionTxt}/>
      <circle cx="158" cy="4"  r="2.8" fill={nutricionTxt} opacity="0.8"/>
      <circle cx="167" cy="5"  r="2.5" fill={nutricionTxt} opacity="0.7"/>
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
   MODAL DE ALIMENTO
══════════════════════════════════════════════ */
const AlimentoModal = ({ alimento, onClose }: { alimento: Alimento; onClose: () => void }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  const textDark = nutricionTxt;
  const textMid  = "#2b5e25";
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
            <Flex align="center" justify="center" gap={3} mb={2}>
              <Box
                px={3} py={1} borderRadius="full"
                bg={alimento.tipo === "fruta" ? "#fce8d5" : "#d8f0d5"}
                border={`1px solid ${alimento.tipo === "fruta" ? "#e8a87055" : "#7bb87055"}`}
              >
                <Text
                  fontSize="xs" fontWeight="700" letterSpacing="0.12em"
                  textTransform="uppercase"
                  color={alimento.tipo === "fruta" ? "#b05a20" : "#2b6b2b"}
                  fontFamily="'EB Garamond', serif"
                >
                  {alimento.tipo}
                </Text>
              </Box>
            </Flex>
            <Flex align="center" justify="center" gap={2} mt={1}>
              <NutricionIcon size={{ base: "28px", md: "34px" }} />
              <Text color={textDark} fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700"
                fontFamily="'EB Garamond', serif" letterSpacing="0.03em" lineHeight="1.1"
              >
                {alimento.nombre}
              </Text>
            </Flex>
            <Text color={textMid} fontSize={{ base: "sm", md: "md" }}
              fontStyle="italic" letterSpacing="0.06em" mt={1} opacity={0.8}
            >
              {alimento.nombreCientifico}
            </Text>
          </Box>

          {/* Foto */}
          <Flex mb={5} borderRadius="xl" overflow="hidden" border={`1px solid ${MODAL_COLOR}30`}
            justify="center" bg={MODAL_COLOR + "18"}
          >
            <Image src={alimento.foto} alt={alimento.nombre} maxH={{ base: "200px", md: "260px" }} maxW="100%" objectFit="contain" display="block"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </Flex>

          <BotanicalDivider color={nutricionTxt} />

          <Text color={textDark} fontSize={{ base: "md", md: "lg" }} lineHeight="1.85" opacity={0.85}>
            {alimento.uso}
          </Text>

          <BotanicalDivider color={nutricionTxt} />

          <SeccionModal titulo="Beneficios" color={nutricionTxt} textMid={textMid}>
            <Flex direction="column" gap={2}>
              {alimento.beneficios.map((b, i) => (
                <Flex key={i} gap={3} align="flex-start">
                  <Box mt="9px" w="8px" h="8px" borderRadius="full" bg={nutricionTxt} flexShrink={0} opacity={0.65} />
                  <Text color={textDark} fontSize={{ base: "sm", md: "md" }} lineHeight="1.8" opacity={0.85}>{b}</Text>
                </Flex>
              ))}
            </Flex>
          </SeccionModal>

          <BotanicalDivider color={nutricionTxt} />

          <SeccionModal titulo="Cómo consumirlo" color={nutricionTxt} textMid={textMid}>
            <Box bg={accentBg} border={`1px solid ${accentBorder}`} borderRadius="xl" px={5} py={4}>
              <Text color={textDark} fontSize={{ base: "sm", md: "md" }} lineHeight="1.9" opacity={0.88}>
                {alimento.formaDeUso}
              </Text>
            </Box>
          </SeccionModal>

          {alimento.datosCuriosos && alimento.datosCuriosos.length > 0 && (
            <>
              <BotanicalDivider color={nutricionTxt} />
              <SeccionModal titulo="Datos curiosos" color={nutricionTxt} textMid={textMid}>
                <Flex direction="column" gap={3}>
                  {alimento.datosCuriosos.map((d, i) => (
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

          {alimento.precauciones && alimento.precauciones.length > 0 && (
            <>
              <BotanicalDivider color="#b05a2a" />
              <SeccionModal titulo="Precauciones" color="#b05a2a" textMid="#8a3e18">
                <Box bg="rgba(176,90,42,0.08)" border="1px solid rgba(176,90,42,0.28)" borderRadius="xl" px={5} py={4}>
                  <Flex direction="column" gap={2}>
                    {alimento.precauciones.map((p, i) => (
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
   CARD DE ALIMENTO
══════════════════════════════════════════════ */
function AlimentoCard({ alimento, onOpen, isFavorite, onToggleFavorite, showFavorite }: {
  alimento: Alimento; onOpen: () => void;
  isFavorite?: boolean; onToggleFavorite?: () => void; showFavorite?: boolean;
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
          <Image src={alimento.foto} alt={alimento.nombre} w="100%" h="100%" objectFit="cover" onError={() => setImgError(true)} />
        ) : (
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <path d="M18 4 C12 8 9 15 11 24 C17 28 26 24 30 16 C33 9 26 3 18 4 Z" fill={CARD_COLOR} opacity="0.7"/>
            <circle cx="18" cy="10" r="3" fill={CARD_COLOR} opacity="0.4"/>
          </svg>
        )}
      </Box>

      <Box flex="1" minW={0}>
        <Flex align="center" gap={2} mb="2px">
          <Text color={nutricionTxt} fontWeight="700" fontSize={{ base: "lg", md: "xl" }} letterSpacing="0.02em" lineHeight="1.2">
            {alimento.nombre}
          </Text>
          <Box
            px={2} py="1px" borderRadius="full"
            bg={alimento.tipo === "fruta" ? "#fce8d5" : "#d8f0d5"}
            flexShrink={0}
          >
            <Text
              fontSize="9px" fontWeight="700" letterSpacing="0.1em" textTransform="uppercase"
              color={alimento.tipo === "fruta" ? "#b05a20" : "#2b6b2b"}
            >
              {alimento.tipo}
            </Text>
          </Box>
        </Flex>
        <Text color={nutricionTxt + "88"} fontSize="xs" fontStyle="italic" letterSpacing="0.04em">
          {alimento.nombreCientifico}
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
          onClick={(e: React.MouseEvent) => { e.stopPropagation(); onToggleFavorite?.(); }}
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
export default function AlimentosPage({ favoritesOnly = false }: { favoritesOnly?: boolean }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Alimento | null>(null);
  const [favoritos, setFavoritos] = useState<Set<number>>(new Set());
  const userId = sessionStorage.getItem("userId");

  useEffect(() => { window.scrollTo({ top: 0, behavior: "auto" }); }, []);

  useEffect(() => {
    if (!userId) return;
    axios.get(`${API_URL}/alimentos/${userId}`)
      .then(res => {
        const ids: number[] = (res.data || []).map((f: { idAlimento: number }) => f.idAlimento);
        setFavoritos(new Set(ids));
      })
      .catch(() => {});
  }, [userId]);

  const toggleFavorite = async (id: number) => {
    if (!userId) return;
    const esFavorito = favoritos.has(id);
    try {
      if (esFavorito) {
        await axios.delete(`${API_URL}/alimentos/${userId}/${id}`);
        setFavoritos(prev => { const n = new Set(prev); n.delete(id); return n; });
      } else {
        await axios.post(`${API_URL}/alimentos`, { idAlimento: id, idUser: userId });
        setFavoritos(prev => new Set(prev).add(id));
      }
    } catch (e) {
      console.error("Error al gestionar favorito", e);
    }
  };

  const alimentosMostrados = favoritesOnly
    ? alimentos.filter(a => favoritos.has(a.id))
    : alimentos;

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
            icon={<NutricionIcon size={{ base: "35px", md: "45px" }} />}
            title={favoritesOnly ? "Mis alimentos favoritos" : "Alimentos"}
            bgColor={nutricionBg}
            color={nutricionTxt}
            onIconClick={() => navigate("/aprendizaje/cursosModalidad/nutricion")}
          />

          {favoritesOnly && alimentosMostrados.length === 0 && (
            <Text color="rgba(255,255,255,0.75)" fontSize={{ base: "lg", md: "xl" }}
              fontStyle="italic" textAlign="center" mt={4}
            >
              Aún no tienes alimentos marcados como favoritos.
            </Text>
          )}

          <Grid
            w="100%" maxW="900px"
            templateColumns={{ base: "1fr", lg: "repeat(3, 1fr)" }}
            gap={{ base: 3, md: 4 }}
          >
            {alimentosMostrados.map((a) => (
              <AlimentoCard
                key={a.id} alimento={a}
                onOpen={() => setSelected(a)}
                isFavorite={favoritos.has(a.id)}
                onToggleFavorite={() => toggleFavorite(a.id)}
                showFavorite={!!userId}
              />
            ))}
          </Grid>
        </Flex>
      </Box>

      <SiteFooter />

      {selected && <AlimentoModal alimento={selected} onClose={() => setSelected(null)} />}
    </Box>
  );
}
