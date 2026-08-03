import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../GlobalVariables";

/* ────────────────────────────────────────────────────────────────────────
 * useLeidos — recuerda qué viñetas / fichas / fotos ha LEÍDO el usuario en un
 * recorrido, para pintarles su marquita (MarcaLeido).
 *
 * Persiste en la columna JSONB `data` del recorrido (metodo_nutricion,
 * metodo_fisiologia…), cada lista bajo su propia clave de primer nivel:
 *   data.mitos_leidos                  = ["soja-cancer", …]
 *   data.microbiota_bacterias_leidas   = ["lactobacillus", …]
 *
 * ⚠️ El backend NO fusiona: reemplaza el blob `data` ENTERO. Así que NUNCA se
 * escribe a ciegas:
 *   1. se pide el blob actual (GET),
 *   2. se le añaden encima TODAS las marcas de esta sesión,
 *   3. y eso es lo que se guarda (PATCH).
 * Si el GET falla, no se escribe (mejor perder la marca que borrar el
 * recorrido). Y como las marcas de la sesión viven en un módulo compartido,
 * dos marcas seguidas —o dos partes de la misma página, como la galería de
 * Ilustraciones y las Respuestas de la Biblioteca— no se pisan entre sí.
 * ──────────────────────────────────────────────────────────────────────── */

type Blob = Record<string, any>;
type Endpoint = "metodo-nutricion" | "metodo-fisiologia";

// Marcas hechas en esta sesión: (endpoint + usuario) → campo → ids. Se fusionan
// siempre antes de guardar y también al leer, para que la marquita salga al
// instante. Van por usuario para que, si se cambia de cuenta sin recargar, no se
// arrastren las marcas de la anterior.
const marcasSesion: Record<string, Record<string, Set<string>>> = {};

const marcasDe = (endpoint: string): Record<string, Set<string>> => {
  const clave = `${endpoint}|${localStorage.getItem("userId") ?? "-"}`;
  if (!marcasSesion[clave]) marcasSesion[clave] = {};
  return marcasSesion[clave];
};

/** Devuelve el blob con las marcas de la sesión añadidas (sin duplicados). */
const fusionar = (data: Blob, marcas: Record<string, Set<string>>): Blob => {
  let out: Blob = { ...data };
  Object.keys(marcas).forEach((campo) => {
    const arr: string[] = Array.isArray(out[campo]) ? out[campo] : [];
    const nuevos = Array.from(marcas[campo]).filter((id) => !arr.includes(id));
    if (nuevos.length) out = { ...out, [campo]: [...arr, ...nuevos] };
  });
  return out;
};

export function useLeidos(endpoint: Endpoint) {
  const [blob, setBlob] = useState<Blob>({});

  // Al entrar, traemos lo ya guardado para pintar las marcas que le tocan.
  useEffect(() => {
    let cancelado = false;
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    axios.get(`${API_URL}/${endpoint}/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => {
        if (cancelado) return;
        setBlob(fusionar(r.data?.data ?? {}, marcasDe(endpoint)));
      })
      .catch(() => { /* sin fila todavía: se creará al marcar algo */ });
    return () => { cancelado = true; };
  }, [endpoint]);

  /** ¿Ya se ha leído esto? (`campo` = la lista; `id` = la clave de la tarjeta). */
  const leido = useCallback((campo: string, id: string): boolean => {
    if (marcasDe(endpoint)[campo]?.has(id)) return true;
    const arr = blob[campo];
    return Array.isArray(arr) && arr.includes(id);
  }, [blob, endpoint]);

  /**
   * Foto fija de lo leído en un campo, para el aviso «✓ Leída» de los popups.
   * Se llama al ABRIR el visor y se guarda tal cual: si se preguntara en vivo,
   * la viñeta que se está leyendo ahora se marcaría sola y el aviso saldría
   * siempre, en vez de solo cuando ya venía leída de antes.
   */
  const snapshot = useCallback((campo: string): Set<string> => {
    const arr = blob[campo];
    const s = new Set<string>(Array.isArray(arr) ? arr : []);
    marcasDe(endpoint)[campo]?.forEach((id) => s.add(id));
    return s;
  }, [blob, endpoint]);

  /** Marca algo como leído (idempotente) y lo guarda en la BD. */
  const marcarLeido = useCallback((campo: string, id: string) => {
    const marcas = marcasDe(endpoint);
    if (!marcas[campo]) marcas[campo] = new Set();
    if (marcas[campo].has(id)) return;
    marcas[campo].add(id);
    // La marquita sale ya, sin esperar al viaje a la BD.
    setBlob((b) => fusionar(b, marcas));

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (!userId || !token) return;
    void (async () => {
      const headers = { Authorization: `Bearer ${token}` };
      let data: Blob;
      try {
        const r = await axios.get(`${API_URL}/${endpoint}/${userId}`, { headers });
        data = r.data?.data ?? {};
      } catch {
        return; // sin saber qué hay guardado no escribimos: borraría el resto
      }
      try {
        await axios.patch(`${API_URL}/${endpoint}/${userId}`,
          { data: fusionar(data, marcasDe(endpoint)) }, { headers });
      } catch { /* se reintenta con la próxima marca */ }
    })();
  }, [endpoint]);

  return { leido, marcarLeido, snapshot };
}
