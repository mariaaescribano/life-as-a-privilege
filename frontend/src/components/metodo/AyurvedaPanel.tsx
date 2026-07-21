import React from "react";
import { Box } from "@chakra-ui/react";
import { motion, useReducedMotion } from "framer-motion";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { ayurvedaBg, ayurvedaNom } from "../../GlobalVariables";

const MotionBox = motion(Box);

// Hash estable (hidratación-safe) de un id → 0..1. Sirve para desincronizar el
// balanceo de reposo de cada panel, para que no se muevan todos a la vez.
function faseDeId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return (h % 1000) / 1000;
}

interface AyurvedaPanelProps {
  children: React.ReactNode;
  /** Color del dosha (para el glow del box). */
  color: string;
  /** Variante «Tu día»: fondo de acuarela en bandas repetidas. */
  tile?: boolean;
  /** Override del padding interno (la página «Tu día» usa uno más ajustado). */
  px?: any;
  py?: any;
}

/**
 * Caja (panel) común de las páginas del recorrido de Ayurveda —las que ve el
 * usuario cuando YA conoce su dosha—. Antes era una función `Panel` duplicada en
 * cada página, y totalmente estática. Ahora es un componente compartido y VIVO,
 * para darle el punto divertido que pega con esta parte:
 *   · balanceo de reposo muy suave e infinito (desincronizado por panel), para
 *     que las cajas «respiren» y se sientan vivas;
 *   · «pop» elástico y exagerado al pasar el ratón / tocar (escala + inclinación
 *     + glow del dosha), con rebote (spring);
 *   · squish al pulsar.
 * Al vivir en un solo archivo, el cambio se ve en TODAS las páginas y en los tres
 * doshas (vata / pitta / kapha). Respeta `prefers-reduced-motion`.
 */
export function AyurvedaPanel({
  children,
  color,
  tile,
  px = { base: 6, md: 10 },
  py = { base: 7, md: 9 },
}: AyurvedaPanelProps) {
  const reduce = useReducedMotion();
  const fase = faseDeId(React.useId());

  const baseShadow = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${color}1a, 0 0 48px ${color}10`;
  // Glow MUY marcado al interactuar: sube el box, brilla el color del dosha.
  const hoverShadow = `0 22px 48px rgba(0,0,0,0.30), 0 0 42px rgba(255,255,255,0.24), 0 0 90px rgba(180,255,245,0.20), 0 0 44px ${color}66, 0 0 110px ${color}33`;

  const fondo = tile ? (
    // Fondo en bandas (la acuarela se repite a lo ancho y se apila).
    <Box
      position="absolute" inset="0" zIndex={0} pointerEvents="none"
      borderRadius="2xl" overflow="hidden"
      bgColor={ayurvedaBg}
      bgImage="url('/img/fondos/hinduismo.png')"
      bgSize="100% auto"
      bgRepeat="repeat-y"
      bgPosition="top center"
    >
      <Box position="absolute" inset="0" bg={`${ayurvedaBg}26`} />
    </Box>
  ) : (
    <DisciplinaBgLayer nom={ayurvedaNom} borderRadius="2xl" overlay={`${ayurvedaBg}26`} />
  );

  const contenido = (
    <>
      {fondo}
      <Box position="relative" zIndex={1} px={px} py={py}>
        {children}
      </Box>
    </>
  );

  // Accesibilidad: si el usuario pidió menos movimiento, caja estática.
  if (reduce) {
    return (
      <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={baseShadow}>
        {contenido}
      </Box>
    );
  }

  return (
    // Envoltorio EXTERIOR: balanceo de reposo infinito (su propio transform), así
    // no compite con el «pop» del hover, que va en el elemento interior.
    <MotionBox
      w="100%"
      animate={{ rotate: [0, -0.6, 0.6, 0], y: [0, -4, 0, -2, 0], scale: [1, 1.01, 1, 1.006, 1] }}
      transition={{ duration: 6.5 + fase, repeat: Infinity, ease: "easeInOut", delay: fase * 1.5 }}
      style={{ transformOrigin: "center" }}
    >
      {/* Tarjeta: «pop» elástico + glow al pasar el ratón (rebote marcado con un
          spring poco amortiguado). Sin whileTap: estos paneles contienen botones,
          checks y textareas; un squish del panel entero al tocarlos molestaría. */}
      <MotionBox
        position="relative"
        w="100%"
        borderRadius="2xl"
        overflow="hidden"
        boxShadow={baseShadow}
        whileHover={{
          scale: 1.04,
          y: -10,
          rotate: 1,
          boxShadow: hoverShadow,
          transition: { type: "spring", stiffness: 240, damping: 10 },
        }}
      >
        {contenido}
      </MotionBox>
    </MotionBox>
  );
}
