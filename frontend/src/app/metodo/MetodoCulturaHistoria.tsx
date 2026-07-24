import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { BotonCompania } from "../../components/global/BotonCompania";
import { LineaTiempoCultura } from "../../components/metodo/LineaTiempoCultura";
import { getHistoria } from "../../components/metodo/culturaHistorias";
import { Reveal } from "../../components/global/Reveal";
import { API_URL, culturaBg, culturaNom, culturaTxt, CulturaIcon } from "../../GlobalVariables";

// Página de nivel 1 de una Historia de Cultura: su línea del tiempo de ERAS.
// Sirve para cualquier Historia (la clave va en la ruta:
// /metodo/cultura/historia/:historiaKey). Al pulsar una era se abre su página
// (/metodo/cultura/historia/:historiaKey/:eraKey) con su mini línea del tiempo.

const INK_SHADOW = `0 1px 3px ${culturaBg}f5, 0 0 8px ${culturaBg}cc, 0 2px 16px ${culturaBg}88`;
const VOLVER_HISTORIAS = "/metodo/cultura/historias";

export default function MetodoCulturaHistoria() {
  const navigate = useNavigate();
  const { historiaKey } = useParams<{ historiaKey: string }>();
  const [loading, setLoading] = useState(true);

  const historia = useMemo(() => getHistoria(historiaKey), [historiaKey]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    // Historia inexistente / aún sin datos: de vuelta al listado de Historias.
    if (!historia) { navigate(VOLVER_HISTORIAS, { replace: true }); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        // Gate de pago: sin suscripción a Cultura, a la portada (con el popup de pago).
        if (!me.data?.cultura_suscrito) { navigate("/metodo/cultura", { replace: true }); return; }
      } catch {
        navigate("/metodo/cultura", { replace: true });
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, historia]);

  if (loading || !historia) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={8}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<CulturaIcon size={{ base: "40px", md: "56px" }} />}
              title={historia.titulo}
              compact
              maxW="1000px"
              bgColor={`${culturaBg}dd`}
              color={culturaTxt}
              nom={culturaNom}
              mb={0}
              prev={{ label: "← Las Historias", onClick: () => navigate(VOLVER_HISTORIAS) }}
            />
          </Reveal>

          {/* Introducción breve */}
          <Reveal direction="up" distance={18} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color={culturaTxt} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" textAlign="center"
                  lineHeight="1.8" maxW="620px" opacity={0.92} style={{ textShadow: INK_SHADOW }}>
              {historia.intro ?? "Recorre la línea del tiempo y pulsa cada era para adentrarte en su historia."}
            </Text>
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
