var ProbeRender = require('../renders/probe');
class RenderUtils {
  static getRender(type, data, scene) {
      switch (type) {
          case "p":
              return new ProbeRender(data, scene);
          default:
              return new ProbeRender(data, scene);
      }
  }
}
module.exports = RenderUtils;