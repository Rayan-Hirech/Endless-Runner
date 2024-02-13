/*
Name: Rayan Hirech
Game Title (Working Title): Teleporting Egg
Hours Spent: 7
Creative Tilt:
*/

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 640,
    render: {
        pixelArt: true
    },
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);

// Reserve key bindings.
let keyUP, keyDOWN;

// Configure play scene.
let eggPadding = 10;
let startingHeight = 9/16;
let chargeTime = 2;
let baseMoveSpeed = 0.4;
let baseEggFrameRate = 5;
let baseChargeFrameRate = 7;