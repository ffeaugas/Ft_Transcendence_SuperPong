import GameScene from "./main";
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
  //         const config: Phaser.Types.Core.GameConfig = {
  //             type: Phaser.AUTO,
  //             scale: {
  //                 mode: Phaser.Scale.RESIZE,
  //                 // mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
  //                 autoCenter: Phaser.Scale.CENTER_BOTH,
  //             },
  //             backgroundColor: "#000000",
  //             parent: "phaser-example",
  //             physics: {
  //                 default: "arcade",
  //                 arcade: {
  //                     debug: true,
  //                 },
  //             },
  //             fps: {
  //                 target: 60,
  //                 min: 60,
  //                 forceSetTimeOut: true,
  //             },
  //             pixelArt: true,
  //             scene: [Main],
  //         };

  //         // instantiate the game
  //         const game = new Phaser.Game(config);

  //         // game.scene.add("main", Main);
  //         // game.scene.start("main");
  //     };

  //     return null;
  // }

  // game config
  // game config
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
    scene: [GameScene],
  };

  // instantiate the game
  const game = new Phaser.Game(config);
}
