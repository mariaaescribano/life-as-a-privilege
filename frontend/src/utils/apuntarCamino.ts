// ─────────────────────────────────────────────────────────────────────────────
// Apunta por dónde va el usuario, para el camino de /home (ver data/camino.ts).
//
// Es un «fire and forget» a conciencia: si falla, no se le dice nada a nadie ni
// se reintenta. Lo peor que pasa es que el camino de la Home enseñe un paso
// menos hasta la siguiente página que visite — y eso no puede estropearle la
// página en la que está.
// ─────────────────────────────────────────────────────────────────────────────
import axios from "axios";
import { API_URL } from "../GlobalVariables";
import { claveCamino } from "../data/camino";

/** Lo ya apuntado en esta sesión, para no repetir la misma petición. */
const apuntado = new Map<string, number>();

/**
 * Apunta que se ha llegado al paso `paso` de `key`. El servidor solo sube el
 * número (nunca lo baja), así que volver atrás en el recorrido no borra camino.
 *
 * `pieza` es para los recorridos sin orden (las Historias de Cultura): cada
 * pieza lleva su propia fila y lo que cuenta es cuántas hay.
 */
export function apuntarCamino(key: string, paso: number, pieza?: string): void {
  if (!key || !Number.isFinite(paso) || paso < 1) return;
  const clave = claveCamino(key, pieza);
  if ((apuntado.get(clave) ?? 0) >= paso) return;
  const token = localStorage.getItem("token");
  if (!token) return;
  apuntado.set(clave, paso);
  axios
    .post(
      `${API_URL}/recorrido-progreso/${clave}/avanzar`,
      { paso },
      { headers: { Authorization: `Bearer ${token}` } },
    )
    .catch(() => { apuntado.delete(clave); /* que lo reintente la próxima página */ });
}
