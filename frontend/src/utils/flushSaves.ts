// ─────────────────────────────────────────────────────────────────────────
// flushSaves — rastreador central de guardados (PATCH) en vuelo.
//
// PROBLEMA que resuelve: los recorridos del Método guardan un ÚNICO blob JSON
// `data` y el backend lo REEMPLAZA entero en cada PATCH. Cada página construye
// ese blob desde la copia que leyó al cargar (su `dataRef`). Si el usuario
// navega (por un botón o por el Índice) ANTES de que termine el guardado de la
// página actual, la página siguiente hace su GET y lee datos viejos → su primer
// guardado revierte lo que la anterior acababa de escribir. Síntoma: datos que
// "desaparecen la primera vez y reaparecen al recargar".
//
// SOLUCIÓN: un interceptor de axios cuenta los PATCH en vuelo; `flushSaves()`
// espera a que no quede ninguno. Se llama justo antes de navegar, así la
// siguiente página siempre lee datos ya confirmados. Es global y agnóstico de
// disciplina (rastrea cualquier PATCH), así que protege TODO el recorrido sin
// tocar el guardado de cada página.
// ─────────────────────────────────────────────────────────────────────────
import axios from "axios";

let enVuelo = 0;
let esperando: Array<() => void> = [];

function drenar() {
  if (enVuelo <= 0) {
    enVuelo = 0;
    const pendientes = esperando;
    esperando = [];
    pendientes.forEach((resolver) => resolver());
  }
}

let registrado = false;

/** Registra los interceptores (una sola vez). Llamar al arrancar la app. */
export function registrarRastreoGuardados(): void {
  if (registrado) return;
  registrado = true;

  axios.interceptors.request.use((config) => {
    if ((config.method || "").toLowerCase() === "patch") {
      enVuelo += 1;
      (config as { __rastreado?: boolean }).__rastreado = true;
    }
    return config;
  });

  const alTerminar = (config?: { __rastreado?: boolean }) => {
    if (config?.__rastreado) {
      enVuelo -= 1;
      drenar();
    }
  };

  axios.interceptors.response.use(
    (res) => { alTerminar(res.config as { __rastreado?: boolean }); return res; },
    (err) => { alTerminar(err?.config as { __rastreado?: boolean }); return Promise.reject(err); },
  );
}

/**
 * Espera a que no queden guardados (PATCH) en vuelo. Se resuelve enseguida si no
 * hay ninguno. Trae un tope de seguridad (por defecto 4s) para no bloquear la
 * navegación indefinidamente si una petición se cuelga.
 */
export function flushSaves(timeoutMs = 4000): Promise<void> {
  if (enVuelo <= 0) return Promise.resolve();
  return new Promise<void>((resolver) => {
    esperando.push(resolver);
    setTimeout(resolver, timeoutMs);
  });
}
