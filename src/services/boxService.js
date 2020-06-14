const GridService = require("./gridService");

class BoxService {
    static packInitData(target) {
        return {
            W: global.W,
            H: global.H,
            RATE: global.RATE,
            DEV_MODE: process.env.DEV_MODE,
            GRID_COUNT: global.GRID_COUNT,
            entities: GridService.findNearByGridIndex(target.x, target.y)
        }
    }
}

module.exports = BoxService;