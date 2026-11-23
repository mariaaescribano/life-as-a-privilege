// Campo de contraseña con ojo para verla, común a las pantallas de acceso
// (iniciar sesión, crear cuenta y recuperar contraseña). Escribir a ciegas es la
// causa número uno de «no me deja entrar», y pesa todavía más al elegir una
// contraseña nueva y tener que repetirla sin ver ninguna de las dos.
import React, { useState } from "react";
import { Box, Input, InputGroup, InputRightElement, Text } from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useT } from "../../i18n";

/**
 * Estilo de TODOS los campos de las pantallas de acceso (sobre el turquesa).
 * Vive aquí para que el campo con ojo y los campos normales (nombre, email) no
 * puedan quedar distintos: antes estaba copiado en las tres páginas.
 */
export const inputAuthStyles = {
  bg: "#F7EBD9",
  border: "1.5px solid #005F5F66",
  color: "#005F5F",
  borderRadius: "full",
  size: "lg" as const,
  h: { base: "50px", md: "54px" },
  fontSize: { base: "lg", md: "xl" },
  textAlign: "center" as const,
  fontFamily: "'EB Garamond', serif",
  letterSpacing: "0.04em",
  boxShadow: "0 0 0 1px #005F5F00, 0 0 0 #005F5F00",
  _placeholder: { color: "#005F5F8c" },
  _hover: { border: "1.5px solid #005F5Faa" },
  // El campo con el foco: borde turquesa oscuro pleno y un halo tenue del mismo color.
  _focus: {
    border: "1.5px solid #005F5F",
    boxShadow: "0 0 0 1px #005F5F33, 0 0 16px #005F5F26",
    bg: "#FAF1E2",
    outline: "none",
  },
  _focusVisible: {
    border: "1.5px solid #005F5F",
    boxShadow: "0 0 0 1px #005F5F33, 0 0 16px #005F5F26",
    outline: "none",
  },
};

/** Para el <input type="date">: el icono del calendario sale negro sobre el
 *  turquesa si no se invierte. */
export const inputFechaSx = {
  "&::-webkit-calendar-picker-indicator": { cursor: "pointer" },
};

/**
 * El foco de TECLADO de las pantallas de acceso: el mismo azul suave que ya
 * encienden los campos, para botones, casillas y enlaces. Va en `_focusVisible`
 * a propósito: solo se ilumina al llegar con el tabulador, nunca al tocar con
 * el ratón (la regla de «nada azul al pulsar» sigue en pie).
 */
export const focoAzul = {
  // Con `outline` y NO con box-shadow, a propósito: los botones llevan
  // `transition` de sus sombras, y animar de una lista de sombras a otra de
  // distinto largo hace que el navegador rellene con sombras transparentes
  // (= NEGRO con alfa 0): el aro pasaba por azul casi negro y en el botón
  // «Entrar» se veían dos rayas oscuras un instante. El outline no es una
  // sombra: aparece nítido al momento, como el foco de cualquier programa.
  outline: "2px solid #005F5Fcc",
  outlineOffset: "2px",
} as const;

interface Props {
  /** Texto de la etiqueta, en mayúsculas: «CONTRASEÑA», «REPETIR CONTRASEÑA»… */
  label: string;
  value: string;
  onChange: (valor: string) => void;
  isDisabled?: boolean;
  /** Qué hacer al pulsar Enter dentro del campo (enviar el formulario, o
   *  saltar al campo siguiente con `inputRef` del otro). */
  onEnter?: () => void;
  /** Pista para el gestor de contraseñas: "current-password" | "new-password". */
  autoComplete?: string;
  /** Para que la página pueda ENFOCAR este campo (el salto con Enter). */
  inputRef?: React.Ref<HTMLInputElement>;
  /** Cursor puesto al cargar, cuando este campo es el primero de la página. */
  autoFocus?: boolean;
}

export function CampoContrasena({
  label,
  value,
  onChange,
  isDisabled,
  onEnter,
  autoComplete,
  inputRef,
  autoFocus,
}: Props) {
  const [visible, setVisible] = useState(false);
  const t = useT();
  const tituloOjo = visible ? t("auth.contrasena.ocultar") : t("auth.contrasena.mostrar");

  return (
    <Box>
      <Text
        color="#005F5F"
        fontSize="sm"
        letterSpacing="0.18em"
        mb={2.5}
        fontWeight="600"
        textAlign="center"
      >
        {label}
      </Text>

      <InputGroup size="lg">
        <Input
          ref={inputRef}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          isDisabled={isDisabled}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
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
            aria-label={tituloOjo}
            title={tituloOjo}
            display="flex"
            alignItems="center"
            justifyContent="center"
            w="34px"
            h="34px"
            borderRadius="full"
            bg="transparent"
            color={visible ? "#005F5F" : "#005F5Fa6"}
            cursor="pointer"
            transition="all 0.2s ease"
            _hover={{ color: "#005F5F", bg: "#005F5F14" }}
            _focusVisible={focoAzul}
          >
            {visible ? <ViewOffIcon boxSize="20px" /> : <ViewIcon boxSize="20px" />}
          </Box>
        </InputRightElement>
      </InputGroup>
    </Box>
  );
}
