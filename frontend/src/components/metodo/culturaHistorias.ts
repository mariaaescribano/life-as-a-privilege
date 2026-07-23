import type { HitoHistoria } from "./culturaHistoriaUniversal";
import { HISTORIA_UNIVERSAL_HITOS } from "./culturaHistoriaUniversal";
import { HISTORIA_RELIGIONES_HITOS } from "./culturaHistoriaReligiones";
import { HISTORIA_FILOSOFIA_HITOS } from "./culturaHistoriaFilosofia";
import { HISTORIA_MEDICINA_HITOS } from "./culturaHistoriaMedicina";

// Registro de las Historias de Cultura. La clave coincide con el segmento de la
// ruta /metodo/cultura/historia/<historiaKey>. Las páginas genéricas
// (MetodoCulturaHistoria y MetodoCulturaHistoriaEra) leen de aquí. Las Historias
// que aún no tienen datos (filosofía, ciencia, medicina, arte…) no aparecen: su
// tarjeta navega a una clave inexistente y la página rebota al listado.
export interface HistoriaDef {
  /** Título que se muestra en la cabecera de la Historia. */
  titulo: string;
  /** Texto introductorio propio de esta Historia (opcional). Si falta, la página
   *  muestra la línea genérica «Recorre la línea del tiempo…». */
  intro?: string;
  /** Eras (círculos de la línea del tiempo de esta Historia). */
  hitos: HitoHistoria[];
}

export const HISTORIAS_CULTURA: Record<string, HistoriaDef> = {
  universal: { titulo: "Historia Universal", hitos: HISTORIA_UNIVERSAL_HITOS },
  religiones: { titulo: "Historia de las religiones", hitos: HISTORIA_RELIGIONES_HITOS },
  filosofia: {
    titulo: "Historia de la filosofía",
    intro:
      "Durante miles de años, los seres humanos explicaron el mundo mediante relatos, dioses y mitos. Cada tormenta, cada eclipse o cada enfermedad parecía depender de fuerzas sobrenaturales. Sin embargo, hace unos dos mil quinientos años, algunas personas comenzaron a hacerse una pregunta revolucionaria: «¿Y si el universo pudiera comprenderse mediante la razón?». Aquella idea cambió la historia para siempre. La filosofía no nació para dar respuestas fáciles, sino para formular mejores preguntas. Desde entonces, generación tras generación, filósofos de todo el mundo han intentado comprender la realidad, la naturaleza, la justicia, la felicidad, el conocimiento y el propio ser humano. Esta es la historia de esa búsqueda.",
    hitos: HISTORIA_FILOSOFIA_HITOS,
  },
  medicina: {
    titulo: "Historia de la medicina",
    intro:
      "Durante más de veinte mil años, los seres humanos han buscado una misma cosa: sanar. Al principio con rituales y esperanza; después observando la naturaleza, buscando el equilibrio, midiendo el flujo de la vida, razonando sobre las causas y, por fin, mirando dentro del cuerpo con ciencia. Cada civilización aportó una lente distinta, y todas juntas cuentan la historia de cómo aprendimos no solo a curar enfermedades, sino a vivir de una forma que favorece la salud. Este recorrido no es solo historia: es un viaje para aprender a conocerte y a cuidarte mejor.",
    hitos: HISTORIA_MEDICINA_HITOS,
  },
};

export const getHistoria = (key: string | undefined): HistoriaDef | undefined =>
  key ? HISTORIAS_CULTURA[key] : undefined;
