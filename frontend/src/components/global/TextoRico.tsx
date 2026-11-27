import React from "react";

/**
 * Pinta un texto con el formato mínimo de la casa: `***x***` = negrita y cursiva, `**x**` = negrita, `*x*` = cursiva.
 * Un salto de línea doble (`\n\n`) NO se trata aquí: cada párrafo va en su propia clave.
 */
const PATRON = /(\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*)/;

export function TextoRico({ texto }: { texto: string }) {
  return (
    <>
      {texto.split(PATRON).map((trozo, i) => {
        if (trozo.startsWith("***") && trozo.endsWith("***") && trozo.length > 6) {
          return <b key={i}><i>{trozo.slice(3, -3)}</i></b>;
        }
        if (trozo.startsWith("**") && trozo.endsWith("**") && trozo.length > 4) return <b key={i}>{trozo.slice(2, -2)}</b>;
        if (trozo.startsWith("*") && trozo.endsWith("*") && trozo.length > 2) return <i key={i}>{trozo.slice(1, -1)}</i>;
        return <React.Fragment key={i}>{trozo}</React.Fragment>;
      })}
    </>
  );
}

export default TextoRico;
