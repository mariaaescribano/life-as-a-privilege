
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

// jwt in imports can now be imported into anywhere

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || "b7f9c2d1e6a8f4b3c9d7e0f1a2b3c4d5", 
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
