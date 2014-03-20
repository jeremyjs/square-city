/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,         // Canvas DOM element
    ctx,            // Canvas rendering context
    keys,           // Keyboard input
    localPlayer,    // Local player
    remotePlayers,  // Other players
    socket;         // Socket connects client to the server


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
  // Declare the canvas and rendering context
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  // Maximize the canvas
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Initialize keyboard controls
  keys = new Keys();

  // Calculate a random start position for the local player
  // The minus 5 (half a player size) stops the player being
  // placed right on the egde of the screen
  var startX = Math.round(Math.random()*(canvas.width-5)),
      startY = Math.round(Math.random()*(canvas.height-5));

  // Initialize the local and remote players
  localPlayer = new Player(startX, startY);
  remotePlayers = [];

  // Initialize connection to the server
  socket = io.connect("http://localhost", {
    port: 8000,
    transports: ["websocket"]
  });

  // Start listening for events
  setEventHandlers();
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
  // Keyboard
  window.addEventListener("keydown", onKeydown, false);
  window.addEventListener("keyup", onKeyup, false);

  // Window resize
  window.addEventListener("resize", onResize, false);

  // Other event handlers
  socket.on("connect", onSocketConnected);
  socket.on("disconnect", onSocketDisconnect);
  socket.on("new player", onNewPlayer);
  socket.on("move player", onMovePlayer);
  socket.on("remove player", onRemovePlayer);
};

// Keyboard key down
function onKeydown(e) {
  if (localPlayer) {
    keys.onKeyDown(e);
  };
};

// Keyboard key up
function onKeyup(e) {
  if (localPlayer) {
    keys.onKeyUp(e);
  };
};

// Browser window resize
function onResize(e) {
  // Maximise the canvas
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

function onSocketConnected() {
  console.log("Connected to socket server");
  socket.emit("new player", {
    x: localPlayer.getX(),
    y: localPlayer.getY()
  });
};

function onSocketDisconnect() {
  console.log("Disconnected from socket server");
};

function onNewPlayer(data) {
  console.log("New player connected: "+data.id);
  var newPlayer = new Player(data.x, data.y);
  newPlayer.id = data.id;
  remotePlayers.push(newPlayer);
};

function onMovePlayer(data) {
  var movePlayer = playerById(data.id);

  if (!movePlayer) {
    console.log("Tried to update non-existant player: "+data.id);
    return;
  };

  movePlayer.setX(data.x);
  movePlayer.setY(data.y);
};

function onRemovePlayer(data) {
  var removePlayer = playerById(data.id);

  if (!removePlayer) {
    console.log("Tried to remove non-existant player: "+data.id);
    return;
  };

  remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};

/*************************************
* HELPER FUCTIONS                    *
*************************************/

function playerById(id) {
  for (var i = 0; i < remotePlayers.length; i++) {
    if (remotePlayers[i].id == id) {
      return remotePlayers[i];
    }
  };

  return false;
};

/**************************************************
** GAME ANIMATION LOOP
**************************************************/
function animate() {
  update();
  draw();

  // Request a new animation frame using Paul Irish's shim
  window.requestAnimFrame(animate);
};


/**************************************************
** GAME UPDATE
**************************************************/
function update() {
  if (localPlayer.update(keys, canvas)) {
    socket.emit("move player", {
      x: localPlayer.getX(),
      y: localPlayer.getY()
    });
  };
};


/**************************************************
** GAME DRAW
**************************************************/
function draw() {
  // Wipe the canvas clean
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the local player
  localPlayer.draw(ctx);

  // Draw the other players
  for (var i = 0; i < remotePlayers.length; i++) {
    remotePlayers[i].draw(ctx);
  };
};