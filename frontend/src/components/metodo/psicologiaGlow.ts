// ─────────────────────────────────────────────────────────────────────────
// Glow ligero común al recorrido de psicología.
//
// Glow suave (sobre todo blanco) con un punto de azul como tinte, igual que en
// el resto del programa. Importa estos presets y úsalos en `boxShadow`. Mantén
// la coherencia: paneles grandes → glowPanel; cabeceras → glowHeader; botones →
// glowBtn / glowBtnHover.
// ─────────────────────────────────────────────────────────────────────────

export const AZUL = "#2f6fe0";

/** Panel/box de contenido. */
export const glowPanel = `0 0 18px rgba(255,255,255,0.1), 0 0 34px ${AZUL}1a`;
/** Panel más sutil (estados vacíos, secundarios). */
export const glowPanelSoft = `0 0 16px rgba(255,255,255,0.08), 0 0 28px ${AZUL}14`;
/** Cabecera (MetodoStepHeader → prop boxShadow). */
export const glowHeader = `0 0 18px rgba(255,255,255,0.18), 0 0 34px ${AZUL}22`;
/** Botón principal. */
export const glowBtn = `0 0 14px rgba(255,255,255,0.12), 0 0 24px ${AZUL}1a`;
/** Botón principal en hover. */
export const glowBtnHover = `0 0 20px rgba(255,255,255,0.18), 0 0 32px ${AZUL}26`;
/** Borde fino azul para enmarcar el glow de un panel. */
export const azulBorde = `1px solid ${AZUL}33`;
