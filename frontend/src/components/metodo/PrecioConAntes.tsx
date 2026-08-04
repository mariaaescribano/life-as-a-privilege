import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import { PRECIO_DISCIPLINA, PRECIO_DISCIPLINA_ANTES } from "./pagoDisciplinaLink";

/**
 * El precio de una disciplina con su precio de referencia al lado, tachado y en
 * pequeño.
 *
 * Vive en un solo sitio porque se enseña en dos (el box de pago y la tarjeta del
 * mandala) y las dos cifras tienen que verse igual: si el tachado sale distinto
 * en cada pantalla, parece un error de la web y no una oferta.
 *
 * Si `PRECIO_DISCIPLINA_ANTES` es null (ver pagoDisciplinaLink.ts, donde está
 * explicado por qué puede tener que estarlo), aquí solo sale el precio.
 */
export function PrecioConAntes({
  precio = PRECIO_DISCIPLINA,
  color,
  sombra,
  tamano = { base: "4xl", md: "5xl" },
  tamanoAntes = { base: "lg", md: "xl" },
  justify = "center",
}: {
  precio?: string;
  /** Color del precio (el tachado va del mismo color, más apagado). */
  color: string;
  /** textShadow del precio grande, para que case con el resto de la caja. */
  sombra?: string;
  tamano?: Record<string, string> | string;
  tamanoAntes?: Record<string, string> | string;
  justify?: string;
}) {
  return (
    <Flex align="baseline" justify={justify} gap={{ base: 2, md: 2.5 }}>
      <Text
        color={color}
        fontSize={tamano}
        fontWeight="700"
        lineHeight="1"
        letterSpacing="0.02em"
        textShadow={sombra}
      >
        {precio}
      </Text>
      {PRECIO_DISCIPLINA_ANTES && (
        <Text
          as="span"
          color={color}
          opacity={0.62}
          fontSize={tamanoAntes}
          fontWeight="500"
          lineHeight="1"
          textDecoration="line-through"
        >
          {PRECIO_DISCIPLINA_ANTES}
        </Text>
      )}
    </Flex>
  );
}
