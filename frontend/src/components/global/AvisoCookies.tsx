// AvisoCookies.tsx — banda inferior de consentimiento.
//
// Requisitos que cumple (y que un banner de solo "Aceptar" incumpliría):
//   · Rechazar cuesta lo mismo que aceptar: dos botones al mismo nivel.
//   · No se carga NADA de analítica hasta que se pulsa «Aceptar».
//   · Cerrar sin elegir no equivale a aceptar: el aviso vuelve a salir.
import React, { useEffect, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { TextoRico, useT } from "../../i18n";
import { useNavigate } from "react-router-dom";
import { estadoCookies, guardarConsentimiento } from "./cookies";

const Boton = ({
  children,
  onClick,
  primario = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  primario?: boolean;
}) => (
  <Box
    as="button"
    onClick={onClick}
    px={{ base: 5, md: 7 }}
    py={{ base: "9px", md: "10px" }}
    borderRadius="full"
    whiteSpace="nowrap"
    border={primario ? "1.5px solid rgba(255,255,255,0.75)" : "1px solid rgba(255,255,255,0.4)"}
    bg={primario ? "rgba(255,255,255,0.18)" : "transparent"}
    color="white"
    fontFamily="'EB Garamond', serif"
    fontSize={{ base: "sm", md: "md" }}
    fontWeight={primario ? "700" : "500"}
    letterSpacing="0.1em"
    textTransform="uppercase"
    cursor="pointer"
    transition="all 0.22s ease"
    _hover={{
      bg: primario ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.12)",
      borderColor: "white",
    }}
  >
    {children}
  </Box>
);

export default function AvisoCookies() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Solo se muestra si todavía no hay decisión guardada.
    if (estadoCookies() === null) {
      const t = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  if (!visible) return null;

  const t = useT();

  const decidir = (valor: "aceptadas" | "rechazadas") => {
    guardarConsentimiento(valor);
    setVisible(false);
  };

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      zIndex={2000}
      bg="rgba(0, 74, 74, 0.97)"
      borderTop="1px solid rgba(255,255,255,0.25)"
      boxShadow="0 -8px 32px rgba(0,0,0,0.35)"
      px={{ base: 5, md: 10 }}
      py={{ base: 5, md: 6 }}
      fontFamily="'EB Garamond', serif"
    >
      <Flex
        maxW="1100px"
        mx="auto"
        direction={{ base: "column", md: "row" }}
        align={{ base: "stretch", md: "center" }}
        gap={{ base: 4, md: 8 }}
      >
        <Text color="rgba(255,255,255,0.92)" fontSize={{ base: "sm", md: "md" }} lineHeight="1.7" flex="1">
          <TextoRico>{t("cookies.aviso")}</TextoRico>{" "}
          <Text
            as="span"
            textDecoration="underline"
            cursor="pointer"
            _hover={{ color: "white" }}
            onClick={() => navigate("/cookies")}
          >
            {t("cookies.masInfo")}
          </Text>
          .
        </Text>

        <Flex gap={3} justify={{ base: "center", md: "flex-end" }} flexShrink={0}>
          <Boton onClick={() => decidir("rechazadas")}>{t("cookies.rechazar")}</Boton>
          <Boton onClick={() => decidir("aceptadas")} primario>
            {t("cookies.aceptar")}
          </Boton>
        </Flex>
      </Flex>
    </Box>
  );
}
