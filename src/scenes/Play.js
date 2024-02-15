class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    init() {
        this.eggPadding = 10; // Egg distance from left side of the screen.
        this.startingHeight = 9/16; // Player starting location (around the middle).
        this.minHeight = 1/4; // Highest point the player can be.
        this.maxHeight = 7/8; // Lowest point the player can be.
        this.chargeFactor = 1; // The distance of a fully charged teleport is playing field width * chargeFactor.
        this.chargeTime = 2; // Amount of time (in seconds) to reach max teleport charge (cooling down takes a quarter of the time).
        this.tpTime = 0.3; // How long a teleport takes in seconds.
        this.baseMoveSpeed = 0.4; // Starting table rotation speed (scales over time).
        this.baseEggFrameRate = 5; // Starting egg rolling animation speed (scales over time).
    }

    preload() {
        // Create animations.
        this.anims.create({
            key: 'roll',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('egg', {
                start: 0,
                end: 3
            })
        });
        this.anims.create({
            key: 'crack',
            repeat: -1,
            frames: this.anims.generateFrameNumbers('egg', {
                start: 4,
                end: 4
            })
        });
        this.anims.create({
            key: 'unchargedIdle',
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('charge', {
                start: 0,
                end: 0
            })
        });
        this.anims.create({
            key: 'chargedIdle',
            frameRate: 0,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('charge', {
                start: 7,
                end: 7
            })
        });
        this.anims.create({
            key: 'charge',
            repeat: 0,
            frames: this.anims.generateFrameNumbers('charge', {
                start: 1,
                end: 7
            })
        });
        this.anims.create({
            key: 'teleport',
            repeat: 0,
            frames: this.anims.generateFrameNumbers('charge', {
                start: 8,
                end: 11
            }),
        });
    }

    create() {
        // Place background table tile sprite.
        this.table = this.add.tileSprite(0, 0, 2560, 2560, 'table').setOrigin(0.5, 0.5);

        // Define keys.
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // Set up variables.
        this.gameOver = false;
        this.chargingTeleport = false;
        this.isTeleporting = false;
        this.hasTeleported = false;
        this.coolingDown = false;
        this.tpDirection = 'none';
        this.chargeMeter = 0;
        this.teleportTimer = 0;
        this.gameTimer = 0;

        // Create obstacles.
        this.obs01 = new Obstacle(this, this.startingHeight * game.config.width, 0, 'mug', 0, this.baseMoveSpeed, this.minHeight * game.config.width, this.maxHeight * game.config.width).setOrigin(0, 0).setScale(6).setDepth(4);
        this.obs01.setStartingPosition(this.startingHeight * game.config.width);
        this.obs02 = new Obstacle(this, this.minHeight * game.config.width, 0, 'mug', 0, this.baseMoveSpeed, this.minHeight * game.config.width, this.maxHeight * game.config.width).setOrigin(0, 0).setScale(6).setDepth(3);
        this.obs02.setStartingPosition(this.minHeight * game.config.width, -90);
        this.obs03 = new Obstacle(this, this.maxHeight * game.config.width, 0, 'mug', 0, this.baseMoveSpeed, this.minHeight * game.config.width, this.maxHeight * game.config.width).setOrigin(0, 0).setScale(6).setDepth(2);
        this.obs03.setStartingPosition(this.maxHeight * game.config.width, -60);
        this.obs04 = new Obstacle(this, this.startingHeight * game.config.width, 0, 'mug', 0, this.baseMoveSpeed, this.minHeight * game.config.width, this.maxHeight * game.config.width).setOrigin(0, 0).setScale(6).setDepth(1);
        this.obs04.setStartingPosition(this.startingHeight * game.config.width, -120);
        this.obs05 = new Obstacle(this, this.maxHeight * game.config.width, 0, 'mug', 0, this.baseMoveSpeed, this.minHeight * game.config.width, this.maxHeight * game.config.width, this.baseMoveSpeed * 1.5).setOrigin(0, 0).setScale(6).setDepth(1);
        this.obs05.setStartingPosition(this.maxHeight * game.config.width);
        this.obs06 = new Obstacle(this, this.minHeight * game.config.width, 0, 'mug', 0, this.baseMoveSpeed, this.minHeight * game.config.width, this.maxHeight * game.config.width, this.baseMoveSpeed * 2).setOrigin(0, 0).setScale(6).setDepth(1);
        this.obs06.setStartingPosition(this.minHeight * game.config.width, -60);

        // Add player egg.
        this.p1Egg = this.physics.add.sprite(this.eggPadding, game.config.height * this.startingHeight, 'egg').setOrigin(0, 0).setScale(4).setDepth(100);
        this.eggCharge = this.add.sprite(this.eggPadding, game.config.height * this.startingHeight, 'charge').setOrigin(0, 0).setScale(4).setDepth(120);
        this.p1Egg.body.setSize(this.p1Egg.width * 5/8, this.p1Egg.height * 3/4);

        // Add colliders.
        this.physics.add.collider(this.p1Egg, this.obs01, () => {this.endGame()});
        this.physics.add.collider(this.p1Egg, this.obs02, () => {this.endGame()});
        this.physics.add.collider(this.p1Egg, this.obs03, () => {this.endGame()});
        this.physics.add.collider(this.p1Egg, this.obs04, () => {this.endGame()});
        this.physics.add.collider(this.p1Egg, this.obs05, () => {this.endGame()});
        this.physics.add.collider(this.p1Egg, this.obs06, () => {this.endGame()});

        // Display timer.
        let timerConfig = {
            fontFamily: 'Verdana',
            fontSize: '28px',
            backgroundColor: '#553322',
            color: '#EDD5B5',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        };
        this.timerDisplay = this.add.text(20, 10, Math.ceil(this.gameTimer / 1000), timerConfig);

        // Add game over screen.
        this.gameOverScreen = this.add.sprite(0, 0, 'gameOver').setOrigin(0, 0).setDepth(200);
        this.gameOverScreen.visible = false;
        this.menuButton = new Button(this, game.config.width * 1/4, game.config.height * 7/8, 'menuButton', 0, 10, () => {this.scene.start('menuScene')});
        this.menuButton.visible = false;
        this.restartButton = new Button(this, game.config.width * 3/4, game.config.height * 7/8, 'restartButton', 0, 10, () => {this.scene.restart()});
        this.restartButton.visible = false;

        // Add teleport charging sound.
        this.chargeSFX = this.sound.add('chargeUp');

        // Add music.
        this.music = this.sound.add('music');
        this.music.loop = true;
        this.music.play({volume: 0.25});
    }

    update(time, delta) {
        if (!this.gameOver) {
            // Rotate table tile sprite.
            this.table.angle += this.baseMoveSpeed * (1 + this.gameTimer / 30000);

            // Move the obstacles.
            this.obs01.update(time, delta, this.gameTimer);
            this.obs02.update(time, delta, this.gameTimer);
            this.obs03.update(time, delta, this.gameTimer);
            this.obs04.update(time, delta, this.gameTimer);
            if (this.gameTimer / 1000 > 15) {
                this.obs05.update(time, delta, this.gameTimer);
            }
            if (this.gameTimer / 1000 > 30) {
                this.obs06.update(time, delta, this.gameTimer);
            }

            // Animate egg rolling.
            this.p1Egg.play({key: 'roll', frameRate: this.baseEggFrameRate}, true);
            if (!this.chargingTeleport && !this.coolingDown) {
                this.eggCharge.play('unchargedIdle', true);
            }

            // Teleport the egg.
            this.teleportEgg(delta);

            // Update game timer.
            this.gameTimer += delta;
            this.timerDisplay.text = Math.ceil(this.gameTimer / 1000);
        }
    }

    // Handles teleportation, charging, and animation.
    teleportEgg(delta) {
        if (!this.chargingTeleport && !this.isTeleporting && !this.coolingDown && Phaser.Input.Keyboard.JustDown(keyUP)) {
            this.chargingTeleport = true;
            this.chargeSFX.play();
            this.tpDirection = 'up';
        } else if (!this.chargingTeleport && !this.isTeleporting && !this.coolingDown && Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            this.chargingTeleport = true;
            this.chargeSFX.play();
            this.tpDirection = 'down';
        }

        if (this.chargingTeleport && Phaser.Input.Keyboard.JustUp(keyUP) && this.tpDirection == 'up') {
            this.chargingTeleport = false;
            this.eggCharge.setFrame(8);
            this.chargeSFX.stop();
            this.sound.play('warp', {volume: 0.5});
            this.isTeleporting = true;
            this.hasTeleported = false;
            this.teleportTimer = this.tpTime;
        } else if (this.chargingTeleport && Phaser.Input.Keyboard.JustUp(keyDOWN) && this.tpDirection == 'down') {
            this.chargingTeleport = false;
            this.eggCharge.setFrame(8);
            this.chargeSFX.stop();
            this.sound.play('warp', {volume: 0.5});
            this.isTeleporting = true;
            this.hasTeleported = false;
            this.teleportTimer = this.tpTime;
        }

        if (this.chargingTeleport && this.chargeMeter == 100) {
            this.eggCharge.play('chargedIdle', true);
        }
        if (this.coolingDown && this.chargeMeter == 0) {
            this.coolingDown = false;
        }

        if (this.chargingTeleport && this.chargeMeter < 100) {
            this.chargeMeter += (delta / ((this.chargeTime / (1 + this.gameTimer / 30000)) * 1000)) * 100;
            if (this.chargeMeter >= 100) {
                this.chargeMeter = 100;
            }
            let currentFrame = Math.ceil((this.chargeMeter / 100) * 7);
            this.eggCharge.setFrame(currentFrame);
        }
        if (this.coolingDown && this.chargeMeter > 0) {
            this.chargeMeter -= (delta / ((this.chargeTime / (1 + this.gameTimer / 30000)) * 250)) * 100;
            if (this.chargeMeter <= 0) {
                this.chargeMeter = 0;
            }
            let currentFrame = Math.ceil((this.chargeMeter / 100) * 7);
            this.eggCharge.setFrame(currentFrame);
        }
        if (this.isTeleporting) {
            this.teleportTimer -= (delta / 1000);
            let frameOffset = Math.abs((((this.tpTime / 2) - this.teleportTimer) / (this.tpTime / 2)) * 4);
            let currentFrame = Math.ceil(11 - frameOffset);
            this.eggCharge.setFrame(currentFrame);
            if (!this.hasTeleported && currentFrame == 11) {
                this.hasTeleported = true;
                this.p1Egg.y = this.getNewPosition(this.p1Egg.y, this.chargeMeter, this.tpDirection);
                this.eggCharge.y = this.getNewPosition(this.eggCharge.y, this.chargeMeter, this.tpDirection);
                this.tpDirection = 'none';
            }
            if (this.teleportTimer <= 0) {
                this.isTeleporting = false;
                this.coolingDown = true;
            }
        }
    }

    getNewPosition(currentY, charge, direction) {
        let finalY = currentY;
        let maxDistance = (this.maxHeight - this.minHeight) * this.chargeFactor;
        let tpDistance = maxDistance * charge / 100;
        if (direction == 'up') {
            finalY -= tpDistance * game.config.height;
            if (finalY < (this.minHeight * game.config.height)) {
                finalY = this.minHeight * game.config.height;
            }
        } else if (direction == 'down') {
            finalY += tpDistance * game.config.height;
            if (finalY > (this.maxHeight * game.config.height)) {
                finalY = this.maxHeight * game.config.height;
            }
        }
        return finalY;
    }

    endGame() {
        if (!this.gameOver) {
            this.gameOver = true;
            this.music.stop();
            this.sound.play('eggCrack');
            this.p1Egg.play('crack', false);
            this.eggCharge.setFrame(0);
            this.obs01.destroy();
            this.obs02.destroy();
            this.obs03.destroy();
            this.obs04.destroy();
            this.gameOverScreen.visible = true;
            this.menuButton.visible = true;
            this.restartButton.visible = true;
        }
    }
}