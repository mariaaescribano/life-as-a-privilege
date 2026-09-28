// El foco de TECLADO de toda la web (header, menú, footer…): un aro blanco con
// el mismo glow que ya usa todo sobre el turquesa. Va en `_focusVisible` a
// propósito: solo se enciende al llegar con el tabulador, nunca al pulsar con
// el ratón o el dedo (la regla de «nada azul al pulsar» sigue en pie; el CSS
// global apaga el `outline`, así que sin esto el foco es invisible).
//
// Las pantallas de acceso (iniciar sesión, crear cuenta, recuperar) tienen su
// propio foco AZUL —`focoAzul`, en CampoContrasena— porque allí hay varios
// campos iguales y en blanco no se distinguía cuál estaba activo.
// Con `outline` y NO con box-shadow, a propósito: muchos botones animan sus
// sombras con `transition`, y pasar de una lista de sombras a otra de distinto
// largo hace que el navegador rellene con sombras transparentes (= negro con
// alfa 0): el aro cruzaba por un tono casi negro un instante. El outline no es
// una sombra: aparece nítido al momento y no se mezcla con los glows.
export const focoBlanco = {
  outline: "2px solid rgba(255,255,255,0.85)",
  outlineOffset: "2px",
} as const;
