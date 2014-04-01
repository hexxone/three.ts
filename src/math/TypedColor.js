/**
 * @author mrdoob / http://mrdoob.com/
 * @author jbaicoianu / http://baicoianu.com/
 */

THREE.TypedColor = function ( array, offset ) {

	this.array = array;
	this.offset = offset;

}

THREE.TypedColor.prototype = Object.create( THREE.Color.prototype );

Object.defineProperties( THREE.TypedColor.prototype, {
	'r': {
		enumerable: true,	
		get: function () { return this.array[ this.offset ]; },
		set: function ( v ) { this.array[ this.offset ] = v; }
	},
	'g': {
		enumerable: true,	
		get: function () { return this.array[ this.offset + 1 ]; },
		set: function ( v ) { this.array[ this.offset + 1 ] = v; }
	},
	'b': {
		enumerable: true,	
		get: function () { return this.array[ this.offset + 2 ]; },
		set: function ( v ) { this.array[ this.offset + 2 ] = v; }
	}
} );

