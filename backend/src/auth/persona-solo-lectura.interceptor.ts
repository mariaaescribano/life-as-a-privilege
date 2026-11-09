import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, of } from 'rxjs';

/**
 * María recorre la cuenta de una persona (cabecera `X-Persona`) para mirar, abrir y acompañar. Eso NO
 * puede dejar rastro en el progreso ni en las respuestas de la persona: si lo dejara, quien entra por
 * primera vez vería «llevas el 40 % del camino» sin haber pulsado nada, y los pasos aparecerían leídos.
 *
 * Por eso, con una persona abierta, todo lo que ESCRIBE el progreso o las respuestas de la persona se
 * descarta: se contesta que está bien (200) y no se toca la base de datos. Lo demás sigue igual: las
 * notas, la nota de página, el diario, y todas las rutas `admin` (abrir pasos, corregir datos de
 * nacimiento…) son cosas de María y funcionan como siempre.
 */
const ESCRIBEN = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

// Progreso y respuestas de la persona.
const PROGRESO_Y_RESPUESTAS =
  /^\/(metodo-(astrologia|psicologia|ayurveda|tcm|fisiologia|nutricion|cabala)|recorrido-progreso\/[^/]+\/avanzar|actividad|tcm|ayurveda|nutricion|cabala|fitoterapia|astrologia|respuesta)(\/|$)/;

@Injectable()
export class PersonaSoloLecturaInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    if (!req?.user?.suplantadoPor || !ESCRIBEN.has(req.method)) return next.handle();

    const ruta = String(req.originalUrl ?? req.url ?? '').split('?')[0].toLowerCase();
    const esDeMaria = /\/admin(\/|$)/.test(ruta) || /\/carta-natal\//.test(ruta);
    if (esDeMaria || !PROGRESO_Y_RESPUESTAS.test(ruta)) return next.handle();

    return of({ ok: true, success: true, ignorado: true });
  }
}
