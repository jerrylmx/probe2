const BW = 208*2;
class BGRender {
  constructor(scene) {
    // scene.add.tileSprite(0, 0, BW, BW, 'bg');
    this.body = scene.add.tileSprite(0, 0,  window.innerWidth, window.innerHeight, 'bg');
    // scene.add.tileSprite(2500, 2500, 5000, 5000, 'bg');
  }

  update(entity) {

  }

  destroy() {

  }
}
module.exports = BGRender;