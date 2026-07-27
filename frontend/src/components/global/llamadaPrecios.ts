// Tipos de llamada y su precio. OJO: esto es SOLO para lo que se muestra en
// pantalla. El importe que se cobra lo decide el backend
// (backend/src/payment/llamadas-pago.data.ts) a partir del `tipo` que se le
// manda — el frontend ya no envía euros. Si cambias un precio, cámbialo en LOS
// DOS sitios o la web enseñará una cifra y Stripe cobrará otra.
export type LlamadaTipo = "estandar" | "compania";

export const PRECIO_LLAMADA: Record<LlamadaTipo, number> = {
  estandar: 20,
  compania: 60,
};
