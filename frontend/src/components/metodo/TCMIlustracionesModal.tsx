import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { tcmBg, tcmTxt } from "../../GlobalVariables";
import { ComicViewer } from "./ComicViewer";
import type { Vineta } from "./ComicViewer";

// ────────────────────────────────────────────────────────────────────────────
// CONTENIDO DE LOS CAPÍTULOS DE MEDICINA CHINA
// (Pendiente de recibir fotos y textos. Cada capítulo arranca con una viñeta
//  placeholder para que el ComicViewer no rompa.)
// ────────────────────────────────────────────────────────────────────────────

const VINETAS_ELEMENTOS: Vineta[] = [
  {
    src: "",
    paragraphs: [
      "Próximamente.",
      "Aquí irán las viñetas de Los Cinco Elementos.",
    ],
  },
];

const VINETAS_YIN_YANG: Vineta[] = [
  {
    src: "",
    paragraphs: [
      "Próximamente.",
      "Aquí irán las viñetas de El Yin Yang.",
    ],
  },
];

type Capitulo = "los_elementos" | "yin_yang";

const VINETAS_BY_CAPITULO: Record<Capitulo, Vineta[]> = {
  los_elementos: VINETAS_ELEMENTOS,
  yin_yang:      VINETAS_YIN_YANG,
};

const SELECTOR_OPTIONS: { key: Capitulo; title: string }[] = [
  { key: "los_elementos", title: "Los Cinco Elementos" },
  { key: "yin_yang",      title: "El Yin Yang" },
];

interface TCMIlustracionesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export function TCMIlustracionesModal({
  isOpen,
  onClose,
  onComplete,
}: TCMIlustracionesModalProps) {
  const [capitulo, setCapitulo] = useState<Capitulo | null>(null);

  useEffect(() => {
    if (isOpen) setCapitulo(null);
  }, [isOpen]);

  const volverAlSelector = () => setCapitulo(null);
  const elegirCapitulo = (key: Capitulo) => setCapitulo(key);

  const vinetas = capitulo ? VINETAS_BY_CAPITULO[capitulo] : [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
      <ModalOverlay bg="rgba(0,0,0,0.85)" sx={{ backdropFilter: "blur(20px)" }} />
      <ModalContent
        bg="transparent"
        border="none"
        borderRadius="0"
        boxShadow="none"
        m={0}
        fontFamily="'EB Garamond', serif"
        overflow={capitulo ? "hidden" : undefined}
        minH="100vh"
        position="relative"
      >
        {/* Fondo: foto de TCM blureada, ocupando todo el espacio sin zoom. */}
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
            style={{
              objectFit: "cover",
              objectPosition: "center",
              filter: "blur(8px)",
            }}
          />
          <Box position="absolute" inset="0" bg={`${tcmBg}55`} />
        </Box>

        {/* X cerrar */}
        <IconButton
          aria-label="Cerrar"
          onClick={onClose}
          position="fixed"
          top={{ base: 3, md: 5 }}
          right={{ base: 3, md: 5 }}
          zIndex={10}
          variant="ghost"
          color={tcmTxt}
          _hover={{ bg: `${tcmTxt}22` }}
          icon={
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="24px" h="24px" fill={tcmTxt}>
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </Box>
          }
        />

        {/* ── VISTA SELECTOR ── */}
        {!capitulo && (
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
            justifyContent={{ base: "flex-start", md: "center" }}
            minH={{ base: "auto", md: "100vh" }}
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
                  Ilustraciones de Medicina China
                </Text>
                <Text
                  color={`${tcmTxt}cc`}
                  fontSize={{ base: "sm", md: "md" }}
                  fontStyle="italic"
                  letterSpacing="0.08em"
                  textAlign="center"
                  maxW="520px"
                >
                  Elige un capítulo para empezar a leer.
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
                {SELECTOR_OPTIONS.map((opt) => (
                  <Box
                    key={opt.key}
                    as="button"
                    onClick={() => elegirCapitulo(opt.key)}
                    position="relative"
                    flex="1"
                    w="100%"
                    minW={{ base: "auto", sm: "280px", md: "300px" }}
                    maxW={{ base: "300px", md: "360px" }}
                    py={{ base: 10, md: 14 }}
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
                    <Flex direction="column" align="center" gap={2}>
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
                        {opt.title}
                      </Text>
                      <Flex
                        align="center"
                        gap={1.5}
                        mt={2}
                        color={tcmTxt}
                        fontSize={{ base: "xs", md: "sm" }}
                        letterSpacing="0.18em"
                        textTransform="uppercase"
                        style={{ textShadow: `0 0 10px ${tcmTxt}aa` }}
                      >
                        <Text as="span">Leer</Text>
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
        )}

        {/* ── VISTA CÓMIC ── */}
        {capitulo && (
          <ComicViewer
            key={capitulo}
            vinetas={vinetas}
            themeColor={tcmTxt}
            onClose={onClose}
            onBack={volverAlSelector}
            onComplete={() => {
              if (onComplete) onComplete();
              volverAlSelector();
            }}
          />
        )}
      </ModalContent>
    </Modal>
  );
}
