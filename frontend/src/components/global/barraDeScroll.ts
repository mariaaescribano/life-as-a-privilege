// ─────────────────────────────────────────────────────────────────────────────
//  UNA BARRA DE SCROLL QUE SE VE, TAMBIÉN EN EL MÓVIL
//
//  En táctil el navegador usa barras «overlay»: no ocupan sitio y solo asoman
//  mientras se arrastra el dedo. En los menús de las galerías de Ilustraciones
//  eso se leía como que ahí terminaba todo: nada decía que por debajo seguía
//  habiendo capítulos.
//
//  Declarar `::-webkit-scrollbar` con un ancho concreto obliga al navegador a
//  pintar una barra CLÁSICA (permanente, con su hueco) también en el móvil. Se
//  combina con `overflowY="scroll"` —no `auto`— para que el carril esté siempre
//  puesto y no aparezca y desaparezca al cambiar de vista.
//
//  El carril va TRANSPARENTE (se ve la foto de la disciplina detrás) y el pulgar
//  del color que se le pase, que es el de la letra de esa disciplina.
// ─────────────────────────────────────────────────────────────────────────────

/** Estilo de barra vertical visible, del color de la disciplina. */
export const barraVisibleSx = (color: string) => ({
  "&::-webkit-scrollbar": { width: "8px", background: "transparent" },
  "&::-webkit-scrollbar-track": { background: "transparent" },
  "&::-webkit-scrollbar-thumb": { background: `${color}88`, borderRadius: "4px" },
  "&::-webkit-scrollbar-thumb:hover": { background: `${color}cc` },
  scrollbarWidth: "thin" as const,
  scrollbarColor: `${color}88 transparent`,
});
