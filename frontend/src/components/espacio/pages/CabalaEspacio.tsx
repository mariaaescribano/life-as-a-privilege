import React, { useEffect, useState } from "react";
import {
  Box, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay,
  Text, VStack,
} from "@chakra-ui/react";
import SiteHeader from "../../global/SiteHeader";
import SiteFooter from "../../global/Footer";
import { DisciplineHeader } from "../../global/DisciplineHeader";
import { CabalaIcon, cabalaNom, cabalaBg, cabalaTxt } from "../../../GlobalVariables";
import { SolicitarAutoevaluacionButton } from "../../global/SolicitarAutoevaluacionButton";
import ArbolDeLaVida, { type Sefira } from "../../global/ArbolDeLaVida";
import { testCabala, type TestSefirot } from "../../../hardCoded/espacio/TestCabala";

// ─────────────────────────────────────────────────────────
//  TEST COMPONENT
// ─────────────────────────────────────────────────────────
function CabalaTest({ datos }: { datos: TestSefirot }) {
  const [fase, setFase]       = useState<"intro" | "test" | "resultado">("intro");
  const [idx, setIdx]         = useState(0);
  const [respuestas, setResp] = useState<number[]>([]);
  const [visible, setVisible] = useState(true);

  // animated transition between questions
  const goNext = (puntos: number) => {
    const nuevas = [...respuestas, puntos];
    setVisible(false);
    setTimeout(() => {
      setResp(nuevas);
      if (idx + 1 < datos.preguntas.length) {
        setIdx(idx + 1);
      } else {
        setFase("resultado");
      }
      setVisible(true);
    }, 260);
  };

  const reiniciar = () => {
    setFase("intro");
    setIdx(0);
    setResp([]);
    setVisible(true);
  };

  const total = respuestas.reduce((a, b) => a + b, 0);
  const nivel = datos.niveles.find(n => total >= n.rango[0] && total <= n.rango[1]) ?? datos.niveles[2];

  // ── INTRO ──────────────────────────────────────────────
  if (fase === "intro") {
    return (
      <Box>
        <Box
          h="1px" mb={5}
          style={{ background: `linear-gradient(90deg, transparent, ${cabalaTxt}33, transparent)` }}
        />
        <Text
          color={`${cabalaTxt}88`}
          fontSize="xs"
          letterSpacing="0.14em"
          textTransform="uppercase"
          fontFamily="'EB Garamond', serif"
          mb={3}
        >
          Autoconocimiento · {datos.preguntas.length} preguntas
        </Text>
        <Text
          color={`${cabalaTxt}cc`}
          fontSize={{ base: "md", md: "lg" }}
          fontFamily="'EB Garamond', serif"
          lineHeight="1.85"
          mb={6}
        >
          {datos.introduccion}
        </Text>
        <Box
          as="button"
          onClick={() => setFase("test")}
          w="100%"
          py={3}
          borderRadius="xl"
          bg={`${cabalaTxt}18`}
          border={`1.5px solid ${cabalaTxt}55`}
          color={cabalaTxt}
          fontFamily="'EB Garamond', serif"
          fontSize="md"
          fontWeight="600"
          letterSpacing="0.06em"
          cursor="pointer"
          transition="all 0.2s"
          _hover={{ bg: `${cabalaTxt}28`, borderColor: cabalaTxt }}
        >
          Comenzar el test →
        </Box>
      </Box>
    );
  }

  // ── TEST ───────────────────────────────────────────────
  if (fase === "test") {
    const pregunta = datos.preguntas[idx];
    return (
      <Box
        opacity={visible ? 1 : 0}
        transform={visible ? "translateY(0)" : "translateY(10px)"}
        transition="opacity 0.25s ease, transform 0.25s ease"
      >
        <Box
          h="1px" mb={5}
          style={{ background: `linear-gradient(90deg, transparent, ${cabalaTxt}33, transparent)` }}
        />
        {/* Progress */}
        <Flex align="center" gap={3} mb={5}>
          {datos.preguntas.map((_, i) => (
            <Box
              key={i}
              flex={1}
              h="3px"
              borderRadius="full"
              bg={i <= idx ? cabalaTxt : `${cabalaTxt}22`}
              transition="background 0.3s"
            />
          ))}
          <Text
            color={`${cabalaTxt}66`}
            fontSize="xs"
            fontFamily="'EB Garamond', serif"
            flexShrink={0}
          >
            {idx + 1}/{datos.preguntas.length}
          </Text>
        </Flex>

        {/* Question */}
        <Text
          color={cabalaTxt}
          fontSize={{ base: "lg", md: "xl" }}
          fontFamily="'EB Garamond', serif"
          fontWeight="600"
          lineHeight="1.6"
          mb={5}
          style={{ textShadow: `0 0 20px ${cabalaTxt}44` }}
        >
          {pregunta.pregunta}
        </Text>

        {/* Options */}
        <VStack spacing={2} align="stretch">
          {pregunta.opciones.map((op) => (
            <Box
              key={op.letra}
              as="button"
              onClick={() => goNext(op.puntos)}
              display="flex"
              alignItems="flex-start"
              gap={3}
              px={4}
              py={3}
              borderRadius="xl"
              bg={`${cabalaTxt}0a`}
              border={`1px solid ${cabalaTxt}22`}
              textAlign="left"
              cursor="pointer"
              transition="all 0.18s"
              _hover={{ bg: `${cabalaTxt}20`, borderColor: `${cabalaTxt}66`, transform: "translateX(3px)" }}
            >
              <Box
                flexShrink={0}
                w="22px" h="22px"
                borderRadius="full"
                bg={`${cabalaTxt}18`}
                border={`1.5px solid ${cabalaTxt}55`}
                display="flex" alignItems="center" justifyContent="center"
                mt="1px"
              >
                <Text
                  color={cabalaTxt}
                  fontSize="10px"
                  fontWeight="700"
                  fontFamily="'EB Garamond', serif"
                >
                  {op.letra}
                </Text>
              </Box>
              <Text
                color={`${cabalaTxt}cc`}
                fontSize={{ base: "sm", md: "md" }}
                fontFamily="'EB Garamond', serif"
                lineHeight="1.55"
              >
                {op.texto}
              </Text>
            </Box>
          ))}
        </VStack>
      </Box>
    );
  }

  // ── RESULTADO ──────────────────────────────────────────
  return (
    <Box
      opacity={visible ? 1 : 0}
      transition="opacity 0.35s ease"
    >
      <Box
        h="1px" mb={5}
        style={{ background: `linear-gradient(90deg, transparent, ${cabalaTxt}55, transparent)` }}
      />
      {/* Nivel badge */}
      <Flex justify="center" mb={4}>
        <Box
          px={5} py={1.5}
          borderRadius="full"
          bg={`${cabalaTxt}18`}
          border={`1.5px solid ${cabalaTxt}66`}
          boxShadow={`0 0 18px ${cabalaTxt}44`}
        >
          <Text
            color={cabalaTxt}
            fontSize="sm"
            fontWeight="700"
            fontFamily="'EB Garamond', serif"
            letterSpacing="0.08em"
            style={{ textShadow: `0 0 10px ${cabalaTxt}88` }}
          >
            {nivel.etiqueta}
          </Text>
        </Box>
      </Flex>

      {/* Message */}
      <Box
        bg={`${cabalaTxt}0c`}
        border={`1px solid ${cabalaTxt}22`}
        borderRadius="xl"
        px={{ base: 4, md: 5 }}
        py={4}
        mb={4}
      >
        <Text
          color={`${cabalaTxt}cc`}
          fontSize={{ base: "md", md: "lg" }}
          fontFamily="'EB Garamond', serif"
          lineHeight="1.85"
        >
          {nivel.mensaje}
        </Text>
      </Box>

      {/* Consejo */}
      <Flex gap={3} align="flex-start" mb={6}>
        <Box
          flexShrink={0}
          w="3px"
          alignSelf="stretch"
          borderRadius="full"
          bg={`${cabalaTxt}55`}
        />
        <Text
          color={`${cabalaTxt}88`}
          fontSize={{ base: "sm", md: "md" }}
          fontFamily="'EB Garamond', serif"
          fontStyle="italic"
          lineHeight="1.75"
        >
          {nivel.consejo}
        </Text>
      </Flex>

      {/* Reiniciar */}
      <Box
        as="button"
        onClick={reiniciar}
        w="100%"
        py={3}
        borderRadius="xl"
        bg="transparent"
        border={`1px solid ${cabalaTxt}33`}
        color={`${cabalaTxt}77`}
        fontFamily="'EB Garamond', serif"
        fontSize="sm"
        letterSpacing="0.06em"
        cursor="pointer"
        transition="all 0.18s"
        _hover={{ bg: `${cabalaTxt}0e`, borderColor: `${cabalaTxt}55`, color: cabalaTxt }}
      >
        Repetir el test
      </Box>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────
//  PÁGINA PRINCIPAL
// ─────────────────────────────────────────────────────────
export default function CabalaEspacio() {
  const [sefiraAbierta, setSefiraAbierta] = useState<Sefira | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const testDatos = sefiraAbierta ? testCabala[sefiraAbierta.key] : null;

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="#008080" fontFamily="'EB Garamond', serif">
      <SiteHeader variant="auto" />

      <Box flex="1">
        <Flex
          direction="column" alignItems="center"
          px={{ base: 5, md: 10, lg: 16 }}
          pt={{ base: 10, md: 14 }}
          pb={{ base: 14, md: 20 }}
        >
          <DisciplineHeader
            icon={<CabalaIcon size={{ base: "40px", md: "56px" }} />}
            title={cabalaNom}
            bgColor={cabalaBg}
            color={cabalaTxt}
            maxW="900px"
          />

          <Box
            w="100%"
            maxW="900px"
            boxShadow="0 4px 20px rgba(0,0,0,0.22), 0 0 22px rgba(107,196,200,0.8)"
            bg={cabalaBg}
            border={`1.5px solid ${cabalaTxt}55`}
            borderRadius="3xl"
            px={{ base: 6, md: 10 }}
            pt={{ base: 8, md: 10 }}
            pb={{ base: 8, md: 10 }}
          >
            <ArbolDeLaVida
              suppressInternalModal
              onSefiraClick={(s) => setSefiraAbierta(s)}
            />
          </Box>
        </Flex>
      </Box>

      {/* ── Modal de sefirá con test ── */}
      <Modal
        isOpen={sefiraAbierta !== null}
        onClose={() => setSefiraAbierta(null)}
        size="xl"
        scrollBehavior="inside"
        isCentered
      >
        <ModalOverlay bg="rgba(0,0,0,0.82)" backdropFilter="blur(4px)" />
        <ModalContent
          bg={cabalaBg}
          border={`1.5px solid ${cabalaTxt}55`}
          borderRadius="2xl"
          overflow="hidden"
          boxShadow={`0 0 60px ${cabalaTxt}33, 0 12px 40px rgba(0,0,0,0.7)`}
          mx={{ base: 4, md: "auto" }}
          my="auto"
          maxW={{ base: "calc(100% - 2rem)", md: "xl" }}
          fontFamily="'EB Garamond', serif"
        >
          <ModalCloseButton color={cabalaTxt} top={3} right={3} />

          {/* Línea de brillo superior */}
          <Box
            h="2px"
            style={{ background: `linear-gradient(90deg, transparent, ${cabalaTxt}88, transparent)` }}
          />

          <ModalBody px={{ base: 6, md: 8 }} pt={7} pb={8}>
            {sefiraAbierta && testDatos && (
              <VStack align="stretch" spacing={4}>

                {/* Cabecera de la sefirá */}
                <Box>
                  <Flex align="center" gap={3} mb={2}>
                    <CabalaIcon size={{ base: "22px", md: "28px" }} />
                    <Box>
                      <Text
                        color={cabalaTxt}
                        fontSize={{ base: "2xl", md: "3xl" }}
                        fontWeight="700"
                        letterSpacing="0.04em"
                        lineHeight="1"
                        style={{ textShadow: `0 0 20px ${cabalaTxt}77` }}
                      >
                        {sefiraAbierta.hebrewName}
                      </Text>
                      <Text
                        color={`${cabalaTxt}66`}
                        fontSize="xs"
                        letterSpacing="0.14em"
                        textTransform="uppercase"
                        fontFamily="'EB Garamond', serif"
                        mt="2px"
                      >
                        {testDatos.subtitulo}
                      </Text>
                    </Box>
                  </Flex>
                </Box>

                {/* Test interactivo */}
                <CabalaTest key={sefiraAbierta.key} datos={testDatos} />

              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <SolicitarAutoevaluacionButton
        bgColor={cabalaBg}
        color={cabalaTxt}
        icon={<CabalaIcon size={{base:"30px", md: "50px"}}  />}
        disciplineName="Cábala"
      />

      <SiteFooter />
    </Box>
  );
}
