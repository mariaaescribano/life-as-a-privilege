import React from "react";
import { Text } from "@chakra-ui/react";
import { useT } from "../../i18n";

/**
 * «Puedes darte de baja cuando quieras», debajo de todo formulario que apunta
 * a la lista de correo.
 *
 * Va aquí y no solo en el pie de los correos a propósito: quien deja su correo
 * tiene que ver, en ese mismo momento, que la salida existe y dónde está.
 *
 * El enlace apunta a la página /baja de la propia web (la misma que abren los
 * correos), así que no depende del dominio del backend.
 */
export function EnlaceBaja({ mt = 4, color = "rgba(255,255,255,0.45)", colorHover = "rgba(255,255,255,0.85)" }: { mt?: number; color?: string; colorHover?: string }) {
  const t = useT();
  return (
    <Text
      as="a"
      href="/baja"
      rel="nofollow"
      display="block"
      mt={mt}
      color={color}
      fontSize="xs"
      fontFamily="'EB Garamond', serif"
      letterSpacing="0.04em"
      textAlign="center"
      textDecoration="none"
      transition="color 0.2s"
      _hover={{ color: colorHover, textDecoration: "underline" }}
    >
      {t("suscribir.baja")}
    </Text>
  );
}

export default EnlaceBaja;
