/*
Name: Rayan Hirech
Game Title (Working Title): Teleporting Egg
Hours Spent: 1
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