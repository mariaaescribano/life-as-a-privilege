// ─────────────────────────────────────────────────────────────────────────
// «CREA TUS PROPIOS APUNTES» — el cuaderno que cada persona se monta.
//
// Al final de cada disciplina, la persona marca lo que quiere llevarse (su
// diagnóstico, los consejos, las prácticas, las ilustraciones) y se descarga UN
// PDF con eso y nada más. No hay un documento por disciplina escrito a mano:
// hay una LISTA DE CAPÍTULOS por disciplina (los tipos están en apuntesTipos.ts)
// y este generador, que es el mismo para las ocho.
//
// Por eso un capítulo no es un texto: es una función que pinta con los bloques
// del taller (`capitulo`, `parrafo`, `lista`, `vineta`, `filaBarra`, `lamina`…).
// Añadir contenido nuevo es escribir datos, no un PDF.
//
// Lo que este archivo decide por todos:
//  · La portada, con la acuarela que la persona haya elegido.
//  · Una hoja de índice con lo que ha metido dentro (y la fecha).
//  · Que cada capítulo empieza en página nueva.
//  · Que las fotos se cargan UNA VEZ para todo el documento, con progreso.
//
// OJO al importarlo: este módulo arrastra jsPDF y la tipografía embebida. La
// pantalla lo carga con `await import(...)` al pulsar, no al entrar.
// ─────────────────────────────────────────────────────────────────────────
import { Taller } from "./atelier";
import { cargarFotos } from "./fotos";
import { capitulosElegidos, type ApuntesLibro } from "./apuntesTipos";

export type {
  ApuntesCapitulo, ApuntesLibro, ApuntesPortada,
} from "./apuntesTipos";
export { capitulosElegidos, fotosDeSeleccion } from "./apuntesTipos";

export interface ApuntesOpciones {
  /** Las `key` de los capítulos marcados. */
  seleccion: string[];
  /** La `key` de la portada elegida (si no, la primera). */
  portada?: string;
  /** Nombre de la persona, para la portada. */
  nombre?: string;
  /** false = apuntes solo de texto, sin ilustraciones (y sin peso). */
  conFotos: boolean;
  /** Progreso: `fase` es «fotos» mientras descarga y «papel» mientras compone. */
  onProgress?: (fase: "fotos" | "papel", hechas: number, total: number) => void;
  /** Devuelve false para abortar (la persona se ha ido de la página). */
  seguir?: () => boolean;
}

/**
 * Monta el PDF y lo devuelve como blob (para previsualizarlo o descargarlo).
 * Devuelve null si no hay ni un capítulo marcado o si se ha abortado.
 */
export async function generarApuntes(
  libro: ApuntesLibro,
  o: ApuntesOpciones,
): Promise<{ blob: Blob; nombre: string } | null> {
  const capitulos = capitulosElegidos(libro, o.seleccion);
  if (capitulos.length === 0) return null;

  // 1) Las fotos, de una en una, con la barra moviéndose.
  const srcs = o.conFotos ? Array.from(new Set(capitulos.flatMap((c) => c.fotos))) : [];
  const fotos = await cargarFotos(srcs, {
    onProgress: (hechas, total) => o.onProgress?.("fotos", hechas, total),
    seguir: o.seguir,
  });
  if (o.seguir && !o.seguir()) return null;

  // 2) El papel. La acuarela de la portada es la que ha elegido.
  const portada = libro.portadas.find((p) => p.key === o.portada) ?? libro.portadas[0];
  const taller = await Taller.abrir(libro.tema, {
    titulo: libro.titulo,
    acuarela: portada?.src,
  });

  taller.portada({
    titulo: libro.titulo,
    subtitulo: libro.subtitulo,
    nombre: o.nombre,
    pieLamina: libro.pieLamina,
  });

  // 3) La hoja de índice: lo que ha decidido llevarse, en su orden.
  taller.nuevaPagina();
  taller.antetitulo("Lo que te llevas");
  taller.parrafo(
    `${capitulos.length === 1 ? "Un capítulo" : `${capitulos.length} capítulos`}, ` +
    "los que has elegido. Estos apuntes son tuyos: puedes volver a la página y montarlos " +
    "otra vez con otro contenido cuando quieras.",
    { cursiva: true, tam: 10.5 },
  );
  taller.lista(capitulos.map((c) => `${c.titulo} · ${c.resumen}`), { tam: 10.4 });
  if (!o.conFotos) {
    taller.parrafo(
      "Has pedido los apuntes sin ilustraciones: solo el texto, ligero para leer en el móvil o imprimir en blanco y negro.",
      { cursiva: true, tam: 9.6 },
    );
  }

  // 4) Cada capítulo, en página nueva.
  for (let i = 0; i < capitulos.length; i++) {
    if (o.seguir && !o.seguir()) return null;
    taller.nuevaPagina();
    capitulos[i].pintar(taller, fotos, o.conFotos);
    o.onProgress?.("papel", i + 1, capitulos.length);
  }

  const sufijo = new Date().toISOString().slice(0, 10);
  return { blob: taller.blob(), nombre: `${libro.archivo}-${sufijo}.pdf` };
}
