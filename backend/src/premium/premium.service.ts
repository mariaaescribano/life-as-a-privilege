import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { DatabaseService } from '../database.service';
import { MailService } from '../mail/mail.service';
import { WhatsappService } from './whatsapp.service';
import { isAccesoLibreEmail } from '../auth/admin.util';
import { youtubeId } from './youtube.util';

/** Cinco euros al mes. Cada pago da UN mes; no se guarda ninguna tarjeta. */
export const PRECIO_PREMIUM_CENTIMOS = 500;
/** Días de antelación con los que se avisa de que toca renovar. */
const DIAS_AVISO_RENOVACION = 3;

export type TipoPremium = 'podcast' | 'reel';
const TIPOS: TipoPremium[] = ['podcast', 'reel'];

/** Un mes más (de calendario) a partir de `base`. */
export function masUnMes(base: Date): Date {
  const d = new Date(base);
  const dia = d.getDate();
  d.setDate(1); // sin esto, el 31 de enero + 1 mes desborda al 3 de marzo
  d.setMonth(d.getMonth() + 1);
  const ultimo = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(dia, ultimo));
  return d;
}

@Injectable()
export class PremiumService {
  private readonly stripe: Stripe;

  constructor(
    private readonly db: DatabaseService,
    private readonly mail: MailService,
    private readonly whatsapp: WhatsappService,
  ) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY no está configurado en el entorno');
    this.stripe = new Stripe(key);
  }

  private get frontendUrl(): string {
    return (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');
  }

  // ═════════════════════════════════════════════════════════════════════════
  // PAGO
  // ═════════════════════════════════════════════════════════════════════════

  /**
   * Checkout de un mes. Sin `userId` (aún no tiene cuenta): al volver pasa por
   * /premium/registro, donde crea la cuenta y reclama el pago. Con `userId`
   * (renovar): el pago ya es de esa cuenta y vuelve directo a /premium/avisos.
   */
  async crearCheckout(userId?: string) {
    const pmc = process.env.STRIPE_PMC?.trim();
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      ...(pmc ? { payment_method_configuration: pmc } : { payment_method_types: ['card' as const] }),
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: 'Contenido premium — 1 mes' },
          unit_amount: PRECIO_PREMIUM_CENTIMOS,
        },
        quantity: 1,
      }],
      metadata: { scope: 'premium', ...(userId ? { userId } : {}) },
      success_url: `${this.frontendUrl}/premium/${userId ? 'avisos' : 'registro'}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.frontendUrl}/premium`,
    });
    if (!session.url) throw new BadRequestException('Stripe no devolvió URL de checkout');
    return { url: session.url };
  }

  private async sesionPagada(sessionId: string): Promise<Stripe.Checkout.Session | null> {
    if (!sessionId) throw new BadRequestException('session_id requerido');
    let session: Stripe.Checkout.Session;
    try {
      session = await this.stripe.checkout.sessions.retrieve(sessionId);
    } catch {
      return null;
    }
    if (session.metadata?.scope !== 'premium' || session.payment_status !== 'paid') return null;
    return session;
  }

  /** Para /premium/registro: ¿hay un pago premium válido y sin reclamar? */
  async verificar(sessionId: string) {
    const session = await this.sesionPagada(sessionId);
    if (!session) return { ok: false as const };
    const { data } = await this.db.getClient().from('premium_pago').select('user_id').eq('session_id', sessionId).maybeSingle();
    return {
      ok: true as const,
      reclamado: !!(data as any)?.user_id,
      email: session.customer_details?.email ?? null,
    };
  }

  /** Lo llama el webhook (PaymentService) con cada sesión pagada de scope `premium`. */
  async registrarPago(session: Stripe.Checkout.Session) {
    await this.guardarPago(session);
    const userId = session.metadata?.userId;
    if (userId) await this.aplicar(session.id, userId);
  }

  private async guardarPago(session: Stripe.Checkout.Session) {
    const { error } = await this.db.getClient().from('premium_pago').upsert(
      { session_id: session.id, email: session.customer_details?.email ?? null },
      { onConflict: 'session_id', ignoreDuplicates: true },
    );
    if (error) throw new Error(`premium_pago: ${error.message}`);
  }

  /** La cuenta reclama un pago hecho antes de tener cuenta (o confirma una renovación). */
  async reclamar(sessionId: string, userId: string) {
    const session = await this.sesionPagada(sessionId);
    if (!session) throw new BadRequestException('Pago no encontrado o sin completar');
    if (session.metadata?.userId && session.metadata.userId !== userId) {
      throw new ForbiddenException('Este pago es de otra cuenta');
    }
    await this.guardarPago(session);
    await this.aplicar(sessionId, userId);
    return { ok: true };
  }

  /**
   * Da el mes a la cuenta, UNA sola vez por pago: el primero que llega (webhook o
   * reclamar) se queda el pago con un update condicionado a `user_id is null`.
   */
  private async aplicar(sessionId: string, userId: string) {
    const c = this.db.getClient();
    const { data: tomado } = await c.from('premium_pago')
      .update({ user_id: userId, reclamado_at: new Date().toISOString() })
      .eq('session_id', sessionId).is('user_id', null).select('session_id');
    if (!tomado?.length) {
      const { data } = await c.from('premium_pago').select('user_id').eq('session_id', sessionId).maybeSingle();
      if ((data as any)?.user_id && (data as any).user_id !== userId) throw new ConflictException('Este pago ya lo usó otra cuenta');
      return; // ya aplicado a esta cuenta
    }
    try {
      await this.extender(userId);
    } catch (err) {
      // Que el pago no se pierda: se suelta para poder reintentar.
      await c.from('premium_pago').update({ user_id: null, reclamado_at: null }).eq('session_id', sessionId);
      throw err;
    }
  }

  private async extender(userId: string) {
    const c = this.db.getClient();
    const { data, error } = await c.from('user').select('premium_hasta').eq('id', userId).maybeSingle();
    if (error) throw new Error(`premium_hasta: ${error.message}`);
    const actual = (data as any)?.premium_hasta ? new Date((data as any).premium_hasta) : null;
    const base = actual && actual.getTime() > Date.now() ? actual : new Date();
    const { error: e2 } = await c.from('user').update({ premium_hasta: masUnMes(base).toISOString() }).eq('id', userId);
    if (e2) throw new Error(`premium_hasta: ${e2.message}`);
  }

  // ═════════════════════════════════════════════════════════════════════════
  // CÓMO QUIERE QUE LE AVISEMOS
  // ═════════════════════════════════════════════════════════════════════════

  async guardarAvisos(userId: string, body: { email?: boolean; whatsapp?: boolean; telefono?: string }) {
    const email = body?.email === true;
    const whatsapp = body?.whatsapp === true;
    if (!email && !whatsapp) throw new BadRequestException('Elige al menos una forma de recibir los avisos');
    const cambios: Record<string, unknown> = {
      premium_aviso_email: email,
      premium_aviso_whatsapp: whatsapp,
      premium_avisos_elegidos: true,
    };
    if (whatsapp) {
      const tel = typeof body.telefono === 'string' ? body.telefono.replace(/[\s().-]/g, '') : '';
      if (tel) {
        if (!/^\+?\d{6,15}$/.test(tel)) throw new BadRequestException('Teléfono no válido');
        cambios.telefono = tel;
      } else {
        const { data } = await this.db.getClient().from('user').select('telefono').eq('id', userId).maybeSingle();
        if (!(data as any)?.telefono) throw new BadRequestException('Para recibir WhatsApp necesitamos tu teléfono');
      }
    }
    const { error } = await this.db.getClient().from('user').update(cambios).eq('id', userId);
    if (error) throw new Error(`avisos: ${error.message}`);
    return { ok: true };
  }

  // ═════════════════════════════════════════════════════════════════════════
  // CONTENIDO
  // ═════════════════════════════════════════════════════════════════════════

  /** ¿Puede ver el contenido? Pagado y vigente, o cuenta de acceso libre. */
  async tieneAcceso(userId: string, email?: string | null): Promise<boolean> {
    if (isAccesoLibreEmail(email)) return true;
    const { data } = await this.db.getClient().from('user').select('premium_hasta').eq('id', userId).maybeSingle();
    const hasta = (data as any)?.premium_hasta;
    return !!hasta && new Date(hasta).getTime() > Date.now();
  }

  private tipoValido(tipo: unknown): TipoPremium {
    if (!TIPOS.includes(tipo as TipoPremium)) throw new BadRequestException('tipo debe ser podcast o reel');
    return tipo as TipoPremium;
  }

  async listar(tipo: unknown) {
    const t = this.tipoValido(tipo);
    const { data, error } = await this.db.getClient().from('premium_contenido')
      .select('id, tipo, titulo, archivo, created_at').eq('tipo', t).order('created_at', { ascending: false });
    if (error) throw new Error(`premium_contenido: ${error.message}`);
    const filas = (data ?? []) as any[];
    if (!filas.length) return [];
    // `archivo` guarda el ID del vídeo de YouTube (se pega el enlace, no se sube nada).
    return filas.map((f) => ({ id: f.id, tipo: f.tipo, titulo: f.titulo, created_at: f.created_at, video: f.archivo }));
  }

  // ── Admin (María, desde el móvil) ──

  /** Guarda el enlace de YouTube y manda los avisos en segundo plano. */
  async publicar(body: { tipo?: unknown; titulo?: string; video?: string; mensaje?: string }) {
    const tipo = this.tipoValido(body?.tipo);
    const titulo = (body?.titulo ?? '').trim();
    if (!titulo) throw new BadRequestException('Falta el título');
    const video = youtubeId(body?.video);
    if (!video) throw new BadRequestException('El enlace tiene que ser de YouTube');
    const mensaje = (body?.mensaje ?? '').trim() || null;

    const { data, error } = await this.db.getClient().from('premium_contenido')
      .insert({ tipo, titulo, archivo: video, mensaje }).select('id').maybeSingle();
    if (error || !data) throw new Error(`premium_contenido: ${error?.message}`);

    const destinatarios = await this.destinatarios();
    // Sin await: una lista larga no debe dejar el móvil esperando.
    void this.avisar((data as any).id, tipo, titulo, mensaje, destinatarios);
    const quierenWhatsapp = destinatarios.filter((d) => d.premium_aviso_whatsapp && d.telefono);
    const automatico = this.whatsapp.configurado;
    return {
      id: (data as any).id,
      avisos: {
        email: destinatarios.filter((d) => d.premium_aviso_email).length,
        whatsapp: quierenWhatsapp.length,
        whatsappConfigurado: automatico,
        // Sin WhatsApp automático (Twilio), María los manda ella desde su propio móvil: la
        // página le da el texto y un botón por persona que abre su WhatsApp ya escrito.
        textoWhatsapp: this.textoWhatsapp(tipo, titulo, mensaje),
        manual: automatico ? [] : quierenWhatsapp.map((d) => ({ nombre: d.name ?? '', telefono: this.whatsapp.normalizar(d.telefono) })),
      },
    };
  }

  private async destinatarios() {
    const { data, error } = await this.db.getClient().from('user')
      .select('id, name, email, telefono, premium_aviso_email, premium_aviso_whatsapp')
      .gt('premium_hasta', new Date().toISOString());
    if (error) { console.error('[premium] destinatarios:', error.message); return []; }
    return (data ?? []) as any[];
  }

  /** Lo que se manda si María no escribe nada. */
  private textoRespaldo(tipo: TipoPremium, titulo: string): string {
    return tipo === 'reel'
      ? `Hay un reel nuevo: «${titulo}». Ya puedes verlo.`
      : `Hay un podcast nuevo: «${titulo}». Ya puedes escucharlo.`;
  }

  /** El WhatsApp: el mensaje de María (o el de respaldo) y el enlace a donde entrar. */
  private textoWhatsapp(tipo: TipoPremium, titulo: string, mensaje: string | null): string {
    return `${mensaje ?? this.textoRespaldo(tipo, titulo)}\n${this.frontendUrl}/premium/espacio`;
  }

  private async avisar(id: string, tipo: TipoPremium, titulo: string, mensaje: string | null, gente: any[]) {
    const texto = mensaje ?? this.textoRespaldo(tipo, titulo);
    const asunto = `${tipo === 'reel' ? 'Nuevo reel' : 'Nuevo podcast'}: ${titulo}`;
    let enviados = 0;
    for (const u of gente) {
      try {
        if (u.premium_aviso_email && u.email) {
          if (await this.mail.enviarAvisoPremium(u.email, u.name ?? '', asunto, texto)) enviados++;
        }
        if (this.whatsapp.configurado && u.premium_aviso_whatsapp && u.telefono) {
          if (await this.whatsapp.enviar(u.telefono, this.textoWhatsapp(tipo, titulo, mensaje))) enviados++;
        }
      } catch (err) {
        console.error(`[premium] aviso a ${u.id} falló:`, err);
      }
    }
    await this.db.getClient().from('premium_contenido').update({ avisados: enviados }).eq('id', id);
    console.log(`[premium] «${titulo}»: ${enviados} avisos enviados`);
  }

  /** Quién tiene el acceso al día y teléfono: la lista desde la que María escribe por WhatsApp. */
  async listarWhatsapp() {
    const gente = await this.destinatarios();
    return gente
      .filter((d) => d.telefono)
      .map((d) => ({ nombre: d.name ?? "", telefono: this.whatsapp.normalizar(d.telefono), eligio: d.premium_aviso_whatsapp === true }))
      // Primero quien lo pidió.
      .sort((a, b) => Number(b.eligio) - Number(a.eligio));
  }

  async listarAdmin() {
    const { data, error } = await this.db.getClient().from('premium_contenido')
      .select('id, tipo, titulo, avisados, created_at').order('created_at', { ascending: false });
    if (error) throw new Error(`premium_contenido: ${error.message}`);
    return data ?? [];
  }

  async borrar(id: string) {
    const c = this.db.getClient();
    const { data } = await c.from('premium_contenido').select('id').eq('id', id).maybeSingle();
    if (!data) throw new NotFoundException('No existe');
    await c.from('premium_contenido').delete().eq('id', id);
    return { ok: true };
  }

  // ═════════════════════════════════════════════════════════════════════════
  // RENOVACIÓN: cada mes, un correo (no guardamos la tarjeta)
  // ═════════════════════════════════════════════════════════════════════════

  /** Lo llama el cron diario: avisa a quien le quedan ≤3 días (o ya caducó) y no se le había avisado. */
  async avisarRenovaciones() {
    const limite = new Date(Date.now() + DIAS_AVISO_RENOVACION * 86400_000).toISOString();
    const { data, error } = await this.db.getClient().from('user')
      .select('id, name, email, premium_hasta, premium_renovacion_avisada')
      .not('premium_hasta', 'is', null).lte('premium_hasta', limite);
    if (error) throw new Error(`renovaciones: ${error.message}`);
    let avisados = 0;
    for (const u of (data ?? []) as any[]) {
      // Ya avisado por ESTE vencimiento (si renueva, `premium_hasta` cambia y vuelve a tocar).
      if (u.premium_renovacion_avisada && new Date(u.premium_renovacion_avisada).getTime() === new Date(u.premium_hasta).getTime()) continue;
      if (!u.email) continue;
      const ok = await this.mail.enviarRenovacionPremium(u.email, u.name ?? '', new Date(u.premium_hasta));
      if (!ok) continue;
      await this.db.getClient().from('user').update({ premium_renovacion_avisada: u.premium_hasta }).eq('id', u.id);
      avisados++;
    }
    return { avisados };
  }
}
