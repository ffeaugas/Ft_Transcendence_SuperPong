import "phaser";
import { Client, Room } from "colyseus.js";
import { matchMaker } from "colyseus.js";

// custom scene class
export default class LoadingScene extends Phaser.Scene {
    // Initialize the client and room variables
    private client: Client;
    private room: Room;
    nb_client: number = 0;
    loadingEntities: { [index: number]: any } = {};
    backgroundEntities: { [index: number]: any } = {};
    nameEntities: { [index: number]: any } = {};
    name: { [index: number]: any } = {};
    colorb = 0x0d0721;
    colorr = 0x00bce1;
    nbPlayer: number = 0;
    finish = 0;
    counter = 0;
    score: number = 0;

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
    /* async getPP(): Promise<string> {
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
        return user["profile/profilePicture"];
    }*/

    async create() {
        console.log("Joining room...");
        try {
            // this.scale.displaySize.setAspectRatio(
            //   window.outerWidth / window.outerHeight
            // );
            let dim = [this.game.canvas.width, this.game.canvas.height];
            this.scale.refresh();
            this.backgroundEntities[0] = this.add
                .rectangle(dim[0] / 2, dim[1] / 2, 20, 5000, 0x111111)
                .setDepth(5);
            this.backgroundEntities[3] = this.add
                .circle((dim[0] / 4) * 3, dim[1] / 3, 100, 0x111111)
                .setDepth(5);
            this.backgroundEntities[4] = this.add
                .circle(dim[0] / 4, dim[1] / 3, 100, 0x111111)
                .setDepth(5);
            this.backgroundEntities[5] = this.add
                .rectangle(
                    (dim[0] / 4) * 3,
                    (dim[1] / 3) * 2,
                    400,
                    50,
                    0x111111
                )
                .setDepth(5);
            //this.backgroundEntities[5].setCrop(0.5);
            this.backgroundEntities[6] = this.add
                .rectangle(dim[0] / 4, (dim[1] / 3) * 2, 400, 50, 0x111111)
                .setDepth(5);
            this.nameEntities[0] = this.add
                .text(dim[0] / 4, (dim[1] / 3) * 2, "", {
                    fontFamily:
                        'Georgia, "Goudy Bookletter 1911", Times, serif',
                    fontSize: 35,
                    align: "center",
                    color: "#666666",
                })
                .setOrigin(0.5)
                .setDepth(6);
            this.nameEntities[1] = this.add
                .text((dim[0] / 4) * 3, (dim[1] / 3) * 2, "", {
                    fontFamily:
                        'Georgia, "Goudy Bookletter 1911", Times, serif',
                    fontSize: 35,
                    align: "center",
                    color: "#666666",
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
                if (!this.name[0]) {
                    this.name[0] = player;
                    this.nameEntities[0].setText(player);
                } else if (!this.name[1] && this.name[0] != player) {
                    this.name[1] = player;
                    this.nameEntities[1].setText(player);
                }
                this.client.name = player;
            });
            if (this.nb_client === 2) {
                setTimeout(() => this.scene.start("Game", this.room), 20000);
            } else if (this.nb_client == 1) {
                if (sessionId === this.room.sessionId) {
                    this.backgroundEntities[1] = this.add.pointlight(
                        (dim[0] / 4) * 3,
                        dim[1] / 3,
                        0xff0000,
                        200,
                        0.5
                    );
                    this.backgroundEntities[2] = this.add.pointlight(
                        dim[0] / 4,
                        dim[1] / 3,
                        0x00ff00,
                        200,
                        0.5
                    );
                    for (let i = 7; i < 18; i++) {
                        this.backgroundEntities[i] = this.add.pointlight(
                            (dim[0] / 4) * 3 - 200 + (i - 7) * 40,
                            (dim[1] / 3) * 2,
                            0xaa0000,
                            70,
                            0.2
                        );
                    }
                    for (let i = 18; i < 29; i++) {
                        this.backgroundEntities[i] = this.add.pointlight(
                            dim[0] / 4 - 200 + (i - 18) * 40,
                            (dim[1] / 3) * 2,
                            0x00aa00,
                            70,
                            0.2
                        );
                    }
                } else {
                    this.backgroundEntities[1] = this.add.pointlight(
                        (dim[0] / 4) * 3,
                        dim[1] / 3,
                        0x00ff00,
                        200,
                        0.5
                    );
                    this.backgroundEntities[2] = this.add.pointlight(
                        dim[0] / 4,
                        dim[1] / 3,
                        0xff0000,
                        200,
                        0.5
                    );
                    for (let i = 7; i < 18; i++) {
                        this.backgroundEntities[i] = this.add.pointlight(
                            (dim[0] / 4) * 3 - 200 + (i - 7) * 40,
                            (dim[1] / 3) * 2,
                            0x00aa00,
                            70,
                            0.2
                        );
                    }
                    for (let i = 18; i < 29; i++) {
                        this.backgroundEntities[i] = this.add.pointlight(
                            dim[0] / 4 - 200 + (i - 18) * 40,
                            (dim[1] / 3) * 2,
                            0xaa0000,
                            70,
                            0.2
                        );
                    }
                }
            }
        });
        this.room.state.players.onRemove((player, sessionId) => {
            this.nb_client--;
            console.log(this.client.name);
            /*let dim = [this.game.canvas.width, this.game.canvas.height];
            if (this.client.name != this.name[0]) {
                this.name[0] = "";
                this.nameEntities[0].setText("");
            } else if (this.name[1]) {
                this.name[1] = "";
                this.nameEntities[1].setText("");
            }*/
            // marche pas de ouf refonte avec sessionId a prevoir
        });
        this.events.on("destroy", () => {
            this.room.leave();
        });
    }
}
