import React, { useEffect, useState } from "react";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import BandaMarmol from "../../components/global/BandaMarmol";
import { Reveal } from "../../components/global/Reveal";
import { LifeLoading } from "../../components/global/LifeLoading";
import WelcomeCabecera from "../../components/welcome/WelcomeCabecera";
import { focoBlanco } from "../../components/global/foco";
import { API_URL } from "../../GlobalVariables";
import { usePremiumAcceso } from "../../hooks/usePremiumAcceso";
import { youtubeEmbedUrl } from "../../components/aprendizaje/youtube";
import { useIdioma, useT } from "../../i18n";

/**
 * /premium/podcasts y /premium/reels — la lista de lo publicado, de lo más nuevo a lo más
 * antiguo. Todo son enlaces de YouTube (no se sube nada); el servidor solo los da a quien
 * tiene el acceso vigente, y se reproducen con el reproductor sin cookies de la casa.
 */
const TINTA = "#004f4f";
const ORO = "#b08d3f";

type Tipo = "podcast" | "reel";
type Item = { id: string; titulo: string; created_at: string; video: string };

const PremiumContenido = ({ tipo }: { tipo: Tipo }) => {
  const t = useT();
  const { idioma } = useIdioma();
  const navigate = useNavigate();
  const pagado = usePremiumAcceso();

  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<Item[] | null>(null);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const id = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!pagado) return;
    let vivo = true;
    axios.get(`${API_URL}/premium/contenido`, { params: { tipo } })
      .then((r) => { if (vivo) setItems(Array.isArray(r.data) ? r.data : []); })
      .catch(() => { if (vivo) setItems([]); });
    return () => { vivo = false; };
  }, [pagado, tipo]);

  if (!pagado || items === null) {
    return (
      <Box position="fixed" inset={0} bg="#008080">
        <LifeLoading variant="private" />
      </Box>
    );
  }

  const fecha = (iso: string) =>
    new Date(iso).toLocaleDateString(idioma === "en" ? "en-GB" : "es-ES", { day: "numeric", month: "long", year: "numeric" });

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />
      <Box flex="1">
        <WelcomeCabecera
          activo={mounted}
          titulo={t(tipo === "reel" ? "premium.espacio.reels" : "premium.espacio.podcasts")}
          subtitulo={items.length === 0 ? t("premium.contenido.vacio") : ""}
          mayusculas
        />
        {items.length > 0 && (
          <BandaMarmol mt={{ base: 2, md: 4 }}>
            {(visible) => (
              <Grid
                w="100%"
                maxW={tipo === "reel" ? "1000px" : "720px"}
                mx="auto"
                px={{ base: 5, md: 10 }}
                templateColumns={tipo === "reel" ? { base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" } : "1fr"}
                gap={{ base: 6, md: 8 }}
              >
                {items.map((it, i) => (
                  <Reveal key={it.id} activo={visible} direction="up" distance={24} scaleFrom={0.97} duration={0.8} delay={0.1 + (i % 3) * 0.14}>
                    <Flex
                      direction="column"
                      gap={3}
                      p={{ base: 4, md: 5 }}
                      borderRadius="2xl"
                      border={`1.5px solid ${TINTA}`}
                      bg="transparent"
                      boxShadow={`0 0 18px ${ORO}2a, 0 0 40px ${ORO}14`}
                    >
                      {/* Los reels son verticales (9:16); los podcasts, vídeo normal (16:9). */}
                      <Box
                        position="relative"
                        w="100%"
                        overflow="hidden"
                        borderRadius="xl"
                        bg="black"
                        style={{ aspectRatio: tipo === "reel" ? "9 / 16" : "16 / 9" }}
                      >
                        <iframe
                          src={youtubeEmbedUrl(it.video, idioma)}
                          title={it.titulo}
                          loading="lazy"
                          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                          allowFullScreen
                          referrerPolicy="strict-origin-when-cross-origin"
                        />
                      </Box>
                      <Text color={TINTA} fontWeight="700" fontSize={{ base: "lg", md: "xl" }} lineHeight="1.3">
                        {it.titulo}
                      </Text>
                      <Text color={TINTA} opacity={0.8} fontStyle="italic" fontSize="md">
                        {fecha(it.created_at)}
                      </Text>
                    </Flex>
                  </Reveal>
                ))}
              </Grid>
            )}
          </BandaMarmol>
        )}
        <Flex px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 10 }} pb={{ base: 10, md: 14 }} justify="flex-start">
          <Box
            as="button"
            type="button"
            onClick={() => navigate("/premium/espacio")}
            px={{ base: 6, md: 8 }}
            py="12px"
            borderRadius="full"
            bg="transparent"
            border="1.5px solid rgba(255,255,255,0.75)"
            color="white"
            fontWeight="700"
            letterSpacing="0.14em"
            textTransform="uppercase"
            fontSize={{ base: "md", md: "lg" }}
            transition="background 0.25s ease"
            _hover={{ bg: "rgba(255,255,255,0.12)" }}
            _focusVisible={focoBlanco}
          >
            ← {t("comun.volver")}
          </Box>
        </Flex>
      </Box>
      <SiteFooter />
    </Box>
  );
};

export default PremiumContenido;
