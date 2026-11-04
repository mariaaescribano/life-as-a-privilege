import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../GlobalVariables";

/**
 * Hasta qué paso del Mapa puede entrar una persona en una disciplina (`pasoMax`).
 * Lo abre María; la persona no lo sube andando.
 *
 * Sin `userId` es la persona con la sesión abierta (solo lectura).
 * Con `userId` es María en el camino de esa persona (siempre con su propio token),
 * y entonces `fijar` guarda el nuevo techo (POST /recorrido-progreso/admin/:userId/:disciplina).
 *
 * `disciplina` es la clave de `<key>_suscrito` (astrología = `metodo`). Con `null`
 * o vacío no pide nada.
 */
export function usePasoMax(disciplina: string | null, userId?: string | null) {
  const [pasoMax, setPasoMax] = useState(1);
  const [cargado, setCargado] = useState(false);

  /** Vuelve a leer el techo (al abrir un índice, por si María lo ha movido). */
  const recargar = useCallback(async (): Promise<void> => {
    if (!disciplina) { setCargado(true); return; }
    if (!localStorage.getItem("token")) { setCargado(true); return; }
    const url = userId
      ? `${API_URL}/recorrido-progreso/admin/${userId}`
      : `${API_URL}/recorrido-progreso/${disciplina}`;
    try {
      const r = await axios.get(url);
      const v = userId ? Number(r.data?.[disciplina]) : Number(r.data?.pasoMax);
      setPasoMax(Math.max(1, v || 1));
    } catch { /* si falla, queda como estaba (1 = todo cerrado salvo el primero) */ }
    setCargado(true);
  }, [disciplina, userId]);

  useEffect(() => {
    setCargado(false);
    void recargar();
  }, [recargar]);

  /** Solo con `userId` (María). Devuelve el techo que ha guardado el servidor. */
  const fijar = useCallback(async (paso: number): Promise<void> => {
    if (!disciplina || !userId) return;
    const { data } = await axios.post<{ pasoMax: number }>(
      `${API_URL}/recorrido-progreso/admin/${userId}/${disciplina}`,
      { paso },
    );
    setPasoMax(Math.max(1, Number(data?.pasoMax) || paso));
  }, [disciplina, userId]);

  return { pasoMax, cargado, recargar, fijar: userId ? fijar : undefined };
}
