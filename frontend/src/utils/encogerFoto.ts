// ─────────────────────────────────────────────────────────────────────────
// ENCOGER FOTO · dejar la imagen a tamaño de pantalla ANTES de subirla
//
// El problema que resuelve: un móvil saca fotos de 3-4 MB, y esa foto se
// subía tal cual al bucket. Después se pinta en un círculo de 50 px en la
// cabecera… y el navegador se descarga los 3 MB enteros para enseñarlo. Es
// cien veces más de lo que hace falta, y lo paga tres veces: la usuaria al
// subir (con sus datos móviles), el almacenamiento, y cada visita al cargar.
//
// La solución es encogerla aquí, en el navegador de quien la sube: el móvil
// hace el trabajo, viaja poca cosa y el servidor no necesita ninguna
// librería de imágenes. Una foto de 3,2 MB se queda en unos 40 kB.
//
//   const foto = await encogerFoto(file);   // File listo para el FormData
//
// Si algo falla (un formato que el navegador no sabe decodificar, un canvas
// bloqueado) devuelve el archivo ORIGINAL en vez de romper la subida: más
// vale una foto pesada que una usuaria que no puede poner su cara.
// ─────────────────────────────────────────────────────────────────────────

/** Lado mayor de la foto ya encogida. 600 px llega de sobra para un avatar
 *  de 50 px y para el círculo del genograma, incluso en pantallas retina. */
const LADO_MAX = 600;

/** Calidad del WebP. 0,82 es el punto donde una cara sigue impecable. */
const CALIDAD = 0.82;

/** Los GIF se dejan en paz: al pasarlos por el canvas perderían la animación. */
const NO_TOCAR = ['image/gif'];

export async function encogerFoto(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || NO_TOCAR.includes(file.type)) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const escala = Math.min(1, LADO_MAX / Math.max(bitmap.width, bitmap.height));

    // Ya es pequeña Y ligera: no se toca. Recomprimir con pérdida sobre pérdida
    // solo le quita nitidez sin ahorrar nada que merezca la pena.
    if (escala === 1 && file.size < 300 * 1024) { bitmap.close(); return file; }

    const ancho = Math.round(bitmap.width * escala);
    const alto = Math.round(bitmap.height * escala);
    const lienzo = document.createElement('canvas');
    lienzo.width = ancho;
    lienzo.height = alto;
    const ctx = lienzo.getContext('2d');
    if (!ctx) { bitmap.close(); return file; }
    ctx.drawImage(bitmap, 0, 0, ancho, alto);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      lienzo.toBlob(resolve, 'image/webp', CALIDAD),
    );
    // Si el navegador no sabe escribir WebP, `toBlob` devuelve null o un PNG
    // enorme. En cualquiera de los dos casos, mejor lo que ya teníamos.
    if (!blob || blob.size >= file.size) return file;

    const nombre = file.name.replace(/\.[^.]+$/, '') || 'foto';
    return new File([blob], `${nombre}.webp`, { type: 'image/webp', lastModified: Date.now() });
  } catch {
    return file;
  }
}
