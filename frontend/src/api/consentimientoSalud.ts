// consentimientoSalud.ts — el consentimiento explícito para los datos de salud.
//
// El recorrido guarda datos de salud (art. 9 RGPD), y eso solo puede hacerse
// con un consentimiento EXPLÍCITO que además hay que poder DEMOSTRAR (art. 7.1).
// Antes la casilla del pago solo encendía el botón y no dejaba rastro; ahora se
// apunta en el servidor con su fecha.
//
// Se da en dos sitios: al marcar la casilla del pago (PagoDisciplinaModal) o,
// si alguien tiene disciplinas sin haber pasado por el pago (acceso regalado,
// cuentas de antes), en PuertaConsentimientoSalud al entrar al recorrido.
import axios from "axios";
import { API_URL } from "../GlobalVariables";
import { cacheDeOtraCuenta } from "./sesion";

// Una vez dado, no hay que volver a preguntar al servidor en esta visita.
let dado = false;

/** ¿Ya lo dio? `null` si no se ha podido saber (sin red, servidor caído…). */
export async function tieneConsentimientoSalud(): Promise<boolean | null> {
  if (cacheDeOtraCuenta("consentimientoSalud")) dado = false;
  if (dado) return true;
  try {
    const { data } = await axios.get<{ fecha: string | null }>(
      `${API_URL}/recorrido-progreso/consentimiento/salud`,
    );
    if (data?.fecha) dado = true;
    return !!data?.fecha;
  } catch {
    return null;
  }
}

/** Lo apunta en el servidor. Devuelve si quedó guardado. */
export async function darConsentimientoSalud(): Promise<boolean> {
  try {
    await axios.post(`${API_URL}/recorrido-progreso/consentimiento/salud`);
    cacheDeOtraCuenta("consentimientoSalud"); // apunta de quién es el «sí»
    dado = true;
    return true;
  } catch {
    return false;
  }
}
