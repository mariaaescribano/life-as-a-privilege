import axios from "axios";

/**
 * DÓNDE VIVE LA SESIÓN — token, userId, name, img e isAdmin se guardan en
 * localStorage, no en sessionStorage. La diferencia importa: sessionStorage se
 * borra al cerrar la pestaña, así que quien pagaba un recorrido y volvía al día
 * siguiente se encontraba fuera y creía haber perdido lo comprado. Con
 * localStorage la sesión aguanta hasta que caduca el token (30 días, ver
 * backend/src/auth/auth.module.ts) o hasta que se pulsa «Cerrar sesión».
 *
 * Rescate de sesiones antiguas: quien tuviera la web abierta cuando se
 * desplegó este cambio seguía teniendo sus datos en sessionStorage. En vez de
 * echarle, se copian una vez a localStorage. (Se puede borrar este bloque
 * pasado un tiempo del despliegue.)
 */
(() => {
  try {
    if (!localStorage.getItem("token") && sessionStorage.getItem("token")) {
      for (const k of ["token", "userId", "name", "img", "isAdmin"]) {
        const v = sessionStorage.getItem(k);
        if (v !== null) localStorage.setItem(k, v);
      }
    }
  } catch { /* navegador con el almacenamiento bloqueado: no es crítico */ }
})();

/**
 * Interceptor global de peticiones: adjunta automáticamente el token JWT
 * (guardado en localStorage) en la cabecera Authorization de TODAS las
 * llamadas axios. Así no hay que repetir `headers: { Authorization }` en cada
 * sitio, y los endpoints protegidos del backend reciben siempre el token.
 *
 * Si no hay token (p. ej. en login/registro), no añade nada.
 * Si una llamada ya define su propia cabecera Authorization, se respeta.
 */
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !config.headers?.Authorization) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Interceptor global de respuestas: si el backend responde 401 (token ausente,
 * inválido o caducado), limpiamos la sesión y mandamos al login en lugar de
 * dejar que cada página muestre un "error desconocido". Evitamos el bucle si ya
 * estamos en una página de autenticación.
 */
const AUTH_PATHS = ["/logIn", "/signIn", "/welcome"];
axios.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      const path = window.location.pathname;
      const enAuth = AUTH_PATHS.some((p) => path.toLowerCase().startsWith(p.toLowerCase()));
      if (!enAuth) {
        localStorage.clear();
        sessionStorage.clear(); // por si quedaran restos de la sesión antigua
        window.location.assign("/logIn");
      }
    }
    return Promise.reject(error);
  },
);

export {};
