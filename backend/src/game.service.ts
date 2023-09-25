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
    await this.updateRatings(dto, 32);
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

  async getExpectedOutcome(
    winnerRating: any,
    looserRating: any,
  ): Promise<number> {
    const exponent = (looserRating - winnerRating) / 400;
    return 1 / (1 + Math.pow(10, exponent));
  }

  async updateRatings(dto: GameDto, kFactor: number = 32) {
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

    const winnerProfile = await this.prisma.profile.findUnique({
      where: { userId: winner.id },
    });
    const looserProfile = await this.prisma.profile.findUnique({
      where: { userId: looser.id },
    });

    const expectedOutcome = await this.getExpectedOutcome(
      winnerProfile.eloMatchMaking,
      looserProfile.eloMatchMaking,
    );

    const ratingChangeA = kFactor * (1 - expectedOutcome);
    const ratingChangeB = -kFactor * expectedOutcome;

    await this.prisma.profile.update({
      where: { userId: winner.id },
      data: { eloMatchMaking: { increment: ratingChangeA } },
    });
    await this.prisma.profile.update({
      where: { userId: looser.id },
      data: { eloMatchMaking: { increment: ratingChangeB } },
    });
  }

  onApplicationShutdown(sig) {
    if (!this.server) return;
    console.info(
      `Caught signal ${sig}. Game service shutting down on ${new Date()}.`,
    );
    this.server.gracefullyShutdown();
  }
}
