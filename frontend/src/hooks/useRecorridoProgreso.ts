import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_URL } from "../GlobalVariables";

/**
 * Progreso SECUENCIAL del recorrido (persistido en BD), por disciplina. Devuelve
 * el paso máximo desbloqueado y una función `avanzar(paso)` para subirlo cuando
 * el usuario llega legítimamente al siguiente paso. El Índice bloquea los pasos
 * posteriores a `pasoMax`.
 */
export function useRecorridoProgreso(disciplina: string | null | undefined) {
  const [pasoMax, setPasoMax] = useState(1);
  const [cargado, setCargado] = useState(false);
  const pasoMaxRef = useRef(1);
  pasoMaxRef.current = pasoMax;

  useEffect(() => {
    if (!disciplina) { setCargado(true); return; }
    const token = localStorage.getItem("token");
    if (!token) { setCargado(true); return; }
    let cancel = false;
    axios
      .get(`${API_URL}/recorrido-progreso/${disciplina}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((r) => { if (!cancel) setPasoMax(Math.max(1, Number(r.data?.pasoMax) || 1)); })
      .catch(() => { /* si falla, queda en 1 (todo bloqueado salvo el primero) */ })
      .finally(() => { if (!cancel) setCargado(true); });
    return () => { cancel = true; };
  }, [disciplina]);

  const avanzar = useCallback((paso: number) => {
    if (!disciplina) return;
    const token = localStorage.getItem("token");
    if (!token) return;
    if (paso <= pasoMaxRef.current) return; // ya desbloqueado
    setPasoMax(paso); // optimista: desbloquea ya en la UI
    axios
      .post(
        `${API_URL}/recorrido-progreso/${disciplina}/avanzar`,
        { paso },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((r) => {
        const v = Number(r.data?.pasoMax);
        if (Number.isFinite(v)) setPasoMax((p) => Math.max(p, v));
      })
      .catch(() => { /* la UI ya refleja el avance; se reintentará en la próxima página */ });
  }, [disciplina]);

  return { pasoMax, cargado, avanzar };
}
