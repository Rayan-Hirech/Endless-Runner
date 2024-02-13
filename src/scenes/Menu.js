class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // Load tile sprites.
        this.load.image('table', './assets/tilesprites/table.png');

        // Load spritesheets.
        this.load.spritesheet('egg', './assets/spritesheets/egg.png', {
            frameWidth: 14,
            frameHeight: 16,
            startFrame: 0,
            endFrame: 3
        });
    }

    create() {
        this.scene.start('playScene');
    }
}