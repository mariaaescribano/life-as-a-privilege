/**
 * CALIDAD DEL VÍDEO LARGO — la decisión de cuántos megas bajarle a quien mira.
 *
 * El vídeo que se ve es SIEMPRE el largo, el entero, en todas partes: en la caja
 * de /d/<disciplina> y al pulsar «Muestra» en /elMetodo. Lo único que cambia
 * según la conexión es la CALIDAD:
 *
 *   · wifi, cable o no sabemos → el original: 1080×1080, 1,4-3,5 MB.
 *   · datos del móvil o «ahorro de datos» → la versión ligera: el MISMO vídeo,
 *     la misma duración, a 540×540 y 0,4-0,8 MB (la genera
 *     `scripts/video/ligeros.mjs` en `/videos/ligero/<nombre>.mp4`).
 *
 * Antes de esto se PREGUNTABA («pesa 20 MB, ¿lo bajamos?»). Preguntar era pedirle
 * al visitante que decidiera con datos que no tiene, y la mitad decía no y se iba
 * sin ver nada. Ahora se decide por él, y lo que se recorta es la nitidez, nunca
 * el vídeo.
 *
 * Sobre detectar el wifi, la verdad incómoda: no hay forma fiable. La Network
 * Information API (`navigator.connection`) solo existe en Chrome —en Android da
 * hasta el tipo de red, en escritorio solo una estimación de velocidad—, y
 * Safari y Firefox no la tienen, así que en iPhone es imposible saberlo. Por eso
 * `conexionDeDatos()` mezcla lo que sí se sabe con una regla de sentido común
 * para el resto: ver el comentario de la función.
 */
import { useCallback, useEffect, useState } from "react";

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
 * ¿Parece que estos megas los está pagando?
 *
 *   · «Ahorro de datos» activado → SÍ. Da igual por dónde vaya: lo ha pedido.
 *   · red de móvil → SÍ; wifi o cable → NO. (Solo lo dice Chrome en Android.)
 *   · sin tipo de red pero con velocidad estimada: 2g/3g → SÍ. Ahí no es que los
 *     megas cuesten dinero, es que no terminan de bajar nunca.
 *   · no se sabe nada (Safari, Firefox) → sí en pantalla de móvil. En un
 *     escritorio se da por hecho que hay wifi o cable; quien navega desde el
 *     móvil es justamente quien puede estar pagando los megas.
 */
export const conexionDeDatos = (): boolean => {
  const red = infoDeRed();
  if (red?.saveData) return true;
  if (red?.type === "wifi" || red?.type === "ethernet") return false;
  if (red?.type === "cellular") return true;
  if (red?.effectiveType) return red.effectiveType !== "4g";
  return typeof window !== "undefined" && window.innerWidth < MOVIL;
};

/** `/videos/astrovideo.mp4` → `/videos/ligero/astrovideo.mp4`. El nombre del
 *  archivo es el mismo, así que no hay ninguna lista que mantener: si el vídeo
 *  no está en `/videos/` (una ruta rara, un vídeo de otro sitio), se devuelve
 *  tal cual y se ve el original. */
export const srcLigero = (src: string): string =>
  src.startsWith("/videos/") && !src.startsWith("/videos/ligero/")
    ? src.replace("/videos/", "/videos/ligero/")
    : src;

/**
 * Lo que usa cada `<video>` del vídeo largo:
 *
 *   const { src, onError } = useVideoLargoSrc(d.video);
 *   <video src={src} onError={onError} />
 *
 * `onError` es la red de seguridad: si la versión ligera no existe todavía (un
 * vídeo nuevo al que no se le ha pasado `scripts/video/ligeros.mjs`), se cae al
 * original en vez de dejar un cuadro negro.
 *
 * La calidad se decide UNA vez, al montar: si luego cambia la red, cambiarle el
 * vídeo debajo de las manos a quien lo está viendo sería peor.
 */
export const useVideoLargoSrc = (original?: string) => {
  const [ligero] = useState(conexionDeDatos);
  const [falloLigero, setFalloLigero] = useState(false);

  // Cada disciplina tiene su vídeo: al cambiar de vídeo, el fallo anterior no
  // cuenta.
  useEffect(() => { setFalloLigero(false); }, [original]);

  const onError = useCallback(() => setFalloLigero(true), []);

  return {
    src: original && ligero && !falloLigero ? srcLigero(original) : original,
    /** true = se está viendo la versión ligera (por datos del móvil). */
    esLigero: !!original && ligero && !falloLigero,
    onError,
  };
};
