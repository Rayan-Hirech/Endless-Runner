class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // Load tile sprites.
        this.load.image('table', './assets/tilesprites/table.png');

        // Load spritesheets.
        this.load.spritesheet('egg', './assets/spritesheets/egg.png', {
            frameWidth: 16,
            frameHeight: 18,
            startFrame: 0,
            endFrame: 4
        });
        this.load.spritesheet('charge', './assets/spritesheets/charge.png', {
            frameWidth: 16,
            frameHeight: 18,
            startFrame: 0,
            endFrame: 11
        });
        this.load.image('mug', './assets/sprites/mug.png');
    }

    create() {
        this.scene.start('playScene');
    }
}