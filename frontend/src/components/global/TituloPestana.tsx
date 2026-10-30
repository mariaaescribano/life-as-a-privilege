import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useIdioma, useT } from "../../i18n";
import { fetchCursosData } from "../../data/cursosApi";
import { disciplinaCursoBySlug } from "../../data/disciplinasCurso";
import { nombreDisciplina } from "../../i18n/nombreDisciplina";
import { presentacionPorKey } from "../../data/presentacionDisciplinas";

/**
 * El nombre de la pestaña del navegador sigue a la persona: en cada página dice en qué
 * recurso está y, detrás, la marca: «Cursos · María Escribano», «Disciplinas · María Escribano»…
 * (la portada dice solo «María Escribano»), para que, con varias pestañas abiertas, no se pierda nunca.
 *
 * Es UNA sola pieza, montada en App: mira la ruta y decide el nombre. Una página
 * nueva que merezca su propio nombre se añade en `recursoDeRuta`; las que no están
 * dejan solo «María Escribano». Un curso o lección concretos llevan su propio nombre. Se recalcula al cambiar de ruta Y de idioma.
 */
const MARCA = "María Escribano";

export default function TituloPestana() {
  const { pathname } = useLocation();
  const t = useT();
  const { idioma } = useIdioma();

  useEffect(() => {
    const disciplina = (slug?: string) => {
      const p = presentacionPorKey(slug);
      return p ? nombreDisciplina(p.nom) : undefined;
    };

    const recurso = (): string | undefined => {
      const partes = pathname.split("/").filter(Boolean);
      const [a, b] = partes;
      if (!a || a === "welcome") return undefined;
      switch (a) {
        case "quienSoy": return t("header.sobreMi");
        case "asesoria": return t("header.asesoria");
        case "premium": return t("header.premium");
        case "disciplinas": return t("header.disciplinas");
        case "materiales": return t("header.materiales");
        case "contacto": return t("header.contacto");
        case "ilustraciones": {
          const d = disciplina(b);
          return d ? `${t("materiales.ilustraciones")} · ${d}` : t("materiales.ilustraciones");
        }
        case "libros": return t("materiales.libros");
        case "audiolibros": return t("materiales.audiolibros");
        case "aprendizaje": {
          // Dentro de un curso o una lección la pestaña lleva SU nombre (se completa abajo,
          // cuando llegan los cursos); aquí solo lo que se sabe sin pedir nada.
          if (b === "cursos") {
            const disc = disciplinaCursoBySlug(partes[2]);
            return disc ? t("aprendizaje.cursosDe", { disciplina: nombreDisciplina(disc.nom) }) : t("header.cursos");
          }
          if (b === "herbario") return t("aprendizaje.btn.herbario");
          if (b === "alimentos") return t("aprendizaje.btn.alimentos");
          if (b === "calcular-necesidades") return t("aprendizaje.btn.calcularNecesidades");
          if (b === "test-doshas") return t("aprendizaje.btn.testDoshas");
          return t("header.cursos");
        }
        case "disciplina":
        case "d": return disciplina(b);
        case "elMetodo": return t("header.mapa");
        case "logIn": return t("auth.login.titulo");
        case "signIn": return t("auth.signin.titulo");
        default: return undefined;
      }
    };

    const r = recurso();
    document.title = r ? `${r} · ${MARCA}` : MARCA;

    // Curso o lección concretos: la pestaña dice cuál es y, al final, la marca. Si no cabe, el
    // navegador corta por detrás; por eso va lo más específico primero.
    const partes = pathname.split("/").filter(Boolean);
    if (partes[0] !== "aprendizaje") return;
    const [, tipo, , p2, p3] = partes;
    const cursoId = tipo === "modulosPage" || tipo === "leccion" ? p2 : undefined;
    const leccionId = tipo === "leccion" ? p3 : tipo === "videoLessonPage" ? p2 : undefined;
    if (!cursoId && !leccionId) return;
    let vivo = true;
    fetchCursosData(idioma).then((datos) => {
      if (!vivo) return;
      for (const m of Object.values(datos)) {
        for (const c of m.cursos) {
          if (cursoId && c.id !== cursoId) continue;
          const l = leccionId ? (c.modulos ?? []).flatMap((x) => x.submodules).find((x) => x.id === leccionId) : undefined;
          if (leccionId && !l) continue;
          document.title = `${l ? `${c.titulo} · ${l.nom}` : c.titulo} · ${MARCA}`;
          return;
        }
      }
    });
    return () => { vivo = false; };
  }, [pathname, t, idioma]);

  return null;
}
