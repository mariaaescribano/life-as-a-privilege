import React from "react";
import { turquesa } from "../../GlobalVariables";

interface SpinnerProps {
  /** Tamaño del anillo en px. Default: 42 */
  size?: number;
  /** Grosor del borde en px. Default: 3 */
  thickness?: number;
  /** Si true, ocupa toda la pantalla con overlay. Default: true */
  fullScreen?: boolean;
  /** Color personalizado (por defecto, el turquesa del tema) */
  color?: string;
}

/**
 * Spinner unificado de la plataforma:
 * - anillo sutil con un arco superior animado (rotación lineal continua)
 * - drop-shadow del color para el característico glow turquesa
 * - en fullScreen, overlay TRANSPARENTE (solo centra el anillo; sin velo oscuro,
 *   para no pintar un "box turquesa oscuro" sobre el fondo teal al cargar)
 */
const SpinnerTurquesa: React.FC<SpinnerProps> = ({
  size = 42,
  thickness = 3,
  fullScreen = true,
  color = turquesa,
}) => {
  const ring = (
    <div
      style={{
        width: size,
        height: size,
        border: `${thickness}px solid ${color}22`,
        borderTopColor: color,
        borderRadius: "50%",
        animation: "savimboSpin 0.85s linear infinite",
        filter: `drop-shadow(0 0 6px ${color}99) drop-shadow(0 0 14px ${color}44)`,
        boxSizing: "border-box",
      }}
    />
  );

  return (
    <>
      <style>
        {`
          @keyframes savimboSpin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}
      </style>

      {fullScreen ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "transparent",
            zIndex: 9999,
          }}
        >
          {ring}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          {ring}
        </div>
      )}
    </>
  );
};

export default SpinnerTurquesa;
