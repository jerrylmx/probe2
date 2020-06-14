class GridService {
    static isIndexValid(index) {
        return 0 <= index.i < global.GRID_COUNT && 
               0 <= index.j < global.GRID_COUNT
    }

    static findGrid(x, y) {
        if (arguments.length < 2) {
            x = x.x;
            y = x.y;
        }
        let index = GridService.findGridIndex(x, y);
        return global.grid[index.i][index.j];
    }

    static findGridByEntity(entity) {
        let index = GridService.findGridIndex(entity.x, entity.y);
        return global.grid[index.i][index.j];
    }

    static findGridIndex(x, y) {
        let len = global.H / global.GRID_COUNT;
        return {j: Math.floor(x/len), i: Math.floor(y/len)};
    }

    static removeFromGrid(entity) {
        let grid = findGridByEntity(entity);
        let success = false;
        if (!grid) return success;
        for (let i = 0; i < grid.length; i++) {
            if (grid[i].id === entity.id) {
                grid.splice(i, 1);
                success = true;
            }
        }
        return success;
    }

    static findNearByGridIndex(x, y) {
        let results = [];
        let center = GridService.findGridIndex(x, y);
        results.push({i: center.i-1, j: center.j});
        results.push({i: center.i-1, j: center.j+1});
        results.push({i: center.i-1, j: center.j-1});
        results.push({i: center.i,   j: center.j+1});
        results.push({i: center.i-1, j: center.j-1});
        results.push({i: center.i+1, j: center.j});
        results.push({i: center.i+1, j: center.j+1});
        results.push({i: center.i+1, j: center.j-1});
        return results.filter(ind => GridService.isIndexValid(ind));
    }
}

module.exports = GridService;