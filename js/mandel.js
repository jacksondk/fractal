importScripts('complex.js');

onmessage = function (event) {

    var params = event.data;
    var maxIter = params.maxIter;
    var width = params.width;
    var height = params.height;
    var topLeft = params.topLeft;
    var bottomRight = params.bottomRight;
    var dcol = params.dcol;
    var drow = params.drow;
    var row = params.row;
    var column;
    var imgData = new Array(width*4);
    for (column = 0; column < width; column++ ) {
	var p = {r: topLeft.r + column*dcol, i: topLeft.i + row*drow };
	var v = {r: 0, i: 0}
	iter = 0;
	while ( Complex.abs2(v) < 4 && iter < maxIter) {
	    v = Complex.add( Complex.multiply( v, v), p);
	    iter++;
	}

	var index = column*4;
	imgData[index+0] = iter % 255;
	imgData[index+1] = iter % 255;
	imgData[index+2] = iter % 255;
	imgData[index+3] = 255;
    }
    postMessage( { row: row, imgData: imgData } );
};
