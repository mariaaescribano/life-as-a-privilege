import { Body, Controller, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { MariaGuard } from '../auth/maria.guard';
import { MailService } from '../mail/mail.service';

/** Un PDF de informe pesa unos cientos de KB; 12 MB es holgado y evita que alguien llene la memoria. */
const MAX_PDF = 12 * 1024 * 1024;
const MAX_DESTINATARIOS = 10;
/** Fotos que se pueden añadir al correo (la pantalla las reduce antes de subirlas). */
const MAX_FOTOS = 6;
const MAX_FOTO = 6 * 1024 * 1024;
/** Otros PDF que María puede adjuntar, y el tope de todo el correo (Gmail admite 25 MB). */
const MAX_ADJUNTOS = 5;
const MAX_TOTAL = 22 * 1024 * 1024;

/** Qué tipo de imagen es de verdad, mirando los primeros bytes (no se fía del nombre ni del tipo que diga el navegador). */
function tipoDeImagen(b: Buffer): { tipo: string; ext: string } | null {
  if (b.length > 12 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { tipo: 'image/jpeg', ext: 'jpg' };
  if (b.length > 12 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { tipo: 'image/png', ext: 'png' };
  if (b.length > 12 && b.subarray(0, 4).toString('latin1') === 'RIFF' && b.subarray(8, 12).toString('latin1') === 'WEBP') return { tipo: 'image/webp', ext: 'webp' };
  if (b.length > 12 && b.subarray(0, 3).toString('latin1') === 'GIF') return { tipo: 'image/gif', ext: 'gif' };
  return null;
}
const EMAIL = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/;

interface CuerpoInforme {
  /** Los correos a los que se manda, separados por coma, punto y coma, espacio o salto de línea. */
  para?: string;
  asunto?: string;
  mensaje?: string;
  /** La clave de la disciplina elegida (su foto y su letra visten el correo). */
  disciplina?: string;
  /** 'marmol' = el correo lleva el fondo de mármol de la casa; cualquier otra cosa = la foto de la disciplina. */
  fondo?: string;
  /** '1' = no se adjunta el informe compuesto (solo el mensaje, las fotos y los PDF que suba). */
  sinInforme?: string;
  /** '1' = solo a NOTIFY_EMAIL (María), para ver cómo llega. */
  prueba?: string;
}

// «Informes»: el PDF que María monta en /admin/informes (se compone en el navegador) y manda por
// correo a quien ella diga. No se guarda nada: ni el PDF ni los destinatarios; queda en el correo
// (copia oculta a NOTIFY_EMAIL). SOLO María. Cada persona recibe su propio correo (nadie ve a los demás).
@Controller('informes')
@UseGuards(JwtAuthGuard, MariaGuard)
export class InformesController {
  constructor(private readonly mail: MailService) {}

  @Post('enviar')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'pdf', maxCount: 1 },
        { name: 'fotos', maxCount: MAX_FOTOS },
        { name: 'adjuntos', maxCount: MAX_ADJUNTOS },
      ],
      { limits: { fileSize: MAX_PDF, files: 1 + MAX_FOTOS + MAX_ADJUNTOS } },
    ),
  )
  async enviar(
    @UploadedFiles() archivos: { pdf?: Express.Multer.File[]; fotos?: Express.Multer.File[]; adjuntos?: Express.Multer.File[] },
    @Body() b: CuerpoInforme,
  ) {
    const pdf = archivos?.pdf?.[0];
    const asunto = (b.asunto ?? '').trim().slice(0, 200);
    if (!asunto) return { success: false, error: 'Falta el asunto' };
    const sinInforme = b.sinInforme === '1';
    if (!sinInforme && !pdf?.buffer?.length) return { success: false, error: 'Falta el PDF' };
    // Un PDF de verdad empieza por «%PDF»: no se manda por correo cualquier cosa con extensión .pdf.
    const esPdf = (f?: Express.Multer.File) => !!f?.buffer && f.buffer.subarray(0, 4).toString('latin1') === '%PDF';
    if (!sinInforme && !esPdf(pdf)) return { success: false, error: 'El archivo no es un PDF' };

    const prueba = b.prueba === '1';
    const lista = prueba
      ? [process.env.NOTIFY_EMAIL ?? '']
      : Array.from(new Set((b.para ?? '').split(/[\s,;]+/).map((e) => e.trim().toLowerCase()).filter(Boolean)));
    if (!lista.length || lista.some((e) => !EMAIL.test(e))) {
      return { success: false, error: 'Revisa los correos: alguno no es válido' };
    }
    if (lista.length > MAX_DESTINATARIOS) return { success: false, error: `Máximo ${MAX_DESTINATARIOS} correos por envío` };

    // Las fotos: solo imágenes de verdad y de tamaño razonable.
    const fotos: { nombre: string; contenido: Buffer; tipo: string }[] = [];
    for (const [i, f] of (archivos?.fotos ?? []).entries()) {
      const t = tipoDeImagen(f.buffer);
      if (!t) return { success: false, error: 'Una de las fotos no es una imagen válida' };
      if (f.buffer.length > MAX_FOTO) return { success: false, error: 'Una de las fotos pesa demasiado' };
      fotos.push({ nombre: `foto-${i + 1}.${t.ext}`, contenido: f.buffer, tipo: t.tipo });
    }

    // Los PDF que María sube además del informe.
    const limpiarNombre = (n: string) => {
      const base = (n || 'documento.pdf').replace(/[^\w.\- ]+/g, '_').slice(0, 100);
      return base.toLowerCase().endsWith('.pdf') ? base : `${base}.pdf`;
    };
    const adjuntos: { nombre: string; contenido: Buffer }[] = [];
    const usados = new Set<string>();
    for (const f of archivos?.adjuntos ?? []) {
      if (!esPdf(f)) return { success: false, error: 'Uno de los archivos adjuntos no es un PDF' };
      let n = limpiarNombre(f.originalname);
      for (let i = 2; usados.has(n.toLowerCase()); i++) n = n.replace(/(\.pdf)$/i, `-${i}$1`);
      usados.add(n.toLowerCase());
      adjuntos.push({ nombre: n, contenido: f.buffer });
    }
    if (sinInforme && !adjuntos.length && !fotos.length && !(b.mensaje ?? '').trim()) {
      return { success: false, error: 'El correo está vacío' };
    }
    const total = (pdf?.buffer?.length ?? 0) + adjuntos.reduce((s, x) => s + x.contenido.length, 0) + fotos.reduce((s, x) => s + x.contenido.length, 0);
    if (total > MAX_TOTAL) return { success: false, error: 'El correo pesa demasiado (máximo 22 MB entre PDF y fotos)' };

    const informe = !sinInforme && pdf ? { nombre: limpiarNombre(pdf.originalname || 'informe.pdf'), contenido: pdf.buffer } : undefined;
    const resultados: { a: string; ok: boolean }[] = [];
    for (const a of lista) {
      const ok = await this.mail.enviarInforme(a, prueba ? `[Prueba] ${asunto}` : asunto, b.mensaje ?? '', {
        pdf: informe,
        disciplina: b.disciplina,
        fondo: b.fondo,
        fotos,
        adjuntos,
      });
      resultados.push({ a, ok });
    }
    const fallidos = resultados.filter((r) => !r.ok).map((r) => r.a);
    return fallidos.length === resultados.length
      ? { success: false, error: 'No se pudo enviar el correo', resultados }
      : { success: true, resultados, ...(fallidos.length ? { aviso: `No llegó a: ${fallidos.join(', ')}` } : {}) };
  }
}
