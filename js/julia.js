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
    var iter;
    var imgData = new Array(width);
    var exitData = new Array(width);
    var imag = topLeft.imag + row * drow;
    var juliaPoint = params.juliaPoint;
    
    if (params.workerIndex == 0) {
        for (var i = 0; i < 10000; i++) {
            iter = i * i * i;
        }
    }
    for (column = 0; column < width; column++) {
        var v = new Complex(topLeft.real + column * dcol, imag);

        iter = 0;
        while (v.abs2() < 4 && iter < maxIter) {
            v = v.square().add(juliaPoint);
            iter++;
        }

        var index = column * 4;
        imgData[column] = iter;
        exitData[column] = v;
    }
    postMessage({ row: row, iterData: imgData, exitData: exitData, workerIndex: params.workerIndex });
};
