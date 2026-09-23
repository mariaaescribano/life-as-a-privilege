import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Flex, Text, SimpleGrid } from "@chakra-ui/react";
import axios from "axios";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { NutricionLoading } from "../../components/metodo/comicLoaders";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { DisciplinaBgLayer } from "../../components/global/DisciplinaBgLayer";
import { BotonCompania } from "../../components/global/BotonCompania";
import { IndiceNutricion } from "../../components/metodo/IndiceNutricion";
import { Reveal, Float } from "../../components/global/Reveal";
import { NutricionIlustracionesModal } from "../../components/metodo/NutricionIlustracionesModal";
import { NutricionMaterialesModal } from "../../components/metodo/NutricionMaterialesModal";
import { NutrienteFichaModal } from "../../components/metodo/NutrienteFichaModal";
import { glowHeader } from "../../components/metodo/FotoBox";
import { useLeidos } from "../../hooks/useLeidos";
import { MITOS_LEIDOS_KEY } from "../../hardCoded/espacio/MitosNutricion";
import { useMitosNutricion } from "../../hardCoded/espacio/useMitosNutricion";
import { API_URL, nutricionBg, nutricionNom, nutricionTxt, NutricionIcon } from "../../GlobalVariables";
import { useT } from "../../i18n";

// ═════════════════════════════════════════════════════════════════════════
// BIBLIOTECA DE NUTRICIÓN. Es el hub que se abre desde el botón «Biblioteca» de
// cualquier página del recorrido. Un título y TRES caminos:
//   · ALIMENTACIÓN MOLECULAR → rejilla de alimentos (con foto); al pulsar uno,
//     su desglose molecular (NutricionMaterialesModal).
//   · ILUSTRACIONES          → galería con TODOS los cómics de Nutrición
//     (NutricionIlustracionesModal); al pulsar uno, su visor.
//   · RESPUESTAS             → los mitos, un box por mito, navegable con las
//     flechas (mismo visor de Ilustraciones, sobre MITOS_NUTRICION).
// ═════════════════════════════════════════════════════════════════════════

// Una de las tres cartas del hub: icono grande + título + «Ver →».
function BibliotecaCard({
  titulo, subtitulo, icono, onClick, delay,
}: {
  titulo: string;
  subtitulo: string;
  icono: React.ReactNode;
  onClick: () => void;
  delay: number;
}) {
  const t = useT();
  return (
    <Reveal direction="up" distance={22} delay={delay} duration={0.55} w="100%" display="flex">
      <Box
        as="button"
        onClick={onClick}
        role="group"
        position="relative"
        overflow="hidden"
        w="100%"
        h="100%"
        borderRadius="2xl"
        cursor="pointer"
        fontFamily="'EB Garamond', serif"
        boxShadow={glowHeader(nutricionTxt)}
        transition="transform 0.32s cubic-bezier(0.22,1,0.36,1), box-shadow 0.32s ease"
        _hover={{ transform: "translateY(-6px)",
                  boxShadow: `${glowHeader(nutricionTxt)}, 0 0 28px ${nutricionTxt}2e` }}
        _active={{ transform: "translateY(-2px) scale(0.985)" }}
      >
        {/* NutriImg de fondo, clara y nítida (sin velo ni difuminado). */}
        <DisciplinaBgLayer nom={nutricionNom} borderRadius="2xl" />

        <Flex position="relative" zIndex={1} direction="column" align="center" justify="center"
              gap={{ base: 3, md: 3.5 }} px={{ base: 6, md: 7 }} py={{ base: 8, md: 10 }} h="100%" textAlign="center">
          <Float amplitude={6} duration={4.5} delay={delay * 4} flexShrink={0}>
            <Flex align="center" justify="center"
                  w={{ base: "66px", md: "78px" }} h={{ base: "66px", md: "78px" }} borderRadius="full"
                  bg={`${nutricionTxt}14`} border={`1px solid ${nutricionTxt}33`} color={nutricionTxt}
                  boxShadow={`inset 0 0 12px ${nutricionTxt}12`}
                  transition="transform 0.35s cubic-bezier(0.22,1,0.36,1), background 0.3s ease"
                  _groupHover={{ transform: "scale(1.08)", bg: `${nutricionTxt}24` }}>
              {icono}
            </Flex>
          </Float>
          <Text color={nutricionTxt} fontWeight={800} fontSize={{ base: "md", md: "lg" }} lineHeight="1.2"
                letterSpacing="0.06em" textTransform="uppercase">
            {titulo}
          </Text>
          <Text color={`${nutricionTxt}cc`} fontSize={{ base: "xs", md: "sm" }} fontStyle="italic"
                lineHeight="1.45" maxW="240px">
            {subtitulo}
          </Text>
          <Flex align="center" gap={1} color={nutricionTxt} mt={0.5}
                fontSize="2xs" letterSpacing="0.16em" textTransform="uppercase">
            <Text as="span">{t("metodo.ver")}</Text>
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="12px" h="12px" fill="currentColor"
                 transition="transform 0.3s cubic-bezier(0.22,1,0.36,1)"
                 _groupHover={{ transform: "translateX(4px)" }}>
              <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
            </Box>
          </Flex>
        </Flex>
      </Box>
    </Reveal>
  );
}

// Iconos de cada carta (Material Symbols).
const IconoMolecular = (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={{ base: "34px", md: "40px" }} h={{ base: "34px", md: "40px" }} fill="currentColor">
    <path d="M521-80q-60 0-150-16.5T227-154q-30-23-63-72t-60.5-107Q76-391 58-449t-18-99q0-85 58-138.5T222-783q60-39 133-68t151-29q78 0 141.5 30T774-777q15 10 39 30t47.5 50q23.5 30 41 70.5T920-534q2 74-30.5 154.5t-88 147Q746-166 673-123T521-80Zm-1-80q62 0 120.5-36T744-287.5q45-55.5 71.5-121T840-532q-2-69-41-113t-70-65q-51-35-105-62.5T506-800q-66 0-130 26t-116 61q-39 26-90 66.5T119-552q0 32 15.5 82t39 100q23.5 50 50.5 92.5t50 59.5q36 27 111 42.5T520-160Zm-106-80q54 0 89-38t35-86q0-22-9-43.5T500-447q-22-20-36-44t-21-53q-10-44-43.5-70T324-640q-49 0-86.5 37.5T200-516q0 39 16.5 87t45.5 90q29 42 68 70.5t84 28.5Zm0-80q-27 0-51-22.5T320.5-396Q302-427 291-460.5T280-516q0-17 13.5-30.5T324-560q12 0 24.5 8.5T366-526q11 42 29.5 75.5T446-388q6 5 9 12t3 14q0 16-12 29t-32 13Zm236-120q17 0 28.5-11.5T690-480v-10l10 5q15 8 30.5 3.5T754-500q9-14 5-30.5T740-555l-10-5 10-5q15-8 18.5-24t-4.5-31q-8-14-23.5-18t-30.5 4l-10 5v-11q0-17-11.5-28.5T650-680q-17 0-28.5 11.5T610-640v11l-9-5q-14-8-30-3.5T546-619q-8 14-4.5 31t19.5 24l9 4-9 6q-14 9-18.5 24.5T546-500q8 15 24.5 19t30.5-4l9-5v10q0 17 11.5 28.5T650-440Zm-168-40Z" />
  </Box>
);
const IconoIlustraciones = (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={{ base: "34px", md: "40px" }} h={{ base: "34px", md: "40px" }} fill="currentColor">
    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
  </Box>
);
const IconoRespuestas = (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w={{ base: "34px", md: "40px" }} h={{ base: "34px", md: "40px" }} fill="currentColor">
    <path d="M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z" />
  </Box>
);

// ═════════════════════════════════════════════════════════════════════════
export default function MetodoNutricionAlimentos() {
  const t = useT();
  // Los mitos en el idioma activo (el orden, la foto y la `key` con la que se
  // guarda lo leído siguen saliendo del español).
  const MITOS_NUTRICION = useMitosNutricion();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [molecularOpen, setMolecularOpen] = useState(false);   // alimentos + desglose
  const [ilustracionesOpen, setIlustracionesOpen] = useState(false); // galería de cómics
  const [respuestasOpen, setRespuestasOpen] = useState(false); // mitos (un box por mito)
  const { marcarLeido, snapshot } = useLeidos("metodo-nutricion");
  // Mitos que venían YA leídos al abrir «Respuestas» (aviso «✓ Leída» dentro).
  const [yaLeidos, setYaLeidos] = useState<Set<string>>(new Set());

  const abrirRespuestas = () => {
    setYaLeidos(snapshot(MITOS_LEIDOS_KEY));
    setRespuestasOpen(true);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { navigate("/welcome"); return; }
    (async () => {
      try {
        const me = await axios.get(`${API_URL}/user/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (!me.data?.nutricion_suscrito) { navigate("/metodo/nutricion"); return; }
      } catch { navigate("/metodo/nutricion"); return; }
      finally { setLoading(false); }
    })();
  }, [navigate]);

  if (loading) return <NutricionLoading />;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Flex flex="1" justify="center" px={{ base: 4, md: 10, lg: 16 }} pt={{ base: 8, md: 12 }} pb={{ base: 12, md: 16 }}>
        <Flex direction="column" align="center" w="100%" maxW="960px" gap={{ base: 6, md: 8 }}>

          <Reveal direction="down" distance={16} duration={0.6} w="100%" display="flex" justifyContent="center">
            <MetodoStepHeader
              icon={<NutricionIcon size={{ base: "40px", md: "56px" }} />}
              title={t("metodo.nutri.paso.bibliotecaTitulo")}
              compact
              maxW="960px"
              bgColor={`${nutricionBg}dd`}
              color={nutricionTxt}
              nom={nutricionNom}
              mb={0}
              prev={{ label: `← ${t("comun.volver")}`, onClick: () => navigate(-1) }}
            />
          </Reveal>

          <Reveal direction="up" distance={18} delay={0.1} duration={0.6} w="100%" display="flex" justifyContent="center">
            <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} fontStyle="italic"
                  textAlign="center" lineHeight="1.8" maxW="620px">
              {t("metodo.nutri.biblioteca.intro")}
            </Text>
          </Reveal>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, md: 6 }} w="100%">
            <BibliotecaCard
              titulo={t("metodo.nutri.biblioteca.molecular")}
              subtitulo={t("metodo.nutri.biblioteca.molecularPie")}
              icono={IconoMolecular}
              onClick={() => setMolecularOpen(true)}
              delay={0.06}
            />
            <BibliotecaCard
              titulo={t("metodo.ilustraciones")}
              subtitulo={t("metodo.nutri.biblioteca.ilustracionesPie")}
              icono={IconoIlustraciones}
              onClick={() => setIlustracionesOpen(true)}
              delay={0.12}
            />
            <BibliotecaCard
              titulo={t("metodo.nutri.biblioteca.respuestas")}
              subtitulo={t("metodo.nutri.biblioteca.respuestasPie")}
              icono={IconoRespuestas}
              onClick={abrirRespuestas}
              delay={0.18}
            />
          </SimpleGrid>

        </Flex>
      </Flex>

      {/* ALIMENTACIÓN MOLECULAR: rejilla de alimentos (con foto) + desglose. */}
      <NutricionMaterialesModal isOpen={molecularOpen} onClose={() => setMolecularOpen(false)} />

      {/* ILUSTRACIONES: galería con TODOS los cómics de Nutrición. */}
      <NutricionIlustracionesModal isOpen={ilustracionesOpen} onClose={() => setIlustracionesOpen(false)} />

      {/* RESPUESTAS: los mitos, un box por mito, navegable con las flechas. Lo
          que se lea aquí también deja su marquita en la página de mitos. */}
      {respuestasOpen && (
        <NutrienteFichaModal tarjetas={MITOS_NUTRICION} index={0}
                             onLeida={(i) => {
                               const m = MITOS_NUTRICION[i];
                               if (m) marcarLeido(MITOS_LEIDOS_KEY, m.key);
                             }}
                             leida={(i) => yaLeidos.has(MITOS_NUTRICION[i]?.key)}
                             onClose={() => setRespuestasOpen(false)} />
      )}

      <IndiceNutricion />

      <BotonCompania color={nutricionTxt} bgColor={nutricionBg} disciplinaNom={nutricionNom} />
      <SiteFooter />
    </Box>
  );
}
