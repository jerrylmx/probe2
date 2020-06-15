/**
 * Node structure
 * -----------
 * | c0 | c1 |
 * -----------
 * | c2 | c3 |
 * -----------
 */
const X_MAX = 5000;
const Y_MAX = 5000;
class TreeNode {
    constructor(cx, cy, level = 0, children = [], payload = null) {
        // Node center position
        this.cx = cx;
        this.cy = cy;

        // Level (Root has level 0)
        this.level = level;

        // Leaf node has no children
        this.children = children;

        // Non-leaf nood has no payload
        this.payload = payload;
    }

    /**
     * Recursively create a tree of depth, centered at (cx, cy)
     */
    static constructTree(cx, cy, depth, level=0) {
        if (depth === 0) {
            return new TreeNode(cx, cy, level, null, []);
        }
        let L = TreeNode.getBucketWidth(level + 1);
        // Subnodes positioned using offset L
        return new TreeNode(cx, cy, level, [
            TreeNode.constructTree(cx - L, cy - L, depth - 1, level + 1),
            TreeNode.constructTree(cx + L, cy - L, depth - 1, level + 1),
            TreeNode.constructTree(cx - L, cy + L, depth - 1, level + 1),
            TreeNode.constructTree(cx + L, cy + L, depth - 1, level + 1)
        ]);
    }

    /**
     * Get bucket width based on current level
     */
    static getBucketWidth(level) {
        return 5000 / Math.pow(2, level + 1);
    }

    /**
     *     0      cy-width       1
     *                |
     * cx-width-----cx,cy-----cx+width
     *                |
     *     2      cy+width       3
     */
    static getQuadrant(cx, cy, x, y, width) {
        if (cx - width <= x && x <= cx && cy - width <= y && y <= cy) {
            return 0;
        } else if (cx - width <= x && x <= cx && cy < y && y <= cy + width) {
            return 2;
        } else if (cx < x && x <= cx + width && cy - width <= y && y <= cy) {
            return 1;
        } else {
            return 3;
        }
    }

    /**
     * Find a 'path' to a target leaf container
     * Path can be used as an id of nodes
     */
    static getPath(x, y, root, maxLvl) {
        let path = [];
        let lvl = root.level;
        let cx = root.cx;
        let cy = root.cy;
        let w = TreeNode.getBucketWidth(lvl);
        let ind;
        while (lvl <= maxLvl) {
            ind = TreeNode.getQuadrant(cx, cy, x, y, w);
            cx = (ind === 0 || ind === 2)? cx - w/2 : cx + w/2;
            cy = (ind === 0 || ind === 1)? cy - w/2 : cy + w/2;
            lvl++;
            w = TreeNode.getBucketWidth(lvl);
            path.push(ind);
        }
        return path.join('');
    }

    /**
     * Store a spacial object
     */
    insert(object) {
        if (!this.children) {
            this.payload.push(object);
            return;
        }
        let w = TreeNode.getBucketWidth(this.level);
        let index = TreeNode.getQuadrant(this.cx, this.cy, object.x, object.y, w);
        return this.children[index].insert(object);
    }

    /**
     * Store a spacial object
     */
    remove(object) {
        if (!this.children) {
            let ret = null;
            for (let i = 0; i < this.payload.length; i++) {
                if (this.payload[i].id === object.id) {
                    ret = this.payload[i].id;
                    this.payload.splice(i, 1);
                    break;
                }
            }
            return ret;
        }
        let w = TreeNode.getBucketWidth(this.level);
        let index = TreeNode.getQuadrant(this.cx, this.cy, object.x, object.y, w);
        return this.children[index].remove(object);
    }

    /**
     * Relocate an entity to a different bucket
     */
    relocate(ov, nv) {
        let success = this.remove(ov);
        if (!success) {
            throw "Entity doesn't exist";
        }
        this.insert(nv);
    }

    /**
     * Find node on a given path
     */
    searchByPath(path) {
        if (path.length === 0) {
            return this;
        }
        let ind = path[0];
        path.splice(0, 1);
        return this.children[ind].searchByPath(path);
    }

    /**
     * Among current children, find node which contains (x,y) on given level
     */
    searchNode(x, y, level) {
        if (x > X_MAX || x < 0 || y > Y_MAX || y < 0) return null;
        if (!this.children) return this;
        let w = TreeNode.getBucketWidth(this.level);
        let index = TreeNode.getQuadrant(this.cx, this.cy, x, y, w);
        if (this.level === level - 1) {
            return this.children[index];
        } else {
            return this.children[index].searchNode(x, y, level);
        }
    }

    /**
     * Find node which contains (x,y) AND its adjacent nodes on given level
     */
    searchNearByNodes(x, y, level, r=1) {
        let res = [];
        let c = 0;
        let w = TreeNode.getBucketWidth(level - 1);
        let cNode = this.searchNode(x, y, level);
        if (!cNode) {
            console.log(`${x}-${y}-${level}`);
        }
        for (let i = cNode.cx-r*w; i <= cNode.cx+r*w; i+=w) {
            for (let j = cNode.cy-r*w; j <= cNode.cy+r*w; j+=w) {
                res.push(this.searchNode(i, j, level));
                c++;
            }
        }
        return res.filter(n => n);
    }

    /**
     * Find merged payloads among target node and its neighbours
     */
    searchNearByPayloadsMerged(x, y, level, r=1) {
        let nodes = this.searchNearByNodes(x, y, level, r);
        return [].concat.apply([], nodes.map(findPayloads));
    }

    /**
     * Print tree content
     */
    print(prefix = '0', showAll = false) {
        let center = `(${this.cx},${this.cy})`;
        if (!this.children) {
            if (!showAll && !this.payload.length) return;
            console.log(`${prefix} ${center}: ${this.payload.map(o => `[ID: ${o.id} (${o.x}, ${o.y})]`)}`);
            return;
        } else {
            console.log(`${prefix} ${center}`);
        }
        this.children[0].print(prefix + ' 0');
        this.children[1].print(prefix + ' 1');
        this.children[2].print(prefix + ' 2');
        this.children[3].print(prefix + ' 3');
    }


}

function findPayloads(node) {
    if (node.payload) {
        return node.payload;
    } else {
        return [
            ...findPayloads(node.children[0]),
            ...findPayloads(node.children[1]),
            ...findPayloads(node.children[2]),
            ...findPayloads(node.children[3])
        ]
    }
}
module.exports = TreeNode;