// ─────────────────────────────────────────────────────────────────────────────
// DIARIO DE SESIONES — las notas que María escribe tras una sesión y que la
// persona lee en /diario.
//
// No confundir con `notas` (el mini-diario que escribe el propio usuario dentro
// del recorrido, en /metodo/...): aquello lo escribe él, esto se lo escriben.
//
// Dos caras del mismo recurso:
//   · listarMias()  → lo que lee la persona. Solo entradas publicadas.
//   · listarDe()    → lo que ve la admin. Todo, borradores incluidos.
// ─────────────────────────────────────────────────────────────────────────────
import axios from "axios";
import { API_URL } from "../GlobalVariables";

export interface EntradaDiario {
  id: string;
  user_id: string;
  /** Fecha de la SESIÓN (`2026-09-18`), no la de escritura. */
  fecha: string;
  /** key de disciplina, o null si la sesión no fue de ninguna. */
  disciplina: string | null;
  titulo: string | null;
  contenido: string;
  /** El «por qué te digo esto». Va en su propio bloque. */
  porque: string | null;
  publicada: boolean;
  /** null = la persona aún no la ha abierto. */
  leida_at: string | null;
  created_at: string;
  updated_at: string;
}

/** Lo que se manda al crear o editar. Todo opcional salvo el contenido al crear. */
export interface EntradaInput {
  fecha?: string;
  disciplina?: string | null;
  titulo?: string | null;
  contenido?: string;
  porque?: string | null;
  publicada?: boolean;
}

const auth = () => ({
  Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
});

/** Blinda lo que llega del servidor: una forma antigua no puede tumbar el render. */
const saneada = (e: any): EntradaDiario | null => {
  if (!e || typeof e !== "object" || typeof e.contenido !== "string") return null;
  return {
    id: String(e.id ?? ""),
    user_id: String(e.user_id ?? ""),
    fecha: typeof e.fecha === "string" ? e.fecha : "",
    disciplina: typeof e.disciplina === "string" ? e.disciplina : null,
    titulo: typeof e.titulo === "string" ? e.titulo : null,
    contenido: e.contenido,
    porque: typeof e.porque === "string" ? e.porque : null,
    publicada: e.publicada === true,
    leida_at: typeof e.leida_at === "string" ? e.leida_at : null,
    created_at: typeof e.created_at === "string" ? e.created_at : "",
    updated_at: typeof e.updated_at === "string" ? e.updated_at : "",
  };
};

const lista = (data: any): EntradaDiario[] =>
  (Array.isArray(data) ? data : []).map(saneada).filter((e): e is EntradaDiario => e !== null);

// ── LA PERSONA ───────────────────────────────────────────────────────────────

/** Las entradas publicadas de la sesión abierta. */
export async function listarMias(): Promise<EntradaDiario[]> {
  const userId = localStorage.getItem("userId");
  if (!userId) return [];
  try {
    const res = await axios.get(`${API_URL}/diario/${userId}`, { headers: auth() });
    return lista(res.data);
  } catch {
    // Sin diario no se pinta nada: mejor nada que una caja rota.
    return [];
  }
}

/** Apaga la marca de «nuevo». Si falla, da igual: se reintenta al volver a entrar. */
export async function marcarLeidas(): Promise<void> {
  const userId = localStorage.getItem("userId");
  if (!userId) return;
  try {
    await axios.patch(`${API_URL}/diario/${userId}/leidas`, {}, { headers: auth() });
  } catch {
    /* silencioso */
  }
}

// ── LA ADMIN ─────────────────────────────────────────────────────────────────

/** Todas las entradas de una persona, borradores incluidos. */
export async function listarDe(userId: string): Promise<EntradaDiario[]> {
  const res = await axios.get(`${API_URL}/diario/admin/${userId}`, { headers: auth() });
  return lista(res.data);
}

export async function crearEntrada(userId: string, entrada: EntradaInput) {
  const res = await axios.post(`${API_URL}/diario/admin/${userId}`, entrada, { headers: auth() });
  return res.data as { success: boolean; error?: string; entrada?: EntradaDiario };
}

export async function actualizarEntrada(userId: string, entradaId: string, entrada: EntradaInput) {
  const res = await axios.patch(`${API_URL}/diario/admin/${userId}/${entradaId}`, entrada, {
    headers: auth(),
  });
  return res.data as { success: boolean; error?: string; entrada?: EntradaDiario };
}

export async function borrarEntrada(userId: string, entradaId: string) {
  const res = await axios.delete(`${API_URL}/diario/admin/${userId}/${entradaId}`, {
    headers: auth(),
  });
  return res.data as { success: boolean };
}
