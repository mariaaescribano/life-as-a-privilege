// ─────────────────────────────────────────────────────────────────────────────
// EL CAMINO DE MARÍA EN EL DE UNA PERSONA (solo administración)
//
// Hay dos caminos, el de María y el de la persona. Llegan al mismo sitio (el mapa
// y las páginas del recorrido), pero cada uno con sus posibilidades: María abre
// pasos, escribe notas y entra donde quiera; la persona recorre y rellena.
//
// María NO se convierte en la persona ni usa su sesión. Conserva SIEMPRE su token
// de admin. Lo único que cambia al abrir el camino de alguien es:
//   · se guarda a quién mira (`persona`),
//   · `userId`, `name` e `img` del navegador pasan a ser los de esa persona, para
//     que las páginas del recorrido pidan SUS datos sin tocar ninguna,
//   · cada petición lleva la cabecera `X-Persona: <id>` (ver axiosSetup.ts), y el
//     servidor, solo si el token es de admin desbloqueado, resuelve la petición
//     sobre esa persona (backend/src/auth/persona.util.ts).
//
// La persona no se entera de nada: todo pasa en el navegador de María.
//
// Lo de María (userId, name, img, isAdmin) se aparta en `personaAdmin` y se
// devuelve tal cual al salir. El token no hace falta apartarlo: nunca se cambia.
// ─────────────────────────────────────────────────────────────────────────────
import axios from "axios";
import { API_URL } from "../GlobalVariables";
import { cerrarSesionLocal, esAdminDesbloqueado } from "./sesion";

/** La persona cuyo camino estoy abriendo ahora mismo (si hay alguna). */
const CLAVE_PERSONA = "persona";
/** Lo mío (de María), apartado para devolverlo al salir. */
const CLAVE_ADMIN = "personaAdmin";

export interface PersonaAbierta {
  id: string;
  name: string;
  email: string;
  img?: string | null;
}

interface SesionApartada {
  userId: string | null;
  name: string | null;
  img: string | null;
  isAdmin: string | null;
}

const leerJson = <T,>(clave: string): T | null => {
  try {
    const crudo = localStorage.getItem(clave);
    return crudo ? (JSON.parse(crudo) as T) : null;
  } catch {
    return null;
  }
};

/**
 * Borra el rastro de «estar mirando a una persona» (la persona abierta y lo apartado de María).
 * Hay que llamarla al INICIAR SESIÓN: si María cerró la pestaña dentro del camino de alguien, esas
 * claves se quedaban en el navegador y, al volver a entrar, cada petición seguía yendo sobre esa
 * persona (X-Persona): el panel la trataba como un usuario más y la mandaba a /home.
 */
export function olvidarPersona() {
  try {
    localStorage.removeItem(CLAVE_PERSONA);
    localStorage.removeItem(CLAVE_ADMIN);
  } catch { /* modo privado */ }
}

/** La persona cuyo camino está abierto, o null si estoy en el mío. */
export function personaActiva(): PersonaAbierta | null {
  const dato = leerJson<PersonaAbierta>(CLAVE_PERSONA);
  return dato?.id ? dato : null;
}

/**
 * ¿Es María quien mira? La admin con el panel desbloqueado, o la admin dentro del
 * camino de una persona. En los dos casos entra a donde quiera (los candados y el
 * pago son para la persona) y ve lo que la persona NO ve: los botones para
 * abrirle pasos, la nota que le escribe…
 */
export function esMariaMirando(): boolean {
  return esAdminDesbloqueado() || personaActiva() !== null;
}

const leer = (k: string) => {
  try { return localStorage.getItem(k); } catch { return null; }
};

const poner = (k: string, v: string | null) => {
  try { if (v !== null) localStorage.setItem(k, v); } catch { /* modo privado */ }
};

/**
 * La cabecera que hay que añadir a mano en las peticiones que NO pasan por axios
 * (los `fetch` sueltos): con ella el servidor sabe que María va sobre esa persona.
 * Vacía si no hay persona abierta. Las de axios la llevan solas (axiosSetup.ts).
 */
export function cabeceraPersona(): Record<string, string> {
  if (window.location.pathname.startsWith("/admin")) return {}; // el panel nunca va sobre una persona
  const p = personaActiva();
  return p ? { "X-Persona": p.id } : {};
}

/**
 * Abre el camino de esa persona. Devuelve sus datos.
 *
 * Se pide ANTES de tocar el almacén (la petición va con el token de admin, que es
 * el único que el servidor acepta aquí).
 */
export async function abrirCaminoDe(userId: string): Promise<PersonaAbierta> {
  const res = await axios.get<{ user: PersonaAbierta }>(
    `${API_URL}/user/admin/persona/${encodeURIComponent(userId)}`,
  );
  const { user } = res.data;

  // Lo mío, apartado ANTES de limpiar. Si ya estaba en el camino de otra persona,
  // lo apartado es lo de María de entonces, no lo de esa persona.
  const mio: SesionApartada = leerJson<SesionApartada>(CLAVE_ADMIN) ?? {
    userId: leer("userId"),
    name: leer("name"),
    img: leer("img"),
    isAdmin: leer("isAdmin"),
  };
  const token = leer("token");

  // Limpieza a fondo: en el almacén quedan cosas de la sesión anterior (el último
  // recorrido visitado, por ejemplo) que si no se van se mezclarían con las de
  // esta persona y se vería lo que no es.
  cerrarSesionLocal();

  poner("token", token);
  poner("userId", user.id);
  poner("name", user.name);
  // Sin foto, la misma por defecto que pone el login normal: Home espera a que
  // `img` exista para pintar el mandala y, sin ella, se quedaría cargando siempre.
  poner("img", user.img || "/img/icono/noImg.webp");
  // `isAdmin` queda sin poner: dentro del camino de una persona la web es la de la
  // persona, con lo de María añadido (esMariaMirando), no el panel.
  try {
    localStorage.setItem(CLAVE_PERSONA, JSON.stringify(user));
    localStorage.setItem(CLAVE_ADMIN, JSON.stringify(mio));
  } catch { /* modo privado */ }

  return user;
}

/**
 * Cierra el camino de la persona y devuelve lo de María.
 *
 * `destino` es a dónde se vuelve; por defecto, la lista de Asesorías. Se navega
 * con `location.assign` (recarga entera) a propósito: así no queda en memoria ni
 * un dato de la otra persona.
 */
export function salirDeLaPersona(destino = "/admin/asesorias") {
  const mio = leerJson<SesionApartada>(CLAVE_ADMIN);
  const token = leer("token");
  cerrarSesionLocal();
  if (mio && token) {
    poner("token", token);
    poner("userId", mio.userId);
    poner("name", mio.name);
    poner("img", mio.img);
    poner("isAdmin", mio.isAdmin);
  }
  window.location.assign(mio && token ? destino : "/logIn");
}
