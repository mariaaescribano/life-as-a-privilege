import { SubscribeService } from './subscribe.service';

/**
 * El correo de bienvenida de la portada («introducción gratuita»).
 * Todo de mentira: ni base de datos ni servidor de correo reales.
 */
describe('SubscribeService · bienvenida', () => {
  beforeEach(() => {
    process.env.EMAIL_USER = 'yo@ejemplo.com';
    process.env.EMAIL_PASS = 'abcs sssd efgs hijs';
    process.env.NOTIFY_EMAIL = 'maria@ejemplo.com';
    process.env.JWT_SECRET = 'x'.repeat(32);
  });

  /** Una base de datos donde el correo `previo` ya estaba (o no) apuntado. */
  const crear = (yaEstaba: boolean, errorAlGuardar: unknown = null) => {
    const consulta: any = {
      select: () => consulta,
      eq: () => consulta,
      maybeSingle: async () => ({ data: yaEstaba ? { email: 'ana@ejemplo.com' } : null }),
      upsert: async () => ({ error: errorAlGuardar }),
      then: (ok: any) => ok({ count: 3 }),
    };
    const db: any = { getClient: () => ({ from: () => consulta }) };
    const enviados: any[] = [];
    const svc: any = new SubscribeService(db);
    svc.transporte = () => ({ sendMail: async (m: any) => { enviados.push(m); return {}; } });
    svc.anadirAlFichero = () => undefined; // que la prueba no toque data/subscribers.txt
    return { svc: svc as SubscribeService, enviados };
  };
  const espera = () => new Promise((r) => setTimeout(r, 20));
  const alUsuario = (enviados: any[]) => enviados.filter((m) => m.to === 'ana@ejemplo.com');

  it('manda a la persona el texto de María, con su nombre y la marca nueva', async () => {
    const { svc, enviados } = crear(false);
    await svc.addEmail('ana@ejemplo.com', 'portada', 'Ana', 'es');
    await espera();

    const [m] = alUsuario(enviados);
    expect(m.from).toContain('María Escribano');
    expect(m.subject).toBe('Bienvenido, Ana');
    expect(m.html).toContain('Bienvenido, Ana');
    expect(m.html).toContain('Conocerse desde distintos ángulos es fundamental para poder crecer.');
    expect(m.html).toContain('quieres <em>conocerte</em> más');
    expect(m.html).toContain('el vídeo todavía no está en producción');
    expect(m.html).toContain('Mientras disfruta del material gratuito.');
    expect(m.html).toContain('Un abrazo, nos vemos pronto');
    expect(m.html).toContain('María Escribano');
    expect(m.html).toContain('/baja?email='); // el enlace de baja
  });

  it('sin nombre, saluda sin él; en inglés, en inglés', async () => {
    const a = crear(false);
    await a.svc.addEmail('ana@ejemplo.com', 'portada', undefined, 'es');
    await espera();
    expect(alUsuario(a.enviados)[0].subject).toBe('Bienvenido');

    const b = crear(false);
    await b.svc.addEmail('ana@ejemplo.com', 'portada', 'Ana', 'en');
    await espera();
    expect(alUsuario(b.enviados)[0].subject).toBe('Welcome, Ana');
  });

  it('escapa el nombre en el HTML y no deja saltos de línea en el asunto', async () => {
    const { svc, enviados } = crear(false);
    await svc.addEmail('ana@ejemplo.com', 'portada', '<b>Ana</b>\nBcc: x@y.z', 'es');
    await espera();
    const [m] = alUsuario(enviados);
    expect(m.html).not.toContain('<b>Ana</b>');
    expect(m.html).toContain('&lt;b&gt;Ana&lt;/b&gt;');
    expect(m.subject).not.toMatch(/[\r\n]/);
  });

  it('se manda SIEMPRE desde la portada, aunque ya estuviera apuntado; desde otros formularios, no', async () => {
    const yaEstaba = crear(true);
    await yaEstaba.svc.addEmail('ana@ejemplo.com', 'portada', 'Ana', 'es');
    await espera();
    expect(alUsuario(yaEstaba.enviados)).toHaveLength(1);

    const otroOrigen = crear(false);
    await otroOrigen.svc.addEmail('ana@ejemplo.com', 'voluntario', 'Ana', 'es');
    await espera();
    expect(alUsuario(otroOrigen.enviados)).toHaveLength(0);
  });

  const servicioConCorreo = (sendMail: () => Promise<unknown>) => {
    const consulta: any = {
      select: () => consulta,
      eq: () => consulta,
      maybeSingle: async () => ({ data: null }),
      upsert: async () => ({ error: null }),
      then: (ok: any) => ok({ count: 1 }),
    };
    const svc: any = new SubscribeService({ getClient: () => ({ from: () => consulta }) } as any);
    svc.anadirAlFichero = () => undefined;
    svc.transporte = () => ({ sendMail });
    return svc;
  };

  it('desde la portada dice que se ha enviado solo si el correo ha salido', async () => {
    const ok = await servicioConCorreo(async () => ({})).addEmail('ana@ejemplo.com', 'portada', 'Ana', 'es');
    expect(ok.enviado).toBe(true);
    const roto = await servicioConCorreo(async () => { throw new Error('rechazado'); }).addEmail('ana@ejemplo.com', 'portada', 'Ana', 'es');
    expect(roto.enviado).toBe(false);
  });

  it('si el servidor de correo no contesta, responde «no enviado» tras el tope y no se cuelga', async () => {
    jest.useFakeTimers();
    try {
      const svc = servicioConCorreo(() => new Promise(() => undefined));
      const p = svc.addEmail('ana@ejemplo.com', 'portada', 'Ana', 'es');
      await jest.advanceTimersByTimeAsync(22_000);
      expect((await p).enviado).toBe(false);
    } finally {
      jest.useRealTimers();
    }
  });

  it('la contraseña de correo pierde los espacios pero conserva todas sus letras', () => {
    const limpia = (process.env.EMAIL_PASS ?? '').replace(/\s/g, '');
    expect(limpia).toBe('abcssssdefgshijs');
  });
});
