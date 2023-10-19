import { Room, Client, ISendOptions } from '@colyseus/core';
import { MyRoomState, Player, Ball } from './schema/MyRoomState';
import { GameDto } from 'src/game.dto';
import { GameService } from 'src/game.service';
import { PrismaService } from 'src/prisma/prisma.service';

const prisma = new PrismaService();

export class MyRoomGameBonus extends Room<MyRoomState> {
  maxClients = 2;
  player = ['', ''];
  direction = 0;
  refresh = 0;
  bonus = 0;
  i = 0;
  mooving_ball = 0;
  host: Client;
  host_username: string;
  client_username: string;
  game: GameService;
  random = 0;

  onCreate(options: any) {
    this.game = new GameService(prisma);
    this.setState(new MyRoomState());
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
      const dto = new GameDto();
      if (this.host != cli) {
        dto.looser = this.host_username;
        dto.looserScore = this.state.score[1];
        dto.winner = this.client_username;
        dto.winnerScore = this.state.score[0];
      } else {
        dto.winner = this.host_username;
        dto.winnerScore = this.state.score[1];
        dto.looser = this.client_username;
        dto.looserScore = this.state.score[0];
      }
      this.game.createGameHistory(dto);
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
      if (this.bonus == 0 && player.status != 0) {
        const xBonus = Math.random() * (data.w / 1.5) + 50;
        const yBonus = Math.random() * (data.h / 1.5) + 50;
        this.random = Math.random();
        this.clients.forEach((client) => {
          client.send('spawnBonus', {
            x: xBonus,
            y: yBonus,
          });
        });
        this.bonus = 1;
      }
      if (
        data.bonusPos[0] - 10 < this.state.balls.x + 14 &&
        data.bonusPos[0] + 10 > this.state.balls.x - 14 &&
        data.bonusPos[1] - 10 < this.state.balls.y + 8 &&
        data.bonusPos[1] + 10 > this.state.balls.y - 8 &&
        this.bonus == 1
      ) {
        this.clients.forEach((cli) => {
          if (this.direction > 0 && this.host.sessionId == cli.sessionId) {
            if (this.random > 0.5)
              cli.send('touchBonus', { cli: this.host, wrong: 0 });
            else cli.send('touchBonus', { cli: this.host, wrong: 1 });
          } else if (this.direction < 0 && this.host.sessionId != cli.sessionId)
            if (this.random > 0.5)
              cli.send('touchBonus', { cli: cli, wrong: 0 });
            else cli.send('touchBonus', { cli: cli, wrong: 1 });
          else {
            if (this.random > 0.5)
              cli.send('otherTouch', { cli: cli, wrong: 0 });
            else cli.send('otherTouch', { cli: cli, wrong: 1 });
          }
        });
        this.bonus = 0;
      }
      if (
        player.x < this.state.balls.x + 14 &&
        player.x > this.state.balls.x - 14 &&
        player.y - data.playerHeight < this.state.balls.y + 8 &&
        player.y + data.playerHeight > this.state.balls.y - 8 &&
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
    console.log(client.sessionId, 'joined!');
    const mapWidth = options.dim[0];
    const mapHeight = options.dim[1];

    const player = new Player();
    player.username = options.name;
    // console.log(player.username);

    if (!this.player[0]) {
      player.x = mapWidth * 0.01;
      player.y = mapHeight / 2;
      this.player[0] = client.sessionId;
      this.host = client;
      this.host_username = player.username;
      player.get_ball = 1;
    } else {
      const ball = this.state.balls;
      this.client_username = player.username;
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
        if (player.username == options.name)
          client.send('Joined', { player: player, curent: 1 });
        else client.send('Joined', { player: player, curent: 0 });
      });
    });
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, 'left!');
    client.leave();
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...');
  }
}
