const GridService = require('../services/gridService');
const TreeNode = require("./treeNode");

/**
 * Data structure for efficient searching spacial entitiess
 */
class EntityCollection {

    constructor() {
        this.entityMap = {};
        this.depth = 3;
        // Quad tree
        let w = global.W/2 || 5000/2;
        let h = global.H/2 || 5000/2;
        this.qTree = TreeNode.constructTree(w, h, this.depth);
    }


    push(entity) {
        if (!this.entityMap[entity.id]) {
            this.qTree.insert(entity);
            this.entityMap[entity.id] = entity;
        }
    }

    // Pop an entity from quad tree
    pop(id) {
        let entity = this.entityMap[id];
        if (entity) {
            this.qTree.remove(entity);
            delete this.entityMap[id];
        }
    }

    // Search an entity from quad tree
    peek(id) {
        return this.entityMap[id];
    }

    peekClosestNeighboursIncludeSelf(id) {
        let e = this.peek(id);
        return this.qTree.searchNearByPayloadsMerged(e.x, e.y, this.depth);
    }

    peekClosestNeighbours(id) {
        return this.peekClosestNeighboursIncludeSelf(id).filter(obj => obj.id !== id);
    }

    peekNeighbours(id) {
        let e = this.peek(id);
        return this.qTree.searchNearByPayloadsMerged(e.x, e.y, this.depth-1).filter(obj => obj.id !== id);
    }

    stat() {
        return {
            count: Object.keys(this.entityMap).length
        }
    }

    relocate(ov, nv) {
        this.qTree.relocate(ov, nv);
    }
}

module.exports = EntityCollection;