import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Image, SimpleGrid, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { BotonCompania } from "../../components/global/BotonCompania";
import { recordarOrigenCurso } from "../../components/global/VolverAlMapa";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { IndiceNutricion } from "../../components/metodo/IndiceNutricion";
import { Reveal } from "../../components/global/Reveal";
import {
  API_URL,
  nutricionBg,
  nutricionNom,
  nutricionTxt,
  NutricionIcon,
  noSelectSx,
} from "../../GlobalVariables";

// ── Cursos para profundizar (Nutrición) ─────────────────────────────────────
// Página-hub que va DESPUÉS de «Preguntas y mitos». Aquí se listarán los cursos
// avanzados de Nutrición. De momento no hay ninguno: se deja el enrutado y el
// diseño listos; basta con ir añadiendo objetos a CURSOS y el resto funciona solo.
// Su «siguiente» arranca la 7ª disciplina: Cábala.
interface Curso {
  key: string;
  titulo: string;
  resumen: string;
  foto?: string;
  ruta?: string;
  proximamente?: boolean;
}

// Aún no hay cursos de Nutrición. Al añadir objetos aquí, aparecerán solos.
const CURSOS: Curso[] = [];

// SVG candado (mismo que usa la caja de disciplina bloqueada).
const Candado = ({ size }: { size: any }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
       w={size} h={size} fill={nutricionTxt}
       style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.55)) drop-shadow(0 1px 3px rgba(0,0,0,0.6))" }}>
    <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z" />
  </Box>
);

// ── Tarjeta de un curso ──────────────────────────────────────────────────────
function CursoBox({ curso, onEnter }: { curso: Curso; onEnter: () => void }) {
  const [imgErr, setImgErr] = useState(false);
  const bloqueado = !!curso.proximamente || !curso.ruta;
  return (
    <Box
      as={bloqueado ? "div" : "button"}
      onClick={bloqueado ? undefined : onEnter}
      position="relative"
      w="100%"
      h="100%"
      borderRadius="2xl"
      overflow="hidden"
      cursor={bloqueado ? "default" : "pointer"}
      aria-disabled={bloqueado}
      opacity={bloqueado ? 0.78 : 1}
      boxShadow={bloqueado
        ? "inset 0 0 24px rgba(0,0,0,0.35)"
        : `0 0 16px ${nutricionTxt}22, 0 0 40px ${nutricionTxt}14, inset 0 0 24px rgba(0,0,0,0.22)`}
      transition="all 0.25s ease"
      _hover={bloqueado ? undefined : {
        transform: "translateY(-6px)",
        boxShadow: `0 0 26px ${nutricionTxt}66, 0 0 64px ${nutricionTxt}33, inset 0 0 24px rgba(0,0,0,0.2)`,
      }}
      _active={bloqueado ? undefined : { transform: "translateY(-2px)" }}
    >
      <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl"
                         overlay={bloqueado ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.45)"} />

      <Flex position="relative" zIndex={1} direction="column" align="center" gap={{ base: 3, md: 4 }}
            p={{ base: 4, md: 5 }} h="100%">
        <Box w="100%" aspectRatio={1} borderRadius="xl" overflow="hidden" flexShrink={0}
             bg="rgba(255,255,255,0.14)" boxShadow="0 4px 16px rgba(0,0,0,0.28)"
             display="flex" alignItems="center" justifyContent="center">
          {curso.foto && !imgErr ? (
            <Image src={encodeURI(curso.foto)} alt={curso.titulo} w="100%" h="100%" objectFit="cover"
                   onError={() => setImgErr(true)} />
          ) : (
            <Text color="white" fontWeight="800" fontSize={{ base: "3xl", md: "4xl" }}
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>
              {curso.titulo.charAt(0)}
            </Text>
          )}
        </Box>
        <Text color="white" fontWeight={700} fontSize={{ base: "lg", md: "xl" }} textAlign="center"
              lineHeight="1.25" style={{ textShadow: "0 1px 6px rgba(0,0,0,0.7)" }}>
          {curso.titulo}
        </Text>
        <Text color="rgba(255,255,255,0.85)" fontSize={{ base: "xs", md: "sm" }} fontStyle="italic"
              textAlign="center" lineHeight="1.5" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.7)" }}>
          {curso.resumen}
        </Text>
        <Box flex="1" minH={{ base: 1, md: 2 }} />
        <Text color="rgba(255,255,255,0.9)" fontSize="2xs" fontWeight={700} letterSpacing="0.12em"
              textTransform="uppercase">
          {bloqueado ? "Próximamente" : "Entrar →"}
        </Text>
      </Flex>
    </Box>
  );
}

// ═════════════════════════════════════════════════════════════════════════
export default function MetodoNutricionCursos() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // ¿Ha pagado ya la Cábala? (7ª disciplina, el siguiente paso tras Nutrición).
  const [cabalaSuscrito, setCabalaSuscrito] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        let testEnabled = false;
        try {
          const t = await axios.get(`${API_URL}/payment/test/enabled`);
          testEnabled = !!t.data?.enabled;
        } catch { /* sin modo test */ }

        const me = await axios.get(`${API_URL}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!me.data?.nutricion_suscrito && !testEnabled) { navigate("/metodo/nutricion"); return; }
        setCabalaSuscrito(!!me.data?.cabala_suscrito);
      } catch {
        navigate("/metodo/nutricion");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  if (loading) {
    return <Box minH="100vh" bg="#008080"><SpinnerTurquesa /></Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif" sx={noSelectSx}>
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1100px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NutricionIcon size={{ base: "40px", md: "56px" }} />}
              title="Cursos de Nutrición"
              compact
              bgColor={`${nutricionBg}dd`}
              color={nutricionTxt}
              nom={nutricionNom}
              mb={0}
              prev={{ label: "← Preguntas y mitos", onClick: () => navigate("/metodo/nutricion/mitos") }}
              extra={{ label: "Biblioteca", onClick: () => navigate("/metodo/nutricion/alimentos") }}
              next={cabalaSuscrito
                ? { label: "Cábala →", onClick: () => navigate("/metodo/cabala") }
                : { label: "Cábala →", icon: <Candado size="15px" />, onClick: () => navigate("/metodo/cabala") }}
            />
          </Reveal>

          {/* Texto introductorio bajo el header */}
          <Reveal direction="up" distance={20} delay={0.12} duration={0.65} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.9)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="680px">
              Si quieres profundizar en la Nutrición, estos cursos te acompañan paso a paso.
            </Text>
          </Reveal>

          {CURSOS.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 4, md: 6 }} w="100%">
              {CURSOS.map((c, i) => (
                <Reveal key={c.key} direction="up" distance={20} delay={0.06 * i} duration={0.55} w="100%" display="flex">
                  <CursoBox curso={c} onEnter={() => { if (c.ruta) { recordarOrigenCurso(); navigate(c.ruta); } }} />
                </Reveal>
              ))}
            </SimpleGrid>
          ) : (
            /* ── Aún no hay cursos: estado vacío elegante ── */
            <Reveal direction="up" distance={16} delay={0.2} duration={0.6} w="100%" display="flex" justifyContent="center">
              <Flex direction="column" align="center" gap={3} maxW="560px" textAlign="center"
                    position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                    border={`1px dashed ${nutricionTxt}44`} px={{ base: 6, md: 10 }} py={{ base: 12, md: 14 }}>
                <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" overlay="rgba(0,0,0,0.5)" />
                <Text position="relative" zIndex={1} fontSize="4xl">🎓</Text>
                <Text position="relative" zIndex={1} color="white" fontWeight={700} fontSize={{ base: "lg", md: "xl" }}
                      style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}>
                  Estamos preparando los cursos
                </Text>
                <Text position="relative" zIndex={1} color="rgba(255,255,255,0.85)" fontSize={{ base: "sm", md: "md" }}
                      fontStyle="italic" lineHeight="1.7" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                  Pronto podrás profundizar aquí con cursos avanzados de Nutrición. Mientras tanto, continúa el
                  Mapa con la siguiente disciplina.
                </Text>
              </Flex>
            </Reveal>
          )}

        </Flex>
      </Flex>

      <IndiceNutricion />
      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />
      <SiteFooter />
    </Box>
  );
}
