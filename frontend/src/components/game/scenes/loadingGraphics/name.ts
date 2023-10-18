import "phaser";

export function playerNameInitCase1(GS: Phaser.Scene) {
    let dim = [GS.game.canvas.width, GS.game.canvas.height];
    for (let i = 7; i < 18; i++) {
        GS.backgroundEntities[i] = GS.add.pointlight(
            (dim[0] / 4) * 3 - 200 + (i - 7) * 40,
            (dim[1] / 3) * 2.3,
            0xaa0000,
            60,
            0.04
        );
    }
    for (let i = 18; i < 29; i++) {
        GS.backgroundEntities[i] = GS.add.pointlight(
            dim[0] / 4 - 200 + (i - 18) * 40,
            (dim[1] / 3) * 2.3,
            0x00aa00,
            60,
            0.04
        );
    }
    GS.P1[0] = GS.add
        .rectangle((dim[0] / 4) * 3, (dim[1] / 3) * 2.3, 420, 70, 0x111111)
        .setDepth(5);
    GS.P2[0] = GS.add
        .rectangle(dim[0] / 4, (dim[1] / 3) * 2.3, 420, 70, 0x111111)
        .setDepth(5);
    GS.P1[1] = GS.add
        .rectangle((dim[0] / 4) * 3, (dim[1] / 3) * 2.3, 410, 60, 0xee0000)
        .setDepth(5);
    GS.P2[1] = GS.add
        .rectangle(dim[0] / 4, (dim[1] / 3) * 2.3, 410, 60, 0x00ee00)
        .setDepth(5);
    GS.P1[2] = GS.add
        .rectangle((dim[0] / 4) * 3, (dim[1] / 3) * 2.3, 410, 60, 0x222222)
        .setDepth(5);
    GS.P2[2] = GS.add
        .rectangle(dim[0] / 4, (dim[1] / 3) * 2.3, 410, 60, 0x222222)
        .setDepth(5);
    GS.nameInit = 1;
    GS.P1[3] = GS.add
        .rectangle((dim[0] / 4) * 3, (dim[1] / 3) * 2.3, 400, 50, 0x000000)
        .setDepth(5);
    GS.P2[3] = GS.add
        .rectangle(dim[0] / 4, (dim[1] / 3) * 2.3, 400, 50, 0x000000)
        .setDepth(5);
    GS.nameEntities[0].setTint(0x88ff88);
    GS.nameEntities[1].setTint(0xff8888);
    GS.nameInit = 1;
}

export function playerNameInitCase2(GS: Phaser.Scene) {
    let dim = [GS.game.canvas.width, GS.game.canvas.height];
    for (let i = 7; i < 18; i++) {
        GS.backgroundEntities[i] = GS.add.pointlight(
            (dim[0] / 4) * 3 - 200 + (i - 7) * 40,
            (dim[1] / 3) * 2.3,
            0x00aa00,
            60,
            0.04
        );
    }
    for (let i = 18; i < 29; i++) {
        GS.backgroundEntities[i] = GS.add.pointlight(
            dim[0] / 4 - 200 + (i - 18) * 40,
            (dim[1] / 3) * 2.3,
            0xaa0000,
            60,
            0.04
        );
    }
    GS.P1[0] = GS.add
        .rectangle((dim[0] / 4) * 3, (dim[1] / 3) * 2.3, 420, 70, 0x111111)
        .setDepth(5);
    GS.P2[0] = GS.add
        .rectangle(dim[0] / 4, (dim[1] / 3) * 2.3, 420, 70, 0x111111)
        .setDepth(5);
    GS.P1[1] = GS.add
        .rectangle((dim[0] / 4) * 3, (dim[1] / 3) * 2.3, 410, 60, 0x00ee00)
        .setDepth(5);
    GS.P2[1] = GS.add
        .rectangle(dim[0] / 4, (dim[1] / 3) * 2.3, 410, 60, 0xee0000)
        .setDepth(5);
    GS.nameInit = 1;
    GS.P1[2] = GS.add
        .rectangle((dim[0] / 4) * 3, (dim[1] / 3) * 2.3, 410, 60, 0x222222)
        .setDepth(5);
    GS.P2[2] = GS.add
        .rectangle(dim[0] / 4, (dim[1] / 3) * 2.3, 410, 60, 0x222222)
        .setDepth(5);
    GS.P1[3] = GS.add
        .rectangle((dim[0] / 4) * 3, (dim[1] / 3) * 2.3, 400, 50, 0x000000)
        .setDepth(5);
    GS.P2[3] = GS.add
        .rectangle(dim[0] / 4, (dim[1] / 3) * 2.3, 400, 50, 0x000000)
        .setDepth(5);
    GS.nameEntities[1].setTint(0x88ff88);
    GS.nameEntities[0].setTint(0xff8888);
    GS.nameInit = 1;
}

export function playerNameInitCase3(GS: Phaser.Scene) {
    let dim = [GS.game.canvas.width, GS.game.canvas.height];
    for (let i = 7; i < 18; i++) {
        GS.backgroundEntities[i] = GS.add.pointlight(
            (dim[0] / 4) * 3 - 200 + (i - 7) * 40,
            (dim[1] / 3) * 2.3,
            0x00aa00,
            70,
            0.02
        );
    }
    for (let i = 18; i < 29; i++) {
        GS.backgroundEntities[i] = GS.add.pointlight(
            dim[0] / 4 - 200 + (i - 18) * 40,
            (dim[1] / 3) * 2.3,
            0xaa0000,
            70,
            0.02
        );
    }
    GS.P1[0] = GS.add
        .rectangle((dim[0] / 4) * 3, (dim[1] / 3) * 2.3, 420, 70, 0x111111)
        .setDepth(5);
    GS.P2[0] = GS.add
        .rectangle(dim[0] / 4, (dim[1] / 3) * 2.3, 420, 70, 0x111111)
        .setDepth(5);
    GS.P1[1] = GS.add
        .rectangle((dim[0] / 4) * 3, (dim[1] / 3) * 2.3, 410, 60, 0x00ee00)
        .setDepth(5);
    GS.P2[1] = GS.add
        .rectangle(dim[0] / 4, (dim[1] / 3) * 2.3, 410, 60, 0xee0000)
        .setDepth(5);
    GS.nameInit = 1;
    GS.P1[2] = GS.add
        .rectangle((dim[0] / 4) * 3, (dim[1] / 3) * 2.3, 410, 60, 0x222222, 1)
        .setDepth(5);
    GS.P2[2] = GS.add
        .rectangle(dim[0] / 4, (dim[1] / 3) * 2.3, 410, 60, 0x222222, 1)
        .setDepth(5);
    GS.P1[3] = GS.add
        .rectangle((dim[0] / 4) * 3, (dim[1] / 3) * 2.3, 400, 50, 0x000000)
        .setDepth(5);
    GS.P2[3] = GS.add
        .rectangle(dim[0] / 4, (dim[1] / 3) * 2.3, 400, 50, 0x000000)
        .setDepth(5);
    GS.nameEntities[1].setTint(0x88ff88);
    GS.nameEntities[0].setTint(0xff8888);
}

export function playerNameInitCase4(GS: Phaser.Scene) {
    let dim = [GS.game.canvas.width, GS.game.canvas.height];
    for (let i = 7; i < 18; i++) {
        GS.backgroundEntities[i] = GS.add.pointlight(
            (dim[0] / 4) * 3 - 200 + (i - 7) * 40,
            (dim[1] / 3) * 2.3,
            0xaa0000,
            60,
            0.04
        );
    }
    for (let i = 18; i < 29; i++) {
        GS.backgroundEntities[i] = GS.add.pointlight(
            dim[0] / 4 - 200 + (i - 18) * 40,
            (dim[1] / 3) * 2.3,
            0x00aa00,
            60,
            0.04
        );
    }
    GS.P1[0] = GS.add
        .rectangle((dim[0] / 4) * 3, (dim[1] / 3) * 2.3, 420, 70, 0x111111)
        .setDepth(5);
    GS.P2[0] = GS.add
        .rectangle(dim[0] / 4, (dim[1] / 3) * 2.3, 420, 70, 0x111111)
        .setDepth(5);
    GS.P1[1] = GS.add
        .rectangle((dim[0] / 4) * 3, (dim[1] / 3) * 2.3, 410, 60, 0xee0000)
        .setDepth(5);
    GS.P2[1] = GS.add
        .rectangle(dim[0] / 4, (dim[1] / 3) * 2.3, 410, 60, 0x00ee00)
        .setDepth(5);
    GS.P1[2] = GS.add
        .rectangle((dim[0] / 4) * 3, (dim[1] / 3) * 2.3, 410, 60, 0x222222)
        .setDepth(5);
    GS.P2[2] = GS.add
        .rectangle(dim[0] / 4, (dim[1] / 3) * 2.3, 410, 60, 0x222222)
        .setDepth(5);
    GS.P1[3] = GS.add
        .rectangle((dim[0] / 4) * 3, (dim[1] / 3) * 2.3, 400, 50, 0x000000)
        .setDepth(5);
    GS.P2[3] = GS.add
        .rectangle(dim[0] / 4, (dim[1] / 3) * 2.3, 400, 50, 0x000000)
        .setDepth(5);
    GS.nameEntities[0].setTint(0x88ff88);
    GS.nameEntities[1].setTint(0xff8888);
    GS.nameInit = 1;
}
