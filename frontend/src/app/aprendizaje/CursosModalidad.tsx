import React, { useEffect, useState } from "react";
import {
  Box, Flex, Text, SimpleGrid,
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
} from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import SpinnerTurquesa from "../../components/global/Spinner";
import { MetodoStepHeader } from "../../components/metodo/MetodoStepHeader";
import { CursoCardDetalle } from "../../components/aprendizaje/CursoCardDetalle";
import { ComicAstrologiaModal } from "../../components/metodo/ComicAstrologiaModal";
import { HinduismoIlustracionesModal } from "../../components/metodo/HinduismoIlustracionesModal";
import { TCMIlustracionesModal } from "../../components/metodo/TCMIlustracionesModal";
import { ContactModal } from "../../components/global/ContactModal";
import { SubscribeBox } from "../../components/global/SubscribeBox";
import { useNavigate, useParams } from "react-router-dom";
import { useCursosData } from "../../data/cursosApi";
import type { ModalidadInfo } from "../../hardCoded/cursos";
import { nutricionNom, nutricionNomLink, NutricionIcon, nutricionBg, nutricionTxt, FitoterapiaIcon, tcmNom, tcmNomLink, tcmBg, tcmTxt, TCMIcon, ayurvedaNom, ayurvedaNomLink, ayurvedaBg, ayurvedaTxt, AyurvedaIcon, astrologiaNom, astrologiaBg, astrologiaTxt, AstrologiaIcon, culturaNom, culturaBg, culturaTxt, CulturaIcon, cabalaNom, cabalaBg, cabalaTxt, CabalaIcon, fisiologiaNom, fisiologiaBg, fisiologiaTxt, FisiologiaIcon, CelulasOrganosIcon, neuropsicologiaNom, neuropsicologiaBg, neuropsicologiaTxt, NeuropsicologiaIcon } from "../../GlobalVariables";


// Decodifica un slug de URL (p.ej. "Astrolog%C3%ADa" → "Astrología"). Si ya
// venía decodificado o decodeURIComponent falla, devuelve el valor original.
function safeDecode(s: string): string {
  try { return decodeURIComponent(s); } catch { return s; }
}

// Disciplinas que ya tienen página accesible pero aún no tienen cursos en
// cursosData. Renderizamos la cabecera con su nombre/icono/fondo y un
// placeholder en lugar del grid de cursos.
const FALLBACK_MODALIDADES: Record<string, Omit<ModalidadInfo, "cursos">> = {
  [astrologiaNom]:   { nom: astrologiaNom, bgColor: astrologiaBg, color: astrologiaTxt, icon: <AstrologiaIcon size={{ base: "40px", md: "56px" }} /> },
  [ayurvedaNomLink]: { nom: ayurvedaNom,   bgColor: ayurvedaBg,   color: ayurvedaTxt,   icon: <AyurvedaIcon size={{ base: "40px", md: "56px" }} /> },
  [tcmNomLink]:      { nom: tcmNom,        bgColor: tcmBg,        color: tcmTxt,        icon: <TCMIcon size={{ base: "40px", md: "56px" }} /> },
  [fisiologiaNom]:   { nom: fisiologiaNom, bgColor: fisiologiaBg, color: fisiologiaTxt, icon: <FisiologiaIcon size={{ base: "40px", md: "56px" }} /> },
  [neuropsicologiaNom]: { nom: neuropsicologiaNom, bgColor: neuropsicologiaBg, color: neuropsicologiaTxt, icon: <NeuropsicologiaIcon size={{ base: "40px", md: "56px" }} /> },
  [nutricionNomLink]: { nom: nutricionNom, bgColor: nutricionBg, color: nutricionTxt, icon: <NutricionIcon size={{ base: "40px", md: "56px" }} /> },
  [cabalaNom]:        { nom: cabalaNom,        bgColor: cabalaBg,    color: cabalaTxt,    icon: <CabalaIcon size={{ base: "40px", md: "56px" }} /> },
  [culturaNom]:       { nom: culturaNom,       bgColor: culturaBg,   color: culturaTxt,   icon: <CulturaIcon size={{ base: "40px", md: "56px" }} /> },
};

// Iconos pequeños (16-18px) para los botones dentro del header de la disciplina.
const EyeIcon = () => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="16px" h="16px" fill="currentColor" style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.38))" }}>
    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Z" />
  </Box>
);
const TestConstitucionIcon = ({ size = "16px" }: { size?: string } = {}) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" w={size} h={size} viewBox="0 -960 960 960" fill="currentColor">
    <path d="M343.5-743.5Q320-767 320-800t23.5-56.5Q367-880 400-880t56.5 23.5Q480-833 480-800t-23.5 56.5Q433-720 400-720t-56.5-23.5ZM731-269q29-29 29-71t-29-71q-29-29-71-29t-71 29q-29 29-29 71t29 71q29 29 71 29t71-29ZM864-80 756-188q-22 14-46 21t-50 7q-75 0-127.5-52.5T480-340q0-75 52.5-127.5T660-520q75 0 127.5 52.5T840-340q0 26-7 50t-21 46l108 108-56 56Zm-424 0v-121q15 24 35.5 44t44.5 36v41h-80Zm-160 0v-520q-61-5-121-14.5T40-640l20-80q84 23 168.5 31.5T400-680q87 0 171.5-8.5T740-720l20 80q-59 16-119 25.5T520-600v41q-54 35-87 92.5T400-340v10q0 5 1 10h-41v240h-80Z"/>
  </Box>
);
const TestElementoIcon = ({ size = "16px" }: { size?: string } = {}) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" w={size} h={size} viewBox="0 -960 960 960" fill="currentColor">
    <path d="M480-480Zm0 360q-18 0-34.5-6.5T416-146L148-415q-35-35-51.5-80T80-589q0-103 67-177t167-74q48 0 90.5 19t75.5 53q32-34 74.5-53t90.5-19q100 0 167.5 74T880-590q0 49-17 94t-51 80L543-146q-13 13-29 19.5t-34 6.5Zm40-520q10 0 19 5t14 13l68 102h166q7-17 10.5-34.5T801-590q-2-69-46-118.5T645-758q-31 0-59.5 12T536-711l-27 29q-5 6-13 9.5t-16 3.5q-8 0-16-3.5t-14-9.5l-27-29q-21-23-49-36t-60-13q-66 0-110 50.5T160-590q0 18 3 35.5t10 34.5h187q10 0 19 5t14 13l35 52 54-162q4-12 14.5-20t23.5-8Zm12 130-54 162q-4 12-15 20t-24 8q-10 0-19-5t-14-13l-68-102H236l237 237q2 2 3.5 2.5t3.5.5q2 0 3.5-.5t3.5-2.5l236-237H600q-10 0-19-5t-15-13l-34-52Z"/>
  </Box>
);
const TestDesequilibrioIcon = ({ size = "16px" }: { size?: string } = {}) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" w={size} h={size} viewBox="0 -960 960 960" fill="currentColor">
    <path d="M824-120 636-308q-41 32-90.5 50T440-240q-90 0-162.5-44T163-400h98q34 37 79.5 58.5T440-320q100 0 170-70t70-170q0-100-70-170t-170-70q-94 0-162.5 63.5T201-580h-80q8-127 99.5-213.5T440-880q134 0 227 93t93 227q0 56-18 105.5T692-364l188 188-56 56ZM397-400l-63-208-52 148H80v-60h160l66-190h60l61 204 43-134h60l60 120h30v60h-67l-47-94-50 154h-59Z"/>
  </Box>
);
const DoshasIcon = () => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" w="16px" h="16px" viewBox="0 -960 960 960" fill="currentColor">
    <path d="M272-160q-30 0-51-21t-21-51q0-21 12-39.5t32-26.5l156-62v-90q-54 63-125.5 96.5T120-320v-80q68 0 123.5-28T344-508l54-64q12-14 28-21t34-7h40q18 0 34 7t28 21l54 64q45 52 100.5 80T840-400v80q-83 0-154.5-33.5T560-450v90l156 62q20 8 32 26.5t12 39.5q0 30-21 51t-51 21H400v-20q0-26 17-43t43-17h120q9 0 14.5-5.5T600-260q0-9-5.5-14.5T580-280H460q-42 0-71 29t-29 71v20h-88Zm151.5-503.5Q400-687 400-720t23.5-56.5Q447-800 480-800t56.5 23.5Q560-753 560-720t-23.5 56.5Q513-640 480-640t-56.5-23.5Z"/>
  </Box>
);
const CartasIcon = () => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" w="16px" h="16px" viewBox="0 -960 960 960" fill="currentColor">
    <path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm457-560 21-89-71-59 94-8 36-84 36 84 94 8-71 59 21 89-80-47-80 47ZM480-481Z"/>
  </Box>
);
const CalcularIcon = ({ size = "16px" }: { size?: string } = {}) => (
  <Box as="svg" xmlns="http://www.w3.org/2000/svg" w={size} h={size} viewBox="0 -960 960 960" fill="currentColor">
    <path d="M320-240h60v-80h80v-60h-80v-80h-60v80h-80v60h80v80Zm200-30h200v-60H520v60Zm0-100h200v-60H520v60Zm44-152 56-56 56 56 42-42-56-56 56-56-42-42-56 56-56-56-42 42 56 56-56 56 42 42Zm-314-70h200v-60H250v60Zm-50 472q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/>
  </Box>
);

// ────────────────────────────────
// PÁGINA PRINCIPAL
// ────────────────────────────────
export default function CursosModalidad() {
  const { moduloId: rawModuloId } = useParams<{ moduloId: string }>();
  // Defensa: si por cualquier motivo el router nos pasa el slug aún codificado
  // (p.ej. "Astrolog%C3%ADa"), lo decodificamos antes de comparar contra los
  // nombres canónicos (`astrologiaNom = "Astrología"`).
  const moduloId = rawModuloId ? safeDecode(rawModuloId) : rawModuloId;
  const navigate = useNavigate();
  const { cursosData, loading } = useCursosData();

  const fromData = moduloId ? cursosData[moduloId] : null;
  const fallback = moduloId ? FALLBACK_MODALIDADES[moduloId] : null;
  const modalidad: ModalidadInfo | null =
    fromData ?? (fallback ? { ...fallback, cursos: [] } : null);

  const [saberMasOpen, setSaberMasOpen] = useState(false);
  const [ilustracionesHinduismoOpen, setIlustracionesHinduismoOpen] = useState(false);
  const [ilustracionesAstroOpen, setIlustracionesAstroOpen] = useState(false);
  const [ilustracionesTCMOpen, setIlustracionesTCMOpen] = useState(false);
  const [testsTCMOpen, setTestsTCMOpen] = useState(false);

  // Botones contextuales que entran dentro del header de la disciplina.
  // Cada disciplina con tests/material extra define los suyos; el resto deja
  // los 3 slots vacíos y el header sólo muestra icono + título.
  const headerButtons: { prev?: any; extra?: any; next?: any } = (() => {
    if (moduloId === tcmNomLink) {
      return {
        prev: { label: "Tests",         onClick: () => setTestsTCMOpen(true),         icon: <TestConstitucionIcon /> },
        next: { label: "Ilustraciones", onClick: () => setIlustracionesTCMOpen(true), icon: <EyeIcon /> },
      };
    }
    if (moduloId === ayurvedaNomLink) {
      return {
        prev: { label: "Test de los Doshas", onClick: () => navigate("/aprendizaje/test-doshas"),    icon: <DoshasIcon /> },
        next: { label: "Ilustraciones",      onClick: () => setIlustracionesHinduismoOpen(true),    icon: <EyeIcon /> },
      };
    }
    if (moduloId === astrologiaNom) {
      return {
        prev:  {
          label: "Cartas de Personajes Históricos",
          onClick: () => window.open("https://docs.google.com/document/d/1OWQUl5Nz2AgzDow4O1-PQKoakzDwEo9KwY9qOk6QKWg/edit?usp=sharing", "_blank"),
          icon: <CartasIcon />,
        },
        next: { label: "Ilustraciones", onClick: () => setIlustracionesAstroOpen(true), icon: <EyeIcon /> },
      };
    }
    if (moduloId === nutricionNomLink) {
      return {
        prev:  { label: "Herbario",             onClick: () => navigate("/aprendizaje/herbario"),             icon: <FitoterapiaIcon size="16px" color={nutricionTxt} /> },
        extra: { label: "Alimentos",            onClick: () => navigate("/aprendizaje/alimentos"),            icon: <NutricionIcon size={{ base: "16px", md: "16px" }} /> },
        next:  { label: "Calcular necesidades", onClick: () => navigate("/aprendizaje/calcular-necesidades"), icon: <CalcularIcon /> },
      };
    }
    if (moduloId === fisiologiaNom) {
      return {
        extra: { label: "Tus células", onClick: () => navigate("/espacio/celulas-cuerpo"), icon: <CelulasOrganosIcon size="16px" /> },
      };
    }
    return {};
  })();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  // Mientras se cargan los cursos desde la API, mostramos el spinner en vez de
  // pintar la cabecera con los cursos vacíos y que aparezcan luego de golpe.
  if (loading) {
    return <Box minH="100vh" bg="#008080"><SiteHeader variant="auto" /><SpinnerTurquesa /></Box>;
  }

  if (!modalidad) {
    return (
      <Box minH="100vh" bg="#008080" display="flex" flexDirection="column" fontFamily="'EB Garamond', serif">
        <SiteHeader variant="auto" />
        <Box flex="1" display="flex" alignItems="center" justifyContent="center">
          <Text color="white" fontSize="xl" fontStyle="italic">
            Disciplina en construcción.
          </Text>
        </Box>
      </Box>
    );
  }

  // Cursos ordenados por fecha de publicación: los más recientes, primero.
  const cursos = [...modalidad.cursos].sort(
    (a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
  );

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="#008080"
      fontFamily="'EB Garamond', serif"
    >
      {/* HEADER */}
      <SiteHeader variant="auto" />

      {/* MAIN */}
      <Box flex="1">
        <Flex
          direction="column"
          alignItems="center"
          px={{ base: 5, md: 8, lg: 10 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 14, md: 20 }}
        >
          <MetodoStepHeader
            icon={modalidad.icon}
            title={modalidad.nom}
            bgColor={`${modalidad.bgColor}dd`}
            color={modalidad.color}
            nom={modalidad.nom}
            hideCursos
            prev={headerButtons.prev}
            extra={headerButtons.extra}
            next={headerButtons.next}
            mb={{ base: 12, md: 16 }}
          />

          {/* ── CÉLULAS DEL CUERPO (solo Fisiología) ── */}
          {/* {moduloId === fisiologiaNom && (
            <Flex justify="center" mb={{ base: 6, md: 7 }} w="100%" maxW="900px">
              <Flex
                as="button"
                align="center"
                justify="center"
                gap={2}
                px={{ base: 6, md: 10 }}
                py={{ base: 3, md: 4 }}
                borderRadius="full"
                bg={modalidad.bgColor}
                border={`1.5px solid ${fisiologiaTxt}88`}
                boxShadow="0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"
                cursor="pointer"
                transition="all 0.22s ease"
                onClick={() => navigate("/espacio/celulas-cuerpo")}
                _hover={{
                  transform: "translateY(-2px)",
                  border: `1.5px solid ${fisiologiaTxt}aa`,
                  opacity: 0.88,
                }}
                _active={{ transform: "translateY(0px)" }}
              >
                <Box flexShrink={0} display="flex" alignItems="center">
                  <FisiologiaIcon size={{ base: "22px", md: "22px" }} />
                </Box>
                <Text
                  color={fisiologiaTxt}
                  fontFamily="'EB Garamond', serif"
                  fontWeight="700"
                  fontSize={{ base: "lg", md: "xl" }}
                  letterSpacing="0.08em"
                  lineHeight="1"
                >
                  Las células de tu cuerpo
                </Text>
              </Flex>
            </Flex>
          )} */}

          {cursos.length > 0 ? (
            cursos.length === 1 ? (
              // Un solo curso: lo centramos en vez de dejarlo pegado a la izquierda.
              <Flex
                w="100%"
                maxW="850px"
                justify="center"
                sx={{
                  "@keyframes cursoCardIn": {
                    from: { opacity: 0, transform: "translateY(40px) scale(0.95)" },
                    to:   { opacity: 1, transform: "translateY(0)    scale(1)"    },
                  },
                }}
              >
                <Box
                  w="100%"
                  maxW="520px"
                  h="100%"
                  style={{
                    opacity: 0,
                    animation: "cursoCardIn 0.55s cubic-bezier(0.22,1,0.36,1) 0s forwards",
                  }}
                >
                  <CursoCardDetalle
                    curso={cursos[0]}
                    bgColor={modalidad.bgColor}
                    color={modalidad.color}
                    nom={modalidad.nom}
                  />
                </Box>
              </Flex>
            ) : (
              <SimpleGrid
                w="100%"
                columns={{ base: 1, sm: 2, lg: 3 }}
                spacing={{ base: 4, md: 4 }}
                alignItems="start"
                sx={{
                  "@keyframes cursoCardIn": {
                    from: { opacity: 0, transform: "translateY(40px) scale(0.95)" },
                    to:   { opacity: 1, transform: "translateY(0)    scale(1)"    },
                  },
                }}
              >
                {cursos.map((curso, i) => (
                  <Box
                    key={curso.id}
                    h="100%"
                    style={{
                      opacity: 0,
                      animation: `cursoCardIn 0.55s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s forwards`,
                    }}
                  >
                    <CursoCardDetalle
                      curso={curso}
                      bgColor={modalidad.bgColor}
                      color={modalidad.color}
                      nom={modalidad.nom}
                    />
                  </Box>
                ))}
              </SimpleGrid>
            )
          ) : null}

          <SubscribeBox />
        </Flex>
      </Box>

      {/* ── FOOTER ── */}
      <SiteFooter />

      {/* ── MODAL ¿QUIERES SABER MÁS? ── */}
      <ContactModal
        isOpen={saberMasOpen}
        onClose={() => setSaberMasOpen(false)}
        title="¿Quieres saber más?"
        icon={modalidad.icon}
        subtitle="Déjame tus datos y cuéntame en qué puedo ayudarte."
        bgColor={modalidad.bgColor}
        color={modalidad.color}
        emailSubject={`Quiero saber más — ${modalidad.nom}`}
        showDescription
      />

      {/* ── MODAL ILUSTRACIONES ASTROLOGÍA ── */}
      <ComicAstrologiaModal
        isOpen={ilustracionesAstroOpen}
        onClose={() => setIlustracionesAstroOpen(false)}
      />

      {/* ── MODAL ILUSTRACIONES HINDUISMO ── */}
      <HinduismoIlustracionesModal
        isOpen={ilustracionesHinduismoOpen}
        onClose={() => setIlustracionesHinduismoOpen(false)}
      />

      {/* ── MODAL ILUSTRACIONES MEDICINA CHINA ── */}
      <TCMIlustracionesModal
        isOpen={ilustracionesTCMOpen}
        onClose={() => setIlustracionesTCMOpen(false)}
      />

      {/* ── MODAL TESTS MEDICINA CHINA ── pantalla completa, fondo TCM blureado. */}
      <Modal isOpen={testsTCMOpen} onClose={() => setTestsTCMOpen(false)} size="full" isCentered>
        <ModalOverlay bg="rgba(0,0,0,0.85)" sx={{ backdropFilter: "blur(20px)" }} />
        <ModalContent
          bg="transparent"
          border="none"
          borderRadius="0"
          boxShadow="none"
          m={0}
          fontFamily="'EB Garamond', serif"
          minH="100vh"
          position="relative"
        >
          {/* Fondo TCM blureado ocupando todo el espacio */}
          <Box
            position="fixed"
            inset="0"
            pointerEvents="none"
            zIndex={0}
            bg={tcmBg}
            overflow="hidden"
          >
            <Box
              as="img"
              src="/img/fondos/tcm.png"
              alt=""
              loading="eager"
              position="absolute"
              top="-14px"
              left="-14px"
              right="-14px"
              bottom="-14px"
              w="calc(100% + 28px)"
              h="calc(100% + 28px)"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
            <Box position="absolute" inset="0" bg={`${tcmBg}55`} />
          </Box>

          <ModalCloseButton
            color={tcmTxt}
            top={{ base: 3, md: 5 }}
            right={{ base: 3, md: 5 }}
            zIndex={10}
            size="lg"
            _hover={{ bg: `${tcmTxt}22` }}
          />

          <ModalBody
            position="relative"
            zIndex={2}
            w="100%"
            px={{ base: 5, md: 10 }}
            pt={{ base: 20, md: 24 }}
            pb={{ base: 10, md: 14 }}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="flex-start"
            minH="100vh"
            overflowY="auto"
            overflowX="hidden"
          >
            <Flex
              direction="column"
              align="center"
              gap={{ base: 8, md: 10 }}
              w="100%"
              maxW="1280px"
              mx="auto"
              mt={{ base: 8, md: 4 }}
              mb={{ base: 10, md: 8 }}
            >
              <Flex direction="column" align="center" gap={2}>
                <Text
                  color={tcmTxt}
                  fontSize={{ base: "2xl", md: "4xl" }}
                  fontWeight="700"
                  letterSpacing="0.2em"
                  textTransform="uppercase"
                  textAlign="center"
                  lineHeight="1.1"
                  style={{
                    textShadow: `0 0 14px ${tcmTxt}cc, 0 0 32px ${tcmTxt}77, 0 0 70px ${tcmTxt}44`,
                  }}
                >
                  Tests de Medicina China
                </Text>
                <Text
                  color={`${tcmTxt}cc`}
                  fontSize={{ base: "sm", md: "md" }}
                  fontStyle="italic"
                  letterSpacing="0.08em"
                  textAlign="center"
                  maxW="520px"
                >
                  Elige el test que quieras hacer.
                </Text>
              </Flex>

              <Flex
                direction={{ base: "column", md: "row" }}
                gap={{ base: 5, md: 6 }}
                w="100%"
                justify="center"
                align={{ base: "center", md: "stretch" }}
                wrap="wrap"
              >
                {[
                  { label: "Constitución",  path: "/tcm/test/1?guest=true", Icon: TestConstitucionIcon  },
                  { label: "Elemento",      path: "/tcm/test/2?guest=true", Icon: TestElementoIcon      },
                  { label: "Desequilibrio", path: "/tcm/test/3?guest=true", Icon: TestDesequilibrioIcon },
                ].map(({ label, path, Icon }) => (
                  <Box
                    key={path}
                    as="button"
                    onClick={() => { setTestsTCMOpen(false); navigate(path); }}
                    position="relative"
                    flex="1"
                    w="100%"
                    minW={{ base: "auto", sm: "240px", md: "260px" }}
                    maxW={{ base: "300px", md: "320px" }}
                    py={{ base: 9, md: 12 }}
                    px={5}
                    borderRadius="2xl"
                    overflow="hidden"
                    border={`1px solid ${tcmTxt}55`}
                    bg="rgba(255,255,255,0.08)"
                    cursor="pointer"
                    fontFamily="'EB Garamond', serif"
                    sx={{
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      transition: "all 0.25s ease",
                      boxShadow: `0 0 18px ${tcmTxt}33, 0 0 42px ${tcmTxt}1f, inset 0 0 24px rgba(255,255,255,0.04)`,
                      _hover: {
                        transform: "translateY(-4px)",
                        borderColor: tcmTxt,
                        boxShadow: `0 0 28px ${tcmTxt}99, 0 0 70px ${tcmTxt}55, inset 0 0 24px rgba(255,255,255,0.08)`,
                      },
                      _active: { transform: "translateY(-1px)" },
                    }}
                  >
                    <Flex direction="column" align="center" gap={3}>
                      <Flex
                        align="center"
                        justify="center"
                        w="68px"
                        h="68px"
                        borderRadius="full"
                        border={`1.5px solid ${tcmTxt}aa`}
                        bg={`${tcmTxt}1c`}
                        color={tcmTxt}
                        boxShadow={`0 0 14px ${tcmTxt}77, 0 0 28px ${tcmTxt}44`}
                      >
                        <Icon size="34px" />
                      </Flex>
                      <Text
                        color={tcmTxt}
                        fontSize={{ base: "xl", md: "2xl" }}
                        fontWeight="700"
                        letterSpacing="0.18em"
                        textTransform="uppercase"
                        textAlign="center"
                        lineHeight="1.1"
                        style={{
                          textShadow: `0 0 12px ${tcmTxt}cc, 0 0 28px ${tcmTxt}77`,
                        }}
                      >
                        {label}
                      </Text>
                      <Flex
                        align="center"
                        gap={1.5}
                        mt={1}
                        color={tcmTxt}
                        fontSize={{ base: "xs", md: "sm" }}
                        letterSpacing="0.18em"
                        textTransform="uppercase"
                        style={{ textShadow: `0 0 10px ${tcmTxt}aa` }}
                      >
                        <Text as="span">Empezar</Text>
                        <Box
                          as="svg"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 -960 960 960"
                          w="14px"
                          h="14px"
                          fill="currentColor"
                        >
                          <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                        </Box>
                      </Flex>
                    </Flex>
                  </Box>
                ))}
              </Flex>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
