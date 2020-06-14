var BGRender = require('./renders/background');
class Intro extends Phaser.Scene {
    constructor (config) {
        super({ key: 'Intro', active: true });
    }

    preload () {
        this.load.image('bg', '../assets/bk.png');
    }

    create () {
        let time = 0;
        this.ping = 0;
        this.bgRender = new BGRender(this);
        // this.add.tileSprite(208*3, 208, 208*2, 208*2, 'bg');
        // let a = this.add.tileSprite(750, 250, 500, 500, 'bg');
        window.socket.on("Join", (data) => {
            console.log(data);
        });
        window.socket.on("Sync", (data) => {
            this.ping = data.time - time;
            console.log(this.ping);
            time = data.time;
        });
        window.socket.emit("Join", {
            id: window.socket.id,
            name: "",
            color: ""
        });
    }

}

module.exports = Intro;