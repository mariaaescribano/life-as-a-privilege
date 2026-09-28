/* ────────────────────────────────────────────────────────────────────────
 * astrologiaDesbloqueo — la cadena de desbloqueo del recorrido de ASTROLOGÍA,
 * como función PURA: entra la fila de metodo_astrologia y sale qué pasos están
 * abiertos. La usa useAstrologiaProgreso (el Índice) y la fijan los tests del
 * backend (metodoAstrologia.spec.ts), porque es el contrato del recorrido:
 *
 *   1 Astrología          → siempre
 *   2 Arquetipos          → hay solicitud enviada (solicitud_enviada_at)
 *   3 Puntos clave        → la carta está LEÍDA por María (link_carta O retos);
 *                           hasta entonces no se puede seguir del paso 2
 *   4 Casas               → 3 + todos los puntos clave leídos (retosLeidos)
 *   5 Aspectos            → 4 + todas las casas escritas leídas (casasLeidos)
 *   6 Tu carta en PDF     → 5 (misma puerta: ya lo ha leído todo)
 *   7 Llamada             → 5
 *   8 Cursos              → 5
 * ──────────────────────────────────────────────────────────────────────── */

export interface AstrologiaRow {
  solicitud_enviada_at?: string | null;
  link_carta?: string | null;
  retos?: { id: string }[];
  casas_texto?: Record<string, string> | null;
  data?: { retosLeidos?: string[]; casasLeidos?: string[] } | null;
}

/** Qué pasos (1-8) están desbloqueados con este estado de la BD. */
export function desbloqueoAstrologia(row: AstrologiaRow | null): Record<number, boolean> {
  const solicitud = !!row?.solicitud_enviada_at;
  const retos = Array.isArray(row?.retos) ? row!.retos! : [];
  const cartaProcesada = !!row?.link_carta || retos.length > 0;
  const retosLeidos = new Set(row?.data?.retosLeidos ?? []);
  const casasLeidos = new Set(row?.data?.casasLeidos ?? []);
  const retosCompletos = retos.length === 0 || retos.every((r) => retosLeidos.has(r.id));
  const casasTexto = row?.casas_texto ?? {};
  const casasEscritas = Array.from({ length: 12 }, (_, i) => String(i + 1))
    .filter((n) => (casasTexto[n] ?? "").trim().length > 0);
  const casasCompletas = casasEscritas.length === 0 || casasEscritas.every((n) => casasLeidos.has(n));

  const hastaAspectos = cartaProcesada && retosCompletos && casasCompletas;
  return {
    1: true,
    2: solicitud,
    3: cartaProcesada,
    4: cartaProcesada && retosCompletos,
    5: hastaAspectos,
    6: hastaAspectos,
    7: hastaAspectos,
    8: hastaAspectos,
  };
}
