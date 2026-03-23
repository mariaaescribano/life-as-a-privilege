import { Controller, Get, Query, Res } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Controller('auth')
export class GoogleController {
  constructor(private readonly userService: UserService) {}

  // ── Redirige al consentimiento de Google ──
  @Get('google')
  googleLogin(@Res() res: any) {
    const clientId   = process.env.GOOGLE_CLIENT_ID;
    const callbackUrl = encodeURIComponent(
      process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
    );
    const scope = encodeURIComponent('email profile');
    const url   = `https://accounts.google.com/o/oauth2/v2/auth`
                + `?client_id=${clientId}`
                + `&redirect_uri=${callbackUrl}`
                + `&response_type=code`
                + `&scope=${scope}`
                + `&access_type=offline`;
    return res.redirect(url);
  }

  // ── Google redirige aquí tras el login ──
  @Get('google/callback')
  async googleCallback(@Query('code') code: string, @Res() res: any) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    try {
      // 1. Intercambiar el código por tokens
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id:     process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          redirect_uri:  process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
          grant_type:    'authorization_code',
          code,
        }).toString(),
      });
      const tokens = await tokenRes.json() as any;
      if (tokens.error) throw new Error(tokens.error_description || tokens.error);

      // 2. Obtener datos del usuario de Google
      const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      const googleUser = await userInfoRes.json() as any;

      // 3. Encontrar o crear el usuario en nuestra BD
      const result = await this.userService.findOrCreateGoogleUser({
        email: googleUser.email,
        name:  googleUser.name || googleUser.email.split('@')[0],
        img:   googleUser.picture || null,
      });

      // 4. Redirigir al frontend con token + datos
      const params = new URLSearchParams({
        token:  result!.token,
        userId: result!.user.id,
        name:   result!.user.name,
        img:    result!.user.img ?? '',
      });
      return res.redirect(`${frontendUrl}/auth/google/callback?${params.toString()}`);

    } catch (err) {
      console.error('Error en Google OAuth:', err);
      return res.redirect(`${frontendUrl}/logIn?error=google_auth_failed`);
    }
  }
}
