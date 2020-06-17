var BGRender = require('./renders/background');
var ProbeRender = require('./renders/probe');
var Fmanager = require('./services/frame');
var Diff = require('./services/diff');
var RenderFactory = require('./services/rfactory');
class Intro extends Phaser.Scene {
    constructor (config) {
        super({ key: 'Intro', active: true });
    }

    preload () {
        this.load.image('bg', '../assets/bk.png');
        this.load.image('ufo', '../assets/ufo.png');
    }

    create () {
        let time = 0;
        this.ping = 0;
        this.bgRender = new BGRender(this);
        this.diff = new Diff({});
        window.entities = {};

        window.socket.on("Join", (data) => {
            // One-time settings for game scene
            this.ready = true;
            this.cfg = data;
            this.fmanager = new Fmanager({rate: data.RATE});
            this.fmanager.push(data.entities);
            this.diff.refresh(data.entities);
            let refDiff = this.diff.refDiff();
            refDiff.toAdd.forEach((data) => {
                window.entities[data.id] = RenderFactory.getRender(data.type, data, this);
            });
            this.me = window.entities[data.me.id];
            this.cameras.main.setBounds(-2000, -2000, 8000, 8000);
            this.cameras.main.setZoom(0.7);
            this.cameras.main.zoomTo(1, 500);
            this.cameras.main.startFollow(this.me.body);
        });
        window.socket.on("Sync", (data) => {
            if (!this.ready) return;
            this.ping = data.time - time;
            time = data.time;
            this.fmanager.push(data.entities);
        });
        window.socket.emit("Join", {
            id: window.socket.id,
            name: "",
            color: ""
        });
        // Controls
        let that = this;
        this.input.on('pointermove', function (event) {
            that.pointerPosition = {x: event.worldX, y: event.worldY};
            if (!that.me) return;
            let dir = new Phaser.Math.Vector2(event.worldX - that.me.body.x, event.worldY - that.me.body.y).normalize();
            let angle = Math.atan2(dir.y, dir.x) * 180 / Math.PI + 90;
            that.me.body.angle = angle;

            // Limit pointer move request
            if (that.pointerLocked) return;
            window.socket.emit("Move", { id: that.me.data.id, direction: dir, rotation: angle });
            that.pointerLocked = true;
            setTimeout(function () {
                this.pointerLocked = false;
            }.bind(that), 100);
        });
    }

    update() {
        if (!this.ready) return;
        if (this.fmanager.ready) {
            let entities = this.fmanager.pop();
            this.diff.refresh(entities);
            let diff = this.diff.refDiff();
            diff.toAdd.forEach((data) => {
                window.entities[data.id] = RenderFactory.getRender(data.type, data, this);
            });
            // diff.toRemove.forEach((data) => {
            //     window.entities[data.id].destroy(this);
            // });
            diff.toUpdate.forEach((data) => {
                window.entities[data.id].update(data, this);
            });
            this.bgRender.body.tilePositionX = this.me.body.x;
            this.bgRender.body.tilePositionY = this.me.body.y;
            this.bgRender.body.x = this.me.body.x;
            this.bgRender.body.y = this.me.body.y;
        }

    }
}
module.exports = Intro;