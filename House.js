var House = function(xPos, yPos) {
  var x = xPos,
      y = yPos,
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

  return {
    getX: getX,
    getY: getY,
    setX: setX,
    setY: setY,
    id: id
  }
};

exports.House = House;