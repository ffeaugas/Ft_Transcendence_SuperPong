import Phaser from "phaser";

export default class MainMenuScene extends Phaser.Scene {
  private cursorPos: Phaser.Math.Vector2;
  private buttons: Phaser.GameObjects.Rectangle[] = [];
  private Menu: Phaser.GameObjects.Rectangle[] = [];
  private MenuBorder: Phaser.GameObjects.Rectangle[] = [];
  private neonPath: any;
  private neonFolower: { [index: number]: any } = {};
  private neonFolowerTweens: { [index: number]: any } = {};
  private neon: { [index: number]: any } = {};
  private menuNeon: { [index: number]: any } = {};
  private neonLight: { [index: number]: any } = {};
  private normalNeon: { [index: number]: any } = {};
  private customNeon: { [index: number]: any } = {};
  private normalNeonTweens: { [index: number]: any } = {};
  private normalNeonTweensStat: number = 0;
  private customNeonTweens: { [index: number]: any } = {};
  private customNeonTweensStat: number = 0;
  constructor() {
    super("Menu");
  }

  init() {
    this.cursorPos = this.input.mousePointer.position;
  }

  preload() {
    this.load.image("Menu", "/MenuTitle.png");
    this.load.image("PlayNormal", "/PlayNormal.png");
    this.load.image("PlayCustom", "/PlayCustom.png");
  }

  create() {
    console.log("MENU SCENE");

    var timesDelay = 10;
    const { width, height } = this.scale;

    this.Menu = this.add.graphics({
      x: width / 2,
      y: height / 2,
    });
    this.MenuBorder = this.add.graphics({
      x: width / 2,
      y: height / 2,
    });
    this.MenuBorder.fillStyle(0x111133, 1).setDepth(0);
    this.MenuBorder.fillRoundedRect(-205, -305, 410, 610, {
      tl: 38,
      tr: 38,
      bl: 38,
      br: 38,
    });
    this.MenuBorder.strokeRoundedRect(-205, -305, 410, 610, {
      tl: 38,
      tr: 38,
      bl: 38,
      br: 38,
    });
    this.Menu.fillStyle(0x222244, 1).setDepth(2);
    this.Menu.fillRoundedRect(-180, -280, 360, 560);
    // Play button
    this.neon = this.add.graphics();
    this.neonPath = new Phaser.Curves.Path(width / 2 - 195, height / 2 - 270);
    this.Menu.fillStyle(0x000000, 1);
    this.Menu.strokeRoundedRect(-180, -280, 360, 560);
    // Play button
    this.neon = this.add.graphics();
    this.neonPath = new Phaser.Curves.Path(width / 2 - 195, height / 2 - 270);
    this.neonPath.lineTo(width / 2 - 195, height / 2 + 270);
    this.neonPath.ellipseTo(-25, 25, 0, 90);
    this.neonPath.lineTo(width / 2 + 170, height / 2 + 295);
    this.neonPath.ellipseTo(-25, 25, 90, 180);
    this.neonPath.lineTo(width / 2 + 195, height / 2 - 270);
    this.neonPath.ellipseTo(-25, 25, 180, 270);
    this.neonPath.lineTo(width / 2 - 170, height / 2 - 295);
    this.neonPath.ellipseTo(-25, 25, 270, 360);
    for (let i = 0; i < 15; i++) {
      this.neonFolower[i] = { t: 0, vec: new Phaser.Math.Vector2() };
      this.neonFolowerTweens[i] = this.tweens.add({
        targets: this.neonFolower[i],
        t: 1,
        ease: "Quintic.easeInOut",
        duration: 4000,
        repeat: -1,
        delay: timesDelay * (i + 1),
      });
      this.neonLight[i] = this.add
        .pointlight(width / 2 - 195, height / 2 - 270, 0x110011, 30, 0.15)
        .setDepth(10);
      this.tweens.add({
        targets: this.neonLight[i],
        t: 1,
        ease: "Quintic.easeInOut",
        duration: 150,
        yoyo: true,
        repeat: -1,
        radius: 40,
      });
    }
    for (let i = 15; i < 30; i++) {
      this.neonFolower[i] = { t: 0, vec: new Phaser.Math.Vector2() };
      this.neonFolowerTweens[i] = this.tweens.add({
        targets: this.neonFolower[i],
        t: 1,
        ease: "Quintic.easeInOut",
        duration: 4000,
        repeat: -1,
        delay: 1000 + timesDelay * (i - 15 + 1),
      });
      this.neonLight[i] = this.add
        .pointlight(width / 2 - 195, height / 2 - 270, 0x110011, 30, 0.15)
        .setDepth(10);
      this.tweens.add({
        targets: this.neonLight[i],
        t: 1,
        ease: "Quintic.easeInOut",
        duration: 150,
        yoyo: true,
        repeat: -1,
        radius: 40,
      });
    }
    for (let i = 30; i < 45; i++) {
      this.neonFolower[i] = { t: 0, vec: new Phaser.Math.Vector2() };
      this.neonFolowerTweens[i] = this.tweens.add({
        targets: this.neonFolower[i],
        t: 1,
        ease: "Quintic.easeInOut",
        duration: 4000,
        repeat: -1,
        delay: 2000 + timesDelay * (i - 30 + 1),
      });
      this.neonLight[i] = this.add
        .pointlight(width / 2 - 195, height / 2 - 270, 0x110011, 30, 0.15)
        .setDepth(10);
      this.tweens.add({
        targets: this.neonLight[i],
        t: 1,
        ease: "Quintic.easeInOut",
        duration: 150,
        yoyo: true,
        repeat: -1,
        radius: 40,
      });
    }
    for (let i = 45; i < 60; i++) {
      this.neonFolower[i] = { t: 0, vec: new Phaser.Math.Vector2() };
      this.neonFolowerTweens[i] = this.tweens.add({
        targets: this.neonFolower[i],
        t: 1,
        ease: "Quintic.easeInOut",
        duration: 4000,
        repeat: -1,
        delay: 3000 + timesDelay * (i - 45 + 1),
      });
      this.neonLight[i] = this.add
        .pointlight(width / 2 - 195, height / 2 - 270, 0x110011, 30, 0.15)
        .setDepth(10);
      this.tweens.add({
        targets: this.neonLight[i],
        t: 1,
        ease: "Quintic.easeInOut",
        duration: 150,
        yoyo: true,
        repeat: -1,
        radius: 40,
      });
    }
    const playButtonBack = this.add.graphics({
      x: width / 2,
      y: height / 2 + 50,
    });
    playButtonBack.fillStyle(0xaa00aa, 1).setDepth(2);
    playButtonBack.fillRoundedRect(-150, -50, 300, 100).setDepth(3);
    const playButton = this.add.graphics({
      x: width / 2,
      y: height / 2 + 50,
    });
    playButton.fillStyle(0x333399, 1).setDepth(2);
    playButton.fillRoundedRect(-150, -50, 300, 100).setDepth(3);
    playButton.setScale(1);
    playButton.setName("PlayButton");
    for (let i = 1; i <= 35; i++) {
      this.normalNeon[i] = this.add
        .pointlight(
          playButton.x - 155 + i * 8.5,
          playButton.y,
          0xaa00aa,
          100,
          0.009
        )
        .setDepth(2);
      this.normalNeonTweens[i] = this.tweens.add({
        targets: this.normalNeon[i],
        t: 1,
        ease: "Quintic.easeInOut",
        duration: 1000,
        yoyo: true,
        repeat: -1,
        radius: 160,
      });
      this.normalNeonTweens[i].pause();
    }
    const textPlay = this.add
      .image(playButton.x, playButton.y, "PlayNormal")
      .setOrigin(0.5)
      .setDepth(10)
      .setScale(0.4)
      .setRotation(0.05);
    this.tweens.add({
      targets: textPlay,
      t: 1,
      ease: "Quintic.easeInOut",
      duration: 1000,
      yoyo: true,
      rotation: -0.05,
      repeat: -1,
    });
    this.menuTitle = this.add
      .image(width * 0.5, playButton.y - 230, "Menu")
      .setOrigin(0.5)
      .setDepth(10)
      .setScale(0.8);
    for (let i = 1; i <= 55; i++) {
      this.menuNeon[i] = this.add
        .pointlight(
          width * 0.5 - 240 + i * 8.5,
          playButton.y - 230,
          0xaa00aa,
          80,
          0.04
        )
        .setDepth(2);
      this.tweens.add({
        targets: this.menuNeon[i],
        t: 1,
        ease: "Quintic.easeInOut",
        duration: 1000,
        yoyo: true,
        repeat: -1,
        radius: 60,
      });
    }
    // Settings button
    const customButtonBack = this.add.graphics({
      x: width / 2,
      y: height / 2 + 100 + 20 + 50,
    });
    const customButton = this.add.graphics({
      x: width / 2,
      y: height / 2 + 100 + 20 + 50,
    });
    customButtonBack.fillStyle(0xaa00aa, 1).setDepth(2);
    customButtonBack.fillRoundedRect(-150, -50, 300, 100).setDepth(3);
    customButton.fillStyle(0x333399, 1).setDepth(2);
    customButton.fillRoundedRect(-150, -50, 300, 100).setDepth(3);
    customButton.setName("CustomButton");
    for (let i = 1; i <= 35; i++) {
      this.customNeon[i] = this.add
        .pointlight(
          customButton.x - 155 + i * 8.5,
          customButton.y,
          0xaa00aa,
          100,
          0.009
        )
        .setDepth(2);
      this.customNeonTweens[i] = this.tweens.add({
        targets: this.customNeon[i],
        t: 1,
        ease: "Quintic.easeInOut",
        duration: 1000,
        yoyo: true,
        repeat: -1,
        radius: 160,
      });
      this.customNeonTweens[i].pause();
    }
    const textPlayCustom = this.add
      .image(customButton.x, customButton.y, "PlayCustom")
      .setOrigin(0.5)
      .setDepth(10)
      .setScale(0.5)
      .setRotation(0.05);
    this.tweens.add({
      targets: textPlayCustom,
      t: 1,
      ease: "Quintic.easeInOut",
      duration: 1000,
      yoyo: true,
      rotation: -0.05,
      repeat: -1,
      delay: 250,
    });
    this.buttons.push(playButton);
    this.buttons.push(customButton);
  }

  update() {
    this.neon.clear();
    this.neon.lineStyle(2, 0xffffff, 1);

    //this.neonPath.draw(this.neon);
    this.neon.fillStyle(0xff0000, 1);
    for (let i = 0; i < 60; i++) {
      this.neonPath.getPoint(this.neonFolower[i].t, this.neonFolower[i].vec);

      if (this.neonLight[i]) {
        this.neonLight[i].x = this.neonFolower[i].vec.x;
        this.neonLight[i].y = this.neonFolower[i].vec.y;
      }
    }
    this.buttons.forEach((button) => {
      if (
        this.cursorPos.x > button.x - 150 &&
        this.cursorPos.x < button.x + 150 &&
        this.cursorPos.y > button.y - 50 &&
        this.cursorPos.y < button.y + 50
      ) {
        button.setScale(0.975, 0.9);
        if (button.name == "PlayButton" && this.normalNeonTweensStat == 0) {
          for (let i = 1; i <= 35; i++) this.normalNeonTweens[i].resume();
          this.normalNeonTweensStat = 1;
        } else if (
          button.name == "CustomButton" &&
          this.customNeonTweensStat == 0
        ) {
          for (let i = 1; i <= 35; i++) this.customNeonTweens[i].resume();
          this.customNeonTweensStat = 1;
        }
        if (
          button.name == "PlayButton" &&
          this.input.mousePointer.leftButtonDown()
        ) {
          console.log(button.name);
          this.scene.start("Loading");
        } else if (
          button.name == "CustomButton" &&
          this.input.mousePointer.leftButtonDown()
        ) {
          console.log(button.name);
          this.scene.start("LoadingSceneBonus");
        }
      } else {
        if (button.name == "PlayButton" && this.normalNeonTweensStat == 1) {
          for (let i = 1; i <= 35; i++) {
            this.normalNeonTweens[i].restart();
            this.normalNeonTweens[i].pause();
          }
          this.normalNeonTweensStat = 0;
        } else if (
          button.name == "CustomButton" &&
          this.customNeonTweensStat == 1
        ) {
          for (let i = 1; i <= 35; i++) {
            this.customNeonTweens[i].restart();
            this.customNeonTweens[i].pause();
          }
          this.customNeonTweensStat = 0;
        }
        button.setScale(1);
      }
    });
  }
}
