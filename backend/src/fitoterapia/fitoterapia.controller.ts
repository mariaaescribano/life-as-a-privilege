import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FitoterapiaService } from './fitoterapia.service';

@Controller('fitoterapia')
export class FitoterapiaController {
  constructor(private readonly fitoterapiaService: FitoterapiaService) {}

  /* POST /fitoterapia
     Body: { idPlanta: number, idUser: string }
     Guarda la planta como favorita del usuario */
  @Post()
  async addFavorito(@Body() body: { idPlanta: number; idUser: string }) {
    return await this.fitoterapiaService.addFavorito(body.idPlanta, body.idUser);
  }

  /* GET /fitoterapia/:userId
     Devuelve todos los favoritos del usuario */
  @Get(':userId')
  async getFavoritosByUser(@Param('userId') userId: string) {
    return await this.fitoterapiaService.getFavoritosByUser(userId);
  }

  /* DELETE /fitoterapia/:userId/:idPlanta
     Elimina la planta de los favoritos del usuario */
  @Delete(':userId/:idPlanta')
  async removeFavorito(
    @Param('userId') userId: string,
    @Param('idPlanta') idPlanta: string,
  ) {
    return await this.fitoterapiaService.removeFavorito(userId, parseInt(idPlanta));
  }
}
