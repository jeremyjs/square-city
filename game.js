var util = require("util"),
    io = require("socket.io"),
    Player = require("./Player").Player;

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