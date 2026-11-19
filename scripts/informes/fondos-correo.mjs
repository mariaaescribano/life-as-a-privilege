// Genera los fondos y el mandala de los correos de /admin/informes (uno por disciplina).
//  · fondo vertical: la foto de la disciplina girada 90° si es horizontal (como el fondo del PDF),
//    a 1500 px de lado largo, en public/img/correo/informe-<clave>.jpg
//  · mandala del color de letra (Txt) de la disciplina, en public/img/correo/informe-mandala-<clave>.png
// Uso: node scripts/informes/fondos-correo.mjs   (hay que volver a correrlo si cambia una foto o un color)
import sharp from "sharp";
import fs from "node:fs";

const PUB = "frontend/public/img/";
const D = {
  astrologia: { foto: "astrologia/space.webp", txt: "#feffe4" },
  psicologia: { foto: "fondos/psciologia.webp", txt: "#5e2d10" },
  ayurveda: { foto: "fondos/hinduismo.webp", txt: "#853e0b" },
  tcm: { foto: "fondos/tcm.webp", txt: "#ffa2a2" },
  fisiologia: { foto: "fondos/fisio.webp", txt: "#c8b5d1" },
  nutricion: { foto: "fondos/nutri.webp", txt: "#2b362a" },
  cabala: { foto: "fondos/cabala.webp", txt: "#bd814d" },
  cultura: { foto: "fondos/cultura.webp", txt: "#79dcd4" },
};
const LARGO = 1500;

for (const [k, d] of Object.entries(D)) {
  const src = PUB + d.foto;
  const m = await sharp(src).metadata();
  let img = sharp(src);
  if (m.width > m.height) img = img.rotate(-90); // horizontal → vertical
  await img.resize({ height: LARGO, width: Math.round(LARGO * 0.68), fit: "cover" }).jpeg({ quality: 80, mozjpeg: true })
    .toFile(`${PUB}correo/informe-${k}.jpg`);

  // Mandala de la marca repintado de un solo color (el PNG tiene el fondo transparente).
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(d.txt.slice(i, i + 2), 16));
  const alfa = await sharp(PUB + "correo/mandala-turquesa.png").resize(240, 240).ensureAlpha().extractChannel(3).toBuffer();
  await sharp({ create: { width: 240, height: 240, channels: 3, background: { r, g, b } } })
    .joinChannel(alfa).png().toFile(`${PUB}correo/informe-mandala-${k}.png`);
  console.log(k, `${m.width}x${m.height}`, fs.statSync(`${PUB}correo/informe-${k}.jpg`).size >> 10, "KB");
}

// Los iconos de siempre (informe-icono-<clave>.png, del color Txt de la disciplina) también en turquesa
// oscuro (#004f4f), para el correo con fondo de mármol y para la pantalla de /admin/informes.
for (const k of Object.keys(D)) {
  const f = `${PUB}correo/informe-icono-${k}.png`;
  if (!fs.existsSync(f)) { console.log("falta", f); continue; }
  const alfa = await sharp(f).ensureAlpha().extractChannel(3).toBuffer();
  const { width, height } = await sharp(f).metadata();
  await sharp({ create: { width, height, channels: 3, background: { r: 0, g: 79, b: 79 } } })
    .joinChannel(alfa).png().toFile(`${PUB}correo/informe-icono-${k}-tq.png`);
  console.log(k, "icono turquesa");
}
