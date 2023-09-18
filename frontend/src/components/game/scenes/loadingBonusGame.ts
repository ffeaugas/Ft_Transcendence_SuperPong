import "phaser";
import { Client, Room } from "colyseus.js";
import { matchMaker } from "colyseus.js";

// custom scene class
export default class LoadingSceneBonus extends Phaser.Scene {
  // Initialize the client and room variables
  private client: Client;
  private room: Room;
  nb_client: number = 0;
  loadingEntities: { [index: number]: any } = {};
  backgroundEntities: { [index: number]: any } = {};
  colorb = 0x0d0721;
  colorr = 0x00bce1;
  nbPlayer: number = 0;
  finish = 0;
  counter = 0;
  score: number = 0;

  constructor() {
    super("LoadingBonus");
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

  async create() {
    console.log("Joining room...");
    try {
      // this.scale.displaySize.setAspectRatio(
      //   window.outerWidth / window.outerHeight
      // );
      let dim = [this.game.canvas.width, this.game.canvas.height];
      this.scale.refresh();

      this.client = new Client(`ws://${process.env.NEXT_PUBLIC_DOMAIN}:3001`);
      this.room = await this.client.joinOrCreate("MyRoomGameBonus", {
        dim,
        name: await this.getUsername(),
      }); // this.matchMaker.joinOrCreate("pong", {mode: "classic"});
      // this.room = await this.client.; // this.matchMaker.joinOrCreate("pong", {mode: "classic"});
      this.game.canvas.style.cursor = "none";
      this.loadingEntities[11] = this.add.rectangle(
        dim[0] / 2,
        dim[1] / 2,
        dim[0],
        dim[1],
        this.colorb
      );

      this.loadingEntities[15] = this.add.pointlight(
        dim[0] / 2,
        dim[1] / 2,
        this.colorr,
        300
      );
      this.loadingEntities[3] = this.add.rectangle(
        dim[0] / 2,
        dim[1] / 2,
        20,
        500,
        this.colorr
      );
      this.loadingEntities[2] = this.add.circle(
        dim[0] / 2,
        dim[1] / 2,
        215,
        this.colorr
      );
      this.loadingEntities[4] = this.add
        .circle(dim[0] / 2, dim[1] / 2, 200, this.colorb)
        .setStrokeStyle(13, 0x006947);
      this.loadingEntities[12] = this.add.pointlight(
        dim[0] / 2,
        dim[1] / 2,
        0x59cbe8,
        225
      );
      this.loadingEntities[5] = this.add.circle(
        dim[0] / 2,
        dim[1] / 2,
        165,
        0x00bbb9
      );
      this.loadingEntities[6] = this.add.rectangle(
        dim[0] / 2,
        dim[1] / 2,
        20,
        400,
        this.colorr
      );
      this.loadingEntities[7] = this.add
        .circle(dim[0] / 2, dim[1] / 2, 150, 0x002525)
        .setStrokeStyle(13, 0x006261);
      this.loadingEntities[13] = this.add.pointlight(
        dim[0] / 2,
        dim[1] / 2,
        0x0071bb,
        155
      );
      this.loadingEntities[8] = this.add.circle(
        dim[0] / 2,
        dim[1] / 2,
        115,
        0x0071bb
      );
      this.loadingEntities[9] = this.add.rectangle(
        dim[0] / 2,
        dim[1] / 2,
        20,
        300,
        0x0071bb
      );
      this.loadingEntities[10] = this.add
        .circle(dim[0] / 2, dim[1] / 2, 100, 0x001625)
        .setStrokeStyle(13, 0x003d62);
      this.loadingEntities[14] = this.add.pointlight(
        dim[0] / 2,
        dim[1] / 2,
        0x000a10,
        275
      );
      this.tweens.add({
        targets: this.loadingEntities[3],
        angle: 180,
        duration: 3050,
        repeat: -1,
        ease: "Quintic.easeInOut",
      });
      this.tweens.add({
        targets: this.loadingEntities[6],
        angle: 180,
        duration: 2030,
        repeat: -1,
        ease: "Quintic.easeInOut",
      });
      this.tweens.add({
        targets: this.loadingEntities[9],
        angle: 180,
        duration: 1000,
        repeat: -1,
        ease: "Quintic.easeInOut",
      });
      this.loadingEntities[0] = this.add
        .text(dim[0] / 2, dim[1] / 2, "LOADING", {
          fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
          fontSize: 35,
          align: "center",
          color: "#00c4af",
        })
        .setOrigin(0.5);
      console.log("Joined successfully!");
    } catch (e) {
      console.error(e);
    }

    this.room.state.players.onAdd((player, sessionId) => {
      this.nb_client++;
      if (this.nb_client === 2) {
        setTimeout(() => this.scene.start("GameBonus", this.room), 3000);
      }
    });
    this.events.on("destroy", () => {
      this.room.leave();
    });
  }
}
