import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { BotonCompania } from "../../components/global/BotonCompania";
import { useT } from "../../i18n";
import { FisiologiaLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { useTusCelulas } from "../../components/metodo/TusCelulasModal";
import { Reveal } from "../../components/global/Reveal";
import { CursoCardDetalle } from "../../components/aprendizaje/CursoCardDetalle";
import { CursosGrid } from "../../components/aprendizaje/CursosGrid";
import { useCursosData } from "../../data/cursosApi";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import {
  API_URL,
  fisiologiaBg,
  fisiologiaNom,
  fisiologiaTxt,
  FisiologiaIcon,
  noSelectSx,
} from "../../GlobalVariables";

// ── Cursos para profundizar (Fisiología) ────────────────────────────────────
// Página-hub que va DESPUÉS de La sonrisa interior. Su «siguiente» arranca la
// 6ª disciplina: Nutrición.
//
// Los cursos NO se escriben aquí: salen del CATÁLOGO (tabla `curso`, vía
// useCursosData, modalidad «Fisiología»), igual que en el resto de disciplinas.
// Antes había un array local vacío y por eso la página seguía enseñando «estoy
// preparando los cursos» aunque el catálogo ya tuviera los suyos. Al publicar
// uno nuevo aparece solo, sin tocar este archivo.

// SVG candado (mismo que usa la caja de disciplina bloqueada).
const Candado = ({ size }: { size: any }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
       w={size} h={size} fill={fisiologiaTxt}
       style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.55)) drop-shadow(0 1px 3px rgba(0,0,0,0.6))" }}>
    <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z" />
  </Box>
);

// ═════════════════════════════════════════════════════════════════════════
export default function MetodoFisiologiaCursos() {
  const t = useT();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // ¿Ha pagado ya la Nutrición? (6ª disciplina, el siguiente paso tras Fisiología).
  const [nutriSuscrito, setNutriSuscrito] = useState(false);
  const { extra: celulasBtn, modal: celulasModal } = useTusCelulas();
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
        if (!me.data?.fisiologia_suscrito) { navigate("/metodo/fisiologia"); return; }
        setNutriSuscrito(!!me.data?.nutricion_suscrito);
      } catch {
        navigate("/metodo/fisiologia");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  // Los cursos de Fisiología del catálogo, en orden de publicación: esta página
  // acompaña «paso a paso», igual que en Cábala.
  const cursos = [...(cursosData[fisiologiaNom]?.cursos ?? [])].sort(
    (a, b) => (a.createdAt ?? "").localeCompare(b.createdAt ?? ""),
  );
  // No se enseña la página hasta tener las portadas: si no, las tarjetas se
  // rellenan a trozos.
  const fotosListas = usePrecargarImagenes(cursos.map((c) => c.foto));

  if (loading || cursosLoading || !fotosListas) {
    return <FisiologiaLoading />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif" sx={noSelectSx}>
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1280px" gap={7}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<FisiologiaIcon size={{ base: "40px", md: "56px" }} />}
              title={t("fisiologia.cursos.titulo")}
              compact
              bgColor={`${fisiologiaBg}dd`}
              color={fisiologiaTxt}
              nom={fisiologiaNom}
              mb={0}
              prev={{ label: `← ${t("fisiologia.sonrisa.titulo")}`, onClick: () => navigate("/metodo/fisiologia/sonrisa") }}
              extra={celulasBtn}
              next={nutriSuscrito
                ? { label: `${t("disciplina.nutricion")} →`, onClick: () => navigate("/metodo/nutricion") }
                : { label: t("disciplina.nutricion"), icon: <Candado size="15px" />, arrow: "next", onClick: () => navigate("/metodo/nutricion") }}
            />
          </Reveal>

          {/* Texto introductorio bajo el header */}
          <Reveal direction="up" distance={20} delay={0.12} duration={0.65} w="100%" display="flex" justifyContent="center">
            <Text color="white" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="680px">
              {t("fisiologia.cursos.intro")}
            </Text>
          </Reveal>

          {/* El catálogo manda: con un solo curso, su tarjeta centrada (no una
              rejilla con dos huecos vacíos); con varios, la rejilla común. */}
          {cursos.length > 0 ? (
            cursos.length === 1 ? (
              <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
                <Flex w="100%" justify="center">
                  <Box w="100%" maxW="520px">
                    <CursoCardDetalle curso={cursos[0]} bgColor={fisiologiaBg} color={fisiologiaTxt} nom={fisiologiaNom} />
                  </Box>
                </Flex>
              </Reveal>
            ) : (
              <CursosGrid
                items={cursos.map((curso) => ({ curso, color: fisiologiaTxt, bgColor: fisiologiaBg, nom: fisiologiaNom }))}
              />
            )
          ) : (
            /* ── Aún no hay cursos: estado vacío elegante ── */
            <Reveal direction="up" distance={16} delay={0.2} duration={0.6} w="100%" display="flex" justifyContent="center">
              <Flex direction="column" align="center" gap={3} maxW="560px" textAlign="center"
                    position="relative" w="100%" borderRadius="2xl" overflow="hidden"
                    border={`1px dashed ${fisiologiaTxt}44`} px={{ base: 6, md: 10 }} py={{ base: 12, md: 14 }}>
                <DisciplinaBgLayer nom={fisiologiaNom} borderRadius="2xl" overlay={`${fisiologiaBg}88`} />
                <Text position="relative" zIndex={1} fontSize="4xl">🎓</Text>
                <Text position="relative" zIndex={1} color={fisiologiaTxt} fontWeight={700} fontSize={{ base: "lg", md: "xl" }}
                      style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}>
                  {t("metodo.cursosPreparando")}
                </Text>
                <Text position="relative" zIndex={1} color={fisiologiaTxt} fontSize={{ base: "sm", md: "md" }}
                      fontStyle="italic" lineHeight="1.7" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
                  {t("fisiologia.cursos.pronto")}
                </Text>
              </Flex>
            </Reveal>
          )}

        </Flex>
      </Flex>

      {celulasModal}
      <BotonCompania color={fisiologiaTxt} bgColor={fisiologiaBg} disciplinaNom={fisiologiaNom} />
      <SiteFooter />
    </Box>
  );
}
