import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyurvedaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesAyurveda } from "../../components/metodo/IlustracionesAyurveda";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { BotonCompania } from "../../components/global/BotonCompania";
import { Reveal, RevealStagger, RevealItem } from "../../components/global/Reveal";
import {
  API_URL,
  AyurvedaIcon, ayurvedaBg, ayurvedaNom, ayurvedaTxt,
  VataIcon, PittaIcon, KaphaIcon,
  vataColor, pittaColor, kaphaColor,
} from "../../GlobalVariables";

type Dosha = "vata" | "pitta" | "kapha";

const DOSHA_CARD: Record<Dosha, {
  label: string;
  color: string;
  Icon: any;
  elemento: string;
  esencia: string;
  /** Fondo propio de la tarjeta (sustituye la imagen de la disciplina). */
  bgImg?: string;
}> = {
  vata: {
    label: "Vata",
    color: vataColor,
    Icon: VataIcon,
    elemento: "Aire y Éter",
    esencia: "El movimiento.",
  },
  pitta: {
    label: "Pitta",
    color: pittaColor,
    Icon: PittaIcon,
    elemento: "Fuego y Agua",
    esencia: "La transformación.",
  },
  kapha: {
    label: "Kapha",
    color: kaphaColor,
    Icon: KaphaIcon,
    elemento: "Tierra y Agua",
    esencia: "La estructura.",
  },
};
const DOSHAS: Dosha[] = ["vata", "pitta", "kapha"];

interface Resultado {
  dosha: Dosha;
  vata_score: number;
  pitta_score: number;
  kapha_score: number;
}

export default function MetodoAyurvedaTarjetas() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState<Record<Dosha, number> | null>(null);
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesAyurveda();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!me.data?.ayurveda_suscrito) { navigate("/metodo/ayurveda"); return; }

        const res = await axios.get(`${API_URL}/ayurveda/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.data) { navigate("/metodo/ayurveda/test"); return; }
        const r = res.data as Resultado;
        setScores({ vata: r.vata_score, pitta: r.pitta_score, kapha: r.kapha_score });
      } catch {
        navigate("/metodo/ayurveda/test");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading || !scores) {
    return <AyurvedaLoading />;
  }

  // Predominan las dosha(s) con la puntuación máxima (admite empates → bidosha/tridosha).
  const maxScore = Math.max(scores.vata, scores.pitta, scores.kapha);
  const predomina = (d: Dosha) => scores[d] === maxScore && maxScore > 0;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box flex="1">
        <Flex
          direction="column"
          alignItems="center"
          gap={{ base: 5, md: 6 }}
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 8, md: 12 }}
          pb={{ base: 14, md: 20 }}
        >
          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<AyurvedaIcon size={{ base: "40px", md: "56px" }} />}
            title="Los tres Doṣhas"
            pageLabel="4/4"
            bgColor={`${ayurvedaBg}dd`}
            color={ayurvedaTxt}
            nom={ayurvedaNom}
            mb={0}
            prev={{ label: "← Resultado", onClick: () => navigate("/metodo/ayurveda/resultado") }}
            extra={ilustracionesBtn}
          />
          </Reveal>

          {/* Intro */}
          <Reveal direction="up" distance={20} delay={0.12} duration={0.65} w="100%" display="flex" justifyContent="center">
          <Text
            color="rgba(255,255,255,0.85)"
            fontSize={{ base: "md", md: "lg" }}
            textAlign="center"
            maxW="680px"
            lineHeight="1.8"
          >
            Los tres Doṣhas viven en ti, pero unos predominan más que otros. Descúbrelos primero.
          </Text>
          </Reveal>

          {/* 3 tarjetas · salen una tras otra empezando por la izquierda */}
          <RevealStagger
            w="100%"
            maxW="1040px"
            display="flex"
            gap={{ base: 4, md: 5 }}
            flexDirection={{ base: "column", md: "row" }}
            alignItems="stretch"
            justifyContent="center"
            mt={{ base: 1, md: 2 }}
            stagger={0.18}
            delayChildren={0.2}
          >
            {DOSHAS.map((d) => {
              const cfg = DOSHA_CARD[d];
              const Icon = cfg.Icon;
              const destacada = predomina(d);
              return (
                <RevealItem key={d} direction="up" distance={30} scaleFrom={0.94} duration={0.6} flex="1" display="flex">
                <Box
                  onClick={() => navigate(`/metodo/ayurveda/dosha/${d}`)}
                  cursor="pointer"
                  position="relative"
                  overflow="hidden"
                  flex="1"
                  borderRadius="2xl"
                  border={destacada ? `2px solid ${cfg.color}` : `1px solid ${ayurvedaTxt}26`}
                  opacity={destacada ? 1 : 0.78}
                  boxShadow={destacada
                    ? `0 0 0 1px ${cfg.color}55, 0 0 22px ${cfg.color}88, 0 0 50px ${cfg.color}44, 0 8px 30px rgba(0,0,0,0.3)`
                    : "0 4px 18px rgba(0,0,0,0.22)"}
                  transition="all 0.25s ease"
                  _hover={{ transform: "translateY(-4px)", opacity: 1, boxShadow: destacada
                    ? `0 0 0 1px ${cfg.color}66, 0 0 28px ${cfg.color}aa, 0 0 60px ${cfg.color}55, 0 12px 36px rgba(0,0,0,0.34)`
                    : `0 0 18px ${cfg.color}55, 0 8px 26px rgba(0,0,0,0.28)` }}
                >
                  <DisciplinaBgLayer nom={ayurvedaNom} borderRadius="2xl" imageSrc={cfg.bgImg} overlay={`${ayurvedaBg}${destacada ? "1a" : "33"}`} />

                  {/* Badge de prioridad */}
                  {destacada && (
                    <Box
                      position="absolute"
                      top={3}
                      right={3}
                      zIndex={2}
                      px={3}
                      py={1}
                      borderRadius="full"
                      bg={cfg.color}
                      color="#fff"
                      fontSize={{ base: "2xs", md: "xs" }}
                      fontWeight="700"
                      letterSpacing="0.12em"
                      textTransform="uppercase"
                      boxShadow={`0 0 14px ${cfg.color}aa`}
                      style={{ textShadow: "0 1px 2px rgba(0,0,0,0.35)" }}
                    >
                      Predomina en ti
                    </Box>
                  )}

                  <Box position="relative" zIndex={1} px={{ base: 5, md: 5 }} py={{ base: 5, md: 6 }} textAlign="center">
                    <Flex
                      align="center"
                      justify="center"
                      w={{ base: "56px", md: "62px" }}
                      h={{ base: "56px", md: "62px" }}
                      mx="auto"
                      mb={3}
                      borderRadius="full"
                      bg={`${cfg.color}1f`}
                      border={`2px solid ${cfg.color}${destacada ? "" : "66"}`}
                      boxShadow={destacada ? `0 0 18px ${cfg.color}66` : "none"}
                    >
                      <Icon size="34px" color={cfg.color} />
                    </Flex>

                    <Text color={cfg.color} fontSize={{ base: "3xl", md: "4xl" }} fontWeight="700" fontStyle="italic" letterSpacing="0.08em" lineHeight="1">
                      {cfg.label}
                    </Text>
                    <Text color={`${ayurvedaTxt}aa`} fontSize={{ base: "sm", md: "md" }} fontWeight="600" letterSpacing="0.18em" textTransform="uppercase" mt={2}>
                      {cfg.elemento}
                    </Text>

                    <Box h="1px" w="60%" mx="auto" my={3} bgGradient={`linear(to-r, transparent, ${cfg.color}88, transparent)`} />

                    <Text color={ayurvedaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="600" lineHeight="1.5">
                      {cfg.esencia}
                    </Text>

                    <Text mt={4} color={cfg.color} fontSize={{ base: "md", md: "lg" }} fontWeight="700" letterSpacing="0.05em">
                      Descubrir {cfg.label} →
                    </Text>
                  </Box>
                </Box>
                </RevealItem>
              );
            })}
          </RevealStagger>
        </Flex>
      </Box>

      {ilustracionesModal}

      <BotonCompania color={ayurvedaTxt} bgColor={ayurvedaBg} disciplinaNom={ayurvedaNom} precio={20} llamadaTitulo="Reserva tu llamada" />

      <SiteFooter />
    </Box>
  );
}
