// Red de seguridad de las rutas premium: que nadie quite por descuido un guard.
// Se lee de los metadatos de Nest qué guards lleva cada ruta (sin arrancar el servidor).
import 'reflect-metadata';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { PremiumController, PremiumCronController } from './premium.controller';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminGuard } from '../auth/admin.guard';

const guards = (clase: any, metodo: string): any[] => Reflect.getMetadata('__guards__', clase.prototype[metodo]) ?? [];
const ruta = (clase: any, metodo: string) => ({
  verbo: Reflect.getMetadata('method', clase.prototype[metodo]), // 0 GET, 1 POST, 3 DELETE
  path: Reflect.getMetadata('path', clase.prototype[metodo]),
});

describe('Rutas /premium: quién puede entrar', () => {
  it('el pago sin cuenta y la verificación son públicos (se paga ANTES de registrarse)', () => {
    expect(guards(PremiumController, 'checkout')).toEqual([]);
    expect(guards(PremiumController, 'verify')).toEqual([]);
  });

  it.each(['renovar', 'reclamar', 'avisos', 'contenido'])('%s exige sesión', (m) => {
    expect(guards(PremiumController, m)).toContain(JwtAuthGuard);
  });

  it.each(['publicar', 'listarAdmin', 'listarWhatsapp', 'borrar'])('%s exige sesión Y ser admin', (m) => {
    const g = guards(PremiumController, m);
    expect(g).toContain(JwtAuthGuard);
    expect(g).toContain(AdminGuard);
  });

  it('las rutas admin viven bajo premium/admin/*', () => {
    for (const m of ['publicar', 'listarAdmin', 'listarWhatsapp', 'borrar']) {
      expect(String(ruta(PremiumController, m).path)).toMatch(/^admin\//);
    }
  });
});

describe('contenido: solo con el acceso vigente', () => {
  const montar = (acceso: boolean) => {
    const service: any = { tieneAcceso: jest.fn().mockResolvedValue(acceso), listar: jest.fn().mockResolvedValue(['x']) };
    return { controller: new PremiumController(service), service };
  };
  const req = { user: { userId: 'u1', email: 'a@x.com' } };

  it('sin acceso → 403 y no se lista nada', async () => {
    const { controller, service } = montar(false);
    await expect(controller.contenido(req, 'reel')).rejects.toBeInstanceOf(ForbiddenException);
    expect(service.listar).not.toHaveBeenCalled();
  });
  it('con acceso → lista', async () => {
    const { controller } = montar(true);
    await expect(controller.contenido(req, 'reel')).resolves.toEqual(['x']);
  });
});

describe('Cron de renovación: protegido por CRON_SECRET', () => {
  const montar = () => {
    const service: any = { avisarRenovaciones: jest.fn().mockResolvedValue({ avisados: 3 }) };
    return { controller: new PremiumCronController(service), service };
  };
  afterEach(() => { delete process.env.CRON_SECRET; });

  it('sin secreto configurado, nadie entra', async () => {
    const { controller, service } = montar();
    await expect(controller.renovacion('')).rejects.toBeInstanceOf(UnauthorizedException);
    await expect(controller.renovacion(undefined as any)).rejects.toBeInstanceOf(UnauthorizedException);
    expect(service.avisarRenovaciones).not.toHaveBeenCalled();
  });
  it('secreto incorrecto → 401', async () => {
    process.env.CRON_SECRET = 'bueno';
    const { controller, service } = montar();
    await expect(controller.renovacion('malo')).rejects.toBeInstanceOf(UnauthorizedException);
    expect(service.avisarRenovaciones).not.toHaveBeenCalled();
  });
  it('secreto correcto → corre el aviso', async () => {
    process.env.CRON_SECRET = 'bueno';
    const { controller } = montar();
    await expect(controller.renovacion('bueno')).resolves.toEqual({ avisados: 3 });
  });
});
