/**
 * VÍDEO LARGO — el popup del vídeo completo de una disciplina.
 *
 * El vídeo que sale aquí es SIEMPRE el largo, el entero. Antes este popup
 * preguntaba primero («pesa 20 MB, ¿lo bajamos?») porque los originales pesaban
 * entre 8 y 27 MB; hoy pesan entre 1,4 y 3,5 MB (los apretó
 * `scripts/video/adelgazar.mjs`) y quien navega con datos del móvil recibe la
 * versión ligera —el mismo vídeo, a 540×540 y menos de 1 MB— sin que se le
 * pregunte nada. Esa decisión vive en `videoCalidad.ts`, para que sea la misma
 * en el popup y en la caja de /d/<disciplina>.
 *
 * El clip corto de `/videos/muestra/` sigue existiendo, pero solo para la
 * rejilla de ocho baldosas de /elMetodo: ahí se cargarían los ocho vídeos a la
 * vez, y eso sí es una pantalla cara. Al pulsar una baldosa se abre este popup
 * con el vídeo largo.
 */
import { Box } from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { useSinBarraDeScroll } from "./sinBarraDeScroll";
import { useVideoLargoSrc } from "./videoCalidad";

/**
 * POPUP DEL VÍDEO COMPLETO.
 *
 * Velo oscuro con blur y SIN caja contenedora: el propio vídeo lleva el borde y
 * el brillo de la disciplina. La caja es CUADRADA (1:1) en móvil y en ordenador,
 * que es la proporción en la que se graban los vídeos del recorrido; la X flota
 * sobre su esquina.
 */
export const VideoLargoModal = ({
  src,
  accent,
  onClose,
}: {
  src: string;
  accent: string;
  onClose: () => void;
}) => {
  // El original por wifi, la versión ligera por datos del móvil. Largo en los
  // dos casos.
  const { src: fuente, onError } = useVideoLargoSrc(src);
  // ¿El vídeo es cuadrado? Se sabe al cargar sus metadatos. La caja SIEMPRE es
  // 1:1; lo que cambia es cómo se encaja el vídeo dentro:
  //   · cuadrado → `cover`: encaje exacto, no se recorta.
  //   · cualquier otra proporción → `contain`: se ve entero, con franjas.
  // Hoy los ocho se graban 1080×1080, así que en la práctica siempre es `cover`;
  // el `contain` es la red de seguridad para el día que entre uno vertical, que
  // con `cover` perdería el 44% del alto. Mientras no se sepa, `contain`
  // también: más vale una franja que un recorte.
  const [cuadrado, setCuadrado] = useState<boolean | null>(null);

  // El popup ocupa la pantalla justa: por fuera no hay nada que recorrer, así
  // que la barra de la página de detrás se apaga mientras está abierto.
  const raiz = useRef<HTMLDivElement>(null);
  useSinBarraDeScroll(raiz);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Cada vídeo tiene su propia proporción: al cambiar de disciplina, a cero.
  useEffect(() => { setCuadrado(null); }, [src]);

  return (
    <Box
      ref={raiz}
      position="fixed"
      inset={0}
      zIndex={300}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="rgba(0,0,0,0.85)"
      sx={{ backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)" }}
      onClick={onClose}
      px={{ base: 5, md: 10 }}
    >
      <Box
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        position="relative"
        borderRadius="2xl"
        overflow="hidden"
        bg="#000"
        border={`1.5px solid ${accent}66`}
        boxShadow={`0 0 0 1px ${accent}55, 0 0 45px ${accent}66, 0 0 90px ${accent}33, 0 22px 70px rgba(0,0,0,0.6)`}
        w={{ base: "min(92vw, 420px)", md: "auto" }}
        h={{ base: "auto", md: "min(80vh, 600px)" }}
        maxH="88vh"
        sx={{ aspectRatio: "1 / 1" }}
      >
        {/* X cerrar — flota sobre la esquina del propio vídeo */}
        <Box
          position="absolute"
          top={3}
          right={3}
          as="button"
          onClick={onClose}
          color={accent}
          fontSize="md"
          cursor="pointer"
          bg="rgba(0,0,0,0.5)"
          border={`1px solid ${accent}66`}
          borderRadius="full"
          w="38px"
          h="38px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          _hover={{ bg: "rgba(0,0,0,0.7)", borderColor: accent }}
          transition="all 0.2s"
          zIndex={2}
          sx={{ backdropFilter: "blur(4px)" }}
        >
          ✕
        </Box>

        <Box
          as="video"
          key={fuente}
          src={fuente}
          autoPlay
          // Los vídeos son mudos, pero llevan pista de audio en silencio y sin
          // `muted` Chrome/Safari bloquean el autoPlay (se abrían parados).
          muted
          controls
          playsInline
          // Se pide entero desde el principio: aquí ya ha pulsado, y lo que se
          // ahorraba antes esperando ya se ahorra con la versión ligera.
          preload="auto"
          w="100%"
          h="100%"
          onError={onError}
          onLoadedMetadata={(e: React.SyntheticEvent<HTMLVideoElement>) => {
            const v = e.currentTarget;
            if (!v.videoWidth || !v.videoHeight) return;
            // Margen del 2% para no descartar un 1080×1081 por un píxel.
            setCuadrado(Math.abs(v.videoWidth / v.videoHeight - 1) < 0.02);
          }}
          // Cuadrado → `cover` (encaje exacto en la caja 1:1, sin recorte).
          // Vertical → `contain`, para verlo entero en vez de perder el 44%.
          sx={{ objectFit: cuadrado ? "cover" : "contain" }}
        />
      </Box>
    </Box>
  );
};

/**
 * Lo que usa cada página: `abrir()` para el botón y `{modal}` para pintarlo.
 *
 *   const { abrir, modal } = useVideoLargo({ src: d.video, accent: d.txt });
 *
 * Sin `src` (una disciplina todavía sin vídeo) `abrir()` no hace nada y `modal`
 * es null, así que quien llama no tiene que comprobar nada.
 */
export const useVideoLargo = ({ src, accent }: { src?: string; accent: string }) => {
  const [abierto, setAbierto] = useState(false);
  const abrir = useCallback(() => setAbierto(true), []);
  const cerrar = useCallback(() => setAbierto(false), []);

  const modal = abierto && src
    ? <VideoLargoModal src={src} accent={accent} onClose={cerrar} />
    : null;

  return { abrir, modal };
};
