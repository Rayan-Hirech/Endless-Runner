class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
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

        // Add player egg.
        this.p1Egg = this.physics.add.sprite(eggPadding, game.config.height * startingHeight, 'egg').setOrigin(0, 0).setScale(4);
        this.eggCharge = this.add.sprite(eggPadding, game.config.height * startingHeight, 'charge').setOrigin(0, 0).setScale(4);

        // Define keys.
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // Set up variables.
        this.chargingTeleport = false;
        this.isTeleporting = false;
        this.hasTeleported = false;
        this.coolingDown = false;
        this.tpDirection = 'none';
        this.chargeMeter = 0;
        this.teleportTimer = 0;
    }

    update(time, delta) {
        // Rotate table tile sprite.
        this.table.angle += baseMoveSpeed;

        // Animate egg rolling.
        this.p1Egg.play({key: 'roll', frameRate: baseEggFrameRate}, true);
        if (!this.chargingTeleport && !this.coolingDown) {
            this.eggCharge.play('unchargedIdle', true);
        }

        // Teleportat the egg.
        this.teleportEgg(delta);
    }

    // Handles teleportation, charging, and animation.
    teleportEgg(delta) {
        if (!this.chargingTeleport && !this.isTeleporting && !this.coolingDown && Phaser.Input.Keyboard.JustDown(keyUP)) {
            this.chargingTeleport = true;
            this.tpDirection = 'up';
        } else if (!this.chargingTeleport && !this.isTeleporting && !this.coolingDown && Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            this.chargingTeleport = true;
            this.tpDirection = 'down';
        }

        if (this.chargingTeleport && Phaser.Input.Keyboard.JustUp(keyUP) && this.tpDirection == 'up') {
            this.chargingTeleport = false;
            this.eggCharge.setFrame(8);
            this.isTeleporting = true;
            this.hasTeleported = false;
            this.teleportTimer = tpTime;
        } else if (this.chargingTeleport && Phaser.Input.Keyboard.JustUp(keyDOWN) && this.tpDirection == 'down') {
            this.chargingTeleport = false;
            this.eggCharge.setFrame(8);
            this.isTeleporting = true;
            this.hasTeleported = false;
            this.teleportTimer = tpTime;
        }

        if (this.chargingTeleport && this.chargeMeter == 100) {
            this.eggCharge.play('chargedIdle', true);
        }
        if (this.coolingDown && this.chargeMeter == 0) {
            this.coolingDown = false;
        }

        if (this.chargingTeleport && this.chargeMeter < 100) {
            this.chargeMeter += (delta / (chargeTime * 1000)) * 100;
            if (this.chargeMeter >= 100) {
                this.chargeMeter = 100;
            }
            let currentFrame = Math.ceil((this.chargeMeter / 100) * 7);
            this.eggCharge.setFrame(currentFrame);
        }
        if (this.coolingDown && this.chargeMeter > 0) {
            this.chargeMeter -= (delta / (chargeTime * 250)) * 100; //TODO
            if (this.chargeMeter <= 0) {
                this.chargeMeter = 0;
            }
            let currentFrame = Math.ceil((this.chargeMeter / 100) * 7);
            this.eggCharge.setFrame(currentFrame);
        }
        if (this.isTeleporting) {
            this.teleportTimer -= (delta / 1000);
            let frameOffset = Math.abs((((tpTime / 2) - this.teleportTimer) / (tpTime / 2)) * 4);
            let currentFrame = Math.ceil(11 - frameOffset);
            this.eggCharge.setFrame(currentFrame);
            if (!this.hasTeleported && currentFrame == 11) {
                this.hasTeleported = true;
                console.log(`yoop (${this.chargeMeter}) : ${this.getNewPosition(this.p1Egg.y, this.chargeMeter, this.tpDirection)}`);
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
        let maxDistance = (maxHeight - minHeight) * chargeFactor;
        let tpDistance = maxDistance * charge / 100;
        if (direction == 'up') {
            finalY -= tpDistance * game.config.height;
            if (finalY < (minHeight * game.config.height)) {
                finalY = minHeight * game.config.height;
            }
        } else if (direction == 'down') {
            finalY += tpDistance * game.config.height;
            if (finalY > (maxHeight * game.config.height)) {
                finalY = maxHeight * game.config.height;
            }
        }
        return finalY;
    }
}