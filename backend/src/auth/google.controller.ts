import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class GoogleController {
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // Passport redirige automáticamente a Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleCallback(@Req() req: any, @Res() res: any) {
    const { token, user } = req.user;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const params = new URLSearchParams({
      token,
      userId: user.id,
      name: user.name,
      img: user.img ?? '',
    });
    return res.redirect(`${frontendUrl}/auth/google/callback?${params.toString()}`);
  }
}
