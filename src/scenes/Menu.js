class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // Load tile sprites.
        this.load.image('table', './assets/tilesprites/table.png');

        // Load spritesheets.
        this.load.image('mainMenu', './assets/screens/mainMenu.png');
        this.load.spritesheet('playButton', './assets/spritesheets/buttons/playButton.png', {
            frameWidth: 32,
            frameHeight: 16,
            startFrame: 0,
            endFrame: 1
        });
        this.load.spritesheet('tutorialButton', './assets/spritesheets/buttons/tutorialButton.png', {
            frameWidth: 16,
            frameHeight: 8,
            startFrame: 0,
            endFrame: 1
        });
        this.load.spritesheet('creditsButton', './assets/spritesheets/buttons/creditsButton.png', {
            frameWidth: 32,
            frameHeight: 16,
            startFrame: 0,
            endFrame: 1
        });
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
        this.load.image('gameOver', './assets/screens/gameOver.png');
        this.load.spritesheet('menuButton', './assets/spritesheets/buttons/menuButton.png', {
            frameWidth: 16,
            frameHeight: 8,
            startFrame: 0,
            endFrame: 1
        });
        this.load.spritesheet('restartButton', './assets/spritesheets/buttons/restartButton.png', {
            frameWidth: 16,
            frameHeight: 8,
            startFrame: 0,
            endFrame: 1
        });
        this.load.image('tutorial', './assets/screens/tutorial.png');
        this.load.image('credits', './assets/screens/credits.png');
        
        // Load audio.
        this.load.audio('eggCrack', './assets/sound/eggCrack.wav');
        this.load.audio('buttonPress', './assets/sound/buttonPress.wav');
        this.load.audio('warp', './assets/sound/warp.wav');
        this.load.audio('chargeUp', './assets/sound/chargeUp.wav');
        this.load.audio('music', './assets/sound/QubeSounds - ElectronicFutureBeats.wav');
    }

    create() {
        // Background art.
        this.mainMenuScreen = this.add.sprite(0, -15, 'mainMenu').setOrigin(0, 0);

        // Add buttons.
        this.playButton = new Button(this, game.config.width / 2, game.config.height * 9/16, 'playButton', 0, 5, () => {this.scene.start('playScene')});
        this.tutorialButton = new Button(this, game.config.width / 2, game.config.height * 23/32, 'tutorialButton', 0, 10, () => {this.scene.start('tutorialScene')});
        this.creditsButton = new Button(this, game.config.width / 2, game.config.height * 7/8, 'creditsButton', 0, 5, () => {this.scene.start('creditsScene')});
    }
}