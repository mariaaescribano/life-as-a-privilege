import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../GlobalVariables";

/* ────────────────────────────────────────────────────────────────────────
 * useAstrologiaProgreso — calcula qué pasos del recorrido de ASTROLOGÍA están
 * desbloqueados, con EXACTAMENTE las mismas condiciones que usa cada página para
 * permitir (o rebotar) el acceso. Sirve para que el «Índice» muestre con candado
 * —y no deje entrar a— las páginas que aún no están disponibles.
 *
 * Cadena de desbloqueo (acumulativa), según los guardas de las páginas:
 *   1 Astrología          → siempre
 *   2 Lo primero de tu carta → hay solicitud enviada (solicitud_enviada_at)
 *   3 Arquetipos          → hay solicitud enviada
 *   4 Puntos clave        → la carta está procesada (link_carta O hay retos)
 *   5 Casas               → 4 + todos los puntos clave leídos (retosLeidos)
 *   6 Aspectos            → 5 + todas las casas escritas leídas (casasLeidos)
 *   7 Tu carta en PDF     → 6 (misma puerta que Aspectos: ya lo ha leído todo)
 *   8 Llamada             → 6 (una vez accesible Aspectos, no hay más guardas)
 *   9 Cursos              → 6
 *
 * Los "leídos" y los textos escritos salen del mismo row de la BD
 * (metodo_astrologia): data.retosLeidos / data.casasLeidos y casas_texto.
 * ──────────────────────────────────────────────────────────────────────── */
interface Row {
  solicitud_enviada_at?: string | null;
  link_carta?: string | null;
  retos?: { id: string }[];
  casas_texto?: Record<string, string> | null;
  data?: { retosLeidos?: string[]; casasLeidos?: string[] } | null;
}

export function useAstrologiaProgreso() {
  const [row, setRow] = useState<Row | null>(null);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    let cancel = false;
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { setCargado(true); return; }
    axios
      .get<Row | null>(`${API_URL}/metodo-astrologia/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => { if (!cancel) setRow(res.data ?? null); })
      .catch(() => { if (!cancel) setRow(null); })
      .finally(() => { if (!cancel) setCargado(true); });
    return () => { cancel = true; };
  }, []);

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
  const desbloqueado: Record<number, boolean> = {
    1: true,
    2: solicitud,
    3: solicitud,
    4: cartaProcesada,
    5: cartaProcesada && retosCompletos,
    6: hastaAspectos,
    7: hastaAspectos,
    8: hastaAspectos,
    9: hastaAspectos,
  };

  // Mientras no ha cargado el progreso NO bloqueamos (permisivo), para no marcar
  // por error como bloqueada una página que sí es accesible durante ese instante.
  const bloqueada = (n: number): boolean => cargado && !(desbloqueado[n] ?? true);

  return { bloqueada, cargado };
}
