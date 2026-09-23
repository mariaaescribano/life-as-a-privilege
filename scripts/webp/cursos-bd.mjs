/* ─────────────────────────────────────────────────────────────────────────────
 *  PORTADAS DE CURSO · pasar las rutas de la BD de .png a .webp
 *
 *  Por qué existe un script aparte: las portadas de los cursos son las únicas
 *  imágenes del sitio cuya ruta NO está escrita en el código, sino guardada en
 *  la columna `foto` de la tabla `curso` (el catálogo se edita desde /admin).
 *  Por eso `rutas.mjs` no les sirve de nada: reescribe archivos fuente, y ahí
 *  no hay nada que reescribir. Quien tiene que enterarse es la base de datos.
 *
 *  Se corre DESPUÉS de `convertir.mjs --lote=<n>`, y lee su CSV para saber
 *  exactamente qué archivo pasó a ser cuál. No adivina nada.
 *
 *  Uso (desde la raíz del repo):
 *    node scripts/webp/cursos-bd.mjs --prueba            → qué filas cambiaría
 *    node scripts/webp/cursos-bd.mjs                     → las cambia
 *    node scripts/webp/cursos-bd.mjs --lote=47 --prueba  → otro lote
 *
 *  Sin `--lote` usa el 43, que fue el de la conversión grande. Cada portada
 *  nueva que se suba en PNG lleva su propio lote, y hay que decírselo aquí.
 *
 *  Es idempotente: una fila que ya apunta al .webp se deja en paz, así que se
 *  puede volver a correr sin miedo.
 * ───────────────────────────────────────────────────────────────────────────── */

import fs from 'node:fs';
import path from 'node:path';

const RAIZ = path.resolve(import.meta.dirname, '../..');
const prueba = process.argv.includes('--prueba');
const lote = Number((process.argv.find((a) => a.startsWith('--lote=')) ?? '--lote=43').split('=')[1]);

// ── Credenciales (del .env del backend, nunca se imprimen) ───────────────────
const env = Object.fromEntries(
  fs
    .readFileSync(path.join(RAIZ, 'backend/.env'), 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]),
);
const U = env.SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!U || !KEY) { console.error('Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY en backend/.env'); process.exit(1); }
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };

// ── Qué pasó a ser qué, según el registro de la conversión ───────────────────
const registro = path.join(import.meta.dirname, 'lote-' + lote + '.csv');
if (!fs.existsSync(registro)) { console.error('No existe ' + registro + ': ¿se ha corrido convertir.mjs --lote=' + lote + '?'); process.exit(1); }
const csv = fs.readFileSync(registro, 'utf8').trim().split('\n').slice(1);
const equivalencia = new Map(csv.map((l) => { const c = l.split(','); return [c[0], c[1]]; }));
console.log(`${equivalencia.size} portadas convertidas según lote-${lote}.csv`);

// ── Filas del catálogo ───────────────────────────────────────────────────────
const cursos = await (await fetch(`${U}/rest/v1/curso?select=id,foto`, { headers: H })).json();
if (!Array.isArray(cursos)) { console.error('No se pudo leer la tabla curso:', cursos); process.exit(1); }

let cambiadas = 0, yaEstaban = 0, sinEquivalencia = [];
for (const c of cursos) {
  if (!c.foto) continue;
  if (c.foto.endsWith('.webp')) { yaEstaban++; continue; }
  const nueva = equivalencia.get(c.foto);
  if (!nueva) { sinEquivalencia.push(c.foto); continue; } // de otro lote, o rota
  if (prueba) { console.log(`  ${c.foto}  →  ${nueva}`); cambiadas++; continue; }
  const r = await fetch(`${U}/rest/v1/curso?id=eq.${encodeURIComponent(c.id)}`, {
    method: 'PATCH',
    headers: { ...H, Prefer: 'return=minimal' },
    body: JSON.stringify({ foto: nueva }),
  });
  if (!r.ok) { console.error(`  ! ${c.foto}: HTTP ${r.status} ${await r.text()}`); continue; }
  console.log(`  ${c.foto}  →  ${nueva}`);
  cambiadas++;
}

console.log(`\n${prueba ? 'se cambiarían' : 'cambiadas'}: ${cambiadas} · ya en webp: ${yaEstaban}`);
// Una portada sin equivalencia es una fila que apunta a un archivo que este
// lote no tocó: casi siempre es de otro lote y ya está bien. Solo hay que
// mirar a mano las que no existan en disco.
if (sinEquivalencia.length) {
  console.log(`\n⚠ ${sinEquivalencia.length} portadas sin equivalencia en el CSV (revisar a mano):`);
  for (const f of sinEquivalencia) console.log(`   ${f}`);
}
