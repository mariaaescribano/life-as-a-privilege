import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { DatabaseService } from '../database.service';

/** Fila reservada de `recorrido_progreso` donde queda apuntado el consentimiento. */
const CONSENTIMIENTO_SALUD = 'consentimiento-salud';

const METODOS_QUE_ESCRIBEN = new Set(['POST', 'PUT', 'PATCH']);

/**
 * Los datos del recorrido pueden ser de salud (art. 9 RGPD) y solo se pueden
 * guardar con el consentimiento explícito de la persona. Esta guarda lo exige
 * en el SERVIDOR, para que no dependa de que la interfaz haya pedido el permiso.
 *
 * Solo frena las peticiones que ESCRIBEN (POST, PUT, PATCH): leer, y sobre todo
 * borrar, se puede hacer siempre (quien retira el consentimiento tiene que
 * poder borrar lo suyo). Va después de `JwtAuthGuard`, que pone `req.user`.
 */
@Injectable()
export class ConsentimientoSaludGuard implements CanActivate {
  constructor(private readonly databaseService: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (!METODOS_QUE_ESCRIBEN.has(req.method)) return true;

    const userId: string | undefined = req.user?.userId;
    if (!userId) throw new ForbiddenException('No autenticado');

    const { data, error } = await this.databaseService
      .getClient()
      .from('recorrido_progreso')
      .select('updated_at')
      .eq('user_id', userId)
      .eq('disciplina', CONSENTIMIENTO_SALUD)
      .maybeSingle();

    if (error || !data) {
      throw new ForbiddenException(
        'Falta el consentimiento para guardar datos de salud',
      );
    }
    return true;
  }
}
