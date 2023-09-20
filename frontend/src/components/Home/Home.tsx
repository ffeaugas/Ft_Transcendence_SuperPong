import Phaser from "phaser";
import { useEffect } from "react";
import "phaser";

// custom scene class
export class Home extends Phaser.Scene {
    playerEntities: { [index: number]: any } = {};
    ballEntity: { [index: number]: any } = {};
    roger: any;
    ballAngle: any = Math.random() % 5;
    ballDirection: any = 10;
    emitter: any;
    playerTurn: number = 0;
    preload() {
        // preload scene
        this.roger = this.load.image("particule", "/sadnessAchievement.png");
        // this.load.texture("roger", "/sadnessAchievement.png");
    }

    create() {
        this.emitter = this.add.particles(0, 0, "particule", {
            speed: 0,
            scale: {
                start: 0.17,
                end: 0,
            },
            alpha: {
                start: 1,
                end: 0,
            },
            frequency: 10,
            lifespan: 300,
        });

        // this.ballEntity = this.add.rectangle(400, 300, 15, 15, 0x0000ff);
        this.ballEntity[0] = this.add.pointlight(400, 300, 0x1f0010, 275);
        this.ballEntity[1] = this.add
            .image(400, 300, "particule")
            .setScale(0.2);
        this.emitter.startFollow(this.ballEntity[1]);
        this.playerEntities[0] = this.add.rectangle(10, 300, 10, 100, 0x00ff00);
        this.playerEntities[1] = this.add.rectangle(
            790,
            300,
            10,
            100,
            0xff0000
        );
    }

    update(time: number, delta: number): void {
        this.ballEntity[0].x += this.ballDirection;
        this.ballEntity[1].x += this.ballDirection;
        this.ballEntity[0].y += this.ballAngle;
        this.ballEntity[1].y += this.ballAngle;
        if (this.ballEntity[1].y <= 7.5 || this.ballEntity[1].y >= 592.5)
            this.ballAngle = -this.ballAngle;
        else if (this.ballEntity[1].x <= 22.5 || this.ballEntity[1].x >= 777.5)
            this.ballDirection = -this.ballDirection;
        if (this.ballEntity[1].x <= 22.5) {
            this.playerTurn = 0;
            this.ballAngle =
                (this.ballEntity[1].y - this.playerEntities[0].y) / 7;
        }
        if (this.ballEntity[1].x >= 777.5) {
            this.playerTurn = 1;
            this.ballAngle =
                (this.ballEntity[1].y - this.playerEntities[1].y) / 7;
        }
        if (this.playerTurn == 1) {
            if (this.ballEntity[1].y - 50 > this.playerEntities[0].y)
                this.playerEntities[0].y += 10;
            else if (this.ballEntity[1].y - 30 > this.playerEntities[0].y)
                this.playerEntities[0].y += 3;
            else if (this.ballEntity[1].y - 10 > this.playerEntities[0].y)
                this.playerEntities[0].y += 2;
            if (this.ballEntity[1].y + 50 < this.playerEntities[0].y)
                this.playerEntities[0].y -= 10;
            else if (this.ballEntity[1].y + 30 < this.playerEntities[0].y)
                this.playerEntities[0].y -= 3;
            else if (this.ballEntity[1].y + 10 < this.playerEntities[0].y)
                this.playerEntities[0].y -= 2;
            if (550 < this.playerEntities[0].y) this.playerEntities[0].y = 550;
            if (50 > this.playerEntities[0].y) this.playerEntities[0].y = 50;
        } else {
            if (this.ballEntity[1].y - 50 > this.playerEntities[1].y)
                this.playerEntities[1].y += 10;
            else if (this.ballEntity[1].y - 30 > this.playerEntities[1].y)
                this.playerEntities[1].y += 3;
            else if (this.ballEntity[1].y - 10 > this.playerEntities[1].y)
                this.playerEntities[1].y += 2;
            if (this.ballEntity[1].y + 50 < this.playerEntities[1].y)
                this.playerEntities[1].y -= 10;
            else if (this.ballEntity[1].y + 30 < this.playerEntities[1].y)
                this.playerEntities[1].y -= 3;
            else if (this.ballEntity[1].y + 15 < this.playerEntities[1].y)
                this.playerEntities[1].y -= 2;
            if (550 < this.playerEntities[1].y) this.playerEntities[1].y = 550;
            if (50 > this.playerEntities[1].y) this.playerEntities[1].y = 50;
        }
    }
}

// game config
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#000000",
    parent: "phaser-example",
    physics: { default: "arcade" },
    pixelArt: true,
    scene: [Home],
    scale: { autoCenter: Phaser.Scale.CENTER_HORIZONTALLY },
};

export default function Index() {
    useEffect(() => {
        const loadGame = async () => {
            if (typeof window !== "object") {
                return;
            }
        };
        loadGame();

        // instantiate the game
        const game = new Phaser.Game(config);
        return () => {
            game.destroy(true);
        };
    }, []);
}
