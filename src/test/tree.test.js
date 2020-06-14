const TreeNode = require("../models/treeNode");

let root = TreeNode.constructTree(5000/2, 5000/2, 3);
test('tree construction', () => {
  expect(root.level).toBe(0);
  expect(root.cx).toBe(5000/2);
  expect(root.cy).toBe(5000/2);
  expect(root.children.length).toBe(4);
  expect(root.children[0].level).toBe(1);
  expect(root.children[0].cx).toBe(5000/4);
  expect(root.children[0].cy).toBe(5000/4);
  expect(root.children[1].cx).toBe(5000*3/4);
  expect(root.children[1].cy).toBe(5000/4);
  expect(root.children[2].cx).toBe(5000/4);
  expect(root.children[2].cy).toBe(5000*3/4);
  expect(root.children[3].cx).toBe(5000*3/4);
  expect(root.children[3].cy).toBe(5000*3/4);
});

test('bucket size', () => {
  let w = TreeNode.getBucketWidth(0);
  expect(w).toBe(5000/2);
  w = TreeNode.getBucketWidth(1);
  expect(w).toBe(5000/4);
  w = TreeNode.getBucketWidth(2);
  expect(w).toBe(5000/8);
});

test('getQuadrant', () => {
  let w = TreeNode.getBucketWidth(0);
  let ind = TreeNode.getQuadrant(root.cx, root.cy, 2000, 2000, w);
  expect(ind).toBe(0);
  ind = TreeNode.getQuadrant(root.cx, root.cy, 2500, 2500, w);
  expect(ind).toBe(0);
  ind = TreeNode.getQuadrant(root.cx, root.cy, 2500, 2500, w);
  expect(ind).toBe(0);
  ind = TreeNode.getQuadrant(root.cx, root.cy, 2501, 2500, w);
  expect(ind).toBe(1);
  ind = TreeNode.getQuadrant(root.cx, root.cy, 2501, 0, w);
  expect(ind).toBe(1);
  ind = TreeNode.getQuadrant(root.cx, root.cy, 2501, 2501, w);
  expect(ind).toBe(3);
  w = TreeNode.getBucketWidth(1);
  ind = TreeNode.getQuadrant(root.children[3].cx, root.children[3].cy, 2501, 2501, w);
  expect(ind).toBe(0);
  ind = TreeNode.getQuadrant(root.children[3].cx, root.children[3].cy, 3800, 3800, w);
  expect(ind).toBe(3);
});


test('insert', () => {
  root.insert({x: 100, y:100, id: "A"});
  expect(root.searchByPath([0,0,0]).payload.length).toBe(1);
  expect(root.searchByPath([0,0,0]).payload[0].id).toBe("A");
  root.insert({x: 1251, y:100, id: "B"});
  expect(root.searchByPath([0,1,0]).payload.length).toBe(1);
  expect(root.searchByPath([0,1,0]).payload[0].id).toBe("B");
  root.insert({x: 1251, y:651, id: "C"});
  expect(root.searchByPath([0,1,2]).payload.length).toBe(1);
  expect(root.searchByPath([0,1,2]).payload[0].id).toBe("C");
  root.insert({x: 3126, y:3126, id: "D"});
  expect(root.searchByPath([3,0,3]).payload.length).toBe(1);
  expect(root.searchByPath([3,0,3]).payload[0].id).toBe("D");
  root.insert({x: 3300, y:3300, id: "E"});
  expect(root.searchByPath([3,0,3]).payload.length).toBe(2);
  root.insert({x: 2500, y:2500, id: "F"});
  expect(root.searchByPath([0,3,3]).payload.length).toBe(1);
  root.insert({x: 2501, y:2502, id: "G"});
  expect(root.searchByPath([3,0,0]).payload.length).toBe(1);
  root.insert({x: 2501, y:3200, id: "H"});
  expect(root.searchByPath([3,0,2]).payload.length).toBe(1);
  root.insert({x: 3200, y:2501, id: "I"});
  expect(root.searchByPath([3,0,1]).payload.length).toBe(1);
})

test('nearby', () => {
  let nearby = root.searchNearByPayloadsMerged(3200, 3200, 3);
  expect(nearby).toHaveLength(5);
  nearby = root.searchNearByPayloadsMerged(500, 500, 3);
  expect(nearby).toHaveLength(1);
  expect(nearby[0].id).toBe("A");
  root.insert({x: 4900, y:4900, id: "X1"});
  root.insert({x: 4901, y:4901, id: "X2"});
  nearby = root.searchNearByPayloadsMerged(4900, 4900, 3);
  expect(nearby).toHaveLength(2);
})

test('remove', () => {
  root.remove({x: 100, y:100, id: "A"});
  expect(root.searchByPath([0,0,0]).payload.length).toBe(0);
})

test('path', () => {
  let path1 = TreeNode.getPath(3200, 2501, root, 2);
  expect(path1).toBe("301");
  let path2 = TreeNode.getPath(3126, 3126, root, 2);
  expect(path2).toBe("303");
  let path3 = TreeNode.getPath(2500, 2500, root, 2);
  expect(path3).toBe("033");
  let path4 = TreeNode.getPath(2501, 2502, root, 2);
  expect(path4).toBe("300");
})