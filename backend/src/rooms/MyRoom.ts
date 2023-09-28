import { Room, Client, ISendOptions } from '@colyseus/core';
import { MyRoomState, Player, Ball } from './schema/MyRoomState';
import { GameDto } from 'src/game.dto';
import { GameService } from 'src/game.service';
import { PrismaService } from 'src/prisma/prisma.service';

const prisma = new PrismaService();

export class MyRoom extends Room<MyRoomState> {
  maxClients = 2;
  player = ['', ''];
  direction = 0;
  refresh = 0;
  i = 0;
  mooving_ball = 0;
  host: Client;
  game: GameService;

  async onCreate(options: any) {
    this.game = new GameService(prisma);
    this.setState(new MyRoomState());
    if (options.roomId) {
      this.roomId = options.roomId;
      // this.setPrivate(true);
    }
    this.onMessage('move', (client, data) => {
      const player = this.state.players.get(client.sessionId);
      player.y = data;
    });
    this.onMessage('updateStatus', (client, data) => {
      const player = this.state.players.get(client.sessionId);
      player.status = data;
      this.clients.forEach((client) => {
        client.send('status', 2);
      });
    });
    this.onMessage('launch', (client) => {
      const player = this.state.players.get(client.sessionId);
      if (player.get_ball != 0 && this.mooving_ball == 0) {
        this.direction = 2.5;
        this.mooving_ball = 1;
      }
    });
    this.onMessage('leave', (cli) => {
      this.clients.forEach((client) => {
        client.send('otherLeft');
      });
    });
    this.onMessage('ball', (client, data) => {
      const player = this.state.players.get(client.sessionId);
      if (this.mooving_ball == 0 && player.get_ball != 0) {
        this.state.balls.y = player.y;
      }
      if (this.state.balls.y <= 0) this.state.balls.angle *= -1;
      else if (this.state.balls.y >= data.h) this.state.balls.angle *= -1;
      if (
        player.x < this.state.balls.x + 14 &&
        player.x > this.state.balls.x - 14 &&
        player.y - 50 < this.state.balls.y + 8 &&
        player.y + 50 > this.state.balls.y - 8 &&
        this.refresh == 0
      ) {
        this.direction *= -1.05;
        this.refresh = 5;
        this.state.balls.angle = (this.state.balls.y - player.y) / 30;
        this.clients.forEach((client) => {
          client.send('boom', client);
        });
      } else if (this.state.balls.x < 0 || this.state.balls.x > data.w) {
        if (this.state.balls.x < 0) {
          this.state.score[1] += 1;
          if (this.state.score[1] == 5) {
            const dto = new GameDto();
            this.clients.forEach((cli) => {
              const player_ = this.state.players.get(cli.sessionId);
              if (this.host != cli) {
                dto.winner = player_.username;
                dto.winnerScore = this.state.score[1];
                cli.send('win', player_.username);
              } else {
                dto.looser = this.state.players.get(
                  this.host.sessionId,
                ).username;
                dto.looserScore = this.state.score[0];
                cli.send(
                  'loose',
                  this.state.players.get(this.host.sessionId).username,
                );
              }
              this.i++;
            });
            // CREE la ligne dans la db
            this.game.createGameHistory(dto);
          } else this.direction = -2.5;
        } else {
          this.state.score[0] += 1;
          if (this.state.score[0] == 5) {
            const dto = new GameDto();
            this.clients.forEach((cli) => {
              const player_ = this.state.players.get(cli.sessionId);
              if (this.host != cli) {
                dto.looser = player_.username;
                dto.looserScore = this.state.score[1];
                cli.send('loose', player_.username);
              } else {
                dto.winner = this.state.players.get(
                  this.host.sessionId,
                ).username;
                dto.winnerScore = this.state.score[0];
                cli.send(
                  'win',
                  this.state.players.get(this.host.sessionId).username,
                );
              }
              this.i++;
            });
            // CREE la ligne dans la dbs
            this.game.createGameHistory(dto);
          } else this.direction = 2.5;
        }
        if (this.state.score[1] != 5 || this.state.score[0] != 5) {
          this.state.balls.y = data.h / 2;
          this.state.balls.angle = 0;
          this.mooving_ball = 0;
          this.direction = 0;
          this.state.players.forEach((Fplayer) => {
            if (Fplayer.get_ball == 0) {
              Fplayer.get_ball = 1;
              if (Fplayer.x < data.w / 2) this.state.balls.x = Fplayer.x + 20;
              else this.state.balls.x = Fplayer.x - 20;
            } else if (Fplayer.get_ball == 1) {
              Fplayer.get_ball = 0;
            }
          });
        }
      } else {
        if (this.refresh != 0) this.refresh--;
        this.state.balls.x += this.direction;
        this.state.balls.y += this.state.balls.angle;
      }
      if (this.i == 0) client.send('score', this.state.score);
      client.send('ballPos', this.state.balls);
    });
  }

  onJoin(client: Client, options: any) {
    const mapWidth = options.dim[0];
    const mapHeight = options.dim[1];

    const player = new Player();
    player.username = options.name;
    if (!this.player[0]) {
      player.x = mapWidth * 0.01;
      player.y = mapHeight / 2;
      this.player[0] = client.sessionId;
      this.host = client;
      player.get_ball = 1;
    } else {
      const ball = this.state.balls;
      player.x = mapWidth * 0.99;
      player.y = mapHeight / 2;
      ball.r = 10;
      ball.x = mapWidth / 2;
      ball.y = mapHeight / 2;
      ball.celerite = 1;
      ball.angle = 0;
      this.player[1] = client.sessionId;
      player.get_ball = 0;
    }
    if (this.player[1] && this.player[0]) {
      player.status = 1;
    } else {
      player.status = 0;
    }
    this.state.players.set(client.sessionId, player);
    this.clients.forEach((client) => {
      this.state.players.forEach((player) => {
        client.send('Joined', player.username);
      });
    });
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, 'left!');
    this.state.players.delete(client.sessionId);
    if (this.player[0] == client.sessionId) {
      this.player[0] = '';
    } else {
      this.player[1] = '';
    }
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...');
  }
}
