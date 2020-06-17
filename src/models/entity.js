const IdService = require("../services/idService");
const SpawnService = require("../services/spawnService");
const EntityCollection = require("./entityCollection");
class Entity {
    constructor(config) {
        let pos = SpawnService.getRandomSpawnLocation();
        this.id = config.id || IdService.getId(config.type);
        this.sid = config.sid;
        this.x = config.x || pos.x;
        this.y = config.y || pos.y;
        this.s = config.s || 5;
        this.r = config.r || 2;
        this.sOrg = this.s
        this.v = config.v || {x: 0, y: 0};
    }

    sync() {

    }

    destroy() {

    }
}

module.exports = Entity;
