import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { useTusCelulas } from "../../components/metodo/TusCelulasModal";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal } from "../../components/global/Reveal";
import { VolverFisio } from "../../components/metodo/VolverFisio";
import { API_URL, fisiologiaBg, fisiologiaNom, fisiologiaTxt, FisiologiaIcon } from "../../GlobalVariables";
import {
  TEMAS_PROFUNDIZA,
  type TemaProfundiza,
} from "../../hardCoded/espacio/ProfundizaFisiologia";

// Tarjeta de un tema: imagen arriba + nombre + frase corta. Rejilla de 3.
function TemaBox({ tema, onClick, delay }: { tema: TemaProfundiza; onClick: () => void; delay: number }) {
  const [imgErr, setImgErr] = useState(false);
  const enConstruccion = tema.fichas.length === 0;
  return (
    <Reveal direction="up" distance={20} delay={delay} duration={0.55} w="100%" display="flex">
      <Box
        as="button"
        onClick={onClick}
        position="relative"
        overflow="hidden"
        w="100%"
        h="100%"
        borderRadius="2xl"
        border={`1px solid ${fisiologiaTxt}44`}
        cursor="pointer"
        fontFamily="'EB Garamond', serif"
        transition="all 0.2s ease"
        boxShadow={`0 4px 16px rgba(0,0,0,0.22), 0 0 14px ${fisiologiaTxt}1f`}
        _hover={{ transform: "translateY(-4px)", borderColor: `${fisiologiaTxt}aa`,
                  boxShadow: `0 10px 30px rgba(0,0,0,0.32), 0 0 22px ${tema.color}` }}
        _active={{ transform: "translateY(-1px)" }}
      >
        <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" overlay={`${fisiologiaBg}55`} />
        <Flex position="relative" zIndex={1} direction="column" align="center" gap={{ base: 2.5, md: 3 }}
              p={{ base: 4, md: 5 }} h="100%">
          <Box w="100%" aspectRatio={1} borderRadius="xl" overflow="hidden" flexShrink={0}
               bg={`${tema.color}22`} border={`1px solid ${tema.color}66`}
               boxShadow={`0 0 12px ${tema.color}44`}
               display="flex" alignItems="center" justifyContent="center">
            {!imgErr ? (
              <Image src={encodeURI(tema.foto)} alt={tema.label} w="100%" h="100%" objectFit="cover"
                     onError={() => setImgErr(true)} />
            ) : (
              <Text color={fisiologiaTxt} fontWeight="800" fontSize={{ base: "3xl", md: "4xl" }}
                    style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>
                {tema.label.charAt(0)}
              </Text>
            )}
          </Box>
          <Text color={fisiologiaTxt} fontWeight="700" lineHeight="1.2" textAlign="center"
                fontSize={{ base: "sm", md: "md" }} letterSpacing="0.02em"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.65)" }}>
            {tema.label}
          </Text>
          <Text color="rgba(255,255,255,0.82)" fontSize={{ base: "2xs", md: "xs" }} fontStyle="italic"
                textAlign="center" lineHeight="1.4"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
            {tema.resumen}
          </Text>
          {enConstruccion && (
            <Text color={`${fisiologiaTxt}88`} fontSize="3xs" fontWeight={700} letterSpacing="0.14em"
                  textTransform="uppercase" mt="auto">
              En construcción
            </Text>
          )}
        </Flex>
      </Box>
    </Reveal>
  );
}

export default function MetodoFisiologiaProfundiza() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { extra: celulasBtn, modal: celulasModal } = useTusCelulas();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        let testEnabled = false;
        try { const t = await axios.get(`${API_URL}/payment/test/enabled`); testEnabled = !!t.data?.enabled; } catch { /* */ }
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.fisiologia_suscrito && !testEnabled) { navigate("/metodo/fisiologia"); return; }
      } catch { navigate("/metodo/fisiologia"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1100px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
              title="Profundiza"
              compact
              bgColor={`${fisiologiaBg}dd`}
              color={fisiologiaTxt}
              nom={fisiologiaNom}
              mb={0}
              prev={{ label: "← Niveles", onClick: () => navigate("/metodo/fisiologia/niveles") }}
              extra={celulasBtn}
            />
          </Reveal>

          <Reveal direction="up" distance={18} delay={0.12} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "md", md: "lg" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="640px"
                  style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
              Para los que quieren toda la verdad. Elige por dónde asomarte.
            </Text>
          </Reveal>

          {/* Todos los temas en una sola rejilla (sin rótulos de bloque). */}
          <SimpleGrid columns={{ base: 2, md: 3 }} spacing={{ base: 4, md: 6 }} w="100%">
            {TEMAS_PROFUNDIZA.map((t, i) => (
              <TemaBox key={t.key} tema={t} delay={0.05 * i}
                       onClick={() => navigate(`/metodo/fisiologia/profundiza/${t.key}`)} />
            ))}
          </SimpleGrid>

          <VolverFisio onClick={() => navigate("/metodo/fisiologia/niveles")} />

        </Flex>
      </Flex>

      {celulasModal}
      <BotonCompania color={fisiologiaTxt} bgColor={fisiologiaBg} disciplinaNom={fisiologiaNom} />
      <SiteFooter />
    </Box>
  );
}
