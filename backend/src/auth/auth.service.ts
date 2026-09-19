import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Firma el token de sesión.
   *
   * `opciones` solo hace falta para ENTRAR COMO otra persona desde el panel
   * (ver POST /user/admin/suplantar):
   *   · `suplantadoPor` — el id de la admin que está mirando. Viaja dentro del
   *     token para que el servidor sepa que esa sesión no es de la dueña de la
   *     cuenta, aunque a todos los efectos actúe como ella.
   *   · `duracionSegundos` — esa sesión prestada dura horas, no los 30 días
   *     normales (va en segundos porque es lo que acepta el firmado sin pelearse
   *     con los tipos de la librería).
   */
  generateToken(
    userId: string,
    email?: string,
    admin = false,
    opciones: { suplantadoPor?: string; duracionSegundos?: number } = {},
  ) {
    const payload: Record<string, any> = { sub: userId, email, admin };
    if (opciones.suplantadoPor) payload.sup = opciones.suplantadoPor;
    return this.jwtService.sign(
      payload,
      opciones.duracionSegundos ? { expiresIn: opciones.duracionSegundos } : undefined,
    );
  }
}
