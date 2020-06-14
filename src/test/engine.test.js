const MyEngine = require("../services/physics");
const EntityCollection = require('../models/entityCollection');
const TreeNode = require("../models/treeNode");
const Probe = require("../models/probe/probe");

let collection = new EntityCollection();
collection.push(new Probe({
    x: 100,
    y: 100,
    s: 1,
    id: "A",
    r: 5,
    v: {x: 1, y: 1}
}));
collection.push(new Probe({
    x: 110,
    y: 110,
    s: 1,
    id: "B",
    r: 5,
    v: {x: -1, y: -1}
}));
let myEngine = new MyEngine(collection, 5000, 5000);

test('init', () => {
    expect(collection.stat().count).toBe(2);
});

test('isHit', () => {
    myEngine.tick();
    let A = myEngine.bodies.peek("A");
    let B = myEngine.bodies.peek("B");
    expect(A.x).toBe(101);
    expect(A.y).toBe(101);
    expect(B.x).toBe(109);
    expect(B.y).toBe(109);
    expect(MyEngine.isHit(A, B)).toBe(false);
    myEngine.tick();
    expect(A.x).toBe(102);
    expect(A.y).toBe(102);
    expect(B.x).toBe(108);
    expect(B.y).toBe(108);
    expect(MyEngine.isHit(A, B)).toBe(true);
    expect(myEngine.collisions.length).toBe(1);
});