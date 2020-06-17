class Utils {
  static clone(obj) {
    if (obj == null || typeof (obj) != 'object')
        return obj;
    var temp = new obj.constructor();
    for (var key in obj)
        temp[key] = Utils.clone(obj[key]);
    return temp;
  }

  static normalize(point, scale) {
    let norm = Math.sqrt(point.x * point.x + point.y * point.y);
    if (norm !== 0) {
        point.x = scale * point.x / norm;
        point.y = scale * point.y / norm;
    }
    return point;
  }

  static vsum(v1, v2, norm = false) {
    let ret = {x: v1.x + v2.x, y: v1.y + v2.y}
    return norm? Utils.normalize(ret) : ret;
  }

  static magnitude(v) {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }
}
module.exports = Utils;