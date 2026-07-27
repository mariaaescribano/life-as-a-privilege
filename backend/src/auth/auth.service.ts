import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(userId: string, email?: string, admin = false) {
    const payload = { sub: userId, email, admin };
    return this.jwtService.sign(payload);
  }
}
