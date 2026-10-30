// Tests del contenido premium: pago de un mes sin cuenta previa, reclamarlo, no dar dos meses
// por un mismo pago, avisos por email/WhatsApp al subir contenido y aviso de renovación.
// Supabase y Stripe van de mentira (bdFalsa + un `stripe` suplantado).
import { BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common';
import { bdFalsa } from '../test-utils/bd-falsa';
import { PremiumService, masUnMes } from './premium.service';
import { WhatsappService } from './whatsapp.service';

const DIA = 86400_000;
const iso = (ms: number) => new Date(ms).toISOString();

function montar(usuarios: any[] = [], pagos: any[] = [], automatico = true) {
  process.env.STRIPE_SECRET_KEY = 'sk_test_falsa';
  const { tablas, databaseService } = bdFalsa({ user: usuarios, premium_pago: pagos, premium_contenido: [] });
  const db = databaseService;
  const mail = {
    enviarAvisoPremium: jest.fn(async () => true),
    enviarRenovacionPremium: jest.fn(async () => true),
  } as any;
  const whatsapp = new WhatsappService();
  jest.spyOn(whatsapp, 'enviar').mockResolvedValue(true);
  jest.spyOn(whatsapp, 'configurado', 'get').mockReturnValue(automatico);
  const service = new PremiumService(db, mail, whatsapp);
  const sesiones: Record<string, any> = {};
  (service as any).stripe = {
    checkout: {
      sessions: {
        retrieve: jest.fn(async (id: string) => { if (!sesiones[id]) throw new Error('no existe'); return sesiones[id]; }),
        create: jest.fn(async (p: any) => ({ url: 'https://stripe/checkout', ...p })),
      },
    },
  };
  const sesion = (id: string, extra: any = {}) =>
    (sesiones[id] = { id, payment_status: 'paid', metadata: { scope: 'premium' }, customer_details: { email: 'a@b.com' }, ...extra });
  return { service, tablas, mail, whatsapp, sesion, stripe: (service as any).stripe };
}

const user = (id: string, extra: any = {}) => ({ id, name: id, email: `${id}@x.com`, premium_hasta: null, ...extra });
const casiUnMes = (d: Date) => Math.abs(d.getTime() - masUnMes(new Date()).getTime()) < 5000;

describe('masUnMes', () => {
  it('suma un mes de calendario', () => {
    expect(masUnMes(new Date(2026, 4, 15)).getMonth()).toBe(5);
    expect(masUnMes(new Date(2026, 11, 15)).getFullYear()).toBe(2027);
  });
  it('el 31 de enero NO desborda a marzo: se queda en el último día de febrero', () => {
    const r = masUnMes(new Date(2026, 0, 31));
    expect(r.getMonth()).toBe(1);
    expect(r.getDate()).toBe(28);
  });
  it('en año bisiesto, 29 de febrero', () => {
    expect(masUnMes(new Date(2028, 0, 31)).getDate()).toBe(29);
  });
});

describe('Pago: crear el checkout', () => {
  it('sin cuenta: 5 €, scope premium y vuelve a /premium/registro', async () => {
    const { service, stripe } = montar();
    await service.crearCheckout();
    const p = stripe.checkout.sessions.create.mock.calls[0][0];
    expect(p.line_items[0].price_data.unit_amount).toBe(500);
    expect(p.mode).toBe('payment');
    expect(p.metadata).toEqual({ scope: 'premium' });
    expect(p.success_url).toContain('/premium/registro?session_id={CHECKOUT_SESSION_ID}');
  });
  it('renovando con cuenta: el pago lleva el userId y vuelve a /premium/avisos', async () => {
    const { service, stripe } = montar();
    await service.crearCheckout('u1');
    const p = stripe.checkout.sessions.create.mock.calls[0][0];
    expect(p.metadata).toEqual({ scope: 'premium', userId: 'u1' });
    expect(p.success_url).toContain('/premium/avisos?session_id=');
  });
});

describe('Reclamar un pago', () => {
  it('da UN mes a la cuenta', async () => {
    const { service, tablas, sesion } = montar([user('u1')]);
    sesion('cs_1');
    await service.reclamar('cs_1', 'u1');
    expect(casiUnMes(new Date(tablas.user[0].premium_hasta))).toBe(true);
    expect(tablas.premium_pago[0]).toMatchObject({ session_id: 'cs_1', user_id: 'u1' });
  });

  it('reclamarlo dos veces (recargar la página) NO da dos meses', async () => {
    const { service, tablas, sesion } = montar([user('u1')]);
    sesion('cs_1');
    await service.reclamar('cs_1', 'u1');
    const primera = tablas.user[0].premium_hasta;
    await service.reclamar('cs_1', 'u1');
    expect(tablas.user[0].premium_hasta).toBe(primera);
  });

  it('otra cuenta no puede usar un pago ya reclamado', async () => {
    const { service, sesion } = montar([user('u1'), user('u2')]);
    sesion('cs_1');
    await service.reclamar('cs_1', 'u1');
    await expect(service.reclamar('cs_1', 'u2')).rejects.toBeInstanceOf(ConflictException);
  });

  it('un pago de renovación de otra cuenta se rechaza', async () => {
    const { service, sesion } = montar([user('u1'), user('u2')]);
    sesion('cs_1', { metadata: { scope: 'premium', userId: 'u1' } });
    await expect(service.reclamar('cs_1', 'u2')).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('sin pagar, o de otra cosa (un libro), o inexistente → 400 y no se da nada', async () => {
    const { service, tablas, sesion } = montar([user('u1')]);
    sesion('sin_pagar', { payment_status: 'unpaid' });
    sesion('libro', { metadata: { libroId: 'x' } });
    for (const id of ['sin_pagar', 'libro', 'no_existe']) {
      await expect(service.reclamar(id, 'u1')).rejects.toBeInstanceOf(BadRequestException);
    }
    expect(tablas.user[0].premium_hasta).toBeNull();
  });

  it('renovar estando activo SUMA al vencimiento actual (no pierde los días que quedaban)', async () => {
    const hasta = Date.now() + 10 * DIA;
    const { service, tablas, sesion } = montar([user('u1', { premium_hasta: iso(hasta) })]);
    sesion('cs_2');
    await service.reclamar('cs_2', 'u1');
    expect(new Date(tablas.user[0].premium_hasta).getTime()).toBeCloseTo(masUnMes(new Date(hasta)).getTime(), -3);
  });

  it('renovar caducado cuenta desde HOY, no desde la fecha vieja', async () => {
    const { service, tablas, sesion } = montar([user('u1', { premium_hasta: iso(Date.now() - 40 * DIA) })]);
    sesion('cs_3');
    await service.reclamar('cs_3', 'u1');
    expect(casiUnMes(new Date(tablas.user[0].premium_hasta))).toBe(true);
  });
});

describe('Webhook (registrarPago)', () => {
  it('pago sin cuenta: se guarda, sin dar acceso a nadie', async () => {
    const { service, tablas, sesion } = montar([user('u1')]);
    await service.registrarPago(sesion('cs_1'));
    expect(tablas.premium_pago).toHaveLength(1);
    expect(tablas.premium_pago[0].user_id ?? null).toBeNull();
    expect(tablas.user[0].premium_hasta).toBeNull();
  });

  it('renovación con userId: da el mes aunque el navegador no vuelva', async () => {
    const { service, tablas, sesion } = montar([user('u1')]);
    await service.registrarPago(sesion('cs_1', { metadata: { scope: 'premium', userId: 'u1' } }));
    expect(casiUnMes(new Date(tablas.user[0].premium_hasta))).toBe(true);
  });

  it('webhook repetido + reclamar después = un solo mes', async () => {
    const { service, tablas, sesion } = montar([user('u1')]);
    const s = sesion('cs_1', { metadata: { scope: 'premium', userId: 'u1' } });
    await service.registrarPago(s);
    await service.registrarPago(s);
    await service.reclamar('cs_1', 'u1');
    expect(casiUnMes(new Date(tablas.user[0].premium_hasta))).toBe(true);
  });

  it('el pago llegado por webhook antes de crear la cuenta se puede reclamar luego', async () => {
    const { service, tablas, sesion } = montar([user('u1')]);
    const s = sesion('cs_1');
    await service.registrarPago(s);
    expect(await service.verificar('cs_1')).toMatchObject({ ok: true, reclamado: false, email: 'a@b.com' });
    await service.reclamar('cs_1', 'u1');
    expect(tablas.user[0].premium_hasta).not.toBeNull();
    expect(await service.verificar('cs_1')).toMatchObject({ ok: true, reclamado: true });
  });
});

describe('Cómo quiere recibir los avisos', () => {
  it('hay que elegir al menos una', async () => {
    const { service } = montar([user('u1')]);
    await expect(service.guardarAvisos('u1', {})).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.guardarAvisos('u1', { email: false, whatsapp: false })).rejects.toBeInstanceOf(BadRequestException);
  });
  it('solo email', async () => {
    const { service, tablas } = montar([user('u1')]);
    await service.guardarAvisos('u1', { email: true });
    expect(tablas.user[0]).toMatchObject({ premium_aviso_email: true, premium_aviso_whatsapp: false, premium_avisos_elegidos: true });
  });
  it('las dos a la vez, guardando el teléfono', async () => {
    const { service, tablas } = montar([user('u1')]);
    await service.guardarAvisos('u1', { email: true, whatsapp: true, telefono: '612 345 678' });
    expect(tablas.user[0]).toMatchObject({ premium_aviso_email: true, premium_aviso_whatsapp: true, telefono: '612345678' });
  });
  it('WhatsApp sin teléfono (y sin uno guardado) → 400', async () => {
    const { service, tablas } = montar([user('u1')]);
    await expect(service.guardarAvisos('u1', { whatsapp: true })).rejects.toBeInstanceOf(BadRequestException);
    expect(tablas.user[0].premium_avisos_elegidos).toBeUndefined();
  });
  it('WhatsApp usando el teléfono que ya tenía la cuenta', async () => {
    const { service, tablas } = montar([user('u1', { telefono: '600111222' })]);
    await service.guardarAvisos('u1', { whatsapp: true });
    expect(tablas.user[0].premium_aviso_whatsapp).toBe(true);
  });
  it('un teléfono que no lo es → 400', async () => {
    const { service } = montar([user('u1')]);
    await expect(service.guardarAvisos('u1', { whatsapp: true, telefono: 'hola' })).rejects.toBeInstanceOf(BadRequestException);
  });
});

describe('Acceso al contenido', () => {
  it('vigente sí, caducado no, sin pagar no', async () => {
    const { service } = montar([
      user('vivo', { premium_hasta: iso(Date.now() + DIA) }),
      user('caducado', { premium_hasta: iso(Date.now() - DIA) }),
      user('nunca'),
    ]);
    expect(await service.tieneAcceso('vivo', 'vivo@x.com')).toBe(true);
    expect(await service.tieneAcceso('caducado', 'caducado@x.com')).toBe(false);
    expect(await service.tieneAcceso('nunca', 'nunca@x.com')).toBe(false);
  });
  it('las cuentas de acceso libre entran sin pagar', async () => {
    process.env.ACCESO_LIBRE_EMAILS = 'amiga@x.com';
    const { service } = montar([user('amiga')]);
    expect(await service.tieneAcceso('amiga', 'amiga@x.com')).toBe(true);
    delete process.env.ACCESO_LIBRE_EMAILS;
  });
});

describe('Publicar contenido (enlaces de YouTube)', () => {
  const quienes = () => [
    user('conEmail', { premium_hasta: iso(Date.now() + 5 * DIA), premium_aviso_email: true, premium_aviso_whatsapp: false }),
    user('conWhatsapp', { premium_hasta: iso(Date.now() + 5 * DIA), premium_aviso_email: false, premium_aviso_whatsapp: true, telefono: '600111222' }),
    user('ambos', { premium_hasta: iso(Date.now() + 5 * DIA), premium_aviso_email: true, premium_aviso_whatsapp: true, telefono: '600333444' }),
    user('caducado', { premium_hasta: iso(Date.now() - DIA), premium_aviso_email: true }),
    user('nunca', { premium_aviso_email: true }),
  ];
  const esperarAvisos = () => new Promise((r) => setTimeout(r, 30));

  const V = "dQw4w9WgXcQ";
  it("valida: título, tipo y que el enlace sea de YouTube", async () => {
    const { service, tablas } = montar();
    await expect(service.publicar({ tipo: "reel", titulo: "", video: `https://youtu.be/${V}` })).rejects.toBeInstanceOf(BadRequestException);
    await expect(service.publicar({ tipo: "otro", titulo: "x", video: `https://youtu.be/${V}` })).rejects.toBeInstanceOf(BadRequestException);
    for (const malo of ["", "hola", "https://vimeo.com/123456789", "https://evil.com/watch?v=" + V, "https://youtube.com/watch?v=corto", "javascript:alert(1)"]) {
      await expect(service.publicar({ tipo: "reel", titulo: "x", video: malo })).rejects.toBeInstanceOf(BadRequestException);
    }
    expect(tablas.premium_contenido).toHaveLength(0);
  });

  it("guarda solo el ID de YouTube, venga el enlace como venga", async () => {
    for (const enlace of [
      `https://www.youtube.com/watch?v=${V}&t=90s`,
      `https://youtu.be/${V}?si=abc`,
      `https://www.youtube.com/shorts/${V}`,
      `https://m.youtube.com/watch?v=${V}`,
      `<iframe src="https://www.youtube.com/embed/${V}"></iframe>`,
      V,
    ]) {
      const { service, tablas } = montar();
      await service.publicar({ tipo: "reel", titulo: "R", video: enlace });
      expect(tablas.premium_contenido[0].archivo).toBe(V);
    }
  });

  it('avisa SOLO a quien está al día y según lo que eligió; con el texto de María', async () => {
    const { service, mail, whatsapp, tablas } = montar(quienes());
    const r = await service.publicar({ tipo: 'reel', titulo: 'Mi reel', video: `https://youtu.be/${V}`, mensaje: 'Hola, mira este' });
    expect(r.avisos).toMatchObject({ email: 2, whatsapp: 2 });
    await esperarAvisos();
    const correos = mail.enviarAvisoPremium.mock.calls.map((c: any[]) => c[0]).sort();
    expect(correos).toEqual(['ambos@x.com', 'conEmail@x.com']);
    expect(mail.enviarAvisoPremium.mock.calls[0][3]).toBe('Hola, mira este');
    const telefonos = (whatsapp.enviar as jest.Mock).mock.calls.map((c) => c[0]).sort();
    expect(telefonos).toEqual(['600111222', '600333444']);
    expect((whatsapp.enviar as jest.Mock).mock.calls[0][1]).toContain('Hola, mira este');
    expect((whatsapp.enviar as jest.Mock).mock.calls[0][1]).toContain('/premium/espacio');
    expect(tablas.premium_contenido[0]).toMatchObject({ titulo: 'Mi reel', avisados: 4 });
  });

  it('si María no escribe nada, sale el texto de respaldo (reel y podcast)', async () => {
    const a = montar(quienes());
    await a.service.publicar({ tipo: 'reel', titulo: 'R1', video: `https://youtu.be/${V}`, mensaje: '   ' });
    await esperarAvisos();
    expect(a.mail.enviarAvisoPremium.mock.calls[0][3]).toBe('Hay un reel nuevo: «R1». Ya puedes verlo.');
    const b = montar(quienes());
    await b.service.publicar({ tipo: 'podcast', titulo: 'P1', video: `https://youtu.be/${V}` });
    await esperarAvisos();
    expect(b.mail.enviarAvisoPremium.mock.calls[0][3]).toBe('Hay un podcast nuevo: «P1». Ya puedes escucharlo.');
  });

  describe("sin WhatsApp automático (tu propio WhatsApp)", () => {
    it("no intenta mandar por Twilio y devuelve a quién escribir, con el texto y el teléfono internacional", async () => {
      const { service, whatsapp, mail } = montar(quienes(), [], false);
      const r = await service.publicar({ tipo: "reel", titulo: "Mi reel", video: `https://youtu.be/${V}`, mensaje: "Hola, mira este" });
      await esperarAvisos();
      expect(whatsapp.enviar).not.toHaveBeenCalled();
      expect(mail.enviarAvisoPremium).toHaveBeenCalledTimes(2); // el email sigue siendo automático
      expect(r.avisos.whatsappConfigurado).toBe(false);
      expect(r.avisos.manual.map((m: any) => m.telefono).sort()).toEqual(["+34600111222", "+34600333444"]);
      expect(r.avisos.textoWhatsapp).toContain("Hola, mira este");
      expect(r.avisos.textoWhatsapp).toContain("/premium/espacio");
    });
    it("sin mensaje, el texto es el de respaldo", async () => {
      const { service } = montar(quienes(), [], false);
      const r = await service.publicar({ tipo: "podcast", titulo: "P1", video: `https://youtu.be/${V}` });
      expect(r.avisos.textoWhatsapp).toContain("Hay un podcast nuevo: «P1». Ya puedes escucharlo.");
    });
    it("con WhatsApp automático la lista manual va vacía", async () => {
      const { service } = montar(quienes(), [], true);
      const r = await service.publicar({ tipo: "reel", titulo: "R", video: `https://youtu.be/${V}` });
      expect(r.avisos.manual).toEqual([]);
    });
  });

  it("listarWhatsapp: solo quien tiene el acceso al día Y teléfono, primero los que lo pidieron", async () => {
    const { service } = montar([
      ...quienes(),
      user("sinTel", { premium_hasta: iso(Date.now() + 5 * DIA), premium_aviso_email: true }),
      user("noElige", { premium_hasta: iso(Date.now() + 5 * DIA), telefono: "611222333", premium_aviso_whatsapp: false }),
    ]);
    const l = await service.listarWhatsapp();
    expect(l.map((x: any) => x.telefono)).toEqual(expect.arrayContaining(["+34600111222", "+34600333444", "+34611222333"]));
    expect(l).toHaveLength(3); // ni caducados, ni sin teléfono
    expect(l[l.length - 1]).toMatchObject({ telefono: "+34611222333", eligio: false });
    expect(l[0].eligio).toBe(true);
  });

  it('un correo que falla no corta el resto de avisos', async () => {
    const { service, mail } = montar(quienes());
    mail.enviarAvisoPremium.mockRejectedValueOnce(new Error('smtp caído'));
    await service.publicar({ tipo: 'reel', titulo: 'R', video: `https://youtu.be/${V}` });
    await esperarAvisos();
    expect(mail.enviarAvisoPremium).toHaveBeenCalledTimes(2);
  });

  it("listar devuelve el ID de YouTube, lo más nuevo primero, solo del tipo pedido", async () => {
    const { service, tablas } = montar();
    tablas.premium_contenido.push(
      { id: "1", tipo: "reel", titulo: "viejo", archivo: "AAAAAAAAAAA", created_at: "2026-01-01" },
      { id: "2", tipo: "reel", titulo: "nuevo", archivo: "BBBBBBBBBBB", created_at: "2026-02-01" },
      { id: "3", tipo: "podcast", titulo: "pod", archivo: "CCCCCCCCCCC", created_at: "2026-03-01" },
    );
    const lista = await service.listar("reel");
    expect(lista.map((l: any) => l.titulo)).toEqual(["nuevo", "viejo"]);
    expect(lista[0].video).toBe("BBBBBBBBBBB");
    expect(await service.listar("podcast")).toHaveLength(1);
  });

  it('borrar quita la fila; si no existe → 404', async () => {
    const { service, tablas } = montar();
    tablas.premium_contenido.push({ id: '1', tipo: 'reel', titulo: 't', archivo: 'AAAAAAAAAAA' });
    await service.borrar('1');
    expect(tablas.premium_contenido).toHaveLength(0);
    await expect(service.borrar('1')).rejects.toThrow();
  });
});

describe('Aviso mensual de renovación (cron)', () => {
  it('avisa a quien vence en ≤3 días o ya caducó; no a quien le queda más ni a quien nunca pagó', async () => {
    const { service, mail } = montar([
      user('pronto', { premium_hasta: iso(Date.now() + 2 * DIA) }),
      user('caducado', { premium_hasta: iso(Date.now() - 5 * DIA) }),
      user('lejos', { premium_hasta: iso(Date.now() + 20 * DIA) }),
      user('nunca'),
    ]);
    const r = await service.avisarRenovaciones();
    expect(r.avisados).toBe(2);
    const a = mail.enviarRenovacionPremium.mock.calls.map((c: any[]) => c[0]).sort();
    expect(a).toEqual(['caducado@x.com', 'pronto@x.com']);
  });

  it('no repite el aviso por el mismo vencimiento (el cron corre cada día)', async () => {
    const { service, mail } = montar([user('pronto', { premium_hasta: iso(Date.now() + 2 * DIA) })]);
    await service.avisarRenovaciones();
    await service.avisarRenovaciones();
    expect(mail.enviarRenovacionPremium).toHaveBeenCalledTimes(1);
  });

  it('tras renovar (nuevo vencimiento) vuelve a avisar el mes siguiente', async () => {
    const { service, mail, tablas } = montar([user('u', { premium_hasta: iso(Date.now() + 2 * DIA) })]);
    await service.avisarRenovaciones();
    tablas.user[0].premium_hasta = iso(Date.now() + 2 * DIA + 1000); // renovó: otro vencimiento
    await service.avisarRenovaciones();
    expect(mail.enviarRenovacionPremium).toHaveBeenCalledTimes(2);
  });

  it('si el correo falla, no se marca como avisado (reintenta mañana)', async () => {
    const { service, mail } = montar([user('u', { premium_hasta: iso(Date.now() + DIA) })]);
    mail.enviarRenovacionPremium.mockResolvedValueOnce(false);
    expect((await service.avisarRenovaciones()).avisados).toBe(0);
    expect((await service.avisarRenovaciones()).avisados).toBe(1);
  });
});

describe('WhatsappService', () => {
  const whatsapp = new WhatsappService();
  it('normaliza a formato internacional', () => {
    expect(whatsapp.normalizar('612 345 678')).toBe('+34612345678');
    expect(whatsapp.normalizar('+44 7911 123456')).toBe('+447911123456');
    expect(whatsapp.normalizar('0034612345678')).toBe('+34612345678');
  });
  it('sin TWILIO_* (o sin número de WhatsApp) no manda nada y no revienta', async () => {
    delete process.env.TWILIO_ACCOUNT_SID;
    expect(whatsapp.configurado).toBe(false);
    expect(await whatsapp.enviar('612345678', 'hola')).toBe(false);
  });
  const conTwilio = async (extra: Record<string, string>, respuesta: any, fn: (falso: jest.Mock) => Promise<void>) => {
    Object.assign(process.env, { TWILIO_ACCOUNT_SID: "AC1", TWILIO_AUTH_TOKEN: "tok", TWILIO_WHATSAPP_FROM: "+34600000000", ...extra });
    const fetchOriginal = global.fetch;
    const falso = jest.fn(async () => respuesta);
    global.fetch = falso as any;
    try {
      await fn(falso);
    } finally {
      global.fetch = fetchOriginal;
      for (const k of ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_WHATSAPP_FROM", "TWILIO_WHATSAPP_TEMPLATE_SID"]) delete process.env[k];
    }
  };

  it("sin plantilla: texto libre, con prefijo whatsapp: en origen y destino y Basic auth", async () => {
    await conTwilio({}, { ok: true, text: async () => "" }, async (falso) => {
      expect(await whatsapp.enviar("612345678", "hola")).toBe(true);
      const [url, init] = falso.mock.calls[0] as any[];
      expect(url).toContain("/Accounts/AC1/Messages.json");
      expect(init.headers.Authorization).toBe(`Basic ${Buffer.from("AC1:tok").toString("base64")}`);
      const cuerpo = new URLSearchParams(String(init.body));
      expect(cuerpo.get("To")).toBe("whatsapp:+34612345678");
      expect(cuerpo.get("From")).toBe("whatsapp:+34600000000");
      expect(cuerpo.get("Body")).toBe("hola");
      expect(cuerpo.get("ContentSid")).toBeNull();
    });
  });

  it("con plantilla aprobada: manda su SID y el mensaje de María como variable {{1}} (no Body)", async () => {
    await conTwilio({ TWILIO_WHATSAPP_TEMPLATE_SID: "HX123" }, { ok: true, text: async () => "" }, async (falso) => {
      expect(await whatsapp.enviar("612345678", "Hay un reel nuevo")).toBe(true);
      const cuerpo = new URLSearchParams(String((falso.mock.calls[0] as any[])[1].body));
      expect(cuerpo.get("ContentSid")).toBe("HX123");
      expect(JSON.parse(cuerpo.get("ContentVariables")!)).toEqual({ 1: "Hay un reel nuevo" });
      expect(cuerpo.get("Body")).toBeNull();
    });
  });

  it("si Twilio rechaza el mensaje (p. ej. fuera de la ventana de 24 h) NO cuenta como enviado", async () => {
    await conTwilio({}, { ok: false, status: 400, text: async () => "63016" }, async () => {
      expect(await whatsapp.enviar("612345678", "hola")).toBe(false);
    });
  });
});
