import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { fisiologiaBg, fisiologiaTxt } from "../../GlobalVariables";
import { useSinBarraDeScroll } from "../global/sinBarraDeScroll";
import { FlechaBonita } from "../global/FlechaBonita";
import { focoBlanco } from "../global/foco";
import { glowHeader } from "./FotoBox";
import { useT } from "../../i18n";

// ─────────────────────────────────────────────────────────────────────────
// VideoReelModal · el vídeo de María que abre una estación: VERTICAL (9:16),
// tipo reel, sobre un velo oscuro.
//
//  · Intenta sonar desde el primer segundo (se entra con un clic, así que el
//    navegador lo permite); si lo bloquea, arranca en silencio y los controles
//    dejan activar el sonido.
//  · Hasta que el vídeo no está listo NO se pinta nada: si el fichero aún no
//    existe, se cierra solo con `onClose("error")` y la página sigue como si
//    nada. Así un vídeo pendiente no deja una caja negra rota.
//  · La X lo cierra siempre; al terminar sale «Continuar».
//  · `onClose("visto")` = se vio o se saltó (no vuelve a abrirse solo).
// ─────────────────────────────────────────────────────────────────────────
export function VideoReelModal({
  src,
  onClose,
}: {
  src: string;
  onClose: (como: "visto" | "error") => void;
}) {
  const t = useT();
  const raiz = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [listo, setListo] = useState(false);
  const [terminado, setTerminado] = useState(false);
  useSinBarraDeScroll(raiz);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose("visto"); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const arrancar = () => {
    const v = video.current;
    if (!v) return;
    setListo(true);
    v.muted = false;
    v.play().catch(() => {
      // Sonido bloqueado: en silencio, que los controles lo activen.
      v.muted = true;
      v.play().catch(() => { /* quedará parado con los controles */ });
    });
  };

  return (
    <Box
      ref={raiz}
      position="fixed"
      inset={0}
      zIndex={300}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="rgba(0,0,0,0.92)"
      sx={{ backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
      opacity={listo ? 1 : 0}
      pointerEvents={listo ? "auto" : "none"}
      transition="opacity 0.6s ease"
      onClick={() => onClose("visto")}
      px={4}
    >
      <Box
        position="relative"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        borderRadius="2xl"
        overflow="hidden"
        bg="#000"
        boxShadow={glowHeader(fisiologiaTxt)}
        h="min(86vh, 760px)"
        maxW="92vw"
        sx={{ aspectRatio: "9 / 16" }}
      >
        <Box
          as="video"
          ref={video}
          src={src}
          playsInline
          controls
          preload="auto"
          w="100%"
          h="100%"
          sx={{ objectFit: "cover" }}
          onLoadedData={arrancar}
          onError={() => onClose("error")}
          onEnded={() => setTerminado(true)}
        />

        <Box
          as="button"
          onClick={() => onClose("visto")}
          aria-label={t("fisiologia.cuerpo.video.saltar")}
          position="absolute"
          top={3}
          right={3}
          w="38px"
          h="38px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="full"
          color={fisiologiaTxt}
          bg="rgba(0,0,0,0.5)"
          border={`1px solid ${fisiologiaTxt}66`}
          cursor="pointer"
          transition="all 0.2s"
          _hover={{ bg: "rgba(0,0,0,0.7)", borderColor: fisiologiaTxt }}
          _focusVisible={focoBlanco}
        >
          ✕
        </Box>

        {terminado && (
          <Flex position="absolute" left={0} right={0} bottom={{ base: 14, md: 16 }} justify="center">
            <Box
              as="button"
              onClick={() => onClose("visto")}
              display="inline-flex"
              alignItems="center"
              gap={2.5}
              px={7}
              py={2.5}
              borderRadius="full"
              color={fisiologiaTxt}
              bg={`${fisiologiaBg}e6`}
              border={`1.5px solid ${fisiologiaTxt}aa`}
              fontStyle="italic"
              letterSpacing="0.05em"
              boxShadow={`0 0 10px rgba(255,255,255,0.16), 0 0 22px ${fisiologiaTxt}44`}
              cursor="pointer"
              transition="all 0.15s ease"
              _hover={{ transform: "translateY(-2px)" }}
              _active={{ transform: "scale(0.97)" }}
              _focusVisible={focoBlanco}
            >
              <Text as="span">{t("fisiologia.cuerpo.video.continuar")}</Text>
              <FlechaBonita dir="next" size="20px" />
            </Box>
          </Flex>
        )}
      </Box>
    </Box>
  );
}
