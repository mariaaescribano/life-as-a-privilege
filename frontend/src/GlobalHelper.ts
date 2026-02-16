import type { SuccessErrorMessageDto } from "./components/global/SuccessErrorMessage";

export const gestionaError = (err: any): SuccessErrorMessageDto => {
  const error: SuccessErrorMessageDto = {
    soy: 2,
    title: "Error",
    description: err.response?.status === 500 
      ? "Inténtalo de nuevo más tarde"
      : err.response?.data?.message || "Error desconocido"
  };
  return error;
};
