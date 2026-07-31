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
import { cabalaBg, cabalaTxt } from "../../GlobalVariables";
import { CAJA_GLOW, CAJA_GLOW_HOVER } from "./cabalaGlow";
import { ComicViewer } from "./ComicViewer";
import type { Vineta } from "./ComicViewer";
import { CABALA_INTRO } from "./comicCabalaIntro";
import { CABALA_ILUSTRACIONES_VINETAS } from "./cabalaIlustraciones";
import { CABALA_SENDERO_VINETAS } from "./cabalaSenderoIlustraciones";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import { comicLoaderPorColor } from "./comicLoaders";

// ─────────────────────────────────────────────────────────────────────────
// Popup "Ilustraciones de Cábala". Se abre desde el botón "Ilustraciones" del
// header de Cábala (en cualquier página de la disciplina). Es una GALERÍA de
// solo lectura: no marca progreso.
//
// Mismo patrón que Astrología / Ayurveda / Medicina China: modal a pantalla
// completa con el fondo de la disciplina, una rejilla de portadas para elegir
// capítulo y, al pulsar, el ComicViewer con las viñetas en orden.
// ─────────────────────────────────────────────────────────────────────────

const CABALA_IMG = "/img/fondos/cabala.webp";

type Capitulo = "origen" | "sefirot" | "senderos";

const VINETAS_BY_CAPITULO: Record<Capitulo, Vineta[]> = {
  origen:   CABALA_INTRO,
  sefirot:  CABALA_ILUSTRACIONES_VINETAS,
  senderos: CABALA_SENDERO_VINETAS,
};

const SELECTOR_OPTIONS: { key: Capitulo; title: string; cover?: string }[] = [
  { key: "origen",   title: "El Origen",        cover: CABALA_INTRO[0]?.src },
  { key: "sefirot",  title: "Las 10 Sefirot",   cover: CABALA_ILUSTRACIONES_VINETAS[0]?.src },
  { key: "senderos", title: "Los 22 Senderos",  cover: CABALA_SENDERO_VINETAS[0]?.src },
];

interface CabalaIlustracionesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export function CabalaIlustracionesModal({ isOpen, onClose, onComplete }: CabalaIlustracionesModalProps) {
  const [capitulo, setCapitulo] = useState<Capitulo | null>(null);

  useEffect(() => {
    if (isOpen) setCapitulo(null);
  }, [isOpen]);

  const volverAlSelector = () => setCapitulo(null);
  const elegirCapitulo = (key: Capitulo) => setCapitulo(key);

  const vinetas = capitulo ? VINETAS_BY_CAPITULO[capitulo] : [];

  // No mostramos nada hasta que el fondo (cabala.png) y las portadas del
  // selector estén cargadas: mientras tanto solo el loader, para que luego
  // aparezca todo a la vez (fondo + tarjetas).
  const fondosListos = usePrecargarImagenes(
    isOpen ? [CABALA_IMG, ...SELECTOR_OPTIONS.map((o) => o.cover).filter(Boolean) as string[]] : [],
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered scrollBehavior={capitulo ? "outside" : "inside"}>
      {/* La foto de fondo va en el OVERLAY (cubre el viewport SIEMPRE). */}
      <ModalOverlay
        bg={cabalaBg}
        sx={fondosListos ? {
          backgroundImage: `linear-gradient(${cabalaBg}66, ${cabalaBg}66), url('${CABALA_IMG}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        } : undefined}
      />
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
        {!fondosListos && (
          <Flex position="relative" zIndex={2} minH="100vh" align="center" justify="center">
            {comicLoaderPorColor(cabalaTxt)}
          </Flex>
        )}

        {fondosListos && (<>

        {/* X cerrar */}
        <IconButton
          aria-label="Cerrar"
          onClick={onClose}
          position="fixed"
          top={{ base: 3, md: 5 }}
          right={{ base: 3, md: 5 }}
          zIndex={10}
          variant="ghost"
          color={cabalaTxt}
          _hover={{ bg: `${cabalaTxt}22` }}
          icon={
            <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="24px" h="24px" fill={cabalaTxt}>
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
                  color={cabalaTxt}
                  fontSize={{ base: "2xl", md: "4xl" }}
                  fontWeight="700"
                  letterSpacing="0.2em"
                  textTransform="uppercase"
                  textAlign="center"
                  lineHeight="1.1"
                  style={{ textShadow: `0 0 14px ${cabalaTxt}cc, 0 0 32px ${cabalaTxt}77, 0 0 70px ${cabalaTxt}44` }}
                >
                  Ilustraciones de Cábala
                </Text>
                <Text
                  color={`${cabalaTxt}cc`}
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
                    display="flex"
                    flexDirection="column"
                    flex="1"
                    w="100%"
                    p={0}
                    minW={{ base: "auto", sm: "280px", md: "300px" }}
                    maxW={{ base: "300px", md: "360px" }}
                    borderRadius="2xl"
                    overflow="hidden"
                    border={`1px solid ${cabalaTxt}55`}
                    bg={cabalaBg}
                    cursor="pointer"
                    fontFamily="'EB Garamond', serif"
                    sx={{
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      transition: "all 0.25s ease",
                      boxShadow: CAJA_GLOW,
                      _hover: {
                        transform: "translateY(-4px)",
                        borderColor: cabalaTxt,
                        boxShadow: CAJA_GLOW_HOVER,
                      },
                      _active: { transform: "translateY(-1px)" },
                    }}
                  >
                    {opt.cover && (
                      <Box
                        position="relative"
                        w="100%"
                        aspectRatio={1}
                        overflow="hidden"
                        borderBottom={`1px solid ${cabalaTxt}44`}
                        bg={cabalaBg}
                      >
                        <Box
                          as="img"
                          src={encodeURI(opt.cover)}
                          alt={opt.title}
                          loading="eager"
                          position="absolute"
                          inset="0"
                          w="100%"
                          h="100%"
                          style={{ objectFit: "cover", objectPosition: "center" }}
                        />
                      </Box>
                    )}
                    <Flex
                      direction="column"
                      align="center"
                      gap={1}
                      py={opt.cover ? { base: 4, md: 5 } : { base: 10, md: 14 }}
                      px={3}
                    >
                      <Text
                        color={cabalaTxt}
                        fontSize={{ base: "xl", md: "2xl" }}
                        fontWeight="700"
                        letterSpacing="0.18em"
                        textTransform="uppercase"
                        textAlign="center"
                        lineHeight="1.1"
                        style={{ textShadow: `0 0 12px ${cabalaTxt}cc, 0 0 28px ${cabalaTxt}77` }}
                      >
                        {opt.title}
                      </Text>
                      <Flex
                        align="center"
                        gap={1.5}
                        mt={2}
                        color={cabalaTxt}
                        fontSize={{ base: "xs", md: "sm" }}
                        letterSpacing="0.18em"
                        textTransform="uppercase"
                        style={{ textShadow: `0 0 10px ${cabalaTxt}aa` }}
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
            themeColor={cabalaTxt}
            textColor={cabalaTxt}
            disciplinaBgImage={CABALA_IMG}
            disciplinaBgColor={cabalaBg}
            onClose={onClose}
            onBack={volverAlSelector}
            onComplete={() => {
              if (onComplete) onComplete();
              volverAlSelector();
            }}
          />
        )}
        </>)}
      </ModalContent>
    </Modal>
  );
}

export default CabalaIlustracionesModal;
