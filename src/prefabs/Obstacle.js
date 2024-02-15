// Obstacle prefab.
class Obstacle extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, rotationSpeed, minStart, maxStart) {
        super(scene, x, y, texture, frame);

        // Add obstacle to existing scene.
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Configure physics.
        this.body.setSize(this.width * 3/4, this.height * 7/8);
        this.body.setOffset(0.5, 2);
        this.body.setImmovable(true);

        // Variables.
        this.startingX = x;
        this.startingY = y;
        this.magnitude = 0;
        this.minAngle = -30;
        this.maxAngle = 150;
        this.theta = this.minAngle;
        this.baseRotationSpeed = rotationSpeed;
        this.rotationSpeed = this.baseRotationSpeed
        this.minStart = minStart;
        this.maxStart = maxStart;
        this.baseMinDelay = 1;
        this.baseMaxDelay = 4;
        this.minDelay = this.baseMinDelay;
        this.maxDelay = this.baseMaxDelay;
        this.expired = false;
        this.timer = 0;
        this.delay = 0;
    }

    update(time, delta, gameTimer) {
        this.theta += this.rotationSpeed;
        if (this.theta < this.maxAngle) {
            this.calculatePosition();
        } else if (!this.expired) {
            // Reset
            this.delay = Phaser.Math.Between(this.minDelay, this.maxDelay) * 1000;
            this.expired = true;
        }

        if (this.expired && this.timer >= this.delay) {
            this.expired = false;
            this.timer = 0;
            this.reset(gameTimer);
        } else if (this.expired) {
            this.timer += delta;
        }
    }

    setStartingPosition(x, a = this.minAngle) {
        this.magnitude = x;
        this.theta = a;
        this.calculatePosition();
    }
    
    calculatePosition() {
        let a = this.theta >= 0 ? this.theta : this.theta + 360;
        let newX = Math.cos(2 * Math.PI * a / 360) * this.magnitude;
        let newY = Math.sin(2 * Math.PI * a / 360) * this.magnitude;
        this.x = newX;
        this.y = newY;
    }

    reset(gameTimer) {
        let newX = Phaser.Math.Between(this.minStart, this.maxStart);
        let d = 100 - (gameTimer / 1000);
        while (d < 0) {
            d += 100;
        }
        this.setDepth(d);
        this.setStartingPosition(newX);

        // Scale difficulty with time.
        this.rotationSpeed = this.baseRotationSpeed * (1 + gameTimer / 30000);
        this.minDelay = this.baseMinDelay / (1 + (gameTimer / 30000));
        this.maxDelay = this.baseMaxDelay / (1 + (gameTimer / 30000));
    }
}