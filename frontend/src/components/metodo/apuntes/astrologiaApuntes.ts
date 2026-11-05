// ─────────────────────────────────────────────────────────────────────────
// «CREA TUS APUNTES PERSONALES» · ASTROLOGÍA
//
// Cada signo, cada casa, cada planeta y cada aspecto es UN capítulo que se marca
// o no: así la persona se lleva en el PDF los elementos exactos que quiere, ni
// uno más. Salen agrupados en la pantalla (Signos, Casas, Planetas, Aspectos).
//
// No hay texto nuevo aquí: cada capítulo pinta la viñeta que YA existe en los
// cómics (la misma foto y las mismas frases que se leen en la web). Corregir una
// frase en su viñeta la corrige también en el papel.
// ─────────────────────────────────────────────────────────────────────────
import type { ApuntesCapitulo, ApuntesLibro } from "../../../utils/pdf/apuntesTipos";
import type { Taller } from "../../../utils/pdf/atelier";
import type { FotoCache } from "../../../utils/pdf/fotos";
import { TEMA_ASTROLOGIA } from "../../../utils/pdf/temas";
import { seccionesAstro } from "../astrologiaIntroData";
import { traducir } from "../../../i18n";
import type { ClaveTexto } from "../../../i18n";

export function libroApuntesAstrologia(): ApuntesLibro {
  const capitulos: ApuntesCapitulo[] = [];

  for (const sec of seccionesAstro()) {
    const grupo = traducir(`metodo.astro.explica.${sec.clave}` as ClaveTexto);
    // En signos y casas la primera línea de la viñeta es el nombre en mayúsculas
    // (ya sale como título del capítulo): no se repite en el cuerpo.
    const sinNombre = sec.clave === "signos" || sec.clave === "casas";

    sec.tarjetas.forEach((c, i) => {
      const v = sec.vinetas[i];
      const parrafos = sinNombre ? v.paragraphs.slice(1) : v.paragraphs;
      capitulos.push({
        key: `${sec.clave}-${c.clave}`,
        grupo,
        titulo: c.titulo,
        resumen: c.frase,
        fotos: [c.foto],
        pintar: (t: Taller, fotos: FotoCache, conFotos: boolean) => {
          t.capitulo(c.titulo, grupo);
          t.vineta(conFotos ? fotos.get(c.foto) : undefined, parrafos);
        },
      });
    });
  }

  return {
    disciplina: "Astrología",
    tema: TEMA_ASTROLOGIA,
    titulo: "Mis apuntes de Astrología",
    archivo: "mis-apuntes-astrologia",
    portadas: [
      { key: "cielo", label: "El cielo", src: "/img/astrologia/space.webp" },
      { key: "astro", label: "La carta", src: "/img/astrologia/astro.webp" },
    ],
    capitulos,
  };
}
