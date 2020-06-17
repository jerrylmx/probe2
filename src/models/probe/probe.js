const Entity = require("../entity");

class Probe extends Entity {
    constructor(config) {
        super(config);
        this.type = 'p';
    }
}

module.exports = Probe;