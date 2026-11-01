/* ─────────────────────────────────────────────────────────────────────────────
 *  Correo a TODOS los suscriptores, sobre el fondo de mármol y en CCO
 *
 *  Cada persona ve solo su dirección: el «Para» es el propio remitente y la
 *  lista entera va en copia oculta, en tandas (Gmail limita los destinatarios
 *  por correo y por día, y una tanda enorme acaba en spam).
 *
 *  El texto es de María: vive en scripts/correo-lista.texto.txt
 *    · 1.ª línea  = asunto
 *    · lo demás   = párrafos separados por una línea en blanco
 *    · una línea «BOTON: Texto | /ruta-o-url» añade el botón (opcional)
 *    · <em>…</em> y <strong>…</strong> se respetan
 *
 *  Uso (desde la raíz del repo):
 *    node scripts/correo-lista.mjs               → solo vista previa (scripts/correo-lista.preview.html)
 *    node scripts/correo-lista.mjs --prueba      → lo manda SOLO a NOTIFY_EMAIL
 *    node scripts/correo-lista.mjs --enviar      → lo manda a toda la lista
 *
 *  El enlace de baja es el genérico (/baja): pide el correo en un formulario, porque
 *  en un envío en CCO no puede haber un enlace firmado distinto para cada persona.
 * ───────────────────────────────────────────────────────────────────────────── */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const RAIZ = path.resolve(import.meta.dirname, '..');
const requireBackend = createRequire(path.join(RAIZ, 'backend', 'package.json'));
const dotenv = requireBackend('dotenv');
const nodemailer = requireBackend('nodemailer');
const { createClient } = requireBackend('@supabase/supabase-js');

dotenv.config({ path: path.join(RAIZ, 'backend', '.env') });

const TANDA = 40; // destinatarios en CCO por correo
const PAUSA_MS = 8000; // entre tandas

const modo = process.argv.includes('--enviar') ? 'enviar' : process.argv.includes('--prueba') ? 'prueba' : 'vista';

const esc = (v) => v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ── El texto ────────────────────────────────────────────────────────────────
const rutaTexto = path.join(RAIZ, 'scripts', 'correo-lista.texto.txt');
if (!fs.existsSync(rutaTexto)) {
  console.error('Falta scripts/correo-lista.texto.txt (1.ª línea = asunto, luego los párrafos).');
  process.exit(1);
}
const [asuntoCrudo, ...resto] = fs.readFileSync(rutaTexto, 'utf-8').replace(/\r/g, '').split('\n');
const asunto = asuntoCrudo.trim();
const bloques = resto.join('\n').split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
let boton = null;
const parrafos = [];
for (const b of bloques) {
  const m = b.match(/^BOTON:\s*(.+?)\s*\|\s*(\S+)$/i);
  if (m) boton = { texto: m[1], destino: m[2] };
  else parrafos.push(b);
}
if (!asunto || !parrafos.length) {
  console.error('El texto está vacío: pon el asunto en la 1.ª línea y al menos un párrafo.');
  process.exit(1);
}

// ── El HTML (mismo diseño que la bienvenida de subscribe.service.ts) ───────────
const T = '#004f4f';
const web = (process.env.FRONTEND_URL || 'https://mariaescribano.onrender.com').replace(/\/+$/, '');
const SERIF = "'EB Garamond',Garamond,'Hoefler Text',Baskerville,Palatino,Georgia,serif";
const fondo = `${web}/img/correo/marmol-bienvenida.jpg`;
const cuerpo = parrafos
  .map((t) => `<p style="margin:0 0 16px;font-size:18px;line-height:1.75;color:${T};">${esc(t).replace(/&lt;(\/?)(em|strong)&gt;/g, '<$1$2>').replace(/\n/g, '<br>')}</p>`)
  .join('');
const destinoBoton = boton ? (/^https?:/i.test(boton.destino) ? boton.destino : `${web}${boton.destino}`) : '';
const html = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#efe5cf" background="${fondo}" style="max-width:600px;margin:0 auto;border-radius:16px;background-color:#efe5cf;background-image:url('${fondo}');background-size:cover;background-position:center;">
<tr><td style="padding:44px 40px 12px;font-family:${SERIF};">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
    <td style="padding-right:14px;vertical-align:middle;"><img src="${web}/img/correo/mandala-turquesa.png" width="58" height="58" alt="" style="display:block;border:0;"></td>
    <td style="vertical-align:middle;font-family:${SERIF};color:${T};font-size:20px;font-weight:600;letter-spacing:0.18em;line-height:1.2;">MARÍA<br>ESCRIBANO</td>
  </tr></table>
  <div style="height:1px;background:${T};opacity:0.45;margin:26px 0 0;"></div>
</td></tr>
<tr><td style="padding:22px 40px 40px;font-family:${SERIF};color:${T};">
${cuerpo}
${boton ? `<p style="margin:6px 0 0;"><a href="${esc(destinoBoton)}" style="display:inline-block;padding:14px 28px;border-radius:999px;background:${T};color:#ffffff;font-family:${SERIF};font-size:16px;line-height:1;font-weight:600;text-decoration:none;">${esc(boton.texto)}</a></p>` : ''}
<p style="margin:28px 0 22px;font-size:18px;color:${T};"><strong>María Escribano</strong></p>
<p style="margin:0 0 84px;font-size:13px;"><a href="${web}/baja" style="color:${T};">Darme de baja</a></p>
</td></tr></table>`;

const rutaPreview = path.join(RAIZ, 'scripts', 'correo-lista.preview.html');
fs.writeFileSync(rutaPreview, `<!doctype html><meta charset="utf-8"><title>${esc(asunto)}</title><body style="margin:0;padding:24px;background:#ddd;">${html}</body>`, 'utf-8');

// ── La lista ─────────────────────────────────────────────────────────────────
const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const { data, error } = await db.from('suscriptor').select('email');
if (error) {
  console.error('No se pudo leer la lista:', error.message);
  process.exit(1);
}
const lista = [...new Set((data ?? []).map((s) => (s.email ?? '').trim().toLowerCase()).filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)))];

console.log(`Asunto: ${asunto}`);
console.log(`Suscriptores: ${lista.length}  ·  tandas de ${TANDA}: ${Math.ceil(lista.length / TANDA)}`);
console.log(`Vista previa: ${rutaPreview}`);

if (modo === 'vista') {
  console.log('\nNo se ha enviado nada. Con --prueba te lo mandas a ti; con --enviar, a toda la lista.');
  process.exit(0);
}

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('EMAIL_USER / EMAIL_PASS no configurados en backend/.env');
  process.exit(1);
}
const port = Number(process.env.EMAIL_PORT) || 465;
const transporte = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port,
  secure: port === 465,
  auth: { user: process.env.EMAIL_USER, pass: (process.env.EMAIL_PASS ?? '').replace(/\s/g, '') },
});
const remitente = process.env.EMAIL_FROM || process.env.EMAIL_USER;
const from = `"María Escribano" <${remitente}>`;

if (modo === 'prueba') {
  const para = process.env.NOTIFY_EMAIL;
  await transporte.sendMail({ from, to: para, subject: asunto, html });
  console.log(`Prueba enviada a ${para}`);
  process.exit(0);
}

let ok = 0;
const fallidas = [];
for (let i = 0; i < lista.length; i += TANDA) {
  const tanda = lista.slice(i, i + TANDA);
  try {
    await transporte.sendMail({ from, to: remitente, bcc: tanda, subject: asunto, html });
    ok += tanda.length;
    console.log(`Tanda ${i / TANDA + 1}: ${tanda.length} enviados (${ok}/${lista.length})`);
  } catch (err) {
    fallidas.push(...tanda);
    console.error(`Tanda ${i / TANDA + 1} FALLÓ:`, err.message);
  }
  if (i + TANDA < lista.length) await new Promise((r) => setTimeout(r, PAUSA_MS));
}
console.log(`\nHecho: ${ok} enviados, ${fallidas.length} fallidos.`);
if (fallidas.length) console.log('Fallidos:', fallidas.join(', '));
