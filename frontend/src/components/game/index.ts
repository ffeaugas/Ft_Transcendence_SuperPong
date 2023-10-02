import MainMenuScene from "./scenes/menu";
import GameScene from "./scenes/main";
import GameSceneBonus from "./scenes/gameBonus";
import LoadingScene from "./scenes/loading";
import LoadingSceneBonus from "./scenes/loadingBonusGame";
import { useEffect } from "react";
import "phaser";
import { getCookie } from "cookies-next";

export default function Index() {
  let gameInstance; // Declare a variable to hold the game instance
  let scene = [];

  useEffect(() => {
    const loadGame = async () => {
      if (typeof window !== "object") {
        return;
      }

      // Create the game instance here
      if (
        window.location.href.replace(
          `http://${process.env.NEXT_PUBLIC_DOMAIN}:3000/game`,
          ""
        ) === ""
      ) {
        scene = [
          MainMenuScene,
          LoadingScene,
          GameScene,
          LoadingSceneBonus,
          GameSceneBonus,
        ];
      } else {
        scene = [LoadingScene, GameScene];
      }

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        scale: {
          mode: Phaser.Scale.FIT,
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
        // pixelArt: true,
        scene: scene,
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
