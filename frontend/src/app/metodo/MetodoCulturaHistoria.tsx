import React, { useEffect, useMemo, useState } from "react";
import { useT } from "../../i18n";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Box, Flex } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { CulturaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { BotonCompania } from "../../components/global/BotonCompania";
import { LineaTiempoCultura } from "../../components/metodo/LineaTiempoCultura";
import { getHistoria, tituloHistoria } from "../../components/metodo/culturaHistorias";
import { Reveal } from "../../components/global/Reveal";
import { precargarImagenes } from "../../hooks/usePrecargarImagenes";
import { API_URL, culturaBg, culturaNom, culturaTxt, CulturaIcon } from "../../GlobalVariables";

// Página de nivel 1 de una Historia de Cultura: su línea del tiempo de ERAS.
// Sirve para cualquier Historia (la clave va en la ruta:
// /metodo/cultura/historia/:historiaKey). Al pulsar una era se abre su página
// (/metodo/cultura/historia/:historiaKey/:eraKey) con su mini línea del tiempo.

const VOLVER_HISTORIAS = "/metodo/cultura/historias";
// Nº de fotos que se precargan antes de mostrar la página (la «primera ronda»
// de círculos que se ven sin usar las flechas). Las demás se cargan al avanzar.
const PRIMERA_RONDA = 6;

export default function MetodoCulturaHistoria() {
  const t = useT();
  const navigate = useNavigate();
  const { historiaKey } = useParams<{ historiaKey: string }>();
  const [loading, setLoading] = useState(true);

  const historia = useMemo(() => getHistoria(historiaKey), [historiaKey]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    // Al cambiar de Historia volvemos a esperar (loader + precarga de sus fotos):
    // es la misma ruta, así que el componente NO se desmonta y sin esto la nueva
    // línea del tiempo se pintaría con los círculos aún sin imagen. Igual que en
    // la página de una era.
    setLoading(true);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    // Historia inexistente / aún sin datos: de vuelta al listado de Historias.
    if (!historia) { navigate(VOLVER_HISTORIAS, { replace: true }); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        // Gate de pago: sin suscripción a Cultura, a la portada (con el popup de pago).
        if (!me.data?.cultura_suscrito) { navigate("/metodo/cultura", { replace: true }); return; }

        // No mostramos la línea del tiempo hasta que las fotos de la primera
        // ronda de eras estén cargadas (las de más allá se cargan al usar las
        // flechas para desplazarse).
        await precargarImagenes(
          (historia?.hitos ?? []).slice(0, PRIMERA_RONDA).map((h) => (h.foto ? encodeURI(h.foto) : null)),
        );
      } catch {
        navigate("/metodo/cultura", { replace: true });
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, historia]);

  if (loading || !historia) {
    return <CulturaLoading />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        {/* 1240 y no 1000: la banda de la línea del tiempo necesita aire para
            que quepan seis círculos decentes. El header no se entera — lleva su
            propio maxW="1000px" ahí abajo. */}
        <Flex direction="column" align="center" w="100%" maxW="1240px" gap={8}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<CulturaIcon size={{ base: "40px", md: "56px" }} />}
              title={tituloHistoria(historiaKey)}
              compact
              maxW="1000px"
              bgColor={`${culturaBg}dd`}
              color={culturaTxt}
              nom={culturaNom}
              mb={0}
              prev={{ label: `← ${t("metodo.cultura.paso.historias")}`, onClick: () => navigate(VOLVER_HISTORIAS) }}
            />
          </Reveal>

          {/* Línea de tiempo de las eras (centrada) */}
          <Reveal direction="up" distance={26} scaleFrom={0.98} delay={0.16} duration={0.75} w="100%"
                  display="flex" justifyContent="center" flex="1" alignItems="center">
            <LineaTiempoCultura
              hitos={historia.hitos}
              tinta={culturaTxt}
              bg={culturaBg}
              // Cada era abre su propia página con su mini línea del tiempo.
              onSelect={(key) => navigate(`/metodo/cultura/historia/${historiaKey}/${key}`)}
            />
          </Reveal>
        </Flex>
      </Flex>

      <BotonCompania color={culturaTxt} bgColor={culturaBg} disciplinaNom={culturaNom} />

      <SiteFooter />
    </Box>
  );
}
