/**
 * @author mrdoob / http://mrdoob.com/
 * @author jbaicoianu / http://baicoianu.com/
 */

THREE.TypedVector4 = function ( array, offset ) {
	
	this.array = array;
	this.offset = offset;

};

THREE.TypedVector4.prototype = Object.create( THREE.Vector4.prototype );

Object.defineProperties( THREE.TypedVector4.prototype, {
	'x': {
		get: function () { return this.array[ this.offset ]; },
		set: function ( v ) { this.array[ this.offset ] = v; }
	},
	'y': {
		get: function () { return this.array[ this.offset + 1 ]; },
		set: function ( v ) { this.array[ this.offset + 1 ] = v; }
	},
	'z': {
		get: function () { return this.array[ this.offset + 2 ]; },
		set: function ( v ) { this.array[ this.offset + 2 ] = v; }
	},
	'w': {
		get: function () { return this.array[ this.offset + 3 ]; },
		set: function ( v ) { this.array[ this.offset + 3 ] = v; }
	}
} );

