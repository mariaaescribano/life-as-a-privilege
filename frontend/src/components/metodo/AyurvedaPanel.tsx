import React from "react";
import { Box } from "@chakra-ui/react";
import { DisciplinaBgLayer } from "../global/DisciplinaBgLayer";
import { ayurvedaBg, ayurvedaNom } from "../../GlobalVariables";

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
 * usuario cuando YA conoce su dosha—. Es un componente ESTÁTICO: NO se mueve por
 * sí solo. Antes tenía un balanceo de reposo infinito que distraía y dificultaba
 * la lectura; se quitó a propósito.
 *
 * El DINAMISMO es solo de ENTRADA: la caja se coloca en escena (fundido + subida
 * + leve zoom) al cargar la página, mediante el `Reveal` / `RevealStagger` que la
 * envuelve en cada página —y luego se queda quieta para poder leerla—. No se
 * duplica aquí para no solapar dos entradas ni volver a introducir movimiento.
 *
 * NO lleva hover ni reacción al toque a propósito: estos paneles contienen
 * botones, checks y textareas, y en táctil el estado hover se quedaba «pegado».
 *
 * Al vivir en un solo archivo, el cambio se ve en TODAS las páginas y en los tres
 * doshas (vata / pitta / kapha).
 */
export function AyurvedaPanel({
  children,
  color,
  tile,
  px = { base: 6, md: 10 },
  py = { base: 7, md: 9 },
}: AyurvedaPanelProps) {
  const baseShadow = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${color}1a, 0 0 48px ${color}10`;

  const fondo = tile ? (
    // Fondo en bandas (la acuarela se repite a lo ancho y se apila).
    <Box
      position="absolute" inset="0" zIndex={0} pointerEvents="none"
      borderRadius="2xl" overflow="hidden"
      bgColor={ayurvedaBg}
      bgImage="url('/img/fondos/hinduismo.webp')"
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

  // Caja estática: sin balanceo, sin hover. La entrada la aporta el Reveal que la
  // envuelve; una vez colocada, se queda quieta para poder leerla.
  return (
    <Box position="relative" w="100%" borderRadius="2xl" overflow="hidden" boxShadow={baseShadow}>
      {contenido}
    </Box>
  );
}
