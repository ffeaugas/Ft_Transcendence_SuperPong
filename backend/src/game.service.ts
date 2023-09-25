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
      include: { winner: true, looser: true },
    });
    const winnerProfile = await this.prisma.profile.update({
      where: { userId: winner.id },
      data: {
        winCount: { increment: 1 },
      },
    });
    const looserProfile = await this.prisma.profile.update({
      where: { userId: looser.id },
      data: {
        loseCount: { increment: 1 },
      },
    });
    if (winnerProfile.winCount === 5) {
      const achievement = await this.prisma.achievement.findUnique({
        where: { title: 'Serial Winner' },
      });
      const updatedAchievement = await this.prisma.profile.update({
        where: { userId: winner.id },
        data: { achievements: { connect: achievement } },
      });
    }
    if (looserProfile.loseCount === 5) {
      const achievement = await this.prisma.achievement.findUnique({
        where: { title: 'Serial Looser' },
      });
      const updatedAchievement = await this.prisma.profile.update({
        where: { userId: looser.id },
        data: { achievements: { connect: achievement } },
      });
    }
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
