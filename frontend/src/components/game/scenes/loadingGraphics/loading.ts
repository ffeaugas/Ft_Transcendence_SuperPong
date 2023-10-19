import "phaser";

export function updateLoadingState(GS: Phaser.Scene, time: number) {
    let dim = [GS.game.canvas.width, GS.game.canvas.height];
    if (GS.timer == 0) {
        GS.load.destroy();
        GS.loadAnim.stop();
        GS.loadStat = 1;
        GS.load = GS.add
            .image(dim[0] / 2, dim[1] / 3, "3")
            .setScale(0.3)
            .setDepth(6)
            .setScale(1.5);
        GS.loadAnim = GS.tweens.add({
            targets: GS.load,
            ease: "Quintic.easeInOut",
            duration: 250,
            scale: 1,
            yoyo: true,
            repeat: 0,
        });
        GS.timer = time;
    } else if (time - GS.timer > 3000) {
        GS.terminate = 1;
        console.log(GS.terminate);
        GS.scene.stop();
        GS.scene.start("Game", GS.room);
    } else if (time - GS.timer > 2000) {
        if (GS.loadStat == 2) {
            GS.load.destroy();
            GS.loadAnim.stop();
            GS.loadStat = 3;
            GS.load = GS.add
                .image(dim[0] / 2, dim[1] / 3, "1")
                .setScale(0.3)
                .setDepth(6);
            GS.loadAnim = GS.tweens.add({
                targets: GS.load,
                ease: "Quintic.easeInOut",
                duration: 250,
                scale: 1,
                yoyo: true,
                repeat: 0,
            });
        }
    } else if (time - GS.timer > 1000) {
        if (GS.loadStat == 1) {
            GS.load.destroy();
            GS.loadAnim.stop();
            GS.loadStat = 2;
            GS.load = GS.add
                .image(dim[0] / 2, dim[1] / 3, "2")
                .setScale(0.3)
                .setDepth(6);
            GS.loadAnim = GS.tweens.add({
                targets: GS.load,
                ease: "Quintic.easeInOut",
                duration: 250,
                scale: 1,
                yoyo: true,
                repeat: 0,
            });
        }
    }
}
