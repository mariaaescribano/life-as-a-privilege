// La portada de los apuntes de Astrología: el cielo a sangre y, en medio, en una sola línea, el icono de
// Astrología y el rótulo ASTROLOGÍA. Se compone en un canvas y sale como UN JPEG
// (jsPDF no sabe de WebP ni de la tipografía de la web).
const cargar = (src: string): Promise<HTMLImageElement | null> =>
  new Promise((ok) => {
    const i = new Image();
    i.onload = () => ok(i);
    i.onerror = () => ok(null);
    i.src = encodeURI(src);
  });

// Icono de Astrología (el mismo de GlobalVariables.AstrologiaIcon), viewBox 0 -960 960 960.
const ESTRELLAS =
  "m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm457-560 21-89-71-59 94-8 36-84 36 84 94 8-71 59 21 89-80-47-80 47ZM480-481Z";

export async function portadaAstrologia(): Promise<string> {
  const W = 1240;
  const H = 1754;
  const cielo = await cargar("/img/astrologia/space.webp");
  try { await document.fonts.load('600 80px "EB Garamond"'); } catch { /* sin la fuente sale en serif */ }

  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.imageSmoothingQuality = "high";
  ctx.fillStyle = "#04070f";
  ctx.fillRect(0, 0, W, H);

  // El cielo, girado para que su lado largo vaya a lo alto (se recorta lo mínimo).
  if (cielo) {
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.rotate(-Math.PI / 2);
    const e = Math.max(H / cielo.naturalWidth, W / cielo.naturalHeight);
    ctx.drawImage(cielo, (-cielo.naturalWidth * e) / 2, (-cielo.naturalHeight * e) / 2, cielo.naturalWidth * e, cielo.naturalHeight * e);
    ctx.restore();
  }

  // En medio de la hoja, en UNA línea: el icono de Astrología y el rótulo.
  const rotulo = "ASTROLOGÍA";
  const fuente = '600 92px "EB Garamond", Georgia, serif';
  ctx.font = fuente;
  const sep = 14;
  const letras = Array.from(rotulo);
  const anchos = letras.map((l) => ctx.measureText(l).width);
  const anchoTexto = anchos.reduce((a, b) => a + b, 0) + sep * (letras.length - 1);
  const tam = 128;
  const hueco = 44;
  const total = tam + hueco + anchoTexto;
  const x0 = (W - total) / 2;
  const cy = H / 2;

  ctx.save();
  ctx.translate(x0, cy - tam / 2);
  ctx.scale(tam / 960, tam / 960);
  ctx.translate(0, 960);
  ctx.shadowColor = "rgba(255,255,255,0.55)";
  ctx.shadowBlur = 40;
  ctx.fillStyle = "#ffffff";
  ctx.fill(new Path2D(ESTRELLAS));
  ctx.restore();

  ctx.font = fuente;
  ctx.fillStyle = "#ffffff";
  ctx.textBaseline = "alphabetic";
  ctx.shadowColor = "rgba(255,255,255,0.4)";
  ctx.shadowBlur = 22;
  let x = x0 + tam + hueco;
  letras.forEach((l, i) => {
    ctx.fillText(l, x, cy + 32);
    x += anchos[i] + sep;
  });

  return c.toDataURL("image/jpeg", 0.88);
}
