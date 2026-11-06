// El PDF de «Crea tus apuntes» de ASTROLOGÍA: la portada del cielo, el cielo de fondo en todas las
// páginas y letra Garamond blanca (los títulos, del color de su planeta, signo o aspecto).
// Pesa (jsPDF + la tipografía embebida): la página lo carga con import() al pulsar.
import { Taller } from "./atelier";
import { cargarFotos } from "./fotos";
import { TEMA_ASTROLOGIA_APUNTES, type RGB } from "./temas";
import { portadaAstrologia } from "./portadaAstro";
import { itemsDe, type SeccionApunte } from "./apuntesAstroTipos";

export interface OpcionesApuntesAstro {
  /** Las `key` marcadas. */
  seleccion: string[];
  conFotos: boolean;
  onProgress?: (fase: "fotos" | "papel", hechas: number, total: number) => void;
  seguir?: () => boolean;
}

const aRgb = (hex?: string): RGB | undefined => {
  const m = (hex ?? "").match(/^#([0-9a-f]{6})/i);
  if (!m) return undefined;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

export async function generarApuntesAstro(
  secciones: SeccionApunte[],
  o: OpcionesApuntesAstro,
): Promise<{ blob: Blob; nombre: string } | null> {
  const elegidos = itemsDe(secciones).filter((x) => o.seleccion.includes(x.item.key));
  if (elegidos.length === 0) return null;

  const fotos = await cargarFotos(
    o.conFotos ? elegidos.map((x) => x.item.foto ?? "") : [],
    { onProgress: (h, t) => o.onProgress?.("fotos", h, t), seguir: o.seguir },
  );
  if (o.seguir && !o.seguir()) return null;

  const titulo = "Mis apuntes de Astrología";
  const taller = await Taller.abrir(TEMA_ASTROLOGIA_APUNTES, { titulo, fondo: "/img/astrologia/space.webp" });
  taller.portadaImagen(await portadaAstrologia());

  // Hoja de índice: lo que se lleva, por cajas.
  taller.nuevaPagina();
  taller.antetitulo("Lo que te llevas");
  for (const s of secciones) {
    const dentro = elegidos.filter((x) => x.seccion.key === s.key);
    if (dentro.length === 0) continue;
    taller.parrafo(s.titulo, { tam: 12.5 });
    taller.lista(dentro.map((x) => `${x.item.titulo} · ${x.grupo.titulo}`), { tam: 10.2 });
    taller.espacio(3);
  }

  for (let i = 0; i < elegidos.length; i++) {
    if (o.seguir && !o.seguir()) return null;
    const { item, grupo } = elegidos[i];
    const bloques = await item.bloques();
    const pintar = () => {
      taller.capitulo(item.titulo, undefined, aRgb(item.color));
      bloques.forEach((b, bi) => {
        const f = bi === 0 && o.conFotos && item.foto ? fotos.get(item.foto) : undefined;
        taller.vineta(f, b.parrafos, b.sub ? { titulo: b.sub } : undefined);
      });
    };
    // Si lo siguiente es corto y cabe en lo que queda de la hoja, va a continuación, tras una raya fina;
    // si no cabe entero, empieza hoja nueva (nunca se parte un apunte por la mitad entre dos hojas).
    if (i > 0 && taller.cabe(() => { taller.separador(); pintar(); })) {
      taller.separador();
    } else {
      // Arriba a la derecha de la hoja: «Astrología · Aspectos», «Astrología · Casas»…
      taller.cabecera(`Astrología · ${grupo.titulo}`);
      taller.nuevaPagina();
    }
    pintar();
    o.onProgress?.("papel", i + 1, elegidos.length);
  }

  return { blob: taller.blob(), nombre: `mis-apuntes-astrologia-${new Date().toISOString().slice(0, 10)}.pdf` };
}
