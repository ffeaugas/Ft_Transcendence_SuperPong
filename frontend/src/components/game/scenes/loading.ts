import "phaser";
import axios from "axios";
import { Client, Room } from "colyseus.js";
import { matchMaker } from "colyseus.js";

// custom scene class
export default class LoadingScene extends Phaser.Scene {
    // Initialize the client and room variables
    private client: Client;
    private room: Room;
    nb_client: number = 0;
    backgroundEntities: { [index: number]: any } = {};
    nameEntities: { [index: number]: any } = {};
    name: { [index: number]: any } = ["", ""];
    playerSessionID: { [index: number]: any } = {};
    P1: { [index: number]: any } = {};
    nameLigth: { [index: number]: any } = {};
    nameAnim: { [index: number]: any } = {};
    nameInit: number = 0;
    nameAnimStatu: number = 0;
    P2: { [index: number]: any } = {};
    load: any;
    loadAnim: any;
    nbPlayer: number = 0;
    loadStat: number = 0;
    finish = 0;
    timer = 0;

    constructor() {
        super("Loading");
    }

    async getUsername(): Promise<string> {
        const res = await fetch(
            `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/users/me`,
            {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            }
        );
        const user = await res.json();
        return user["username"];
    }

    preload() {
        this.load.image("1", "/1.png");
        this.load.image("2", "/2.png");
        this.load.image("3", "/3.png");
        this.load.image("load", "/load.png");
    }

    async create() {
        console.log("Joining normal room...");
        try {
            // this.scale.displaySize.setAspectRatio(
            //   window.outerWidth / window.outerHeight
            // );
            let dim = [this.game.canvas.width, this.game.canvas.height];
            this.scale.refresh();
            this.backgroundEntities[0] = this.add
                .rectangle(dim[0] / 2, dim[1] / 2, 20, 5000, 0x111111)
                .setDepth(5)
                .setRotation(0);
            this.backgroundEntities[2] = this.add
                .rectangle(dim[0] / 2, dim[1] / 2, 5, 5000, 0xee00ee, 1)
                .setDepth(5)
                .setRotation(0);
            this.backgroundEntities[1] = this.add
                .rectangle(dim[0] / 2, dim[1] / 2, 5, 5000, 0x222222, 1)
                .setDepth(5)
                .setRotation(0);
            this.tweens.add({
                targets: this.backgroundEntities[1],
                ease: "Cubic.easeOut",
                duration: 1000,
                repeat: 0,
                alpha: 0,
            });
            this.backgroundEntities[3] = this.add
                .circle(dim[0] / 2, dim[1] / 3, 150, 0x111111)
                .setDepth(5);
            this.load = this.add
                .image(dim[0] / 2, dim[1] / 3, "load")
                .setDepth(6)
                .setScale(1.5);
            this.loadAnim = this.tweens.add({
                targets: this.load,
                ease: "Quintic.easeInOut",
                duration: 100000,
                rotation: -360,
                repeat: -1,
            });
            this.backgroundEntities[4] = this.add
                .circle(dim[0] / 2, dim[1] / 3, 140, 0xee00ee)
                .setDepth(5);
            this.backgroundEntities[5] = this.add
                .circle(dim[0] / 2, dim[1] / 3, 140, 0x222222, 1)
                .setDepth(5);
            this.tweens.add({
                targets: this.backgroundEntities[5],
                ease: "Quintic.easeOut",
                duration: 1000,
                repeat: 0,
                alpha: 0,
            });
            this.backgroundEntities[6] = this.add
                .circle(dim[0] / 2, dim[1] / 3, 130, 0x000000)
                .setDepth(5);
            this.backgroundEntities[7] = this.add.pointlight(
                dim[0] / 2,
                dim[1] / 3,
                0xaa00aa,
                150,
                0.4
            );
            this.tweens.add({
                targets: this.backgroundEntities[7],
                ease: "Quintic.easeOut",
                duration: 1000,
                repeat: 0,
                radius: 300,
            });
            for (let i = 1; i < 64; i++) {
                this.backgroundEntities[7 + i] = this.add.pointlight(
                    dim[0] / 2,
                    (i - 1) * 12.2,
                    0xaa00aa,
                    20,
                    0.02
                );
                this.tweens.add({
                    targets: this.backgroundEntities[7 + i],
                    ease: "Quintic.easeOut",
                    duration: 1000,
                    repeat: 0,
                    radius: 70,
                });
            }
            this.nameEntities[0] = this.add
                .text(dim[0] / 4, (dim[1] / 3) * 2.3, "", {
                    fontSize: 35,
                    align: "center",
                    color: "#888888",
                })
                .setOrigin(0.5)
                .setDepth(6);
            this.nameEntities[1] = this.add
                .text((dim[0] / 4) * 3, (dim[1] / 3) * 2.3, "", {
                    fontSize: 35,
                    align: "center",
                    color: "#888888",
                })
                .setOrigin(0.5)
                .setDepth(6);
            this.client = new Client(
                `ws://${process.env.NEXT_PUBLIC_DOMAIN}:3001`
            );
            this.room = await this.client.joinOrCreate("MyRoom", {
                dim,
                name: await this.getUsername(),
                //PpUrl: await this.getPP(),
            }); // this.matchMaker.joinOrCreate("pong", {mode: "classic"});
            // this.room = await this.client.; // this.matchMaker.joinOrCreate("pong", {mode: "classic"});
            this.game.canvas.style.cursor = "none";
            console.log("Joined successfully!");
        } catch (e) {
            console.error(e);
        }

        this.room.state.players.onAdd((player, sessionId) => {
            this.nb_client++;
            this.nameAnimStatu = 0;
            let dim = [this.game.canvas.width, this.game.canvas.height];
            this.room.onMessage("Joined", (data: any) => {
                // this.player = players.username;
                console.log(data.player.username);
                if (
                    this.name[0] == "" &&
                    data.player.x < dim[0] / 2 &&
                    this.name[1] != data.player.username
                ) {
                    this.playerSessionID[0] = sessionId;
                    this.name[0] = data.player.username;
                    this.nameEntities[0].setText(data.player.username);
                    if (data.curent == 1) {
                        if (!this.nameInit) {
                            for (let i = 7; i < 18; i++) {
                                this.backgroundEntities[i] =
                                    this.add.pointlight(
                                        (dim[0] / 4) * 3 - 200 + (i - 7) * 40,
                                        (dim[1] / 3) * 2.3,
                                        0xaa0000,
                                        60,
                                        0.04
                                    );
                            }
                            for (let i = 18; i < 29; i++) {
                                this.backgroundEntities[i] =
                                    this.add.pointlight(
                                        dim[0] / 4 - 200 + (i - 18) * 40,
                                        (dim[1] / 3) * 2.3,
                                        0x00aa00,
                                        60,
                                        0.04
                                    );
                            }
                            this.P1[0] = this.add
                                .rectangle(
                                    (dim[0] / 4) * 3,
                                    (dim[1] / 3) * 2.3,
                                    420,
                                    70,
                                    0x111111
                                )
                                .setDepth(5);
                            this.P2[0] = this.add
                                .rectangle(
                                    dim[0] / 4,
                                    (dim[1] / 3) * 2.3,
                                    420,
                                    70,
                                    0x111111
                                )
                                .setDepth(5);
                            this.P1[1] = this.add
                                .rectangle(
                                    (dim[0] / 4) * 3,
                                    (dim[1] / 3) * 2.3,
                                    410,
                                    60,
                                    0xee0000
                                )
                                .setDepth(5);
                            this.P2[1] = this.add
                                .rectangle(
                                    dim[0] / 4,
                                    (dim[1] / 3) * 2.3,
                                    410,
                                    60,
                                    0x00ee00
                                )
                                .setDepth(5);
                            this.P1[2] = this.add
                                .rectangle(
                                    (dim[0] / 4) * 3,
                                    (dim[1] / 3) * 2.3,
                                    410,
                                    60,
                                    0x222222
                                )
                                .setDepth(5);
                            this.P2[2] = this.add
                                .rectangle(
                                    dim[0] / 4,
                                    (dim[1] / 3) * 2.3,
                                    410,
                                    60,
                                    0x222222
                                )
                                .setDepth(5);
                            this.nameInit = 1;
                            this.P1[3] = this.add
                                .rectangle(
                                    (dim[0] / 4) * 3,
                                    (dim[1] / 3) * 2.3,
                                    400,
                                    50,
                                    0x000000
                                )
                                .setDepth(5);
                            this.P2[3] = this.add
                                .rectangle(
                                    dim[0] / 4,
                                    (dim[1] / 3) * 2.3,
                                    400,
                                    50,
                                    0x000000
                                )
                                .setDepth(5);
                            this.nameEntities[0].setTint(0x88ff88);
                            this.nameEntities[1].setTint(0xff8888);
                            this.nameInit = 1;
                        }
                    } else {
                        if (!this.nameInit) {
                            for (let i = 7; i < 18; i++) {
                                this.backgroundEntities[i] =
                                    this.add.pointlight(
                                        (dim[0] / 4) * 3 - 200 + (i - 7) * 40,
                                        (dim[1] / 3) * 2.3,
                                        0x00aa00,
                                        60,
                                        0.04
                                    );
                            }
                            for (let i = 18; i < 29; i++) {
                                this.backgroundEntities[i] =
                                    this.add.pointlight(
                                        dim[0] / 4 - 200 + (i - 18) * 40,
                                        (dim[1] / 3) * 2.3,
                                        0xaa0000,
                                        60,
                                        0.04
                                    );
                            }
                            this.P1[0] = this.add
                                .rectangle(
                                    (dim[0] / 4) * 3,
                                    (dim[1] / 3) * 2.3,
                                    420,
                                    70,
                                    0x111111
                                )
                                .setDepth(5);
                            this.P2[0] = this.add
                                .rectangle(
                                    dim[0] / 4,
                                    (dim[1] / 3) * 2.3,
                                    420,
                                    70,
                                    0x111111
                                )
                                .setDepth(5);
                            this.P1[1] = this.add
                                .rectangle(
                                    (dim[0] / 4) * 3,
                                    (dim[1] / 3) * 2.3,
                                    410,
                                    60,
                                    0x00ee00
                                )
                                .setDepth(5);
                            this.P2[1] = this.add
                                .rectangle(
                                    dim[0] / 4,
                                    (dim[1] / 3) * 2.3,
                                    410,
                                    60,
                                    0xee0000
                                )
                                .setDepth(5);
                            this.nameInit = 1;
                            this.P1[2] = this.add
                                .rectangle(
                                    (dim[0] / 4) * 3,
                                    (dim[1] / 3) * 2.3,
                                    410,
                                    60,
                                    0x222222
                                )
                                .setDepth(5);
                            this.P2[2] = this.add
                                .rectangle(
                                    dim[0] / 4,
                                    (dim[1] / 3) * 2.3,
                                    410,
                                    60,
                                    0x222222
                                )
                                .setDepth(5);
                            this.P1[3] = this.add
                                .rectangle(
                                    (dim[0] / 4) * 3,
                                    (dim[1] / 3) * 2.3,
                                    400,
                                    50,
                                    0x000000
                                )
                                .setDepth(5);
                            this.P2[3] = this.add
                                .rectangle(
                                    dim[0] / 4,
                                    (dim[1] / 3) * 2.3,
                                    400,
                                    50,
                                    0x000000
                                )
                                .setDepth(5);
                            this.nameEntities[1].setTint(0x88ff88);
                            this.nameEntities[0].setTint(0xff8888);
                            this.nameInit = 1;
                        }
                    }
                    for (let i = 18; i < 29; i++) {
                        this.tweens.add({
                            targets: this.backgroundEntities[i],
                            ease: "Cubic.easeOut",
                            duration: 2800,
                            repeat: 0,
                            radius: 150,
                        });
                    }
                    this.tweens.add({
                        targets: this.P2[2],
                        ease: "Cubic.easeOut",
                        duration: 2800,
                        repeat: 0,
                        alpha: 0,
                    });
                } else if (
                    this.name[1] == "" &&
                    data.player.x > dim[0] / 2 &&
                    this.name[0] != data.player.username
                ) {
                    this.playerSessionID[1] = sessionId;
                    this.name[1] = data.player.username;
                    this.nameEntities[1].setText(data.player.username);
                    if (data.curent == 1) {
                        if (!this.nameInit) {
                            for (let i = 7; i < 18; i++) {
                                this.backgroundEntities[i] =
                                    this.add.pointlight(
                                        (dim[0] / 4) * 3 - 200 + (i - 7) * 40,
                                        (dim[1] / 3) * 2.3,
                                        0x00aa00,
                                        70,
                                        0.02
                                    );
                            }
                            for (let i = 18; i < 29; i++) {
                                this.backgroundEntities[i] =
                                    this.add.pointlight(
                                        dim[0] / 4 - 200 + (i - 18) * 40,
                                        (dim[1] / 3) * 2.3,
                                        0xaa0000,
                                        70,
                                        0.02
                                    );
                            }
                            this.P1[0] = this.add
                                .rectangle(
                                    (dim[0] / 4) * 3,
                                    (dim[1] / 3) * 2.3,
                                    420,
                                    70,
                                    0x111111
                                )
                                .setDepth(5);
                            this.P2[0] = this.add
                                .rectangle(
                                    dim[0] / 4,
                                    (dim[1] / 3) * 2.3,
                                    420,
                                    70,
                                    0x111111
                                )
                                .setDepth(5);
                            this.P1[1] = this.add
                                .rectangle(
                                    (dim[0] / 4) * 3,
                                    (dim[1] / 3) * 2.3,
                                    410,
                                    60,
                                    0x00ee00
                                )
                                .setDepth(5);
                            this.P2[1] = this.add
                                .rectangle(
                                    dim[0] / 4,
                                    (dim[1] / 3) * 2.3,
                                    410,
                                    60,
                                    0xee0000
                                )
                                .setDepth(5);
                            this.nameInit = 1;
                            this.P1[2] = this.add
                                .rectangle(
                                    (dim[0] / 4) * 3,
                                    (dim[1] / 3) * 2.3,
                                    410,
                                    60,
                                    0x222222,
                                    1
                                )
                                .setDepth(5);
                            this.P2[2] = this.add
                                .rectangle(
                                    dim[0] / 4,
                                    (dim[1] / 3) * 2.3,
                                    410,
                                    60,
                                    0x222222,
                                    1
                                )
                                .setDepth(5);
                            this.P1[3] = this.add
                                .rectangle(
                                    (dim[0] / 4) * 3,
                                    (dim[1] / 3) * 2.3,
                                    400,
                                    50,
                                    0x000000
                                )
                                .setDepth(5);
                            this.P2[3] = this.add
                                .rectangle(
                                    dim[0] / 4,
                                    (dim[1] / 3) * 2.3,
                                    400,
                                    50,
                                    0x000000
                                )
                                .setDepth(5);
                            this.nameEntities[1].setTint(0x88ff88);
                            this.nameEntities[0].setTint(0xff8888);
                        }
                    } else {
                        if (!this.nameInit) {
                            for (let i = 7; i < 18; i++) {
                                this.backgroundEntities[i] =
                                    this.add.pointlight(
                                        (dim[0] / 4) * 3 - 200 + (i - 7) * 40,
                                        (dim[1] / 3) * 2.3,
                                        0xaa0000,
                                        60,
                                        0.04
                                    );
                            }
                            for (let i = 18; i < 29; i++) {
                                this.backgroundEntities[i] =
                                    this.add.pointlight(
                                        dim[0] / 4 - 200 + (i - 18) * 40,
                                        (dim[1] / 3) * 2.3,
                                        0x00aa00,
                                        60,
                                        0.04
                                    );
                            }
                            this.P1[0] = this.add
                                .rectangle(
                                    (dim[0] / 4) * 3,
                                    (dim[1] / 3) * 2.3,
                                    420,
                                    70,
                                    0x111111
                                )
                                .setDepth(5);
                            this.P2[0] = this.add
                                .rectangle(
                                    dim[0] / 4,
                                    (dim[1] / 3) * 2.3,
                                    420,
                                    70,
                                    0x111111
                                )
                                .setDepth(5);
                            this.P1[1] = this.add
                                .rectangle(
                                    (dim[0] / 4) * 3,
                                    (dim[1] / 3) * 2.3,
                                    410,
                                    60,
                                    0xee0000
                                )
                                .setDepth(5);
                            this.P2[1] = this.add
                                .rectangle(
                                    dim[0] / 4,
                                    (dim[1] / 3) * 2.3,
                                    410,
                                    60,
                                    0x00ee00
                                )
                                .setDepth(5);
                            this.P1[2] = this.add
                                .rectangle(
                                    (dim[0] / 4) * 3,
                                    (dim[1] / 3) * 2.3,
                                    410,
                                    60,
                                    0x222222
                                )
                                .setDepth(5);
                            this.P2[2] = this.add
                                .rectangle(
                                    dim[0] / 4,
                                    (dim[1] / 3) * 2.3,
                                    410,
                                    60,
                                    0x222222
                                )
                                .setDepth(5);
                            this.P1[3] = this.add
                                .rectangle(
                                    (dim[0] / 4) * 3,
                                    (dim[1] / 3) * 2.3,
                                    400,
                                    50,
                                    0x000000
                                )
                                .setDepth(5);
                            this.P2[3] = this.add
                                .rectangle(
                                    dim[0] / 4,
                                    (dim[1] / 3) * 2.3,
                                    400,
                                    50,
                                    0x000000
                                )
                                .setDepth(5);
                            this.nameEntities[0].setTint(0x88ff88);
                            this.nameEntities[1].setTint(0xff8888);
                            this.nameInit = 1;
                        }
                    }
                    for (let i = 7; i < 18; i++) {
                        this.tweens.add({
                            targets: this.backgroundEntities[i],
                            ease: "Cubic.easeOut",
                            duration: 2800,
                            repeat: 0,
                            radius: 150,
                        });
                    }
                    this.tweens.add({
                        targets: this.P1[2],
                        ease: "Cubic.easeOut",
                        duration: 2800,
                        repeat: 0,
                        alpha: 0,
                    });
                }
            });
        });
        this.room.state.players.onRemove((player, sessionId) => {
            this.nb_client--;
            console.log(this.client.name);
            let dim = [this.game.canvas.width, this.game.canvas.height];
            if (player.x < dim[0] / 2) {
                for (let i = 18; i < 29; i++) {
                    this.tweens.add({
                        targets: this.backgroundEntities[i],
                        ease: "Cubic.easeOut",
                        duration: 2800,
                        repeat: 0,
                        radius: 60,
                    });
                }
                this.tweens.add({
                    targets: this.P2[2],
                    ease: "Cubic.easeOut",
                    duration: 2800,
                    repeat: 0,
                    alpha: 1,
                });
                this.playerSessionID[0] = 0;
                this.name[0] = "";
                this.nameEntities[0].setText("");
            } else if (player.x > dim[0] / 2) {
                for (let i = 7; i < 18; i++) {
                    this.tweens.add({
                        targets: this.backgroundEntities[i],
                        ease: "Cubic.easeOut",
                        duration: 2800,
                        repeat: 0,
                        radius: 60,
                    });
                }
                this.tweens.add({
                    targets: this.P1[2],
                    ease: "Cubic.easeOut",
                    duration: 2800,
                    repeat: 0,
                    alpha: 1,
                });
                this.playerSessionID[1] = 0;
                this.name[1] = "";
                this.nameEntities[1].setText("");
            }
            // marche pas de ouf refonte avec sessionId a prevoir
        });
        this.events.on("destroy", () => {
            this.room.leave();
        });
    }
    update(time: number, delta: number): void {
        //console.log(time);
        let dim = [this.game.canvas.width, this.game.canvas.height];
        if (this.nb_client == 2) {
            if (this.timer == 0) {
                this.load.destroy();
                this.loadAnim.stop();
                this.loadStat = 1;
                this.load = this.add
                    .image(dim[0] / 2, dim[1] / 3, "3")
                    .setScale(0.3)
                    .setDepth(6)
                    .setScale(1.5);
                this.loadAnim = this.tweens.add({
                    targets: this.load,
                    ease: "Quintic.easeInOut",
                    duration: 250,
                    scale: 1,
                    yoyo: true,
                    repeat: 0,
                });
                this.timer = time;
            } else if (time - this.timer > 3000) {
                this.scene.start("Game", this.room);
            } else if (time - this.timer > 2000) {
                if (this.loadStat == 2) {
                    this.load.destroy();
                    this.loadAnim.stop();
                    this.loadStat = 3;
                    this.load = this.add
                        .image(dim[0] / 2, dim[1] / 3, "1")
                        .setScale(0.3)
                        .setDepth(6);
                    this.loadAnim = this.tweens.add({
                        targets: this.load,
                        ease: "Quintic.easeInOut",
                        duration: 250,
                        scale: 1,
                        yoyo: true,
                        repeat: 0,
                    });
                }
            } else if (time - this.timer > 1000) {
                if (this.loadStat == 1) {
                    this.load.destroy();
                    this.loadAnim.stop();
                    this.loadStat = 2;
                    this.load = this.add
                        .image(dim[0] / 2, dim[1] / 3, "2")
                        .setScale(0.3)
                        .setDepth(6);
                    this.loadAnim = this.tweens.add({
                        targets: this.load,
                        ease: "Quintic.easeInOut",
                        duration: 250,
                        scale: 1,
                        yoyo: true,
                        repeat: 0,
                    });
                }
            }
        } else {
            this.timer = 0;
            if (this.loadStat != 0) {
                this.load.destroy();
                this.loadAnim.stop();
                this.loadStat = 0;
                this.load = this.add
                    .image(dim[0] / 2, dim[1] / 3, "load")
                    .setDepth(6)
                    .setScale(1.5);
                this.loadAnim = this.tweens.add({
                    targets: this.load,
                    ease: "Quintic.easeInOut",
                    duration: 100000,
                    rotation: -360,
                    repeat: -1,
                });
            }
        }
    }
}
