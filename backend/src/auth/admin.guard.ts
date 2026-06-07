import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { isAdminEmail } from './admin.util';

// Guard de administración. Debe usarse SIEMPRE después de JwtAuthGuard,
// de modo que req.user ya esté poblado con { userId, email }.
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    if (!isAdminEmail(req.user?.email)) {
      throw new ForbiddenException('Acceso restringido a administración');
    }
    return true;
  }
}
