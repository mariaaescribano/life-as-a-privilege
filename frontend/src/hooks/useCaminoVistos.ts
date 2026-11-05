import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../GlobalVariables";
import { rutaVista, type CaminoKey } from "../data/camino";

// Las páginas del camino que la persona ya ha visto (el tick de las cajitas).
// Viven en la tabla `camino_visto`; además cada navegador las recuerda en localStorage, para
// que el tick salga aunque el SQL de la tabla aún no se haya corrido.

const claveLocal = () => `caminoVistos:${localStorage.getItem("userId") ?? "-"}`;

const leerLocal = (): Record<string, string[]> => {
  try { const o = JSON.parse(localStorage.getItem(claveLocal()) ?? "{}"); return o && typeof o === "object" ? o : {}; }
  catch { return {}; }
};

const apuntadas = new Set<string>(); // lo ya enviado en esta sesión

/** Apunta que la persona ha visto esta página. Llamar desde un efecto de ruta. */
export function marcarVisto(clave: CaminoKey, pathname: string): void {
  const ruta = rutaVista(pathname);
  const id = `${localStorage.getItem("userId")}|${clave}|${ruta}`;
  if (apuntadas.has(id)) return;
  apuntadas.add(id);
  try {
    const l = leerLocal();
    const lista = Array.isArray(l[clave]) ? l[clave] : [];
    if (!lista.includes(ruta)) localStorage.setItem(claveLocal(), JSON.stringify({ ...l, [clave]: [...lista, ruta] }));
  } catch { /* sin localStorage */ }
  axios.post(`${API_URL}/recorrido-progreso/visto`, { disciplina: clave, ruta }).catch(() => { /* no pasa nada: queda lo local */ });
}

/** Rutas vistas de una disciplina. `userId`: la persona que mira María (sin él, la sesión propia). */
export function useCaminoVistos(clave: CaminoKey, userId?: string): Set<string> {
  const [vistas, setVistas] = useState<Set<string>>(() => new Set(userId ? [] : (leerLocal()[clave] ?? [])));
  useEffect(() => {
    let cancel = false;
    axios.get<Record<string, string[]>>(`${API_URL}/recorrido-progreso/vistos`)
      .then((r) => {
        if (cancel) return;
        const srv = Array.isArray(r.data?.[clave]) ? r.data[clave] : [];
        setVistas(new Set([...srv, ...(userId ? [] : (leerLocal()[clave] ?? []))].map(rutaVista)));
      })
      .catch(() => { /* se queda lo local */ });
    return () => { cancel = true; };
  }, [clave, userId]);
  return vistas;
}
