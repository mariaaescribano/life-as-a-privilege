// ─────────────────────────────────────────────────────────────────────────────
// EL CAMINO · cuántos pasos tiene el recorrido de cada disciplina y por cuál va
// el usuario. Alimenta la columna «Tu camino» de /home.
//
// DÓNDE SE GUARDA — en la misma tabla del bloqueo secuencial
// (`recorrido_progreso`), pero con la disciplina prefijada: `camino-psicologia`,
// `camino-tcm`… Va aparte A PROPÓSITO: las filas sin prefijo deciden qué páginas
// están DESBLOQUEADAS, y apuntar ahí «por dónde vas» abriría pasos que el
// usuario no se ha ganado. Aquí solo se mide; allí se abre o se cierra.
//
// QUIÉN LO APUNTA — el Índice del recorrido (IndiceRecorrido), que está en todas
// las páginas y ya sabe en qué paso estás. Cultura no tiene índice y se apunta
// desde su propia página (ver `porPiezas`).
// ─────────────────────────────────────────────────────────────────────────────

/** Las ocho, con la misma clave que los `<key>_suscrito` del usuario. */
export const DISCIPLINAS_CAMINO = [
  'metodo', 'psicologia', 'ayurveda', 'tcm',
  'fisiologia', 'nutricion', 'cabala', 'cultura',
] as const;
export type CaminoKey = (typeof DISCIPLINAS_CAMINO)[number];

export interface CaminoDisciplina {
  /** Pasos que tiene el recorrido entero. */
  total: number;
  /** A dónde lleva pulsar su fila en el camino. */
  ruta: string;
  /**
   * true → lo andado NO es «he llegado al paso 7», sino «he abierto 3 piezas
   * sueltas». Es el caso de Cultura: sus Historias no llevan orden, así que el
   * paso máximo no diría nada; lo que cuenta es cuántas ha abierto. Cada pieza
   * se apunta en su propia fila (`camino-cultura-universal`, …).
   */
  porPiezas?: boolean;
}

/**
 * ⚠️ Si añades o quitas un paso en el índice de una disciplina, sube o baja su
 * `total` aquí. Los números salen de:
 *   · metodo (astrología) → ASTROLOGIA_TOTAL (astrologiaRecorrido.ts)
 *   · psicologia          → psicologiaIndice() (psicologiaRecorrido.ts)
 *   · ayurveda            → ayurvedaMapa() + ayurvedaDoshaIndice()
 *   · tcm                 → TCM_TOTAL (tcmRecorrido.ts)
 *   · fisiologia          → NIVELES de IndiceFisiologia (materia + vida)
 *   · nutricion           → PASOS de IndiceNutricion
 *   · cabala              → los PASOS de IndiceCabala (2 + 11 sefirot + 2 + 22 senderos + 3)
 *   · cultura             → las Historias de HISTORIAS_CULTURA
 *
 * Si se queda corto no pasa nada grave: el porcentaje se recorta al 100%, nunca
 * se pasa. Y en desarrollo el propio Índice avisa por consola al detectar un
 * paso mayor que el total declarado.
 */
export const CAMINO: Record<CaminoKey, CaminoDisciplina> = {
  metodo:     { total: 9,  ruta: "/metodo/astrologia" },
  psicologia: { total: 27, ruta: "/metodo/psicologia" },
  ayurveda:   { total: 15, ruta: "/metodo/ayurveda" },
  tcm:        { total: 12, ruta: "/metodo/tcm" },
  fisiologia: { total: 9,  ruta: "/metodo/fisiologia" },
  nutricion:  { total: 14, ruta: "/metodo/nutricion" },
  cabala:     { total: 40, ruta: "/metodo/cabala" },
  cultura:    { total: 6,  ruta: "/metodo/cultura", porPiezas: true },
};

/** La fila de `recorrido_progreso` donde se apunta el camino de una disciplina. */
export const claveCamino = (key: string, pieza?: string): string =>
  pieza ? `camino-${key}-${pieza}` : `camino-${key}`;

/**
 * Pasos andados de una disciplina, a partir del progreso completo que devuelve
 * GET /recorrido-progreso. Nunca pasa del total declarado.
 */
export function pasosAndados(progreso: Record<string, number>, key: CaminoKey): number {
  const def = CAMINO[key];
  if (!def) return 0;
  const prefijo = `${claveCamino(key)}-`;
  const bruto = def.porPiezas
    ? Object.keys(progreso).filter((k) => k.startsWith(prefijo)).length
    // Respaldo para quien ya venía andando antes de que existiera el camino: si
    // aún no tiene su fila `camino-…`, se mira la del bloqueo secuencial, que
    // para psicología, hinduismo y MTC lleva tiempo guardándose. Se queda corta
    // (hinduismo no cuenta ahí las páginas del mapa común), pero nunca de más, y
    // deja de usarse en cuanto visita una página y se apunta la suya.
    : Number(progreso[claveCamino(key)] ?? progreso[key] ?? 0);
  if (!Number.isFinite(bruto) || bruto <= 0) return 0;
  return Math.min(Math.floor(bruto), def.total);
}

/** Porcentaje andado (0-100, entero). */
export function porcentajeCamino(progreso: Record<string, number>, key: CaminoKey): number {
  const def = CAMINO[key];
  if (!def?.total) return 0;
  return Math.round((pasosAndados(progreso, key) / def.total) * 100);
}
