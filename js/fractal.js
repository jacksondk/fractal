
var width = 400;
var height = 400;

var c = document.getElementById("fractal");
var ctx = c.getContext("2d");
c.width = width;
c.height = height;


var imgData = ctx.createImageData(width,height);
var i;
var row, column;
var topLeft = {r: -1.9, i: 1.5};
var bottomRight = {r:0.8,i: -1.5};
var drow = (bottomRight.i - topLeft.i)/height;
var dcol = (bottomRight.r - topLeft.r)/width;
var maxIter = 400;
var worker = new Worker("js/mandel.js");

function computeRow( row ) {
    var args = {
	    maxIter: maxIter,
	    width: width,
	    height: height, 
	    topLeft: topLeft,
	    bottomRight: bottomRight,
	    row: row,
	    drow: drow,
	    dcol: dcol
	}
    worker.postMessage( args );
}

worker.onmessage = function ( event ) {
    if ( event.data.logData ) {
	console.log( "Worker: " +event.data.logData );
    }

    if ( event.data.row >= 0) {
	var baseIndex = event.data.row*width*4;
	for (var index = 0; index < width*4; index++)
	    imgData.data[index+baseIndex] = event.data.imgData[index];

	if ( event.data.row < height ) {
	    computeRow( event.data.row + 1 );
	}
    }
    ctx.putImageData(imgData,0,0 );
}

computeRow( 0 );


