import { useEffect, useRef, useState } from "react";
import axios from "axios";

/**
 * Calcula «hasta dónde puede llegar» el usuario en un recorrido: descarga los
 * datos de la disciplina (cuando `activo`, p.ej. al abrir el Índice) y aplica la
 * función `computar`, que devuelve el paso máximo ALCANZABLE respetando los
 * requisitos de cada paso. Se descarga de forma perezosa (solo al abrir el
 * Índice), para no añadir una petición extra en cada página del recorrido.
 *
 * Mientras no hay dato aún, devuelve `null` → el Índice cae en su bloqueo por
 * páginas ya visitadas (pasoMax), y se expande en cuanto llega la respuesta.
 */
export function useRecorridoAlcanzable(
  activo: boolean,
  url: ((userId: string) => string) | undefined,
  computar: ((data: any, expId: string) => number) | undefined,
  expId: string,
): { maxAlcanzable: number | null } {
  const [maxAlcanzable, setMaxAlcanzable] = useState<number | null>(null);
  // Refs para leer `url`/`computar` sin re-disparar el efecto por su identidad
  // (suelen ser funciones a nivel de módulo, pero los defaults de props no).
  const urlRef = useRef(url);
  urlRef.current = url;
  const computarRef = useRef(computar);
  computarRef.current = computar;

  useEffect(() => {
    if (!activo) return;
    const u = urlRef.current;
    const c = computarRef.current;
    if (!u || !c) return;
    const userId = sessionStorage.getItem("userId");
    const token = sessionStorage.getItem("token");
    if (!userId || !token) return;
    let cancel = false;
    axios
      .get(u(userId), { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => { if (!cancel) setMaxAlcanzable(c(r.data?.data || {}, expId)); })
      .catch(() => { /* deja el valor previo; el Índice cae en pasoMax */ });
    return () => { cancel = true; };
  }, [activo, expId]);

  return { maxAlcanzable };
}
