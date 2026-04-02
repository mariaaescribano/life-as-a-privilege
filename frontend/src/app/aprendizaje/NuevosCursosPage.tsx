import React, { useEffect } from "react";
import { Box, Flex, Text, Image, SimpleGrid } from "@chakra-ui/react";
import SiteHeader from "../../components/global/SiteHeader";
import SiteFooter from "../../components/global/Footer";
import { useNavigate } from "react-router-dom";
import { cursosData } from "../../hardCoded/cursos";
import type { Curso, ModalidadInfo } from "../../hardCoded/cursos";
import {
  neuropsicologiaNom,
  astrologiaNom,
  tcmNomLink,
  fitoterapiaNom,
  cabalaNom,
  nutricionNomLink,
  ayurvedaNomLink,
  fisiologiaNom,
} from "../../GlobalVariables";

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/14A7sEfdJbLm9E3gr22VG00";

// Orden cronológico de disciplinas — el usuario puede reordenar luego
const MODALIDAD_ORDER = [
  neuropsicologiaNom,
  astrologiaNom,
  tcmNomLink,
  fitoterapiaNom,
  nutricionNomLink,
  ayurvedaNomLink,
  fisiologiaNom,
  cabalaNom,
];

interface CourseEntry {
  curso: Curso;
  modalidad: ModalidadInfo;
}

function buildCourseList(): CourseEntry[] {
  return MODALIDAD_ORDER.flatMap((nomLink) => {
    const modalidad = cursosData[nomLink];
    if (!modalidad) return [];
    return modalidad.cursos.map((curso) => ({ curso, modalidad }));
  });
}

// ────────────────────────────────
// HEADER
// ────────────────────────────────
function NuevosCursosHeader() {
  return (
    <Box
      bg="rgba(255,255,255,0.22)"
      border="1px solid rgba(255,255,255,0.45)"
      sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
      borderRadius="2xl"
      boxShadow="0 8px 36px rgba(107,196,200,0.45)"
      px={{ base: 8, md: 14 }}
      py={{ base: 8, md: 12 }}
      w="100%"
      maxW="850px"
      mb={{ base: 10, md: 12 }}
    >
      <Flex direction="row" align="center" justify="center" gap={5}>
        <Box
          borderRadius="full"
          bg="rgba(255,255,255,0.18)"
          border="5px solid rgba(255,255,255,0.7)"
          boxShadow="0 0 22px rgba(255,255,255,0.45), 0 0 55px rgba(107,196,200,0.25)"
          w={{ base: "60px", md: "72px" }}
          h={{ base: "60px", md: "72px" }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
          overflow="hidden"
          p="6px"
        >
          <Image
            src="/img/icono/life.png"
            w="100%"
            h="100%"
            objectFit="contain"
          />
        </Box>
        <Box>
          <Text
            color="white"
            fontSize={{ base: "2xl", md: "5xl" }}
            fontWeight="700"
            letterSpacing="0.05em"
            filter="drop-shadow(1px 1px 3px rgba(0,0,0,0.25))"
            lineHeight="1.15"
          >
            Nuevos Cursos
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}

// ────────────────────────────────
// COURSE CARD
// ────────────────────────────────
interface CourseCardProps {
  entry: CourseEntry;
}

function CourseCard({ entry }: CourseCardProps) {
  const { curso, modalidad } = entry;
  const navigate = useNavigate();
  const label =
    curso.precio === null
      ? "Gratis"
      : `${curso.precio.toFixed(2).replace(".", ",")} €`;

  const handleAcceder = () => {
    if (curso.precio === null) {
      navigate(curso.cursoLink);
    } else {
      window.open(STRIPE_PAYMENT_LINK, "_blank");
    }
  };

  return (
    <Flex
      bg={modalidad.bgColor}
      borderRadius="2xl"
      boxShadow="0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"
      direction="column"
      p={{ base: 5, md: 6 }}
      gap={3}
      h="100%"
    >
      {/* Top: icon + título + modalidad */}
      <Flex align="center" gap={3}>
        <Box flexShrink={0}>{modalidad.icon}</Box>
        <Box>
          <Text
            color={modalidad.color}
            fontSize={{ base: "xl", md: "xl" }}
            fontWeight="700"
            letterSpacing="0.04em"
            lineHeight="1.2"
            style={{ textShadow: `1px 2px 8px ${modalidad.color}66` }}
          >
            {curso.titulo}
          </Text>
          <Text
            color={modalidad.color}
            fontSize={{ base: "sm", md: "sm" }}
            fontWeight="500"
            letterSpacing="0.06em"
            opacity={0.7}
            textTransform="uppercase"
            mt="2px"
          >
            {modalidad.nom}
          </Text>
        </Box>
      </Flex>

      {/* Foto */}
      <Box
        borderRadius="xl"
        overflow="hidden"
        boxShadow={`0 8px 32px ${modalidad.color}55, 0 3px 14px ${modalidad.color}33`}
      >
        <Image
          src={curso.foto}
          alt={curso.titulo}
          w="100%"
          h="auto"
          display="block"
          objectFit="cover"
        />
      </Box>

      {/* Descripción */}
      <Text
        color={`${modalidad.color}cc`}
        fontSize={{ base: "md", md: "md" }}
        lineHeight="1.8"
        letterSpacing="0.02em"
        flex="1"
      >
        {curso.descripcion}
      </Text>

      {/* Bottom: price + button */}
      <Flex align="center" justify="space-between" gap={3} mt="auto">
        <Text
          color={modalidad.color}
          fontSize={{ base: "xl", md: "xl" }}
          fontWeight="700"
          lineHeight="1"
        >
          {label}
        </Text>

        <Box
          as="button"
          onClick={handleAcceder}
          color={modalidad.bgColor}
          bg={modalidad.color}
          fontFamily="'EB Garamond', serif"
          fontWeight="700"
          fontSize="lg"
          letterSpacing="0.08em"
          px={7}
          py="12px"
          borderRadius="full"
          cursor="pointer"
          flexShrink={0}
          _hover={{ opacity: 0.88, transform: "translateY(-1px)" }}
          transition="all 0.2s"
          boxShadow={`0 4px 16px ${modalidad.color}44`}
        >
          Acceder →
        </Box>
      </Flex>
    </Flex>
  );
}

// ────────────────────────────────
// PAGE
// ────────────────────────────────
export default function NuevosCursosPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const courses = buildCourseList();

  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="#008080"
      fontFamily="'EB Garamond', serif"
    >
      <SiteHeader variant="auto" />

      <Box flex="1">
        <Flex
          direction="column"
          alignItems="center"
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 20, md: 24 }}
          pb={{ base: 28, md: 24 }}
          gap={{ base: 5, md: 6 }}
        >
          <NuevosCursosHeader />

          <SimpleGrid
            w="100%"
            maxW="850px"
            columns={{ base: 1, md: 2 }}
            spacing={{ base: 5, md: 6 }}
            sx={{
              "@keyframes cursoCardIn": {
                from: { opacity: 0, transform: "translateY(40px) scale(0.97)" },
                to: { opacity: 1, transform: "translateY(0) scale(1)" },
              },
            }}
          >
            {courses.map((entry, i) => (
              <Box
                key={`${entry.modalidad.nom}-${entry.curso.id}`}
                h="100%"
                style={{
                  opacity: 0,
                  animation: `cursoCardIn 0.55s cubic-bezier(0.22,1,0.36,1) ${i * 0.07}s forwards`,
                }}
              >
                <CourseCard entry={entry} />
              </Box>
            ))}
          </SimpleGrid>
        </Flex>
      </Box>

      <SiteFooter />
    </Box>
  );
}
