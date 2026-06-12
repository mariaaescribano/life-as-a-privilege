import axios from "axios";

/**
 * Interceptor global de peticiones: adjunta automáticamente el token JWT
 * (guardado en sessionStorage) en la cabecera Authorization de TODAS las
 * llamadas axios. Así no hay que repetir `headers: { Authorization }` en cada
 * sitio, y los endpoints protegidos del backend reciben siempre el token.
 *
 * Si no hay token (p. ej. en login/registro), no añade nada.
 * Si una llamada ya define su propia cabecera Authorization, se respeta.
 */
axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
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
        sessionStorage.clear();
        window.location.assign("/logIn");
      }
    }
    return Promise.reject(error);
  },
);

export {};
