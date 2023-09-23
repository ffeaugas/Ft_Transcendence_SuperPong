import Phaser from "phaser";

export default class MainMenuScene extends Phaser.Scene {
    private cursorPos: Phaser.Math.Vector2;
    private buttons: Phaser.GameObjects.Rectangle[] = [];
    private Menu: Phaser.GameObjects.Rectangle[] = [];
    private MenuBorder: Phaser.GameObjects.Rectangle[] = [];
    private neonPath: any;
    private menuTitle: any;
    private neonFolower: { [index: number]: any } = {};
    private neonFolowerTweens: { [index: number]: any } = {};
    private neon: { [index: number]: any } = {};
    private neonLight: { [index: number]: any } = {};
    constructor() {
        super("Menu");
    }

    init() {
        this.cursorPos = this.input.mousePointer.position;
    }

    preload() {}

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
        this.Menu.fillStyle(0x222244, 1).setDepth(2);
        this.Menu.fillRoundedRect(-180, -280, 360, 560);
        // Play button
        this.neon = this.add.graphics();
        this.neonPath = new Phaser.Curves.Path(
            width / 2 - 195,
            height / 2 - 270
        );
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
                .pointlight(
                    width / 2 - 195,
                    height / 2 - 270,
                    0xff0000,
                    30,
                    0.15
                )
                .setDepth(10);
            this.tweens.add({
                targets: this.neonLight[i],
                t: 1,
                ease: "Quintic.easeInOut",
                duration: 150,
                yoyo: true,
                repeat: -1,
                delay: timesDelay * (i + 1),
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
                .pointlight(
                    width / 2 - 195,
                    height / 2 - 270,
                    0x00ff00,
                    30,
                    0.15
                )
                .setDepth(10);
            this.tweens.add({
                targets: this.neonLight[i],
                t: 1,
                ease: "Quintic.easeInOut",
                duration: 150,
                yoyo: true,
                repeat: -1,
                delay: 1000 + timesDelay * (i - 15 + 1),
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
                .pointlight(
                    width / 2 - 195,
                    height / 2 - 270,
                    0xff0000,
                    30,
                    0.15
                )
                .setDepth(10);
            this.tweens.add({
                targets: this.neonLight[i],
                t: 1,
                ease: "Quintic.easeInOut",
                duration: 150,
                yoyo: true,
                repeat: -1,
                delay: 2000 + timesDelay * (i - 15 + 1),
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
                .pointlight(
                    width / 2 - 195,
                    height / 2 - 270,
                    0x00ff00,
                    30,
                    0.15
                )
                .setDepth(10);
            this.tweens.add({
                targets: this.neonLight[i],
                t: 1,
                ease: "Quintic.easeInOut",
                duration: 150,
                yoyo: true,
                repeat: -1,
                delay: 3000 + timesDelay * (i - 15 + 1),
                radius: 40,
            });
        }
        const playButtonBack = this.add.graphics({
            x: width / 2,
            y: height / 2 + 50,
        });
        playButtonBack.fillStyle(0x00ff00, 1).setDepth(2);
        playButtonBack.fillRect(-177, -50, 354, 100).setDepth(3);
        const playButton = this.add.graphics({
            x: width / 2,
            y: height / 2 + 50,
        });
        playButton.fillStyle(0x333399, 1).setDepth(2);
        playButton.fillRect(-177, -50, 354, 100).setDepth(3);
        playButton.setScale(1);
        playButton.setName("PlayButton");
        const textPlay = this.add
            .text(playButton.x, playButton.y, "Play Normal", {
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
                fontSize: 25,
                align: "center",
                color: "#AAAAAA",
            })
            .setOrigin(0.5)
            .setDepth(3);
        textPlay.setTint(0xeeeeee);
        this.menuTitle = this.add
            .text(width * 0.5, playButton.y - 200, "SuperPong 3000", {
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
                fontSize: 25,
                align: "center",
                color: "#AAAAAA",
            })
            .setOrigin(0.5)
            .setDepth(3);
        // Settings button
        this.menuTitle.setTint(0xeeeeee);
        const customButtonBack = this.add.graphics({
            x: width / 2,
            y: height / 2 + 100 + 3 + 50,
        });
        const customButton = this.add.graphics({
            x: width / 2,
            y: height / 2 + 100 + 3 + 50,
        });
        customButtonBack.fillStyle(0x00ff00, 1).setDepth(2);
        customButtonBack.fillRect(-177, -50, 354, 100).setDepth(3);
        customButton.fillStyle(0x333399, 1).setDepth(2);
        customButton.fillRect(-177, -50, 354, 100).setDepth(3);
        customButton.setName("CustomButton");
        const textPlayCustom = this.add
            .text(customButton.x, customButton.y, "Play Custom", {
                fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
                fontSize: 25,
                align: "center",
                color: "#AAAAAA",
            })
            .setOrigin(0.5)
            .setDepth(3);
        textPlayCustom.setTint(0xeeeeee);
        this.buttons.push(playButton);
        this.buttons.push(customButton);
    }

    update() {
        this.neon.clear();
        this.neon.lineStyle(2, 0xffffff, 1);

        //this.neonPath.draw(this.neon);
        this.neon.fillStyle(0xff0000, 1);
        for (let i = 0; i < 60; i++) {
            this.neonPath.getPoint(
                this.neonFolower[i].t,
                this.neonFolower[i].vec
            );

            if (this.neonLight[i]) {
                this.neonLight[i].x = this.neonFolower[i].vec.x;
                this.neonLight[i].y = this.neonFolower[i].vec.y;
            }
        }
        this.buttons.forEach((button) => {
            if (
                this.cursorPos.x > button.x - 180 &&
                this.cursorPos.x < button.x + 180 &&
                this.cursorPos.y > button.y - 50 &&
                this.cursorPos.y < button.y + 50
            ) {
                button.setScale(0.985, 0.95);
                if (
                    button.name == "PlayButton" &&
                    this.input.mousePointer.leftButtonDown()
                ) {
                    console.log(button.name);
                    this.scene.stop();
                    this.scene.start("Loading");
                } else if (
                    button.name == "CustomButton" &&
                    this.input.mousePointer.leftButtonDown()
                ) {
                    console.log(button.name);
                    this.scene.stop();
                    this.scene.start("LoadingSceneBonus");
                }
            } else {
                button.setScale(1);
            }
        });
    }
}
