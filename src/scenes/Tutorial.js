class Tutorial extends Phaser.Scene {
    constructor() {
        super("tutorialScene");
    }

    create() {
        // Background art.
        this.tutorialScreen = this.add.sprite(0, 0, 'tutorial').setOrigin(0, 0);

        // Add button.
        this.menuButton = new Button(this, game.config.width * 7/8, game.config.height * 15/16, 'menuButton', 0, 5, () => {this.scene.start('menuScene')});
    }
}