
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

// jwt in imports can now be imported into anywhere

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
          throw new Error('JWT_SECRET no está configurado en el entorno');
        }
        return {
          secret,
          // 30 días. El frontend guarda el token en localStorage (aguanta al
          // cerrar el navegador), así que con 24h la sesión se caía igual al
          // día siguiente: la persona pagaba un recorrido, volvía y se
          // encontraba en la pantalla de login. No hay refresh token, así que
          // este número ES lo que dura la sesión. Al cerrar sesión el token se
          // borra del navegador.
          signOptions: { expiresIn: '30d' },
        };
      },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
