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
    name: { [index: number]: any } = {};
    playerSessionID: { [index: number]: any } = {};
    P1: { [index: number]: any } = {};
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
            this.backgroundEntities[1] = this.add
                .rectangle(dim[0] / 2, dim[1] / 2, 5, 5000, 0xaa00aa)
                .setDepth(5)
                .setRotation(0);
            this.backgroundEntities[2] = this.add
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
            this.backgroundEntities[3] = this.add
                .circle(dim[0] / 2, dim[1] / 3, 140, 0xaa00aa)
                .setDepth(5);
            this.backgroundEntities[4] = this.add
                .circle(dim[0] / 2, dim[1] / 3, 130, 0x000000)
                .setDepth(5);
            this.backgroundEntities[5] = this.add.pointlight(
                dim[0] / 2,
                dim[1] / 3,
                0xaa00aa,
                300,
                0.4
            );
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
            let dim = [this.game.canvas.width, this.game.canvas.height];
            this.room.onMessage("Joined", (player) => {
                // this.player = players.username;
                console.log(player);
                if (!this.playerSessionID[0] && this.name[1] != player) {
                    this.playerSessionID[0] = sessionId;
                    this.name[0] = player;
                    this.nameEntities[0].setText(player);
                } else if (!this.playerSessionID[1] && this.name[0] != player) {
                    this.playerSessionID[1] = sessionId;
                    this.name[1] = player;
                    this.nameEntities[1].setText(player);
                }
            });
            if (this.nb_client == 1) {
                if (sessionId === this.room.sessionId) {
                    this.P1[0] = this.add
                        .rectangle(
                            (dim[0] / 4) * 3,
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
                            0xaa0000
                        )
                        .setDepth(5);
                    this.P1[2] = this.add
                        .rectangle(
                            (dim[0] / 4) * 3,
                            (dim[1] / 3) * 2.3,
                            400,
                            50,
                            0x000000
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
                    this.P2[1] = this.add
                        .rectangle(
                            dim[0] / 4,
                            (dim[1] / 3) * 2.3,
                            410,
                            60,
                            0x00aa00
                        )
                        .setDepth(5);
                    this.P2[2] = this.add
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
                    for (let i = 7; i < 18; i++) {
                        this.backgroundEntities[i] = this.add.pointlight(
                            (dim[0] / 4) * 3 - 200 + (i - 7) * 40,
                            (dim[1] / 3) * 2.3,
                            0xaa0000,
                            70,
                            0.4
                        );
                    }
                    for (let i = 18; i < 29; i++) {
                        this.backgroundEntities[i] = this.add.pointlight(
                            dim[0] / 4 - 200 + (i - 18) * 40,
                            (dim[1] / 3) * 2.3,
                            0x00aa00,
                            70,
                            0.4
                        );
                    }
                    //this.turningRoger[0].visible = true;
                } else {
                    this.P1[0] = this.add
                        .rectangle(
                            (dim[0] / 4) * 3,
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
                            0x00aa00
                        )
                        .setDepth(5);
                    this.P1[2] = this.add
                        .rectangle(
                            (dim[0] / 4) * 3,
                            (dim[1] / 3) * 2.3,
                            400,
                            50,
                            0x000000
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
                    this.P2[1] = this.add
                        .rectangle(
                            dim[0] / 4,
                            (dim[1] / 3) * 2.3,
                            410,
                            60,
                            0xaa0000
                        )
                        .setDepth(5);
                    this.P2[2] = this.add
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
                    for (let i = 7; i < 18; i++) {
                        this.backgroundEntities[i] = this.add.pointlight(
                            (dim[1] / 4) * 3 - 200 + (i - 7) * 40,
                            (dim[0] / 3) * 2.3,
                            0x00aa00,
                            70,
                            0.4
                        );
                    }
                    for (let i = 18; i < 29; i++) {
                        this.backgroundEntities[i] = this.add.pointlight(
                            dim[0] / 4 - 200 + (i - 18) * 40,
                            (dim[1] / 3) * 2.3,
                            0xaa0000,
                            70,
                            0.4
                        );
                    }
                    //this.turningRoger[1].visible = true;
                }
            }
        });
        this.room.state.players.onRemove((player, sessionId) => {
            this.nb_client--;
            console.log(this.client.name);
            let dim = [this.game.canvas.width, this.game.canvas.height];
            if (this.playerSessionID[0] == sessionId) {
                this.playerSessionID[0] = 0;
                this.name[0] = "";
                this.nameEntities[0].setText("");
            } else if (this.playerSessionID[1]) {
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
        console.log(time - this.timer);
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
