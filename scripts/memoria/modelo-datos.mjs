// ─────────────────────────────────────────────────────────────────────────────
// FIGURA 5 de la memoria: el modelo de datos completo.
//
// Dibuja el esquema entero (30 tablas + 1 vista) agrupado por para qué sirve
// cada bloque, y sale a memoria/figuras/fig05-modelo-datos.png listo para
// arrastrar al Word.
//
//   node scripts/memoria/modelo-datos.mjs
//
// Se genera desde aquí y no a mano para que, si el esquema cambia, la figura se
// rehaga con un comando en vez de retocarse en un editor de dibujo.
// ─────────────────────────────────────────────────────────────────────────────
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SALIDA = resolve(RAIZ, 'memoria/figuras/fig05-modelo-datos');

// ── El esquema ───────────────────────────────────────────────────────────────
// f(nombre, tipo, marca) — marca: 'pk' | 'fk' | 'u' (único) | ''
const f = (n, t, m = '') => ({ n, t, m });

const USUARIO = {
  nota: 'identidad, credenciales y permiso de acceso a cada disciplina',
  columnas: [
    [f('id', 'text', 'pk'), f('name', 'text', 'u'), f('email', 'text', 'u'),
     f('password', 'text'), f('img', 'text'), f('trato', 'text')],
    [f('metodo_suscrito', 'bool'), f('psicologia_suscrito', 'bool'),
     f('ayurveda_suscrito', 'bool'), f('tcm_suscrito', 'bool'),
     f('fisiologia_suscrito', 'bool'), f('nutricion_suscrito', 'bool'),
     f('cabala_suscrito', 'bool'), f('cultura_suscrito', 'bool')],
    [f('metodo_fecha_compra', 'timestamptz'), f('psicologia_fecha_compra', 'timestamptz'),
     f('ayurveda_fecha_compra', 'timestamptz'), f('tcm_fecha_compra', 'timestamptz'),
     f('fisiologia_fecha_compra', 'timestamptz'), f('nutricion_fecha_compra', 'timestamptz'),
     f('cabala_fecha_compra', 'timestamptz'), f('cultura_fecha_compra', 'timestamptz')],
  ],
};

const GRUPOS = [
  {
    id: 'recorrido',
    titulo: 'El Recorrido',
    nota: 'un documento JSONB por usuario y disciplina',
    color: '#2f5d8a',
    fondo: '#eef3f9',
    deUsuario: true,
    tablas: [
      { n: 'recorrido_progreso', c: [f('user_id', 'text', 'pk'), f('disciplina', 'text', 'pk'), f('paso_max', 'int'), f('updated_at', 'timestamptz')] },
      { n: 'metodo_astrologia', c: [f('user_id', 'text', 'pk'), f('data', 'jsonb'), f('intro_visto', 'bool'), f('solicitud_enviada_at', 'timestamptz'), f('link_carta', 'text'), f('casas_texto', 'text'), f('aspectos_texto', 'text'), f('updated_at', 'timestamptz')] },
      { n: 'metodo_psicologia', c: [f('user_id', 'text', 'pk'), f('data', 'jsonb'), f('intro_visto', 'bool'), f('updated_at', 'timestamptz')] },
      { n: 'metodo_ayurveda', c: [f('user_id', 'text', 'pk'), f('data', 'jsonb'), f('intro_visto', 'bool'), f('updated_at', 'timestamptz')] },
      { n: 'metodo_tcm', c: [f('user_id', 'text', 'pk'), f('data', 'jsonb'), f('intro_visto', 'bool'), f('updated_at', 'timestamptz')] },
      { n: 'metodo_fisiologia', c: [f('user_id', 'text', 'pk'), f('data', 'jsonb'), f('intro_visto', 'bool'), f('updated_at', 'timestamptz')] },
      { n: 'metodo_nutricion', c: [f('user_id', 'text', 'pk'), f('data', 'jsonb'), f('intro_visto', 'bool'), f('updated_at', 'timestamptz')] },
      { n: 'metodo_cabala', c: [f('user_id', 'text', 'pk'), f('data', 'jsonb'), f('updated_at', 'timestamptz')] },
      { n: 'psicologia_des', c: [f('user_id', 'text', 'pk'), f('score', 'smallint'), f('banda', 'text'), f('amnesia', 'smallint'), f('despersonalizacion', 'smallint'), f('absorcion', 'smallint'), f('alto', 'bool'), f('fecha', 'timestamptz')] },
      { n: 'notas', c: [f('id', 'uuid', 'pk'), f('user_id', 'text'), f('contenido', 'text'), f('categoria', 'text'), f('created_at', 'timestamptz')] },
    ],
  },
  {
    id: 'tests',
    titulo: 'Tests y resultados',
    nota: 'resultado y respuestas crudas, en forma relacional',
    color: '#6b4f8a',
    fondo: '#f4f1f8',
    deUsuario: true,
    tablas: [
      { n: 'astrologia', c: [f('userId', 'text', 'pk'), f('sol', 'text'), f('luna', 'text'), f('ascendente', 'text')] },
      { n: 'ayurveda', c: [f('userId', 'text', 'pk'), f('dosha', 'text'), f('vata_score', 'int'), f('pitta_score', 'int'), f('kapha_score', 'int'), f('fecha', 'date')] },
      { n: 'ayurveda_respuestas', c: [f('user_id', 'text'), f('pregunta_idx', 'int'), f('pregunta', 'text'), f('dosha_elegida', 'text')] },
      { n: 'tcm', c: [f('userId', 'text', 'pk'), f('constitucion', 'text'), f('elemento', 'text'), f('desequilibrio', 'text')] },
      { n: 'tcm_respuestas', c: [f('user_id', 'text'), f('test_num', 'int'), f('seccion', 'text'), f('pregunta_idx', 'int'), f('pregunta', 'text'), f('respuesta', 'int')] },
      { n: 'nutricion', c: [f('userId', 'text', 'pk'), f('peso', 'numeric'), f('altura', 'numeric'), f('edad', 'int'), f('genero', 'text'), f('actividadIdx', 'int'), f('tdee', 'numeric'), f('protG', 'numeric'), f('carbG', 'numeric'), f('fatG', 'numeric')] },
      { n: 'cabala', c: [f('idUser', 'text'), f('idPregunta', 'text'), f('respuesta', 'text')] },
      { n: 'neuroPsicologia', c: [f('userid', 'text'), f('pregid', 'text'), f('respuesta', 'text')] },
      { n: 'fitoterapia', c: [f('idUser', 'text'), f('idPlanta', 'text')] },
    ],
  },
  {
    id: 'estudio',
    titulo: 'Estudio estadístico abierto',
    nota: 'la única clave ajena declarada del esquema',
    color: '#2f7a4f',
    fondo: '#eef6f1',
    deUsuario: 'parcial',
    tablas: [
      { n: 'estudio_participante', c: [f('id', 'uuid', 'pk'), f('email', 'text', 'u'), f('fecha_nacimiento', 'date'), f('hora_nacimiento', 'text'), f('pais / region / lugar', 'text'), f('latitud / longitud', 'float8'), f('timezone', 'text'), f('carta_natal_json', 'jsonb'), f('signos', 'jsonb'), f('casas', 'jsonb'), f('user_id', 'text')] },
      { n: 'estudio_respuesta', c: [f('participante_id', 'uuid', 'fk'), f('planeta', 'text', 'pk'), f('pregunta_id', 'text', 'pk'), f('eje', 'text'), f('posicion', 'text'), f('respuesta', 'bool')] },
      { n: 'estudio_stats', vista: true, c: [f('planeta / eje / posicion', 'text'), f('pregunta_id', 'text'), f('total', 'int'), f('si', 'int'), f('no', 'int')] },
    ],
  },
  {
    id: 'publico',
    titulo: 'Relación con el público',
    nota: 'sin cuenta: se identifican por su correo',
    color: '#8a2f4f',
    fondo: '#f9eff3',
    tablas: [
      { n: 'suscriptor', c: [f('id', 'uuid', 'pk'), f('email', 'text', 'u'), f('origen', 'text'), f('created_at', 'timestamptz')] },
      { n: 'opinion', c: [f('id', 'text', 'pk'), f('nombre', 'text'), f('texto', 'text'), f('email', 'text'), f('aprobada', 'bool')] },
      { n: 'bookings', c: [f('id', 'uuid', 'pk'), f('nombre', 'text'), f('email', 'text'), f('fecha', 'date'), f('slot', 'text'), f('tema', 'text')] },
    ],
  },
  {
    id: 'catalogo',
    titulo: 'Catálogo y contenido',
    nota: 'editable desde el panel, sin publicar código',
    color: '#8a5a2f',
    fondo: '#f9f4ee',
    tablas: [
      { n: 'curso', c: [f('id', 'uuid', 'pk'), f('modalidad', 'text'), f('titulo', 'text'), f('foto', 'text'), f('descripcion', 'text'), f('descripcion_contenido', 'text'), f('de_pago', 'bool'), f('publicado', 'bool'), f('completado', 'bool'), f('orden', 'int'), f('contenido', 'jsonb')] },
      { n: 'curso_revisado', c: [f('curso_id', 'uuid', 'pk'), f('revisado', 'bool'), f('updated_at', 'timestamptz')] },
      { n: 'video', c: [f('id', 'uuid', 'pk'), f('disciplina', 'text'), f('titulo', 'text'), f('portada', 'text'), f('url', 'text'), f('publicado', 'bool'), f('orden', 'int')] },
      { n: 'astrologia_arquetipos', c: [f('id', 'text', 'pk'), f('data', 'jsonb'), f('updated_at', 'timestamptz')] },
    ],
  },
];

// Qué grupos van en cada columna de la figura.
const COLUMNAS = [
  { w: 452, grupos: ['recorrido'] },
  { w: 420, grupos: ['tests'] },
  { w: 436, grupos: ['estudio', 'publico'] },
  { w: 410, grupos: ['catalogo'] },
];

// ── Medidas ──────────────────────────────────────────────────────────────────
const M = 42;            // margen exterior
const GAP_COL = 24;      // hueco entre columnas
const CAB = 30;          // alto de la cabecera de una tabla
const FILA = 19;         // alto de una fila de columna
const PAD_CAJA = 7;      // aire dentro de la caja
const GAP_CAJA = 12;     // hueco entre tablas
const MARCO_PAD = 15;    // aire dentro del marco de grupo
const MARCO_CAB = 46;    // título + nota del grupo
const GAP_GRUPO = 26;    // hueco entre grupos de una misma columna

const altoTabla = (t) => CAB + PAD_CAJA + t.c.length * FILA + PAD_CAJA + 2;
const altoGrupo = (g) =>
  MARCO_CAB + MARCO_PAD +
  g.tablas.reduce((a, t) => a + altoTabla(t), 0) +
  (g.tablas.length - 1) * GAP_CAJA + MARCO_PAD;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const MONO = "Consolas, 'DejaVu Sans Mono', 'Courier New', monospace";
const SANS = "'Segoe UI', Calibri, 'DejaVu Sans', Arial, sans-serif";

// ── Dibujo ───────────────────────────────────────────────────────────────────
const out = [];
const grupoPorId = Object.fromEntries(GRUPOS.map((g) => [g.id, g]));

let x = M;
for (const col of COLUMNAS) { col.x = x; x += col.w + GAP_COL; }
const W = x - GAP_COL + M;

const USR_Y = 104;
const USR_H = CAB + PAD_CAJA + Math.max(...USUARIO.columnas.map((c) => c.length)) * FILA + PAD_CAJA + 2;
const GRUPOS_Y = USR_Y + USR_H + 62;

const altoCol = (col) =>
  col.grupos.reduce((a, id) => a + altoGrupo(grupoPorId[id]), 0) +
  (col.grupos.length - 1) * GAP_GRUPO;
const H = GRUPOS_Y + Math.max(...COLUMNAS.map(altoCol)) + M;

out.push(`<rect width="${W}" height="${H}" fill="#ffffff"/>`);
out.push(`<text x="${M}" y="46" font-family="${SANS}" font-size="27" font-weight="600" fill="#1b1b1b">Modelo de datos</text>`);
const N_TABLAS = 1 + GRUPOS.reduce((a, g) => a + g.tablas.filter((t) => !t.vista).length, 0);
const N_VISTAS = GRUPOS.reduce((a, g) => a + g.tablas.filter((t) => t.vista).length, 0);
out.push(`<text x="${M}" y="74" font-family="${SANS}" font-size="15" fill="#555">${N_TABLAS} tablas y ${N_VISTAS} vista en PostgreSQL, agrupadas por la función que cumplen.</text>`);

/** Una caja de tabla. */
function tabla(t, bx, by, bw, color) {
  const h = altoTabla(t);
  const g = [];
  g.push(`<rect x="${bx}" y="${by}" width="${bw}" height="${h}" rx="5" fill="#ffffff" stroke="#c3c3c3" stroke-width="1"/>`);
  g.push(`<path d="M ${bx} ${by + 5} a 5 5 0 0 1 5 -5 h ${bw - 10} a 5 5 0 0 1 5 5 v ${CAB - 5} h ${-bw} z" fill="${color}"/>`);
  g.push(`<text x="${bx + 11}" y="${by + 20}" font-family="${MONO}" font-size="14.5" font-weight="700" fill="#ffffff">${esc(t.n)}</text>`);
  if (t.vista) {
    g.push(`<text x="${bx + bw - 11}" y="${by + 20}" text-anchor="end" font-family="${SANS}" font-size="11" letter-spacing="0.08em" fill="#ffffffcc">VISTA</text>`);
  }
  t.c.forEach((col, i) => {
    const y = by + CAB + PAD_CAJA + i * FILA + 13;
    if (i) g.push(`<line x1="${bx + 1}" y1="${y - 13}" x2="${bx + bw - 1}" y2="${y - 13}" stroke="#eeeeee" stroke-width="1"/>`);
    const clave = col.m === 'pk' || col.m === 'fk';
    g.push(`<text x="${bx + 11}" y="${y}" font-family="${MONO}" font-size="12.5" font-weight="${clave ? 700 : 400}" fill="#1b1b1b">${esc(col.n)}</text>`);
    let der = col.t;
    if (col.m === 'pk') der = 'PK · ' + der;
    else if (col.m === 'fk') der = 'FK · ' + der;
    else if (col.m === 'u') der = 'único · ' + der;
    g.push(`<text x="${bx + bw - 11}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="11.5" fill="${clave ? color : '#8a8a8a'}">${esc(der)}</text>`);
  });
  return { svg: g.join('\n'), h };
}

// La caja de `user`, arriba y a todo lo ancho.
{
  const bw = W - 2 * M;
  out.push(`<rect x="${M}" y="${USR_Y}" width="${bw}" height="${USR_H}" rx="5" fill="#ffffff" stroke="#0f5f5f" stroke-width="1.6"/>`);
  out.push(`<path d="M ${M} ${USR_Y + 5} a 5 5 0 0 1 5 -5 h ${bw - 10} a 5 5 0 0 1 5 5 v ${CAB - 5} h ${-bw} z" fill="#0f5f5f"/>`);
  out.push(`<text x="${M + 11}" y="${USR_Y + 20}" font-family="${MONO}" font-size="15" font-weight="700" fill="#ffffff">user</text>`);
  out.push(`<text x="${M + bw - 11}" y="${USR_Y + 20}" text-anchor="end" font-family="${SANS}" font-size="12.5" fill="#ffffffcc">${esc(USUARIO.nota)}</text>`);
  const subW = (bw - 24) / 3;
  USUARIO.columnas.forEach((cols, ci) => {
    const cx = M + 12 + ci * subW;
    cols.forEach((col, i) => {
      const y = USR_Y + CAB + PAD_CAJA + i * FILA + 13;
      const clave = col.m === 'pk';
      out.push(`<text x="${cx}" y="${y}" font-family="${MONO}" font-size="12.5" font-weight="${clave ? 700 : 400}" fill="#1b1b1b">${esc(col.n)}</text>`);
      let der = col.t;
      if (col.m === 'pk') der = 'PK · ' + der;
      else if (col.m === 'u') der = 'único · ' + der;
      out.push(`<text x="${cx + 290}" y="${y}" text-anchor="end" font-family="${MONO}" font-size="11.5" fill="${clave ? '#0f5f5f' : '#8a8a8a'}">${esc(der)}</text>`);
    });
  });
}

// Marcos de grupo + sus tablas, columna a columna.
const anclas = [];
for (const col of COLUMNAS) {
  let y = GRUPOS_Y;
  for (const id of col.grupos) {
    const g = grupoPorId[id];
    const h = altoGrupo(g);
    out.push(`<rect x="${col.x}" y="${y}" width="${col.w}" height="${h}" rx="9" fill="${g.fondo}" stroke="${g.color}" stroke-width="1.2" stroke-opacity="0.45"/>`);
    out.push(`<text x="${col.x + MARCO_PAD}" y="${y + 24}" font-family="${SANS}" font-size="15.5" font-weight="700" fill="${g.color}">${esc(g.titulo)}</text>`);
    out.push(`<text x="${col.x + MARCO_PAD}" y="${y + 40}" font-family="${SANS}" font-size="12" fill="#666">${esc(g.nota)}</text>`);
    if (g.deUsuario) anclas.push({ x: col.x + col.w / 2, y, parcial: g.deUsuario === 'parcial' });

    let ty = y + MARCO_CAB;
    for (const t of g.tablas) {
      const r = tabla(t, col.x + MARCO_PAD, ty, col.w - 2 * MARCO_PAD, g.color);
      out.push(r.svg);
      // La única clave ajena real: estudio_respuesta → estudio_participante.
      if (t.n === 'estudio_respuesta') {
        out.push(`<path d="M ${col.x + MARCO_PAD - 7} ${ty - GAP_CAJA + 1} v ${GAP_CAJA + 14} h 7" fill="none" stroke="#2f7a4f" stroke-width="1.6" marker-end="url(#flecha-verde)"/>`);
      }
      // La vista se alimenta de la tabla de encima.
      if (t.n === 'estudio_stats') {
        out.push(`<path d="M ${col.x + MARCO_PAD - 7} ${ty - GAP_CAJA + 1} v ${GAP_CAJA + 14} h 7" fill="none" stroke="#2f7a4f" stroke-width="1.4" stroke-dasharray="4 3" marker-end="url(#flecha-verde)"/>`);
      }
      ty += r.h + GAP_CAJA;
    }
    y += h + GAP_GRUPO;
  }
}

// Las relaciones con `user`: por user_id, sin clave ajena declarada.
for (const a of anclas) {
  const y0 = USR_Y + USR_H;
  out.push(`<path d="M ${a.x} ${y0} V ${a.y - 10}" fill="none" stroke="#0f5f5f" stroke-width="1.5" stroke-dasharray="6 4" stroke-opacity="${a.parcial ? 0.45 : 0.85}" marker-end="url(#flecha-teal)"/>`);
  out.push(`<text x="${a.x + 8}" y="${y0 + 28}" font-family="${MONO}" font-size="12" fill="#0f5f5f" fill-opacity="${a.parcial ? 0.6 : 1}">user_id${a.parcial ? ' (opcional)' : ''}</text>`);
}

// Leyenda, en el hueco que deja la última columna.
{
  const col = COLUMNAS[COLUMNAS.length - 1];
  const ly = GRUPOS_Y + altoCol(col) + GAP_GRUPO;
  const lh = 168;
  out.push(`<rect x="${col.x}" y="${ly}" width="${col.w}" height="${lh}" rx="9" fill="#fafafa" stroke="#cccccc" stroke-width="1"/>`);
  out.push(`<text x="${col.x + MARCO_PAD}" y="${ly + 24}" font-family="${SANS}" font-size="14.5" font-weight="700" fill="#333">Leyenda</text>`);
  const filas = [
    ['PK', 'clave primaria (en negrita dentro de la tabla)'],
    ['fk', 'clave ajena declarada: sólo hay una en todo el esquema'],
    ['dash', 'relación lógica por user_id, sin clave ajena: la integridad la mantiene el servidor'],
    ['jsonb', 'documento que sólo se lee entero y para un usuario'],
  ];
  let fy = ly + 48;
  for (const [tipo, txt] of filas) {
    if (tipo === 'dash') out.push(`<line x1="${col.x + MARCO_PAD}" y1="${fy - 4}" x2="${col.x + MARCO_PAD + 34}" y2="${fy - 4}" stroke="#0f5f5f" stroke-width="1.5" stroke-dasharray="6 4"/>`);
    else if (tipo === 'fk') out.push(`<g><line x1="${col.x + MARCO_PAD}" y1="${fy - 4}" x2="${col.x + MARCO_PAD + 16}" y2="${fy - 4}" stroke="#2f7a4f" stroke-width="1.6"/><text x="${col.x + MARCO_PAD + 20}" y="${fy}" font-family="${MONO}" font-size="11.5" font-weight="700" fill="#2f7a4f">FK</text></g>`);
    else out.push(`<text x="${col.x + MARCO_PAD}" y="${fy}" font-family="${MONO}" font-size="11.5" font-weight="700" fill="#555">${tipo}</text>`);
    // El texto se parte a mano: en SVG no hay ajuste automático de línea.
    const lineas = [];
    let linea = '';
    for (const p of txt.split(' ')) {
      if ((linea + ' ' + p).trim().length > 46) { lineas.push(linea.trim()); linea = p; }
      else linea += ' ' + p;
    }
    lineas.push(linea.trim());
    lineas.forEach((l, i) => {
      out.push(`<text x="${col.x + MARCO_PAD + 48}" y="${fy + i * 15}" font-family="${SANS}" font-size="11.5" fill="#444">${esc(l)}</text>`);
    });
    fy += 15 * lineas.length + 10;
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>
  <marker id="flecha-teal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
    <path d="M 0 0 L 10 5 L 0 10 z" fill="#0f5f5f"/>
  </marker>
  <marker id="flecha-verde" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
    <path d="M 0 0 L 10 5 L 0 10 z" fill="#2f7a4f"/>
  </marker>
</defs>
${out.join('\n')}
</svg>`;

mkdirSync(dirname(SALIDA), { recursive: true });
writeFileSync(`${SALIDA}.svg`, svg, 'utf-8');
await sharp(Buffer.from(svg), { density: 200 }).png().toFile(`${SALIDA}.png`);
console.log(`Figura ${W}x${H} -> ${SALIDA}.png (y .svg)`);
