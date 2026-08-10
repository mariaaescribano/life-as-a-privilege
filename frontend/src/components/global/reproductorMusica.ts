/**
 *  LA MÚSICA DE FONDO DE LA CASA
 *  ─────────────────────────────
 *
 *  Un único reproductor para toda la web. Vive AQUÍ, en un módulo suelto, y no
 *  dentro de un componente, por una razón concreta: la música no puede cortarse
 *  al cambiar de página. Los componentes se montan y se desmontan con cada ruta;
 *  este objeto no. Se crea una vez y sigue sonando mientras la persona navega.
 *
 *  Tres cosas que hay que saber antes de tocar nada:
 *
 *  1. NINGÚN navegador deja sonar audio solo. Chrome, Safari y Firefox bloquean
 *     `play()` hasta que la persona ha tocado la página. Por eso la música
 *     arranca APAGADA y solo suena cuando se pulsa el botón (eso ya es el gesto
 *     que el navegador pide). Si en una visita anterior se dejó encendida, se
 *     intenta arrancar y, si el navegador dice que no, se espera al primer clic.
 *
 *  2. La preferencia se guarda en localStorage. Quien apaga la música no quiere
 *     volver a encontrársela en la siguiente página ni mañana.
 *
 *  3. Cada zona de la web puede tener su pista (ver PISTAS, abajo). Al cambiar
 *     de pista hay un fundido: se baja el volumen, se cambia el fichero y se
 *     sube. Cortar en seco suena a error.
 */

/** Volumen de partida. Es música de FONDO: por debajo de la voz de la página. */
const VOLUMEN_POR_DEFECTO = 0.28;
/** Lo que tarda un fundido de entrada o de salida. */
const MS_FUNDIDO = 900;

const CLAVE_ENCENDIDA = "musica.encendida";
const CLAVE_VOLUMEN = "musica.volumen";

/* ────────────────────────────────────────────────────────────────────────────
   QUÉ SUENA EN CADA SITIO

   Los ficheros van en `public/audio/musica/`. La primera entrada cuyo prefijo
   encaje con la ruta gana, así que el orden importa: primero lo específico,
   al final el comodín "" que cubre toda la web.

   Ahora mismo suena la MISMA pista en toda la casa. El día que haya una por
   disciplina, basta con descomentar las líneas de abajo y dejar los mp3 con
   ese nombre: no hay que tocar ninguna otra cosa.

   Las ocho pistas tienen que sonar a la MISMA casa: mismo tipo de instrumento,
   mismo volumen, sin batería y sin letra. Lo que cambia de una a otra es el
   color, no el género — si no, navegar suena a cambiar de emisora.
   ──────────────────────────────────────────────────────────────────────────── */

type Pista = { prefijo: string; src: string };

const PISTAS: Pista[] = [
  // Cielo nocturno, sin pulso: pads largos, algo de piano suelto muy espaciado.
  // { prefijo: "/metodo/astrologia", src: "/audio/musica/astrologia.mp3" },
  // La más delicada: piano de fieltro, cálida y NEUTRA. Nada que empuje a llorar
  // mientras alguien escribe sobre sus heridas.
  // { prefijo: "/metodo/psicologia", src: "/audio/musica/psicologia.mp3" },
  // India de verdad: tanpura de fondo y flauta bansuri. Sin tabla (el ritmo tira
  // de la atención) y sin canto con palabras.
  // { prefijo: "/metodo/ayurveda",   src: "/audio/musica/ayurveda.mp3" },
  // Guqin o guzheng y flauta de bambú, con MUCHO silencio entre nota y nota.
  // { prefijo: "/metodo/tcm",        src: "/audio/musica/tcm.mp3" },
  // La única con movimiento: minimalismo que repite como repite un proceso
  // (marimba, celesta), porque aquí se cuenta algo vivo que no para.
  // { prefijo: "/metodo/fisiologia", src: "/audio/musica/fisiologia.mp3" },
  // La más de diario: guitarra acústica suave o Rhodes cálido. Luz de cocina.
  // { prefijo: "/metodo/nutricion",  src: "/audio/musica/nutricion.mp3" },
  // Sagrada y vertical: drone grave, voz sin palabras de textura, chelo.
  // { prefijo: "/metodo/cabala",     src: "/audio/musica/cabala.mp3" },
  // De biblioteca: cuerdas sostenidas, reflexiva. Nada épico ni triunfal.
  // { prefijo: "/metodo/cultura",    src: "/audio/musica/cultura.mp3" },

  // La de la casa: la más neutra de todas, la que suena en la portada, en
  // Materiales y en El Mapa. Es la primera que hay que elegir.
  { prefijo: "", src: "/audio/musica/general.mp3" },
];

/**
 *  Qué pista le toca a una ruta, o null si en esa ruta no suena nada.
 *
 *  Dos sitios mudos a propósito:
 *  · El panel de administración: es una herramienta de trabajo, no una visita.
 *  · La regulación de psicología: tiene su propio audio de estimulación
 *    bilateral, y dos sonidos a la vez estropearían justo ese ejercicio.
 */
export function pistaParaRuta(pathname: string): string | null {
  const ruta = pathname.toLowerCase();
  if (ruta.startsWith("/admin")) return null;
  if (ruta.startsWith("/metodo/psicologia/") && ruta.endsWith("/regulacion")) return null;
  return PISTAS.find((p) => ruta.startsWith(p.prefijo))?.src ?? null;
}

/* ──────────────────────────── El reproductor ──────────────────────────── */

let audio: HTMLAudioElement | null = null;
let pistaActual: string | null = null;
let fundido: ReturnType<typeof setInterval> | null = null;
let esperandoGesto = false;
/** Ficheros que el navegador no ha podido cargar (no existen todavía, p. ej.).
 *  Se apuntan para no reintentarlos y para poder esconder el botón. */
const rotas = new Set<string>();

let encendida = leerEncendida();
let volumen = leerVolumen();

function leerEncendida(): boolean {
  try { return localStorage.getItem(CLAVE_ENCENDIDA) === "1"; } catch { return false; }
}
function leerVolumen(): number {
  try {
    const v = Number(localStorage.getItem(CLAVE_VOLUMEN));
    return Number.isFinite(v) && v > 0 && v <= 1 ? v : VOLUMEN_POR_DEFECTO;
  } catch { return VOLUMEN_POR_DEFECTO; }
}
function guardar(clave: string, valor: string) {
  try { localStorage.setItem(clave, valor); } catch { /* modo incógnito: da igual */ }
}

function obtenerAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (audio) return audio;
  const a = new Audio();
  a.loop = true;          // música de fondo: no termina, acompaña
  a.preload = "none";     // no se descarga nada hasta que alguien la enciende
  a.volume = 0;
  // Si el fichero no existe (o no se puede leer), se apunta como roto y el
  // botón desaparece. Nunca un mensaje de error por una música.
  a.addEventListener("error", () => {
    if (pistaActual) rotas.add(pistaActual);
    avisar();
  });
  audio = a;
  return a;
}

/** Lleva el volumen hasta `destino` poco a poco. */
function fundir(destino: number, alTerminar?: () => void) {
  const a = obtenerAudio();
  if (!a) return;
  if (fundido) { clearInterval(fundido); fundido = null; }
  if (Math.abs(destino - a.volume) < 0.02) {
    a.volume = destino;
    alTerminar?.();
    return;
  }
  const paso = 40;
  const salto = (destino - a.volume) / (MS_FUNDIDO / paso);
  fundido = setInterval(() => {
    const v = a.volume + salto;
    const llegado = salto >= 0 ? v >= destino : v <= destino;
    a.volume = Math.min(1, Math.max(0, llegado ? destino : v));
    if (llegado) {
      if (fundido) clearInterval(fundido);
      fundido = null;
      alTerminar?.();
    }
  }, paso);
}

/** Pide al navegador que suene. Si dice que no (falta el gesto), se espera al
 *  primer clic o tecla y se vuelve a intentar. */
function reproducir(a: HTMLAudioElement) {
  void a.play().catch(() => esperarGesto());
}

function esperarGesto() {
  if (esperandoGesto) return;
  esperandoGesto = true;
  const alTocar = () => {
    esperandoGesto = false;
    window.removeEventListener("pointerdown", alTocar);
    window.removeEventListener("keydown", alTocar);
    aplicar();
  };
  window.addEventListener("pointerdown", alTocar, { once: true });
  window.addEventListener("keydown", alTocar, { once: true });
}

/** El único sitio que decide si suena algo y qué. Todo lo demás cambia una
 *  variable y llama aquí. */
function aplicar() {
  const a = obtenerAudio();
  if (!a) return;
  const pista = encendida && pistaActual && !rotas.has(pistaActual) ? pistaActual : null;

  if (!pista) {
    if (!a.paused) fundir(0, () => a.pause());
    return;
  }

  const arrancar = () => {
    if (!a.src.endsWith(pista)) a.src = pista;
    a.volume = 0;
    reproducir(a);
    fundir(volumen);
  };

  if (!a.src.endsWith(pista)) {
    // Cambio de pista: primero se apaga la que suena, luego entra la nueva.
    if (!a.paused) fundir(0, () => { a.pause(); arrancar(); });
    else arrancar();
  } else if (a.paused) {
    arrancar();
  } else {
    fundir(volumen);
  }
}

/* ─────────────────────────── Estado para React ─────────────────────────── */

export type EstadoMusica = {
  /** Si la persona la ha encendido. */
  encendida: boolean;
  /** Si en la ruta de ahora hay algo que sonar (si no, el botón se esconde). */
  hayPista: boolean;
  volumen: number;
};

let instantanea: EstadoMusica = { encendida, hayPista: false, volumen };
const oyentes = new Set<() => void>();

function avisar() {
  instantanea = {
    encendida,
    hayPista: !!pistaActual && !rotas.has(pistaActual),
    volumen,
  };
  oyentes.forEach((fn) => fn());
}

export function suscribir(fn: () => void) {
  oyentes.add(fn);
  return () => { oyentes.delete(fn); };
}
export function estado(): EstadoMusica { return instantanea; }
/** El servidor no tiene música: para el render de servidor, siempre apagada. */
export function estadoServidor(): EstadoMusica {
  return { encendida: false, hayPista: false, volumen: VOLUMEN_POR_DEFECTO };
}

/* ──────────────────────────────── Mandos ──────────────────────────────── */

/** Encender / apagar. Se llama desde el botón del header. */
export function alternarMusica() {
  encendida = !encendida;
  guardar(CLAVE_ENCENDIDA, encendida ? "1" : "0");
  aplicar();
  avisar();
}

export function ponerVolumen(v: number) {
  volumen = Math.min(1, Math.max(0, v));
  guardar(CLAVE_VOLUMEN, String(volumen));
  const a = obtenerAudio();
  if (a && !a.paused) { if (fundido) { clearInterval(fundido); fundido = null; } a.volume = volumen; }
  avisar();
}

/** Le dice al reproductor en qué página estamos. Lo llama <MusicaFondo />. */
export function ponerPista(src: string | null) {
  if (src === pistaActual) return;
  pistaActual = src;
  aplicar();
  avisar();
}

/** Con la pestaña en segundo plano la música se calla; al volver, sigue.
 *  Nadie quiere buscar de qué pestaña sale un sonido. */
export function vigilarPestana() {
  if (typeof document === "undefined") return () => {};
  const alCambiar = () => {
    const a = obtenerAudio();
    if (!a) return;
    if (document.hidden) { if (!a.paused) a.pause(); }
    else aplicar();
  };
  document.addEventListener("visibilitychange", alCambiar);
  return () => document.removeEventListener("visibilitychange", alCambiar);
}
