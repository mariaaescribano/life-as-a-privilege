import type { CabalaPageKey } from "./cabalaSefirot";
import { puntuacionDeficit, puntuacionExceso, puntuacionEquilibrio, testCompleto } from "./cabalaTest";

// ─────────────────────────────────────────────────────────────────────────
// DIAGNÓSTICO basado en el ÁRBOL DE LA VIDA
//
// Las sefirot son ESTADOS (competencias). Los senderos son TRANSICIONES. El
// crecimiento ocurre en las transiciones, no en las sefirot aisladas. Por eso
// el diagnóstico no se centra en puntuaciones individuales, sino en la relación
// entre una competencia y la siguiente: qué transición evolutiva está bloqueada.
// ─────────────────────────────────────────────────────────────────────────

export type Polaridad = "deficit" | "equilibrio" | "exceso";

/**
 * Nivel de desarrollo de una sefirá (0-10): cuánto está desarrollada/integrada
 * la competencia. La integración (P3) aporta hasta 6; la ausencia de déficit
 * (P1+P2 bajos) aporta hasta 4. El exceso se refleja aparte, en la polaridad.
 * Fórmula documentada y fácil de ajustar.
 */
export function nivelSefira(r: number[]): number {
  const deficit = puntuacionDeficit(r); // 2..10
  const eq = puntuacionEquilibrio(r);   // 1..5
  const val = (eq / 5) * 6 + ((10 - deficit) / 8) * 4;
  return Math.round(Math.max(0, Math.min(10, val)));
}

/** Polaridad dominante de la sefirá: hacia el déficit, el equilibrio o el exceso. */
export function polaridadSefira(r: number[]): Polaridad {
  const deficit = puntuacionDeficit(r);
  const exceso = puntuacionExceso(r);
  if (deficit > exceso + 1) return "deficit";
  if (exceso > deficit + 1) return "exceso";
  return "equilibrio";
}

export const POLARIDAD_LABEL: Record<Polaridad, string> = {
  deficit: "Poco desarrollada",
  equilibrio: "Integrada",
  exceso: "Sobreexpresada",
};

// ── Senderos evolutivos (secuencia de desarrollo del Árbol) ───────────────
// Kéter → Jojmá → Biná → Da'at → Jesed → Guevurá → Tiferet → Netzaj → Hod →
// Yesod → Malkut. La narrativa describe el aprendizaje de esa transición
// (redactada en 2ª persona; en bloqueo se muestra tal cual).
export interface Transicion {
  from: CabalaPageKey;
  to: CabalaPageKey;
  /** Relato del paso evolutivo / bloqueo de esta transición. */
  narrativa: string;
}

export const TRANSICIONES: Transicion[] = [
  {
    from: "kether", to: "chokmah",
    narrativa:
      "Tienes una fuerte necesidad de vivir con propósito. Sin embargo, cuando la realidad no coincide con tus ideales, te cuesta observar los hechos con objetividad. En ocasiones interpretas la realidad desde lo que deseas que ocurra, en lugar de verla tal como es. Tu aprendizaje consiste en permitir que la realidad refine tu propósito, en lugar de intentar que la realidad encaje siempre con él.",
  },
  {
    from: "chokmah", to: "binah",
    narrativa:
      "Percibes e intuyes con facilidad, pero te cuesta convertir esas intuiciones en una comprensión estable y duradera. Tu paso es dar forma y estructura a lo que captas, para que no se quede en una impresión pasajera.",
  },
  {
    from: "binah", to: "daat",
    narrativa:
      "Comprendes con facilidad tus patrones, tus emociones y tus aprendizajes. Sin embargo, cuando llega el momento de actuar, vuelves a respuestas automáticas que ya conoces. Tu siguiente paso no es aprender más, sino practicar de forma consciente aquello que ya sabes.",
  },
  {
    from: "daat", to: "chesed",
    narrativa:
      "Has ganado coherencia contigo mismo, pero esa integración todavía no se traduce en una forma generosa y libre de relacionarte con los demás. Tu paso es dejar que tu coherencia se abra hacia el otro.",
  },
  {
    from: "chesed", to: "geburah",
    narrativa:
      "Eres una persona generosa y con una fuerte disposición a cuidar de los demás. Sin embargo, esa capacidad no siempre está acompañada de límites claros. Con frecuencia das más de lo que puedes sostener o asumes responsabilidades que no te corresponden. Tu crecimiento pasa por descubrir que poner límites también es una forma de amar.",
  },
  {
    from: "geburah", to: "tipharet",
    narrativa:
      "Sabes poner límites, pero todavía no se integran con la compasión y el equilibrio. Tu paso es que la firmeza y la sensibilidad conviven sin anularse.",
  },
  {
    from: "tipharet", to: "netzach",
    narrativa:
      "Encuentras equilibrio interior, pero te cuesta sostenerlo cuando aparecen las dificultades. Tu paso es dar continuidad en el tiempo a esa armonía que ya sabes encontrar.",
  },
  {
    from: "netzach", to: "hod",
    narrativa:
      "Tienes perseverancia, pero te cuesta expresar lo aprendido y compartirlo con otros. Tu paso es transformar tu constancia en una voz que comunica lo que has vivido.",
  },
  {
    from: "hod", to: "yesod",
    narrativa:
      "Comprendes y comunicas bien, pero ese aprendizaje aún no se convierte en hábitos consistentes. Tu paso es aterrizar lo que sabes en prácticas cotidianas.",
  },
  {
    from: "yesod", to: "malkuth",
    narrativa:
      "Has construido hábitos saludables, pero todavía no consiguen transformar plenamente tu realidad. Tu paso es que tu vida diaria se convierta en la expresión visible de quien eres.",
  },
];

// ── Clasificación de una transición ───────────────────────────────────────
export type TransicionTipo =
  | "integrada"
  | "parcial"
  | "debil"
  | "bloqueo_importante"
  | "bloqueo_principal"
  | "sin_base"
  | "invertida"
  | "incompleta";

const UMBRAL_ALTO = 7;
const UMBRAL_BAJO = 4;

export interface TransicionResultado {
  from: CabalaPageKey;
  to: CabalaPageKey;
  narrativa: string;
  origen: number;   // 0-10 (o -1 si incompleta)
  destino: number;  // 0-10 (o -1 si incompleta)
  diff: number;     // origen - destino
  tipo: TransicionTipo;
  /** Prioridad para ordenar los cuellos de botella (mayor = más urgente). 0 = fluida. */
  gravedad: number;
  completa: boolean;
}

export function clasificarTransicion(origen: number, destino: number): { tipo: TransicionTipo; gravedad: number } {
  const diff = origen - destino;

  // Ambas bajas → todavía no hay base suficiente.
  if (origen < UMBRAL_BAJO && destino < UMBRAL_BAJO) {
    return { tipo: "sin_base", gravedad: 5 + (UMBRAL_BAJO - Math.min(origen, destino)) };
  }
  // Origen alto, destino bajo → bloqueo de transición (lo más importante).
  if (diff >= 2) {
    if (diff > 5) return { tipo: "bloqueo_principal", gravedad: diff };
    if (diff >= 4) return { tipo: "bloqueo_importante", gravedad: diff };
    return { tipo: "debil", gravedad: diff };
  }
  // Destino más desarrollado que el origen → capacidad sin base que la sostenga.
  if (diff <= -2) {
    return { tipo: "invertida", gravedad: Math.abs(diff) * 0.6 };
  }
  // Diferencia pequeña.
  if (origen >= UMBRAL_ALTO && destino >= UMBRAL_ALTO) {
    return { tipo: "integrada", gravedad: 0 };
  }
  return { tipo: "parcial", gravedad: 0 };
}

export const TIPO_LABEL: Record<TransicionTipo, string> = {
  integrada: "Transición integrada",
  parcial: "Transición parcial",
  debil: "Transición débil",
  bloqueo_importante: "Bloqueo importante",
  bloqueo_principal: "Bloqueo principal",
  sin_base: "Falta base",
  invertida: "Desarrollo sin base",
  incompleta: "Pendiente",
};

/** ¿Este tipo representa una dificultad a trabajar? */
export function esBloqueo(tipo: TransicionTipo): boolean {
  return tipo === "debil" || tipo === "bloqueo_importante" || tipo === "bloqueo_principal" || tipo === "sin_base" || tipo === "invertida";
}

/**
 * Calcula todas las transiciones a partir del mapa de respuestas del test.
 * Una transición solo se evalúa si AMBAS sefirot tienen el test completo.
 */
export function calcularTransiciones(test: Record<string, number[]>): TransicionResultado[] {
  return TRANSICIONES.map((t) => {
    const rFrom = test[t.from];
    const rTo = test[t.to];
    const completa = testCompleto(rFrom) && testCompleto(rTo);
    if (!completa) {
      return { ...t, origen: -1, destino: -1, diff: 0, tipo: "incompleta", gravedad: -1, completa: false };
    }
    const origen = nivelSefira(rFrom);
    const destino = nivelSefira(rTo);
    const { tipo, gravedad } = clasificarTransicion(origen, destino);
    return { ...t, origen, destino, diff: origen - destino, tipo, gravedad, completa: true };
  });
}
