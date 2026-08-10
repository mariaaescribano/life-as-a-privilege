import React, { useEffect, useSyncExternalStore } from "react";
import { Box } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

import { useT } from "../../i18n";
import {
  alternarMusica,
  estado,
  estadoServidor,
  pistaParaRuta,
  ponerPista,
  suscribir,
  vigilarPestana,
} from "./reproductorMusica";

/**
 *  El enchufe de la música. No pinta nada: solo le va diciendo al reproductor
 *  en qué página estamos, para que cada zona pueda tener su pista y para que
 *  las páginas mudas (administración, la regulación de psicología) lo sean.
 *
 *  Va en App.tsx, FUERA de <Routes>: si viviera dentro de una página se
 *  desmontaría en cada navegación y la música se cortaría a cada paso.
 */
export function MusicaFondo() {
  const { pathname } = useLocation();
  useEffect(() => { ponerPista(pistaParaRuta(pathname)); }, [pathname]);
  useEffect(() => vigilarPestana(), []);
  return null;
}

/** Lee el estado del reproductor sin que React tenga que ser su dueño. */
function useMusica() {
  return useSyncExternalStore(suscribir, estado, estadoServidor);
}

/**
 *  El botón de la música en el header: una nota que se enciende y se apaga.
 *
 *  Discreto a propósito, como el selector de idioma que tiene al lado: es una
 *  preferencia, no un sitio al que ir. Apagada va tenue y con la línea cruzada;
 *  encendida, blanca y con el mismo glow que el resto de la cabecera.
 *
 *  Si en esta página no hay nada que sonar, el botón no se pinta.
 */
export function BotonMusica({ compact = false }: { compact?: boolean }) {
  const t = useT();
  const { encendida, hayPista } = useMusica();
  if (!hayPista) return null;

  const lado = compact ? "19px" : "21px";

  return (
    <Box
      as="button"
      type="button"
      onClick={alternarMusica}
      title={encendida ? t("header.musicaApagar") : t("header.musicaEncender")}
      aria-label={encendida ? t("header.musicaApagar") : t("header.musicaEncender")}
      aria-pressed={encendida}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="transparent"
      border="none"
      p={0}
      flexShrink={0}
      cursor="pointer"
      color="white"
      opacity={encendida ? 1 : 0.5}
      transition="opacity 0.25s ease, filter 0.25s ease"
      style={{
        filter: encendida
          ? "drop-shadow(0 0 8px rgba(255,255,255,0.6)) drop-shadow(0 0 18px rgba(180,255,245,0.35))"
          : "none",
      }}
      _hover={{ opacity: 1 }}
    >
      {/* Nota dibujada, no un carácter: así se ve igual en todos los sistemas
          (los emoji y los símbolos musicales cambian de forma en cada uno). */}
      <Box as="svg" viewBox="0 0 24 24" w={lado} h={lado} fill="none" aria-hidden>
        {/* La plica y la cabeza de la nota */}
        <path
          d="M9 18V6.2l9-1.9v11.4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <ellipse cx="6.9" cy="18" rx="2.6" ry="2.1" stroke="currentColor" strokeWidth="1.6" />
        <ellipse cx="15.9" cy="15.7" rx="2.6" ry="2.1" stroke="currentColor" strokeWidth="1.6" />
        {/* Apagada: una línea la tacha. */}
        {!encendida && (
          <path d="M3.5 20.5 20.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        )}
      </Box>
    </Box>
  );
}

export default MusicaFondo;
