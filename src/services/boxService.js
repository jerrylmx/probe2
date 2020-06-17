const EntityCollection = require('../models/entityCollection');

class BoxService {
    static packInitData(id, me) {
        return {
            time: new Date().getTime(),
            W: global.W,
            H: global.H,
            RATE: global.RATE,
            DEV_MODE: process.env.DEV_MODE,
            GRID_COUNT: global.GRID_COUNT,
            me: me,
            entities: BoxService.packWindowData(id)
        }
    }

    static packSyncData(id) {
        return {
            time: new Date().getTime(),
            entities: BoxService.packWindowData(id)
        }
    }

    static packWindowData(id) {
        let entitiesArr = global.entityCollection.peekClosestNeighboursIncludeSelf(id);
        return entitiesArr.reduce(function(map, obj) {
            map[obj.id] = obj;
            return map;
        }, {});
    }
}

module.exports = BoxService;