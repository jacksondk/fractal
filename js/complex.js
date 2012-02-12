var Complex = function(real, imag) {
    this.real = real;
    this.imag = imag;
};

Complex.prototype = function () {
    var add = function (b) {
            return new Complex(this.real + b.real, this.imag + b.imag);
        },
        substract = function (b) {
            return new Complex(this.real - b.real, this.imag - b.imag);
        },
        square = function () {
            return new Complex(this.real * this.real - this.imag * this.imag, 2 * this.real * this.imag);
        },
        abs = function () {
            return Math.sqrt(this.real * this.real + this.imag * this.imag);
        },
        abs2 = function () {
            return this.real * this.real + this.imag * this.imag;
        },
        multiply = function (b) {
            return new Complex(this.real * b.real - this.imag * b.imag, this.real * b.imag + this.imag * b.real);
        };

    return {
        add: add,
        subtract: substract,
        square: square,
        multiply: multiply,
        abs: abs,
        abs2: abs2
    };
} ();
