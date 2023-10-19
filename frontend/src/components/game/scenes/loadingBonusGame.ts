import "phaser";
import axios from "axios";
import { Client, Room } from "colyseus.js";
import { matchMaker } from "colyseus.js";
import { initBackground } from "./loadingGraphics/background";
import { updateLoadingState } from "./loadingGraphics/loadingBonus";
import {
  playerNameInitCase1,
  playerNameInitCase2,
  playerNameInitCase3,
  playerNameInitCase4,
} from "./loadingGraphics/name";

// custom scene class
export default class LoadingSceneBonus extends Phaser.Scene {
  // Initialize the client and room variables
  private client: Client;
  private room: Room;
  terminate: number = 0;
  nb_client: number = 0;
  loadingEntities: { [index: number]: any } = {};
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
  loadStat: number = 0;
  load: any;
  loadAnim: any;
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
    this.load.image("1", "/1.png");
    this.load.image("2", "/2.png");
    this.load.image("3", "/3.png");
    this.load.image("load", "/load.png");
  }

  async create() {
    console.log("Joining custom room...");
    try {
      // this.scale.displaySize.setAspectRatio(
      //   window.outerWidth / window.outerHeight
      // );
      let dim = [this.game.canvas.width, this.game.canvas.height];
      this.scale.refresh();
      initBackground(this);
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
      this.nameAnimStatu = 0;
      let dim = [this.game.canvas.width, this.game.canvas.height];
      this.room.onMessage("Joined", (data: any) => {
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
              playerNameInitCase1(this);
            }
          } else {
            if (!this.nameInit) {
              playerNameInitCase2(this);
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
              playerNameInitCase3(this);
            }
          } else {
            if (!this.nameInit) {
              playerNameInitCase4(this);
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
      if (!this.terminate) {
        this.nb_client--;
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
      }
    });
    this.events.on("destroy", () => {
      console.log(this.playerSessionID, "disconnected");
      this.game.destroy(true);
      this.room.leave();
    });
  }
  update(time: number, delta: number): void {
    if (this.nb_client === 2) {
      updateLoadingState(this, time);
    } else {
      this.timer = 0;
      if (this.loadStat != 0) {
        let dim = [this.game.canvas.width, this.game.canvas.height];
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
