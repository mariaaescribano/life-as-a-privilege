/* ─────────────────────────────────────────────────────────────────────────────
 *  API del ESTUDIO ESTADÍSTICO SOBRE ASTROLOGÍA
 *
 *  Todo es público (no hace falta cuenta): quien participa se identifica con su
 *  email y, en el navegador, con el id que devuelve el alta. Ese id se guarda en
 *  localStorage para que pueda cerrar la pestaña y seguir donde lo dejó.
 * ───────────────────────────────────────────────────────────────────────────── */

import axios from "axios";
import { API_URL } from "../GlobalVariables";

/** Clave de localStorage con el id del participante (su "sesión" del estudio). */
export const ESTUDIO_ID_KEY = "estudioParticipanteId";

export const getEstudioId = (): string | null => {
  try { return localStorage.getItem(ESTUDIO_ID_KEY); } catch { return null; }
};

export const setEstudioId = (id: string): void => {
  try { localStorage.setItem(ESTUDIO_ID_KEY, id); } catch { /* modo privado */ }
};

export interface DatosEstudio {
  email: string;
  fecha_nacimiento: string; // YYYY-MM-DD
  hora_nacimiento: string;  // HH:MM
  pais: string;
  region: string;
  lugar: string;
  userId?: string | null;
}

/** Los dos ejes de cada arquetipo: el signo en que está y la casa en que cae. */
export type Eje = "signo" | "casa";

export interface RespuestaEstudio {
  planeta: string;
  eje: Eje;
  posicion: string;
  preguntaId: string;
  respuesta: boolean;
}

export interface ParticipanteEstudio {
  id: string;
  email: string;
  /** { sol: "Aries", luna: "Tauro", ascendente: "Leo", … } */
  signos: Record<string, string>;
  /** { sol: 5, luna: 11, … } — el Ascendente no tiene casa. */
  casas: Record<string, number>;
  respuestas: RespuestaEstudio[];
  /** Lo que escribió en el formulario, para prerrellenárselo si vuelve. */
  datos: {
    fecha_nacimiento: string;
    hora_nacimiento: string;
    pais: string;
    region: string;
    lugar: string;
  };
}

export interface ItemEstadistica {
  planeta: string;
  eje: Eje;
  posicion: string;
  preguntaId: string;
  respuesta: boolean;
  total: number;
  si: number;
  porcentajeSi: number;
}

export interface EstadisticasEstudio {
  participante: ParticipanteEstudio;
  items: ItemEstadistica[];
  participantesTotales: number;
}

/** Alta (o corrección) de participante: calcula su carta y devuelve sus signos. */
export async function guardarParticipante(datos: DatosEstudio): Promise<ParticipanteEstudio> {
  const res = await axios.post<ParticipanteEstudio>(`${API_URL}/estudio/participante`, datos);
  if (res.data?.id) setEstudioId(res.data.id);
  return res.data;
}

/** Sus signos + lo que ya haya respondido, para no volver a preguntárselo. */
export async function getParticipante(id: string): Promise<ParticipanteEstudio> {
  const res = await axios.get<ParticipanteEstudio>(`${API_URL}/estudio/participante/${id}`);
  return res.data;
}

/** Una respuesta Sí/No. Se guarda al momento: es el dato del estudio. La
 *  posición (signo o casa) la pone el servidor leyendo la carta guardada. */
export async function guardarRespuesta(
  participanteId: string,
  planeta: string,
  eje: Eje,
  preguntaId: string,
  respuesta: boolean,
): Promise<void> {
  await axios.post(`${API_URL}/estudio/respuesta`, {
    participanteId, planeta, eje, preguntaId, respuesta,
  });
}

export async function getEstadisticas(id: string): Promise<EstadisticasEstudio> {
  const res = await axios.get<EstadisticasEstudio>(`${API_URL}/estudio/estadisticas/${id}`);
  return res.data;
}

/** Mensaje legible de un error de axios (el backend manda `message`). */
export function mensajeError(err: unknown, porDefecto: string): string {
  const e = err as { response?: { data?: { message?: string | string[] } } };
  const msg = e?.response?.data?.message;
  if (Array.isArray(msg)) return msg[0] ?? porDefecto;
  return msg ?? porDefecto;
}
