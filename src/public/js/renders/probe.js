var ProbeBaseRender = require('./common/probeBase');
class ProbeRender extends ProbeBaseRender {
  constructor(data, scene) {
    super(data, scene);
  }

  update(data) {
    this.body.x = data.x;
    this.body.y = data.y;
  }

  destroy() {

  }
}
module.exports = ProbeRender;