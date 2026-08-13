import type { CabalaPageKey } from "./cabalaSefirot";
import type { Polaridad, TransicionTipo } from "./cabalaDiagnostico";

/**
 * El DIAGNÓSTICO del Árbol (Mapa Evolutivo y Diagnóstico final), en INGLÉS.
 *
 * Aquí va SOLO el texto: los umbrales, la fórmula del nivel y la clasificación
 * de cada transición viven únicamente en `cabalaDiagnostico.ts`. Así el mismo
 * test da el mismo bloqueo en los dos idiomas y solo cambia cómo se cuenta.
 *
 * Las narrativas van indexadas por la transición (`from>to`), no por posición:
 * si algún día se reordenan los pasos del Árbol, el relato sigue pegado a su
 * transición. Lo que falte se lee en español (ver `useNarrativa` en cabalaEn.ts).
 */
export const POLARIDAD_LABEL_EN: Record<Polaridad, string> = {
  deficit: "Underdeveloped",
  equilibrio: "Integrated",
  exceso: "Overexpressed",
};

export const TIPO_LABEL_EN: Record<TransicionTipo, string> = {
  integrada: "Integrated transition",
  parcial: "Partial transition",
  debil: "Weak transition",
  bloqueo_importante: "Significant block",
  bloqueo_principal: "Main block",
  sin_base: "No foundation yet",
  invertida: "Development without foundation",
  incompleta: "Pending",
};

/** Clave de una transición: `kether>chokmah`. */
export const claveTransicion = (from: CabalaPageKey, to: CabalaPageKey): string => `${from}>${to}`;

export const NARRATIVAS_EN: Record<string, string> = {
  "kether>chokmah":
    "You have a strong need to live with purpose. But when reality doesn't match your ideals, you find it hard to look at the facts objectively. Sometimes you read reality through what you wish would happen instead of seeing it as it is. Your learning is to let reality refine your purpose, rather than trying to make reality always fit it.",
  "chokmah>binah":
    "You perceive and sense things easily, but you find it hard to turn those intuitions into a stable, lasting understanding. Your step is to give shape and structure to what you catch, so it doesn't stay a passing impression.",
  "binah>daat":
    "You understand your patterns, your emotions and your learning easily. Yet when the moment to act arrives, you fall back on automatic responses you already know. Your next step isn't to learn more, but to practice consciously what you already know.",
  "daat>chesed":
    "You've gained coherence with yourself, but that integration doesn't yet translate into a generous, free way of relating to others. Your step is to let your coherence open toward the other person.",
  "chesed>geburah":
    "You're a generous person with a strong disposition to care for others. That capacity, though, isn't always paired with clear boundaries. You often give more than you can sustain, or take on responsibilities that aren't yours. Your growth runs through discovering that setting boundaries is also a way of loving.",
  "geburah>tipharet":
    "You know how to set boundaries, but they don't yet come together with compassion and balance. Your step is for firmness and sensitivity to live side by side without canceling each other out.",
  "tipharet>netzach":
    "You find inner balance, but you find it hard to hold it when difficulties arrive. Your step is to give continuity over time to the harmony you already know how to find.",
  "netzach>hod":
    "You have perseverance, but you find it hard to express what you've learned and share it with others. Your step is to turn your steadiness into a voice that tells what you've lived.",
  "hod>yesod":
    "You understand and communicate well, but that learning doesn't yet become consistent habits. Your step is to land what you know in everyday practices.",
  "yesod>malkuth":
    "You've built healthy habits, but they don't yet fully transform your reality. Your step is for your daily Life to become the visible expression of who you are.",
};
