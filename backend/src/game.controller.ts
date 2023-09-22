import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { GameDto } from './game.dto';
import { Request } from 'express';
import { AuthGuard } from './auth/auth.guard';

@Controller('games')
@UseGuards(AuthGuard)
export class GameController {
  constructor(private readonly game: GameService) {}

  @Post()
  async createGameHistory(@Body() dto: GameDto) {
    return await this.game.createGameHistory(dto);
  }

  @Get()
  async getGames(@Req() req: Request) {
    return await this.game.getGames(req);
  }
}
