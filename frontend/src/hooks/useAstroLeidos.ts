import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_URL } from "../GlobalVariables";

/* ────────────────────────────────────────────────────────────────────────
 * useAstroLeidos — recuerda qué puntos clave / casas / aspectos ha LEÍDO el
 * usuario (abierto su lectura). Sirve para cambiar el diseño de lo ya visto y
 * para el desbloqueo secuencial del recorrido de astrología:
 *   Puntos clave → Casas → Aspectos (cada página exige leer la anterior).
 *
 * PERSISTE EN LA BASE DE DATOS (no en localStorage), en la columna JSONB
 * `metodo_astrologia.data`, bajo su propia clave de primer nivel:
 *   · retos    → data.retosLeidos:    string[]  (ids de punto clave)
 *   · casas    → data.casasLeidos:    string[]  (números de casa "1".."12")
 *   · aspectos → data.aspectosLeidos: string[]  (claves de aspecto)
 * El backend fusiona `data` al hacer PATCH, así que cada clave convive con las
 * demás (planetas elegidos, los otros tipos de leídos, etc.).
 *
 * Además mantiene una CACHÉ en memoria (a nivel de módulo) por clave: al marcar
 * algo leído se actualiza al instante, de modo que al navegar a la siguiente
 * página (que exige haber leído la anterior) el estado ya está disponible sin
 * esperar a que el PATCH viaje a la BD y vuelva. La BD sigue siendo el almacén
 * persistente entre sesiones/dispositivos; la caché solo evita la carrera
 * dentro de la misma sesión de navegación.
 * ──────────────────────────────────────────────────────────────────────── */
const DATA_KEY: Record<"retos" | "casas" | "aspectos", string> = {
  retos: "retosLeidos",
  casas: "casasLeidos",
  aspectos: "aspectosLeidos",
};

// Caché en memoria compartida entre instancias del hook (persiste mientras no
// se recargue la página; una recarga completa la repuebla desde la BD).
const cache: Record<string, Set<string>> = {};

export function useAstroLeidos(tipo: "retos" | "casas" | "aspectos") {
  const dataKey = DATA_KEY[tipo];

  const [leidos, setLeidos] = useState<Set<string>>(() => new Set(cache[dataKey] ?? []));
  const [cargado, setCargado] = useState(false);
  // Conjunto ACTUAL para el PATCH (evita perder marcados rápidos seguidos).
  const leidosRef = useRef<Set<string>>(leidos);
  leidosRef.current = leidos;

  useEffect(() => {
    let cancelado = false;
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) { setCargado(true); return; }

    axios
      .get(`${API_URL}/metodo-astrologia/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (cancelado) return;
        const arr = (res.data?.data?.[dataKey] ?? []) as string[];
        // Unión de lo que hay en BD y lo ya marcado en esta sesión (caché).
        const merged = new Set<string>([...(cache[dataKey] ?? []), ...(Array.isArray(arr) ? arr : [])]);
        cache[dataKey] = merged;
        setLeidos(new Set(merged));
      })
      .catch(() => { /* si falla, seguimos con lo que haya en caché */ })
      .finally(() => { if (!cancelado) setCargado(true); });

    return () => { cancelado = true; };
  }, [dataKey]);

  const marcarLeido = useCallback(
    (id: string) => {
      if (leidosRef.current.has(id)) return;
      const next = new Set(leidosRef.current);
      next.add(id);
      cache[dataKey] = next; // disponible al instante para la siguiente página
      setLeidos(next);

      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      if (!userId || !token) return;
      // Persistimos el conjunto completo del tipo. El backend fusiona `data`,
      // así que no pisa planetas ni los otros tipos de leídos.
      axios
        .patch(
          `${API_URL}/metodo-astrologia/${userId}`,
          { data: { [dataKey]: [...next] } },
          { headers: { Authorization: `Bearer ${token}` } },
        )
        .catch(() => { /* la caché en memoria ya refleja el cambio */ });
    },
    [dataKey],
  );

  return { leidos, marcarLeido, cargado };
}
