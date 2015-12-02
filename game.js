
/*************************************
* EXPRESS SERVER CONFIG              *
*************************************/

// Dependencies
var express = require('express.io'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path');

// Express Configuration
var app = express();
app.http().io()

app.listen(7000);

app.configure(function() {
  app.set('port', process.env.PORT || 5000);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);

// Start server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

/*************************************
* SOCKET.IO GAME HANDLERS            *
*************************************/
// Dependencies
var util = require("util"),
    io = require("socket.io");

// Server Objects
var Player = require("./Player").Player,
    House = require("./House").House;

var socket,
    players;

function init() {
  players = [];
  socket = io.listen(8000);
  socket.configure(function() {
    socket.set("transports", ["websocket"]);
    socket.set("log level", 2);
  });
  setEventHandlers();
};

var setEventHandlers = function() {
  socket.sockets.on("connection", onSocketConnection);
};

function onSocketConnection(client) {
  util.log("New player has connected: "+client.id);
  client.on("disconnect", onClientDisconnect);
  client.on("new player", onNewPlayer);
  client.on("move player", onMovePlayer);
};

function onClientDisconnect() {
  util.log("Player has disconnected: "+this.id);
  var removePlayer = playerById(this.id);

  if (!removePlayer) {
    util.log("Tried to remove non-existant player: "+this.id);
    return;
  };

  players.splice(players.indexOf(removePlayer), 1);
  this.broadcast.emit("remove player", {id: this.id});
};

function onNewPlayer(data) {
  var newPlayer = new Player(data.x, data.y);
  newPlayer.id = this.id;
  this.broadcast.emit("new player", {
    id: newPlayer.id,
    x: newPlayer.getX(),
    y: newPlayer.getY()
  });
  var i, existingPlayer;
  for (i = 0; i < players.length; i++) {
    existingPlayer = players[i];
    this.emit("new player", {
      id: existingPlayer.id,
      x: existingPlayer.getX(),
      y: existingPlayer.getY()
    });
  };
  players.push(newPlayer);
};

function onMovePlayer(data) {
  var movePlayer = playerById(this.id);

  if (!movePlayer) {
    util.log("Tried to update non-existant player: "+this.id);
    return;
  };

  movePlayer.setX(data.x);
  movePlayer.setY(data.y);

  this.broadcast.emit("move player", {
    id: movePlayer.id,
    x: movePlayer.getX(),
    y: movePlayer.getY()
  });
};

init();

/*************************************
* HELPER FUCTIONS                    *
*************************************/

function playerById(id) {
  for (var i = 0; i < players.length; i++) {
    if (players[i].id == id) {
      return players[i];
    }
  };

  return false;
};