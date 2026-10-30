import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useT } from "../../i18n";
import { nombreDisciplina } from "../../i18n/nombreDisciplina";
import { presentacionPorKey } from "../../data/presentacionDisciplinas";

/**
 * El nombre de la pestaña del navegador sigue a la persona: en cada página dice en qué
 * recurso está («Ilustraciones», «Astrología»…; solo la portada dice «María Escribano»),
 * para que, con varias pestañas abiertas, no se pierda nunca.
 *
 * Es UNA sola pieza, montada en App: mira la ruta y decide el nombre. Una página
 * nueva que merezca su propio nombre se añade en `recursoDeRuta`; las que no están
 * dejan solo «María Escribano». Se recalcula al cambiar de ruta Y de idioma.
 */
const MARCA = "María Escribano";

export default function TituloPestana() {
  const { pathname } = useLocation();
  const t = useT();

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
        case "aprendizaje": return t("header.cursos");
        case "disciplina":
        case "d": return disciplina(b);
        case "elMetodo": return t("header.mapa");
        case "logIn": return t("auth.login.titulo");
        case "signIn": return t("auth.signin.titulo");
        default: return undefined;
      }
    };

    const r = recurso();
    document.title = r ?? MARCA;
  }, [pathname, t]);

  return null;
}
