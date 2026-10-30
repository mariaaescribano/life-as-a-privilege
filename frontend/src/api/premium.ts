import axios from "axios";
import { API_URL } from "../GlobalVariables";

/**
 * Abre el pago de un mes de contenido premium (5 €) en Stripe. Con sesión iniciada es una
 * renovación (el pago queda ligado a la cuenta); sin ella, se paga primero y la cuenta se
 * crea al volver. El token lo adjunta el interceptor global (api/axiosSetup.ts).
 */
export async function abrirPagoPremium(): Promise<void> {
  let conSesion = false;
  try { conSesion = !!localStorage.getItem("userId"); } catch { /* modo privado */ }

  let url: string | undefined;
  if (conSesion) {
    try {
      url = (await axios.post(`${API_URL}/premium/renovar`)).data?.url;
    } catch (err: any) {
      // Sesión caducada: se paga como quien aún no tiene cuenta.
      if (err?.response?.status !== 401 && err?.response?.status !== 403) throw err;
    }
  }
  if (!url) url = (await axios.post(`${API_URL}/premium/checkout`)).data?.url;
  if (!url) throw new Error("Sin URL de pago");
  window.location.href = url;
}
