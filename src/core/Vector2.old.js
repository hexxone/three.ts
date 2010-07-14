/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.Vector2Orig = function ( x, y ) {

	this.x = x || 0;
	this.y = y || 0;

	this.set = function ( x, y ) {

		this.x = x;
		this.y = y;

	};

	this.copy = function ( v ) {

		this.x = v.x;
		this.y = v.y;

	};

	this.addSelf = function ( v ) {

		this.x += v.x;
		this.y += v.y;

	};

	this.add = function ( v1, v2 ) {

		this.x = v1.x + v2.x;
		this.y = v1.y + v2.y;

	};

	this.subSelf = function ( v ) {

		this.x -= v.x;
		this.y -= v.y;

	};

	this.sub = function ( v1, v2 ) {

		this.x = v1.x - v2.x;
		this.y = v1.y - v2.y;

	};

	this.multiplyScalar = function ( s ) {

		this.x *= s;
		this.y *= s;

	};

	this.unit = function () {

		this.multiplyScalar( 1 / this.length() );

	};

	this.length = function () {

		return Math.sqrt( this.x * this.x + this.y * this.y );

	};

	this.lengthSq = function () {

		return this.x * this.x + this.y * this.y;

	};

	this.negate = function() {

		this.x = - this.x;
		this.y = - this.y;

	};

	this.clone = function () {

		return new THREE.Vector2Orig( this.x, this.y );

	};

	this.toString = function () {

		return 'THREE.Vector2Orig (' + this.x + ', ' + this.y + ')';

	};
};
