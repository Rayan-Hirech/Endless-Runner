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
    }

    create() {
        // Place background table tile sprite.
        this.table = this.add.tileSprite(0, 0, 2560, 2560, 'table').setOrigin(0.5, 0.5);

        // Add player egg.
        this.p1Egg = this.add.sprite(eggPadding, game.config.height * startingHeight, 'egg').setOrigin(0, 0).setScale(4);
        this.eggCharge = this.add.sprite(eggPadding, game.config.height * startingHeight, 'charge').setOrigin(0, 0).setScale(4);

        // Define keys.
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);

        // Set up variables.
        this.chargingTeleport = false;
        this.coolingDown = false;
        this.chargeMeter = 0;
    }

    update(time, delta) {
        // Rotate table tile sprite.
        this.table.angle += baseMoveSpeed;

        // Animate egg rolling.
        this.p1Egg.play({key: 'roll', frameRate: baseEggFrameRate}, true);
        if (!this.chargingTeleport && !this.coolingDown) {
            this.eggCharge.play('unchargedIdle', true);
        }

        if (!this.chargingTeleport && !this.coolingDown && Phaser.Input.Keyboard.JustDown(keyUP)) {
            this.chargingTeleport = true;
        } else if (!this.chargingTeleport && !this.coolingDown && Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            this.chargingTeleport = true;
        }

        if (this.chargingTeleport && Phaser.Input.Keyboard.JustUp(keyUP)) {
            this.chargingTeleport = false;
            this.coolingDown = true;
        } else if (this.chargingTeleport && Phaser.Input.Keyboard.JustUp(keyDOWN)) {
            this.chargingTeleport = false;
            this.coolingDown = true;
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
            this.chargeMeter -= (delta / (chargeTime * 500)) * 100;
            if (this.chargeMeter <= 0) {
                this.chargeMeter = 0;
            }
            let currentFrame = Math.ceil((this.chargeMeter / 100) * 7);
            this.eggCharge.setFrame(currentFrame);
        }
    }
}