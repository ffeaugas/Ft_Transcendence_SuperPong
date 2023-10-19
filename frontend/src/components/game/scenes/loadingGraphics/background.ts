import "phaser";

export function initBackground(GS: Phaser.Scene) {
    let dim = [GS.game.canvas.width, GS.game.canvas.height];
    GS.scale.refresh();
    GS.backgroundEntities[0] = GS.add
        .rectangle(dim[0] / 2, dim[1] / 2, 20, 5000, 0x111111)
        .setDepth(5)
        .setRotation(0);
    GS.backgroundEntities[2] = GS.add
        .rectangle(dim[0] / 2, dim[1] / 2, 5, 5000, 0xee00ee, 1)
        .setDepth(5)
        .setRotation(0);
    GS.backgroundEntities[1] = GS.add
        .rectangle(dim[0] / 2, dim[1] / 2, 5, 5000, 0x222222, 1)
        .setDepth(5)
        .setRotation(0);
    GS.tweens.add({
        targets: GS.backgroundEntities[1],
        ease: "Cubic.easeOut",
        duration: 1000,
        repeat: 0,
        alpha: 0,
    });
    GS.backgroundEntities[3] = GS.add
        .circle(dim[0] / 2, dim[1] / 3, 150, 0x111111)
        .setDepth(5);
    GS.load = GS.add
        .image(dim[0] / 2, dim[1] / 3, "load")
        .setDepth(6)
        .setScale(1.5);
    GS.loadAnim = GS.tweens.add({
        targets: GS.load,
        ease: "Quintic.easeInOut",
        duration: 100000,
        rotation: -360,
        repeat: -1,
    });
    GS.backgroundEntities[4] = GS.add
        .circle(dim[0] / 2, dim[1] / 3, 140, 0xee00ee)
        .setDepth(5);
    GS.backgroundEntities[5] = GS.add
        .circle(dim[0] / 2, dim[1] / 3, 140, 0x222222, 1)
        .setDepth(5);
    GS.tweens.add({
        targets: GS.backgroundEntities[5],
        ease: "Quintic.easeOut",
        duration: 1000,
        repeat: 0,
        alpha: 0,
    });
    GS.backgroundEntities[6] = GS.add
        .circle(dim[0] / 2, dim[1] / 3, 130, 0x000000)
        .setDepth(5);
    GS.backgroundEntities[7] = GS.add.pointlight(
        dim[0] / 2,
        dim[1] / 3,
        0xaa00aa,
        150,
        0.4
    );
    GS.tweens.add({
        targets: GS.backgroundEntities[7],
        ease: "Quintic.easeOut",
        duration: 1000,
        repeat: 0,
        radius: 300,
    });
    for (let i = 1; i < 64; i++) {
        GS.backgroundEntities[7 + i] = GS.add.pointlight(
            dim[0] / 2,
            (i - 1) * 12.2,
            0xaa00aa,
            20,
            0.02
        );
        GS.tweens.add({
            targets: GS.backgroundEntities[7 + i],
            ease: "Quintic.easeOut",
            duration: 1000,
            repeat: 0,
            radius: 70,
        });
    }
}

export function destroyBackground(GS: Phaser.Scene) {
    for (let i = 0; i < 71; i++) {
        GS.backgroundEntities[i].destroy();
    }
}
