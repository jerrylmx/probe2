const BW = 208*2;
class BGRender {
  constructor(scene) {
    scene.add.tileSprite(0, 0, BW, BW, 'bg');
  }

  update(entity) {

  }

  destroy() {

  }
}
module.exports = BGRender;