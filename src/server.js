const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const http = require('http').createServer(app);
const io = require('socket.io')(http, {wsEngineL: 'ws'});
require('./config');
const EntityCollection = require('./models/entityCollection');
const IOController = require('./controller');
const BoxService = require('./services/boxService');
const MyEngine = require('./services/physics');

app.use(express.static(__dirname + "/public"));
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

let clients = {};
global.rankings = [];
global.entityCollection = new EntityCollection();
global.myEngine = new MyEngine(global.entityCollection, 5000, 5000);

io.on('connection', (socket) => {
    console.log('Client Connected');
    clients[socket.id] = socket;

    socket.on(global.WS_EVENTS.JOIN, () => {
      console.log('Player joined');
      let newMember = IOController.gameJoin({sid: socket.id});
      clients[socket.id].pkey = newMember.id;
      console.log(socket.id);
      console.log(clients[socket.id].pkey);
      // socket.emit(global.WS_EVENTS.JOIN, BoxService.packInitData(newMember));
    });

    socket.on("disconnect", () => {
        if (clients[socket.id]) {
            global.entityCollection.pop(clients[socket.id].pkey);
            delete clients[socket.id];
        }
    });
});

// Debug
setInterval(() => {
    console.log(' - Server info -');
    console.log(global.entityCollection.stat());
    global.entityCollection.qTree.print();
}, 5000);

http.listen(port, () => console.log(`Server running on port ${port}!`));


// Main Loop
let tick = function() {
    global.myEngine.tick();
    Object.keys(clients).forEach((id) => {
      let data = clients[id].pkey? BoxService.packSyncData(clients[id].pkey) : {}
      clients[id].emit(global.WS_EVENTS.SYNC, data);
    });
}

var tickLengthMs = 1000 / 20
var previousTick = Date.now()
var gameLoop = function () {
  var now = Date.now()

  if (previousTick + tickLengthMs <= now) {
    previousTick = now
    tick();
  }

  if (Date.now() - previousTick < tickLengthMs - 16) {
    setTimeout(gameLoop)
  } else {
    setImmediate(gameLoop)
  }
}

gameLoop()