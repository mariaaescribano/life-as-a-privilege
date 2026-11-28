import React, { useEffect, useState } from "react";
import { Box, Image } from "@chakra-ui/react";
import { useReducedMotion } from "framer-motion";
import { celulas } from "../../hardCoded/espacio/CelulasCuerpoData";

/**
 * Las fotos de «Tus células» una tras otra: cambia cada 1,5 s con un fundido corto.
 * Solo se carga la siguiente (son 77 fotos); la anterior se queda debajo mientras la nueva se enciende.
 * Con «reducir movimiento» se queda en la primera, quieta.
 */
const FOTOS = celulas.map((c) => c.foto);
const CADA_MS = 1500;

const CarruselCelulas = ({ color, conBorde = true }: { color: string; conBorde?: boolean }) => {
  const reducir = useReducedMotion();
  const [i, setI] = useState(0);
  const anterior = (i - 1 + FOTOS.length) % FOTOS.length;

  useEffect(() => {
    if (reducir) return;
    const id = setInterval(() => setI((n) => (n + 1) % FOTOS.length), CADA_MS);
    return () => clearInterval(id);
  }, [reducir]);

  // La siguiente se baja con antelación para que el cambio no espere a la red.
  useEffect(() => {
    const img = new window.Image();
    img.src = FOTOS[(i + 1) % FOTOS.length];
  }, [i]);

  return (
    <Box
      position="relative"
      w="100%"
      borderRadius="22px"
      overflow="hidden"
      border={conBorde ? `1.5px solid ${color}` : "none"}
      sx={{
        aspectRatio: "1 / 1",
        "@keyframes celulaEntra": { from: { opacity: 0 }, to: { opacity: 1 } },
      }}
    >
      {!reducir && (
        <Image key={`a-${anterior}`} src={FOTOS[anterior]} alt="" position="absolute" inset={0} w="100%" h="100%" objectFit="cover" />
      )}
      <Image
        key={i}
        src={FOTOS[i]}
        alt={celulas[i].nombre}
        position="absolute"
        inset={0}
        w="100%"
        h="100%"
        objectFit="cover"
        sx={{ animation: reducir ? "none" : "celulaEntra 0.45s ease both" }}
      />
    </Box>
  );
};

export default CarruselCelulas;
