// import { Room, Client } from '@colyseus/core';
// import { MyRoomState, Player, Ball } from './schema/MyRoomState';

// export class MyRoom extends Room<MyRoomState> {
//   maxClients = 2;
//   playerIndex = ['', ''];
//   direction = 1.05;
//   refresh = 0;
//   played = 0;
//   fixedTimeStep = 1000 / 60;

//   onCreate(options: any) {
//     this.setState(new MyRoomState());
//     let elapsedTime = 0;
//     this.setSimulationInterval((deltaTime) => {
//       elapsedTime += deltaTime;

//       while (elapsedTime >= this.fixedTimeStep) {
//         elapsedTime -= this.fixedTimeStep;
//         this.fixedTick(this.fixedTimeStep);
//       }
//     });
//     this.onMessage('type', (client, message) => {
//       //
//       // handle "type" message
//       //
//     });

//     this.onMessage('move', (client, data) => {
//       const player = this.state.players.get(client.sessionId);
//       player.y = data;
//       // this.state.players.forEach(() => {
//       //   player.y += data;
//       // });
//     });
//     this.onMessage('updateStatus', (client, data) => {
//       const player = this.state.players.get(client.sessionId);
//       player.status = data;
//       // this.state.players.forEach(() => {
//       //   player.y += data;
//       // });
//     });
//     this.onMessage('launch', (client, data) => {
//       // const player = this.state.players.get(client.sessionId);
//       // // console.log(player.status);
//       // // console.log(data);
//       this.clients.forEach((client) => {
//         const x = 100;
//         client.send('ball-start', x);
//       });
//       // if (client.sessionId==this.saucisse[0] && player.status == 2)
//       //   console.log("coucou");
//       // else if (client.sessionId==this.saucisse[1] && player.status == 3)
//       //   console.log("coucou");
//     });
//     this.onMessage('ball', (client, data) => {
//       const ball = this.state.balls;
//       ball.x = data.x;
//       ball.y = data.y;
//       console.log('BALL xy :', ball.x, ball.y);
//     });
//   }

//   onJoin(client: Client, options: any) {
//     console.log(client.sessionId, 'joined!');
//     const mapWidth = options[0];
//     const mapHeight = options[1];

//     // create Player instance
//     const player = new Player();
//     if (!this.playerIndex[0]) {
//       player.x = mapWidth * 0.01;
//       player.y = mapHeight / 2;
//       this.playerIndex[0] = client.sessionId;
//       player.get_ball = 1;
//     } else {
//       const ball = this.state.balls;
//       player.x = mapWidth * 0.99;
//       player.y = mapHeight / 2;
//       ball.r = 10;
//       ball.x = mapWidth / 2;
//       ball.y = mapHeight / 2;
//       ball.celerite = 1;
//       ball.angle = 0;
//       this.playerIndex[1] = client.sessionId;
//       player.get_ball = 0;
//     }
//     if (this.playerIndex[1] && this.playerIndex[0]) {
//       player.status = 1;
//     } else {
//       player.status = 0;
//     }
//     // place player in the map of players by its sessionId
//     // (client.sessionId is unique per connection!)
//     this.state.players.set(client.sessionId, player);
//   }

//   onLeave(client: Client, consented: boolean) {
//     console.log(client.sessionId, 'left!');
//     if (this.state.players.has(client.sessionId)) {
//       this.state.players.delete(client.sessionId);
//     }
//     if (this.playerIndex[0] == client.sessionId) {
//       this.playerIndex[0] = '';
//     } else {
//       this.playerIndex[1] = '';
//     }
//   }

//   onDispose() {
//     console.log('room', this.roomId, 'disposing...');
//   }

//   fixedTick(delta: number) {
//     // if (this.hasReachedMaxClients()) {
//     //   const player = this.clients.at(0);
//     //   const ball = this.state.balls;
//     // if (ball.y <= 0) ball.angle *= -1;
//     // if (ball.y >= data.h) ball.angle *= -1;
//     // if (
//     //   player.x < ball.x + 14 &&
//     //   player.x > ball.x - 14 &&
//     //   player.y - 50 < ball.y + 7.5 &&
//     //   player.y + 50 > ball.y - 7.5 &&
//     //   this.refresh == 0
//     // ) {
//     //   this.direction *= -1.05;
//     //   this.refresh += 5;
//     //   ball.angle = (ball.y - player.y) / 30;
//     // } else if (ball.x < 0 || ball.x > data.w) {
//     //   if (ball.x < 0) {
//     //     if (this.state.score[0] == 5) {
//     //       //send end game
//     //     } else {
//     //       this.state.score[0] += 1;
//     //       this.direction = 1;
//     //     }
//     //   } else {
//     //     if (this.state.score[1] == 5) {
//     //       //send end game
//     //     } else {
//     //       this.state.score[1] += 1;
//     //       this.direction = 1;
//     //     }
//     //   }
//     //   ball.y = data.w / 2;
//     //   ball.x = data.h / 2;
//     //   ball.angle = 0;
//     // } else {
//     // if (this.refresh != 0) this.refresh--;
//     // ball.x += this.direction;
//     // player.send("score", this.state.score);
//     // if (this.clients.at(0)) {
//     //   this.clients.at(0).send("ballPos", this.state.balls);
//     // }
//     // if (this.clients.at(1)) {
//     //   this.clients.at(1).send("ballPos", this.state.balls);
//     // }
//     // ball.y += ball.angle;
//     // }
//   }
// }
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
  host: Client;
  game: GameService;

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
      if (player.get_ball != 0) this.direction = 2.5;
    });
    this.onMessage('ball', (client, data) => {
      const player = this.state.players.get(client.sessionId);
      if (this.state.balls.y <= 0) this.state.balls.angle *= -1;
      if (this.state.balls.y >= data.h) this.state.balls.angle *= -1;
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
                cli.send('win', player_.username);
              } else {
                dto.looser = this.state.players.get(
                  this.host.sessionId,
                ).username;
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
                cli.send('loose', player_.username);
              } else {
                dto.winner = this.state.players.get(
                  this.host.sessionId,
                ).username;
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
          this.state.balls.x = data.w / 2;
          this.state.balls.angle = 0;
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