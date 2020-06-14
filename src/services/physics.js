class Physics {

    /**
     * Init engine with intial bodies and boundary
     */
    constructor(bodyCollection, width=5000, height=5000, rate=1000) {
        this.bodies = bodyCollection;
        this.collisions = [];
        this.width = width;
        this.height = height;
        this.rate = rate;
    }

    /**
     * Forward one frame
     */
    tick() {
        this.collisions = [];

        // Position update/relocate
        Object.keys(this.bodies.entityMap).forEach((id) => {
            let entity = this.bodies.entityMap[id];
            let entityOrg = Object.assign({}, entity);
            entity.x += entity.v.x * entity.s;
            entity.y += entity.v.y * entity.s;
            Physics.handleBoundary(entity);
            this.bodies.relocate(entityOrg, entity);
        });

        // Collision detection/handling
        Object.keys(this.bodies.entityMap).forEach((id) => {
            let e = this.bodies.entityMap[id];
            let neighbours = this.bodies.peekNeighbours(e.id);
            neighbours.forEach(n => {
                if (n.id < e.id) {
                    let result = Physics.handleHit(e, n);
                    result && this.collisions.push(result);
                }
            });

        });
    }

    start() {
        let that = this;
        setInterval(this.tick.bind(that), this.rate);
    }

    static handleHit(bodyA, bodyB) {
        if (Physics.isHit(bodyA, bodyB)) {
            return {bodyA: bodyA, bodyB: bodyB}
        }
        return null;
    }

    static isHit(bodyA, bodyB) {
        let dist = Physics.distSq(bodyA, bodyB);
        return dist <= Math.pow(bodyA.r + bodyB.r, 2);
    }

    static handleBoundary(body) {
        if (body.x >= 5000) {
            body.x = 5000;
            body.v.x = 0;
        }
        if (body.y >= 5000) {
            body.y = 5000;
            body.v.y = 0;
        }
        if (body.x <= 0) {
            body.x = 0;
            body.v.x = 0;
        }
        if (body.y <= 0) {
            body.y = 0;
            body.v.y = 0;
        }
    }


    static distSq(bodyA, bodyB) {
        return Math.pow(bodyA.x - bodyB.x, 2) + Math.pow(bodyA.y - bodyB.y, 2);
    }

    static dist(bodyA, bodyB) {
        return Math.sqrt(Physics.distSq(bodyA, bodyB));
    }
}

module.exports = Physics;