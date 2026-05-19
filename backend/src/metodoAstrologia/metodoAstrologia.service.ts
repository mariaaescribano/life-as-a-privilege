import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database.service';
import { MailService } from '../mail/mail.service';
import { UserService } from '../user/user.service';

export interface SolicitudCarta {
  fecha_nacimiento: string; // YYYY-MM-DD
  hora_nacimiento: string;  // HH:MM
  pais: string;
  lugar: string;
  region: string;
}

@Injectable()
export class MetodoAstrologiaService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {}

  // ── GET completo ──
  async getMetodoAstrologia(userId: string) {
    const { data, error } = await this.databaseService.getClient()
      .from('metodo_astrologia')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('[metodoAstrologia.get] error:', error.message);
      return null;
    }
    return data ?? null;
  }

  // ── PATCH parcial (aviso_visto, data, link_carta…) ──
  async actualizar(userId: string, patch: Record<string, any>): Promise<{ success: boolean }> {
    const update = { ...patch, updated_at: new Date().toISOString() };
    const { error } = await this.databaseService.getClient()
      .from('metodo_astrologia')
      .upsert({ user_id: userId, ...update }, { onConflict: 'user_id' });

    if (error) {
      console.warn('[metodoAstrologia.actualizar] error:', error.message);
      return { success: false };
    }
    return { success: true };
  }

  // ── Solicitud de carta astral + email a la creadora ──
  async solicitarCarta(userId: string, datos: SolicitudCarta): Promise<{ success: boolean }> {
    const user = await this.userService.getUserById(userId).catch(() => null);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const { error } = await this.databaseService.getClient()
      .from('metodo_astrologia')
      .upsert(
        {
          user_id: userId,
          fecha_nacimiento: datos.fecha_nacimiento,
          hora_nacimiento: datos.hora_nacimiento,
          pais: datos.pais,
          lugar: datos.lugar,
          region: datos.region,
          solicitud_enviada_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' },
      );

    if (error) {
      console.warn('[metodoAstrologia.solicitar] error BD:', error.message);
      return { success: false };
    }

    // Email a la creadora — silencioso si el SMTP no está configurado
    await this.mailService.enviarSolicitudCarta(user.email, user.name, datos);

    return { success: true };
  }
}
