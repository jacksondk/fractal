var complex = function() {
    var that = {};
    that.add = function( a, b ) {
	return { r: a.r + b.r,
		 i: a.i + b.i };
    }

    that.subtract = function( a, b ) {
	return { r: a.r - b.r, i: a.i - b.i };
    }

    that.multiply = function( a,b ) {
	return {r: a.r*b.r - a.i*b.i, 
		i: a.i*b.r + a.r*b.i };
    }

    that.toString = function(a) {
	return "" + a.r + "+" + a.i + "i";
    }

    that.abs = function(a) {
	return Math.sqrt( a.r*a.r + a.i*a.i );
    }

    that.abs2 = function(a) {
	return a.r*a.r + a.i*a.i;
    }

    return that;
};
var Complex = complex();

var width = 600;
var height = 400;

var c = document.getElementById("fractal");
var ctx = c.getContext("2d");
c.width = width;
c.height = height;


var imgData = ctx.createImageData(width,height);
var i;
var row, column;
var topLeft = {r: -2, i: 1};
var bottomRight = {r:1,i:-1};
var drow = (bottomRight.i - topLeft.i)/height;
var dcol = (bottomRight.r - topLeft.r)/width;
var iter;
var maxIter = 300;
for( row = 0; row < height; row++ ) {
    for (column = 0; column < width; column++ ) {
	var p = {r: topLeft.r + column*dcol, i: topLeft.i + row*drow };
	var v = {r: 0, i: 0}
	iter = 0;
	while ( Complex.abs2(v) < 4 && iter < maxIter) {
	    v = Complex.add( Complex.multiply( v, v), p);
	    iter++;
	}

	var index = (row*width + column)*4;
	imgData.data[index+0] = iter % 255;
	imgData.data[index+1] = iter % 255;
	imgData.data[index+2] = iter % 255;
	imgData.data[index+3] = 255;
    }
    ctx.putImageData(imgData, 0,0 );
}


