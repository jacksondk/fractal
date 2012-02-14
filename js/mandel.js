importScripts('complex.js');

var maxIter, width, height, topLeft, bottomRight;
var dcol, drow;
var imgData;
var exitData;

var actions = {
    setup: function (pdata) {
        maxIter = pdata.maxIter;
        width = pdata.width;
        height = pdata.height;
        topLeft = pdata.topLeft;
        bottomRight = pdata.bottomRight;
        dcol = pdata.dcol;
        drow = pdata.drow;
        imgData = new Array(width);
        exitData = new Array(width);
    },
    computeRow: function (pdata) {
        var row = pdata.row;
        var column;
        var iter;
        var imag = topLeft.imag + row * drow;

        for (column = 0; column < width; column++) {
            var p = new Complex(topLeft.real + column * dcol, imag);
            var v = new Complex(0, 0);

            iter = 0;
            while (v.abs2() < 4 && iter < maxIter) {
                v = v.square().add(p);
                iter++;
            }

            imgData[column] = iter;
            exitData[column] = v;
        }
        postMessage({ row: row, iterData: imgData, exitData: exitData, workerIndex: pdata.workerIndex });
    }
};

onmessage = function (event) {
    var pdata = event.data;
    actions[pdata.action](pdata);
};
