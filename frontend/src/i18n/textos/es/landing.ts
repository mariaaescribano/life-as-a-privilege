/**
 * Landing de bienvenida (`/`) — Landing.tsx.
 *
 * La página de entrada a la casa: elige proyecto. El NOMBRE de cada proyecto
 * también se traduce (aquí «Vida como Privilegio», en inglés «Life as a
 * Privilege»), para que no haya dudas de en qué idioma estás.
 *
 * Al tocar una frase, acuérdate de tocar también su versión inglesa en
 * `../en/landing.ts`.
 */
export const landing = {
  // Frase de orientación de la cabecera. Si la quieres quitar, déjala en "" y
  // la landing no pinta nada en su lugar (no deja hueco muerto).
  "landing.intro": "Dos proyectos, una misma mirada. Elige por dónde quieres entrar.",
  "landing.entrar": "Entrar",
  "landing.muyPronto": "Muy pronto",
  // El pie de la landing NO puede firmar como «Life as a Privilege»: aquí la
  // casa aloja dos proyectos, así que firma la persona (`footer.derechos`, el
  // del resto de la web, sí lleva el nombre del proyecto).
  "landing.derechos": "© 2026 María Escribano · Todos los derechos reservados",

  // ── Vida como Privilegio ───────────────────────────────────────────────
  // El nombre se pinta en mayúsculas (igual que en la portada del proyecto),
  // así que aquí va escrito normal: de las mayúsculas se encarga el diseño.
  "landing.nombre.laap": "Vida como Privilegio",
  "landing.lema.laap": "Conócete para poder cuidarte.",
  "landing.desc.laap":
    "Un mapa de ocho disciplinas —astrología, psicología, ayurveda, medicina china, fisiología, nutrición, cábala e historia— para entender cómo funcionas y dejar de pelearte contigo.",

  // ── Nace una madre ─────────────────────────────────────────────────────
  // BORRADOR: escrito a partir del título, para que la caja no salga vacía.
  // Reescríbelo con tus palabras cuando tengas claro el proyecto.
  "landing.nombre.naceUnaMadre": "Nace una madre",
  "landing.lema.naceUnaMadre": "Cuando nace un hijo, nace una madre.",
  "landing.desc.naceUnaMadre":
    "El otro nacimiento, el que casi nunca se cuenta: el de la mujer que se convierte en madre. Un acompañamiento para el cuerpo, la mente y la identidad que también cambian.",
} as const;
