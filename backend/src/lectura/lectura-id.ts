/**
 * Las personas de LECTURA ASTRAL (quien solo lee su carta) NO tienen cuenta: viven en sus propias tablas
 * (`lectura_cliente`, `lectura_astrologia`), separadas de `user`. Su id lleva este prefijo, y es lo que dice a
 * cada servicio en qué tabla mirar. Un id sin el prefijo es una cuenta real (tabla `user`).
 */
export const PREFIJO_LECTURA = 'lec_';

export const esIdLectura = (id?: string | null): boolean => typeof id === 'string' && id.startsWith(PREFIJO_LECTURA);
