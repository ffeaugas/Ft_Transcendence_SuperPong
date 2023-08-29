import { Room, Client } from '@colyseus/core';
import { MyRoomState, Player, Ball } from './schema/MyRoomState';

export class MyRoom extends Room<MyRoomState> {
  maxClients = 2;
  playerIndex = ['', ''];
  direction = 1.05;
  refresh = 0;
  played = 0;
  fixedTimeStep = 1000 / 60;

  onCreate(options: any) {
    this.setState(new MyRoomState());
    let elapsedTime = 0;
    this.setSimulationInterval((deltaTime) => {
      elapsedTime += deltaTime;

      while (elapsedTime >= this.fixedTimeStep) {
        elapsedTime -= this.fixedTimeStep;
        this.fixedTick(this.fixedTimeStep);
      }
    });
    this.onMessage('type', (client, message) => {
      //
      // handle "type" message
      //
    });

    this.onMessage('move', (client, data) => {
      const player = this.state.players.get(client.sessionId);
      player.y = data;
      // this.state.players.forEach(() => {
      //   player.y += data;
      // });
    });
    this.onMessage('updateStatus', (client, data) => {
      const player = this.state.players.get(client.sessionId);
      player.status = data;
      // this.state.players.forEach(() => {
      //   player.y += data;
      // });
    });
    this.onMessage('launch', (client, data) => {
      // const player = this.state.players.get(client.sessionId);
      // // console.log(player.status);
      // // console.log(data);
      this.clients.forEach((client) => {
        const x = 100;
        client.send('ball-start', x);
      });
      // if (client.sessionId==this.saucisse[0] && player.status == 2)
      //   console.log("coucou");
      // else if (client.sessionId==this.saucisse[1] && player.status == 3)
      //   console.log("coucou");
    });
    this.onMessage('ball', (client, data) => {
      const ball = this.state.balls;
      ball.x = data.x;
      ball.y = data.y;
      console.log('BALL xy :', ball.x, ball.y);
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, 'joined!');
    const mapWidth = options[0];
    const mapHeight = options[1];

    // create Player instance
    const player = new Player();
    if (!this.playerIndex[0]) {
      player.x = mapWidth * 0.01;
      player.y = mapHeight / 2;
      this.playerIndex[0] = client.sessionId;
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
      this.playerIndex[1] = client.sessionId;
      player.get_ball = 0;
    }
    if (this.playerIndex[1] && this.playerIndex[0]) {
      player.status = 1;
    } else {
      player.status = 0;
    }
    // place player in the map of players by its sessionId
    // (client.sessionId is unique per connection!)
    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, 'left!');
    if (this.state.players.has(client.sessionId)) {
      this.state.players.delete(client.sessionId);
    }
    if (this.playerIndex[0] == client.sessionId) {
      this.playerIndex[0] = '';
    } else {
      this.playerIndex[1] = '';
    }
  }

  onDispose() {
    console.log('room', this.roomId, 'disposing...');
  }

  fixedTick(delta: number) {
    // if (this.hasReachedMaxClients()) {
    //   const player = this.clients.at(0);
    //   const ball = this.state.balls;
    // if (ball.y <= 0) ball.angle *= -1;
    // if (ball.y >= data.h) ball.angle *= -1;
    // if (
    //   player.x < ball.x + 14 &&
    //   player.x > ball.x - 14 &&
    //   player.y - 50 < ball.y + 7.5 &&
    //   player.y + 50 > ball.y - 7.5 &&
    //   this.refresh == 0
    // ) {
    //   this.direction *= -1.05;
    //   this.refresh += 5;
    //   ball.angle = (ball.y - player.y) / 30;
    // } else if (ball.x < 0 || ball.x > data.w) {
    //   if (ball.x < 0) {
    //     if (this.state.score[0] == 5) {
    //       //send end game
    //     } else {
    //       this.state.score[0] += 1;
    //       this.direction = 1;
    //     }
    //   } else {
    //     if (this.state.score[1] == 5) {
    //       //send end game
    //     } else {
    //       this.state.score[1] += 1;
    //       this.direction = 1;
    //     }
    //   }
    //   ball.y = data.w / 2;
    //   ball.x = data.h / 2;
    //   ball.angle = 0;
    // } else {
    // if (this.refresh != 0) this.refresh--;
    // ball.x += this.direction;
    // player.send("score", this.state.score);
    // if (this.clients.at(0)) {
    //   this.clients.at(0).send("ballPos", this.state.balls);
    // }
    // if (this.clients.at(1)) {
    //   this.clients.at(1).send("ballPos", this.state.balls);
    // }
    // ball.y += ball.angle;
    // }
  }
}
