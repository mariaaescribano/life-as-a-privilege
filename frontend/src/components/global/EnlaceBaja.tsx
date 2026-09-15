import React from "react";
import { Text } from "@chakra-ui/react";
import { API_URL } from "../../GlobalVariables";
import { useT } from "../../i18n";

/**
 * «Puedes darte de baja cuando quieras», debajo de todo formulario que apunta
 * a la lista de correo.
 *
 * Va aquí y no solo en el pie de los correos a propósito: quien deja su correo
 * tiene que ver, en ese mismo momento, que la salida existe y dónde está.
 *
 * El enlace apunta al BACKEND (`/subscribe/baja`), que es quien pinta la
 * página; con API_URL el dominio se resuelve solo y no hay nada que tocar al
 * cambiar de dominio.
 */
export function EnlaceBaja({ mt = 4 }: { mt?: number }) {
  const t = useT();
  return (
    <Text
      as="a"
      href={`${API_URL}/subscribe/baja`}
      rel="nofollow"
      display="block"
      mt={mt}
      color="rgba(255,255,255,0.45)"
      fontSize="xs"
      fontFamily="'EB Garamond', serif"
      letterSpacing="0.04em"
      textAlign="center"
      textDecoration="none"
      transition="color 0.2s"
      _hover={{ color: "rgba(255,255,255,0.85)", textDecoration: "underline" }}
    >
      {t("suscribir.baja")}
    </Text>
  );
}

export default EnlaceBaja;
