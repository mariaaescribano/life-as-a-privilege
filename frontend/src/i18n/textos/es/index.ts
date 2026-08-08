import { aprendizaje } from "./aprendizaje";
import { auth } from "./auth";
import { comun } from "./comun";
import { contacto } from "./contacto";
import { disciplinas } from "./disciplinas";
import { elMetodo } from "./elMetodo";
import { espacio } from "./espacio";
import { header } from "./header";
import { home } from "./home";
import { landing } from "./landing";
import { metodo } from "./metodo";
import { footer } from "./footer";
import { opiniones } from "./opiniones";
import { presentacion } from "./presentacion";
import { quienSoy } from "./quienSoy";
import { tienda } from "./tienda";
import { web } from "./web";
import { welcome } from "./welcome";

/**
 * Diccionario ESPAÑOL — el idioma original y la fuente de verdad.
 *
 * Define TODAS las claves; el resto de idiomas solo traducen las que tengan.
 * Al añadir un módulo nuevo hay que añadirlo aquí y en `../en/index.ts`.
 */
export const es = {
  ...aprendizaje,
  ...auth,
  ...comun,
  ...contacto,
  ...disciplinas,
  ...elMetodo,
  ...espacio,
  ...header,
  ...home,
  ...landing,
  ...metodo,
  ...footer,
  ...opiniones,
  ...presentacion,
  ...quienSoy,
  ...tienda,
  ...web,
  ...welcome,
};

/** Todas las claves de texto válidas. El inglés no puede inventarse ninguna. */
export type ClaveTexto = keyof typeof es;
