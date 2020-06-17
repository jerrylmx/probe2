// Constants
global.W = process.env.W || 5000;
global.H = process.env.H || 5000;
global.RATE = process.env.RATE || 40;
global.DEV_MODE = process.env.DEV_MODE || true;
global.GRID_COUNT = process.env.GRID_COUNT || 5;
global.WS_EVENTS = {
    SYNC: "Sync",
    JOIN: "Join",
    MOVE: "Move"
}
global.EntityEnum = Object.freeze({
    PROBE: "",
    BULLET: ""
});

