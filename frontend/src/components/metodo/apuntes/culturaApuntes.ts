// ─────────────────────────────────────────────────────────────────────────
// «CREA TUS PROPIOS APUNTES» · CULTURA
//
// Cultura no cabe en un cuaderno. Sus seis Historias juntan más de cuatrocientos
// momentos: un solo PDF con todo sería un libro de mil páginas que nadie va a
// leer ni a imprimir, y una lista de casillas imposible de recorrer.
//
// Así que aquí hay UN LIBRO POR HISTORIA (`libroApuntesCultura(historiaKey)`), y
// dentro de cada uno, un capítulo por ETAPA —los círculos de su línea del
// tiempo—. Con eso se puede elegir tan fino como se quiera («solo la Edad Media
// y la Edad Moderna») sin salirse nunca de una Historia.
//
// No hay texto nuevo en este archivo: cada capítulo pinta las viñetas que YA
// existen en `culturaHistoria*.ts`, las mismas que se leen en la web. Corregir
// una frase allí la corrige también en el papel, incluidas las páginas
// «Profundiza», que vienen dentro del mismo `vinetas` de cada momento.
// ─────────────────────────────────────────────────────────────────────────
import type { ApuntesCapitulo, ApuntesLibro } from "../../../utils/pdf/apuntesTipos";
import type { Taller } from "../../../utils/pdf/atelier";
import type { FotoCache } from "../../../utils/pdf/fotos";
import { TEMA_CULTURA } from "../../../utils/pdf/temas";
import { getHistoria } from "../culturaHistorias";
import { historiaVisual } from "../culturaPortadas";
import type { HitoHistoria } from "../culturaHistoriaUniversal";

/**
 * Las Historias que se pueden llevar en apuntes, en el mismo orden y con los
 * mismos títulos que la pantalla de Historias del recorrido.
 *
 * Es la MISMA lista que se ve en /metodo/cultura/historias a propósito: las tres
 * que faltan (ciencia, medicina y arte) ya tienen texto escrito, pero mientras
 * no se puedan leer en la web tampoco se pueden descargar. Cuando se publiquen,
 * se añaden aquí y aparecen solas en el taller.
 */
export const HISTORIAS_CON_APUNTES = ["universal", "religiones", "filosofia"] as const;

export type HistoriaApuntesKey = (typeof HISTORIAS_CON_APUNTES)[number];

export const esHistoriaConApuntes = (key: string | undefined): key is HistoriaApuntesKey =>
  !!key && (HISTORIAS_CON_APUNTES as readonly string[]).includes(key);

/** Lo que el título de la portada dice de cada Historia («Mis apuntes de…»). */
const DE_LA_HISTORIA: Record<HistoriaApuntesKey, string> = {
  universal: "Historia Universal",
  religiones: "Historia de las religiones",
  filosofia: "Historia de la filosofía",
};

/** Base del nombre del archivo que se descarga. */
const ARCHIVO: Record<HistoriaApuntesKey, string> = {
  universal: "mis-apuntes-historia-universal",
  religiones: "mis-apuntes-historia-religiones",
  filosofia: "mis-apuntes-historia-filosofia",
};

/** Cuántos momentos tiene una etapa: es lo que se pinta en su casilla. */
export const momentosDeEtapa = (era: HitoHistoria): number =>
  era.subhitos.filter((s) => s.vinetas.length > 0).length;

/** Todas las ilustraciones de una etapa, sin repetir (las «Profundiza» reusan la
 *  foto de su momento, así que sin esto se contarían dos y tres veces). */
const fotosDeEtapa = (era: HitoHistoria): string[] => {
  const srcs = era.subhitos.flatMap((s) => s.vinetas.map((v) => v.src));
  return Array.from(new Set(srcs.filter(Boolean)));
};

/** Un capítulo = una etapa de la línea del tiempo, con todos sus momentos. */
function capituloDeEtapa(era: HitoHistoria, primeras: boolean): ApuntesCapitulo {
  const momentos = momentosDeEtapa(era);
  return {
    key: era.key,
    titulo: era.titulo,
    // La época de la etapa (la que se lee bajo su círculo) más lo que trae
    // dentro: con eso se decide si marcarla sin tener que abrirla.
    resumen: `${era.anio} · ${momentos} ${momentos === 1 ? "momento" : "momentos"}`,
    // Las primeras etapas salen marcadas: quien entra y pulsa «Descargar» sin
    // tocar nada se lleva algo con sentido, no un cuaderno vacío.
    pordefecto: primeras,
    fotos: fotosDeEtapa(era),
    pintar: (t: Taller, fotos: FotoCache, conFotos: boolean) => {
      t.capitulo(era.titulo, era.anio);
      era.subhitos.forEach((sub, i) => {
        if (!sub.vinetas.length) return;
        sub.vinetas.forEach((v) => {
          t.vineta(conFotos ? fotos.get(v.src) : undefined, v.paragraphs, {
            titulo: v.titulo,
            eyebrow: v.eyebrow,
          });
        });
        // Aire entre momentos, no después del último.
        if (i < era.subhitos.length - 1) t.divisor();
      });
    },
  };
}

/**
 * El cuaderno de UNA Historia: sus etapas como capítulos marcables.
 * Devuelve null si la clave no es una de las Historias publicadas o si esa
 * Historia todavía no tiene ni un momento escrito.
 */
export function libroApuntesCultura(historiaKey: string | undefined): ApuntesLibro | null {
  if (!esHistoriaConApuntes(historiaKey)) return null;
  const historia = getHistoria(historiaKey);
  if (!historia) return null;

  // Una etapa sin momentos escritos no se ofrece: sería una casilla que produce
  // un capítulo en blanco.
  const etapas = historia.hitos.filter((era) => momentosDeEtapa(era) > 0);
  if (!etapas.length) return null;

  const visual = historiaVisual(historiaKey);
  const nombre = DE_LA_HISTORIA[historiaKey];

  return {
    disciplina: "Cultura",
    tema: TEMA_CULTURA,
    titulo: `Mis apuntes de ${nombre}`,
    subtitulo: "Cultura · El Mapa",
    pieLamina: "De todo lo que has recorrido, esto es lo que has querido guardar.",
    archivo: ARCHIVO[historiaKey],
    // La portada de la Historia y la acuarela de la disciplina. Las portadas de
    // las etapas no entran: son seis o trece y convertirían el elegir la portada
    // en otra lista larga.
    portadas: [
      ...(visual.portada ? [{ key: "historia", label: nombre, src: visual.portada }] : []),
      { key: "acuarela", label: "La acuarela", src: "/img/fondos/cultura.webp" },
      { key: "acuarela2", label: "La otra acuarela", src: "/img/fondos/cultura2.webp" },
      ...etapas
        .filter((era) => !!era.foto)
        .slice(0, 3)
        .map((era) => ({ key: `era-${era.key}`, label: era.titulo, src: era.foto! })),
    ],
    capitulos: etapas.map((era, i) => capituloDeEtapa(era, i < 2)),
  };
}

/** Para la pantalla que elige Historia: título, portada y cuánto trae dentro. */
export function historiasParaElegir() {
  return HISTORIAS_CON_APUNTES.map((key) => {
    const historia = getHistoria(key);
    const etapas = (historia?.hitos ?? []).filter((era) => momentosDeEtapa(era) > 0);
    return {
      key,
      titulo: DE_LA_HISTORIA[key],
      ...historiaVisual(key),
      etapas: etapas.length,
      momentos: etapas.reduce((n, era) => n + momentosDeEtapa(era), 0),
    };
  }).filter((h) => h.etapas > 0);
}
