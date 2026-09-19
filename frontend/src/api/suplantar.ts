// ─────────────────────────────────────────────────────────────────────────────
// ENTRAR COMO otra persona (solo administración)
//
// Desde el panel se pide al servidor un token de esa cuenta (POST
// /user/admin/suplantar) y se guarda en el navegador como si acabara de iniciar
// sesión ella. A partir de ahí la web es LA SUYA: sus disciplinas, por dónde va,
// lo que ha escrito. No hay un «modo espía» aparte, porque eso obligaría a
// duplicar cada página del recorrido.
//
// Lo que NO cambia: la persona no se entera de nada. Todo esto pasa en el
// navegador de la admin; en el suyo no aparece ningún aviso, ni le echa de su
// sesión, ni le llega un correo.
//
// Lo que SÍ deja claro: en la pantalla de la admin hay una barra fija abajo
// (BarraSuplantacion) diciendo en la cuenta de quién está, porque lo que se
// escriba mientras tanto se guarda en el recorrido de esa persona.
//
// La sesión de admin no se pierde: se guarda entera en `suplantacionAdmin` y se
// devuelve tal cual al salir.
// ─────────────────────────────────────────────────────────────────────────────
import axios from "axios";
import { API_URL } from "../GlobalVariables";
import { cerrarSesionLocal } from "./sesion";

/** A quién estoy mirando ahora mismo (si es que estoy mirando a alguien). */
const CLAVE_SUPLANTACION = "suplantacion";
/** La sesión de admin aparcada, para devolverla al salir. */
const CLAVE_ADMIN = "suplantacionAdmin";

export interface UsuarioSuplantado {
  id: string;
  name: string;
  email: string;
  img?: string | null;
}

interface SesionGuardada {
  token: string | null;
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

/** La cuenta en la que estoy metida, o null si estoy en la mía. */
export function suplantacionActiva(): UsuarioSuplantado | null {
  const dato = leerJson<UsuarioSuplantado>(CLAVE_SUPLANTACION);
  return dato?.id ? dato : null;
}

/** Guarda en el navegador la sesión que hay ahora (la de admin). */
function sesionActual(): SesionGuardada {
  const lee = (k: string) => {
    try { return localStorage.getItem(k); } catch { return null; }
  };
  return {
    token: lee("token"),
    userId: lee("userId"),
    name: lee("name"),
    img: lee("img"),
    isAdmin: lee("isAdmin"),
  };
}

function escribirSesion(s: SesionGuardada) {
  const pon = (k: string, v: string | null) => {
    try { if (v !== null) localStorage.setItem(k, v); } catch { /* modo privado */ }
  };
  pon("token", s.token);
  pon("userId", s.userId);
  pon("name", s.name);
  pon("img", s.img);
  pon("isAdmin", s.isAdmin);
}

/**
 * Pide el token de esa persona y entra en su cuenta. Devuelve sus datos.
 *
 * Se llama ANTES de tocar el almacén: la petición viaja con el token de admin,
 * que es el único que el servidor acepta aquí.
 */
export async function entrarComo(userId: string): Promise<UsuarioSuplantado> {
  const res = await axios.post<{ token: string; user: UsuarioSuplantado }>(
    `${API_URL}/user/admin/suplantar`,
    { userId },
    { headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` } },
  );
  const { token, user } = res.data;

  // La sesión de admin se aparta ANTES de limpiar, o se perdería con el resto.
  const admin = sesionActual();

  // Limpieza a fondo: en el almacén quedan cosas de la sesión anterior (el
  // último recorrido visitado, por ejemplo) que si no se van se mezclarían con
  // las de esta persona y se vería lo que no es.
  cerrarSesionLocal();

  escribirSesion({ token, userId: user.id, name: user.name, img: user.img ?? null, isAdmin: null });
  try {
    localStorage.setItem(CLAVE_SUPLANTACION, JSON.stringify(user));
    localStorage.setItem(CLAVE_ADMIN, JSON.stringify(admin));
  } catch { /* modo privado */ }

  return user;
}

/**
 * Sale de la cuenta prestada y devuelve la sesión de admin.
 *
 * `destino` es a dónde se vuelve; por defecto, la lista de usuarios. Se navega
 * con `location.assign` (recarga entera) a propósito: así no queda en memoria
 * ni un dato de la otra cuenta.
 */
export function salirDeLaSuplantacion(destino = "/admin/usuarios") {
  const admin = leerJson<SesionGuardada>(CLAVE_ADMIN);
  cerrarSesionLocal();
  if (admin?.token) escribirSesion(admin);
  window.location.assign(admin?.token ? destino : "/logIn");
}
