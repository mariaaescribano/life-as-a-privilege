import React from "react";

// Símbolo Unicode renderizado como texto serif, con glow opcional
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
      fontFamily="'Times New Roman', Georgia, 'DejaVu Serif', serif"
      fill={color}
    >
      {symbol}
      {"︎"}
    </text>
  </svg>
);
