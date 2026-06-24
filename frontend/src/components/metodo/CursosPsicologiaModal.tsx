import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useCursosData } from "../../data/cursosApi";
import type { Curso } from "../../hardCoded/cursos";
import { neuropsicologiaBg, neuropsicologiaNom, neuropsicologiaTxt } from "../../GlobalVariables";

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/14A7sEfdJbLm9E3gr22VG00";
const PSICOLOGIA_BG = "/img/fondos/psciologia.png";
const C = neuropsicologiaTxt;

const fadeInScale = keyframes`
  from { opacity: 0; transform: translateY(28px) scale(0.96); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
`;

// Flecha que se mueve a derecha e izquierda invitando a pulsar.
const arrowNudge = keyframes`
  0%, 100% { transform: translateX(0); }
  50%      { transform: translateX(7px); }
`;

// ────────────────────────────────────────────────────────────────────────────
// Tarjeta de curso — la imagen 16:9 horizontal COMPLETA es la protagonista y, a
// la vez, el propio botón: al pulsar la foto se accede al curso. Una flecha
// animada (abajo a la derecha) invita a pulsar. Sin título. Glow de psicología.
// ────────────────────────────────────────────────────────────────────────────
function CursoCard({ curso, onAcceder, delay }: { curso: Curso; onAcceder: () => void; delay: string }) {
  return (
    <Box
      as="button"
      onClick={onAcceder}
      position="relative"
      w="100%"
      display="block"
      borderRadius="2xl"
      overflow="hidden"
      border={`1px solid ${C}55`}
      bg={`${neuropsicologiaBg}cc`}
      cursor="pointer"
      animation={`${fadeInScale} 0.55s cubic-bezier(0.22,1,0.36,1) ${delay} both`}
      sx={{
        backdropFilter: "blur(8px)",
        transition: "transform 0.26s ease, box-shadow 0.26s ease, border-color 0.26s ease",
        boxShadow: `0 0 18px ${C}33, 0 0 42px ${C}1f, inset 0 0 24px rgba(255,255,255,0.05)`,
        _hover: {
          transform: "translateY(-4px)",
          borderColor: C,
          boxShadow: `0 0 28px ${C}99, 0 0 70px ${C}55, inset 0 0 24px rgba(255,255,255,0.08)`,
        },
        _active: { transform: "translateY(-1px)" },
      }}
    >
      {/* Imagen 16:9 horizontal completa — ocupa toda la tarjeta */}
      <Box position="relative" w="100%" sx={{ aspectRatio: "16 / 9" }} overflow="hidden" bg={`${neuropsicologiaBg}`}>
        <Box
          as="img"
          src={curso.foto}
          alt=""
          loading="eager"
          position="absolute"
          inset="0"
          w="100%"
          h="100%"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />

        {/* Velo inferior para que la flecha se lea bien sobre la foto */}
        <Box
          position="absolute"
          inset="0"
          pointerEvents="none"
          style={{ background: `linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.16) 26%, transparent 50%)` }}
        />

        {/* Flecha animada — abajo a la derecha, invita a pulsar */}
        <Flex
          position="absolute"
          bottom={{ base: 3, md: 4 }}
          right={{ base: 3, md: 4 }}
          align="center"
          justify="center"
          w={{ base: "40px", md: "46px" }}
          h={{ base: "40px", md: "46px" }}
          borderRadius="full"
          bg={C}
          pointerEvents="none"
          boxShadow={`0 4px 16px rgba(0,0,0,0.45), 0 0 16px ${C}88`}
        >
          <Box
            as="svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            w={{ base: "22px", md: "24px" }}
            h={{ base: "22px", md: "24px" }}
            fill={neuropsicologiaBg}
            sx={{ animation: `${arrowNudge} 1.2s ease-in-out infinite` }}
          >
            <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}

interface CursosPsicologiaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Pantalla completa con los cursos (orientativos) de Psicología, en el mismo
 * estilo mágico que las "Ilustraciones de Astrología": fondo de la disciplina a
 * pantalla completa, título en mayúsculas y una rejilla de tarjetas con la
 * imagen 16:9 de cada curso. Se cierra con la X de arriba a la derecha.
 */
export function CursosPsicologiaModal({ isOpen, onClose }: CursosPsicologiaModalProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { cursosData, loading } = useCursosData();

  const cursos = [...(cursosData[neuropsicologiaNom]?.cursos ?? [])].sort(
    (a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""),
  );

  const acceder = (curso: Curso) => {
    if (curso.precio === null) {
      // Pasamos la ruta de origen para que el curso muestre un botón
      // "Volver a El Recorrido" SOLO cuando se accede desde aquí.
      navigate(`${curso.cursoLink}?volver=${encodeURIComponent(location.pathname)}`);
    } else {
      window.open(STRIPE_PAYMENT_LINK, "_blank");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered scrollBehavior="inside">
      <ModalOverlay bg="rgba(0,0,0,0.92)" sx={{ backdropFilter: "blur(20px)" }} />
      <ModalContent bg="transparent" border="none" borderRadius="0" boxShadow="none" m={0} fontFamily="'EB Garamond', serif" minH="100vh">
        {/* X cerrar — arriba a la derecha */}
        <Box
          as="button"
          aria-label="Cerrar"
          onClick={onClose}
          position="fixed"
          top={{ base: 3, md: 5 }}
          right={{ base: 3, md: 5 }}
          zIndex={10}
          p={2}
          borderRadius="md"
          color={C}
          _hover={{ bg: `${C}22` }}
        >
          <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="26px" h="26px" fill={C}>
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
          </Box>
        </Box>

        {/* Fondo de psicología a pantalla completa */}
        <Box position="fixed" inset="0" pointerEvents="none" zIndex={0} bg={neuropsicologiaBg} overflow="hidden">
          <Box
            as="img"
            src={PSICOLOGIA_BG}
            alt=""
            loading="eager"
            position="absolute"
            inset="0"
            w="100%"
            h="100%"
            style={{ objectFit: "cover", objectPosition: "center", opacity: 0.9, transform: "scale(1.05)" }}
          />
          <Box position="absolute" inset="0" style={{ background: `radial-gradient(ellipse at center, ${neuropsicologiaBg}40 0%, ${neuropsicologiaBg}b3 72%, ${neuropsicologiaBg}e6 100%)` }} />
        </Box>

        <ModalBody
          position="relative"
          zIndex={2}
          w="100%"
          px={{ base: 5, md: 10 }}
          pt={{ base: 16, md: 14 }}
          pb={{ base: 10, md: 14 }}
          display="flex"
          flexDirection="column"
          alignItems="center"
          overflowY="auto"
          overflowX="hidden"
          sx={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}
        >
          <Flex direction="column" align="center" gap={{ base: 8, md: 10 }} w="100%" maxW="1280px" mx="auto" mt={{ base: 6, md: 4 }} mb={{ base: 10, md: 8 }}>
            {/* Título */}
            <Flex direction="column" align="center" gap={2}>
              <Text
                color={C}
                fontSize={{ base: "2xl", md: "4xl" }}
                fontWeight="700"
                letterSpacing="0.2em"
                textTransform="uppercase"
                textAlign="center"
                lineHeight="1.15"
                style={{ textShadow: `0 0 14px ${neuropsicologiaBg}cc, 0 0 32px ${neuropsicologiaBg}77, 0 0 70px ${neuropsicologiaBg}44` }}
              >
                Cursos orientativos de Psicología
              </Text>
            </Flex>

            {/* Rejilla de cursos */}
            {loading ? (
              <Spinner color={C} size="lg" thickness="3px" speed="0.7s" />
            ) : cursos.length > 0 ? (
              <SimpleGrid w="100%" columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 7 }} alignItems="start">
                {cursos.map((curso, i) => (
                  <CursoCard key={curso.id} curso={curso} onAcceder={() => acceder(curso)} delay={`${i * 0.07}s`} />
                ))}
              </SimpleGrid>
            ) : (
              <Text color={`${C}dd`} fontSize={{ base: "md", md: "lg" }} fontStyle="italic" textAlign="center" style={{ textShadow: `0 0 10px ${neuropsicologiaBg}` }}>
                Pronto encontrarás aquí los cursos de Psicología.
              </Text>
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default CursosPsicologiaModal;
