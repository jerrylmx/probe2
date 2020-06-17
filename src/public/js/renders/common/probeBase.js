class ProbeBaseRender {
  constructor(data, scene) {
    this.data = data;
    this.body = scene.add.container(data.x, data.y);
    let probe = scene.add.sprite(0, 0, 'ufo');
    probe.name = data.id;
    probe.depth = 1;
    probe.setScale(0.5);
    this.body.add([probe]);
  }

  update(data) {

  }

  destroy() {

  }
}
module.exports = ProbeBaseRender;