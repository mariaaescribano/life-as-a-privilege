// ─────────────────────────────────────────────────────────────────────────────
// Límites de peticiones por IP (rate limiting).
//
// El problema que resuelven: /contact, /subscribe, /opinion y /booking no piden
// login — tienen que ser públicos para que cualquiera pueda escribir o reservar
// una llamada. Sin límite, un script llena la agenda entera de reservas (huecos
// que luego no se pueden vender) e inunda el buzón de correos.
//
// Cómo funciona: hay UN limitador global (LIMITE_GENERAL) que se aplica a todo,
// y las rutas sensibles lo estrechan con @Throttle({ default: ... }). Se hace así
// —un limitador y overrides— y no registrando varios limitadores con nombre,
// porque los limitadores registrados se aplican TODOS a TODAS las rutas: un
// «5 por hora» global tumbaría la web entera.
//
// Ojo: el recuento vive en memoria del proceso. Con una sola instancia en Render
// es correcto; el día que haya varias, cada una contará por su cuenta y habría
// que pasar el almacenamiento a Redis (@nest-lab/throttler-storage-redis).
// ─────────────────────────────────────────────────────────────────────────────
const SEGUNDO = 1000;
const MINUTO = 60 * SEGUNDO;
const HORA = 60 * MINUTO;

/**
 * Techo general de la API, por IP. Holgado a propósito: una página del recorrido
 * dispara varias peticiones (perfil, progreso, textos…) y navegar rápido no debe
 * bloquear a nadie. Solo corta el martilleo automatizado.
 */
export const LIMITE_GENERAL = { ttl: MINUTO, limit: 150 };

/**
 * Formularios que ACABAN EN UN CORREO a María (contacto, opiniones, suscripción).
 * Cinco por hora y por IP: de sobra para una persona, inútil para un script.
 */
export const LIMITE_FORMULARIO = { default: { ttl: HORA, limit: 5 } };

/**
 * Reservar una llamada. Aquí no solo se manda un correo: se OCUPA UN HUECO de
 * agenda, así que es el más caro de abusar. Cinco por hora y por IP.
 */
export const LIMITE_RESERVA = { default: { ttl: HORA, limit: 5 } };

/**
 * Entrar, registrarse y pedir recuperación de contraseña. Frena la prueba de
 * contraseñas por fuerza bruta sin castigar a quien se equivoca al teclear:
 * diez intentos cada cinco minutos.
 */
export const LIMITE_AUTH = { default: { ttl: 5 * MINUTO, limit: 10 } };
