import React, { useEffect, useState } from "react";
import {
  Box, Flex, Text, Image, SimpleGrid,
  Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton,
} from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { DisciplineHeader } from "../../components/global/DisciplineHeader";
import { ContactModal } from "../../components/global/ContactModal";
import { SaberMasButton } from "../../components/global/SaberMasButton";
import { SubscribeBox } from "../../components/global/SubscribeBox";
import { useNavigate, useParams } from "react-router-dom";
import { cursosData } from "../../hardCoded/cursos";
import type { Curso } from "../../hardCoded/cursos";
import { nutricionNomLink, NutricionIcon, nutricionTxt, FitoterapiaIcon, tcmNomLink, tcmBg, tcmTxt, ayurvedaNomLink, ayurvedaBg, ayurvedaTxt, AyurvedaIcon, astrologiaNom, astrologiaBg, astrologiaTxt, AstrologiaIcon, culturaNom, culturaNomLink, culturaBg, culturaTxt, CulturaIcon } from "../../GlobalVariables";

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/14A7sEfdJbLm9E3gr22VG00";

// ────────────────────────────────
// CURSO CARD
// ────────────────────────────────
interface CursoCardProps {
  curso: Curso;
  bgColor: string;
  color: string;
  disciplina: string;
  onVerDetalle: () => void;
}

function CursoCard({ curso, bgColor, color, disciplina, onVerDetalle }: CursoCardProps) {
  const label = curso.precio === null ? "Gratis" : `${curso.precio.toFixed(2).replace(".", ",")} €`;

  return (
    <Flex
      bg={bgColor}
      gap={4}
      borderRadius="2xl"
      border={`1px solid ${color}55`}
      boxShadow={`0 0 22px rgba(255,255,255,0.3), 0 0 50px rgba(255,255,255,0.14), 0 0 90px rgba(180,255,245,0.16), 0 0 36px ${color}55, 0 4px 22px rgba(0,0,0,0.22)`}
      direction="column"
      p={{ base: 7, md: 8 }}
      h="100%"
    >
      {/* Título */}
      <Box mt="3px" mb={"10px"}>
        <Text
          color={color}
          fontSize={{ base: "2xl", md: "3xl" }}
          fontWeight="700"
          letterSpacing="0.04em"
          lineHeight="1.25"
          style={{ textShadow: `0 0 12px rgba(255,255,255,0.55), 0 0 26px rgba(255,255,255,0.28), 0 0 50px ${color}55` }}
        >
          {curso.titulo}
        </Text>
        <Text
          color={`${color}bb`}
          fontSize={{ base: "xs", md: "sm" }}
          fontWeight="500"
          letterSpacing="0.14em"
          textTransform="uppercase"
          mt={2}
          style={{ textShadow: `0 0 8px rgba(255,255,255,0.35), 0 0 18px ${color}44` }}
        >
          {disciplina}
        </Text>
      </Box>

      {/* Foto — ratio 16:9 (YouTube thumbnail) */}
      <Box
        borderRadius="xl"
        overflow="hidden"
        mb={"6px"}
        position="relative"
        paddingBottom="56.25%"
        boxShadow={`0 0 14px rgba(255,255,255,0.22), 0 0 32px rgba(255,255,255,0.12), 0 6px 28px ${color}66`}
        border={`1px solid ${color}55`}
      >
        <Image
          src={curso.foto}
          alt={curso.titulo}
          position="absolute"
          top="0"
          left="0"
          w="100%"
          h="100%"
          objectFit="cover"
          display="block"
        />
      </Box>

      {/* Precio + Botón */}
      <Flex align="center" justify="space-between" gap={3} mt="auto">
        <Text
          color={color}
          fontSize={{ base: "2xl", md: "2xl" }}
          fontWeight="700"
          lineHeight="1"
          style={{ textShadow: `0 0 10px rgba(255,255,255,0.5), 0 0 22px ${color}66` }}
        >
          {label}
        </Text>

        <Box
          as="button"
          onClick={onVerDetalle}
          color={bgColor}
          bg={color}
          fontFamily="'EB Garamond', serif"
          fontWeight="700"
          fontSize="md"
          letterSpacing="0.14em"
          textTransform="uppercase"
          px={6}
          py="11px"
          borderRadius="full"
          cursor="pointer"
          flexShrink={0}
          boxShadow={`0 0 14px rgba(255,255,255,0.3), 0 4px 18px ${color}66`}
          _hover={{ boxShadow: `0 0 22px rgba(255,255,255,0.5), 0 6px 24px ${color}88` }}
          transition="box-shadow 0.25s ease"
        >
          Acceder →
        </Box>
      </Flex>
    </Flex>
  );
}

// ────────────────────────────────
// PÁGINA PRINCIPAL
// ────────────────────────────────
export default function CursosModalidad() {
  const { moduloId } = useParams<{ moduloId: string }>();
  const navigate = useNavigate();

  const modalidad = moduloId ? cursosData[moduloId] : null;

  const [detailCurso, setDetailCurso] = useState<Curso | null>(null);
  const [saberMasOpen, setSaberMasOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  if (!modalidad) {
    return (
      <Box minH="100vh" bg="#008080" display="flex" flexDirection="column" fontFamily="'EB Garamond', serif">
        <SiteHeader variant="auto" />
        <Box flex="1" display="flex" alignItems="center" justifyContent="center">
          <Text color="white" fontSize="xl">
            Modalidad no encontrada.
          </Text>
        </Box>
      </Box>
    );
  }

  const handleAcceder = (curso: Curso) => {
    if (curso.precio === null) {
      navigate(curso.cursoLink);
    } else {
      window.open(STRIPE_PAYMENT_LINK, "_blank");
    }
  };

  const formatPrecio = (precio: number | null) =>
    precio === null ? "Gratis" : `${precio.toFixed(2).replace(".", ",")} €`;

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
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 14, md: 20 }}
        >
          <DisciplineHeader
            icon={modalidad.icon}
            title={modalidad.nom}
            bgColor={modalidad.bgColor}
            color={modalidad.color}
            mb={(moduloId === nutricionNomLink || moduloId === tcmNomLink || moduloId === ayurvedaNomLink || moduloId === astrologiaNom || moduloId === culturaNom || moduloId === culturaNomLink /*|| moduloId === fisiologiaNom*/) ? { base: 6, md: 7 } : undefined}
          />

          {/* ── TESTS (solo Medicina China) ── */}
          {moduloId === tcmNomLink && (
            <Flex justify="center" gap={{ base: 2, md: 4 }} mb={{ base: 6, md: 7 }} w="100%" maxW="900px" flexWrap={{ base: "wrap", md: "nowrap" }}>
              {/* Test 1: Constitución */}
              <Flex
                as="button"
                align="center"
                justify="center"
                gap={2}
                flex="1"
                px={{ base: 3, md: 6 }}
                py={{ base: 3, md: 4 }}
                borderRadius="full"
                bg={tcmBg}
                border={`1.5px solid ${tcmTxt}88`}
                boxShadow="0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"
                cursor="pointer"
                transition="all 0.22s ease"
                onClick={() => navigate("/tcm/test/1?guest=true")}
                _hover={{
                  boxShadow: `0 0 20px ${tcmTxt}44`,
                  transform: "translateY(-2px)",
                  border: `1.5px solid ${tcmTxt}aa`,
                  opacity: 0.88,
                }}
                _active={{ transform: "translateY(0px)" }}
              >
                <Box flexShrink={0} display="flex" alignItems="center">
                  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill={tcmTxt}>
                    <path d="M343.5-743.5Q320-767 320-800t23.5-56.5Q367-880 400-880t56.5 23.5Q480-833 480-800t-23.5 56.5Q433-720 400-720t-56.5-23.5ZM731-269q29-29 29-71t-29-71q-29-29-71-29t-71 29q-29 29-29 71t29 71q29 29 71 29t71-29ZM864-80 756-188q-22 14-46 21t-50 7q-75 0-127.5-52.5T480-340q0-75 52.5-127.5T660-520q75 0 127.5 52.5T840-340q0 26-7 50t-21 46l108 108-56 56Zm-424 0v-121q15 24 35.5 44t44.5 36v41h-80Zm-160 0v-520q-61-5-121-14.5T40-640l20-80q84 23 168.5 31.5T400-680q87 0 171.5-8.5T740-720l20 80q-59 16-119 25.5T520-600v41q-54 35-87 92.5T400-340v10q0 5 1 10h-41v240h-80Z"/>
                  </svg>
                </Box>
                <Text
                  color={tcmTxt}
                  fontFamily="'EB Garamond', serif"
                  fontWeight="700"
                  fontSize={{ base: "md", md: "xl" }}
                  letterSpacing="0.06em"
                  lineHeight="1.2"
                  textAlign="center"
                >
                  Test constitución
                </Text>
              </Flex>

              {/* Test 2: Elemento */}
              <Flex
                as="button"
                align="center"
                justify="center"
                gap={2}
                flex="1"
                px={{ base: 3, md: 6 }}
                py={{ base: 3, md: 4 }}
                borderRadius="full"
                bg={tcmBg}
                border={`1.5px solid ${tcmTxt}88`}
                boxShadow="0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"
                cursor="pointer"
                transition="all 0.22s ease"
                onClick={() => navigate("/tcm/test/2?guest=true")}
                _hover={{
                  boxShadow: `0 0 20px ${tcmTxt}44`,
                  transform: "translateY(-2px)",
                  border: `1.5px solid ${tcmTxt}aa`,
                  opacity: 0.88,
                }}
                _active={{ transform: "translateY(0px)" }}
              >
                <Box flexShrink={0} display="flex" alignItems="center">
                  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill={tcmTxt}>
                    <path d="M480-480Zm0 360q-18 0-34.5-6.5T416-146L148-415q-35-35-51.5-80T80-589q0-103 67-177t167-74q48 0 90.5 19t75.5 53q32-34 74.5-53t90.5-19q100 0 167.5 74T880-590q0 49-17 94t-51 80L543-146q-13 13-29 19.5t-34 6.5Zm40-520q10 0 19 5t14 13l68 102h166q7-17 10.5-34.5T801-590q-2-69-46-118.5T645-758q-31 0-59.5 12T536-711l-27 29q-5 6-13 9.5t-16 3.5q-8 0-16-3.5t-14-9.5l-27-29q-21-23-49-36t-60-13q-66 0-110 50.5T160-590q0 18 3 35.5t10 34.5h187q10 0 19 5t14 13l35 52 54-162q4-12 14.5-20t23.5-8Zm12 130-54 162q-4 12-15 20t-24 8q-10 0-19-5t-14-13l-68-102H236l237 237q2 2 3.5 2.5t3.5.5q2 0 3.5-.5t3.5-2.5l236-237H600q-10 0-19-5t-15-13l-34-52Z"/>
                  </svg>
                </Box>
                <Text
                  color={tcmTxt}
                  fontFamily="'EB Garamond', serif"
                  fontWeight="700"
                  fontSize={{ base: "md", md: "xl" }}
                  letterSpacing="0.06em"
                  lineHeight="1.2"
                  textAlign="center"
                >
                  Test elemento
                </Text>
              </Flex>

              {/* Test 3: Desequilibrio */}
              <Flex
                as="button"
                align="center"
                justify="center"
                gap={2}
                flex="1"
                px={{ base: 3, md: 6 }}
                py={{ base: 3, md: 4 }}
                borderRadius="full"
                bg={tcmBg}
                border={`1.5px solid ${tcmTxt}88`}
                boxShadow="0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"
                cursor="pointer"
                transition="all 0.22s ease"
                onClick={() => navigate("/tcm/test/3?guest=true")}
                _hover={{
                  boxShadow: `0 0 20px ${tcmTxt}44`,
                  transform: "translateY(-2px)",
                  border: `1.5px solid ${tcmTxt}aa`,
                  opacity: 0.88,
                }}
                _active={{ transform: "translateY(0px)" }}
              >
                <Box flexShrink={0} display="flex" alignItems="center">
                  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill={tcmTxt}>
                    <path d="M824-120 636-308q-41 32-90.5 50T440-240q-90 0-162.5-44T163-400h98q34 37 79.5 58.5T440-320q100 0 170-70t70-170q0-100-70-170t-170-70q-94 0-162.5 63.5T201-580h-80q8-127 99.5-213.5T440-880q134 0 227 93t93 227q0 56-18 105.5T692-364l188 188-56 56ZM397-400l-63-208-52 148H80v-60h160l66-190h60l61 204 43-134h60l60 120h30v60h-67l-47-94-50 154h-59Z"/>
                  </svg>
                </Box>
                <Text
                  color={tcmTxt}
                  fontFamily="'EB Garamond', serif"
                  fontWeight="700"
                  fontSize={{ base: "md", md: "xl" }}
                  letterSpacing="0.06em"
                  lineHeight="1.2"
                  textAlign="center"
                >
                  Test desequilibrio
                </Text>
              </Flex>
            </Flex>
          )}

          {/* ── TEST DOSHAS (solo Ayurveda) ── */}
          {moduloId === ayurvedaNomLink && (
            <Flex justify="center" mb={{ base: 6, md: 7 }} w="100%" maxW="900px">
              <Flex
                as="button"
                align="center"
                justify="center"
                gap={2}
                px={{ base: 6, md: 10 }}
                py={{ base: 3, md: 4 }}
                borderRadius="full"
                bg={ayurvedaBg}
                border={`1.5px solid ${ayurvedaTxt}88`}
                boxShadow="0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"
                cursor="pointer"
                transition="all 0.22s ease"
                onClick={() => navigate("/aprendizaje/test-doshas")}
                _hover={{
                  boxShadow: `0 0 20px ${ayurvedaTxt}44`,
                  transform: "translateY(-2px)",
                  border: `1.5px solid ${ayurvedaTxt}aa`,
                  opacity: 0.88,
                }}
                _active={{ transform: "translateY(0px)" }}
              >
                <Box flexShrink={0} display="flex" alignItems="center">
                  <AyurvedaIcon size={{ base: "22px", md: "22px" }} />
                </Box>
                <Text
                  color={ayurvedaTxt}
                  fontFamily="'EB Garamond', serif"
                  fontWeight="700"
                  fontSize={{ base: "lg", md: "xl" }}
                  letterSpacing="0.08em"
                  lineHeight="1"
                >
                  Test de los Doshas
                </Text>
              </Flex>
            </Flex>
          )}

          {/* ── CARTAS DE PERSONAJES HISTÓRICOS (Astrología) ── */}
          {moduloId === astrologiaNom && (() => {
            const isAstro = moduloId === astrologiaNom;
            const bg = isAstro ? astrologiaBg : culturaBg;
            const txt = isAstro ? astrologiaTxt : culturaTxt;
            const icon = isAstro
              ? <AstrologiaIcon size={{ base: "22px", md: "22px" }} />
              : <CulturaIcon size={{ base: "22px", md: "22px" }} />;
            return (
              <Flex justify="center" mb={{ base: 6, md: 7 }} w="100%" maxW="900px">
                <Flex
                  as="a"
                  href="https://docs.google.com/document/d/1OWQUl5Nz2AgzDow4O1-PQKoakzDwEo9KwY9qOk6QKWg/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  align="center"
                  justify="center"
                  gap={2}
                  px={{ base: 6, md: 10 }}
                  py={{ base: 3, md: 4 }}
                  borderRadius="full"
                  bg={bg}
                  border={`1.5px solid ${txt}88`}
                  boxShadow="0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"
                  cursor="pointer"
                  transition="all 0.22s ease"
                  _hover={{
                    boxShadow: `0 0 20px ${txt}44`,
                    transform: "translateY(-2px)",
                    border: `1.5px solid ${txt}aa`,
                    opacity: 0.88,
                  }}
                  _active={{ transform: "translateY(0px)" }}
                  style={{ textDecoration: "none" }}
                >
                  <Box flexShrink={0} display="flex" alignItems="center">
                    {icon}
                  </Box>
                  <Text
                    color={txt}
                    fontFamily="'EB Garamond', serif"
                    fontWeight="700"
                    fontSize={{ base: "lg", md: "xl" }}
                    letterSpacing="0.08em"
                    lineHeight="1"
                  >
                    Cartas de Personajes Históricos
                  </Text>
                </Flex>
              </Flex>
            );
          })()}

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

          {/* ── HERBARIO + ALIMENTOS + CALCULAR (solo Nutrición) ── */}
          {moduloId === nutricionNomLink && (
            <Flex justify="center" gap={{ base: 2, md: 3 }} mb={{ base: 6, md: 7 }} w="100%" maxW="900px" flexWrap={{ base: "wrap", md: "nowrap" }}>
              {/* Herbario */}
              <Flex
                as="button"
                align="center"
                justify="center"
                gap={2}
                flex="1"
                px={{ base: 4, md: 8 }}
                py={{ base: 3, md: 4 }}
                borderRadius="full"
                bg={modalidad.bgColor}
                border={`1.5px solid ${modalidad.color}88`}
                boxShadow="0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"
                cursor="pointer"
                transition="all 0.22s ease"
                onClick={() => navigate("/aprendizaje/herbario")}
                _hover={{
                  boxShadow: `0 0 20px ${modalidad.color}44`,
                  transform: "translateY(-2px)",
                  border: `1.5px solid ${modalidad.color}aa`,
                  opacity: 0.88,
                }}
                _active={{ transform: "translateY(0px)" }}
              >
                <Box flexShrink={0} display="flex" alignItems="center">
                  <FitoterapiaIcon size="22px" color={nutricionTxt} />
                </Box>
                <Text
                  color={modalidad.color}
                  fontFamily="'EB Garamond', serif"
                  fontWeight="700"
                  fontSize={{ base: "lg", md: "xl" }}
                  letterSpacing="0.08em"
                  lineHeight="1"
                >
                  Herbario
                </Text>
              </Flex>

              {/* Alimentos */}
              <Flex
                as="button"
                align="center"
                justify="center"
                gap={2}
                flex="1"
                px={{ base: 4, md: 6 }}
                py={{ base: 3, md: 4 }}
                borderRadius="full"
                bg={modalidad.bgColor}
                border={`1.5px solid ${modalidad.color}88`}
                boxShadow="0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"
                cursor="pointer"
                transition="all 0.22s ease"
                onClick={() => navigate("/aprendizaje/alimentos")}
                _hover={{
                  boxShadow: `0 0 20px ${modalidad.color}44`,
                  transform: "translateY(-2px)",
                  border: `1.5px solid ${modalidad.color}aa`,
                  opacity: 0.88,
                }}
                _active={{ transform: "translateY(0px)" }}
              >
                <NutricionIcon size={{ base: "22px", md: "22px" }} />
                <Text
                  color={modalidad.color}
                  fontFamily="'EB Garamond', serif"
                  fontWeight="700"
                  fontSize={{ base: "lg", md: "xl" }}
                  letterSpacing="0.08em"
                  lineHeight="1"
                >
                  Alimentos
                </Text>
              </Flex>

              {/* Calcular necesidades */}
              <Flex
                as="button"
                align="center"
                justify="center"
                gap={2}
                flex="1"
                px={{ base: 4, md: 6 }}
                py={{ base: 3, md: 4 }}
                borderRadius="full"
                bg={modalidad.bgColor}
                border={`1.5px solid ${modalidad.color}88`}
                boxShadow="0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"
                cursor="pointer"
                transition="all 0.22s ease"
                onClick={() => navigate("/aprendizaje/calcular-necesidades")}
                _hover={{
                  boxShadow: `0 0 20px ${modalidad.color}44`,
                  transform: "translateY(-2px)",
                  border: `1.5px solid ${modalidad.color}aa`,
                  opacity: 0.88,
                }}
                _active={{ transform: "translateY(0px)" }}
              >
                <Box flexShrink={0} display="flex" alignItems="center">
                  <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="22px" fill={modalidad.color}>
                    <path d="M320-240h60v-80h80v-60h-80v-80h-60v80h-80v60h80v80Zm200-30h200v-60H520v60Zm0-100h200v-60H520v60Zm44-152 56-56 56 56 42-42-56-56 56-56-42-42-56 56-56-56-42 42 56 56-56 56 42 42Zm-314-70h200v-60H250v60Zm-50 472q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/>
                  </svg>
                </Box>
                <Text
                  color={modalidad.color}
                  fontFamily="'EB Garamond', serif"
                  fontWeight="700"
                  fontSize={{ base: "md", md: "lg" }}
                  letterSpacing="0.06em"
                  lineHeight="1.1"
                  textAlign="center"
                >
                  Calcular necesidades
                </Text>
              </Flex>
            </Flex>
          )}

          <SimpleGrid
            w="100%"
            maxW="1280px"
            columns={{ base: 1, md: 2, xl: 3 }}
            spacing={{ base: 5, md: 5 }}
            sx={{
              "@keyframes cursoCardIn": {
                from: { opacity: 0, transform: "translateY(40px) scale(0.95)" },
                to:   { opacity: 1, transform: "translateY(0)    scale(1)"    },
              },
            }}
          >
            {modalidad.cursos.map((curso, i) => (
              <Box
                key={curso.id}
                h="100%"
                style={{
                  opacity: 0,
                  animation: `cursoCardIn 0.55s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s forwards`,
                }}
              >
                <CursoCard
                  curso={curso}
                  bgColor={modalidad.bgColor}
                  color={modalidad.color}
                  disciplina={modalidad.nom}
                  onVerDetalle={() => setDetailCurso(curso)}
                />
              </Box>
            ))}
          </SimpleGrid>

          {/* ── BOTÓN ¿QUIERES SABER MÁS? ── */}
          <SaberMasButton
            icon={modalidad.icon}
            color={modalidad.color}
            bgColor={modalidad.bgColor}
            onClick={() => setSaberMasOpen(true)}
          />

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

      {/* ── MODAL DETALLE DEL CURSO ── */}
      <Modal
        isOpen={detailCurso !== null}
        onClose={() => setDetailCurso(null)}
        size="xl"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay bg="rgba(0,60,60,0.65)" sx={{ backdropFilter: "blur(6px)" }} />
        <ModalContent
          bg={modalidad.bgColor}
          border={`1px solid ${modalidad.color}55`}
          borderRadius="2xl"
          boxShadow="0 16px 60px rgba(0,0,0,0.5)"
          mx={{ base: 4, md: 0 }}
          fontFamily="'EB Garamond', serif"
        >
          <ModalCloseButton color={modalidad.color} top={4} right={4} />
          <ModalBody px={{ base: 6, md: 10 }} py={{ base: 8, md: 11 }}>
            {detailCurso && (
              <Box>
                {/* Título */}
                <Text
                  color={modalidad.color}
                  fontSize={{ base: "3xl", md: "4xl" }}
                  fontWeight="700"
                  letterSpacing="0.05em"
                  lineHeight="1.2"
                  mt={{ base: "10px", md: "25px" }} mb={7}
                  style={{ textShadow: `1px 2px 10px ${modalidad.color}77` }}
                >
                  {detailCurso.titulo}
                </Text>

                {/* Foto grande */}
                <Box
                  borderRadius="xl"
                  overflow="hidden"
                  mb={10}
                  boxShadow={`0 8px 32px ${modalidad.color}55`}
                >
                  <Image
                    src={detailCurso.foto}
                    alt={detailCurso.titulo}
                    w="100%"
                    h="auto"
                    display="block"
                  />
                </Box>

                {/* Descripción */}
                <Text
                  color={`${modalidad.color}cc`}
                  fontSize={{ base: "md", md: "lg" }}
                  lineHeight="1.85"
                  letterSpacing="0.02em"
                  mb={6}
                >
                  {detailCurso.descripcion}
                </Text>


                {/* Precio + Botón */}
                <Flex
                  align="center"
                  justify="space-between"
                  borderTop={`1px solid ${modalidad.color}33`}
                  pt={5}
                  gap={4}
                  flexWrap="wrap" mb="10px"
                >
                  <Text
                    color={modalidad.color}
                    fontSize={{ base: "2xl", md: "3xl" }}
                    fontWeight="700"
                    lineHeight="1"
                  >
                    {formatPrecio(detailCurso.precio)}
                  </Text>

                  <Box
                    as="button"
                    onClick={() => handleAcceder(detailCurso)}
                    color={modalidad.bgColor}
                    bg={modalidad.color}
                    fontFamily="'EB Garamond', serif"
                    fontWeight="700"
                    fontSize={{ base: "lg", md: "xl" }}
                    letterSpacing="0.08em"
                    px={{ base: 8, md: 10 }}
                    py="13px"
                    borderRadius="full"
                    cursor="pointer"
                    _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
                    transition="all 0.2s"
                    boxShadow={`0 4px 16px ${modalidad.color}44`}
                  >
                    {detailCurso.precio === null ? "Acceder →" : "Comprar →"}
                  </Box>
                </Flex>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
