/*
Name: Rayan Hirech
Game Title (Working Title): Teleporting Egg
Hours Spent: 10
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
let eggPadding = 10; // Egg distance from left side of the screen.
let startingHeight = 9/16; // Player starting location (around the middle).
let minHeight = 1/4; // Highest point the player can be.
let maxHeight = 7/8; // Lowest point the player can be.
let chargeFactor = 0.5; // The distance of a fully charged teleport is playing field width * chargeFactor.
let chargeTime = 1; // Amount of time (in seconds) to reach max teleport charge (cooling down takes a quarter of the time).
let tpTime = 0.3; // How long a teleport takes in seconds.
let baseMoveSpeed = 0.4; // Starting table rotation speed (scales over time).
let baseEggFrameRate = 5; // Starting egg rolling animation speed (scales over time).