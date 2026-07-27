// ─────────────────────────────────────────────────────────────────────────
// Glow común a TODO el recorrido de Cábala.
//
// Regla: ningún box del recorrido lleva sombra oscura (`0 4px 20px rgba(0,0,0,…)`
// y compañía). Todos llevan EXACTAMENTE el mismo halo que el header
// (MetodoStepHeader con fondo de disciplina), para que el header y las cajas de
// contenido se vean como piezas del mismo material.
//
// Importa estos presets y úsalos en `boxShadow`. No redefinas el glow en cada
// página: si hay que retocarlo, se retoca aquí y cambia todo el recorrido.
// ─────────────────────────────────────────────────────────────────────────

import { cabalaTxt } from "../../GlobalVariables";

/** Halo del header (MetodoStepHeader, rama `useDiscBg`). Es la referencia. */
export const CAJA_GLOW = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 20px ${cabalaTxt}1a, 0 0 48px ${cabalaTxt}10`;

/** Mismo halo, con el ámbar algo más presente: para la caja destacada de una
 *  página (resultado del diagnóstico, sefirá protagonista…). Sigue sin sombra. */
export const CAJA_GLOW_FUERTE = `0 0 16px rgba(255,255,255,0.16), 0 0 34px rgba(255,255,255,0.08), 0 0 60px rgba(180,255,245,0.09), 0 0 26px ${cabalaTxt}33, 0 0 58px ${cabalaTxt}1f`;

/** Halo del mismo material para hover de tarjetas pinchables. Sin sombra. */
export const CAJA_GLOW_HOVER = `0 0 20px rgba(255,255,255,0.24), 0 0 40px rgba(255,255,255,0.12), 0 0 70px rgba(180,255,245,0.12), 0 0 32px ${cabalaTxt}44, 0 0 66px ${cabalaTxt}26`;
