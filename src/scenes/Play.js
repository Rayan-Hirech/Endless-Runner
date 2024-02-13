class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // Create animations.
        this.anims.create({
            key: 'roll',
            frameRate: 5,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('egg', {
                start: 0,
                end: 3
            })
        });
    }

    create() {
        // Place background table tile sprite.
        this.table = this.add.tileSprite(0, 0, 2560, 2560, 'table').setOrigin(0.5, 0.5);

        // Add player egg.
        this.p1Egg = this.add.sprite(eggPadding, game.config.height * 9/16, 'egg').setOrigin(0, 0).setScale(4);
    }

    update() {
        // Rotate table tile sprite.
        this.table.angle += baseMoveSpeed;

        // Animate egg rolling.
        this.p1Egg.play('roll', true);
    }
}