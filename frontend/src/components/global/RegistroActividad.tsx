import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../GlobalVariables";
import { presentacionPorKey } from "../../data/presentacionDisciplinas";
import { suplantacionActiva } from "../../api/suplantar";

// ─────────────────────────────────────────────────────────────────────────
// Qué recursos GRATUITOS abre cada persona con cuenta (tabla
// actividad_recurso). Con eso se sabe qué le interesa y se le pueden mandar
// los emails semanales con lo que más le puede tocar.
//
// Igual que MigaDelMapa: se monta UNA vez en App y mira la ruta, así ninguna
// página nueva se olvida de apuntarse. Para lo que se abre DENTRO de una
// página (un cómic de la galería) está `registrarActividad`.
//
// Reglas:
//  · Sin sesión, nada: no hay a quién escribirle y no hace falta cookie.
//  · Con la admin «entrando como» alguien, nada: no son sus visitas.
//  · Una vez por recurso y visita (sessionStorage); el backend además solo
//    suma una visita si la anterior fue hace más de 30 minutos.
//  · Nunca molesta: sin await, y si falla, se calla.
// ─────────────────────────────────────────────────────────────────────────

export type TipoActividad =
  | "mapa" | "portada" | "presentacion" | "ilustraciones" | "ilustracion"
  | "cursos" | "curso" | "leccion" | "recursos" | "herramienta" | "test"
  | "libros" | "libro";

export type Actividad = {
  recurso: string;
  tipo: TipoActividad;
  disciplina?: string | null;
  titulo?: string;
};

const YA_APUNTADO = "actividadApuntada";

/** Clave canónica de la disciplina ('astrologia', 'medicinachina'…) a partir
 *  de lo que venga en la URL o en una etiqueta («Astrología», «Hinduismo»). */
export function disciplinaDe(texto: string | undefined | null): string | null {
  if (!texto) return null;
  let s = texto;
  try { s = decodeURIComponent(texto); } catch { /* ya venía decodificado */ }
  if (/fitoterapia|herbario/i.test(s)) return "fitoterapia";
  return presentacionPorKey(s)?.key ?? null;
}

/** ¿Esta ruta es un recurso gratuito que merece apuntarse? */
export function clasificarRuta(pathname: string): Actividad | null {
  const p = pathname.replace(/\/+$/, "") || "/";
  const [, a, b, c] = p.split("/");
  const al = (a ?? "").toLowerCase();

  if (al === "elmetodo") return { recurso: p, tipo: "mapa" };
  if (al === "disciplina" && b) return { recurso: p, tipo: "portada", disciplina: disciplinaDe(b) };
  if (al === "d" && b) return { recurso: p, tipo: "presentacion", disciplina: disciplinaDe(b) };
  if (al === "ilustraciones") return { recurso: p, tipo: "ilustraciones", disciplina: disciplinaDe(b) };
  if (al === "libros") return { recurso: p, tipo: b === "descargar" ? "libro" : "libros" };
  if (al === "recursos" && b) return { recurso: p, tipo: "recursos", disciplina: disciplinaDe(b.replace(/-camino$/, "")) };
  if (al === "tcm" && b === "test") return { recurso: p, tipo: "test", disciplina: "medicinachina" };
  if (al === "espacio" && b === "celulas-cuerpo") return { recurso: p, tipo: "herramienta", disciplina: "fisiologia" };

  if (al === "aprendizaje") {
    switch (b) {
      case "cursos": return c ? { recurso: p, tipo: "cursos", disciplina: disciplinaDe(c) } : null;
      case "modulosPage": return c ? { recurso: p, tipo: "curso", disciplina: disciplinaDe(c) } : null;
      case "leccion": return c ? { recurso: p, tipo: "leccion", disciplina: disciplinaDe(c) } : null;
      case "videoLessonPage": return c ? { recurso: p, tipo: "leccion", disciplina: disciplinaDe(c) } : null;
      case "herbario": return { recurso: p, tipo: "herramienta", disciplina: "fitoterapia" };
      case "alimentos": return { recurso: p, tipo: "herramienta", disciplina: "nutricion" };
      case "calcular-necesidades": return { recurso: p, tipo: "herramienta", disciplina: "nutricion" };
      case "test-doshas": return { recurso: p, tipo: "test", disciplina: "ayurveda" };
      default: return null;
    }
  }
  return null;
}

/** Apunta que la persona ha abierto un recurso. Se puede llamar desde
 *  cualquier sitio; si no hay sesión, no hace nada. */
export function registrarActividad(a: Actividad): void {
  let token: string | null = null;
  try { token = localStorage.getItem("token"); } catch { return; }
  if (!token || suplantacionActiva()) return;

  try {
    const hechos: string[] = JSON.parse(sessionStorage.getItem(YA_APUNTADO) || "[]");
    if (Array.isArray(hechos) && hechos.includes(a.recurso)) return;
    sessionStorage.setItem(YA_APUNTADO, JSON.stringify([...(Array.isArray(hechos) ? hechos : []), a.recurso].slice(-200)));
  } catch { /* sin sessionStorage: se manda igual, el backend ya no cuenta doble */ }

  axios
    .post(`${API_URL}/actividad`, a, { headers: { Authorization: `Bearer ${token}` } })
    .catch(() => { /* que no se entere nadie */ });
}

/** Mira la ruta y apunta los recursos gratuitos. Va una sola vez en App. */
export function RegistroActividad() {
  const { pathname } = useLocation();
  useEffect(() => {
    const a = clasificarRuta(pathname);
    if (a) registrarActividad(a);
  }, [pathname]);
  return null;
}
