import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, SimpleGrid, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceNutricion } from "../../components/metodo/IndiceNutricion";
import { Reveal } from "../../components/global/Reveal";
import { API_URL, nutricionBg, nutricionNom, nutricionTxt, NutricionIcon } from "../../GlobalVariables";

// ═════════════════════════════════════════════════════════════════════════
// Apartado «El hambre» del recorrido de Nutrición. Va ENTRE la Microbiota y el
// plato de Harvard (se llega desde Microbiota → cómic de transición → aquí).
// Contendrá varios TESTS y EXPLICACIONES sobre el hambre (grelina/leptina,
// hambre física vs. emocional, saciedad…). Aún sin diseñar: de momento se dejan
// boxes MEDIO PREPARADOS (placeholders con su título y un breve texto) para ir
// rellenándolos. Cuando cada uno tenga contenido, se le añade su `onClick`
// (abrir su test/ficha) y se le quita el estado «en preparación».
// ═════════════════════════════════════════════════════════════════════════

// Un bloque de contenido (explicación o test) del apartado. Mientras `listo`
// sea false, se pinta como «en preparación» (sobrio, no pulsable).
type Bloque = {
  key: string;
  eyebrow: string;      // «Explicación» / «Test»
  titulo: string;
  resumen: string;
  listo?: boolean;      // cuando esté hecho: true + onClick
};

// ── EXPLICACIONES (placeholders; la usuaria dará el texto/ilustraciones) ──
const EXPLICACIONES: Bloque[] = [
  { key: "que-es",   eyebrow: "Explicación", titulo: "¿Qué es el hambre?",              resumen: "La señal que nace en el cerebro para pedirte energía." },
  { key: "hormonas", eyebrow: "Explicación", titulo: "Grelina y leptina",              resumen: "Las hormonas que encienden y apagan el hambre." },
  { key: "fisica-emocional", eyebrow: "Explicación", titulo: "Hambre física vs. emocional", resumen: "Aprende a distinguir de dónde viene lo que sientes." },
  { key: "saciedad", eyebrow: "Explicación", titulo: "La saciedad",                    resumen: "Por qué a veces cuesta notar que ya has comido suficiente." },
];

// ── TESTS (placeholders interactivos; se diseñarán más adelante) ──
const TESTS: Bloque[] = [
  { key: "tipo-hambre", eyebrow: "Test", titulo: "¿Qué tipo de hambre tienes?", resumen: "Un test breve para reconocer tu patrón." },
  { key: "senales",     eyebrow: "Test", titulo: "Escucha tus señales",         resumen: "Identifica cuándo tu cuerpo pide comida de verdad." },
];

// Caja medio preparada (placeholder). Sobria mientras no esté lista.
function BloqueBox({ bloque }: { bloque: Bloque }) {
  const listo = !!bloque.listo;
  return (
    <Box
      position="relative"
      borderRadius="2xl"
      overflow="hidden"
      px={{ base: 5, md: 6 }}
      py={{ base: 5, md: 6 }}
      minH={{ base: "140px", md: "160px" }}
      display="flex"
      flexDirection="column"
      gap={2}
      bg={`${nutricionBg}${listo ? "66" : "40"}`}
      border={`1px solid ${nutricionTxt}${listo ? "77" : "33"}`}
      opacity={listo ? 1 : 0.85}
      cursor={listo ? "pointer" : "default"}
      style={{ boxShadow: `inset 0 0 24px rgba(0,0,0,0.18), 0 0 16px ${nutricionTxt}14` }}
      transition="all 0.2s ease"
      _hover={listo ? { transform: "translateY(-4px)", borderColor: nutricionTxt } : undefined}
    >
      <Text color={nutricionTxt} fontSize="2xs" fontWeight={700} letterSpacing="0.16em" textTransform="uppercase"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>
        {bloque.eyebrow}
      </Text>
      <Text color="white" fontSize={{ base: "lg", md: "xl" }} fontWeight={700} lineHeight="1.25"
            style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}>
        {bloque.titulo}
      </Text>
      <Text color="rgba(255,255,255,0.85)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic" lineHeight="1.6"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
        {bloque.resumen}
      </Text>

      <Box flex="1" />

      {/* Estado: «en preparación» mientras no esté listo. */}
      {!listo && (
        <Text color={`${nutricionTxt}aa`} fontSize="2xs" fontWeight={700} letterSpacing="0.12em"
              textTransform="uppercase">
          En preparación
        </Text>
      )}
    </Box>
  );
}

export default function MetodoNutricionHambre() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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
        if (!me.data?.nutricion_suscrito && !testEnabled) { navigate("/metodo/nutricion"); return; }
      } catch { navigate("/metodo/nutricion"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  if (loading) return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1000px" gap={6}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NutricionIcon size={{ base: "40px", md: "56px" }} />}
              title="El hambre"
              compact
              maxW="1000px"
              bgColor={`${nutricionBg}dd`}
              color={nutricionTxt}
              nom={nutricionNom}
              mb={0}
              prev={{ label: "← Microbiota", onClick: () => navigate("/metodo/nutricion/microbiota") }}
              extra={{ label: "Biblioteca", onClick: () => navigate("/metodo/nutricion/alimentos") }}
              next={{ label: "Crea tu plato →", onClick: () => navigate("/metodo/nutricion/plato") }}
            />
          </Reveal>

          <Reveal direction="up" distance={18} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="640px" style={{ textShadow: "0 1px 10px rgba(0,0,0,0.35)" }}>
              Antes de aprender a llenar el plato, entiende de dónde viene el hambre: qué la enciende,
              qué la calma y cómo escucharla.
            </Text>
          </Reveal>

          {/* ── ENTIENDE TU HAMBRE (explicaciones) ── */}
          <Reveal direction="up" distance={16} delay={0.14} duration={0.6} w="100%">
            <Text color={nutricionTxt} fontSize={{ base: "xs", md: "sm" }} fontWeight={700}
                  letterSpacing="0.14em" textTransform="uppercase" textAlign="center" mb={4}
                  style={{ textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}>
              Entiende tu hambre
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }} w="100%">
              {EXPLICACIONES.map((b) => (
                <BloqueBox key={b.key} bloque={b} />
              ))}
            </SimpleGrid>
          </Reveal>

          {/* ── PONTE A PRUEBA (tests) ── */}
          <Reveal direction="up" distance={16} delay={0.18} duration={0.6} w="100%">
            <Text color={nutricionTxt} fontSize={{ base: "xs", md: "sm" }} fontWeight={700}
                  letterSpacing="0.14em" textTransform="uppercase" textAlign="center" mb={4} mt={{ base: 2, md: 4 }}
                  style={{ textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}>
              Ponte a prueba
            </Text>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }} w="100%">
              {TESTS.map((b) => (
                <BloqueBox key={b.key} bloque={b} />
              ))}
            </SimpleGrid>
          </Reveal>

        </Flex>
      </Flex>

      <IndiceNutricion />
      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />
      <SiteFooter />
    </Box>
  );
}
