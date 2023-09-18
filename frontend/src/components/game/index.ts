import MainMenuScene from "./scenes/menu";
import GameScene from "./scenes/main";
import LoadingScene from "./scenes/loading";
import { useEffect } from "react";
import "phaser";

export default function Index() {
    let gameInstance; // Declare a variable to hold the game instance
    useEffect(() => {
        const loadGame = async () => {
            if (typeof window !== "object") {
                return;
            }

            // Create the game instance here
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
                pixelArt: false,
                scene: [MainMenuScene, GameScene, LoadingScene],
            };
            gameInstance = new Phaser.Game(config);
        };

        loadGame();

        return () => {
            // Destroy the game instance in the cleanup function
            if (gameInstance) {
                gameInstance.scene.remove("Game");
                gameInstance.destroy(true);
                console.log(gameInstance.scene);
            }
        };
    }, []);
}
