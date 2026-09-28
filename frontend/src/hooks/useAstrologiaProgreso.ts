import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { flushSaves } from "../utils/flushSaves";
import { API_URL } from "../GlobalVariables";

/* ────────────────────────────────────────────────────────────────────────
 * useAstrologiaProgreso — calcula qué pasos del recorrido de ASTROLOGÍA están
 * desbloqueados, con EXACTAMENTE las mismas condiciones que usa cada página para
 * permitir (o rebotar) el acceso. Sirve para que el «Índice» muestre con candado
 * —y no deje entrar a— las páginas que aún no están disponibles.
 *
 * Cadena de desbloqueo (acumulativa), según los guardas de las páginas.
 * («Lo primero de tu carta» ya no es un paso: el trío Sol·Luna·Ascendente vive
 * dentro de la página 1, debajo del formulario de datos.)
 *   1 Astrología          → siempre
 *   2 Arquetipos          → hay solicitud enviada (solicitud_enviada_at)
 *   3 Puntos clave        → la carta está procesada (link_carta O hay retos)
 *   4 Casas               → 3 + todos los puntos clave leídos (retosLeidos)
 *   5 Aspectos            → 4 + todas las casas escritas leídas (casasLeidos)
 *   6 Tu carta en PDF     → 5 (misma puerta que Aspectos: ya lo ha leído todo)
 *   7 Llamada             → 5 (una vez accesible Aspectos, no hay más guardas)
 *   8 Cursos              → 5
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

  // Lee el progreso de la BD. Antes de leer espera a que terminen los guardados
  // en vuelo de la página actual (flushSaves): si no, leería el progreso de
  // ANTES de lo que la usuaria acaba de marcar y enseñaría un candado de más.
  const recargar = useCallback(async (): Promise<void> => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { setCargado(true); return; }
    await flushSaves();
    try {
      const res = await axios.get<Row | null>(`${API_URL}/metodo-astrologia/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRow(res.data ?? null);
    } catch {
      // Si falla, nos quedamos con lo que ya teníamos (mejor que re-bloquearlo todo).
    } finally {
      setCargado(true);
    }
  }, []);

  useEffect(() => { void recargar(); }, [recargar]);

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
    3: cartaProcesada,
    4: cartaProcesada && retosCompletos,
    5: hastaAspectos,
    6: hastaAspectos,
    7: hastaAspectos,
    8: hastaAspectos,
  };

  // Mientras no ha cargado el progreso NO bloqueamos (permisivo), para no marcar
  // por error como bloqueada una página que sí es accesible durante ese instante.
  const bloqueada = (n: number): boolean => cargado && !(desbloqueado[n] ?? true);

  return { bloqueada, cargado, recargar };
}
