/**
 * Las capturas de «La plataforma a la que tendrás acceso» (/asesorias). Cada una: la ruta de la foto
 * (en `public/img/plataforma/`) y un texto alternativo. Se enseñan en este orden; la primera es la que sale
 * grande al abrir. Sin fotos, la sección no se pinta.
 */
export type FotoPlataforma = { src: string; alt: string };

export const FOTOS_PLATAFORMA: FotoPlataforma[] = [];
