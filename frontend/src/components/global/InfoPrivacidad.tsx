import React from "react";
import { Text } from "@chakra-ui/react";
import { useT } from "../../i18n";

/**
 * Información básica de protección de datos, debajo de todo formulario que
 * recoge datos personales (registro, suscripción, reseñas).
 *
 * El RGPD (art. 13) obliga a informar EN EL MOMENTO de recoger los datos, no
 * solo en una página aparte: quién, para qué y qué derechos hay. Esta es la
 * «primera capa» que recomienda la AEPD; la segunda es /privacidad, que se
 * abre en otra pestaña para no perder lo que ya se ha escrito en el formulario.
 */
const TEXTO = {
  registro: "privacidad.infoRegistro",
  opinion: "privacidad.infoOpinion",
} as const;

export function InfoPrivacidad({
  tipo,
  mt = 4,
  tono = "claro",
}: {
  tipo: "registro" | "opinion";
  mt?: number;
  /** "oscuro" = letra turquesa oscuro, para cuando va dentro de una caja de mármol. */
  tono?: "claro" | "oscuro";
}) {
  const t = useT();
  return (
    <Text
      mt={mt}
      color={tono === "oscuro" ? "#004f4f" : "rgba(255,255,255,0.55)"}
      fontSize="xs"
      fontFamily="'EB Garamond', serif"
      letterSpacing="0.03em"
      lineHeight="1.6"
      textAlign="center"
    >
      {t(TEXTO[tipo])}{" "}
      <Text
        as="a"
        href="/privacidad"
        target="_blank"
        rel="noopener"
        textDecoration="underline"
        _hover={{ color: tono === "oscuro" ? "#002f2f" : "rgba(255,255,255,0.9)" }}
      >
        {t("privacidad.enlace")}
      </Text>
      .
    </Text>
  );
}

export default InfoPrivacidad;
