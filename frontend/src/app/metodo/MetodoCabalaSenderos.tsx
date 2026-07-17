import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Flex, Text } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal } from "../../components/global/Reveal";
import ArbolDeLaVida from "../../components/global/ArbolDeLaVida";
import { CABALA_SENDEROS } from "../../components/metodo/cabalaSenderos";
import { CABALA_TOTAL_PAGINAS } from "../../components/metodo/cabalaSefirot";
import { API_URL, cabalaBg, cabalaNom, cabalaTxt, CabalaIcon } from "../../GlobalVariables";

const INK_SHADOW = `0 1px 3px ${cabalaBg}f5, 0 0 8px ${cabalaBg}cc, 0 2px 16px ${cabalaBg}88`;

export default function MetodoCabalaSenderos() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.cabala_suscrito) { navigate("/metodo/cabala"); return; }
      } catch {
        navigate("/metodo/cabala");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const primero = CABALA_SENDEROS[0];

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="850px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<CabalaIcon size={{ base: "40px", md: "56px" }} />}
              title="Los 22 Senderos"
              pageLabel={`${CABALA_TOTAL_PAGINAS}/${CABALA_TOTAL_PAGINAS}`}
              compact
              bgColor={`${cabalaBg}dd`}
              color={cabalaTxt}
              nom={cabalaNom}
              mb={0}
              prev={{ label: "← Mapa Evolutivo", onClick: () => navigate("/metodo/cabala/diagnostico") }}
              extra={{ label: "El Árbol", onClick: () => navigate("/metodo/cabala/arbol") }}
            />
          </Reveal>

          <Reveal direction="up" distance={16} delay={0.1} duration={0.6} display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" textAlign="center"
                  lineHeight="1.8" maxW="600px" style={{ textShadow: INK_SHADOW }}>
              Si las sefirot son estados, los senderos son el movimiento entre ellos. Toca cualquiera de los
              22 caminos para entrar en él, o empieza el recorrido desde el principio.
            </Text>
          </Reveal>

          {/* Árbol en modo senderos: al pulsar un camino, se entra en su página */}
          <Reveal direction="up" distance={28} scaleFrom={0.97} delay={0.18} duration={0.8} w="100%">
            <Box
              w="100%"
              boxShadow={`0 4px 20px rgba(0,0,0,0.22), 0 0 22px ${cabalaTxt}55`}
              bg={cabalaBg}
              border={`1.5px solid ${cabalaTxt}55`}
              borderRadius="3xl"
              px={{ base: 6, md: 10 }}
              pt={{ base: 8, md: 10 }}
              pb={{ base: 8, md: 10 }}
            >
              <ArbolDeLaVida
                variant="senderos"
                onSenderoClick={(s) => navigate(`/metodo/cabala/sendero/${s.num}`)}
              />
            </Box>
          </Reveal>

          {/* Comenzar por el principio */}
          <Reveal direction="up" distance={16} delay={0.26} duration={0.6} display="flex" justifyContent="center">
            <Box as="button" onClick={() => navigate(`/metodo/cabala/sendero/${primero.num}`)}
                 px={8} py={3} borderRadius="full" bg={`${cabalaTxt}18`} border={`1.5px solid ${cabalaTxt}66`}
                 color={cabalaTxt} fontSize={{ base: "md", md: "lg" }} fontWeight="700" letterSpacing="0.04em"
                 cursor="pointer" transition="all 0.18s" boxShadow={`0 0 18px ${cabalaTxt}44`}
                 _hover={{ bg: `${cabalaTxt}2e`, borderColor: cabalaTxt, transform: "translateY(-2px)" }}>
              Comenzar por {primero.letra} ({primero.hebreo}) →
            </Box>
          </Reveal>
        </Flex>
      </Flex>

      <BotonCompania color={cabalaTxt} bgColor={cabalaBg} disciplinaNom={cabalaNom} />
      <SiteFooter />
    </Box>
  );
}
