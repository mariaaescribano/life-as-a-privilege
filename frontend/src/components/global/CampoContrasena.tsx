// Campo de contraseña con ojo para verla, común a las pantallas de acceso
// (iniciar sesión, crear cuenta y recuperar contraseña). Escribir a ciegas es la
// causa número uno de «no me deja entrar», y pesa todavía más al elegir una
// contraseña nueva y tener que repetirla sin ver ninguna de las dos.
import React, { useState } from "react";
import { Box, Input, InputGroup, InputRightElement, Text } from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

/**
 * Estilo de TODOS los campos de las pantallas de acceso (sobre el turquesa).
 * Vive aquí para que el campo con ojo y los campos normales (nombre, email) no
 * puedan quedar distintos: antes estaba copiado en las tres páginas.
 */
export const inputAuthStyles = {
  bg: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.28)",
  color: "white",
  borderRadius: "full",
  size: "lg" as const,
  textAlign: "center" as const,
  fontFamily: "'EB Garamond', serif",
  letterSpacing: "0.04em",
  boxShadow: "0 0 10px rgba(255,255,255,0.12)",
  _placeholder: { color: "rgba(255,255,255,0.4)" },
  _hover: { border: "1px solid rgba(255,255,255,0.55)" },
  _focus: {
    border: "1px solid rgba(255,255,255,0.85)",
    boxShadow: "0 0 0 1px rgba(255,255,255,0.25), 0 0 18px rgba(255,255,255,0.3)",
    bg: "rgba(255,255,255,0.12)",
    outline: "none",
  },
};

interface Props {
  /** Texto de la etiqueta, en mayúsculas: «CONTRASEÑA», «REPETIR CONTRASEÑA»… */
  label: string;
  value: string;
  onChange: (valor: string) => void;
  isDisabled?: boolean;
  /** Qué hacer al pulsar Enter dentro del campo (enviar el formulario). */
  onEnter?: () => void;
  /** Pista para el gestor de contraseñas: "current-password" | "new-password". */
  autoComplete?: string;
}

export function CampoContrasena({
  label,
  value,
  onChange,
  isDisabled,
  onEnter,
  autoComplete,
}: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <Box>
      <Text
        color="rgba(255,255,255,0.78)"
        fontSize="xs"
        letterSpacing="0.18em"
        mb={2}
        fontWeight="600"
        textAlign="center"
        textShadow="0 0 8px rgba(255,255,255,0.35)"
      >
        {label}
      </Text>

      <InputGroup size="lg">
        <Input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          isDisabled={isDisabled}
          autoComplete={autoComplete}
          onKeyDown={(e) => { if (e.key === "Enter" && !isDisabled) onEnter?.(); }}
          {...inputAuthStyles}
          // Hueco IGUAL a los dos lados: el texto va centrado, así que dejar
          // sitio solo a la derecha lo descentraría respecto al campo. Así la
          // contraseña nunca se mete por debajo del ojo.
          px="3.25rem"
        />
        <InputRightElement h="100%" w="3.25rem">
          <Box
            as="button"
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
            title={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
            display="flex"
            alignItems="center"
            justifyContent="center"
            w="34px"
            h="34px"
            borderRadius="full"
            bg="transparent"
            color={visible ? "white" : "rgba(255,255,255,0.6)"}
            cursor="pointer"
            transition="all 0.2s ease"
            _hover={{ color: "white", bg: "rgba(255,255,255,0.14)" }}
            style={visible ? { filter: "drop-shadow(0 0 8px rgba(255,255,255,0.5))" } : undefined}
          >
            {visible ? <ViewOffIcon boxSize="18px" /> : <ViewIcon boxSize="18px" />}
          </Box>
        </InputRightElement>
      </InputGroup>
    </Box>
  );
}
