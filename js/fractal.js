var jacksondk = jacksondk || { };

jacksondk.workerPaths = {
    "mandelbrot": "js/mandel.js",
    "julia": "js/julia.js"
};

jacksondk.Fractal = function (canvas) {

    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;

    this.workerPath = jacksondk.workerPaths["mandelbrot"];
    this.topLeft = new Complex(-1.5, 1.1);
    this.bottomRight = new Complex(0.8, -1.1);

    this.drow = (this.bottomRight.imag - this.topLeft.imag) / this.height;
    this.dcol = (this.bottomRight.real - this.topLeft.real) / this.width;
    this.juliaPoint = new Complex(-0.8, 0.153);
    this.maxIter = 900;


    var lingrad = this.ctx.createLinearGradient(0, 0, this.width, 0);
    lingrad.addColorStop(0, '#00f');
    lingrad.addColorStop(0.1, '#fa0');
    lingrad.addColorStop(0.5, '#ff0');
    lingrad.addColorStop(0.7, '#f1b');
    lingrad.addColorStop(1, '#fff');
    this.ctx.fillStyle = lingrad;
    this.ctx.fillRect(0, 0, this.width, 2);

    this.gradientImage = this.ctx.getImageData(0, 0, this.width, 1);

    this.imgData = this.ctx.getImageData(0, 0, this.width, this.height);

    this.workers = [];
};

jacksondk.Fractal.prototype = function () {
    var computeRow = function (workerIndex, row) {
        var args = {
            action: "computeRow",
            maxIter: this.maxIter,
            width: this.width,
            height: this.height,
            topLeft: this.topLeft,
            bottomRight: this.bottomRight,
            row: row,
            drow: this.drow,
            dcol: this.dcol,
            workerIndex: workerIndex,
            juliaPoint: this.juliaPoint
        };

        this.workers[workerIndex].postMessage(args);
    };
    var initializeWorker = function (workerIndex) {

    };


    var createWorkers = function (workerPath) {
        var obj = this;
        for (var workerIndex = 0; workerIndex < 2; workerIndex++) {
            this.workers[workerIndex] = new Worker(workerPath);

            this.workers[workerIndex].onmessage = function (event) {
                if (event.data.logData) {
                    console.log("Worker: " + event.data.logData);
                }

                if (event.data.row >= 0) {
                    var baseIndex = event.data.row * obj.width * 4;
                    var wIndex = event.data.workerIndex;
                    for (var index = 0; index < obj.width; index++) {
                        var color = getColor.call(obj, event.data.iterData[index]);
                        var destIndex = baseIndex + 4 * index;
                        obj.imgData.data[destIndex] = color.red;
                        obj.imgData.data[destIndex + 1] = color.green;
                        obj.imgData.data[destIndex + 2] = color.blue;
                        obj.imgData.data[destIndex + 3] = color.alpha;
                    }

                    if (event.data.row < obj.height) {
                        computeRow.call(obj, wIndex, event.data.row + 1);
                    } else {

                    }
                }
                obj.ctx.putImageData(obj.imgData, 0, 0);
            };
        }
    };

    var setType = function (type) {
        this.workerPath = workerPaths[type];
    },
        getColor = function (iter) {
            if (iter == this.maxIter) {
                return { red: 0, green: 0, blue: 0, alpha: 255 };
            }
            var index = (iter % this.gradientImage.width) * 4;
            return { red: this.gradientImage.data[index],
                green: this.gradientImage.data[index + 1],
                blue: this.gradientImage.data[index + 2],
                alpha: this.gradientImage.data[index + 3]
            };
        },

        render = function () {
            createWorkers.call(this, this.workerPath);
            computeRow.call(this, 0, 0);
            computeRow.call(this, 1, 1);
        },
        setTopLeft = function (point) {
            this.topLeft = point;
        },
        setBottomRight = function (point) {
            this.bottomRight = point;
        }
        ;

    return {
        setType: setType,
        setTopLeft: setTopLeft,
        setBottomRight: setBottomRight,
        render: render
    };
} ();

function setupFractalCanvas(id) {
    
}
