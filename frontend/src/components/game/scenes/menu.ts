import Phaser from "phaser";

export default class MainMenuScene extends Phaser.Scene {
    private cursorPos: Phaser.Math.Vector2;
    private buttons: Phaser.GameObjects.Rectangle[] = [];

    constructor() {
        super("Menu");
    }

    init() {
        this.cursorPos = this.input.mousePointer.position;
    }

    preload() {}

    create() {
        console.log("MENU SCENE");
        const { width, height } = this.scale;

        // Play button
        const playButton = this.add
            .rectangle(width * 0.5, height * 0.5, 150, 100, 0xffffff)
            .setDisplaySize(150, 50);
        playButton.setName("PlayButton");
        const textPlay = this.add
            .text(playButton.x, playButton.y, "Play Normal")
            .setOrigin(0.5)
            .setScale(1.2);
        textPlay.setTint(0x00000);
        // Settings button
        const customButton = this.add
            .rectangle(
                width * 0.5,
                height * 0.5 + playButton.height + 20,
                150,
                100,
                0xffffff
            )
            .setDisplaySize(150, 50);
        customButton.setName("CustomButton");
        this.add.text(customButton.x, customButton.y, "Custom").setOrigin(0.5);

        this.buttons.push(playButton);
        this.buttons.push(customButton);
    }

    update() {
        this.buttons.forEach((button) => {
            if (
                this.cursorPos.x > button.x - 50 &&
                this.cursorPos.x < button.x + 50 &&
                this.cursorPos.y > button.y - 25 &&
                this.cursorPos.y < button.y + 25
            ) {
                button.setScale(1.2);
                if (
                    button.name == "PlayButton" &&
                    this.input.mousePointer.leftButtonDown()
                ) {
                    console.log(button.name);
                    this.scene.start("Game");
                }
            } else {
                button.setScale(1);
            }
        });
    }
}
