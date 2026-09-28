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
  bg: "rgba(255,255,255,0.09)",
  border: "1px solid rgba(255,255,255,0.34)",
  color: "white",
  borderRadius: "full",
  size: "lg" as const,
  // Un poco más grandes que el `lg` de Chakra (48px de alto): estas pantallas van
  // dentro de un scale(0.8), así que a tamaño normal se quedaban pequeñas.
  h: { base: "54px", md: "58px" },
  fontSize: { base: "lg", md: "xl" },
  textAlign: "center" as const,
  fontFamily: "'EB Garamond', serif",
  letterSpacing: "0.04em",
  // Dos sombras SIEMPRE (la primera con alfa 0): la lista en reposo y la del
  // foco tienen el mismo largo, y así la animación nunca rellena con sombras
  // transparentes (= negro con alfa 0), que oscurecían el borde un instante.
  boxShadow: "0 0 0 1px rgba(150,200,255,0), 0 0 10px rgba(255,255,255,0.12)",
  _placeholder: { color: "rgba(255,255,255,0.4)" },
  _hover: { border: "1px solid rgba(255,255,255,0.55)" },
  // El campo con el foco se marca en AZUL, a propósito: en las pantallas de
  // acceso (iniciar sesión, crear cuenta, recuperar) hay varios campos iguales
  // y en blanco no se distinguía cuál estaba activo. Es la excepción al «nada
  // azul al pulsar» del resto de la web, y por eso va suave: un azul cielo
  // claro con un halo tenue, no el azul eléctrico del navegador.
  _focus: {
    border: "1px solid rgba(150,200,255,0.85)",
    boxShadow: "0 0 0 1px rgba(150,200,255,0.3), 0 0 18px rgba(150,200,255,0.28)",
    bg: "rgba(255,255,255,0.12)",
    outline: "none",
  },
  // También en _focusVisible: es donde Chakra aplica su focusBorderColor (el
  // `currentColor` global de main.tsx, aquí blanco), y sin esto taparía el azul.
  _focusVisible: {
    border: "1px solid rgba(150,200,255,0.85)",
    boxShadow: "0 0 0 1px rgba(150,200,255,0.3), 0 0 18px rgba(150,200,255,0.28)",
    outline: "none",
  },
};

/** Para el <input type="date">: el icono del calendario sale negro sobre el
 *  turquesa si no se invierte. */
export const inputFechaSx = {
  "&::-webkit-calendar-picker-indicator": { filter: "invert(1)", cursor: "pointer" },
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
  outline: "2px solid rgba(150,200,255,0.85)",
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
        color="rgba(255,255,255,0.78)"
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
            color={visible ? "white" : "rgba(255,255,255,0.6)"}
            cursor="pointer"
            transition="all 0.2s ease"
            _hover={{ color: "white", bg: "rgba(255,255,255,0.14)" }}
            _focusVisible={focoAzul}
            style={visible ? { filter: "drop-shadow(0 0 8px rgba(255,255,255,0.5))" } : undefined}
          >
            {visible ? <ViewOffIcon boxSize="20px" /> : <ViewIcon boxSize="20px" />}
          </Box>
        </InputRightElement>
      </InputGroup>
    </Box>
  );
}
