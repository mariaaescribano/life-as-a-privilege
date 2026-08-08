/**
 * Landing de bienvenida (`/`) — los proyectos que viven en esta web.
 *
 * ÚNICO sitio donde tocar para añadir, renombrar, recolorear, poner logo o
 * activar un proyecto: `app/web/Landing.tsx` se pinta entera a partir de este
 * array.
 *
 * Para ENCENDER un proyecto que está en «Muy pronto»: pon `disponible: true`.
 * El botón deja de estar apagado y empieza a navegar a su `ruta` (que tendrás
 * que dar de alta en App.tsx). No hay que tocar nada más.
 */
import type { ClaveTexto } from "../i18n";

// ── Paleta de la landing ─────────────────────────────────────────────────────
// Arena cálida: es "el recibidor" de la casa, deliberadamente NEUTRAL. No es de
// ningún proyecto, así que ni el turquesa de Vida como Privilegio ni la terracota
// de Nace una madre se pelean con el fondo — al revés, son las dos únicas
// manchas de color de la página.
//
// OJO: esta es la única página de la web con fondo claro. El resto va sobre
// turquesa (#008080) y da por hecho letra blanca; de ahí que aquí haya que pedir
// explícitamente `fondo="claro"` a los componentes compartidos (SelectorIdioma,
// CreadoraCard).
export const arenaBg = "#F2EAE0";
/** Letra principal: tinta cálida, no negro puro (sobre crema el negro corta). */
export const arenaTinta = "#2A2622";
/** Letra secundaria (frases de apoyo, línea legal). */
export const arenaTintaSuave = "#6B6055";
/** Filetes y separadores — hex-alpha, nunca rgba() (se rompe en bgGradient). */
export const arenaLinea = "#2A262222";

/** Alto reservado para el logo de cada caja. Fijo A PROPÓSITO: así los dos
 *  títulos quedan a la misma altura aunque un proyecto todavía no tenga logo. */
export const ALTO_LOGO = { base: "56px", md: "68px", lg: "76px" } as const;

export type ProyectoLanding = {
  /** Clave interna, no se muestra. */
  key: string;
  /**
   * Nombre del proyecto — SÍ se traduce: en español «Vida como Privilegio», en
   * inglés «Life as a Privilege». Es lo que se lee en la caja, no un nombre
   * interno de los que viajan en las URLs.
   */
  nombreKey: ClaveTexto;
  /** Color de la caja del proyecto. */
  bg: string;
  /** Color de la letra DENTRO de la caja. */
  txt: string;
  /**
   * Logo del proyecto, arriba de su caja. Tiene que ser un PNG/SVG CLARO: se
   * pinta sobre el color del proyecto, que es oscuro. Sin logo, el hueco se
   * queda reservado (ALTO_LOGO) y los dos títulos siguen alineados.
   */
  logo?: string;
  /** Frase corta bajo el nombre. */
  lemaKey: ClaveTexto;
  /** Qué es el proyecto, en dos o tres líneas. */
  descKey: ClaveTexto;
  /** A dónde lleva la caja cuando está disponible. */
  ruta: string;
  /** false → caja apagada, rótulo «Muy pronto», no navega. */
  disponible: boolean;
};

export const PROYECTOS: ProyectoLanding[] = [
  {
    key: "lifeasaprivilege",
    nombreKey: "landing.nombre.laap",
    bg: "#008080",
    txt: "#F3FBF9",
    // El mandala es el logo de ESTE proyecto (no de la casa): por eso vive
    // dentro de su caja y ya no en la cabecera de la landing.
    logo: "/img/icono/life.png",
    lemaKey: "landing.lema.laap",
    descKey: "landing.desc.laap",
    // La portada de siempre sigue en /welcome, tal cual estaba.
    ruta: "/welcome",
    disponible: true,
  },
  {
    key: "naceUnaMadre",
    nombreKey: "landing.nombre.naceUnaMadre",
    // Terracota: complementario del turquesa (uno frío, otro cálido), así que
    // las dos cajas se distinguen de un vistazo sin vibrar la una contra la otra.
    bg: "#A9584A",
    txt: "#FCEFE7",
    // PENDIENTE: María pasará el logo de este proyecto. Cuando llegue, se guarda
    // en /public/img/icono/ y se pone aquí su ruta — el hueco ya está reservado.
    logo: undefined,
    lemaKey: "landing.lema.naceUnaMadre",
    descKey: "landing.desc.naceUnaMadre",
    ruta: "/naceUnaMadre",
    // Todavía no existe la página: la caja sale apagada con «Muy pronto».
    disponible: false,
  },
];
