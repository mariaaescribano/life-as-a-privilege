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
import { useNavigate, useParams } from "react-router-dom";
import { cursosData } from "../../hardCoded/cursos";
import type { Curso } from "../../hardCoded/cursos";

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/14A7sEfdJbLm9E3gr22VG00";

// ────────────────────────────────
// CURSO CARD
// ────────────────────────────────
interface CursoCardProps {
  curso: Curso;
  bgColor: string;
  color: string;
  onVerDetalle: () => void;
}

function CursoCard({ curso, bgColor, color, onVerDetalle }: CursoCardProps) {
  const label = curso.precio === null ? "Gratis" : `${curso.precio.toFixed(2).replace(".", ",")} €`;

  return (
    <Flex
      bg={bgColor} gap={3}
      borderRadius="2xl"
      boxShadow="0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"
      direction="column"
      p={{ base: 5, md: 6 }}
    >
      {/* Título */}
      <Text
        color={color}
        fontSize={{ base: "2xl", md: "2xl" }}
        fontWeight="700"
        letterSpacing="0.04em"
        lineHeight="1.2"
        mb={"10px"}
        style={{ textShadow: `1px 2px 8px ${color}66` }}
      >
        {curso.titulo}
      </Text>

      {/* Foto */}
      <Box
        borderRadius="xl"
        overflow="hidden"
        mb={"10px"}
        h={{ base: "180px", md: "200px" }}
        boxShadow={`0 6px 24px ${color}44`}
      >
        <Image src={curso.foto} alt={curso.titulo} w="100%" h="100%" objectFit="cover" />
      </Box>

      {/* Precio + Botón */}
      <Flex align="center" justify="space-between" gap={3}>
        <Text color={color} fontSize={{ base: "xl", md: "xl" }} fontWeight="700" lineHeight="1">
          {label}
        </Text>

        <Box
          as="button"
          onClick={onVerDetalle}
          color={bgColor}
          bg={color}
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
          boxShadow={`0 4px 16px ${color}44`}
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
      <Box
        minH="100vh"
        bg="#008080"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontFamily="'EB Garamond', serif"
      >
        <Text color="white" fontSize="xl">
          Modalidad no encontrada.
        </Text>
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
          />

          <SimpleGrid
            w="100%"
            maxW="900px"
            columns={{ base: 1, md: 2 }}
            spacing={{ base: 5, md: 6 }}
          >
            {modalidad.cursos.map((curso) => (
              <CursoCard
                key={curso.id}
                curso={curso}
                bgColor={modalidad.bgColor}
                color={modalidad.color}
                onVerDetalle={() => setDetailCurso(curso)}
              />
            ))}
          </SimpleGrid>

          {/* ── BOTÓN ¿QUIERES SABER MÁS? ── */}
          <SaberMasButton
            icon={modalidad.icon}
            color={modalidad.color}
            bgColor={modalidad.bgColor}
            onClick={() => setSaberMasOpen(true)}
          />
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
          <ModalBody px={{ base: 5, md: 8 }} py={{ base: 7, md: 9 }}>
            {detailCurso && (
              <Box>
                {/* Título */}
                <Text
                  color={modalidad.color}
                  fontSize={{ base: "3xl", md: "4xl" }}
                  fontWeight="700"
                  letterSpacing="0.05em"
                  lineHeight="1.2"
                  mb={8}
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

                {/* Lecciones */}
                <Flex
                    align="center"
                    justify="center"
                    gap={3}
                    bg={`${modalidad.color}12`}
                    border={`1px solid ${modalidad.color}30`}
                    borderRadius="3xl"
                    px={5}
                    py={4}
                    mb={6}
                    >
                    <Text fontSize="xl" lineHeight="1">
                        {detailCurso.icon}
                    </Text>
                    <Text
                        color={modalidad.color}
                        fontSize={{ base: "lg", md: "xl" }}
                        fontWeight="600"
                        letterSpacing="0.03em"
                        lineHeight="1"        // asegura que el texto esté centrado verticalmente
                    >
                        {detailCurso.numLecciones} lecciones incluidas
                    </Text>
                    </Flex>

                {/* Precio + Botón */}
                <Flex
                  align="center"
                  justify="space-between"
                  borderTop={`1px solid ${modalidad.color}33`}
                  pt={5}
                  gap={4}
                  flexWrap="wrap"
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
