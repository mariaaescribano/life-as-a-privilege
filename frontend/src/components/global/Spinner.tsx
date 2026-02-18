import React from "react";
import { turquesa } from "../../GlobalVariables";

interface SpinnerProps {
  size?: number;      // tamaño en px
  thickness?: number; // grosor del borde
  fullScreen?: boolean; // si ocupa toda la pantalla
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 60,
  thickness = 6,
  fullScreen = true,
}) => {
  const spinner = (
    <div
      style={{
        width: size,
        height: size,
        border: `${thickness}px solid `+ {turquesa},
        borderTop: `${thickness}px solid ${turquesa}`,
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    />
  );

  return (
    <>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
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
            backgroundColor: "rgba(255,255,255,0.6)",
            zIndex: 9999,
          }}
        >
          {spinner}
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
          {spinner}
        </div>
      )}
    </>
  );
};

export default Spinner;
