/*
Name: Rayan Hirech
Game Title: Teleport Egg
Hours Spent: 22
Creative Tilt: I incorporated two unique elements to make my game creative.
    First, the obstacles move in an arc instead of a straight line, to simulate an egg's curved rolling path.
        To accomplish this, I used trigonometry to calculate the position the obstacle would be along a circle given it's angular velocity.
        In terms of gameplay, it becomes more challenging to predict the trajectory of an obstacle, since different radii lead to different velocities.
    Second, the player has to charge a teleport to move their character.
        This way, the player has to eyeball how much to charge to go a certain distance.
        The player has to strategically wait for the right time to start charging, so they don't charge for too little or too long.
        In addition, there is a short cooldown on teleportation, so players can't just spam it.
*/

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 640,
    backgroundColor: '7A513D',
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [Menu, Tutorial, Credits, Play]
}

let game = new Phaser.Game(config);

// Reserve key bindings.
let keyUP, keyDOWN;