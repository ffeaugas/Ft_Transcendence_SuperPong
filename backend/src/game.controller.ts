import { Body, Controller, Get, Post } from '@nestjs/common';
import { GameService } from './game.service';
import { GameDto } from './game.dto';

@Controller('games')
export class GameController {
  constructor(private readonly game: GameService) {}

  @Post()
  async createGameHistory(@Body() dto: GameDto) {
    return await this.game.createGameHistory(dto);
  }

  @Get()
  async getGames() {
    return await this.game.getGames();
  }
}
