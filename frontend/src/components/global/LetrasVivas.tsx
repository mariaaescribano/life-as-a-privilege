import React from "react";
import { Box } from "@chakra-ui/react";

/**
 * Texto con letras vivas.
 *
 *  · ENTRADA (`entrada`): cada letra sube, se enfoca y se enciende en su turno,
 *    de izquierda a derecha, cuando `activo` pasa a true. Sin giro ni rebote.
 *  · OLA: ya colocado, una ola de luz recorre las letras: cada una se eleva un
 *    pelín y se enciende en su turno, en bucle.
 *
 * Las palabras no se parten (cada una es un bloque), el espacio en blanco se
 * respeta tal cual (incluido el salto de línea de `pre-line`) y el texto
 * original sigue accesible para los lectores de pantalla. Con
 * `prefers-reduced-motion` el texto se queda quieto y visible.
 *
 * Nada se pierde: si `entrada` está activa pero `activo` nunca llega, las
 * letras quedarían ocultas, así que `activo` debe cambiar a true siempre (en
 * las portadas lo hace `mounted`/`reveal.visible`, que ya tienen su red de
 * seguridad).
 */
export function LetrasVivas({
  texto,
  activo = true,
  entrada = false,
  /** Segundos hasta que arranca la ola (deja acabar la entrada). */
  retraso = 1.6,
  /** Segundos entre una letra y la siguiente en la ola. */
  paso = 0.09,
  /** Duración de un ciclo de la ola. */
  periodo = 6,
  /** Cuánto se eleva cada letra en la ola (px). */
  altura = 5,
  /** Segundos entre una letra y la siguiente en la ENTRADA (más bajo = más de prisa). */
  pasoEntrada = 0.05,
  /** false = sin ola de luz tras la entrada (para bajadas largas de texto). */
  onda = true,
}: {
  pasoEntrada?: number;
  onda?: boolean;
  texto: string;
  activo?: boolean;
  entrada?: boolean;
  retraso?: number;
  paso?: number;
  periodo?: number;
  altura?: number;
}) {
  let n = 0;
  return (
    <Box
      as="span"
      sx={{
        "@keyframes letraOnda": {
          "0%, 62%, 100%": { transform: "translateY(0)", filter: "brightness(1)" },
          "31%": {
            transform: `translateY(-${altura}px)`,
            filter: "brightness(1.25) drop-shadow(0 0 14px rgba(255,255,255,0.75))",
          },
        },
        "& .letra-onda": { animation: `letraOnda ${periodo}s ease-in-out infinite` },
        "@media (prefers-reduced-motion: reduce)": {
          "& .letra-onda": { animation: "none" },
          "& .letra-entra": { transition: "none !important", opacity: "1 !important", transform: "none !important", filter: "none !important" },
        },
      }}
    >
      {texto.split(/(\s+)/).map((tramo, k) => {
        if (tramo === "" || /^\s+$/.test(tramo)) return tramo;
        return (
          <span key={k} aria-hidden style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {Array.from(tramo).map((c, j) => {
              const i = n++;
              return (
                <span
                  key={j}
                  className="letra-entra"
                  style={{
                    display: "inline-block",
                    ...(entrada
                      ? {
                          opacity: activo ? 1 : 0,
                          transform: activo ? "translateY(0)" : "translateY(14px)",
                          filter: activo ? "blur(0)" : "blur(6px)",
                          transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${i * pasoEntrada}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${i * pasoEntrada}s, filter 0.6s cubic-bezier(0.22,1,0.36,1) ${i * pasoEntrada}s`,
                        }
                      : {}),
                  }}
                >
                  <span
                    // La ola solo corre cuando `activo`: así arranca DESPUÉS de la
                    // entrada (y no mientras el texto aún está fuera de pantalla).
                    className={activo && onda ? "letra-onda" : undefined}
                    style={{ display: "inline-block", animationDelay: `${retraso + i * paso}s` }}
                  >
                    {c}
                  </span>
                </span>
              );
            })}
          </span>
        );
      })}
      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>{texto}</span>
    </Box>
  );
}

export default LetrasVivas;
