import React, { useEffect, useState } from "react";
import { Box, Flex, Modal, ModalBody, ModalContent, ModalOverlay, Text } from "@chakra-ui/react";
import { cabalaBg, cabalaNom, cabalaTxt } from "../../GlobalVariables";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import type { Vineta } from "./ComicViewer";
import { CabalaSefiraIlustracionModal } from "./CabalaSefiraIlustracionModal";
import { CABALA_INTRO } from "./comicCabalaIntro";
import { CABALA_ILUSTRACIONES_VINETAS } from "./cabalaIlustraciones";
import { CABALA_SENDERO_VINETAS } from "./cabalaSenderoIlustraciones";

// ─────────────────────────────────────────────────────────────────────────
// Popup "Ilustraciones de Cábala". Se abre desde el botón "Ilustraciones" del
// header de Cábala (en cualquier página de la disciplina). Es una GALERÍA de
// solo lectura: no marca progreso (el desbloqueo del recorrido se hace en el
// Árbol / los Senderos, pinchando cada nodo).
//
// Muestra 3 cómics; al pulsar uno, sus viñetas se leen EN ORDEN a pantalla
// completa (mismo visor que el resto). Al cerrar el cómic se vuelve al hub.
// ─────────────────────────────────────────────────────────────────────────

type ComicItem = { key: string; titulo: string; descripcion: string; vinetas: Vineta[] };

const COMICS: ComicItem[] = [
  { key: "origen", titulo: "El Origen según la Cábala", descripcion: "Del Ein Sof al Árbol de la Vida.", vinetas: CABALA_INTRO },
  { key: "sefirot", titulo: "Las 10 Sefirot", descripcion: "Las diez esferas del Árbol.", vinetas: CABALA_ILUSTRACIONES_VINETAS },
  { key: "senderos", titulo: "Los 22 Senderos", descripcion: "Los caminos que unen las sefirot.", vinetas: CABALA_SENDERO_VINETAS },
];

export function CabalaIlustracionesModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const comic = COMICS.find((c) => c.key === selected) ?? null;

  // Al cerrar del todo el popup, se olvida la selección (vuelve al hub la próxima vez).
  useEffect(() => { if (!isOpen) setSelected(null); }, [isOpen]);

  // ── Vista cómic: viñetas EN ORDEN a pantalla completa. Al cerrar/terminar,
  //    se vuelve al hub (no se cierra del todo) para poder elegir otro. ──
  if (isOpen && comic) {
    return (
      <CabalaSefiraIlustracionModal
        isOpen
        vinetas={comic.vinetas}
        initialIndex={0}
        onClose={() => setSelected(null)}
        onComplete={() => setSelected(null)}
      />
    );
  }

  // ── Vista hub: título "Ilustraciones de Cábala" + los 3 cómics. ──
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "sm", md: "xl" }} isCentered scrollBehavior="inside">
      <ModalOverlay bg="rgba(0,0,0,0.82)" sx={{ backdropFilter: "blur(8px)" }} />
      <ModalContent bg="transparent" boxShadow="none" overflow="visible" mx={4} fontFamily="'EB Garamond', serif">
        <Box position="relative" borderRadius="2xl" overflow="hidden"
             boxShadow={`0 0 24px ${cabalaTxt}44, 0 0 60px ${cabalaTxt}22, 0 26px 70px rgba(0,0,0,0.6)`}>
          <DisciplinaBgLayer nom={cabalaNom} borderRadius="2xl" />

          {/* Cerrar */}
          <Box
            as="button"
            onClick={onClose}
            position="absolute"
            top={3}
            right={3}
            zIndex={3}
            w="30px"
            h="30px"
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg={`${cabalaBg}cc`}
            border={`1px solid ${cabalaTxt}44`}
            color={`${cabalaTxt}cc`}
            cursor="pointer"
            transition="all 0.15s"
            _hover={{ color: cabalaTxt, bg: cabalaBg, borderColor: cabalaTxt }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="14px" viewBox="0 -960 960 960" width="14px" fill="currentColor">
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          </Box>

          <ModalBody position="relative" zIndex={1} px={{ base: 6, md: 9 }} py={{ base: 9, md: 11 }}>
            <Flex direction="column" align="center" gap={2} textAlign="center" mb={{ base: 6, md: 7 }}>
              <Text
                color={cabalaTxt}
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="700"
                letterSpacing="0.16em"
                textTransform="uppercase"
                style={{ textShadow: `0 0 14px ${cabalaTxt}cc, 0 0 32px ${cabalaTxt}66` }}
              >
                Ilustraciones de Cábala
              </Text>
              <Box h="1px" w="60%" maxW="220px" style={{ background: `linear-gradient(90deg, transparent, ${cabalaTxt}66, transparent)` }} />
            </Flex>

            <Flex direction="column" gap={{ base: 3.5, md: 4 }}>
              {COMICS.map((c) => (
                <Box
                  as="button"
                  key={c.key}
                  onClick={() => setSelected(c.key)}
                  display="flex"
                  alignItems="center"
                  gap={{ base: 3, md: 4 }}
                  textAlign="left"
                  w="100%"
                  borderRadius="xl"
                  p={{ base: 2.5, md: 3 }}
                  bg={`${cabalaTxt}0e`}
                  border={`1px solid ${cabalaTxt}33`}
                  cursor="pointer"
                  transition="all 0.18s"
                  _hover={{ bg: `${cabalaTxt}1e`, borderColor: cabalaTxt, transform: "translateY(-2px)", boxShadow: `0 0 18px ${cabalaTxt}44` }}
                >
                  {/* Portada = primera viñeta del cómic */}
                  <Box
                    flexShrink={0}
                    w={{ base: "58px", md: "72px" }}
                    h={{ base: "58px", md: "72px" }}
                    borderRadius="lg"
                    bgColor={cabalaBg}
                    bgImage={c.vinetas[0]?.src ? `url('${c.vinetas[0].src}')` : undefined}
                    bgSize="cover"
                    bgPosition="center"
                    bgRepeat="no-repeat"
                    border={`1px solid ${cabalaTxt}44`}
                    boxShadow={`0 0 12px ${cabalaTxt}33`}
                  />

                  <Box flex="1" minW={0}>
                    <Text
                      color={cabalaTxt}
                      fontSize={{ base: "sm", md: "md" }}
                      fontWeight="700"
                      letterSpacing="0.1em"
                      textTransform="uppercase"
                      lineHeight="1.25"
                      style={{ textShadow: `0 0 12px ${cabalaTxt}55` }}
                    >
                      {c.titulo}
                    </Text>
                    <Text color={`${cabalaTxt}aa`} fontSize={{ base: "xs", md: "sm" }} fontStyle="italic" mt={0.5} lineHeight="1.5">
                      {c.descripcion}
                    </Text>
                    <Text color={`${cabalaTxt}77`} fontSize="xs" letterSpacing="0.08em" mt={1}>
                      {c.vinetas.length} viñetas
                    </Text>
                  </Box>

                  <Box as="svg" flexShrink={0} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
                       w={{ base: "20px", md: "22px" }} h={{ base: "20px", md: "22px" }} fill={cabalaTxt}
                       style={{ filter: `drop-shadow(0 0 6px ${cabalaTxt}66)` }}>
                    <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
                  </Box>
                </Box>
              ))}
            </Flex>
          </ModalBody>
        </Box>
      </ModalContent>
    </Modal>
  );
}

export default CabalaIlustracionesModal;
