import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

// Destinatario de las solicitudes de carta astral (lecturas de /metodo/astrologia).
// Usa NOTIFY_EMAIL (igual que contacto/reservas/suscripción); el hardcode solo
// como último recurso si la variable no estuviera configurada.
const CARTA_ASTRAL_FALLBACK = 'darkcake141@gmail.com';

@Injectable()
export class MailService {
  private getTransporter() {
    const pass = (process.env.EMAIL_PASS ?? '').replace(/\s/g, '');
    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass,
      },
    });
  }

  // Envuelve el HTML en la tarjeta turquesa común a todos los correos.
  private plantilla(titulo: string, cuerpo: string): string {
    return `
      <div style="font-family: 'EB Garamond', Georgia, serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #008080; color: #ffffff; border-radius: 16px;">
        <h1 style="margin: 0 0 16px; letter-spacing: 0.04em;">${titulo}</h1>
        ${cuerpo}
      </div>
    `;
  }

  /** Dirección donde se guarda copia de lo que se manda (NOTIFY_EMAIL). */
  private get copiaAdmin(): string {
    return process.env.NOTIFY_EMAIL || CARTA_ASTRAL_FALLBACK;
  }

  private async enviar(
    to: string,
    subject: string,
    html: string,
    etiqueta: string,
    opciones?: {
      /**
       * Manda una copia OCULTA (bcc) a NOTIFY_EMAIL, para tener el correo
       * exacto que ha recibido la persona. Va en bcc y no en cc a propósito:
       * quien lo recibe no tiene por qué ver una dirección interna.
       */
      copiaAdmin?: boolean;
      /**
       * Imágenes incrustadas en el propio correo. Van dentro del mensaje (no
       * como enlace a un servidor), así que se ven aunque el cliente bloquee
       * las imágenes remotas y siguen ahí dentro de un año. En el HTML se
       * referencian con `src="cid:<cid>"`.
       */
      imagenes?: { cid: string; nombre: string; contenido: Buffer }[];
    },
    // Devuelve si el correo ha salido de verdad. Casi todos los envíos lo
    // ignoran (son avisos: si uno se pierde, no se cae nada), pero el del
    // estudio lo mira para poder decir en el log si ha salido o no.
  ): Promise<boolean> {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn(`[MailService] EMAIL_USER / EMAIL_PASS no configurados — ${etiqueta} no enviado.`);
      return false;
    }
    try {
      // Si la copia fuese a la MISMA cuenta que envía, se omite: Gmail no se
      // manda un correo a sí mismo a la bandeja de entrada (queda en Enviados).
      const copia =
        opciones?.copiaAdmin &&
        this.copiaAdmin.toLowerCase() !== (process.env.EMAIL_USER ?? '').trim().toLowerCase()
          ? this.copiaAdmin
          : undefined;

      await this.getTransporter().sendMail({
        from: `"Life as a Privilege" <${process.env.EMAIL_USER}>`,
        to,
        bcc: copia,
        subject,
        html,
        attachments: opciones?.imagenes?.map((img) => ({
          filename: img.nombre,
          content: img.contenido,
          cid: img.cid,
          contentType: 'image/png',
        })),
      });
      return true;
    } catch (err) {
      console.error(`[MailService] Error enviando ${etiqueta}:`, err);
      return false;
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Bienvenida al crear la cuenta. Su razón de ser es el ENLACE: quien se
  // registra y cierra la pestaña no siempre sabe volver (la web no vive en su
  // historial ni tiene la dirección a mano), así que el correo le deja
  // guardada la puerta de entrada a su cuenta.
  //
  // No lleva contraseña ni token: es un enlace público a /logIn, así que si el
  // correo se reenvía o se filtra no da acceso a nada.
  // ───────────────────────────────────────────────────────────────────────────
  async enviarBienvenidaCuenta(
    email: string,
    nombre: string,
    /** Cuenta creada con Google: ahí no hay contraseña que recordar ni recuperar. */
    opciones?: { conGoogle?: boolean },
  ): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const enlace = `${frontendUrl}/logIn`;
    const comoEntrar = opciones?.conGoogle
      ? 'Entras con el botón de Google, con este mismo correo.'
      : 'Entras con tu nombre o tu email y la contraseña que elegiste. Si algún día la olvidas, puedes recuperarla desde esa misma página.';
    const html = this.plantilla(
      'Tu cuenta ya existe',
      `
        <p style="font-size: 16px; line-height: 1.7; opacity: 0.92;">
          Hola <strong>${nombre}</strong>, bienvenida a <strong>Life as a Privilege</strong>.
          Tu cuenta ya está creada.
        </p>
        <p style="font-size: 16px; line-height: 1.7; opacity: 0.92;">
          <strong>Guarda este enlace para iniciar sesión en tu cuenta:</strong>
        </p>
        <p style="margin: 28px 0;">
          <a href="${enlace}"
             style="display: inline-block; padding: 14px 28px; border-radius: 999px;
                    border: 1.5px solid rgba(255,255,255,0.6); background: rgba(255,255,255,0.12);
                    color: #ffffff; text-decoration: none; letter-spacing: 0.14em;
                    text-transform: uppercase; font-weight: 700;">
            Iniciar sesión
          </a>
        </p>
        <p style="font-size: 13px; line-height: 1.6; opacity: 0.75;">
          Si el botón no funciona, copia esta dirección en tu navegador:<br />
          <span style="word-break: break-all;">${enlace}</span>
        </p>
        <p style="margin-top: 24px; font-size: 14px; opacity: 0.78;">
          ${comoEntrar}
        </p>
      `,
    );
    await this.enviar(
      email,
      'Guarda este enlace para entrar en tu cuenta — Life as a Privilege',
      html,
      'email de bienvenida',
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Recuperación de contraseña. El enlace lleva un token de un solo uso que
  // caduca en una hora (ver UserService.crearTokenRecuperacion).
  // ───────────────────────────────────────────────────────────────────────────
  async enviarRecuperacionPassword(email: string, nombre: string, enlace: string): Promise<void> {
    const html = this.plantilla(
      'Recupera tu contraseña',
      `
        <p style="font-size: 16px; line-height: 1.7; opacity: 0.92;">
          Hola <strong>${nombre}</strong>, has pedido restablecer la contraseña de tu cuenta.
        </p>
        <p style="font-size: 16px; line-height: 1.7; opacity: 0.92;">
          Pulsa el botón para elegir una nueva. El enlace <strong>caduca en 1 hora</strong> y
          solo se puede usar una vez.
        </p>
        <p style="margin: 28px 0;">
          <a href="${enlace}"
             style="display: inline-block; padding: 14px 28px; border-radius: 999px;
                    border: 1.5px solid rgba(255,255,255,0.6); background: rgba(255,255,255,0.12);
                    color: #ffffff; text-decoration: none; letter-spacing: 0.14em;
                    text-transform: uppercase; font-weight: 700;">
            Elegir nueva contraseña
          </a>
        </p>
        <p style="font-size: 13px; line-height: 1.6; opacity: 0.75;">
          Si el botón no funciona, copia esta dirección en tu navegador:<br />
          <span style="word-break: break-all;">${enlace}</span>
        </p>
        <p style="margin-top: 24px; font-size: 14px; opacity: 0.78;">
          Si no has pedido tú este cambio, puedes ignorar este correo: tu contraseña
          seguirá siendo la misma.
        </p>
      `,
    );
    await this.enviar(email, 'Recupera tu contraseña — Life as a Privilege', html, 'email de recuperación');
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Confirmación de compra de un libro. Lo dispara el webhook de Stripe, así que
  // llega aunque la persona cierre la pestaña nada más pagar.
  // ───────────────────────────────────────────────────────────────────────────
  async enviarLibroComprado(email: string, titulo: string, pdfLink: string): Promise<void> {
    const html = this.plantilla(
      'Tu libro está listo',
      `
        <p style="font-size: 16px; line-height: 1.7; opacity: 0.92;">
          Gracias por tu compra de <strong>${titulo}</strong>. Aquí tienes tu descarga:
        </p>
        <p style="margin: 28px 0;">
          <a href="${pdfLink}"
             style="display: inline-block; padding: 14px 28px; border-radius: 999px;
                    border: 1.5px solid rgba(255,255,255,0.6); background: rgba(255,255,255,0.12);
                    color: #ffffff; text-decoration: none; letter-spacing: 0.14em;
                    text-transform: uppercase; font-weight: 700;">
            Descargar el PDF
          </a>
        </p>
        <p style="font-size: 13px; line-height: 1.6; opacity: 0.75;">
          Si el botón no funciona, copia esta dirección en tu navegador:<br />
          <span style="word-break: break-all;">${pdfLink}</span>
        </p>
        <p style="margin-top: 24px; font-size: 14px; opacity: 0.78;">
          Guarda este correo: es tu copia del enlace de descarga.
        </p>
      `,
    );
    await this.enviar(email, `Tu libro: ${titulo}`, html, 'email de libro comprado');
  }

  // ───────────────────────────────────────────────────────────────────────────
  // Confirmación de que una disciplina de El Recorrido ha quedado desbloqueada.
  // También la dispara el webhook, por el mismo motivo.
  // ───────────────────────────────────────────────────────────────────────────
  async enviarDisciplinaDesbloqueada(email: string, nombre: string, disciplina: string): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const html = this.plantilla(
      `${disciplina} ya es tuya`,
      `
        <p style="font-size: 16px; line-height: 1.7; opacity: 0.92;">
          Hola <strong>${nombre}</strong>, tu pago se ha confirmado y
          <strong>${disciplina}</strong> ya está abierta en tu Mapa.
        </p>
        <p style="margin: 28px 0;">
          <a href="${frontendUrl}/home"
             style="display: inline-block; padding: 14px 28px; border-radius: 999px;
                    border: 1.5px solid rgba(255,255,255,0.6); background: rgba(255,255,255,0.12);
                    color: #ffffff; text-decoration: none; letter-spacing: 0.14em;
                    text-transform: uppercase; font-weight: 700;">
            Entrar en El Mapa
          </a>
        </p>
      `,
    );
    await this.enviar(email, `${disciplina} desbloqueada — Life as a Privilege`, html, 'email de disciplina');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // CORREOS DE LA CARTA ASTRAL (al usuario)
  //
  // Van con el turquesa del fondo de la web (#008080) y letra blanca, mandala
  // arriba, filete de menta y el botón abajo a la derecha (como los botones de
  // avanzar del recorrido). Tres correos:
  //
  //   1. «Tu carta ha sido registrada correctamente» — automático, al enviar
  //      (o corregir) los datos de nacimiento. Lleva sus datos.
  //   2. «Tu carta está en proceso de ser leída»     — a mano, botón del panel.
  //   3. «Tu carta ya ha sido leída»                 — a mano, botón del panel;
  //      lleva a «Puntos clave», que es donde se lee la carta.
  //
  // Todo el HTML va con tablas y estilos en línea (sin flex, sin grid, sin
  // imágenes de fondo): es lo único que se pinta igual en Gmail, Apple Mail y
  // Outlook.
  // ═══════════════════════════════════════════════════════════════════════════

  // Paleta: el turquesa del fondo de la web y letra blanca.
  private static readonly PALETA = {
    fondo: '#006b6b',      // turquesa más hondo, fuera de la tarjeta
    tarjeta: '#008080',    // el turquesa de la web
    caja: '#016d6d',       // caja interior (los datos)
    borde: '#5fc9c0',      // borde de la caja interior (menta de la marca)
    tinta: '#ffffff',      // blanco: títulos, datos y botón
    tintaSuave: '#eaf7f5', // blanco con una gota de menta, para el cuerpo
    menta: '#a9e6df',      // menta clara: antetítulos y filetes
    mentaTenue: '#4fada6', // filete fino
    pie: '#c6e9e5',        // menta pálida del pie
  };

  private static readonly SERIF =
    "'EB Garamond', Garamond, Georgia, 'Times New Roman', serif";

  /** Sobre de los correos de Astrología: mandala, filete, antetítulo,
   *  título y cuerpo. `preheader` es la línea que se lee en la bandeja de
   *  entrada junto al asunto (invisible dentro del correo). */
  private sobreAstro({
    titulo,
    preheader,
    cuerpo,
    antetitulo = 'Astrología · tu carta astral',
  }: {
    titulo: string;
    preheader: string;
    cuerpo: string;
    antetitulo?: string;
  }): string {
    const c = MailService.PALETA;
    const serif = MailService.SERIF;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const logo = `${frontendUrl}/img/icono/life.png`;

    return `
<div style="display:none;font-size:0;line-height:0;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${c.fondo};margin:0;padding:0;">
  <tr>
    <td align="center" style="padding:36px 12px 44px;">

      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:${c.tarjeta};border-radius:20px;">
        <!-- Mandala + marca -->
        <tr>
          <td align="center" style="padding:40px 44px 0;">
            <img src="${logo}" width="52" height="52" alt="" style="display:block;border:0;outline:none;text-decoration:none;" />
            <div style="font-family:${serif};font-size:11px;line-height:1.2;letter-spacing:0.3em;text-transform:uppercase;color:${c.menta};padding-top:16px;">
              Life as a Privilege
            </div>
          </td>
        </tr>

        <!-- Filete de menta -->
        <tr>
          <td style="padding:24px 44px 0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr><td height="1" style="height:1px;background:${c.mentaTenue};font-size:0;line-height:0;">&nbsp;</td></tr>
            </table>
          </td>
        </tr>

        <!-- Antetítulo + título -->
        <tr>
          <td style="padding:26px 44px 0;">
            <div style="font-family:${serif};font-size:11px;line-height:1.3;letter-spacing:0.22em;text-transform:uppercase;color:${c.menta};">
              ${antetitulo}
            </div>
            <h1 style="margin:12px 0 0;font-family:${serif};font-size:29px;line-height:1.28;font-weight:400;letter-spacing:0.01em;color:${c.tinta};">
              ${titulo}
            </h1>
          </td>
        </tr>

        <!-- Cuerpo -->
        <tr>
          <td style="padding:22px 44px 42px;font-family:${serif};">
            ${cuerpo}
          </td>
        </tr>
      </table>

      <!-- Pie, fuera de la tarjeta -->
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">
        <tr>
          <td align="center" style="padding:20px 24px 0;font-family:${serif};font-size:12px;line-height:1.7;color:${c.pie};">
            Te escribo desde <a href="${frontendUrl}" style="color:${c.menta};text-decoration:none;">Life as a Privilege</a>.<br />
            Este correo es solo para ti: nadie más ve tu carta.
          </td>
        </tr>
      </table>

    </td>
  </tr>
</table>`;
  }

  /** Párrafo del cuerpo. */
  private parrafo(texto: string, mt = 18): string {
    const c = MailService.PALETA;
    return `<p style="margin:${mt}px 0 0;font-family:${MailService.SERIF};font-size:17px;line-height:1.75;color:${c.tintaSuave};">${texto}</p>`;
  }

  /** Botón principal: blanco sólido sobre el turquesa (el contraste más alto de
   *  la paleta, para que se vea que se pulsa). Va ABAJO A LA DERECHA, como los
   *  botones de avanzar del recorrido. */
  private boton(href: string, label: string): string {
    const c = MailService.PALETA;
    return `
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:30px 0 0;">
              <tr>
                <td align="right">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="right">
                    <tr>
                      <td align="center" bgcolor="${c.tinta}" style="border-radius:999px;">
                        <a href="${href}" style="display:inline-block;padding:15px 32px;font-family:${MailService.SERIF};font-size:14px;line-height:1;letter-spacing:0.16em;text-transform:uppercase;font-weight:700;color:${c.tarjeta};text-decoration:none;border-radius:999px;">${label}</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>`;
  }

  /**
   * Dos botones en la misma fila: el de la izquierda secundario (contorno de
   * menta) y el de la derecha el principal (blanco sólido), abajo a la derecha
   * como el resto.
   *
   * Cada botón va en su propia tabla en línea, y no en dos celdas de una tabla
   * común, por dos motivos: en móvil el segundo baja solo cuando no cabe, y en
   * Outlook —que no entiende `inline-block`— quedan uno debajo del otro, que es
   * un apaño digno y no un desastre.
   */
  private dosBotones(
    secundario: { href: string; label: string },
    principal: { href: string; label: string },
  ): string {
    const c = MailService.PALETA;
    const serif = MailService.SERIF;
    const comun = `display:inline-block;font-family:${serif};font-size:13px;line-height:1;letter-spacing:0.14em;text-transform:uppercase;font-weight:700;text-decoration:none;border-radius:999px;`;

    return `
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:30px 0 0;">
              <tr>
                <td align="right">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-block;vertical-align:middle;margin:0 10px 10px 0;">
                    <tr>
                      <td align="center" style="border-radius:999px;border:1.5px solid ${c.borde};">
                        <a href="${secundario.href}" style="${comun}padding:13px 24px;color:${c.menta};">${secundario.label}</a>
                      </td>
                    </tr>
                  </table>
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-block;vertical-align:middle;margin:0 0 10px;">
                    <tr>
                      <td align="center" bgcolor="${c.tinta}" style="border-radius:999px;">
                        <a href="${principal.href}" style="${comun}padding:15px 30px;color:${c.tarjeta};">${principal.label}</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>`;
  }

  // ── 1. Automático: datos registrados ──────────────────────────────────────
  // Sale en cuanto la persona envía (o corrige) sus datos de nacimiento.
  async enviarCartaRegistrada(
    email: string,
    nombre: string,
    datos: { fecha_nacimiento: string; hora_nacimiento: string; pais: string; lugar: string; region: string },
    esCorreccion = false,
  ): Promise<void> {
    const c = MailService.PALETA;
    const serif = MailService.SERIF;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    // YYYY-MM-DD → DD-MM-YYYY (si no viene en ese formato, se deja tal cual).
    const fechaLegible = /^\d{4}-\d{2}-\d{2}/.test(datos.fecha_nacimiento)
      ? datos.fecha_nacimiento.slice(0, 10).split('-').reverse().join('-')
      : datos.fecha_nacimiento;
    const lugarLegible = [datos.lugar, datos.region, datos.pais]
      .map((s) => (s ?? '').trim())
      .filter(Boolean)
      .join(', ');

    // Caja de los datos: cada dato con su etiqueta en dorado y su valor en crema.
    const fila = (label: string, valor: string) => `
              <tr>
                <td style="padding:9px 0 0;font-family:${serif};font-size:11px;line-height:1.3;letter-spacing:0.2em;text-transform:uppercase;color:${c.menta};width:96px;vertical-align:top;">${label}</td>
                <td style="padding:9px 0 0;font-family:${serif};font-size:17px;line-height:1.4;color:${c.tinta};">${valor}</td>
              </tr>`;

    const cajaDatos = `
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 0;background:${c.caja};border:1px solid ${c.borde};border-radius:14px;">
              <tr>
                <td style="padding:20px 24px 24px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    ${fila('Fecha', fechaLegible)}
                    ${fila('Hora', datos.hora_nacimiento)}
                    ${fila('Lugar', lugarLegible || '—')}
                  </table>
                </td>
              </tr>
            </table>`;

    const html = this.sobreAstro({
      titulo: esCorreccion
        ? 'Tus datos corregidos han quedado registrados'
        : 'Tu carta ha sido registrada correctamente',
      preheader: esCorreccion
        ? 'Tu carta se ha vuelto a calcular con los datos buenos.'
        : 'Estos son los datos con los que se ha calculado tu carta.',
      cuerpo: `
            ${this.parrafo(
              esCorreccion
                ? `Hola <span style="color:${c.tinta};">${nombre}</span>, he recibido tus datos corregidos. Tu carta se ha vuelto a calcular con ellos, y estos son los que valen:`
                : `Hola <span style="color:${c.tinta};">${nombre}</span>, tus datos de nacimiento ya están guardados y tu carta está calculada. Estos son los datos con los que se ha hecho:`,
              0,
            )}
            ${cajaDatos}
            ${this.parrafo(
              `Si algo no es exacto —sobre todo la <span style="color:${c.tinta};">hora</span>, que es la que fija tu Ascendente y tus casas— entra en tu recorrido, pulsa <span style="color:${c.tinta};">Cambiar</span> y vuelve a enviarlos. Mientras tu carta no esté escrita, corregirla no cuesta nada.`,
              22,
            )}
            ${this.parrafo('A partir de aquí la leo yo misma, a mano. Te aviso cuando empiece y cuando esté terminada.')}
            ${this.boton(`${frontendUrl}/metodo/astrologia`, 'Ver mi recorrido')}`,
    });

    await this.enviar(
      email,
      esCorreccion
        ? 'Tus datos corregidos han quedado registrados'
        : 'Tu carta ha sido registrada correctamente',
      html,
      'email de carta registrada',
    );
  }

  // ── 2. A mano (panel): la carta está en proceso de ser leída ───────────────
  async enviarCartaEnProceso(email: string, nombre: string): Promise<void> {
    const c = MailService.PALETA;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const html = this.sobreAstro({
      titulo: 'Tu carta está en proceso de ser leída',
      preheader: 'Ya la tengo delante. Te aviso en cuanto esté escrita.',
      cuerpo: `
            ${this.parrafo(
              `Hola <span style="color:${c.tinta};">${nombre}</span>, ya tengo tu carta delante y he empezado a leerla.`,
              0,
            )}
            ${this.parrafo('La escribo a mano, mirando tu carta: los planetas, las casas y las relaciones que forman entre ellos. Eso lleva su tiempo, así que te pido un poco de paciencia, por favor.')}
            ${this.parrafo('No hace falta que esperes para seguir: puedes continuar con tu recorrido mientras yo escribo. Te aviso en cuanto esté terminada.')}
            ${this.boton(`${frontendUrl}/metodo/astrologia`, 'Seguir mi recorrido')}`,
    });

    // Copia oculta: igual que el de «carta leída», este lo manda ella desde el panel.
    await this.enviar(email, 'Tu carta está en proceso de ser leída', html, 'email de carta en proceso', {
      copiaAdmin: true,
    });
  }

  // ── 3. A mano (panel): la carta ya está leída ─────────────────────────────
  // El enlace lleva SIEMPRE a «Puntos clave» del recorrido, que es donde se lee
  // la carta. (Ya no se manda ningún PDF de Drive.)
  async enviarCartaLeida(email: string, nombre: string): Promise<void> {
    const c = MailService.PALETA;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const destino = `${frontendUrl}/metodo/astrologia/lectura`;

    const html = this.sobreAstro({
      titulo: 'Tu carta ya ha sido leída',
      preheader: 'Te espera en Puntos clave. Léela con calma.',
      cuerpo: `
            ${this.parrafo(
              `Hola <span style="color:${c.tinta};">${nombre}</span>, he terminado de leer tu carta. Ya te espera en tu recorrido, en <span style="color:${c.tinta};">Puntos clave</span>.`,
              0,
            )}
            ${this.parrafo('Ahí tienes lo que más me ha llamado la atención de tu cielo: cada punto es una estrella que puedes abrir para leer lo que he escrito sobre ti.')}
            ${this.parrafo('Léela sin prisa y sin juzgarte: en tu carta no hay nada bueno ni malo. Si quieres que la recorramos juntas, puedes agendar una llamada desde tu recorrido.')}
            ${this.boton(destino, 'Leer mi carta')}`,
    });

    // Copia oculta a NOTIFY_EMAIL: este correo lo manda ella a mano desde el
    // panel, y quiere tener delante exactamente lo que le ha llegado a la persona.
    await this.enviar(email, 'Tu carta ya ha sido leída', html, 'email de carta leída', {
      copiaAdmin: true,
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ESTUDIO ESTADÍSTICO — gracias por participar
  //
  // Sale cuando alguien deja sus datos en /estudio. Del estudio NO se sabe el
  // nombre (solo el email), así que el correo no saluda por nombre: nunca se
  // deduce del email.
  //
  // El correo lleva SU CARTA DIBUJADA dentro (PNG incrustado, no un enlace a
  // ninguna parte): se ve al abrir el correo, aunque el cliente bloquee las
  // imágenes remotas, y sigue ahí dentro de un año. Quien la dibuja es
  // estudio/cartaPng.ts; aquí solo se coloca.
  // ═══════════════════════════════════════════════════════════════════════════
  async enviarGraciasEstudio(
    email: string,
    opciones?: {
      /** Su carta ya rasterizada (estudio/cartaPng.ts). Sin ella, correo sin dibujo. */
      cartaPng?: Buffer;
      /**
       * El precio de la primera disciplina. `antes` es el precio de referencia
       * que va tachado: solo se manda si esa disciplina ha estado de verdad a
       * ese precio (tachar una cifra que nunca se cobró es precio de referencia
       * falso, y es sancionable). Sin `precio` no sale la caja.
       */
      precio?: { ahora: string; antes?: string };
      /** A dónde lleva el botón principal. Por defecto, crear la cuenta (/signIn). */
      enlace?: string;
      /** A dónde lleva «Ver el Mapa». Por defecto, la presentación de El Mapa. */
      enlaceMapa?: string;
    },
    /** Devuelve si ha salido: quien llama lo escribe en el log. */
  ): Promise<boolean> {
    const c = MailService.PALETA;
    const serif = MailService.SERIF;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    // A crear la cuenta directamente: el correo ya le ha explicado qué hay
    // dentro, así que el botón hace lo siguiente y no lo vuelve a contar. Y al
    // lado, la salida para quien todavía quiere mirar antes de decidir: El Mapa
    // entero, que es la página pública donde están las ocho disciplinas.
    const destino = opciones?.enlace ?? `${frontendUrl}/signIn`;
    const destinoMapa = opciones?.enlaceMapa ?? `${frontendUrl}/elMetodo`;
    const p = opciones?.precio;

    // ── Su carta, dibujada ──
    // Va incrustada con `cid:` (nunca como enlace a un servidor): así se ve al
    // abrir el correo sin tener que pulsar «mostrar imágenes». El ancho en el
    // atributo y no solo en el CSS, que Outlook ignora el CSS de las imágenes.
    // Sin pie de foto: el dibujo se explica solo.
    const CID_CARTA = 'carta-natal';
    const cajaCarta = opciones?.cartaPng
      ? `
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 0;">
              <tr>
                <td align="center">
                  <img src="cid:${CID_CARTA}" width="512" alt="Tu carta natal"
                       style="display:block;width:100%;max-width:512px;height:auto;border:0;outline:none;text-decoration:none;" />
                </td>
              </tr>
            </table>`
      : '';

    // La caja del precio. No hay código ni cupón: es el precio que hay, y lo que
    // empuja es que está por debajo de lo que va a estar.
    const cajaPrecio = p
      ? `
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:30px 0 0;background:${c.caja};border:1px solid ${c.borde};border-radius:14px;">
              <tr>
                <td align="center" style="padding:24px 26px 26px;font-family:${serif};">
                  <div style="font-size:11px;line-height:1.3;letter-spacing:0.22em;text-transform:uppercase;color:${c.menta};">
                    Astrología · la primera disciplina
                  </div>
                  <div style="padding-top:12px;font-size:38px;line-height:1;color:${c.tinta};font-weight:700;">
                    ${p.ahora}${
                      p.antes
                        ? ` <span style="font-size:19px;font-weight:400;color:${c.pie};text-decoration:line-through;">${p.antes}</span>`
                        : ''
                    }
                  </div>
                  <div style="font-size:16px;line-height:1.6;color:${c.menta};padding-top:14px;">
                    Aprovecha que está en un precio reducido.
                  </div>
                </td>
              </tr>
            </table>`
      : '';

    const html = this.sobreAstro({
      antetitulo: 'Estudio de astrología',
      titulo: 'Gracias: esta es tu carta',
      preheader: 'Tu cielo dibujado, y por dónde seguir si quieres entenderlo.',
      cuerpo: `
            ${this.parrafo(
              'Gracias por participar. Así estaba el cielo en el momento y el lugar en que naciste:',
              0,
            )}
            ${cajaCarta}
            ${/* El puente al Recorrido: va justo encima del precio, que es a
                  donde empuja. */ ''}
            ${this.parrafo(
              'Si te has sentido identificado con los resultados, quizá haya llegado el momento de profundizar y usar la Astrología como una herramienta de autoconocimiento.',
              26,
            )}
            ${/* Lo que hay dentro, en una línea suelta y en menta: es la promesa
                  del correo, y suelta pesa más que metida en el párrafo. */ ''}
            <div style="margin:16px 0 0;font-family:${serif};font-size:18px;line-height:1.6;color:${c.menta};">
              Una lectura real y profunda, hecha por mí.
            </div>
            ${cajaPrecio}
            ${this.dosBotones(
              { href: destinoMapa, label: 'Ver el Mapa' },
              { href: destino, label: 'Entrar en Astrología' },
            )}
            ${/* Debajo del botón: quita el miedo a pulsarlo (no hay suscripción
                  ni hay que pagar para mirar). */ ''}
            <div style="margin:22px 0 0;font-family:${serif};font-size:14px;line-height:1.7;color:${c.pie};">
              Crea una cuenta sin compromiso, se paga por disciplinas y una vez que estés dentro.
            </div>`,
    });

    // Copia oculta a NOTIFY_EMAIL: este correo sale solo, sin que nadie lo
    // dispare, así que la copia es la forma de VER que está saliendo (y de leer
    // exactamente lo que ha recibido esa persona) sin mirar los logs.
    return await this.enviar(
      email,
      'Gracias por participar: esta es tu carta',
      html,
      'email de gracias del estudio',
      {
        copiaAdmin: true,
        imagenes: opciones?.cartaPng
          ? [{ cid: CID_CARTA, nombre: 'tu-carta-natal.png', contenido: opciones.cartaPng }]
          : undefined,
      },
    );
  }

  // Notifica a la creadora cuando un usuario solicita su carta astral.
  // La fecha llega en ISO (YYYY-MM-DD) y en el email se muestra DD-MM-YYYY.
  async enviarSolicitudCarta(
    userEmail: string,
    userName: string,
    datos: { fecha_nacimiento: string; hora_nacimiento: string; pais: string; lugar: string; region: string },
    // true cuando el usuario ya había enviado su solicitud y ahora CORRIGE los datos.
    esCorreccion = false,
  ): Promise<void> {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('[MailService] EMAIL_USER / EMAIL_PASS no configurados — solicitud de carta no enviada.');
      return;
    }

    // YYYY-MM-DD → DD-MM-YYYY (si no viene en ese formato, se deja tal cual).
    const fechaLegible = /^\d{4}-\d{2}-\d{2}/.test(datos.fecha_nacimiento)
      ? datos.fecha_nacimiento.slice(0, 10).split('-').reverse().join('-')
      : datos.fecha_nacimiento;

    const html = `
      <div style="font-family: 'EB Garamond', Georgia, serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #008080; color: #ffffff; border-radius: 16px;">
        <h1 style="margin: 0 0 16px; letter-spacing: 0.04em;">${
          esCorreccion ? 'Datos corregidos de carta astral' : 'Nueva solicitud de carta astral'
        }</h1>
        <p style="font-size: 16px; line-height: 1.7; opacity: 0.92;">
          <strong>${userName}</strong> (${userEmail}) ${
            esCorreccion
              ? 'ha corregido sus datos de nacimiento. Estos son los datos buenos:'
              : 'ha pedido su lectura de carta.'
          }
        </p>
        <div style="margin-top: 20px; padding: 16px 20px; background: rgba(255,255,255,0.12); border-radius: 12px;">
          <p style="margin: 6px 0; font-size: 15px;"><strong>Fecha:</strong> ${fechaLegible}</p>
          <p style="margin: 6px 0; font-size: 15px;"><strong>Hora:</strong> ${datos.hora_nacimiento}</p>
          <p style="margin: 6px 0; font-size: 15px;"><strong>País:</strong> ${datos.pais}</p>
          <p style="margin: 6px 0; font-size: 15px;"><strong>Lugar:</strong> ${datos.lugar}</p>
          <p style="margin: 6px 0; font-size: 15px;"><strong>Región:</strong> ${datos.region}</p>
        </div>
        <p style="margin-top: 24px; font-size: 14px; opacity: 0.78;">
          Cuando tengas la lectura lista, escríbela en el panel de administración
          (<strong>Astrología · textos</strong>) y pulsa <strong>Guardar</strong>. Cuando
          quieras que se entere, pulsa <strong>Avisar de que su carta está lista</strong>:
          ese botón es el único que le manda el email.
        </p>
      </div>
    `;

    const to = process.env.NOTIFY_EMAIL || CARTA_ASTRAL_FALLBACK;
    try {
      await this.getTransporter().sendMail({
        from: `"Life as a Privilege" <${process.env.EMAIL_USER}>`,
        to,
        replyTo: userEmail,
        subject: `${esCorreccion ? 'Datos corregidos' : 'Carta Astral'} de ${userEmail}`,
        html,
      });
    } catch (err) {
      console.error('[MailService] Error enviando solicitud de carta:', err);
    }
  }
}
