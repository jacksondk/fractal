var complex = function(r,i) {
    var that = {};

    that.r = r;
    that.i = i;

    that.add = function( b ) {
	return complex( that.r + b.r, that.i + b.i );
    }

    that.subtract = function( b ) {
	return complex( that.r - b.r, that.i - b.i );
    }

    that.multiply = function( b ) {
	return complex( that.r*b.r-that.i*b.i, that.i*b.r + that.i*b.r );
    }

    that.toString = function() {
	return "" + that.r + "+" + that.i + "i";
    }

    that.abs = function() {
	return Math.sqrt( that.r*that.r + that.i*that.i );
    }

    that.abs2 = function() {
	return that.r*that.r + that.i*that.i;
    }

    return that;
};

var c = document.getElementById("fractal");
var ctx = c.getContext("2d");

var width = 400;
var height = 200;
var imgData = ctx.createImageData(400,200);
var i;
var row, column;
var topLeft = complex(-1,1);
var bottomRight = complex(1,-1);
var drow = (bottomRight.r - topLeft.r)/width;
var dcol = (bottomRight.i - topLeft.i)/height;
var iter;
for( row = 0; row < height; row++ ) {
    for (column = 0; column < width; column++ ) {
	var p = complex( topLeft.r + row*drow, topLeft.i + column*dcol );
	var v = complex(0,0)
	iter = 0;
	while ( v.abs2() < 4 && iter < 255) {
	    v = v.multiply(v).add(p);
	    iter++;
	}

	var index = (row*width + column)*4;
	imgData.data[index+0] = iter % 255;
	imgData.data[index+1] = iter % 255;
	imgData.data[index+2] = 255;
	imgData.data[index+3] = 255;
    }
    ctx.putImageData(imgData, 0,0 );
}


