function setupFractalCanvas(id) {
    var width = 800;
    var height = 600;


    var c = document.getElementById(id);
    var ctx = c.getContext("2d");
    c.width = width;
    c.height = height;

    var lingrad = ctx.createLinearGradient(0, 0, width, 0);
    lingrad.addColorStop(0, '#00f');
    lingrad.addColorStop(0.1, '#fa0');
    lingrad.addColorStop(0.5, '#ff0');
    lingrad.addColorStop(0.7, '#f1b');
    lingrad.addColorStop(1, '#fff');

    ctx.fillStyle = lingrad;
    ctx.fillRect(0, 0, width, 2);

    var gradientImage = ctx.getImageData(0, 0, width, 1);

    var imgData = ctx.createImageData(width, height);

    var topLeft = new Complex(-1.5, 1.1);
    var bottomRight = new Complex(0.8, -1.1);
    var drow = (bottomRight.imag - topLeft.imag) / height;
    var dcol = (bottomRight.real - topLeft.real) / width;
    var maxIter = 900;

    var workers = [];
    workers[0] = new Worker("js/mandel.js");
    workers[1] = new Worker("js/mandel.js");

    var done = [0, 0];
    function computeRow(workerIndex, row) {
        var args = {
            maxIter: maxIter,
            width: width,
            height: height,
            topLeft: topLeft,
            bottomRight: bottomRight,
            row: row,
            drow: drow,
            dcol: dcol,
            workerIndex: workerIndex
        };

        workers[workerIndex].postMessage(args);
    }

    function getColor(iter) {
        if (iter == maxIter) {
            return { red: 0, green: 0, blue: 0, alpha: 255 };
        }
        var index = (iter % gradientImage.width)*4;
        return { red: gradientImage.data[index],
            green: gradientImage.data[index + 1],
            blue: gradientImage.data[index + 2],
            alpha: gradientImage.data[index + 3]
        };
    }

    for (var workerIndex = 0; workerIndex < workers.length; workerIndex++) {
        workers[workerIndex].onmessage = function (event) {
            if (event.data.logData) {
                console.log("Worker: " + event.data.logData);
            }

            if (event.data.row >= 0) {
                var baseIndex = event.data.row * width * 4;
                var wIndex = event.data.workerIndex;
                done[wIndex]++;
                for (var index = 0; index < width; index++) {
                    var color = getColor(event.data.iterData[index]);
                    var destIndex = baseIndex + 4 * index;
                    imgData.data[destIndex] = color.red;
                    imgData.data[destIndex + 1] = color.green;
                    imgData.data[destIndex + 2] = color.blue;
                    imgData.data[destIndex + 3] = color.alpha;
                }

                if (event.data.row < height) {
                    computeRow(wIndex, event.data.row + 1);
                }
            }
            ctx.putImageData(imgData, 0, 0);
        };
    }

    computeRow(0, 0);
    computeRow(1, 1);
}
