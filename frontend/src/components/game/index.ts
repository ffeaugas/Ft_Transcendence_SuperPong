import MainMenuScene from "./scenes/menu";
import GameScene from "./scenes/main";
import { useEffect } from "react";
import "phaser";

export default function Index() {
    useEffect(() => {
        loadGame();
    }, []);

    const loadGame = async () => {
        if (typeof window !== "object") {
            return;
        }
    };
    const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        scale: {
            //   mode: Phaser.Scale.RESIZE,
            mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
            autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        backgroundColor: "#000000",
        parent: "phaser-example",
        physics: {
            default: "arcade",
            arcade: {
                debug: false,
            },
        },
        fps: {
            target: 60,
            min: 60,
            forceSetTimeOut: true,
        },
        pixelArt: true,
        scene: [MainMenuScene, GameScene],
    };

    // instantiate the game
    const game = new Phaser.Game(config);
}
