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
import { ayurvedaBg, ayurvedaTxt } from "../../GlobalVariables";
import { ComicViewer } from "./ComicViewer";
import type { Vineta } from "./ComicViewer";

// ────────────────────────────────────────────────────────────────────────────
// CONTENIDO DE LOS 2 SUB-CÓMICS DE HINDUISMO
// (Pendiente de recibir fotos y textos definitivos. Cada capítulo arranca con
//  una viñeta placeholder para que el ComicViewer no rompa.)
// ────────────────────────────────────────────────────────────────────────────

const VINETAS_ELEMENTOS: Vineta[] = [
  {
    src: "",
    paragraphs: [
      "Próximamente.",
      "Aquí irán las viñetas de Los Elementos.",
    ],
  },
];

const VINETAS_DOSHAS: Vineta[] = [
  {
    src: "",
    paragraphs: [
      "Próximamente.",
      "Aquí irán las viñetas de Los Doshas.",
    ],
  },
];

type Capitulo = "los_elementos" | "los_doshas";

const VINETAS_BY_CAPITULO: Record<Capitulo, Vineta[]> = {
  los_elementos: VINETAS_ELEMENTOS,
  los_doshas: VINETAS_DOSHAS,
};

const SELECTOR_OPTIONS: { key: Capitulo; title: string }[] = [
  { key: "los_elementos", title: "Los Elementos" },
  { key: "los_doshas",    title: "Los Doshas"    },
];

interface HinduismoIlustracionesModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Opcional: se llama cuando el usuario completa un capítulo con la flecha final. */
  onComplete?: () => void;
}

export function HinduismoIlustracionesModal({
  isOpen,
  onClose,
  onComplete,
}: HinduismoIlustracionesModalProps) {
  const [capitulo, setCapitulo] = useState<Capitulo | null>(null);

  // Al abrir el modal, siempre volvemos al selector de capítulos.
  useEffect(() => {
    if (isOpen) setCapitulo(null);
  }, [isOpen]);

  const volverAlSelector = () => setCapitulo(null);
  const elegirCapitulo = (key: Capitulo) => setCapitulo(key);

  const vinetas = capitulo ? VINETAS_BY_CAPITULO[capitulo] : [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered scrollBehavior={capitulo ? "outside" : "inside"}>
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
        {/* Fondo: foto de Hinduismo blureada, presente, ocupando todo el
            espacio sin hacer zoom obvio. El inset negativo discreto compensa
            los bordes blandos del blur sin agrandar visiblemente la imagen. */}
        <Box
          position="fixed"
          inset="0"
          pointerEvents="none"
          zIndex={0}
          bg={ayurvedaBg}
          overflow="hidden"
        >
          <Box
            as="img"
            src="/img/fondos/hinduismo.png"
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
          <Box position="absolute" inset="0" bg={`${ayurvedaBg}55`} />
        </Box>

        {/* X cerrar — siempre visible */}
        <IconButton
          aria-label="Cerrar"
          onClick={onClose}
          position="fixed"
          top={{ base: 3, md: 5 }}
          right={{ base: 3, md: 5 }}
          zIndex={10}
          variant="ghost"
          color={ayurvedaTxt}
          _hover={{ bg: `${ayurvedaTxt}22` }}
          icon={
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="24px" h="24px" fill={ayurvedaTxt}>
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
                  color={ayurvedaTxt}
                  fontSize={{ base: "2xl", md: "4xl" }}
                  fontWeight="700"
                  letterSpacing="0.2em"
                  textTransform="uppercase"
                  textAlign="center"
                  lineHeight="1.1"
                  style={{
                    textShadow: `0 0 14px ${ayurvedaTxt}cc, 0 0 32px ${ayurvedaTxt}77, 0 0 70px ${ayurvedaTxt}44`,
                  }}
                >
                  Ilustraciones de Hinduismo
                </Text>
                <Text
                  color={`${ayurvedaTxt}cc`}
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
                    border={`1px solid ${ayurvedaTxt}55`}
                    bg="rgba(255,255,255,0.08)"
                    cursor="pointer"
                    fontFamily="'EB Garamond', serif"
                    sx={{
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      transition: "all 0.25s ease",
                      boxShadow: `0 0 18px ${ayurvedaTxt}33, 0 0 42px ${ayurvedaTxt}1f, inset 0 0 24px rgba(255,255,255,0.04)`,
                      _hover: {
                        transform: "translateY(-4px)",
                        borderColor: ayurvedaTxt,
                        boxShadow: `0 0 28px ${ayurvedaTxt}99, 0 0 70px ${ayurvedaTxt}55, inset 0 0 24px rgba(255,255,255,0.08)`,
                      },
                      _active: { transform: "translateY(-1px)" },
                    }}
                  >
                    <Flex direction="column" align="center" gap={2}>
                      <Text
                        color={ayurvedaTxt}
                        fontSize={{ base: "xl", md: "2xl" }}
                        fontWeight="700"
                        letterSpacing="0.18em"
                        textTransform="uppercase"
                        textAlign="center"
                        lineHeight="1.1"
                        style={{
                          textShadow: `0 0 12px ${ayurvedaTxt}cc, 0 0 28px ${ayurvedaTxt}77`,
                        }}
                      >
                        {opt.title}
                      </Text>
                      <Flex
                        align="center"
                        gap={1.5}
                        mt={2}
                        color={ayurvedaTxt}
                        fontSize={{ base: "xs", md: "sm" }}
                        letterSpacing="0.18em"
                        textTransform="uppercase"
                        style={{ textShadow: `0 0 10px ${ayurvedaTxt}aa` }}
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
            themeColor={ayurvedaTxt}
            disciplinaBgImage="/img/fondos/hinduismo.png"
            disciplinaBgColor={ayurvedaBg}
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
