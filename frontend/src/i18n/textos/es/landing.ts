/**
 * Landing de bienvenida (`/`) — Landing.tsx.
 *
 * La página de entrada a la casa: elige proyecto. El NOMBRE de cada proyecto
 * también se traduce («El Mapa» / «The Map»), para que no haya dudas de en qué
 * idioma estás.
 *
 * Al tocar una frase, acuérdate de tocar también su versión inglesa en
 * `../en/landing.ts`.
 */
export const landing = {
  // ── Marca (lo primero de la página) ────────────────────────────────────
  // El nombre de la CASA, no el de un proyecto: no se traduce, se pinta igual
  // en los dos idiomas (la página lo pone en mayúsculas). Debajo, la frase que
  // resume las dos cosas que se hacen aquí.
  "landing.marca": "Life as a Privilege",
  "landing.marca.lema": "Entenderte es la primera forma de cuidarte.",

  // ── Intro (cabecera) ───────────────────────────────────────────────────
  // Las dos se pueden dejar en "" y la landing no pinta nada en su lugar (sin
  // hueco muerto). Aquí NO va ningún símbolo: el mandala es de El Mapa.
  // El título va vacío desde que arriba está la marca: dos titulares seguidos
  // se quitaban fuerza el uno al otro.
  "landing.intro.titulo": "",
  "landing.intro.sub":
    "Conocerte por dentro, y acompañarte cuando la vida te cambia de sitio. Elige por dónde quieres entrar.",

  "landing.entrar": "Entrar",
  // Nace una madre todavía no existe: su caja va bloqueada con este rótulo.
  "landing.muyPronto": "Próximamente",

  // ── Desde dónde miro (las ocho disciplinas) ────────────────────────────
  // Encuadradas como TU formación, no como el contenido de El Mapa: si se leen
  // como «lo que hay dentro de El Mapa», la página se inclina hacia un proyecto
  // y Nace una madre queda en desventaja.
  "landing.mirada.titulo": "Desde dónde miro",
  "landing.mirada.sub":
    "Las ocho disciplinas que estudio y desde las que trabajo. De esta misma mirada nacen los dos proyectos.",

  // ── Cierre (los dos botones otra vez) ──────────────────────────────────
  "landing.cierre": "¿Por dónde quieres empezar?",

  // El pie de la landing NO puede firmar como «Life as a Privilege»: aquí la
  // casa aloja dos proyectos, así que firma la persona (`footer.derechos`, el
  // del resto de la web, sí lleva el nombre del proyecto).
  "landing.derechos": "© 2026 María Escribano · Todos los derechos reservados",

  // ── El Mapa ────────────────────────────────────────────────────────────
  // El nombre se pinta en mayúsculas (igual que en la portada del proyecto),
  // así que aquí va escrito normal: de las mayúsculas se encarga el diseño.
  "landing.nombre.elMapa": "El Mapa",
  "landing.lema.elMapa": "El dolor es inevitable, el sufrimiento es opcional. Dale un sentido a tu Vida.",
  "landing.desc.elMapa":
    "Viaje interactivo a través de 8 disciplinas para comprender tu mente, tu cuerpo y tu historia.",

  // ── Nace una madre ─────────────────────────────────────────────────────
  // BORRADOR: escrito a partir del título, para que la caja no salga vacía.
  // Reescríbelo con tus palabras cuando tengas claro el proyecto.
  "landing.nombre.naceUnaMadre": "Nace una madre",
  "landing.lema.naceUnaMadre": "Cuando nace un hijo, nace una madre.",
  "landing.desc.naceUnaMadre":
    "El otro nacimiento, el que casi nunca se cuenta: el de la mujer que se convierte en madre. Un acompañamiento para el cuerpo, la mente y la identidad que también cambian.",
} as const;
