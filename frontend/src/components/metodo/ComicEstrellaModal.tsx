import React, { useEffect, useState } from "react";
import { useT } from "../../i18n";
import { Box, Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { ComicViewer } from "./ComicViewer";
import { ESTRELLA_ATOMOS } from "./comicEstrellaAtomos";
import { useComic } from "../../i18n/comics";
import { TablaPeriodicaFinal } from "./TablaPeriodicaFinal";
import { fisiologiaBg, fisiologiaTxt } from "../../GlobalVariables";

// ─────────────────────────────────────────────────────────────────────────
// Cómic «Cómo una estrella forma los átomos». Va ENTRE la pantalla de átomos y
// la de moléculas: se abre al pulsar «Continuar» tras construir un átomo.
//
//   · onContinue → botón «Ir a Moléculas →» de la última viñeta (o el tick
//                  final). El padre marca el cómic como leído y navega a
//                  moléculas.
//   · onClose    → la X / Escape. El padre lo marca como leído (para no volver
//                  a mostrarlo salvo que el usuario lo pida) y cierra, quedándose
//                  en átomos.
// ─────────────────────────────────────────────────────────────────────────
interface ComicEstrellaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export function ComicEstrellaModal({ isOpen, onClose, onContinue }: ComicEstrellaModalProps) {
  const t = useT();
  // Sus viñetas en el idioma activo.
  const vinetas = useComic("fisiologia-estrella-atomos", ESTRELLA_ATOMOS);
  // El cierre del cómic: al terminar la última viñeta (la estrella que colapsa)
  // el visor da paso a la tabla periódica a pantalla completa. Es la misma
  // ventana, no un modal encima de otro: el cómic se retira y deja la pantalla
  // entera al remate.
  const [tabla, setTabla] = useState(false);
  // Al reabrir el cómic se empieza otra vez por la primera viñeta, no por el
  // cierre que quedó abierto la última vez.
  useEffect(() => { if (!isOpen) setTabla(false); }, [isOpen]);

  const cerrar = () => { setTabla(false); onClose(); };
  const continuar = () => { setTabla(false); onContinue(); };

  return (
    <Modal isOpen={isOpen} onClose={cerrar} size="full" isCentered scrollBehavior="outside">
      <ModalOverlay bg="rgba(0,0,0,0.95)" sx={{ backdropFilter: "blur(24px)" }} />
      <ModalContent
        bg="transparent"
        border="none"
        borderRadius="0"
        boxShadow="none"
        m={0}
        fontFamily="'EB Garamond', serif"
        minH="100dvh"
      >
        {/* El cierre: la tabla periódica a pantalla completa. Sustituye al visor
            (no se pinta encima) para que el remate quede limpio. */}
        {tabla && <TablaPeriodicaFinal onClose={cerrar} onContinue={continuar} />}

        {/* key={isOpen}: al reabrir, el ComicViewer se remonta desde la 1ª viñeta. */}
        {!tabla && (
        <ComicViewer
          key={String(isOpen)}
          vinetas={vinetas}
          onClose={cerrar}
          // El tick de la última viñeta ya no salta a Moléculas: abre la tabla.
          onComplete={() => setTabla(true)}
          themeColor={fisiologiaTxt}
          disciplinaBgImage="/img/fondos/fisio.webp"
          disciplinaBgColor={fisiologiaBg}
        />
        )}

        {/* Botón «Ir a Moléculas →» fijo, a la IZQUIERDA de la X del ComicViewer
            (la X está en top/right 3-5 con ~42-48px de ancho). Visible durante
            todo el cómic para poder pasar a moléculas en cualquier momento.
            En el cierre NO: allí el mismo botón va centrado y grande, que es la
            única acción de esa pantalla. */}
        {!tabla && (
        <Box
          as="button"
          onClick={continuar}
          position="fixed"
          top={{ base: 3, md: 5 }}
          right={{ base: "74px", md: "90px" }}
          zIndex={11}
          display="inline-flex"
          alignItems="center"
          gap={2}
          h={{ base: "42px", md: "48px" }}
          px={{ base: 4, md: 6 }}
          borderRadius="full"
          overflow="hidden"
          // Fondo con la imagen de la disciplina (fisio) + velo, como el botón
          // «Saltar»; la letra en fisiologiaTxt (color de texto de la disciplina).
          bg="transparent"
          color={fisiologiaTxt}
          border={`2px solid ${fisiologiaTxt}`}
          fontFamily="'EB Garamond', serif"
          fontWeight="700"
          fontSize={{ base: "xs", md: "sm" }}
          letterSpacing="0.04em"
          whiteSpace="nowrap"
          cursor="pointer"
          boxShadow="0 2px 12px rgba(0,0,0,0.45)"
          sx={{ backdropFilter: "blur(4px)" }}
          transition="all 0.2s"
          _hover={{ transform: "translateY(-1px)" }}
        >
          {/* Fondo imagen + velo, como el botón «Saltar». */}
          <Box as="img" src="/img/fondos/fisio.webp" alt="" loading="eager" position="absolute" inset="0"
               w="100%" h="100%" style={{ objectFit: "cover", objectPosition: "center" }} pointerEvents="none" />
          <Box position="absolute" inset="0" bg={`${fisiologiaBg}b3`} />
          <Box as="span" position="relative" zIndex={1}>{t("metodo.irA", { destino: t("metodo.destino.moleculas") })}</Box>
          <Box as="svg" position="relative" zIndex={1} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
               w={{ base: "18px", md: "20px" }} h={{ base: "18px", md: "20px" }} fill="currentColor" flexShrink={0}>
            <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
          </Box>
        </Box>
        )}
      </ModalContent>
    </Modal>
  );
}
