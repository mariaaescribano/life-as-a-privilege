import { aprendizaje } from "./aprendizaje";
import { auth } from "./auth";
import { comun } from "./comun";
import { contacto } from "./contacto";
import { diario } from "./diario";
import { disciplinas } from "./disciplinas";
import { elMetodo } from "./elMetodo";
import { espacio } from "./espacio";
import { fisiologia } from "./fisiologia";
import { header } from "./header";
import { home } from "./home";
import { landing } from "./landing";
import { footer } from "./footer";
import { opiniones } from "./opiniones";
import { presentacion } from "./presentacion";
import { quienSoy } from "./quienSoy";
import { tienda } from "./tienda";
import { web } from "./web";
import { welcome } from "./welcome";

/**
 * Los textos del RECORRIDO (`metodo.*`) no se importan aquí: son 1.035 claves,
 * ~100 KB, y solo hacen falta dentro de /metodo y en las páginas que usan sus
 * componentes (la galería de ilustraciones, el mandala de /home…). Estando
 * aquí viajaban en el paquete de ENTRADA, que descarga TODO el mundo en TODAS
 * las páginas. Ahora son un archivo aparte que se pide en paralelo con la
 * página que lo necesita — ver `lazyConMetodo` en App.tsx.
 *
 * Del TIPO sí forman parte: `ClaveTexto` las sigue incluyendo, así que el
 * compilador sigue avisando de una clave mal escrita y el inglés no puede
 * inventarse ninguna.
 */
type TextosMetodo = typeof import("./metodo")["metodo"];

/**
 * Diccionario ESPAÑOL — el idioma original y la fuente de verdad.
 *
 * Define TODAS las claves; el resto de idiomas solo traducen las que tengan.
 * Al añadir un módulo nuevo hay que añadirlo aquí y en `../en/index.ts`.
 */
const TEXTOS_BASE = {
  ...aprendizaje,
  ...auth,
  ...comun,
  ...contacto,
  ...diario,
  ...disciplinas,
  ...elMetodo,
  ...espacio,
  ...fisiologia,
  ...header,
  ...home,
  ...landing,
  ...footer,
  ...opiniones,
  ...presentacion,
  ...quienSoy,
  ...tienda,
  ...web,
  ...welcome,
};

/** Todas las claves de texto válidas. El inglés no puede inventarse ninguna. */
export type ClaveTexto = keyof typeof TEXTOS_BASE | keyof TextosMetodo;

/**
 * El diccionario español vivo. Arranca con todo menos el recorrido, y
 * `registrarTextos()` (en IdiomaProvider) le añade los textos de `metodo.*`
 * cuando llega su archivo. Por eso es `Partial`: hay un instante —antes de que
 * la página del recorrido se pinte— en el que esas claves aún no están.
 */
export const es: Partial<Record<ClaveTexto, string>> = { ...TEXTOS_BASE };
