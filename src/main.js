/*
Name: Rayan Hirech
Game Title (Working Title): Teleporting Egg
Hours Spent: 19
Creative Tilt:
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
    scene: [Menu, Play]
}

let game = new Phaser.Game(config);

// Reserve key bindings.
let keyUP, keyDOWN;