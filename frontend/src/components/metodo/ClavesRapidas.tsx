import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";

// ─────────────────────────────────────────────────────────────────────────
// LAS 3 CLAVES · cajas blancas apiladas con un punto de acento.
//
// Van SIEMPRE encima del texto largo, justo bajo el título: quien tenga tres
// segundos se lleva lo esencial sin leer nada más; quien tenga tres minutos
// sigue hacia abajo. Nació en las fichas de Fisiología (FichaFisioModal) y se
// sacó aquí para poder usarlo igual en el visor de cómic (ComicViewer), que es
// por donde se leen las fichas de Nutrición.
//
// No dupliques este bloque: si hay que retocar el estilo, se retoca aquí.
// ─────────────────────────────────────────────────────────────────────────

export function ClavesRapidas({
  claves,
  accent,
  tinta = "#1a1a1a",
  mb = { base: 5, md: 6 },
}: {
  /** Las pocas cosas (tres, normalmente) que hay que llevarse de la ficha. */
  claves?: string[];
  /** Color del punto de la izquierda: el acento de la disciplina. */
  accent: string;
  /** Color de la LETRA. Va sobre blanco, así que tiene que ser oscuro: por eso
   *  no se hereda el color del texto de la ficha (en Medicina China es blanco y
   *  en Nutrición el fondo de la disciplina es casi blanco). */
  tinta?: string;
  mb?: any;
}) {
  if (!claves || claves.length === 0) return null;
  return (
    <Flex direction="column" gap={{ base: 2, md: 2.5 }} mb={mb} w="100%">
      {claves.map((c, i) => (
        <Flex
          key={i}
          align="center"
          gap={3}
          bg="rgba(255,255,255,0.96)"
          borderRadius="lg"
          px={{ base: 3.5, md: 4 }}
          py={{ base: 2, md: 2.5 }}
          boxShadow="0 2px 10px rgba(0,0,0,0.28)"
        >
          {/* El punto va LIMPIO, sin halo: el glow del color de la disciplina
              está pensado para brillar sobre fondo oscuro, y aquí la caja es
              blanca — se veía como una mancha sucia alrededor del punto. */}
          <Box flexShrink={0} w="8px" h="8px" borderRadius="full" bg={accent} />
          <Text color={tinta} fontWeight={700} fontSize={{ base: "sm", md: "md" }}
                lineHeight="1.3" letterSpacing="0.01em" fontFamily="'EB Garamond', serif"
                textAlign="left">
            {c}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
}

export default ClavesRapidas;
