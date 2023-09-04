import Phaser from "phaser";
import { useEffect } from "react";
import "phaser";



// custom scene class
export class GameScene extends Phaser.Scene {
    playerEntities: { [index: number]: any } = {};
    ballEntity: any = undefined;
    ballAngle : any = Math.random()*(3 - (-3)) -3;
    ballDirection : any = 10;
    emitter : any;
    playerTurn : number = 0;
    preload() {
      // preload scene
      this.load.image('particule','/sadnessAchievement.png');
    }

    create() {
        this.emitter = this.add.particles(0, 0, 'particule', {
            speed: 0,
            scale: {
                start: 0.07,
                end: 0
            },
            alpha: {
                start: 1,
                end: 0
            },
            frequency: 10,
            lifespan: 300
        });
        this.ballEntity = this.add.rectangle(400, 300, 15, 15, 0x0000ff);
        this.emitter.startFollow(this.ballEntity);
        this.playerEntities[0] = this.add.rectangle(10, 300, 10, 100, 0x00ff00);
        this.playerEntities[1] = this.add.rectangle(790, 300, 10, 100, 0xff0000);
    }

    update(time: number, delta: number): void {
        this.ballEntity.x += this.ballDirection;
        this.ballEntity.y += this.ballAngle;
        if (this.ballEntity.y <= 7.5 || this.ballEntity.y >= 592.5) this.ballAngle *= -1;
        if (this.ballEntity.x <= 22.5 || this.ballEntity.x >= 777.5) this.ballDirection *= -1;
        if (this.ballEntity.x <= 22.5){
            this.playerTurn = 0;
            this.ballAngle = (this.ballEntity.y - this.playerEntities[0].y) / 8;
        }
        if (this.ballEntity.x >= 777.5){
            this.playerTurn = 1;
            this.ballAngle = (this.ballEntity.y - this.playerEntities[1].y) / 8;
        }
        if (this.playerTurn == 1){
            if (this.ballEntity.y-50 > this.playerEntities[0].y) this.playerEntities[0].y +=10;
            else if (this.ballEntity.y-30 > this.playerEntities[0].y) this.playerEntities[0].y +=3;
            else if (this.ballEntity.y-10 > this.playerEntities[0].y) this.playerEntities[0].y +=2;
            if (this.ballEntity.y+50 < this.playerEntities[0].y) this.playerEntities[0].y -=10;
            else if (this.ballEntity.y+30 < this.playerEntities[0].y) this.playerEntities[0].y -=3;
            else if (this.ballEntity.y+10 < this.playerEntities[0].y) this.playerEntities[0].y -=2;
            if (550 < this.playerEntities[0].y) this.playerEntities[0].y =550;
            if (50 > this.playerEntities[0].y) this.playerEntities[0].y =50;
        }
        else{
            if (this.ballEntity.y-50 > this.playerEntities[1].y) this.playerEntities[1].y +=10;
            else if (this.ballEntity.y-30 > this.playerEntities[1].y) this.playerEntities[1].y +=3;
            else if (this.ballEntity.y-10 > this.playerEntities[1].y) this.playerEntities[1].y +=2;
            if (this.ballEntity.y+50 < this.playerEntities[1].y) this.playerEntities[1].y -=10;
            else if (this.ballEntity.y+30 < this.playerEntities[1].y) this.playerEntities[1].y -=3;
            else if (this.ballEntity.y+15 < this.playerEntities[1].y) this.playerEntities[1].y -=2;
            if (550 < this.playerEntities[1].y) this.playerEntities[1].y =550;
            if (50 > this.playerEntities[1].y) this.playerEntities[1].y =50;
        }
    }
}

// game config
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    physics: { default: "arcade" },
    pixelArt: true,
    scene: [ GameScene ],
    scale : {autoCenter : Phaser.Scale.CENTER_HORIZONTALLY}
    
};

export default function Index() {
    useEffect(() => {
      loadGame();
    }, [])};
  
    const loadGame = async () => {
      if (typeof window !== "object") {
        return;
      }
    };

// instantiate the game
const game = new Phaser.Game(config);