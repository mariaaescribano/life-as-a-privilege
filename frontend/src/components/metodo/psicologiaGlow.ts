// ─────────────────────────────────────────────────────────────────────────
// Glow azul clásico común al recorrido de psicología.
//
// En todo el recorrido los boxes llevan un GLOW azul (no una sombra oscura).
// Importa estos presets y úsalos en `boxShadow`. Mantén la coherencia: paneles
// grandes → glowPanel; cabeceras → glowHeader; botones → glowBtn / glowBtnHover.
// ─────────────────────────────────────────────────────────────────────────

export const AZUL = "#2f6fe0";

/** Panel/box de contenido. */
export const glowPanel = `0 0 24px ${AZUL}55, 0 0 60px ${AZUL}2a`;
/** Panel más sutil (estados vacíos, secundarios). */
export const glowPanelSoft = `0 0 22px ${AZUL}3a, 0 0 55px ${AZUL}1f`;
/** Cabecera (MetodoStepHeader → prop boxShadow). */
export const glowHeader = `0 0 22px ${AZUL}77, 0 0 55px ${AZUL}44, 0 0 90px ${AZUL}26, 0 0 18px rgba(255,255,255,0.22)`;
/** Botón principal. */
export const glowBtn = `0 0 16px ${AZUL}66, 0 0 40px ${AZUL}33`;
/** Botón principal en hover. */
export const glowBtnHover = `0 0 24px ${AZUL}88, 0 0 56px ${AZUL}44`;
/** Borde fino azul para enmarcar el glow de un panel. */
export const azulBorde = `1px solid ${AZUL}44`;
