import type { SuccessErrorMessageDto } from "./components/global/SuccessErrorMessage";
import { traducir } from "./i18n";

// OJO: `err.response.data.message` es el texto que manda el backend, y viene
// SIEMPRE en español. Aquí solo se traduce lo que ponemos nosotros; traducir los
// mensajes del servidor es trabajo del backend.
export const gestionaError = (err: any): SuccessErrorMessageDto => {
  const error: SuccessErrorMessageDto = {
    soy: 2,
    title: traducir("auth.error.generico"),
    description: err.response?.status === 500
      ? traducir("auth.error.masTarde")
      : err.response?.data?.message || traducir("auth.error.desconocido")
  };
  return error;
};

