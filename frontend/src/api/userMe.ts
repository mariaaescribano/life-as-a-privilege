// ─────────────────────────────────────────────────────────────────────────────
// /user/me CON CACHÉ DE SESIÓN
//
// Las ~100 páginas del recorrido comprobaban el pago pidiendo /user/me al
// montar: un viaje al backend POR PÁGINA, en serie con la carga de sus datos,
// aunque la página anterior lo hubiera pedido medio segundo antes. Era el
// grueso de la espera entre pasos.
//
// Aquí vive UNA sola petición compartida: la primera página de la sesión la
// lanza y las demás reutilizan la respuesta al instante. Se guarda la PROMESA
// (no el resultado), así dos páginas que preguntan a la vez tampoco duplican
// el viaje.
//
// La caché caduca a los 5 minutos y se invalida sola si cambia la sesión
// (login, logout o «entrar como»: la clave lleva userId y token). El guardia
// de pago pide siempre `fresca: true` —un «no pagado» hay que re-preguntarlo,
// puede que acabe de pagar— y de paso deja la caché recién puesta para todos.
//
// Devuelve `{ data }` (la misma forma que la respuesta de axios) a propósito:
// los call sites hacían `me.data?.psicologia_suscrito` y así ninguno cambia.
// ─────────────────────────────────────────────────────────────────────────────
import axios from "axios";
import { API_URL } from "../GlobalVariables";

export interface UserMeRespuesta {
  data: Record<string, unknown> | null;
}

const TTL_MS = 5 * 60 * 1000;

let cache: { clave: string; promesa: Promise<UserMeRespuesta>; hora: number } | null = null;

/** userId + token: si cambia cualquiera de los dos, la caché no vale. */
const claveSesion = (): string => {
  try {
    return `${localStorage.getItem("userId") ?? ""}|${localStorage.getItem("token") ?? ""}`;
  } catch {
    return "";
  }
};

export function getUserMe(opts?: { fresca?: boolean }): Promise<UserMeRespuesta> {
  const clave = claveSesion();
  const ahora = Date.now();
  if (!opts?.fresca && cache && cache.clave === clave && ahora - cache.hora < TTL_MS) {
    return cache.promesa;
  }
  // El token lo adjunta el interceptor global (api/axiosSetup.ts).
  const promesa: Promise<UserMeRespuesta> = axios
    .get(`${API_URL}/user/me`)
    .then((r) => ({ data: r.data ?? null }))
    .catch((err) => {
      // Una petición fallida no se deja cacheada: la página siguiente reintenta.
      if (cache?.promesa === promesa) cache = null;
      throw err;
    });
  cache = { clave, promesa, hora: ahora };
  return promesa;
}

/** Tira la caché (p. ej. justo después de un pago, para que el `_suscrito`
 *  nuevo se lea sin esperar los 5 minutos). */
export function invalidarUserMe(): void {
  cache = null;
}
