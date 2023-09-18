import { Injectable, OnApplicationShutdown } from '@nestjs/common';

import * as http from 'http';

import { Server, Room } from 'colyseus';
import { GameDto } from './game.dto';
import { PrismaService } from './prisma/prisma.service';
import { Users } from './users/users.model';
import { connect } from 'http2';

type Type<T> = new (...args: any[]) => T;

@Injectable()
export class GameService implements OnApplicationShutdown {
  constructor(private prisma: PrismaService) {}
  server: Server = null;

  createServer(httpServer: http.Server) {
    if (this.server) return;

    this.server = new Server({ server: httpServer });
  }

  defineRoom(name: string, room: Type<Room<any, any>>) {
    this.server.define(name, room);
  }

  listen(port: number): Promise<unknown> {
    if (!this.server) return;
    return this.server.listen(port);
  }

  async createGameHistory(dto: GameDto) {
    const winner = await this.prisma.user.findUnique({
      where: {
        username: dto.winner,
      },
    });
    const looser = await this.prisma.user.findUnique({
      where: {
        username: dto.looser,
      },
    });
    const game = await this.prisma.game.create({
      data: {
        winner: { connect: winner },
        winnerScore: dto.winnerScore,
        looser: { connect: looser },
        looserScore: dto.looserScore,
      },
      include: { playerWinner: true, playerLooser: true },
    });
    return game;
  }

  async getGames(req: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.sub },
    });
    const games = await this.prisma.game.findMany({
      where: { OR: [{ winner: user }, { looser: user }] },
      include: { winner: true, looser: true },
    });
    games.forEach((game) => {
      delete game.winner.hash;
      delete game.looser.hash;
    });
    return games;
  }

  onApplicationShutdown(sig) {
    if (!this.server) return;
    console.info(
      `Caught signal ${sig}. Game service shutting down on ${new Date()}.`,
    );
    this.server.gracefullyShutdown();
  }
}
