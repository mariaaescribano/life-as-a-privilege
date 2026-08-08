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

/**
 * Barra de scroll de cualquier caja de acuarela (popups y paneles de
 * psicología): el CARRIL va TRANSPARENTE para que se siga viendo la foto de
 * fondo de punta a punta. Si solo se estilizan `::-webkit-scrollbar` y `-thumb`
 * (o se pone `scrollbar-width` sin `scrollbar-color`), el navegador pinta su
 * propio carril —negro en tema oscuro— y aparece una franja fea pegada al borde.
 * `color-scheme: light` evita además sus flechas oscuras.
 */
export const scrollAcuarela = (tinta: string) => ({
  scrollbarWidth: "thin" as const,
  scrollbarColor: `${tinta}55 transparent`,
  colorScheme: "light",
  // width + height: vale igual para la barra vertical y para la horizontal.
  "&::-webkit-scrollbar": { width: "8px", height: "8px", background: "transparent" },
  "&::-webkit-scrollbar-track": { background: "transparent" },
  "&::-webkit-scrollbar-corner": { background: "transparent" },
  "&::-webkit-scrollbar-thumb": { background: `${tinta}55`, borderRadius: "9999px" },
  "&::-webkit-scrollbar-thumb:hover": { background: `${tinta}88` },
});
