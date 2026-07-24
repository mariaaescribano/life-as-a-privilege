import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import { motion, useReducedMotion } from "framer-motion";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { AyurvedaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { Reveal } from "../../components/global/Reveal";
import { useIlustracionesAyurveda } from "../../components/metodo/IlustracionesAyurveda";
import { ComicPasoModal } from "../../components/metodo/ComicPasoModal";
import { VINETAS_DOSHAS } from "../../components/metodo/HinduismoIlustracionesModal";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { BotonCompania } from "../../components/global/BotonCompania";
import {
  API_URL,
  AyurvedaIcon, ayurvedaBg, ayurvedaNom, ayurvedaTxt,
  VataIcon, PittaIcon, KaphaIcon,
  vataColor, pittaColor, kaphaColor,
} from "../../GlobalVariables";
import { preguntasAyurveda } from "../../hardCoded/espacio/PreguntasAyurveda";

type Dosha = "vata" | "pitta" | "kapha";
const GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${ayurvedaTxt}1a, 0 0 48px ${ayurvedaTxt}10`;

const MotionBox = motion(Box) as any;
const EASE = [0.22, 1, 0.36, 1] as const;
const POP = [0.34, 1.56, 0.64, 1] as const; // rebote suave para el "pop" del título

// Coreografía del resultado: las barras se pintan una a una y, al terminar,
// aparece el título del dosha principal con un pequeño rebote.
const BARS_START = 0.35;  // arranque del pintado tras montar la tarjeta
const BAR_STAGGER = 0.62; // separación entre una barra y la siguiente
const BAR_DUR = 0.85;     // lo que tarda cada barra en rellenarse

// Cuenta ascendente de un número (0 → target) sincronizada con el relleno de la
// barra. Respeta prefers-reduced-motion (salta directo al valor).
function useCountUp(target: number, delay: number, duration: number, enabled: boolean): number {
  const [val, setVal] = useState(enabled ? 0 : target);
  useEffect(() => {
    if (!enabled) { setVal(target); return; }
    setVal(0);
    let raf = 0;
    let startTs = 0;
    const tick = (ts: number) => {
      if (!startTs) startTs = ts;
      const t = Math.min(1, (ts - startTs) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setVal(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    const timer = setTimeout(() => { raf = requestAnimationFrame(tick); }, delay * 1000);
    return () => { clearTimeout(timer); if (raf) cancelAnimationFrame(raf); };
  }, [target, delay, duration, enabled]);
  return val;
}

function CountUp({ value, delay, duration, enabled }: { value: number; delay: number; duration: number; enabled: boolean }) {
  const v = useCountUp(value, delay, duration, enabled);
  return <>{v}</>;
}

const DOSHA_CONFIG: Record<Dosha, { label: string; color: string; Icon: any }> = {
  vata:  { label: "Vata",  color: vataColor,  Icon: VataIcon },
  pitta: { label: "Pitta", color: pittaColor, Icon: PittaIcon },
  kapha: { label: "Kapha", color: kaphaColor, Icon: KaphaIcon },
};
const DOSHAS: Dosha[] = ["vata", "pitta", "kapha"];

interface Resultado {
  dosha: Dosha;
  vata_score: number;
  pitta_score: number;
  kapha_score: number;
  fecha: string;
}

export default function MetodoAyurvedaResultado() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  // Cómic de los doshas: se intercala después del resultado, antes de «Energías».
  const [comicDoshasOpen, setComicDoshasOpen] = useState(false);
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesAyurveda();
  const reduce = useReducedMotion();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!me.data?.ayurveda_suscrito) { navigate("/metodo/ayurveda"); return; }

        // Lee el resultado del test ya guardado. Si aún no hizo el test, al test.
        const res = await axios.get(`${API_URL}/ayurveda/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.data) { navigate("/metodo/ayurveda/test"); return; }
        setResultado(res.data as Resultado);
      } catch {
        navigate("/metodo/ayurveda/test");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading || !resultado) {
    return <AyurvedaLoading />;
  }

  const total = preguntasAyurveda.length;
  const scores: Record<Dosha, number> = {
    vata: resultado.vata_score,
    pitta: resultado.pitta_score,
    kapha: resultado.kapha_score,
  };
  const cfg = DOSHA_CONFIG[resultado.dosha];
  const PrincipalIcon = cfg.Icon;

  // El título entra justo después de que la última barra termine de rellenarse.
  const titleDelay = BARS_START + (DOSHAS.length - 1) * BAR_STAGGER + BAR_DUR + 0.25;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box flex="1">
        <Flex
          direction="column"
          alignItems="center"
          gap={{ base: 4, md: 5 }}
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 8, md: 12 }}
          pb={{ base: 14, md: 20 }}
        >
          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<AyurvedaIcon size={{ base: "40px", md: "56px" }} />}
            title="Resultado"
            pageLabel="3/4"
            bgColor={`${ayurvedaBg}dd`}
            color={ayurvedaTxt}
            nom={ayurvedaNom}
            mb={0}
            prev={{ label: "← Test", onClick: () => navigate("/metodo/ayurveda/test") }}
            extra={ilustracionesBtn}
            // Después del resultado, antes de «Energías», intercalamos el cómic de los doshas.
            next={{ label: "Energías →", onClick: () => setComicDoshasOpen(true) }}
          />
          </Reveal>

          {/* Resultado principal — solo el resultado, sin consejos (entra al montar) */}
          <Reveal direction="up" distance={26} scaleFrom={0.98} delay={0.12} duration={0.7} w="100%" display="flex" justifyContent="center">
          <Box
            position="relative"
            overflow="hidden"
            w="100%" maxW="1063px"
            borderRadius="2xl"
            boxShadow={GLOW}
            textAlign="center"
            mt={{ base: 2, md: 4 }}
            transform="scale(0.8)"
            transformOrigin="top center"
          >
            <DisciplinaBgLayer nom={ayurvedaNom} borderRadius="2xl" overlay={`${ayurvedaBg}22`} />
            <Box position="relative" zIndex={1} px={{ base: 5, md: 8 }} py={{ base: 6, md: 8 }}>
              {/* Barras de puntuación — se pintan y rellenan una a una */}
              {DOSHAS.map((d, i) => {
                const pct = total > 0 ? Math.round((scores[d] / total) * 100) : 0;
                const dc = DOSHA_CONFIG[d];
                const start = BARS_START + i * BAR_STAGGER;
                return (
                  <MotionBox
                    key={d}
                    mb={{ base: 3.5, md: 4 }}
                    textAlign="left"
                    initial={reduce ? false : { opacity: 0, y: 14 }}
                    animate={reduce ? {} : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: start, ease: EASE }}
                  >
                    <Flex justify="space-between" mb={1.5}>
                      <Text color={dc.color} fontWeight="600" fontSize={{ base: "md", md: "lg" }} letterSpacing="0.04em">
                        {dc.label}
                      </Text>
                      <Text color={dc.color} fontWeight="600" fontSize={{ base: "md", md: "lg" }}>
                        <CountUp value={scores[d]} delay={start} duration={BAR_DUR} enabled={!reduce} /> / {total}
                      </Text>
                    </Flex>
                    <Box bg={`${dc.color}22`} borderRadius="full" h="10px" overflow="hidden">
                      <MotionBox
                        bg={dc.color}
                        h="100%"
                        borderRadius="full"
                        boxShadow={`0 0 12px ${dc.color}bb, 0 0 22px ${dc.color}55`}
                        initial={reduce ? false : { width: "0%" }}
                        animate={{ width: `${pct}%` }}
                        transition={reduce ? { duration: 0 } : { duration: BAR_DUR, delay: start, ease: EASE }}
                      />
                    </Box>
                  </MotionBox>
                );
              })}

              {/* Título del dosha principal — aparece al terminar de pintarse las barras */}
              <MotionBox
                mt={{ base: 8, md: 9 }}
                initial={reduce ? false : { opacity: 0, scale: 0.82, y: 12 }}
                animate={reduce ? {} : { opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: titleDelay, ease: POP }}
              >
                <Text color={ayurvedaTxt} fontSize={{ base: "lg", md: "xl" }} fontWeight="700" letterSpacing="0.15em" textTransform="uppercase" mb={4}>
                  Tu Doṣha principal es
                </Text>
                <MotionBox
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  gap={3}
                  initial={reduce ? false : { opacity: 0, scale: 0.7 }}
                  animate={reduce ? {} : { opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: titleDelay + 0.18, ease: POP }}
                  style={{ filter: `drop-shadow(0 0 18px ${cfg.color}88)` }}
                >
                  <PrincipalIcon size="42px" color={cfg.color} />
                  <Text color={cfg.color} fontSize={{ base: "4xl", md: "5xl" }} fontWeight="700" letterSpacing="0.1em" fontStyle="italic">
                    {cfg.label}
                  </Text>
                </MotionBox>
              </MotionBox>
            </Box>
          </Box>
          </Reveal>

          {/* Nota breve, sin consejos todavía */}
          <Reveal direction="up" distance={22} duration={0.6} amount={0.15} w="100%" display="flex" justifyContent="center">
          <Text
            color="rgba(255,255,255,0.75)"
            fontSize={{ base: "sm", md: "md" }}
            fontStyle="italic"
            textAlign="center"
            maxW="620px"
            lineHeight="1.7"
            mt={1}
          >
            Esta es tu constitución según el test. En los siguientes pasos del Mapa iremos descubriendo qué significa para ti.
          </Text>
          </Reveal>
        </Flex>
      </Box>

      {ilustracionesModal}

      {/* Cómic de los doshas: intercalado después del resultado, antes de «Energías». */}
      <ComicPasoModal
        isOpen={comicDoshasOpen}
        onClose={() => setComicDoshasOpen(false)}
        onContinue={() => navigate("/metodo/ayurveda/tarjetas")}
        vinetas={VINETAS_DOSHAS}
        continueLabel="Doṣhas"
        themeColor={ayurvedaTxt}
        continueBtnColor={ayurvedaTxt}
        continueBtnBg={ayurvedaBg}
        disciplinaBgImage="/img/fondos/hinduismo.png"
        disciplinaBgColor={ayurvedaBg}
        textShadow={`0 0 6px ${ayurvedaBg}, 0 0 14px ${ayurvedaBg}, 0 0 26px ${ayurvedaBg}cc`}
      />

      <BotonCompania color={ayurvedaTxt} bgColor={ayurvedaBg} disciplinaNom={ayurvedaNom} precio={20} llamadaTitulo="Reserva tu llamada" />

      <SiteFooter />
    </Box>
  );
}
