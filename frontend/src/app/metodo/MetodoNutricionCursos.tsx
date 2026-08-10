import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { BotonCompania } from "../../components/global/BotonCompania";
import { NutricionLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { IndiceNutricion } from "../../components/metodo/IndiceNutricion";
import { Reveal, Float } from "../../components/global/Reveal";
import { CursoCardDetalle } from "../../components/aprendizaje/CursoCardDetalle";
import { CursosGrid } from "../../components/aprendizaje/CursosGrid";
import { AppleLoader } from "../../components/metodo/AppleLoader";
import { useCursosData } from "../../data/cursosApi";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import {
  API_URL,
  nutricionBg,
  nutricionNom,
  nutricionNomLink,
  nutricionTxt,
  NutricionIcon,
  noSelectSx,
} from "../../GlobalVariables";

// ── Cursos para profundizar (Nutrición) ─────────────────────────────────────
// Página-hub que va DESPUÉS de «¿De dónde vienen los nutrientes?». Su
// «siguiente» arranca la 7ª disciplina: Cábala.
//
// Los cursos NO se escriben aquí: salen del CATÁLOGO (tabla `curso`, vía
// useCursosData), igual que en el resto de disciplinas. Antes había un array
// local vacío y por eso la página enseñaba «estoy preparando los cursos»
// mientras el curso de Nutrición ya existía en el catálogo. Al publicar uno
// nuevo aparece solo, sin tocar este archivo.

// SVG candado (mismo que usa la caja de disciplina bloqueada).
const Candado = ({ size }: { size: any }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
       w={size} h={size} fill={nutricionTxt}
       style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.55)) drop-shadow(0 1px 3px rgba(0,0,0,0.6))" }}>
    <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z" />
  </Box>
);

// ═════════════════════════════════════════════════════════════════════════
export default function MetodoNutricionCursos() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // ¿Ha pagado ya la Cábala? (7ª disciplina, el siguiente paso tras Nutrición).
  const [cabalaSuscrito, setCabalaSuscrito] = useState(false);
  const { cursosData, loading: cursosLoading } = useCursosData();

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
        if (!me.data?.nutricion_suscrito) { navigate("/metodo/nutricion"); return; }
        setCabalaSuscrito(!!me.data?.cabala_suscrito);
      } catch {
        navigate("/metodo/nutricion");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  // Los cursos publicados de Nutrición, el más nuevo primero.
  const cursos = [...(cursosData[nutricionNomLink]?.cursos ?? [])].sort(
    (a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
  );
  // No se pintan las tarjetas hasta tener sus portadas: si no, aparecen a trozos.
  const fotosListas = usePrecargarImagenes(cursos.map((c) => c.foto));

  if (loading) {
    return <NutricionLoading />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif" sx={noSelectSx}>
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1100px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<Float amplitude={5} duration={5}><NutricionIcon size={{ base: "40px", md: "56px" }} /></Float>}
              title="Cursos de Nutrición"
              compact
              bgColor={`${nutricionBg}dd`}
              color={nutricionTxt}
              nom={nutricionNom}
              mb={0}
              prev={{ label: "← ¿De dónde vienen?", onClick: () => navigate("/metodo/nutricion/origen") }}
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

          {/* El catálogo manda. Mientras carga, la animación de Nutrición; con un
              solo curso, su tarjeta centrada (no una rejilla de tres huecos con
              dos vacíos); con varios, la rejilla común. */}
          <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
          {cursosLoading || !fotosListas ? (
            <Flex direction="column" align="center" justify="center" gap={4} w="100%"
                  minH={{ base: "260px", md: "340px" }}>
              <AppleLoader />
            </Flex>
          ) : cursos.length === 1 ? (
            <Flex w="100%" justify="center">
              <Box w="100%" maxW="520px">
                <CursoCardDetalle curso={cursos[0]} bgColor={nutricionBg} color={nutricionTxt} nom={nutricionNom} />
              </Box>
            </Flex>
          ) : cursos.length > 1 ? (
            <CursosGrid
              items={cursos.map((curso) => ({ curso, color: nutricionTxt, bgColor: nutricionBg, nom: nutricionNom }))}
            />
          ) : (
            /* ── Aún no hay cursos: estado vacío elegante ── */
            <Reveal inView direction="up" distance={16} delay={0.2} duration={0.6} w="100%" display="flex" justifyContent="center">
              <Flex direction="column" align="center" gap={3} maxW="560px" textAlign="center"
                    position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                    border={`1px dashed ${nutricionTxt}44`} px={{ base: 6, md: 10 }} py={{ base: 12, md: 14 }}>
                <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" overlay="rgba(0,0,0,0.5)" />
                <Text position="relative" zIndex={1} fontSize="4xl">🎓</Text>
                <Text position="relative" zIndex={1} color="white" fontWeight={700} fontSize={{ base: "lg", md: "xl" }}
                      style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}>
                  Estoy preparando los cursos
                </Text>
                <Text position="relative" zIndex={1} color="rgba(255,255,255,0.85)" fontSize={{ base: "sm", md: "md" }}
                      fontStyle="italic" lineHeight="1.7" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                  Pronto podrás profundizar aquí con cursos avanzados de Nutrición. Mientras tanto, continúa el
                  Mapa con la siguiente disciplina.
                </Text>
              </Flex>
            </Reveal>
          )}
          </Reveal>

        </Flex>
      </Flex>

      <IndiceNutricion />
      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />
      <SiteFooter />
    </Box>
  );
}
