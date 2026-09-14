// ─────────────────────────────────────────────────────────────────────────
// Portada (y emoji de reserva) de cada Historia de Cultura.
//
// Lo comparten el hub del recorrido (MetodoCulturaHistorias) y la presentación
// pública (/d/cultura): si añades la portada que falta, aparece en los dos
// sitios a la vez.
//
// ✍️  Las fotos viven en /public/recorrido/cultura/portadas/<archivo>.png (los
//     nombres NO coinciden con la clave, por eso están escritos aquí). Las
//     Historias sin portada muestran su emoji hasta que la subas.
// ─────────────────────────────────────────────────────────────────────────

const P = "/recorrido/cultura/portadas";

export interface HistoriaVisual {
  portada?: string;
  emoji: string;
}

export const CULTURA_HISTORIA_VISUAL: Record<string, HistoriaVisual> = {
  universal:  { portada: `${P}/historiauniversal.webp`, emoji: "🌍" },
  religiones: { portada: `${P}/historiareligion.webp`,  emoji: "🕊️" },
  filosofia:  { portada: `${P}/historiafilosofia.webp`, emoji: "🏛️" },
  ciencia:    { portada: `${P}/historiaciencia.webp`,   emoji: "🔬" },
  medicina:   { portada: `${P}/historiamedicina.webp`,  emoji: "⚕️" },
  arte:       { portada: `${P}/historiaarte.webp`,      emoji: "🎭" },
};

export const historiaVisual = (key: string): HistoriaVisual =>
  CULTURA_HISTORIA_VISUAL[key] ?? { emoji: "📜" };
