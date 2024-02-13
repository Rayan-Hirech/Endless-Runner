/*
Name: Rayan Hirech
Game Title:
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
    scene: [Play]
}

let game = new Phaser.Game(config);