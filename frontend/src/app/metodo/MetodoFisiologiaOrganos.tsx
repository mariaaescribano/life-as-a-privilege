import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import axios from "axios";
import { getUserMe } from "../../api/userMe";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { FisiologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { IndiceFisiologia } from "../../components/metodo/IndiceFisiologia";
import { BotonCompania } from "../../components/global/BotonCompania";
import { BotonPaso } from "../../components/metodo/BotonPaso";
import { useVideoMateria } from "../../components/metodo/VideoMateriaModal";
import { CELULAS_ORGANOS } from "../../components/metodo/comicCelulasOrganos";
import { glowHeader } from "../../components/metodo/FotoBox";
import { Reveal } from "../../components/global/Reveal";
import { sombraTexto } from "../../components/global/disciplinaSombras";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { useComic } from "../../i18n/comics";
import { useT } from "../../i18n";
import {
  API_URL, fisiologiaBg, fisiologiaNom, fisiologiaTxt, FisiologiaIcon, noSelectSx,
} from "../../GlobalVariables";

const SOMBRA = sombraTexto(fisiologiaNom, fisiologiaBg);

// ─────────────────────────────────────────────────────────────────────────
// ÓRGANOS · paso 3/3 del nivel DESARROLLO (/metodo/fisiologia/organos).
// Cómo las células se juntan para formar tejidos y órganos. De momento lleva el
// final de la historia de «La vida secreta de las células» (viñetas 6 y 7 de
// comicCelulasOrganos.ts) y, al entrar, el vídeo «las células se reconstruyen
// todo el rato» (VideosMateria.ts: sin enlace, no sale).
// Al pasar a «Tu recorrido» el nivel queda hecho (`desarrollo_hecho`), lo que abre
// el nivel VIDA.
// ─────────────────────────────────────────────────────────────────────────
export default function MetodoFisiologiaOrganos() {
  const t = useT();
  const navigate = useNavigate();
  const video = useVideoMateria("reconstruyen");
  const [loading, setLoading] = useState(true);
  const dataRef = useRef<Record<string, any>>({});
  const historia = useComic("fisiologia-celulas-organos", CELULAS_ORGANOS).slice(5);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await getUserMe();
        if (!me.data?.fisiologia_suscrito) { navigate("/metodo/fisiologia"); return; }
        try {
          const r = await axios.get(`${API_URL}/metodo-fisiologia/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          dataRef.current = r.data?.data && typeof r.data.data === "object" ? r.data.data : {};
        } catch { /* sin fila todavía */ }
        await precargarImagenes(CELULAS_ORGANOS.slice(5).map((v) => v.src));
      } catch {
        navigate("/metodo/fisiologia");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  // Cerrar el nivel y seguir: se guarda ANTES de navegar (la página siguiente lo lee).
  const seguir = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (userId && token && !dataRef.current.desarrollo_hecho) {
      try {
        await axios.patch(
          `${API_URL}/metodo-fisiologia/${userId}`,
          { data: { ...dataRef.current, desarrollo_hecho: true } },
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } catch { /* se reintenta la próxima vez */ }
    }
    navigate("/metodo/fisiologia/vida");
  };

  if (loading) return <FisiologiaLoading />;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif" sx={noSelectSx}>
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 28, md: 36 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={{ base: 6, md: 9 }}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
              title={t("fisiologia.organos.titulo")}
              pageLabel="3/3"
              compact
              bgColor={`${fisiologiaBg}dd`}
              color={fisiologiaTxt}
              nom={fisiologiaNom}
              mb={0}
              prev={{ label: `← ${t("fisiologia.celula.titulo")}`, onClick: () => navigate("/metodo/fisiologia/celula") }}
              next={{ label: `${t("fisiologia.vida.titulo")} →`, onClick: seguir }}
            />
          </Reveal>

          {/* Una caja por viñeta: ilustración a la izquierda, texto a la derecha. */}
          {historia.map((v, i) => (
            <Reveal key={v.src} inView once amount={0.2} direction="up" distance={30} scaleFrom={0.96}
                    duration={0.8} delay={i === 0 ? 0.5 : 0} w="100%">
              <Flex position="relative" overflow="hidden" borderRadius="2xl" w="100%"
                    direction={{ base: "column", md: "row" }} align="stretch" boxShadow={glowHeader(fisiologiaTxt)}>
                <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" />
                <Box position="relative" zIndex={1} flex={{ md: "0 0 42%" }} p={{ base: 4, md: 5 }}>
                  <Image src={v.src} alt="" w="100%" borderRadius="xl" objectFit="cover" sx={{ aspectRatio: "1 / 1" }}
                         boxShadow={`0 0 18px ${fisiologiaTxt}33`} />
                </Box>
                <Flex position="relative" zIndex={1} direction="column" justify="center" gap={4}
                      px={{ base: 6, md: 9 }} py={{ base: 5, md: 8 }}>
                  {v.paragraphs.map((p, k) => (
                    <Text key={k} color={fisiologiaTxt} fontSize={{ base: "lg", md: "xl" }} lineHeight="1.85"
                          style={{ textShadow: SOMBRA }}>
                      {p}
                    </Text>
                  ))}
                </Flex>
              </Flex>
            </Reveal>
          ))}

          <BotonPaso label={t("fisiologia.vida.titulo")} onClick={seguir}
                     nom={fisiologiaNom} color={fisiologiaTxt} bg={fisiologiaBg} />
        </Flex>
      </Flex>

      {video}
      <IndiceFisiologia />
      <BotonCompania color={fisiologiaTxt} bgColor={fisiologiaBg} disciplinaNom={fisiologiaNom} />
      <SiteFooter />
    </Box>
  );
}
