import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { FisiologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { FotoBox } from "../../components/metodo/FotoBox";
import { useTusCelulas } from "../../components/metodo/TusCelulasModal";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal } from "../../components/global/Reveal";
import { BotonPaso } from "../../components/metodo/BotonPaso";
import { useT } from "../../i18n";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { API_URL, fisiologiaBg, fisiologiaNom, fisiologiaTxt, FisiologiaIcon, noSelectSx} from "../../GlobalVariables";
import {
  TEMAS_PROFUNDIZA,
  PROFUNDIZA_LEIDAS_KEY,
  type TemaProfundiza,
} from "../../hardCoded/espacio/ProfundizaFisiologia";
import { useTemasProfundiza } from "../../hardCoded/espacio/useTemaProfundiza";

// Tarjeta de un tema: box por defecto (FotoBox), imagen arriba + nombre abajo.
function TemaBox({ tema, onClick, delay, completo = false }: { tema: TemaProfundiza; onClick: () => void; delay: number; completo?: boolean }) {
  return (
    <Reveal direction="up" distance={20} delay={delay} duration={0.55} w="100%" display="flex">
      <FotoBox
        titulo={tema.label}
        foto={tema.foto}
        nom={fisiologiaNom}
        tinta={fisiologiaTxt}
        bg={fisiologiaBg}
        visto={completo}
        colorTint={`${tema.color}22`}
        onClick={onClick}
      />
    </Reveal>
  );
}

export default function MetodoFisiologiaProfundiza() {
  const t = useT();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [leidasMap, setLeidasMap] = useState<Record<string, string[]>>({});
  const { extra: celulasBtn, modal: celulasModal } = useTusCelulas();
  // Los nombres de las tarjetas, en el idioma activo (el orden y las fotos los
  // sigue mandando el español).
  const temas = useTemasProfundiza();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.fisiologia_suscrito) { navigate("/metodo/fisiologia"); return; }
        // Fichas leídas por tema, para el check de las portadas completadas.
        try {
          const r = await axios.get(`${API_URL}/metodo-fisiologia/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
          const mapa = r.data?.data?.[PROFUNDIZA_LEIDAS_KEY];
          if (mapa && typeof mapa === "object") setLeidasMap(mapa);
        } catch { /* sin fila todavía */ }

        // No mostramos la página hasta que TODAS las fotos de los temas estén
        // descargadas, para que la rejilla no se rellene de golpe después.
        await precargarImagenes(TEMAS_PROFUNDIZA.map((t) => encodeURI(t.foto)));
      } catch { navigate("/metodo/fisiologia"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  // Un tema está "completo" cuando se han leído TODAS sus fichas.
  const temaCompleto = (t: TemaProfundiza): boolean => {
    if (t.fichas.length === 0) return false;
    const leidas = new Set(leidasMap[t.key] ?? []);
    return t.fichas.every((f) => leidas.has(f.key));
  };

  if (loading) return <FisiologiaLoading />;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif" sx={noSelectSx}>
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1100px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
              title={t("fisiologia.profundiza.titulo")}
              compact
              bgColor={`${fisiologiaBg}dd`}
              color={fisiologiaTxt}
              nom={fisiologiaNom}
              mb={0}
              prev={{ label: `← ${t("fisiologia.niveles.titulo")}`, onClick: () => navigate("/metodo/fisiologia/niveles") }}
              extra={celulasBtn}
            />
          </Reveal>

          <Reveal direction="up" distance={18} delay={0.12} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="white" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="640px">
              {t("fisiologia.profundiza.intro")}
            </Text>
          </Reveal>

          {/* Todos los temas en una sola rejilla (sin rótulos de bloque). */}
          <SimpleGrid columns={{ base: 2, md: 3 }} spacing={{ base: 4, md: 6 }} w="100%">
            {temas.map((tema, i) => (
              <TemaBox key={tema.key} tema={tema} delay={0.05 * i} completo={temaCompleto(tema)}
                       onClick={() => navigate(`/metodo/fisiologia/profundiza/${tema.key}`)} />
            ))}
          </SimpleGrid>

          <BotonPaso label={t("fisiologia.profundiza.volverArriba")} direction="up"
                     nom={fisiologiaNom} color={fisiologiaTxt} bg={fisiologiaBg}
                     onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} />

        </Flex>
      </Flex>

      {celulasModal}
      <BotonCompania color={fisiologiaTxt} bgColor={fisiologiaBg} disciplinaNom={fisiologiaNom} />
      <SiteFooter />
    </Box>
  );
}
