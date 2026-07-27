import React from "react";
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
import { culturaBg, culturaTxt } from "../../GlobalVariables";
import { usePrecargarImagenes } from "../../hooks/usePrecargarImagenes";
import { comicLoaderPorColor } from "./comicLoaders";
import SpinnerTurquesa from "../global/Spinner";

// ─────────────────────────────────────────────────────────────────────────
// Popup "Ilustraciones de Cultura". Mismo patrón (pantalla completa con el
// fondo de la disciplina) que Astrología / Ayurveda / Medicina China / Cábala.
//
// De momento en estado vacío: irá alojando los capítulos de Cultura a medida
// que lleguen. Cuando haya viñetas, se añade una rejilla de portadas + el
// ComicViewer, igual que en CabalaIlustracionesModal.
// ─────────────────────────────────────────────────────────────────────────

const CULTURA_IMG = "/img/fondos/cultura.webp";

export function CulturaIlustracionesModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const fondosListos = usePrecargarImagenes(isOpen ? [CULTURA_IMG] : []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered scrollBehavior="inside">
      <ModalOverlay
        bg={culturaBg}
        sx={fondosListos ? {
          backgroundImage: `linear-gradient(${culturaBg}66, ${culturaBg}66), url('${CULTURA_IMG}')`,
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
            {comicLoaderPorColor(culturaTxt) ?? <SpinnerTurquesa fullScreen={false} color={culturaTxt} />}
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
            color={culturaTxt}
            _hover={{ bg: `${culturaTxt}22` }}
            icon={
              <Box as="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" w="24px" h="24px" fill={culturaTxt}>
                <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
              </Box>
            }
          />

          <ModalBody
            position="relative"
            zIndex={2}
            w="100%"
            px={{ base: 5, md: 10 }}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minH="100vh"
          >
            <Flex direction="column" align="center" gap={4} textAlign="center" maxW="560px">
              <Text
                color={culturaTxt}
                fontSize={{ base: "2xl", md: "4xl" }}
                fontWeight="700"
                letterSpacing="0.2em"
                textTransform="uppercase"
                lineHeight="1.1"
                style={{ textShadow: `0 0 14px ${culturaTxt}cc, 0 0 32px ${culturaTxt}77, 0 0 70px ${culturaTxt}44` }}
              >
                Ilustraciones de Cultura
              </Text>
              <Box h="1px" w="60%" maxW="220px" style={{ background: `linear-gradient(90deg, transparent, ${culturaTxt}66, transparent)` }} />
              <Text color={`${culturaTxt}cc`} fontSize={{ base: "sm", md: "md" }} fontStyle="italic" lineHeight="1.7">
                Las ilustraciones de Cultura llegarán muy pronto.
              </Text>
            </Flex>
          </ModalBody>
        </>)}
      </ModalContent>
    </Modal>
  );
}

export default CulturaIlustracionesModal;
