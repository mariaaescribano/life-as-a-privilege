import React, { useState } from "react";
import {
  Box, Flex, Text, Button, VStack, HStack, SimpleGrid,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  useDisclosure, Divider,
} from "@chakra-ui/react";
import {
  Brain, Heart, Wind, Flame, CircleDot, RefreshCw, Droplets, Shield,
} from "lucide-react";
import SiteHeader from "../../global/SiteHeader";
import SiteFooter from "../../global/Footer";
import { DisciplineHeader } from "../../global/DisciplineHeader";
import { fisiologiaBg, FisiologiaIcon, fisiologiaNom, fisiologiaTxt } from "../../../GlobalVariables";
import { useNavigate } from "react-router-dom";
import { type Organo } from "../../../hardCoded/espacio/OrganosFisiologia";
import { useOrganosFisiologia } from "../../../hardCoded/espacio/useOrganosFisiologia";
import { useT } from "../../../i18n";
import { useNombreDisciplina } from "../../../i18n/nombreDisciplina";

const ORGAN_ICONS: Record<string, React.ReactNode> = {
  cerebro:   <Brain   size={48} />,
  corazon:   <Heart   size={48} />,
  pulmones:  <Wind    size={48} />,
  higado:    <Flame   size={48} />,
  estomago:  <CircleDot size={48} />,
  intestinos:<RefreshCw size={48} />,
  rinones:   <Droplets size={48} />,
  bazo:      <Shield  size={48} />,
};

const FisiologiaEspacio = () => {
  const navigate = useNavigate();
  const t = useT();
  const nombreDisciplina = useNombreDisciplina();
  // Los órganos en el idioma activo (el texto; la lógica del test la manda
  // siempre el fichero español).
  const organosFisiologia = useOrganosFisiologia();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [organo, setOrgano] = useState<Organo | null>(null);
  const [pregIdx, setPregIdx] = useState(0);
  const [siCount, setSiCount] = useState(0);
  const [fase, setFase] = useState<"test" | "resultado">("test");

  const abrirOrgano = (o: Organo) => {
    setOrgano(o);
    setPregIdx(0);
    setSiCount(0);
    setFase("test");
    onOpen();
  };

  const responder = (esSi: boolean) => {
    if (!organo) return;
    const nuevoSi = siCount + (esSi ? 1 : 0);
    const siguiente = pregIdx + 1;
    if (siguiente >= organo.preguntas.length) {
      setSiCount(nuevoSi);
      setFase("resultado");
    } else {
      setSiCount(nuevoSi);
      setPregIdx(siguiente);
    }
  };

  const reiniciar = () => {
    setPregIdx(0);
    setSiCount(0);
    setFase("test");
  };

  const hayDesequilibrio = organo && siCount >= organo.umbral;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="private" />

      <Box flex="1" px={{ base: 4, md: 8, lg: 16 }} pt={{ base: 6, md: 10 }} pb={12}>

        <Flex direction="column" alignItems="center">
          <DisciplineHeader
            icon={<FisiologiaIcon size={{ base: "40px", md: "52px" }} />}
            title={nombreDisciplina(fisiologiaNom)}
            bgColor={fisiologiaBg}
            color={fisiologiaTxt}
            maxW="900px"
            mb={{ base: 5, md: 6 }}
          />

          {/* Botón: Las células de tu cuerpo */}
          <Flex
            as="button"
            align="center"
            gap={3}
            px={{ base: 7, md: 10 }}
            py={{ base: 3, md: 4 }}
            mb={{ base: 6, md: 8 }}
            borderRadius="full"
            bg={fisiologiaBg}
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
            <Box display="flex" alignItems="center" flexShrink={0}>
              <FisiologiaIcon size="22px" />
            </Box>
            <Text
              color={fisiologiaTxt}
              fontFamily="'EB Garamond', serif"
              fontWeight="700"
              fontSize={{ base: "lg", md: "xl" }}
              letterSpacing="0.08em"
              lineHeight="1"
            >
              {t("espacio.fisio.celulas")}
            </Text>
          </Flex>
        </Flex>

        {/* Grid de cards */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} maxW="900px" mx="auto">
          {organosFisiologia.map((o) => (
            <Box
              key={o.id}
              bg={fisiologiaBg}
              borderRadius="2xl"
              p={6}
              cursor="pointer"
              onClick={() => abrirOrgano(o)}
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={3}
              boxShadow="0 4px 20px rgba(0,0,0,0.15)"
              transition="transform 0.2s, box-shadow 0.2s"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: `0 8px 28px rgba(0,0,0,0.22), 0 0 20px ${fisiologiaTxt}33`,
              }}
              role="button"
              aria-label={o.nombre}
            >
              <Box color={fisiologiaTxt} opacity={0.9}>
                {ORGAN_ICONS[o.id]}
              </Box>
              <Text color={fisiologiaTxt} fontSize="xl" fontWeight="700" textAlign="center">
                {o.nombre}
              </Text>
              <Text color={fisiologiaTxt} fontSize="sm" opacity={0.7} textAlign="center" lineHeight="1.4">
                {o.descripcionCorta}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md" scrollBehavior="inside">
        <ModalOverlay backdropFilter="blur(6px)" bg="rgba(0,0,0,0.5)" />
        <ModalContent
          bg={fisiologiaBg}
          borderRadius="2xl"
          mx={4}
          fontFamily="'EB Garamond', serif"
          boxShadow={`0 0 40px ${fisiologiaTxt}44`}
        >
          <ModalHeader color={fisiologiaTxt} fontSize="xl" pb={1} display="flex" alignItems="center" gap={2}>
            {organo && ORGAN_ICONS[organo.id] && <Box color={fisiologiaTxt}>{ORGAN_ICONS[organo.id]}</Box>}
            {organo?.nombre}
          </ModalHeader>
          <ModalCloseButton color={fisiologiaTxt} />

          <ModalBody pb={6}>
            {/* ── FASE TEST ── */}
            {fase === "test" && organo && (
              <VStack spacing={5} align="stretch">
                <Flex align="center" gap={2}>
                  <Text fontSize="xs" color={fisiologiaTxt} opacity={0.65} whiteSpace="nowrap">
                    {pregIdx + 1} / {organo.preguntas.length}
                  </Text>
                  <Box flex="1" bg="rgba(0,0,0,0.1)" borderRadius="full" h="3px">
                    <Box
                      bg={fisiologiaTxt}
                      h="3px"
                      borderRadius="full"
                      transition="width 0.35s"
                      w={`${(pregIdx / organo.preguntas.length) * 100}%`}
                    />
                  </Box>
                </Flex>

                <Box minH="80px" display="flex" alignItems="center" justifyContent="center" px={2}>
                  <Text fontSize="lg" color={fisiologiaTxt} textAlign="center" lineHeight="1.5">
                    {organo.preguntas[pregIdx]}
                  </Text>
                </Box>

                <HStack spacing={4} justify="center" pt={1}>
                  <Button
                    onClick={() => responder(false)}
                    bg="white"
                    color={fisiologiaTxt}
                    border={`2px solid ${fisiologiaTxt}`}
                    borderRadius="xl"
                    px={10} h="48px"
                    fontSize="lg"
                    fontFamily="'EB Garamond', serif"
                    fontWeight="600"
                    _hover={{ bg: fisiologiaTxt, color: "white" }}
                    transition="all 0.2s"
                  >
                    {t("comun.no")}
                  </Button>
                  <Button
                    onClick={() => responder(true)}
                    bg={fisiologiaTxt}
                    color="white"
                    borderRadius="xl"
                    px={10} h="48px"
                    fontSize="lg"
                    fontFamily="'EB Garamond', serif"
                    fontWeight="600"
                    _hover={{ opacity: 0.82 }}
                    transition="all 0.2s"
                  >
                    {t("comun.si")}
                  </Button>
                </HStack>
              </VStack>
            )}

            {/* ── FASE RESULTADO ── */}
            {fase === "resultado" && organo && (
              <VStack spacing={4} align="stretch">
                {hayDesequilibrio ? (
                  <>
                    <Text fontSize="lg" color={fisiologiaTxt} fontWeight="700" textAlign="center">
                      {organo.resultado.titulo}
                    </Text>
                    <Text fontSize="sm" color={fisiologiaTxt} opacity={0.85} textAlign="center" lineHeight="1.6">
                      {organo.resultado.descripcion}
                    </Text>
                    <Divider borderColor={fisiologiaTxt} opacity={0.25} />
                    <Text fontSize="sm" color={fisiologiaTxt} fontWeight="700">
                      {t("espacio.fisio.plantas")}
                    </Text>
                    <VStack spacing={2} align="stretch">
                      {organo.resultado.plantas.map((p, i) => (
                        <Box key={i} bg="rgba(255,255,255,0.55)" borderRadius="xl" p={3}>
                          <Text fontSize="sm" color={fisiologiaTxt} fontWeight="700">{p.nombre}</Text>
                          <Text fontSize="xs" color={fisiologiaTxt} opacity={0.8} mt={0.5} lineHeight="1.5">{p.uso}</Text>
                        </Box>
                      ))}
                    </VStack>
                  </>
                ) : (
                  <VStack spacing={3} align="center" py={4}>
                    <Text fontSize="lg" color={fisiologiaTxt} fontWeight="700" textAlign="center">
                      {t("espacio.fisio.bien", { organo: organo.nombre.toLowerCase() })}
                    </Text>
                    <Text fontSize="sm" color={fisiologiaTxt} opacity={0.8} textAlign="center" lineHeight="1.6">
                      {t("espacio.fisio.bienTexto")}
                    </Text>
                  </VStack>
                )}

                <HStack spacing={3} pt={1}>
                  <Button
                    onClick={reiniciar}
                    flex="1"
                    variant="outline"
                    color={fisiologiaTxt}
                    borderColor={fisiologiaTxt}
                    borderRadius="xl"
                    fontFamily="'EB Garamond', serif"
                    fontSize="sm" h="42px"
                    _hover={{ bg: "rgba(0,0,0,0.06)" }}
                  >
                    {t("espacio.fisio.repetir")}
                  </Button>
                  <Button
                    onClick={onClose}
                    flex="1"
                    bg={fisiologiaTxt}
                    color="white"
                    borderRadius="xl"
                    fontFamily="'EB Garamond', serif"
                    fontSize="sm" h="42px"
                    _hover={{ opacity: 0.82 }}
                  >
                    {t("comun.cerrar")}
                  </Button>
                </HStack>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <SiteFooter />
    </Box>
  );
};

export default FisiologiaEspacio;
