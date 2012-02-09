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
