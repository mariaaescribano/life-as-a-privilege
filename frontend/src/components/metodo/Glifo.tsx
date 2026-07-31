import React from "react";
import { FUENTE_GLIFOS, VS_TEXTO } from "./glifosAstro";
import { trazosSigno } from "./signosIconos";

// ── Glifo de PLANETA / punto (☉ ☽ ☿ ♀ ♂ ♃ ♄ ♅ ♆ ♇ ⚷ ⚸ ☊ ☋ y el ↑ del
//    Ascendente): símbolo Unicode pintado como texto monocromo. La fuente sale
//    de FUENTE_GLIFOS, con las fuentes de SÍMBOLOS por delante, para que ningún
//    sistema lo resuelva con su fuente de emoji. ─────────────────────────────
export const Glifo = ({
  symbol,
  color,
  size = 30,
}: {
  symbol: string;
  color: string;
  size?: number;
}) => (
  <svg
    viewBox="0 0 36 36"
    width={size}
    height={size}
    style={{ flexShrink: 0, filter: `drop-shadow(0 0 5px ${color}40)` }}
  >
    <text
      x="18"
      y="27"
      textAnchor="middle"
      fontSize="26"
      fontFamily={FUENTE_GLIFOS}
      fill={color}
      style={{ fontVariantEmoji: "text" } as React.CSSProperties}
    >
      {symbol}
      {VS_TEXTO}
    </text>
  </svg>
);

/**
 * Glifo de un SIGNO del zodíaco. No usa el carácter (♈♉♊…, que los sistemas
 * pintan como emoji morado): es un icono DIBUJADO, trazo a trazo, definido en
 * `signosIconos.ts`. Se ve igual en cualquier dispositivo y toma el color que
 * se le pase. Si el nombre no es un signo, no pinta nada.
 */
export const GlifoSigno = ({
  nombre,
  color,
  size = 22,
  glow = true,
}: {
  /** Nombre del signo: "Aries", "Tauro", "Géminis"… */
  nombre: string | null | undefined;
  color: string;
  size?: number;
  /** Halo del color del signo alrededor del trazo (como los planetas). */
  glow?: boolean;
}) => {
  const trazos = trazosSigno(nombre);
  if (!trazos) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label={nombre ?? undefined}
      style={{ flexShrink: 0, filter: glow ? `drop-shadow(0 0 5px ${color}40)` : undefined }}
    >
      {trazos.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
};
