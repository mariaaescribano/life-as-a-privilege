// ─────────────────────────────────────────────────────────────────────────────
// TEXTO MARCADO — el mini-formato del diario de sesiones.
//
// Tres marcas y nada más (no es un markdown entero):
//   **así**   → negrita
//   *así*     → cursiva
//   ---       → una rayita separadora (también vale «- - -»)
//
// Lo usan la página /diario, el panel /admin/diario/:userId y cualquier sitio
// que pinte el contenido de una entrada. La tarjeta del Home no lo pinta:
// para su vista previa está sinMarcas(), que quita los asteriscos.
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import { Box, Text, type TextProps } from "@chakra-ui/react";

/** Una línea que solo tiene tres o más rayas (con o sin espacios) es separador. */
const esSeparador = (linea: string) => /^(-\s*){3,}$/.test(linea.trim());

/** Trocea el texto en bloques: párrafos y separadores. */
const partir = (texto: string): Array<{ tipo: "texto" | "raya"; valor: string }> => {
  const bloques: Array<{ tipo: "texto" | "raya"; valor: string }> = [];
  let acumulado: string[] = [];
  const cerrar = () => {
    const t = acumulado.join("\n").replace(/^\n+|\n+$/g, "");
    if (t) bloques.push({ tipo: "texto", valor: t });
    acumulado = [];
  };
  for (const linea of (texto ?? "").split("\n")) {
    if (esSeparador(linea)) {
      cerrar();
      bloques.push({ tipo: "raya", valor: "" });
    } else {
      acumulado.push(linea);
    }
  }
  cerrar();
  return bloques;
};

/** Convierte **negrita** y *cursiva* en <b> y <i>. Lo demás, tal cual. */
const conEnfasis = (texto: string): React.ReactNode[] =>
  texto.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((trozo, i) => {
    if (/^\*\*[^*]+\*\*$/.test(trozo)) {
      return (
        <Box as="strong" key={i} fontWeight="700">
          {trozo.slice(2, -2)}
        </Box>
      );
    }
    if (/^\*[^*]+\*$/.test(trozo)) {
      return (
        <Box as="em" key={i} fontStyle="italic">
          {trozo.slice(1, -1)}
        </Box>
      );
    }
    return trozo;
  });

interface Props extends TextProps {
  texto: string;
  /** Color de la rayita separadora (normalmente el `txt` de la disciplina). */
  colorRaya?: string;
}

// El Text de Chakra sin su `as` genérico: hacerle spread de unos TextProps
// sueltos le hace calcular la unión de TODOS los elementos posibles y el
// compilador revienta (TS2590). Con el tipo fijado a TextProps compila y las
// props siguen igual de comprobadas en quien nos llama.
const TextoBase = Text as React.FC<TextProps>;

export function TextoMarcado({ texto, colorRaya = "currentColor", ...props }: Props) {
  return (
    <>
      {partir(texto).map((b, i) =>
        b.tipo === "raya" ? (
          <Box key={i} my={4} h="1px" w="100%" bg={colorRaya} opacity={0.45} borderRadius="full" />
        ) : (
          <TextoBase key={i} whiteSpace="pre-wrap" {...props}>
            {conEnfasis(b.valor)}
          </TextoBase>
        ),
      )}
    </>
  );
}

/** El texto sin marcas, para vistas previas de una o dos líneas. */
export const sinMarcas = (texto: string): string =>
  (texto ?? "")
    .split("\n")
    .filter((l) => !esSeparador(l))
    .join("\n")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1");
