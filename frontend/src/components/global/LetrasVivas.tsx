import React from "react";
import { Box } from "@chakra-ui/react";
import { useVistoConEspera } from "../../hooks/useVistoConEspera";

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
  activo,
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
  repetir = true,
  rayoDesde,
  lineaPaso = 0.3,
  /** false = sin ola de luz tras la entrada (para bajadas largas de texto). */
  onda = true,
}: {
  pasoEntrada?: number;
  onda?: boolean;
  /** false = la luz recorre las letras UNA sola vez (títulos de página). */
  repetir?: boolean;
  /** Nº de letra (sin contar espacios) desde la que pasa UN rayo de luz blanco
   *  al ir apareciendo (el nombre del usuario en el saludo). Independiente de
   *  la ola: una sola pasada. */
  rayoDesde?: number;
  /** Con saltos de línea (`
`), cada línea arranca su propia cascada con este
   *  desfase (s) respecto a la anterior, en vez de esperar a que termine la de
   *  arriba: cada línea se lee como una unidad y el conjunto no se hace largo. */
  lineaPaso?: number;
  texto: string;
  activo?: boolean;
  entrada?: boolean;
  retraso?: number;
  paso?: number;
  periodo?: number;
  altura?: number;
}) {
  // Sin `activo` explícito, el propio texto decide: entra cuando está metido en
  // pantalla (margen -10%), sin espera de reloj.
  const auto = useVistoConEspera("0px 0px -10% 0px", 0);
  const act = activo ?? auto.visible;
  let n = 0;      // nº de letra en todo el texto (para el rayo)
  let linea = 0;  // nº de salto de línea recorrido
  let local = 0;  // nº de letra dentro de su línea (para el desfase)
  return (
    <Box
      as="span"
      ref={activo === undefined ? auto.ref : undefined}
      sx={{
        "@keyframes letraOnda": {
          "0%, 62%, 100%": { transform: "translateY(0)", filter: "brightness(1)" },
          "31%": {
            transform: `translateY(-${altura}px)`,
            filter: "brightness(1.25) drop-shadow(0 0 14px rgba(255,255,255,0.75))",
          },
        },
        "@keyframes letraRayo": {
          "0%, 100%": { filter: "brightness(1)" },
          "30%": { filter: "brightness(2.2) drop-shadow(0 0 10px #ffffff) drop-shadow(0 0 24px rgba(255,255,255,0.9))" },
        },
        "& .letra-rayo": { animation: `letraRayo ${periodo}s ease-out 1` },
        "& .letra-onda": { animation: `letraOnda ${periodo}s ease-in-out ${repetir ? "infinite" : "1"}` },
        "@media (prefers-reduced-motion: reduce)": {
          "& .letra-onda, & .letra-rayo": { animation: "none" },
          "& .letra-entra": { transition: "none !important", opacity: "1 !important", transform: "none !important", filter: "none !important" },
        },
      }}
    >
      {texto.split(/(\s+)/).map((tramo, k) => {
        if (tramo === "" || /^\s+$/.test(tramo)) {
          const saltos = tramo.split("\n").length - 1;
          if (saltos) { linea += saltos; local = 0; }
          return tramo;
        }
        return (
          <span key={k} aria-hidden style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {Array.from(tramo).map((c, j) => {
              const i = n++;
              const li = local++;
              const base = linea * lineaPaso;
              return (
                <span
                  key={j}
                  className="letra-entra"
                  style={{
                    display: "inline-block",
                    ...(entrada
                      ? {
                          opacity: act ? 1 : 0,
                          transform: act ? "translateY(0)" : "translateY(14px)",
                          filter: act ? "blur(0)" : "blur(6px)",
                          transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${base + li * pasoEntrada}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${base + li * pasoEntrada}s, filter 0.6s cubic-bezier(0.22,1,0.36,1) ${base + li * pasoEntrada}s`,
                        }
                      : {}),
                  }}
                >
                  <span
                    // La ola solo corre cuando `activo`: así arranca DESPUÉS de la
                    // entrada (y no mientras el texto aún está fuera de pantalla).
                    className={act && onda ? "letra-onda" : act && rayoDesde !== undefined && i >= rayoDesde ? "letra-rayo" : undefined}
                    style={{ display: "inline-block", animationDelay: `${retraso + base + li * paso}s` }}
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
