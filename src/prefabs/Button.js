// Button prefab.
class Button extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, size, effect) {
        super(scene, x, y, texture, frame);

        // Add obstacle to existing scene.
        scene.add.existing(this);

        // Configure button.
        this.setOrigin(0.5, 0.5).setScale(size).setDepth(220).setInteractive();

        // Set up button behaviour.
        this.on('pointerout', () => {
            if (this.visible) {
                this.setFrame(0)
            }
        });
        this.on('pointerover', () => {
            if (this.visible) {
                this.setFrame(1)
            }
        });
        this.on('pointerdown', () => {
            if (this.visible) {
                effect()
            }
        });
    }
}