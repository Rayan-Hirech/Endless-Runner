class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        // Place background table tile sprite.
        this.table = this.add.tileSprite(0, 0, 2560, 2560, 'table').setOrigin(0.5, 0.5);
    }

    update() {
        //this.table.tilePositionX -= 4;
        this.table.angle += 0.15;
    }
}