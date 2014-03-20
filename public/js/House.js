/********************************************
* HOUSE CLASS                               *
********************************************/
var House = function(xPos, yPos, width, height) {
  var x = xPos,
      y = yPos,
      w = width,
      h = height,
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

  var draw = function(ctx) {
    ctx.fillRect(x, y+(h/4), w, 3*h/4);
    drawTriangle(ctx, "red", [x, y+(h/4)], [x+(w/2), y], [x+w, y+(h/4)]);
  };

  return {
    getX: getX,
    getY: getY,
    setX: setX,
    setY: setY,
    draw: draw,
    id:   id
  };
};