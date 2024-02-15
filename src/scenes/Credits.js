class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    create() {
        // Background art.
        this.creditsScreen = this.add.sprite(0, 0, 'credits').setOrigin(0, 0);

        // Add button.
        this.menuButton = new Button(this, game.config.width * 7/8, game.config.height * 15/16, 'menuButton', 0, 5, () => {this.scene.start('menuScene')});
    }
}