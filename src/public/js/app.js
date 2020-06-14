(() => {
    const io = require('../lib/socket.io');
    var Intro = require('./intro');
    window.socket = io(); // require('../lib/socket.io');
    window.socket.id = 1;
    const config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        scene: [Intro],
        parent: "game",
        antialias: true
    };
    const game = new Phaser.Game(config);
    document.addEventListener('contextmenu', event => event.preventDefault());
})();