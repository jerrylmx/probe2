const Probe = require("./models/probe/probe");

class IOController {
    static gameJoin(cfg) {
        let probe = new Probe(cfg);
        global.entityCollection.push(probe);
        return probe;
    }
}
module.exports = IOController;