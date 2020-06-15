const EntityCollection = require('../models/entityCollection');

class BoxService {
    static packInitData(target) {
        return {
            W: global.W,
            H: global.H,
            RATE: global.RATE,
            DEV_MODE: process.env.DEV_MODE,
            GRID_COUNT: global.GRID_COUNT,
            entities: []
        }
    }

    static packSyncData(id) {
        return {
            time: new Date().getTime(),
            entities: global.entityCollection.peekClosestNeighboursIncludeSelf(id)
        }
    }
}

module.exports = BoxService;