import type { ClaveTexto } from "../es";
import { aprendizaje } from "./aprendizaje";
import { asesoria } from "./asesoria";
import { auth } from "./auth";
import { comun } from "./comun";
import { contacto } from "./contacto";
import { diario } from "./diario";
import { disciplinas } from "./disciplinas";
import { disciplinasPagina } from "./disciplinasPagina";
import { elMetodo } from "./elMetodo";
import { espacio } from "./espacio";
import { fisiologia } from "./fisiologia";
import { header } from "./header";
import { home } from "./home";
import { landing } from "./landing";
import { metodo } from "./metodo";
import { footer } from "./footer";
import { opiniones } from "./opiniones";
import { premium } from "./premium";
import { presentacion } from "./presentacion";
import { quienSoy } from "./quienSoy";
import { tienda } from "./tienda";
import { web } from "./web";
import { welcome } from "./welcome";

/**
 * Diccionario INGLÉS — idioma secundario, puede estar incompleto.
 *
 * Lo que falte se muestra en español (respaldo automático). El tipo
 * `Partial<Record<ClaveTexto, string>>` impide inventarse claves que no
 * existan en español: si el español cambia una clave, aquí salta el compilador.
 */
export const en: Partial<Record<ClaveTexto, string>> = {
  ...aprendizaje,
  ...asesoria,
  ...auth,
  ...comun,
  ...contacto,
  ...diario,
  ...disciplinas,
  ...disciplinasPagina,
  ...elMetodo,
  ...espacio,
  ...fisiologia,
  ...header,
  ...home,
  ...landing,
  ...metodo,
  ...footer,
  ...opiniones,
  ...premium,
  ...presentacion,
  ...quienSoy,
  ...tienda,
  ...web,
  ...welcome,
};
