/**
 * VÍDEO LARGO — el vídeo completo de una disciplina, y el aviso antes de bajarlo.
 *
 * REGLA: el vídeo completo NUNCA se pone en pantalla solo. Donde el vídeo sale
 * sí o sí —la rejilla de «El Mapa por dentro» y la caja de /d/<disciplina>— va
 * el clip de muestra (`/videos/muestra/<clave>.mp4`, ~100 KB, mudo y en bucle,
 * lo genera `scripts/video/muestras.mjs`). Los originales pesan entre 8 y 27 MB
 * cada uno: cargarlos por si acaso es regalarle la factura de datos a quien
 * entra desde el móvil, y son largos porque tienen que serlo.
 *
 * El original solo se pide cuando alguien PULSA. Y aun pulsando, si parece que
 * la conexión se paga por megas, primero se pregunta diciendo lo que pesa.
 *
 * Sobre detectar el wifi, la verdad incómoda: no hay forma fiable. La Network
 * Information API (`navigator.connection`) solo existe en Chrome —en Android da
 * hasta el tipo de red, en escritorio solo una estimación de velocidad—, y
 * Safari y Firefox no la tienen, así que en iPhone es imposible saberlo. Por eso
 * `hayQuePreguntar()` mezcla lo que sí se sabe con una regla de sentido común
 * para el resto: ver el comentario de la función.
 */
import { Box, Flex, Text } from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { useT } from "../../i18n";
import { useSinBarraDeScroll } from "./sinBarraDeScroll";

/** Ancho de pantalla por debajo del cual damos por hecho que es un móvil. El
 *  mismo corte que usa Chakra para `md`. */
const MOVIL = 768;

type InfoDeRed = { type?: string; effectiveType?: string; saveData?: boolean };

/** Lo que el navegador cuenta de la conexión, si es que cuenta algo. */
const infoDeRed = (): InfoDeRed | undefined => {
  if (typeof navigator === "undefined") return undefined;
  const nav = navigator as Navigator & {
    connection?: InfoDeRed;
    mozConnection?: InfoDeRed;
    webkitConnection?: InfoDeRed;
  };
  return nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
};

/**
 * ¿Preguntamos antes de bajar los megas?
 *
 *   · «Ahorro de datos» activado → SÍ. Da igual por dónde vaya: lo ha pedido.
 *   · red de móvil → SÍ; wifi o cable → NO. (Solo lo dice Chrome en Android.)
 *   · sin tipo de red pero con velocidad estimada: 2g/3g → SÍ. Ahí 20 MB no es
 *     que cuesten dinero, es que no terminan de bajar nunca.
 *   · no se sabe nada (Safari, Firefox) → se pregunta SOLO en pantalla de móvil.
 *     En un escritorio se da por hecho que hay wifi o cable; quien navega desde
 *     el móvil es justamente quien puede estar pagando los megas.
 */
export const hayQuePreguntar = (): boolean => {
  const red = infoDeRed();
  if (red?.saveData) return true;
  if (red?.type === "wifi" || red?.type === "ethernet") return false;
  if (red?.type === "cellular") return true;
  if (red?.effectiveType) return red.effectiveType !== "4g";
  return typeof window !== "undefined" && window.innerWidth < MOVIL;
};

/**
 * Lo que pesa el vídeo, preguntándoselo al servidor SIN bajarlo: un HEAD trae
 * solo las cabeceras. Si no se puede saber, el aviso sale sin cifra en vez de
 * inventarse una.
 */
const usePeso = (src: string, activo: boolean): number | null => {
  const [mb, setMb] = useState<number | null>(null);

  useEffect(() => {
    if (!activo) return;
    let vivo = true;
    void fetch(src, { method: "HEAD" })
      .then((r) => {
        const bytes = Number(r.headers.get("content-length"));
        if (vivo && bytes > 0) setMb(Math.round(bytes / 1024 / 1024));
      })
      .catch(() => { /* sin cifra: el aviso lo dice con palabras */ });
    return () => { vivo = false; };
  }, [src, activo]);

  return mb;
};

/**
 * POPUP DEL VÍDEO COMPLETO.
 *
 * Velo oscuro con blur y SIN caja contenedora: el propio vídeo lleva el borde y
 * el brillo de la disciplina. La caja es CUADRADA (1:1) en móvil y en ordenador,
 * que es la proporción en la que se graban los vídeos del recorrido; la X flota
 * sobre su esquina.
 *
 * Si toca preguntar, en el hueco del vídeo va el aviso: misma caja, mismo
 * brillo, para que no parezca un error sino un paso más.
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
  const t = useT();
  // Se decide UNA vez al abrir: si luego cambia la red, cambiarle el popup
  // debajo de las manos a quien ya está viendo el vídeo sería peor.
  const [confirmado, setConfirmado] = useState(() => !hayQuePreguntar());
  // ¿El vídeo es cuadrado? Se sabe al cargar sus metadatos. La caja SIEMPRE es
  // 1:1; lo que cambia es cómo se encaja el vídeo dentro:
  //   · cuadrado → `cover`: encaje exacto, no se recorta.
  //   · cualquier otra proporción → `contain`: se ve entero, con franjas.
  // Hoy los ocho se graban 1080×1080, así que en la práctica siempre es `cover`;
  // el `contain` es la red de seguridad para el día que entre uno vertical, que
  // con `cover` perdería el 44% del alto. Mientras no se sepa, `contain`
  // también: más vale una franja que un recorte.
  const [cuadrado, setCuadrado] = useState<boolean | null>(null);
  // El peso solo se pide mientras el aviso está en pantalla: si no hay aviso, no
  // hay a quién contárselo y sobra la petición.
  const peso = usePeso(src, !confirmado);

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

        {confirmado ? (
          <Box
            as="video"
            key={src}
            src={src}
            autoPlay
            // Los vídeos son mudos, pero llevan pista de audio en silencio y sin
            // `muted` Chrome/Safari bloquean el autoPlay (se abrían parados).
            muted
            controls
            playsInline
            w="100%"
            h="100%"
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
        ) : (
          <Flex
            direction="column"
            align="center"
            justify="center"
            textAlign="center"
            h="100%"
            gap={5}
            px={{ base: 7, md: 10 }}
          >
            <Text color={accent} fontSize={{ base: "xl", md: "2xl" }} fontWeight="600" letterSpacing="0.04em">
              {t("comun.video.titulo")}
            </Text>

            <Text color="whiteAlpha.900" fontSize={{ base: "sm", md: "md" }} lineHeight="1.65">
              {peso ? t("comun.video.pesa", { mb: peso }) : t("comun.video.pesaSinCifra")}
            </Text>

            <Flex gap={3} wrap="wrap" justify="center" pt={1}>
              <Box
                as="button"
                onClick={() => setConfirmado(true)}
                px={7}
                py={2.5}
                borderRadius="full"
                bg={`${accent}22`}
                border={`1.5px solid ${accent}`}
                color={accent}
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="600"
                letterSpacing="0.06em"
                cursor="pointer"
                transition="all 0.25s ease"
                _hover={{ bg: `${accent}33`, transform: "translateY(-2px)" }}
                _active={{ transform: "translateY(0)" }}
              >
                {t("comun.video.ver")}
              </Box>

              <Box
                as="button"
                onClick={onClose}
                px={7}
                py={2.5}
                borderRadius="full"
                bg="transparent"
                border="1.5px solid rgba(255,255,255,0.35)"
                color="whiteAlpha.800"
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="600"
                letterSpacing="0.06em"
                cursor="pointer"
                transition="all 0.25s ease"
                _hover={{ borderColor: "whiteAlpha.700", color: "white", transform: "translateY(-2px)" }}
                _active={{ transform: "translateY(0)" }}
              >
                {t("comun.video.ahoraNo")}
              </Box>
            </Flex>
          </Flex>
        )}
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
