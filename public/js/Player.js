/**************************************************
* GAME PLAYER CLASS                               *
**************************************************/
var Player = function(startX, startY) {
  var x = startX,
      y = startY,
      moveAmount = 4,
      id;

  var getX = function() {
    return x;
	};

	var getY = function() {
	  return y;
	};

	var setX = function(newX) {
	  x = newX;
	};

	var setY = function(newY) {
	  y = newY;
	};

  var update = function(keys, canvas) {
    // Get the current position
    var prevX = x,
        prevY = y;

    // Update position based on key presses
    // Keep the position from going outside the canvas
    // Up key takes priority over down
    if (keys.up) {
      if (y > 0)
        y -= moveAmount;
    } else if (keys.down) {
      if (y < canvas.height)
        y += moveAmount;
    };

    // Left key takes priority over right
    if (keys.left) {
      if (x > 0)
        x -= moveAmount;
    } else if (keys.right) {
      if (x < canvas.width)
        x += moveAmount;
    };

    // Return whether the position has changed
    return (prevX != x || prevY != y) ? true : false;
  };

  var draw = function(ctx) {
    ctx.fillRect(x-5, y-5, 10, 10);
  };

  return {
  	getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
    update: update,
    draw: draw,
    id: id
  };
};