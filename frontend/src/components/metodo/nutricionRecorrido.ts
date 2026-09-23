// ─────────────────────────────────────────────────────────────────────────
// EL RECORRIDO · NUTRICIÓN
//
// Fuente única del orden de las páginas y de los REQUISITOS de cada paso, igual
// que psicologiaRecorrido / tcmRecorrido. Alimenta el botón «Índice»
// (IndiceNutricion) y su bloqueo secuencial.
//
// ⚠️ Si cambias el gate del botón «siguiente» de una página (o el guarda que la
//    hace rebotar), cámbialo también aquí para que el Índice siga coincidiendo
//    con lo que se puede hacer.
// ─────────────────────────────────────────────────────────────────────────
import { traducir, type ClaveTexto } from "../../i18n";
import { NUTRIENTES_MACRO, NUTRIENTES_MICRO } from "../../hardCoded/espacio/NutrientesNutricion";
import type { PasoRecorrido } from "./psicologiaRecorrido";

// Todas las páginas del recorrido, en orden. El nombre de cada paso NO se
// escribe aquí: se cita por su clave, la misma que usan los botones «← anterior
// / siguiente →» de cada página. Así el Índice y los botones nunca pueden decir
// cosas distintas.
const PASOS: { clave: ClaveTexto; path: string }[] = [
  { clave: "metodo.nutri.paso.nutricion",          path: "/metodo/nutricion" },
  { clave: "metodo.nutri.paso.macro",              path: "/metodo/nutricion/macronutrientes" },
  { clave: "metodo.nutri.paso.micro",              path: "/metodo/nutricion/micronutrientes" },
  { clave: "metodo.nutri.paso.microbiotaTitulo",   path: "/metodo/nutricion/microbiota" },
  { clave: "metodo.nutri.paso.hambre",             path: "/metodo/nutricion/hambre" },
  { clave: "metodo.nutri.paso.ultraCorto",         path: "/metodo/nutricion/ultraprocesados" },
  { clave: "metodo.nutri.paso.plato",              path: "/metodo/nutricion/plato" },
  { clave: "metodo.nutri.paso.caloriasTitulo",     path: "/metodo/nutricion/calorias" },
  { clave: "metodo.nutri.paso.prediabetes",        path: "/metodo/nutricion/prediabetes" },
  { clave: "metodo.nutri.paso.dia",                path: "/metodo/nutricion/dia" },
  { clave: "metodo.nutri.paso.macros",             path: "/metodo/nutricion/macros" },
  { clave: "metodo.nutri.paso.mitos",              path: "/metodo/nutricion/mitos" },
  { clave: "metodo.nutri.paso.origen",             path: "/metodo/nutricion/origen" },
  { clave: "metodo.nutri.paso.cursosProfundizar",  path: "/metodo/nutricion/cursos" },
];

export const NUTRICION_TOTAL = PASOS.length;

/** El índice del recorrido, con los títulos ya en el idioma activo. Es una
 *  FUNCIÓN: un array de módulo se quedaría con los títulos congelados en el
 *  idioma de arranque (quien lo pinte debe llamar a `useIdioma()`). */
export const nutricionIndice = (): PasoRecorrido[] =>
  PASOS.map((p, i) => ({ n: i + 1, titulo: traducir(p.clave), ruta: () => p.path }));

// ─────────────────────────────────────────────────────────────────────────
// REQUISITOS · los mismos guardas que tienen las páginas (metodo_nutricion.data):
//   · Micronutrientes         → hasta revisar todos los macronutrientes.
//   · La microbiota           → hasta revisar todos los micronutrientes.
//   · Tus calorías            → hasta crear el plato de Harvard.
//   · ¿Cómo va tu azúcar?     → hasta tener el cálculo de calorías (de ahí saca
//                               edad, peso y altura, para no volver a pedirlos).
//   · Diseña tu día           → hereda las calorías del paso anterior.
// ─────────────────────────────────────────────────────────────────────────

/** Gate para avanzar MÁS ALLÁ del paso `n` (1-based): true = puedes pasar al
 *  siguiente. Los pasos sin requisito devuelven true. */
export function puedeAvanzarNutricion(data: any, n: number): boolean {
  const d = data || {};
  const explorados = (): string[] =>
    Array.isArray(d.nutrientes_explorados) ? d.nutrientes_explorados : [];
  switch (n) {
    // Los dos pasos de nutrientes: cada grupo se marca revisado al abrir su
    // ficha, y no se pasa de página hasta tenerlos todos.
    case 2: return NUTRIENTES_MACRO.every((x) => explorados().includes(x.key));
    case 3: return NUTRIENTES_MICRO.every((x) => explorados().includes(x.key));
    case 7: return !!d.plato_hecho;                            // El plato: montado
    case 8: return !!d.calorias?.hecho;                        // Tus calorías: calculadas
    default: return true;                                      // el resto: sin requisito
  }
}

/** Paso máximo ALCANZABLE (1-based): el prefijo contiguo de páginas a las que la
 *  usuaria ya puede llegar respetando el requisito de cada paso. */
export function pasoAlcanzableNutricion(data: any, _expId?: string): number {
  let n = 1;
  while (n < NUTRICION_TOTAL && puedeAvanzarNutricion(data, n)) n++;
  return n;
}
