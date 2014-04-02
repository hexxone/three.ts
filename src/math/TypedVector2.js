/**
 * @author mrdoob / http://mrdoob.com/
 * @author jbaicoianu / http://baicoianu.com/
 */

THREE.TypedVector2 = function ( array, offset ) {
	
	this.array = array;
	this.offset = offset;

};

THREE.TypedVector2.prototype = Object.create( THREE.Vector2.prototype );

Object.defineProperties( THREE.TypedVector2.prototype, {
	'x': {
		get: function () { return this.array[ this.offset ]; },
		set: function ( v ) { this.array[ this.offset ] = v; }
	},
	'y': {
		get: function () { return this.array[ this.offset + 1 ]; },
		set: function ( v ) { this.array[ this.offset + 1 ] = v; }
	}
} );

