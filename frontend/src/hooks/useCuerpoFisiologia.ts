import { useCallback, useRef, useState } from "react";
import axios from "axios";
import { API_URL } from "../GlobalVariables";
import { leerCuerpo, type CuerpoGuardado } from "../hardCoded/espacio/EstacionesCuerpo";

// ─────────────────────────────────────────────────────────────────────────
// useCuerpoFisiologia · lo que la persona lleva hecho del camino «Tu cuerpo».
//
// Vive dentro del blob único `data` de metodo_fisiologia, en `data.cuerpo`
// (ver EstacionesCuerpo.ts). El backend REEMPLAZA el blob entero en cada PATCH,
// así que se guarda siempre desde la copia completa que se leyó al cargar
// (`dataRef`), tocando solo `cuerpo`. Antes de navegar a otra página del
// recorrido, llamar a `flushSaves()` (utils/flushSaves).
//
// `cargar()` lo llama la página cuando ya ha comprobado la sesión y el pago.
// ─────────────────────────────────────────────────────────────────────────
export function useCuerpoFisiologia() {
  const [cuerpo, setCuerpo] = useState<CuerpoGuardado>(() => leerCuerpo(null));
  const dataRef = useRef<Record<string, any>>({});
  // Lo último guardado, para encadenar dos cambios seguidos sin pisarse.
  const cuerpoRef = useRef<CuerpoGuardado>(cuerpo);

  /** Lee de la BD. Sin fila todavía = camino por estrenar. Devuelve lo leído. */
  const cargar = useCallback(async (): Promise<CuerpoGuardado> => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    let leido = leerCuerpo(null);
    if (userId && token) {
      try {
        const r = await axios.get(`${API_URL}/metodo-fisiologia/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        dataRef.current = r.data?.data && typeof r.data.data === "object" ? r.data.data : {};
        leido = leerCuerpo(dataRef.current);
      } catch { /* sin fila todavía */ }
    }
    cuerpoRef.current = leido;
    setCuerpo(leido);
    return leido;
  }, []);

  /** Aplica un cambio sobre lo guardado y lo manda a la BD. */
  const guardar = useCallback((cambio: (previo: CuerpoGuardado) => CuerpoGuardado): Promise<void> => {
    const nuevo = cambio(cuerpoRef.current);
    cuerpoRef.current = nuevo;
    setCuerpo(nuevo);
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return Promise.resolve();
    const data = { ...dataRef.current, cuerpo: nuevo };
    dataRef.current = data;
    return axios
      .patch(`${API_URL}/metodo-fisiologia/${userId}`, { data }, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => undefined)
      .catch(() => { /* se reintenta con el siguiente guardado */ });
  }, []);

  return { cuerpo, cargar, guardar };
}
