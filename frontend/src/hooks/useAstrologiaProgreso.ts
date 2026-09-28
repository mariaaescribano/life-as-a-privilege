import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { flushSaves } from "../utils/flushSaves";
import { API_URL } from "../GlobalVariables";
import { desbloqueoAstrologia, type AstrologiaRow as Row } from "./astrologiaDesbloqueo";

/* ────────────────────────────────────────────────────────────────────────
 * useAstrologiaProgreso — calcula qué pasos del recorrido de ASTROLOGÍA están
 * desbloqueados, con EXACTAMENTE las mismas condiciones que usa cada página para
 * permitir (o rebotar) el acceso. Sirve para que el «Índice» muestre con candado
 * —y no deje entrar a— las páginas que aún no están disponibles.
 *
 * La cadena de desbloqueo vive en astrologiaDesbloqueo.ts (función pura,
 * fijada por los tests del backend); aquí solo se lee la fila de la BD.
 * Los "leídos" y los textos escritos salen del mismo row de metodo_astrologia:
 * data.retosLeidos / data.casasLeidos y casas_texto.
 * ──────────────────────────────────────────────────────────────────────── */

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

  const desbloqueado = desbloqueoAstrologia(row);

  // Mientras no ha cargado el progreso NO bloqueamos (permisivo), para no marcar
  // por error como bloqueada una página que sí es accesible durante ese instante.
  const bloqueada = (n: number): boolean => cargado && !(desbloqueado[n] ?? true);

  return { bloqueada, cargado, recargar };
}
