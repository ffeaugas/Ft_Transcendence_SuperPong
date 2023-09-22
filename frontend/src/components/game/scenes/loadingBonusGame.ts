import "phaser";
import axios from "axios";
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
  nameEntities: { [index: number]: any } = {};
  name: { [index: number]: any } = {};
  playerSessionID: { [index: number]: any } = {};
  turningRoger: { [index: number]: any } = {};
  colorb = 0x0d0721;
  colorr = 0x00bce1;
  nbPlayer: number = 0;
  finish = 0;
  timer = 0;
  counter = 0;
  score: number = 0;

  constructor() {
    super("LoadingSceneBonus");
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
  async getProfileDatas(player: string): Promise<ProfileDatas | undefined> {
    try {
      const res = await axios.get(
        `http://${process.env.NEXT_PUBLIC_DOMAIN}:3001/profiles`,
        {
          params: { username: player },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const profileDatas = res.data;
      return profileDatas;
    } catch (error) {
      console.error("Error fetching profile datas", error);
      return undefined;
    }
  }

  init() {
    this.nb_client = 0;
    // this.client = null;
  }

  preload() {
    this.load.image("roger", "/sadnessAchievement.png");
  }

  async create() {
    console.log("Joining custom room...");
    try {
      // this.scale.displaySize.setAspectRatio(
      //   window.outerWidth / window.outerHeight
      // );
      let dim = [this.game.canvas.width, this.game.canvas.height];
      this.scale.refresh();
      /*this.turningRoger[0] = this.add
                .image(dim[0] / 4, dim[1] / 3, "roger")
                .setDepth(7);
            this.turningRoger[1] = this.add
                .image((dim[0] / 4) * 3, dim[1] / 3, "roger")
                .setDepth(7);
            this.turningRoger[0].setOrigin(0.5);
            this.turningRoger[1].setOrigin(0.5);
            this.turningRoger[0].visible = false;
            this.turningRoger[1].visible = false;*/
      this.backgroundEntities[0] = this.add
        .rectangle(dim[0] / 2, dim[1] / 2, 20, 5000, 0x111111)
        .setDepth(5);
      this.backgroundEntities[3] = this.add
        .circle((dim[0] / 4) * 3, dim[1] / 3, 100, 0x111111)
        .setDepth(6);
      this.backgroundEntities[4] = this.add
        .circle(dim[0] / 4, dim[1] / 3, 100, 0x111111)
        .setDepth(6);
      this.backgroundEntities[5] = this.add
        .rectangle((dim[0] / 4) * 3, (dim[1] / 3) * 2, 400, 50, 0x111111)
        .setDepth(5);
      /*this.backgroundEntities[29] = this.add
                .circle((dim[0] / 4) * 3, dim[1] / 3, 150)
                .setDepth(8);
            this.backgroundEntities[30] = this.add
                .circle(dim[0] / 4, dim[1] / 3, 150)
                .setDepth(8);
            this.backgroundEntities[29].setStrokeStyle(100);
            this.backgroundEntities[30].setStrokeStyle(100);*/
      //this.backgroundEntities[5].setCrop(0.5);
      this.backgroundEntities[6] = this.add
        .rectangle(dim[0] / 4, (dim[1] / 3) * 2, 400, 50, 0x111111)
        .setDepth(5);
      this.nameEntities[0] = this.add
        .text(dim[0] / 4, (dim[1] / 3) * 2, "", {
          fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
          fontSize: 35,
          align: "center",
          color: "#666666",
        })
        .setOrigin(0.5)
        .setDepth(6);
      this.nameEntities[1] = this.add
        .text((dim[0] / 4) * 3, (dim[1] / 3) * 2, "", {
          fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
          fontSize: 35,
          align: "center",
          color: "#666666",
        })
        .setOrigin(0.5)
        .setDepth(6);
      this.client = new Client(`ws://${process.env.NEXT_PUBLIC_DOMAIN}:3001`);
      this.room = await this.client.joinOrCreate("MyRoomGameBonus", {
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
          // this.load.image("p1", this.getProfileDatas(player));
          this.add.image(100, 10, "p1");
        } else if (!this.playerSessionID[1] && this.name[0] != player) {
          this.playerSessionID[1] = sessionId;
          this.name[1] = player;
          this.nameEntities[1].setText(player);
          // this.load.image("p2", this.getProfileDatas(player));
          this.add.image(500, 10, "p2");
        }
      });
      if (this.nb_client == 1) {
        if (sessionId === this.room.sessionId) {
          this.backgroundEntities[1] = this.add
            .pointlight((dim[0] / 4) * 3, dim[1] / 3, 0xff0000, 200, 0.5)
            .setDepth(2);
          this.backgroundEntities[2] = this.add
            .pointlight(dim[0] / 4, dim[1] / 3, 0x00ff00, 200, 0.5)
            .setDepth(2);
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
          //this.turningRoger[0].visible = true;
        } else {
          this.backgroundEntities[1] = this.add
            .pointlight((dim[0] / 4) * 3, dim[1] / 3, 0x00ff00, 200, 0.5)
            .setDepth(2);
          this.backgroundEntities[2] = this.add
            .pointlight(dim[0] / 4, dim[1] / 3, 0xff0000, 200, 0.5)
            .setDepth(2);
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
        // this.name[0] = "";
        // this.nameEntities[0].setText("");
        //this.turningRoger[1].visible = false;
      } else if (this.playerSessionID[1]) {
        this.playerSessionID[1] = 0;
        // this.name[1] = "";
        // this.nameEntities[1].setText("");
        //this.turningRoger[1].visible = false;
      }
    });
    this.events.on("destroy", () => {
      console.log(this.playerSessionID, "disconnected");
      this.game.destroy(true);
      this.room.leave();
    });
  }
  update(time: number, delta: number): void {
    //console.log(time);
    if (this.nb_client === 2) {
      if (this.timer == 0) this.timer = time;
      else if (time - this.timer > 3000) {
        this.scene.stop();
        this.scene.start("GameBonus", this.room);
      }
    } else this.timer = 0;
  }
}