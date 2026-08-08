import React from "react";

/**
 * Pinta un texto del diccionario respetando las **negritas**.
 *
 * ¿Por qué no partir la frase en trozos y poner el `<b>` en el JSX? Porque el
 * énfasis casi nunca cae en el mismo sitio en los dos idiomas: en español
 * decimos «puedes recorrer **solo Astrología**» y en inglés «you can walk
 * **Astrology on its own**». Si se trocea, el traductor no puede mover la
 * negrita y la frase queda forzada. Así cada frase sigue siendo UNA unidad.
 *
 *   <TextoRico>{t("presentacion.soloUna", { disciplina })}</TextoRico>
 */
export const TextoRico = ({ children }: { children: string }) => (
  <>
    {children.split(/(\*\*[^*]+\*\*)/g).map((trozo, i) =>
      trozo.startsWith("**") && trozo.endsWith("**") ? (
        <b key={i}>{trozo.slice(2, -2)}</b>
      ) : (
        <React.Fragment key={i}>{trozo}</React.Fragment>
      ),
    )}
  </>
);
