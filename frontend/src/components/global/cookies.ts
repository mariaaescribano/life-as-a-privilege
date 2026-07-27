// cookies.ts — consentimiento de cookies analíticas.
//
// Google Analytics estaba antes en el <head> de index.html, es decir: se cargaba
// y ponía sus cookies ANTES de que nadie diera permiso. Eso no cumple el RGPD ni
// el artículo 22.2 de la LSSI. Ahora GA no existe hasta que se acepta aquí.
//
// Las cookies técnicas (la sesión, que va en localStorage) no necesitan
// consentimiento: sin ellas el sitio no puede funcionar.

const CLAVE = "cookieConsent";
const GA_ID = "G-LSEBM0PB9V";

export type EstadoCookies = "aceptadas" | "rechazadas" | null;

/** Qué decidió la persona, o `null` si todavía no ha decidido. */
export function estadoCookies(): EstadoCookies {
  try {
    const v = localStorage.getItem(CLAVE);
    return v === "aceptadas" || v === "rechazadas" ? v : null;
  } catch {
    // localStorage puede fallar en modo privado de algunos navegadores.
    return null;
  }
}

let gaCargado = false;

/** Inyecta Google Analytics. Solo se llama si hay consentimiento. */
function cargarAnalytics() {
  if (gaCargado || typeof document === "undefined") return;
  gaCargado = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  function gtag(...args: any[]) {
    w.dataLayer.push(args);
  }
  w.gtag = gtag;
  gtag("js", new Date());
  // cookie_domain 'none' → la cookie se pone en el host exacto. Evita el error
  // "rejected for invalid domain" en dominios compartidos como *.onrender.com.
  gtag("config", GA_ID, { cookie_domain: "none", anonymize_ip: true });
}

/** Borra las cookies que haya dejado GA (al rechazar o al revocar el permiso). */
function borrarCookiesAnalytics() {
  if (typeof document === "undefined") return;
  const nombres = document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((n) => n.startsWith("_ga") || n.startsWith("_gid") || n.startsWith("_gat"));
  for (const nombre of nombres) {
    document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
}

/** Guarda la decisión y la aplica en el acto. */
export function guardarConsentimiento(valor: "aceptadas" | "rechazadas") {
  try {
    localStorage.setItem(CLAVE, valor);
  } catch {
    /* si no se puede guardar, al menos aplicamos la decisión en esta visita */
  }
  if (valor === "aceptadas") {
    cargarAnalytics();
  } else {
    borrarCookiesAnalytics();
  }
}

/** Vuelve a dejar la decisión sin tomar: el aviso reaparecerá. */
export function revocarConsentimiento() {
  try {
    localStorage.removeItem(CLAVE);
  } catch {
    /* nada que hacer */
  }
  borrarCookiesAnalytics();
}

/**
 * Se llama una vez al arrancar la app: si en una visita anterior se aceptaron
 * las cookies, carga GA; si no, no hace absolutamente nada.
 */
export function aplicarConsentimientoGuardado() {
  if (estadoCookies() === "aceptadas") cargarAnalytics();
}
