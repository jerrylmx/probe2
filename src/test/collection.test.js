const EntityCollection = require('../models/entityCollection');
const TreeNode = require("../models/treeNode");

let collection = new EntityCollection();
let E1 = {x: 2000, y: 2305, id: "E1"};

test('collection construction', () => {
  expect(Object.keys(collection.entityMap).length).toBe(0);
  expect(collection.qTree).toBeDefined();
});

test('push', () => {
    collection.push(E1);
    expect(Object.keys(collection.entityMap).length).toBe(1);
    expect(collection.entityMap["E1"]).toBeDefined();
    expect(collection.entityMap["E1"].id).toBe("E1");
    expect(collection.entityMap["E1"].x).toBe(2000);
    let n1 = collection.qTree.searchNode(2000, 2305, 3);
    expect(n1.payload.length).toBe(1);

});

test('pop', () => {
    collection.pop(E1.id);
    expect(Object.keys(collection.entityMap).length).toBe(0);
    let n1 = collection.qTree.searchNode(2000, 2305, 3);
    expect(n1.payload.length).toBe(0);
});