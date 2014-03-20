var drawTriangle = function (ctx, color, p1, p2, p3) {
	ctx.moveTo(p1[0],p1[1]);
	ctx.lineTo(p2[0],p2[1]);
	ctx.lineTo(p3[0],p3[1]);
	ctx.closePath();
	var style = ctx.fillStyle;
  ctx.fillStyle = color;
  ctx.fill();
  ctx.fillStyle = style;
}