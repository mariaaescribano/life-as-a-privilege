// ─────────────────────────────────────────────────────────────────────────
// RESULTADO DEL TEST DES-II (desconexión) · su tabla en la BD
//
// Las RESPUESTAS del test se guardan con el resto del recorrido, en el blob
// `data` de `metodo_psicologia`. El RESULTADO va a su propia tabla
// (`psicologia_des`), igual que el del test de Ayurveda o el de Medicina China:
// es un dato con fecha que se quiere poder consultar y comparar sin abrir el
// blob de cada persona.
//
// Lo escriben dos sitios (por eso vive aquí y no dentro de una página):
//   · la página del test, cada vez que el resultado cambia;
//   · la página del resultado, si al llegar no cuadra con lo respondido
//     (un test terminado antes de que esta tabla existiera).
//
// Nunca revienta hacia arriba: si falla, las respuestas siguen guardadas y el
// resultado se vuelve a escribir la próxima vez que se vea la página. La cifra
// que ve la persona se calcula siempre de sus respuestas, no de esta tabla.
// ─────────────────────────────────────────────────────────────────────────
import axios from "axios";
import { API_URL } from "../GlobalVariables";
import type { DesResultado } from "../components/metodo/psicologiaRecorrido";

/** La fila tal y como vuelve de la tabla (columnas, no camelCase). */
export interface DesResultadoFila {
  user_id: string;
  score: number;
  banda: string;
  amnesia: number;
  despersonalizacion: number;
  absorcion: number;
  alto: boolean;
  fecha: string;
  updated_at: string;
}

/** Guarda (upsert) el resultado. `true` si la BD lo aceptó. */
export async function guardarDesResultado(resultado: DesResultado): Promise<boolean> {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  if (!userId || !token) return false;
  try {
    const r = await axios.put(
      `${API_URL}/metodo-psicologia/${userId}/des`,
      resultado,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return r.data?.success !== false;
  } catch {
    return false;
  }
}

/** El resultado guardado, o null si esta persona no ha hecho el test. */
export async function leerDesResultado(): Promise<DesResultadoFila | null> {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  if (!userId || !token) return null;
  try {
    const r = await axios.get(
      `${API_URL}/metodo-psicologia/${userId}/des`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return (r.data as DesResultadoFila) ?? null;
  } catch {
    return null;
  }
}
