import "phaser";
import { Client, Room } from "colyseus.js";
import { matchMaker } from "colyseus.js";

// custom scene class
export default class GameScene extends Phaser.Scene {
    // Initialize the client and room variables
    private room: Room;
    nb_client: number = 0;
    playerEntities: { [sessionId: string]: any } = {};
    playersLight: { [sessionId: string]: any } = {};
    ballEntity: any = undefined;
    ballLight: any = undefined;
    scoreEntities: { [index: number]: any } = {};
    backgroundEntities: { [index: number]: any } = {};
    colorb = 0x002b1d;
    colorr = 0x00bb80;
    cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    nbPlayer: number = 0;
    finish = 0;
    counter = 0;
    score: number = 0;
    KeyF;
    player: any;
    ball_satus = 0;

    constructor() {
        super("Game");
    }

    // async postGame(data): Promise<string> {
    //     const res = await fetch(
    //         `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/game`,
    //         {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: "Bearer " + localStorage.getItem("token"),
    //             },
    //             body: JSON.stringify(data),
    //         }
    //     );
    //     return "";
    // }

    init(data: any) {
        this.room = data;
    }

    preload() {
        // preload scene
        let dim = [this.game.canvas.width, this.game.canvas.height];
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.KeyF = this.input.keyboard.addKey("F");
        this.backgroundEntities[0] = this.add.rectangle(
            dim[0] / 2,
            dim[1] / 2,
            25,
            dim[1],
            0x00bbb9
        );
        this.scoreEntities[0] = this.add
            .text(dim[0] / 2, 20, "0    0", {
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
                fontSize: 35,
                align: "center",
                color: "#666666",
            })
            .setOrigin(0.5);
        this.ballEntity = this.add.rectangle(dim[0], dim[1], 15, 15, 0x006600);
        this.ballLight = this.add.pointlight(dim[0], dim[1], 0x000a10, 275);
        this.ballLight.intensity = 0.25;
    }

    async create() {
        console.log("Joining room...");

        try {
            // this.scale.displaySize.setAspectRatio(
            //   window.outerWidth / window.outerHeight
            // );
            let dim = [this.game.canvas.width, this.game.canvas.height];
            this.scale.refresh();
            // this.matchMaker.joinOrCreate("pong", {mode: "classic"});
            this.game.canvas.style.cursor = "none";
            console.log("Joined successfully!");
        } catch (e) {
            console.error(e);
        }

        this.room.state.players.onAdd((player, sessionId) => {
            if (sessionId === this.room.sessionId) {
                var entity = this.add.rectangle(
                    player.x,
                    player.y,
                    10,
                    100,
                    0x00ff00
                );
                this.playerEntities[sessionId] = entity;
                var pointLight = this.add.pointlight(
                    player.x,
                    player.y,
                    0x001a10,
                    275
                );
                pointLight.intensity = 0.5;
                this.playersLight[sessionId] = pointLight;
            } else {
                var entity = this.add.rectangle(
                    player.x,
                    player.y,
                    10,
                    100,
                    0xff0000
                );
                this.playerEntities[sessionId] = entity;
                var pointLight = this.add.pointlight(
                    player.x,
                    player.y,
                    0x1a0a10,
                    275
                );
                pointLight.intensity = 0.5;
                this.playersLight[sessionId] = pointLight;
            }
            // keep a reference of it on `playerEntities`
            player.onChange(() => {
                // update local position immediately
                entity.setData("serverY", player.y);
                entity.setData("serverX", player.x);
                //entity.y=player.y;
                if (player.status == 1) {
                    this.room.send("updateStatus", 2);
                    entity.setData("serverY", player.y);
                }
                if (player.get_ball == 1) {
                    entity.setData("serverYB", player.y);
                    entity.setData("serverXB", player.x);
                }
            });
            this.nb_client++;
        });

        this.room.state.players.onRemove((player, sessionId) => {
            const entity = this.playerEntities[sessionId];
            const light = this.playersLight[sessionId];
            if (entity) {
                // destroy entity
                entity.destroy();
                light.destroy();

                // clear local reference
                delete this.playersLight[sessionId];
                delete this.playerEntities[sessionId];
            }
        });
    }

    // Add your update() function if needed
    update(time: number, delta: number): void {
        if (this.finish == 0) {
            let dim = [this.game.canvas.width, this.game.canvas.height];
            if (this.room && this.input.mousePointer.y) {
                if (this.input.mousePointer.y < 50) this.room.send("move", 50);
                else if (this.input.mousePointer.y > dim[1] - 50)
                    this.room.send("move", dim[1] - 50);
                else this.room.send("move", this.input.mousePointer.y);
            }
            if (
                this.room &&
                this.cursorKeys.space.isDown &&
                this.ball_satus == 0
            ) {
                this.room.send("launch");
                this.ball_satus = 1;
            }
            if (this.room && this.KeyF.isDown) {
                try {
                    this.scale.startFullscreen();
                } catch (error) {
                    console.log(error);
                }
            }
            if (this.room) {
                for (let sessionId in this.playerEntities) {
                    const entity = this.playerEntities[sessionId];
                    const light = this.playersLight[sessionId];

                    if (entity.data) {
                        const { serverX, serverY } = entity.data.values;
                        entity.x = Phaser.Math.Linear(entity.x, serverX, 0.2);
                        entity.y = Phaser.Math.Linear(entity.y, serverY, 0.2);
                        light.x = Phaser.Math.Linear(entity.x, serverX, 0.2);
                        light.y = Phaser.Math.Linear(entity.y, serverY, 0.2);
                        if (this.ballEntity) {
                            this.room.send("ball", { h: dim[1], w: dim[0] });
                        }
                        this.room.onMessage("ballPos", (ball) => {
                            this.ballEntity.x = ball.x;
                            this.ballEntity.y = ball.y;
                            this.ballLight.x = ball.x;
                            this.ballLight.y = ball.y;
                        });
                        if (this.finish !== 1) {
                            this.room.onMessage("score", (score) => {
                                this.scoreEntities[0].setText(
                                    score[0].toString() +
                                        "     " +
                                        score[1].toString()
                                );
                            });
                            this.ball_satus = 0;
                        }
                        if (this.room && this.ballEntity) {
                            this.room.onMessage("boom", (client) => {
                                if (
                                    (this.ballEntity.x <
                                        window.outerWidth / 2 &&
                                        this.playerEntities[client.sessionId]
                                            .x <
                                            window.outerWidth / 2) ||
                                    (this.ballEntity.x >
                                        window.outerWidth / 2 &&
                                        this.playerEntities[client.sessionId]
                                            .x >
                                            window.outerWidth / 2)
                                ) {
                                    this.ballLight.intensity = 1;
                                    this.playersLight[
                                        client.sessionId
                                    ].intensity = 1;
                                    setTimeout(() => {
                                        this.playersLight[
                                            client.sessionId
                                        ].intensity = 0.5;
                                        this.ballLight.intensity = 0.5;
                                    }, 50);
                                } else {
                                    for (let sessionId in this.playerEntities) {
                                        if (client.sessionId != sessionId) {
                                            this.playersLight[
                                                sessionId
                                            ].intensity = 1;
                                            this.ballLight.intensity = 1;

                                            setTimeout(() => {
                                                this.playersLight[
                                                    client.sessionId
                                                ].intensity = 0.5;
                                                this.ballLight.intensity = 0.5;
                                            }, 50);
                                        }
                                    }
                                }
                            });
                        }
                        if (this.room) {
                            this.room.onMessage("win", (username) => {
                                this.finish = 1;
                                this.scoreEntities[0].setText(
                                    "You are a Winner " + username
                                );
                                setTimeout(() => {
                                    this.room.leave();
                                }, 5000);
                            });
                        }
                        if (this.room) {
                            this.room.onMessage("loose", (username) => {
                                this.finish = 1;
                                this.scoreEntities[0].setText(
                                    "You are a Looser " + username
                                );
                                setTimeout(() => {
                                    this.room.leave();
                                }, 5000);
                            });
                        }

                        this.events.on("destroy", () => {
                            this.room.leave();
                        });
                    }
                }
            }
        }
    }
}
