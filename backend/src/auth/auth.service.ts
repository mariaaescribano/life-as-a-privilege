import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  /** Firma el token de sesión (30 días, ver auth.module.ts). */
  generateToken(userId: string, email?: string, admin = false) {
    return this.jwtService.sign({ sub: userId, email, admin });
  }
}
