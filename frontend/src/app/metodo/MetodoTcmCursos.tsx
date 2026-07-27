import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { TcmLoading, TcmLoader } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { useIlustracionesTcm } from "../../components/metodo/IlustracionesTcm";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceTcm } from "../../components/metodo/IndiceTcm";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { CursoCardDetalle } from "../../components/aprendizaje/CursoCardDetalle";
import { CursosGrid } from "../../components/aprendizaje/CursosGrid";
import { Reveal } from "../../components/global/Reveal";
import { useCursosData } from "../../data/cursosApi";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import {
  API_URL, tcmBg, tcmNom, tcmNomLink, tcmTxt, TCMIcon,
} from "../../GlobalVariables";

// Candado blanco con brillo (mismo que el resto de botones de disciplina bloqueada).
const Candado = ({ size }: { size: any }) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
       w={size} h={size} fill={tcmTxt}
       style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.55)) drop-shadow(0 1px 3px rgba(0,0,0,0.6))" }}>
    <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm0-80h480v-400H240v400Zm240-120q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z" />
  </Box>
);

export default function MetodoTcmCursos() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  // ¿Ha pagado ya la Fisiología? (5ª disciplina, el siguiente paso tras TCM).
  const [fisioSuscrito, setFisioSuscrito] = useState(false);
  const { cursosData, loading: cursosLoading } = useCursosData();
  const { extra: ilustracionesBtn, modal: ilustracionesModal } = useIlustracionesTcm();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }

    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.tcm_suscrito) { navigate("/metodo/tcm"); return; }
        setFisioSuscrito(!!me.data?.fisiologia_suscrito);
      } catch {
        navigate("/metodo/tcm");
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const cursos = [...(cursosData[tcmNomLink]?.cursos ?? [])].sort(
    (a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
  );
  // No mostramos las tarjetas hasta que las portadas estén descargadas.
  const fotosListas = usePrecargarImagenes(cursos.map((c) => c.foto));

  if (loading) {
    return <TcmLoading />;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 5, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="1280px" gap={6}>
          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
          <MetodoStepHeader
            icon={<TCMIcon size={{ base: "40px", md: "56px" }} />}
            title="Cursos de Medicina China"
            pageLabel="7/7"
            compact
            bgColor={`${tcmBg}dd`}
            color={tcmTxt}
            nom={tcmNom}
            mb={0}
            prev={{ label: "← Lee tu lengua", onClick: () => navigate("/metodo/tcm/lengua/leer") }}
            extra={ilustracionesBtn}
            next={fisioSuscrito
              ? { label: "Fisiología →", onClick: () => navigate("/metodo/fisiologia") }
              : { label: "Fisiología →", icon: <Candado size="15px" />, onClick: () => navigate("/metodo/fisiologia") }}
          />
          </Reveal>

          <Reveal direction="up" distance={20} delay={0.12} duration={0.65} w="100%" display="flex" justifyContent="center">
          <Text
            color="white"
            fontSize={{ base: "md", md: "lg" }}
            fontStyle="italic"
            textAlign="center"
            lineHeight="1.8"
            maxW="680px"
          >
            Si quieres profundizar en la Medicina China, estos cursos te acompañan paso a paso.
          </Text>
          </Reveal>

          <Reveal inView direction="up" distance={22} duration={0.6} amount={0.15} w="100%">
          {cursosLoading || !fotosListas ? (
            <Flex direction="column" align="center" justify="center" gap={4} w="100%" minH={{ base: "260px", md: "340px" }}>
              <TcmLoader color="#ffffff" />
            </Flex>
          ) : cursos.length > 0 ? (
            cursos.length === 1 ? (
              <Flex
                w="100%"
                justify="center"
                sx={{ "@keyframes cursoCardIn": { from: { opacity: 0, transform: "translateY(40px) scale(0.95)" }, to: { opacity: 1, transform: "translateY(0) scale(1)" } } }}
              >
                <Box w="100%" maxW="520px" style={{ opacity: 0, animation: "cursoCardIn 0.55s cubic-bezier(0.22,1,0.36,1) 0s forwards" }}>
                  <CursoCardDetalle curso={cursos[0]} bgColor={tcmBg} color={tcmTxt} nom={tcmNom} />
                </Box>
              </Flex>
            ) : (
              <CursosGrid
                items={cursos.map((curso) => ({
                  curso,
                  color: tcmTxt,
                  bgColor: tcmBg,
                  nom: tcmNom,
                }))}
              />
            )
          ) : (
            <Box
              position="relative"
              w="100%"
              borderRadius="2xl"
              overflow="hidden"
              boxShadow={`0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${tcmTxt}1a, 0 0 48px ${tcmTxt}10`}
            >
              <DisciplinaBgLayer nom={tcmNom} borderRadius="2xl" overlay={`${tcmBg}22`} />
              <Box position="relative" zIndex={1} px={{ base: 6, md: 10 }} py={{ base: 7, md: 9 }} textAlign="center">
                <Text color={`${tcmTxt}cc`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" lineHeight="1.8">
                  Pronto encontrarás aquí los cursos de Medicina China.
                </Text>
              </Box>
            </Box>
          )}
          </Reveal>
        </Flex>
      </Flex>

      {ilustracionesModal}

      <IndiceTcm />

      <BotonCompania color={tcmTxt} bgColor={tcmBg} disciplinaNom={tcmNom} />

      <SiteFooter />
    </Box>
  );
}
