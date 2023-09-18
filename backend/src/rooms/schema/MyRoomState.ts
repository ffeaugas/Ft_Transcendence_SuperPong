import { MapSchema, Schema, type } from '@colyseus/schema';

export class Player extends Schema {
  @type('number') x: number;
  @type('number') y: number;
  @type('number') status: number;
  @type('number') get_ball: number;
  @type('string') username: string;
  @type('string') PpUrl: string;
}

export class Ball extends Schema {
  @type('number') x: number;
  @type('number') y: number;
  @type('number') r: number;
  @type('number') celerite: number;
  @type('number') angle: number;
}

export class MyRoomState extends Schema {
  @type({ map: Player }) players = new MapSchema<Player>();
  @type(Ball) balls = new Ball();
  score = [0, 0];
}
