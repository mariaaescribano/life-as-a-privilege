import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { MariaGuard } from '../auth/maria.guard';
import { MailService } from '../mail/mail.service';

/** Un PDF de informe pesa unos cientos de KB; 12 MB es holgado y evita que alguien llene la memoria. */
const MAX_PDF = 12 * 1024 * 1024;
const MAX_DESTINATARIOS = 10;
const EMAIL = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/;

interface CuerpoInforme {
  /** Los correos a los que se manda, separados por coma, punto y coma, espacio o salto de línea. */
  para?: string;
  asunto?: string;
  mensaje?: string;
  /** La clave de la disciplina elegida (su foto y su letra visten el correo). */
  disciplina?: string;
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
  @UseInterceptors(FileInterceptor('pdf', { limits: { fileSize: MAX_PDF, files: 1 } }))
  async enviar(@UploadedFile() pdf: Express.Multer.File | undefined, @Body() b: CuerpoInforme) {
    const asunto = (b.asunto ?? '').trim().slice(0, 200);
    if (!asunto) return { success: false, error: 'Falta el asunto' };
    if (!pdf?.buffer?.length) return { success: false, error: 'Falta el PDF' };
    // Un PDF de verdad empieza por «%PDF»: no se manda por correo cualquier cosa con extensión .pdf.
    if (pdf.buffer.subarray(0, 4).toString('latin1') !== '%PDF') return { success: false, error: 'El archivo no es un PDF' };

    const prueba = b.prueba === '1';
    const lista = prueba
      ? [process.env.NOTIFY_EMAIL ?? '']
      : Array.from(new Set((b.para ?? '').split(/[\s,;]+/).map((e) => e.trim().toLowerCase()).filter(Boolean)));
    if (!lista.length || lista.some((e) => !EMAIL.test(e))) {
      return { success: false, error: 'Revisa los correos: alguno no es válido' };
    }
    if (lista.length > MAX_DESTINATARIOS) return { success: false, error: `Máximo ${MAX_DESTINATARIOS} correos por envío` };

    const nombre = (pdf.originalname || 'informe.pdf').replace(/[^\w.\- ]+/g, '_').slice(0, 100);
    const resultados: { a: string; ok: boolean }[] = [];
    for (const a of lista) {
      const ok = await this.mail.enviarInforme(a, prueba ? `[Prueba] ${asunto}` : asunto, b.mensaje ?? '', {
        nombre: nombre.toLowerCase().endsWith('.pdf') ? nombre : `${nombre}.pdf`,
        contenido: pdf.buffer,
      }, b.disciplina);
      resultados.push({ a, ok });
    }
    const fallidos = resultados.filter((r) => !r.ok).map((r) => r.a);
    return fallidos.length === resultados.length
      ? { success: false, error: 'No se pudo enviar el correo', resultados }
      : { success: true, resultados, ...(fallidos.length ? { aviso: `No llegó a: ${fallidos.join(', ')}` } : {}) };
  }
}
