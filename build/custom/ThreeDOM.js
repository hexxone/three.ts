<<<<<<< HEAD
/**
 * @author mr.doob / http://mrdoob.com/
 */

var THREE = THREE || { REVISION: '49dev' };

if ( ! self.Int32Array ) {

	self.Int32Array = Array;
	self.Float32Array = Array;

}

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.Color = function ( hex ) {

	if ( hex !== undefined ) this.setHex( hex );
	return this;

};

THREE.Color.prototype = {

	constructor: THREE.Color,

	r: 1, g: 1, b: 1,

	copy: function ( color ) {

		this.r = color.r;
		this.g = color.g;
		this.b = color.b;

		return this;

	},

	copyGammaToLinear: function ( color ) {

		this.r = color.r * color.r;
		this.g = color.g * color.g;
		this.b = color.b * color.b;

		return this;

	},

	copyLinearToGamma: function ( color ) {

		this.r = Math.sqrt( color.r );
		this.g = Math.sqrt( color.g );
		this.b = Math.sqrt( color.b );

		return this;

	},

	convertGammaToLinear: function () {

		var r = this.r, g = this.g, b = this.b;

		this.r = r * r;
		this.g = g * g;
		this.b = b * b;

		return this;

	},

	convertLinearToGamma: function () {

		this.r = Math.sqrt( this.r );
		this.g = Math.sqrt( this.g );
		this.b = Math.sqrt( this.b );

		return this;

	},

	setRGB: function ( r, g, b ) {

		this.r = r;
		this.g = g;
		this.b = b;

		return this;

	},

	setHSV: function ( h, s, v ) {

		// based on MochiKit implementation by Bob Ippolito
		// h,s,v ranges are < 0.0 - 1.0 >

		var i, f, p, q, t;

		if ( v === 0 ) {

			this.r = this.g = this.b = 0;

		} else {

			i = Math.floor( h * 6 );
			f = ( h * 6 ) - i;
			p = v * ( 1 - s );
			q = v * ( 1 - ( s * f ) );
			t = v * ( 1 - ( s * ( 1 - f ) ) );

			switch ( i ) {

				case 1: this.r = q; this.g = v; this.b = p; break;
				case 2: this.r = p; this.g = v; this.b = t; break;
				case 3: this.r = p; this.g = q; this.b = v; break;
				case 4: this.r = t; this.g = p; this.b = v; break;
				case 5: this.r = v; this.g = p; this.b = q; break;
				case 6: // fall through
				case 0: this.r = v; this.g = t; this.b = p; break;

			}

		}

		return this;

	},

	setHex: function ( hex ) {

		hex = Math.floor( hex );

		this.r = ( hex >> 16 & 255 ) / 255;
		this.g = ( hex >> 8 & 255 ) / 255;
		this.b = ( hex & 255 ) / 255;

		return this;

	},

	lerpSelf: function ( color, alpha ) {

		this.r += ( color.r - this.r ) * alpha;
		this.g += ( color.g - this.g ) * alpha;
		this.b += ( color.b - this.b ) * alpha;

		return this;

	},

	getHex: function () {

		return Math.floor( this.r * 255 ) << 16 ^ Math.floor( this.g * 255 ) << 8 ^ Math.floor( this.b * 255 );

	},

	getContextStyle: function () {

		return 'rgb(' + Math.floor( this.r * 255 ) + ',' + Math.floor( this.g * 255 ) + ',' + Math.floor( this.b * 255 ) + ')';

	},

	clone: function () {

		return new THREE.Color().setRGB( this.r, this.g, this.b );

	}

};
/**
 * @author mr.doob / http://mrdoob.com/
 * @author philogb / http://blog.thejit.org/
 * @author egraether / http://egraether.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */

THREE.Vector2 = function ( x, y ) {

	this.x = x || 0;
	this.y = y || 0;

};

THREE.Vector2.prototype = {

	constructor: THREE.Vector2,

	set: function ( x, y ) {

		this.x = x;
		this.y = y;

		return this;

	},

	copy: function ( v ) {

		this.x = v.x;
		this.y = v.y;

		return this;

	},

	add: function ( a, b ) {

		this.x = a.x + b.x;
		this.y = a.y + b.y;

		return this;

	},

	addSelf: function ( v ) {

		this.x += v.x;
		this.y += v.y;

		return this;

	},

	sub: function ( a, b ) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;

		return this;

	},

	subSelf: function ( v ) {

		this.x -= v.x;
		this.y -= v.y;

		return this;

	},

	multiplyScalar: function ( s ) {

		this.x *= s;
		this.y *= s;

		return this;

	},

	divideScalar: function ( s ) {

		if ( s ) {

			this.x /= s;
			this.y /= s;

		} else {

			this.set( 0, 0 );

		}

		return this;

	},

	negate: function() {

		return this.multiplyScalar( - 1 );

	},

	dot: function ( v ) {

		return this.x * v.x + this.y * v.y;

	},

	lengthSq: function () {

		return this.x * this.x + this.y * this.y;

	},

	length: function () {

		return Math.sqrt( this.lengthSq() );

	},

	normalize: function () {

		return this.divideScalar( this.length() );

	},

	distanceTo: function ( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	},

	distanceToSquared: function ( v ) {

		var dx = this.x - v.x, dy = this.y - v.y;
		return dx * dx + dy * dy;

	},

	setLength: function ( l ) {

		return this.normalize().multiplyScalar( l );

	},

	lerpSelf: function ( v, alpha ) {

		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;

		return this;

	},

	equals: function( v ) {

		return ( ( v.x === this.x ) && ( v.y === this.y ) );

	},

	isZero: function () {

		return ( this.lengthSq() < 0.0001 /* almostZero */ );

	},

	clone: function () {

		return new THREE.Vector2( this.x, this.y );

	}

};
/**
 * @author mr.doob / http://mrdoob.com/
 * @author kile / http://kile.stravaganza.org/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 */

THREE.Vector3 = function ( x, y, z ) {

	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;

};


THREE.Vector3.prototype = {

	constructor: THREE.Vector3,

	set: function ( x, y, z ) {

		this.x = x;
		this.y = y;
		this.z = z;

		return this;

	},

	setX: function ( x ) {

		this.x = x;

		return this;

	},

	setY: function ( y ) {

		this.y = y;

		return this;

	},

	setZ: function ( z ) {

		this.z = z;

		return this;

	},

	copy: function ( v ) {

		this.x = v.x;
		this.y = v.y;
		this.z = v.z;

		return this;

	},

	add: function ( a, b ) {

		this.x = a.x + b.x;
		this.y = a.y + b.y;
		this.z = a.z + b.z;

		return this;

	},

	addSelf: function ( v ) {

		this.x += v.x;
		this.y += v.y;
		this.z += v.z;

		return this;

	},

	addScalar: function ( s ) {

		this.x += s;
		this.y += s;
		this.z += s;

		return this;

	},

	sub: function ( a, b ) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;

		return this;

	},

	subSelf: function ( v ) {

		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;

		return this;

	},

	multiply: function ( a, b ) {

		this.x = a.x * b.x;
		this.y = a.y * b.y;
		this.z = a.z * b.z;

		return this;

	},

	multiplySelf: function ( v ) {

		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;

		return this;

	},

	multiplyScalar: function ( s ) {

		this.x *= s;
		this.y *= s;
		this.z *= s;

		return this;

	},

	divideSelf: function ( v ) {

		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;

		return this;

	},

	divideScalar: function ( s ) {

		if ( s ) {

			this.x /= s;
			this.y /= s;
			this.z /= s;

		} else {

			this.x = 0;
			this.y = 0;
			this.z = 0;

		}

		return this;

	},


	negate: function() {

		return this.multiplyScalar( - 1 );

	},

	dot: function ( v ) {

		return this.x * v.x + this.y * v.y + this.z * v.z;

	},

	lengthSq: function () {

		return this.x * this.x + this.y * this.y + this.z * this.z;

	},

	length: function () {

		return Math.sqrt( this.lengthSq() );

	},

	lengthManhattan: function () {

		return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z );

	},

	normalize: function () {

		return this.divideScalar( this.length() );

	},

	setLength: function ( l ) {

		return this.normalize().multiplyScalar( l );

	},

	lerpSelf: function ( v, alpha ) {

		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;
		this.z += ( v.z - this.z ) * alpha;

		return this;

	},

	cross: function ( a, b ) {

		this.x = a.y * b.z - a.z * b.y;
		this.y = a.z * b.x - a.x * b.z;
		this.z = a.x * b.y - a.y * b.x;

		return this;

	},

	crossSelf: function ( v ) {

		var x = this.x, y = this.y, z = this.z;

		this.x = y * v.z - z * v.y;
		this.y = z * v.x - x * v.z;
		this.z = x * v.y - y * v.x;

		return this;

	},

	distanceTo: function ( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	},

	distanceToSquared: function ( v ) {

		return new THREE.Vector3().sub( this, v ).lengthSq();

	},

	getPositionFromMatrix: function ( m ) {

		this.x = m.elements[12];
		this.y = m.elements[13];
		this.z = m.elements[14];

		return this;

	},

	getRotationFromMatrix: function ( m, scale ) {

		var sx = scale ? scale.x : 1;
		var sy = scale ? scale.y : 1;
		var sz = scale ? scale.z : 1;

		var m11 = m.elements[0] / sx, m12 = m.elements[4] / sy, m13 = m.elements[8] / sz;
		var m21 = m.elements[1] / sx, m22 = m.elements[5] / sy, m23 = m.elements[9] / sz;
		var m33 = m.elements[10] / sz;

		this.y = Math.asin( m13 );

		var cosY = Math.cos( this.y );

		if ( Math.abs( cosY ) > 0.00001 ) {

			this.x = Math.atan2( - m23 / cosY, m33 / cosY );
			this.z = Math.atan2( - m12 / cosY, m11 / cosY );

		} else {

			this.x = 0;
			this.z = Math.atan2( m21, m22 );

		}

		return this;

	},

	/*

	// from http://www.mathworks.com/matlabcentral/fileexchange/20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/content/SpinCalc.m
	// order XYZ

	getEulerXYZFromQuaternion: function ( q ) {

		this.x = Math.atan2( 2 * ( q.x * q.w - q.y * q.z ), ( q.w * q.w - q.x * q.x - q.y * q.y + q.z * q.z ) );
		this.y = Math.asin( 2 *  ( q.x * q.z + q.y * q.w ) );
		this.z = Math.atan2( 2 * ( q.z * q.w - q.x * q.y ), ( q.w * q.w + q.x * q.x - q.y * q.y - q.z * q.z ) );

	},

	// from http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToEuler/index.htm
	// order YZX (assuming heading == y, attitude == z, bank == x)

	getEulerYZXFromQuaternion: function ( q ) {

		var sqw = q.w * q.w;
		var sqx = q.x * q.x;
		var sqy = q.y * q.y;
		var sqz = q.z * q.z;
		var unit = sqx + sqy + sqz + sqw; // if normalised is one, otherwise is correction factor
		var test = q.x * q.y + q.z * q.w;

		if ( test > 0.499 * unit ) { // singularity at north pole

			this.y = 2 * Math.atan2( q.x, q.w );
			this.z = Math.PI / 2;
			this.x = 0;

			return;

		}

		if ( test < -0.499 * unit ) { // singularity at south pole

			this.y = -2 * Math.atan2( q.x, q.w );
			this.z = -Math.PI / 2;
			this.x = 0;

			return;

		}

		this.y = Math.atan2( 2 * q.y * q.w - 2 * q.x * q.z, sqx - sqy - sqz + sqw );
		this.z = Math.asin( 2 * test / unit );
		this.x = Math.atan2( 2 * q.x * q.w - 2 * q.y * q.z, -sqx + sqy - sqz + sqw );

	},

	*/

	getScaleFromMatrix: function ( m ) {

		var sx = this.set( m.elements[0], m.elements[1], m.elements[2] ).length();
		var sy = this.set( m.elements[4], m.elements[5], m.elements[6] ).length();
		var sz = this.set( m.elements[8], m.elements[9], m.elements[10] ).length();

		this.x = sx;
		this.y = sy;
		this.z = sz;

	},

	equals: function ( v ) {

		return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) );

	},

	isZero: function () {

		return ( this.lengthSq() < 0.0001 /* almostZero */ );

	},

	clone: function () {

		return new THREE.Vector3( this.x, this.y, this.z );

	}

};

/**
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 */

THREE.Vector4 = function ( x, y, z, w ) {

	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	this.w = ( w !== undefined ) ? w : 1;

};

THREE.Vector4.prototype = {

	constructor: THREE.Vector4,

	set: function ( x, y, z, w ) {

		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;

		return this;

	},

	copy: function ( v ) {

		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		this.w = ( v.w !== undefined ) ? v.w : 1;

		return this;

	},

	add: function ( a, b ) {

		this.x = a.x + b.x;
		this.y = a.y + b.y;
		this.z = a.z + b.z;
		this.w = a.w + b.w;

		return this;

	},

	addSelf: function ( v ) {

		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		this.w += v.w;

		return this;

	},

	sub: function ( a, b ) {

		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;
		this.w = a.w - b.w;

		return this;

	},

	subSelf: function ( v ) {

		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		this.w -= v.w;

		return this;

	},

	multiplyScalar: function ( s ) {

		this.x *= s;
		this.y *= s;
		this.z *= s;
		this.w *= s;

		return this;

	},

	divideScalar: function ( s ) {

		if ( s ) {

			this.x /= s;
			this.y /= s;
			this.z /= s;
			this.w /= s;

		} else {

			this.x = 0;
			this.y = 0;
			this.z = 0;
			this.w = 1;

		}

		return this;

	},


	negate: function() {

		return this.multiplyScalar( -1 );

	},

	dot: function ( v ) {

		return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;

	},

	lengthSq: function () {

		return this.dot( this );

	},

	length: function () {

		return Math.sqrt( this.lengthSq() );

	},

	normalize: function () {

		return this.divideScalar( this.length() );

	},

	setLength: function ( l ) {

		return this.normalize().multiplyScalar( l );

	},

	lerpSelf: function ( v, alpha ) {

		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;
		this.z += ( v.z - this.z ) * alpha;
		this.w += ( v.w - this.w ) * alpha;

		return this;

	},

	clone: function () {

		return new THREE.Vector4( this.x, this.y, this.z, this.w );

	}

};
/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Frustum = function ( ) {

	this.planes = [

		new THREE.Vector4(),
		new THREE.Vector4(),
		new THREE.Vector4(),
		new THREE.Vector4(),
		new THREE.Vector4(),
		new THREE.Vector4()

	];

};

THREE.Frustum.prototype.setFromMatrix = function ( m ) {

	var i, plane,
	planes = this.planes;
    var me = m.elements;
    var me0 = me[0], me1 = me[1], me2 = me[2], me3 = me[3]; 
    var me4 = me[4], me5 = me[5], me6 = me[6], me7 = me[7]; 
    var me8 = me[8], me9 = me[9], me10 = me[10], me11 = me[11]; 
    var me12 = me[12], me13 = me[13], me14 = me[14], me15 = me[15]; 

	planes[ 0 ].set( me3 - me0, me7 - me4, me11 - me8, me15 - me12 );
	planes[ 1 ].set( me3 + me0, me7 + me4, me11 + me8, me15 + me12 );
	planes[ 2 ].set( me3 + me1, me7 + me5, me11 + me9, me15 + me13 );
	planes[ 3 ].set( me3 - me1, me7 - me5, me11 - me9, me15 - me13 );
	planes[ 4 ].set( me3 - me2, me7 - me6, me11 - me10, me15 - me14 );
	planes[ 5 ].set( me3 + me2, me7 + me6, me11 + me10, me15 + me14 );

	for ( i = 0; i < 6; i ++ ) {

		plane = planes[ i ];
		plane.divideScalar( Math.sqrt( plane.x * plane.x + plane.y * plane.y + plane.z * plane.z ) );

	}

};

THREE.Frustum.prototype.contains = function ( object ) {

	var distance,
	planes = this.planes,
	matrix = object.matrixWorld,
    me = matrix.elements,
	scale = THREE.Frustum.__v1.set( matrix.getColumnX().length(), matrix.getColumnY().length(), matrix.getColumnZ().length() ),
	radius = - object.geometry.boundingSphere.radius * Math.max( scale.x, Math.max( scale.y, scale.z ) );

	for ( var i = 0; i < 6; i ++ ) {

		distance = planes[ i ].x * me[12] + planes[ i ].y * me[13] + planes[ i ].z * me[14] + planes[ i ].w;
		if ( distance <= radius ) return false;

	}

	return true;

};

THREE.Frustum.__v1 = new THREE.Vector3();
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.Ray = function ( origin, direction ) {

	this.origin = origin || new THREE.Vector3();
	this.direction = direction || new THREE.Vector3();

	var precision = 0.0001;

	this.setPrecision = function ( value ) {

		precision = value;

	};

	var a = new THREE.Vector3();
	var b = new THREE.Vector3();
	var c = new THREE.Vector3();
	var d = new THREE.Vector3();

	var originCopy = new THREE.Vector3();
	var directionCopy = new THREE.Vector3();

	var vector = new THREE.Vector3();
	var normal = new THREE.Vector3();
	var intersectPoint = new THREE.Vector3()

	this.intersectObject = function ( object ) {

		var intersect, intersects = [];

		if ( object instanceof THREE.Particle ) {

			var distance = distanceFromIntersection( this.origin, this.direction, object.matrixWorld.getPosition() );

			if ( distance > object.scale.x ) {

				return [];

			}

			intersect = {

				distance: distance,
				point: object.position,
				face: null,
				object: object

			};

			intersects.push( intersect );

		} else if ( object instanceof THREE.Mesh ) {

			// Checking boundingSphere

			var distance = distanceFromIntersection( this.origin, this.direction, object.matrixWorld.getPosition() );
			var scale = THREE.Frustum.__v1.set( object.matrixWorld.getColumnX().length(), object.matrixWorld.getColumnY().length(), object.matrixWorld.getColumnZ().length() );

			if ( distance > object.geometry.boundingSphere.radius * Math.max( scale.x, Math.max( scale.y, scale.z ) ) ) {

				return intersects;

			}

			// Checking faces

			var f, fl, face, dot, scalar,
			geometry = object.geometry,
			vertices = geometry.vertices,
			objMatrix;

			object.matrixRotationWorld.extractRotation( object.matrixWorld );

			for ( f = 0, fl = geometry.faces.length; f < fl; f ++ ) {

				face = geometry.faces[ f ];

				originCopy.copy( this.origin );
				directionCopy.copy( this.direction );

				objMatrix = object.matrixWorld;

				// determine if ray intersects the plane of the face
				// note: this works regardless of the direction of the face normal

				vector = objMatrix.multiplyVector3( vector.copy( face.centroid ) ).subSelf( originCopy );
				normal = object.matrixRotationWorld.multiplyVector3( normal.copy( face.normal ) );
				dot = directionCopy.dot( normal );

				// bail if ray and plane are parallel

				if ( Math.abs( dot ) < precision ) continue;

				// calc distance to plane

				scalar = normal.dot( vector ) / dot;

				// if negative distance, then plane is behind ray

				if ( scalar < 0 ) continue;

				if ( object.doubleSided || ( object.flipSided ? dot > 0 : dot < 0 ) ) {

					intersectPoint.add( originCopy, directionCopy.multiplyScalar( scalar ) );

					if ( face instanceof THREE.Face3 ) {

						a = objMatrix.multiplyVector3( a.copy( vertices[ face.a ].position ) );
						b = objMatrix.multiplyVector3( b.copy( vertices[ face.b ].position ) );
						c = objMatrix.multiplyVector3( c.copy( vertices[ face.c ].position ) );

						if ( pointInFace3( intersectPoint, a, b, c ) ) {

							intersect = {

								distance: originCopy.distanceTo( intersectPoint ),
								point: intersectPoint.clone(),
								face: face,
								object: object

							};

							intersects.push( intersect );

						}

					} else if ( face instanceof THREE.Face4 ) {

						a = objMatrix.multiplyVector3( a.copy( vertices[ face.a ].position ) );
						b = objMatrix.multiplyVector3( b.copy( vertices[ face.b ].position ) );
						c = objMatrix.multiplyVector3( c.copy( vertices[ face.c ].position ) );
						d = objMatrix.multiplyVector3( d.copy( vertices[ face.d ].position ) );

						if ( pointInFace3( intersectPoint, a, b, d ) || pointInFace3( intersectPoint, b, c, d ) ) {

							intersect = {

								distance: originCopy.distanceTo( intersectPoint ),
								point: intersectPoint.clone(),
								face: face,
								object: object

							};

							intersects.push( intersect );

						}

					}

				}

			}

		}

		return intersects;

	}

	this.intersectObjects = function ( objects ) {

		var intersects = [];

		for ( var i = 0, l = objects.length; i < l; i ++ ) {

			Array.prototype.push.apply( intersects, this.intersectObject( objects[ i ] ) );

		}

		intersects.sort( function ( a, b ) { return a.distance - b.distance; } );

		return intersects;

	};

	var v0 = new THREE.Vector3(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3();
	var dot, intersect, distance;

	function distanceFromIntersection( origin, direction, position ) {

		v0.sub( position, origin );
		dot = v0.dot( direction );

		intersect = v1.add( origin, v2.copy( direction ).multiplyScalar( dot ) );
		distance = position.distanceTo( intersect );

		return distance;

	}

	// http://www.blackpawn.com/texts/pointinpoly/default.html

	var dot00, dot01, dot02, dot11, dot12, invDenom, u, v;

	function pointInFace3( p, a, b, c ) {

		v0.sub( c, a );
		v1.sub( b, a );
		v2.sub( p, a );

		dot00 = v0.dot( v0 );
		dot01 = v0.dot( v1 );
		dot02 = v0.dot( v2 );
		dot11 = v1.dot( v1 );
		dot12 = v1.dot( v2 );

		invDenom = 1 / ( dot00 * dot11 - dot01 * dot01 );
		u = ( dot11 * dot02 - dot01 * dot12 ) * invDenom;
		v = ( dot00 * dot12 - dot01 * dot02 ) * invDenom;

		return ( u >= 0 ) && ( v >= 0 ) && ( u + v < 1 );

	}

};/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.Rectangle = function () {

	var _left, _top, _right, _bottom,
	_width, _height, _isEmpty = true;

	function resize() {

		_width = _right - _left;
		_height = _bottom - _top;

	}

	this.getX = function () {

		return _left;

	};

	this.getY = function () {

		return _top;

	};

	this.getWidth = function () {

		return _width;

	};

	this.getHeight = function () {

		return _height;

	};

	this.getLeft = function() {

		return _left;

	};

	this.getTop = function() {

		return _top;

	};

	this.getRight = function() {

		return _right;

	};

	this.getBottom = function() {

		return _bottom;

	};

	this.set = function ( left, top, right, bottom ) {

		_isEmpty = false;

		_left = left; _top = top;
		_right = right; _bottom = bottom;

		resize();

	};

	this.addPoint = function ( x, y ) {

		if ( _isEmpty ) {

			_isEmpty = false;
			_left = x; _top = y;
			_right = x; _bottom = y;

			resize();

		} else {

			_left = _left < x ? _left : x; // Math.min( _left, x );
			_top = _top < y ? _top : y; // Math.min( _top, y );
			_right = _right > x ? _right : x; // Math.max( _right, x );
			_bottom = _bottom > y ? _bottom : y; // Math.max( _bottom, y );

			resize();
		}

	};

	this.add3Points = function ( x1, y1, x2, y2, x3, y3 ) {

		if (_isEmpty) {

			_isEmpty = false;
			_left = x1 < x2 ? ( x1 < x3 ? x1 : x3 ) : ( x2 < x3 ? x2 : x3 );
			_top = y1 < y2 ? ( y1 < y3 ? y1 : y3 ) : ( y2 < y3 ? y2 : y3 );
			_right = x1 > x2 ? ( x1 > x3 ? x1 : x3 ) : ( x2 > x3 ? x2 : x3 );
			_bottom = y1 > y2 ? ( y1 > y3 ? y1 : y3 ) : ( y2 > y3 ? y2 : y3 );

			resize();

		} else {

			_left = x1 < x2 ? ( x1 < x3 ? ( x1 < _left ? x1 : _left ) : ( x3 < _left ? x3 : _left ) ) : ( x2 < x3 ? ( x2 < _left ? x2 : _left ) : ( x3 < _left ? x3 : _left ) );
			_top = y1 < y2 ? ( y1 < y3 ? ( y1 < _top ? y1 : _top ) : ( y3 < _top ? y3 : _top ) ) : ( y2 < y3 ? ( y2 < _top ? y2 : _top ) : ( y3 < _top ? y3 : _top ) );
			_right = x1 > x2 ? ( x1 > x3 ? ( x1 > _right ? x1 : _right ) : ( x3 > _right ? x3 : _right ) ) : ( x2 > x3 ? ( x2 > _right ? x2 : _right ) : ( x3 > _right ? x3 : _right ) );
			_bottom = y1 > y2 ? ( y1 > y3 ? ( y1 > _bottom ? y1 : _bottom ) : ( y3 > _bottom ? y3 : _bottom ) ) : ( y2 > y3 ? ( y2 > _bottom ? y2 : _bottom ) : ( y3 > _bottom ? y3 : _bottom ) );

			resize();

		};

	};

	this.addRectangle = function ( r ) {

		if ( _isEmpty ) {

			_isEmpty = false;
			_left = r.getLeft(); _top = r.getTop();
			_right = r.getRight(); _bottom = r.getBottom();

			resize();

		} else {

			_left = _left < r.getLeft() ? _left : r.getLeft(); // Math.min(_left, r.getLeft() );
			_top = _top < r.getTop() ? _top : r.getTop(); // Math.min(_top, r.getTop() );
			_right = _right > r.getRight() ? _right : r.getRight(); // Math.max(_right, r.getRight() );
			_bottom = _bottom > r.getBottom() ? _bottom : r.getBottom(); // Math.max(_bottom, r.getBottom() );

			resize();

		}

	};

	this.inflate = function ( v ) {

		_left -= v; _top -= v;
		_right += v; _bottom += v;

		resize();

	};

	this.minSelf = function ( r ) {

		_left = _left > r.getLeft() ? _left : r.getLeft(); // Math.max( _left, r.getLeft() );
		_top = _top > r.getTop() ? _top : r.getTop(); // Math.max( _top, r.getTop() );
		_right = _right < r.getRight() ? _right : r.getRight(); // Math.min( _right, r.getRight() );
		_bottom = _bottom < r.getBottom() ? _bottom : r.getBottom(); // Math.min( _bottom, r.getBottom() );

		resize();

	};

	this.intersects = function ( r ) {

		// http://gamemath.com/2011/09/detecting-whether-two-boxes-overlap/

		if ( _right < r.getLeft() ) return false;
		if ( _left > r.getRight() ) return false;
		if ( _bottom < r.getTop() ) return false;
		if ( _top > r.getBottom() ) return false;

		return true;

	};

	this.empty = function () {

		_isEmpty = true;

		_left = 0; _top = 0;
		_right = 0; _bottom = 0;

		resize();

	};

	this.isEmpty = function () {

		return _isEmpty;

	};

};
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Math = {

	// Clamp value to range <a, b>

	clamp: function ( x, a, b ) {

		return ( x < a ) ? a : ( ( x > b ) ? b : x );

	},

	// Clamp value to range <a, inf)

	clampBottom: function ( x, a ) {

		return x < a ? a : x;

	},

	// Linear mapping from range <a1, a2> to range <b1, b2>

	mapLinear: function ( x, a1, a2, b1, b2 ) {

		return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );

	},

	// Random float from <0, 1> with 16 bits of randomness
	// (standard Math.random() creates repetitive patterns when applied over larger space)

	random16: function () {

		return ( 65280 * Math.random() + 255 * Math.random() ) / 65535;

	},

	// Random integer from <low, high> interval

	randInt: function ( low, high ) {

		return low + Math.floor( Math.random() * ( high - low + 1 ) );

	},

	// Random float from <low, high> interval

	randFloat: function ( low, high ) {

		return low + Math.random() * ( high - low );

	},

	// Random float from <-range/2, range/2> interval

	randFloatSpread: function ( range ) {

		return range * ( 0.5 - Math.random() );

	},

	sign: function ( x ) {

		return ( x < 0 ) ? -1 : ( ( x > 0 ) ? 1 : 0 );

	}

};
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Matrix3 = function () {

	this.m = [];

};

THREE.Matrix3.prototype = {

	constructor: THREE.Matrix3,

	getInverse: function ( matrix ) {

		// input: THREE.Matrix4
		// ( based on http://code.google.com/p/webgl-mjs/ )

		var a11 =   matrix.elements[10] * matrix.elements[5] - matrix.elements[6] * matrix.elements[9];
		var a21 = - matrix.elements[10] * matrix.elements[1] + matrix.elements[2] * matrix.elements[9];
		var a31 =   matrix.elements[6] * matrix.elements[1] - matrix.elements[2] * matrix.elements[5];
		var a12 = - matrix.elements[10] * matrix.elements[4] + matrix.elements[6] * matrix.elements[8];
		var a22 =   matrix.elements[10] * matrix.elements[0] - matrix.elements[2] * matrix.elements[8];
		var a32 = - matrix.elements[6] * matrix.elements[0] + matrix.elements[2] * matrix.elements[4];
		var a13 =   matrix.elements[9] * matrix.elements[4] - matrix.elements[5] * matrix.elements[8];
		var a23 = - matrix.elements[9] * matrix.elements[0] + matrix.elements[1] * matrix.elements[8];
		var a33 =   matrix.elements[5] * matrix.elements[0] - matrix.elements[1] * matrix.elements[4];

		var det = matrix.elements[0] * a11 + matrix.elements[1] * a12 + matrix.elements[2] * a13;

		// no inverse

		if ( det === 0 ) {

			console.warn( "Matrix3.getInverse(): determinant == 0" );

		}

		var idet = 1.0 / det;

		var m = this.m;

		m[ 0 ] = idet * a11; m[ 1 ] = idet * a21; m[ 2 ] = idet * a31;
		m[ 3 ] = idet * a12; m[ 4 ] = idet * a22; m[ 5 ] = idet * a32;
		m[ 6 ] = idet * a13; m[ 7 ] = idet * a23; m[ 8 ] = idet * a33;

		return this;

	},

	/*
	transpose: function () {

		var tmp, m = this.m;

		tmp = m[1]; m[1] = m[3]; m[3] = tmp;
		tmp = m[2]; m[2] = m[6]; m[6] = tmp;
		tmp = m[5]; m[5] = m[7]; m[7] = tmp;

		return this;

	},
	*/

	transposeIntoArray: function ( r ) {

		var m = this.m;

		r[ 0 ] = m[ 0 ];
		r[ 1 ] = m[ 3 ];
		r[ 2 ] = m[ 6 ];
		r[ 3 ] = m[ 1 ];
		r[ 4 ] = m[ 4 ];
		r[ 5 ] = m[ 7 ];
		r[ 6 ] = m[ 2 ];
		r[ 7 ] = m[ 5 ];
		r[ 8 ] = m[ 8 ];

		return this;

	}

};
/**
 * @author mr.doob / http://mrdoob.com/
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author philogb / http://blog.thejit.org/
 * @author jordi_ros / http://plattsoft.com
 * @author D1plo1d / http://github.com/D1plo1d
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author timknip / http://www.floorplanner.com/
 */

THREE.Matrix4 = function ( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {

    this.elements = new Float32Array(16);

	this.set(

		( n11 !== undefined ) ? n11 : 1, n12 || 0, n13 || 0, n14 || 0,
		n21 || 0, ( n22 !== undefined ) ? n22 : 1, n23 || 0, n24 || 0,
		n31 || 0, n32 || 0, ( n33 !== undefined ) ? n33 : 1, n34 || 0,
		n41 || 0, n42 || 0, n43 || 0, ( n44 !== undefined ) ? n44 : 1

	);

};

THREE.Matrix4.prototype = {

	constructor: THREE.Matrix4,

	set: function ( n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44 ) {
        var te = this.elements;
        
		te[0] = n11; te[4] = n12; te[8] = n13; te[12] = n14;
		te[1] = n21; te[5] = n22; te[9] = n23; te[13] = n24;
		te[2] = n31; te[6] = n32; te[10] = n33; te[14] = n34;
		te[3] = n41; te[7] = n42; te[11] = n43; te[15] = n44;

		return this;

	},

	identity: function () {

		this.set(

			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1

		);

		return this;

	},

	copy: function ( m ) {
        
        var me = m.elements;
        
		this.set(

			me[0], me[4], me[8], me[12],
			me[1], me[5], me[9], me[13],
			me[2], me[6], me[10], me[14],
			me[3], me[7], me[11], me[15]

		);

		return this;

	},

	lookAt: function ( eye, target, up ) {
        var te = this.elements;
        
		var x = THREE.Matrix4.__v1;
		var y = THREE.Matrix4.__v2;
		var z = THREE.Matrix4.__v3;

		z.sub( eye, target ).normalize();

		if ( z.length() === 0 ) {

			z.z = 1;

		}

		x.cross( up, z ).normalize();

		if ( x.length() === 0 ) {

			z.x += 0.0001;
			x.cross( up, z ).normalize();

		}

		y.cross( z, x );


		te[0] = x.x; te[4] = y.x; te[8] = z.x;
		te[1] = x.y; te[5] = y.y; te[9] = z.y;
		te[2] = x.z; te[6] = y.z; te[10] = z.z;

		return this;

	},

	multiply: function ( a, b ) {
        
        var ae = a.elements,
            be = b.elements,
            te = this.elements;

		var a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12];
		var a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13];
		var a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14];
		var a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];

		var b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12];
		var b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13];
		var b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14];
		var b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];

		te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
		te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
		te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
		te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

		te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
		te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
		te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
		te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

        te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
		te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
		te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
		te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

		te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
		te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
		te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
		te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

		return this;

	},

	multiplySelf: function ( m ) {

		return this.multiply( this, m );

	},

	multiplyToArray: function ( a, b, r ) {
        
        var te = this.elements;
        
		this.multiply( a, b );

		r[ 0 ] = te[0]; r[ 1 ] = te[1]; r[ 2 ] = te[2]; r[ 3 ] = te[3];
		r[ 4 ] = te[4]; r[ 5 ] = te[5]; r[ 6 ] = te[6]; r[ 7 ] = te[7];
		r[ 8 ]  = te[8]; r[ 9 ]  = te[9]; r[ 10 ] = te[10]; r[ 11 ] = te[11];
		r[ 12 ] = te[12]; r[ 13 ] = te[13]; r[ 14 ] = te[14]; r[ 15 ] = te[15];

		return this;

	},

	multiplyScalar: function ( s ) {
        
        var te = this.elements;
        
		te[0] *= s; te[4] *= s; te[8] *= s; te[12] *= s;
		te[1] *= s; te[5] *= s; te[9] *= s; te[13] *= s;
		te[2] *= s; te[6] *= s; te[10] *= s; te[14] *= s;
		te[3] *= s; te[7] *= s; te[11] *= s; te[15] *= s;

		return this;

	},

	multiplyVector3: function ( v ) {
        var te = this.elements;
        
		var vx = v.x, vy = v.y, vz = v.z;
		var d = 1 / ( te[3] * vx + te[7] * vy + te[11] * vz + te[15] );

		v.x = ( te[0] * vx + te[4] * vy + te[8] * vz + te[12] ) * d;
		v.y = ( te[1] * vx + te[5] * vy + te[9] * vz + te[13] ) * d;
		v.z = ( te[2] * vx + te[6] * vy + te[10] * vz + te[14] ) * d;

		return v;

	},

	multiplyVector4: function ( v ) {
        
        var te = this.elements;
		var vx = v.x, vy = v.y, vz = v.z, vw = v.w;

		v.x = te[0] * vx + te[4] * vy + te[8] * vz + te[12] * vw;
		v.y = te[1] * vx + te[5] * vy + te[9] * vz + te[13] * vw;
		v.z = te[2] * vx + te[6] * vy + te[10] * vz + te[14] * vw;
		v.w = te[3] * vx + te[7] * vy + te[11] * vz + te[15] * vw;

		return v;

	},

	rotateAxis: function ( v ) {
        
        var te = this.elements;
		var vx = v.x, vy = v.y, vz = v.z;

		v.x = vx * te[0] + vy * te[4] + vz * te[8];
		v.y = vx * te[1] + vy * te[5] + vz * te[9];
		v.z = vx * te[2] + vy * te[6] + vz * te[10];

		v.normalize();

		return v;

	},

	crossVector: function ( a ) {
        
        var te = this.elements;
		var v = new THREE.Vector4();

		v.x = te[0] * a.x + te[4] * a.y + te[8] * a.z + te[12] * a.w;
		v.y = te[1] * a.x + te[5] * a.y + te[9] * a.z + te[13] * a.w;
		v.z = te[2] * a.x + te[6] * a.y + te[10] * a.z + te[14] * a.w;

		v.w = ( a.w ) ? te[3] * a.x + te[7] * a.y + te[11] * a.z + te[15] * a.w : 1;

		return v;

	},

	determinant: function () {

        var te = this.elements;
        
		var n11 = te[0], n12 = te[4], n13 = te[8], n14 = te[12];
		var n21 = te[1], n22 = te[5], n23 = te[9], n24 = te[13];
		var n31 = te[2], n32 = te[6], n33 = te[10], n34 = te[14];
		var n41 = te[3], n42 = te[7], n43 = te[11], n44 = te[15];

		//TODO: make this more efficient
		//( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

		return (
			n14 * n23 * n32 * n41-
			n13 * n24 * n32 * n41-
			n14 * n22 * n33 * n41+
			n12 * n24 * n33 * n41+

			n13 * n22 * n34 * n41-
			n12 * n23 * n34 * n41-
			n14 * n23 * n31 * n42+
			n13 * n24 * n31 * n42+

			n14 * n21 * n33 * n42-
			n11 * n24 * n33 * n42-
			n13 * n21 * n34 * n42+
			n11 * n23 * n34 * n42+

			n14 * n22 * n31 * n43-
			n12 * n24 * n31 * n43-
			n14 * n21 * n32 * n43+
			n11 * n24 * n32 * n43+

			n12 * n21 * n34 * n43-
			n11 * n22 * n34 * n43-
			n13 * n22 * n31 * n44+
			n12 * n23 * n31 * n44+

			n13 * n21 * n32 * n44-
			n11 * n23 * n32 * n44-
			n12 * n21 * n33 * n44+
			n11 * n22 * n33 * n44
		);

	},

	transpose: function () {
        var te = this.elements;
        
		var tmp;

		tmp = te[1]; te[1] = te[4]; te[4] = tmp;
		tmp = te[2]; te[2] = te[8]; te[8] = tmp;
		tmp = te[6]; te[6] = te[9]; te[9] = tmp;

		tmp = te[3]; te[3] = te[12]; te[12] = tmp;
		tmp = te[7]; te[7] = te[13]; te[13] = tmp;
		tmp = te[11]; te[11] = te[14]; te[14] = tmp;

		return this;

	},

	flattenToArray: function ( flat ) {

        var te = this.elements;
		flat[ 0 ] = te[0]; flat[ 1 ] = te[1]; flat[ 2 ] = te[2]; flat[ 3 ] = te[3];
		flat[ 4 ] = te[4]; flat[ 5 ] = te[5]; flat[ 6 ] = te[6]; flat[ 7 ] = te[7];
		flat[ 8 ]  = te[8]; flat[ 9 ]  = te[9]; flat[ 10 ] = te[10]; flat[ 11 ] = te[11];
		flat[ 12 ] = te[12]; flat[ 13 ] = te[13]; flat[ 14 ] = te[14]; flat[ 15 ] = te[15];

		return flat;

	},

	flattenToArrayOffset: function( flat, offset ) {

        var te = this.elements;
		flat[ offset ] = te[0];
		flat[ offset + 1 ] = te[1];
		flat[ offset + 2 ] = te[2];
		flat[ offset + 3 ] = te[3];

		flat[ offset + 4 ] = te[4];
		flat[ offset + 5 ] = te[5];
		flat[ offset + 6 ] = te[6];
		flat[ offset + 7 ] = te[7];

		flat[ offset + 8 ]  = te[8];
		flat[ offset + 9 ]  = te[9];
		flat[ offset + 10 ] = te[10];
		flat[ offset + 11 ] = te[11];

		flat[ offset + 12 ] = te[12];
		flat[ offset + 13 ] = te[13];
		flat[ offset + 14 ] = te[14];
		flat[ offset + 15 ] = te[15];

		return flat;

	},

	getPosition: function () {
        var te = this.elements;
        
		return THREE.Matrix4.__v1.set( te[12], te[13], te[14] );

	},

	setPosition: function ( v ) {
        var te = this.elements;
		te[12] = v.x;
		te[13] = v.y;
		te[14] = v.z;

		return this;

	},

	getColumnX: function () {
        var te = this.elements;
		return THREE.Matrix4.__v1.set( te[0], te[1], te[2] );

	},

	getColumnY: function () {
        var te = this.elements;
		return THREE.Matrix4.__v1.set( te[4], te[5], te[6] );

	},

	getColumnZ: function() {
        var te = this.elements;
		return THREE.Matrix4.__v1.set( te[8], te[9], te[10] );

	},

	getInverse: function ( m ) {

		// based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
        var te = this.elements;
        var me = m.elements;
                
		var n11 = me[0], n12 = me[4], n13 = me[8], n14 = me[12];
		var n21 = me[1], n22 = me[5], n23 = me[9], n24 = me[13];
		var n31 = me[2], n32 = me[6], n33 = me[10], n34 = me[14];
		var n41 = me[3], n42 = me[7], n43 = me[11], n44 = me[15];

		te[0] = n23*n34*n42 - n24*n33*n42 + n24*n32*n43 - n22*n34*n43 - n23*n32*n44 + n22*n33*n44;
		te[4] = n14*n33*n42 - n13*n34*n42 - n14*n32*n43 + n12*n34*n43 + n13*n32*n44 - n12*n33*n44;
		te[8] = n13*n24*n42 - n14*n23*n42 + n14*n22*n43 - n12*n24*n43 - n13*n22*n44 + n12*n23*n44;
		te[12] = n14*n23*n32 - n13*n24*n32 - n14*n22*n33 + n12*n24*n33 + n13*n22*n34 - n12*n23*n34;
		te[1] = n24*n33*n41 - n23*n34*n41 - n24*n31*n43 + n21*n34*n43 + n23*n31*n44 - n21*n33*n44;
		te[5] = n13*n34*n41 - n14*n33*n41 + n14*n31*n43 - n11*n34*n43 - n13*n31*n44 + n11*n33*n44;
		te[9] = n14*n23*n41 - n13*n24*n41 - n14*n21*n43 + n11*n24*n43 + n13*n21*n44 - n11*n23*n44;
		te[13] = n13*n24*n31 - n14*n23*n31 + n14*n21*n33 - n11*n24*n33 - n13*n21*n34 + n11*n23*n34;
		te[2] = n22*n34*n41 - n24*n32*n41 + n24*n31*n42 - n21*n34*n42 - n22*n31*n44 + n21*n32*n44;
		te[6] = n14*n32*n41 - n12*n34*n41 - n14*n31*n42 + n11*n34*n42 + n12*n31*n44 - n11*n32*n44;
		te[10] = n12*n24*n41 - n14*n22*n41 + n14*n21*n42 - n11*n24*n42 - n12*n21*n44 + n11*n22*n44;
		te[14] = n14*n22*n31 - n12*n24*n31 - n14*n21*n32 + n11*n24*n32 + n12*n21*n34 - n11*n22*n34;
		te[3] = n23*n32*n41 - n22*n33*n41 - n23*n31*n42 + n21*n33*n42 + n22*n31*n43 - n21*n32*n43;
		te[7] = n12*n33*n41 - n13*n32*n41 + n13*n31*n42 - n11*n33*n42 - n12*n31*n43 + n11*n32*n43;
		te[11] = n13*n22*n41 - n12*n23*n41 - n13*n21*n42 + n11*n23*n42 + n12*n21*n43 - n11*n22*n43;
		te[15] = n12*n23*n31 - n13*n22*n31 + n13*n21*n32 - n11*n23*n32 - n12*n21*n33 + n11*n22*n33;
		this.multiplyScalar( 1 / m.determinant() );

		return this;

	},

	setRotationFromEuler: function( v, order ) {
        var te = this.elements;
        
		var x = v.x, y = v.y, z = v.z;
		var a = Math.cos( x ), b = Math.sin( x );
		var c = Math.cos( y ), d = Math.sin( y );
		var e = Math.cos( z ), f = Math.sin( z );

		switch ( order ) {

			case 'YXZ':

				var ce = c * e, cf = c * f, de = d * e, df = d * f;

				te[0] = ce + df * b;
				te[4] = de * b - cf;
				te[8] = a * d;

				te[1] = a * f;
				te[5] = a * e;
				te[9] = - b;

				te[2] = cf * b - de;
				te[6] = df + ce * b;
				te[10] = a * c;
				break;

			case 'ZXY':

				var ce = c * e, cf = c * f, de = d * e, df = d * f;

				te[0] = ce - df * b;
				te[4] = - a * f;
				te[8] = de + cf * b;

				te[1] = cf + de * b;
				te[5] = a * e;
				te[9] = df - ce * b;

				te[2] = - a * d;
				te[6] = b;
				te[10] = a * c;
				break;

			case 'ZYX':

				var ae = a * e, af = a * f, be = b * e, bf = b * f;

				te[0] = c * e;
				te[4] = be * d - af;
				te[8] = ae * d + bf;

				te[1] = c * f;
				te[5] = bf * d + ae;
				te[9] = af * d - be;

				te[2] = - d;
				te[6] = b * c;
				te[10] = a * c;
				break;

			case 'YZX':

				var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

				te[0] = c * e;
				te[4] = bd - ac * f;
				te[8] = bc * f + ad;

				te[1] = f;
				te[5] = a * e;
				te[9] = - b * e;

				te[2] = - d * e;
				te[6] = ad * f + bc;
				te[10] = ac - bd * f;
				break;

			case 'XZY':

				var ac = a * c, ad = a * d, bc = b * c, bd = b * d;

				te[0] = c * e;
				te[4] = - f;
				te[8] = d * e;

				te[1] = ac * f + bd;
				te[5] = a * e;
				te[9] = ad * f - bc;

				te[2] = bc * f - ad;
				te[6] = b * e;
				te[10] = bd * f + ac;
				break;

			default: // 'XYZ'

				var ae = a * e, af = a * f, be = b * e, bf = b * f;

				te[0] = c * e;
				te[4] = - c * f;
				te[8] = d;

				te[1] = af + be * d;
				te[5] = ae - bf * d;
				te[9] = - b * c;

				te[2] = bf - ae * d;
				te[6] = be + af * d;
				te[10] = a * c;
				break;

		}

		return this;

	},


	setRotationFromQuaternion: function( q ) {
        var te = this.elements;
        
		var x = q.x, y = q.y, z = q.z, w = q.w;
		var x2 = x + x, y2 = y + y, z2 = z + z;
		var xx = x * x2, xy = x * y2, xz = x * z2;
		var yy = y * y2, yz = y * z2, zz = z * z2;
		var wx = w * x2, wy = w * y2, wz = w * z2;

		te[0] = 1 - ( yy + zz );
		te[4] = xy - wz;
		te[8] = xz + wy;

		te[1] = xy + wz;
		te[5] = 1 - ( xx + zz );
		te[9] = yz - wx;

		te[2] = xz - wy;
		te[6] = yz + wx;
		te[10] = 1 - ( xx + yy );

		return this;

	},

	compose: function ( translation, rotation, scale ) {
        var te = this.elements;
		var mRotation = THREE.Matrix4.__m1;
		var mScale = THREE.Matrix4.__m2;

		mRotation.identity();
		mRotation.setRotationFromQuaternion( rotation );

		mScale.makeScale( scale.x, scale.y, scale.z );

		this.multiply( mRotation, mScale );

		te[12] = translation.x;
		te[13] = translation.y;
		te[14] = translation.z;

		return this;

	},

	decompose: function ( translation, rotation, scale ) {

		// grab the axis vectors
        var te = this.elements;
		var x = THREE.Matrix4.__v1;
		var y = THREE.Matrix4.__v2;
		var z = THREE.Matrix4.__v3;

		x.set( te[0], te[1], te[2] );
		y.set( te[4], te[5], te[6] );
		z.set( te[8], te[9], te[10] );

		translation = ( translation instanceof THREE.Vector3 ) ? translation : new THREE.Vector3();
		rotation = ( rotation instanceof THREE.Quaternion ) ? rotation : new THREE.Quaternion();
		scale = ( scale instanceof THREE.Vector3 ) ? scale : new THREE.Vector3();

		scale.x = x.length();
		scale.y = y.length();
		scale.z = z.length();

		translation.x = te[12];
		translation.y = te[13];
		translation.z = te[14];

		// scale the rotation part

		var matrix = THREE.Matrix4.__m1;

		matrix.copy( this );

		matrix.elements[0] /= scale.x;
		matrix.elements[1] /= scale.x;
		matrix.elements[2] /= scale.x;

		matrix.elements[4] /= scale.y;
		matrix.elements[5] /= scale.y;
		matrix.elements[6] /= scale.y;

		matrix.elements[8] /= scale.z;
		matrix.elements[9] /= scale.z;
		matrix.elements[10] /= scale.z;

		rotation.setFromRotationMatrix( matrix );

		return [ translation, rotation, scale ];

	},

	extractPosition: function ( m ) {
        var te = this.elements;
        var me = m.elements;
		te[12] = me[12];
		te[13] = me[13];
		te[14] = me[14];

		return this;

	},

	extractRotation: function ( m ) {
        var te = this.elements;
        var me = m.elements;
        
		var vector = THREE.Matrix4.__v1;

		var scaleX = 1 / vector.set( me[0], me[1], me[2] ).length();
		var scaleY = 1 / vector.set( me[4], me[5], me[6] ).length();
		var scaleZ = 1 / vector.set( me[8], me[9], me[10] ).length();

		te[0] = me[0] * scaleX;
		te[1] = me[1] * scaleX;
		te[2] = me[2] * scaleX;

		te[4] = me[4] * scaleY;
		te[5] = me[5] * scaleY;
		te[6] = me[6] * scaleY;

		te[8] = me[8] * scaleZ;
		te[9] = me[9] * scaleZ;
		te[10] = me[10] * scaleZ;

		return this;

	},

	//

	translate: function ( v ) {
        var te = this.elements;
		var x = v.x, y = v.y, z = v.z;

		te[12] = te[0] * x + te[4] * y + te[8] * z + te[12];
		te[13] = te[1] * x + te[5] * y + te[9] * z + te[13];
		te[14] = te[2] * x + te[6] * y + te[10] * z + te[14];
		te[15] = te[3] * x + te[7] * y + te[11] * z + te[15];

		return this;

	},

	rotateX: function ( angle ) {
        var te = this.elements;
		var m12 = te[4];
		var m22 = te[5];
		var m32 = te[6];
		var m42 = te[7];
		var m13 = te[8];
		var m23 = te[9];
		var m33 = te[10];
		var m43 = te[11];
		var c = Math.cos( angle );
		var s = Math.sin( angle );

		te[4] = c * m12 + s * m13;
		te[5] = c * m22 + s * m23;
		te[6] = c * m32 + s * m33;
		te[7] = c * m42 + s * m43;

		te[8] = c * m13 - s * m12;
		te[9] = c * m23 - s * m22;
		te[10] = c * m33 - s * m32;
		te[11] = c * m43 - s * m42;

		return this;

  	},

	rotateY: function ( angle ) {
        var te = this.elements;
		var m11 = te[0];
		var m21 = te[1];
		var m31 = te[2];
		var m41 = te[3];
		var m13 = te[8];
		var m23 = te[9];
		var m33 = te[10];
		var m43 = te[11];
		var c = Math.cos( angle );
		var s = Math.sin( angle );

		te[0] = c * m11 - s * m13;
		te[1] = c * m21 - s * m23;
		te[2] = c * m31 - s * m33;
		te[3] = c * m41 - s * m43;

		te[8] = c * m13 + s * m11;
		te[9] = c * m23 + s * m21;
		te[10] = c * m33 + s * m31;
		te[11] = c * m43 + s * m41;

		return this;

	},

	rotateZ: function ( angle ) {
        var te = this.elements;
		var m11 = te[0];
		var m21 = te[1];
		var m31 = te[2];
		var m41 = te[3];
		var m12 = te[4];
		var m22 = te[5];
		var m32 = te[6];
		var m42 = te[7];
		var c = Math.cos( angle );
		var s = Math.sin( angle );

		te[0] = c * m11 + s * m12;
		te[1] = c * m21 + s * m22;
		te[2] = c * m31 + s * m32;
		te[3] = c * m41 + s * m42;

		te[4] = c * m12 - s * m11;
		te[5] = c * m22 - s * m21;
		te[6] = c * m32 - s * m31;
		te[7] = c * m42 - s * m41;

		return this;

	},

	rotateByAxis: function ( axis, angle ) {
        var te = this.elements;
		// optimize by checking axis

		if ( axis.x === 1 && axis.y === 0 && axis.z === 0 ) {

			return this.rotateX( angle );

		} else if ( axis.x === 0 && axis.y === 1 && axis.z === 0 ) {

			return this.rotateY( angle );

		} else if ( axis.x === 0 && axis.y === 0 && axis.z === 1 ) {

			return this.rotateZ( angle );

		}

		var x = axis.x, y = axis.y, z = axis.z;
		var n = Math.sqrt(x * x + y * y + z * z);

		x /= n;
		y /= n;
		z /= n;

		var xx = x * x, yy = y * y, zz = z * z;
		var c = Math.cos( angle );
		var s = Math.sin( angle );
		var oneMinusCosine = 1 - c;
		var xy = x * y * oneMinusCosine;
		var xz = x * z * oneMinusCosine;
		var yz = y * z * oneMinusCosine;
		var xs = x * s;
		var ys = y * s;
		var zs = z * s;

		var r11 = xx + (1 - xx) * c;
		var r21 = xy + zs;
		var r31 = xz - ys;
		var r12 = xy - zs;
		var r22 = yy + (1 - yy) * c;
		var r32 = yz + xs;
		var r13 = xz + ys;
		var r23 = yz - xs;
		var r33 = zz + (1 - zz) * c;

		var m11 = te[0], m21 = te[1], m31 = te[2], m41 = te[3];
		var m12 = te[4], m22 = te[5], m32 = te[6], m42 = te[7];
		var m13 = te[8], m23 = te[9], m33 = te[10], m43 = te[11];
		var m14 = te[12], m24 = te[13], m34 = te[14], m44 = te[15];

		te[0] = r11 * m11 + r21 * m12 + r31 * m13;
		te[1] = r11 * m21 + r21 * m22 + r31 * m23;
		te[2] = r11 * m31 + r21 * m32 + r31 * m33;
		te[3] = r11 * m41 + r21 * m42 + r31 * m43;

		te[4] = r12 * m11 + r22 * m12 + r32 * m13;
		te[5] = r12 * m21 + r22 * m22 + r32 * m23;
		te[6] = r12 * m31 + r22 * m32 + r32 * m33;
		te[7] = r12 * m41 + r22 * m42 + r32 * m43;

		te[8] = r13 * m11 + r23 * m12 + r33 * m13;
		te[9] = r13 * m21 + r23 * m22 + r33 * m23;
		te[10] = r13 * m31 + r23 * m32 + r33 * m33;
		te[11] = r13 * m41 + r23 * m42 + r33 * m43;

		return this;

	},

	scale: function ( v ) {
        var te = this.elements;
		var x = v.x, y = v.y, z = v.z;

		te[0] *= x; te[4] *= y; te[8] *= z;
		te[1] *= x; te[5] *= y; te[9] *= z;
		te[2] *= x; te[6] *= y; te[10] *= z;
		te[3] *= x; te[7] *= y; te[11] *= z;

		return this;

	},

	//

	makeTranslation: function ( x, y, z ) {

		this.set(

			1, 0, 0, x,
			0, 1, 0, y,
			0, 0, 1, z,
			0, 0, 0, 1

		);

		return this;

	},

	makeRotationX: function ( theta ) {

		var c = Math.cos( theta ), s = Math.sin( theta );

		this.set(

			1, 0,  0, 0,
			0, c, -s, 0,
			0, s,  c, 0,
			0, 0,  0, 1

		);

		return this;

	},

	makeRotationY: function ( theta ) {

		var c = Math.cos( theta ), s = Math.sin( theta );

		this.set(

			 c, 0, s, 0,
			 0, 1, 0, 0,
			-s, 0, c, 0,
			 0, 0, 0, 1

		);

		return this;

	},

	makeRotationZ: function ( theta ) {

		var c = Math.cos( theta ), s = Math.sin( theta );

		this.set(

			c, -s, 0, 0,
			s,  c, 0, 0,
			0,  0, 1, 0,
			0,  0, 0, 1

		);

		return this;

	},

	makeRotationAxis: function ( axis, angle ) {

		// Based on http://www.gamedev.net/reference/articles/article1199.asp

		var c = Math.cos( angle );
		var s = Math.sin( angle );
		var t = 1 - c;
		var x = axis.x, y = axis.y, z = axis.z;
		var tx = t * x, ty = t * y;

		this.set(

		 	tx * x + c, tx * y - s * z, tx * z + s * y, 0,
			tx * y + s * z, ty * y + c, ty * z - s * x, 0,
			tx * z - s * y, ty * z + s * x, t * z * z + c, 0,
			0, 0, 0, 1

		);

		 return this;

	},

	makeScale: function ( x, y, z ) {

		this.set(

			x, 0, 0, 0,
			0, y, 0, 0,
			0, 0, z, 0,
			0, 0, 0, 1

		);

		return this;

	},

	makeFrustum: function ( left, right, bottom, top, near, far ) {
        var te = this.elements;
		var x = 2 * near / ( right - left );
		var y = 2 * near / ( top - bottom );

		var a = ( right + left ) / ( right - left );
		var b = ( top + bottom ) / ( top - bottom );
		var c = - ( far + near ) / ( far - near );
		var d = - 2 * far * near / ( far - near );

		te[0] = x;  te[4] = 0;  te[8] = a;   te[12] = 0;
		te[1] = 0;  te[5] = y;  te[9] = b;   te[13] = 0;
		te[2] = 0;  te[6] = 0;  te[10] = c;   te[14] = d;
		te[3] = 0;  te[7] = 0;  te[11] = - 1; te[15] = 0;

		return this;

	},

	makePerspective: function ( fov, aspect, near, far ) {

		var ymax = near * Math.tan( fov * Math.PI / 360 );
		var ymin = - ymax;
		var xmin = ymin * aspect;
		var xmax = ymax * aspect;

		return this.makeFrustum( xmin, xmax, ymin, ymax, near, far );

	},

	makeOrthographic: function ( left, right, top, bottom, near, far ) {
        var te = this.elements;
		var w = right - left;
		var h = top - bottom;
		var p = far - near;

		var x = ( right + left ) / w;
		var y = ( top + bottom ) / h;
		var z = ( far + near ) / p;

		te[0] = 2 / w; te[4] = 0;     te[8] = 0;      te[12] = -x;
		te[1] = 0;     te[5] = 2 / h; te[9] = 0;      te[13] = -y;
		te[2] = 0;     te[6] = 0;     te[10] = -2 / p; te[14] = -z;
		te[3] = 0;     te[7] = 0;     te[11] = 0;      te[15] = 1;

		return this;

	},


	clone: function () {
        var te = this.elements;
		return new THREE.Matrix4(

			te[0], te[4], te[8], te[12],
			te[1], te[5], te[9], te[13],
			te[2], te[6], te[10], te[14],
			te[3], te[7], te[11], te[15]

		);

	}

};

THREE.Matrix4.__v1 = new THREE.Vector3();
THREE.Matrix4.__v2 = new THREE.Vector3();
THREE.Matrix4.__v3 = new THREE.Vector3();

THREE.Matrix4.__m1 = new THREE.Matrix4();
THREE.Matrix4.__m2 = new THREE.Matrix4();
/**
 * @author mr.doob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Object3D = function () {

	this.id = THREE.Object3DCount ++;

	this.name = '';

	this.parent = undefined;
	this.children = [];

	this.up = new THREE.Vector3( 0, 1, 0 );

	this.position = new THREE.Vector3();
	this.rotation = new THREE.Vector3();
	this.eulerOrder = 'XYZ';
	this.scale = new THREE.Vector3( 1, 1, 1 );

	this.doubleSided = false;
	this.flipSided = false;

	this.renderDepth = null;

	this.rotationAutoUpdate = true;

	this.matrix = new THREE.Matrix4();
	this.matrixWorld = new THREE.Matrix4();
	this.matrixRotationWorld = new THREE.Matrix4();

	this.matrixAutoUpdate = true;
	this.matrixWorldNeedsUpdate = true;

	this.quaternion = new THREE.Quaternion();
	this.useQuaternion = false;

	this.boundRadius = 0.0;
	this.boundRadiusScale = 1.0;

	this.visible = true;

	this.castShadow = false;
	this.receiveShadow = false;

	this.frustumCulled = true;

	this._vector = new THREE.Vector3();

};


THREE.Object3D.prototype = {

	constructor: THREE.Object3D,

	applyMatrix: function ( matrix ) {

		this.matrix.multiply( matrix, this.matrix );

		this.scale.getScaleFromMatrix( this.matrix );
		this.rotation.getRotationFromMatrix( this.matrix, this.scale );
		this.position.getPositionFromMatrix( this.matrix );

	},

	translate: function ( distance, axis ) {

		this.matrix.rotateAxis( axis );
		this.position.addSelf( axis.multiplyScalar( distance ) );

	},

	translateX: function ( distance ) {

		this.translate( distance, this._vector.set( 1, 0, 0 ) );

	},

	translateY: function ( distance ) {

		this.translate( distance, this._vector.set( 0, 1, 0 ) );

	},

	translateZ: function ( distance ) {

		this.translate( distance, this._vector.set( 0, 0, 1 ) );

	},

	lookAt: function ( vector ) {

		// TODO: Add hierarchy support.

		this.matrix.lookAt( vector, this.position, this.up );

		if ( this.rotationAutoUpdate ) {

			this.rotation.getRotationFromMatrix( this.matrix );

		}

	},

	add: function ( object ) {

		if ( object === this ) {

			console.warn( 'THREE.Object3D.add: An object can\'t be added as a child of itself.' );
			return;

		}

		if ( this.children.indexOf( object ) === - 1 ) {

			if ( object.parent !== undefined ) {

				object.parent.remove( object );

			}

			object.parent = this;
			this.children.push( object );

			// add to scene

			var scene = this;

			while ( scene.parent !== undefined ) {

				scene = scene.parent;

			}

			if ( scene !== undefined && scene instanceof THREE.Scene )  {

				scene.__addObject( object );

			}

		}

	},

	remove: function ( object ) {

		var index = this.children.indexOf( object );

		if ( index !== - 1 ) {

			object.parent = undefined;
			this.children.splice( index, 1 );

			// remove from scene

			var scene = this;

			while ( scene.parent !== undefined ) {

				scene = scene.parent;

			}

			if ( scene !== undefined && scene instanceof THREE.Scene ) {

				scene.__removeObject( object );

			}

		}

	},

	getChildByName: function ( name, recursive ) {

		var c, cl, child;

		for ( c = 0, cl = this.children.length; c < cl; c ++ ) {

			child = this.children[ c ];

			if ( child.name === name ) {

				return child;

			}

			if ( recursive ) {

				child = child.getChildByName( name, recursive );

				if ( child !== undefined ) {

					return child;

				}

			}

		}

		return undefined;

	},

	updateMatrix: function () {

		this.matrix.setPosition( this.position );

		if ( this.useQuaternion )  {

			this.matrix.setRotationFromQuaternion( this.quaternion );

		} else {

			this.matrix.setRotationFromEuler( this.rotation, this.eulerOrder );

		}

		if ( this.scale.x !== 1 || this.scale.y !== 1 || this.scale.z !== 1 ) {

			this.matrix.scale( this.scale );
			this.boundRadiusScale = Math.max( this.scale.x, Math.max( this.scale.y, this.scale.z ) );

		}

		this.matrixWorldNeedsUpdate = true;

	},

	updateMatrixWorld: function ( force ) {

		this.matrixAutoUpdate && this.updateMatrix();

		// update matrixWorld

		if ( this.matrixWorldNeedsUpdate || force ) {

			if ( this.parent ) {

				this.matrixWorld.multiply( this.parent.matrixWorld, this.matrix );

			} else {

				this.matrixWorld.copy( this.matrix );

			}

			this.matrixWorldNeedsUpdate = false;

			force = true;

		}

		// update children

		for ( var i = 0, l = this.children.length; i < l; i ++ ) {

			this.children[ i ].updateMatrixWorld( force );

		}

	}

};

THREE.Object3DCount = 0;
/**
 * @author mr.doob / http://mrdoob.com/
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author julianwa / https://github.com/julianwa
 */

THREE.Projector = function() {

	var _object, _objectCount, _objectPool = [],
	_vertex, _vertexCount, _vertexPool = [],
	_face, _face3Count, _face3Pool = [], _face4Count, _face4Pool = [],
	_line, _lineCount, _linePool = [],
	_particle, _particleCount, _particlePool = [],

	_renderData = { objects: [], sprites: [], lights: [], elements: [] },

	_vector3 = new THREE.Vector3(),
	_vector4 = new THREE.Vector4(),

	_projScreenMatrix = new THREE.Matrix4(),
	_projScreenobjectMatrixWorld = new THREE.Matrix4(),

	_frustum = new THREE.Frustum(),

	_clippedVertex1PositionScreen = new THREE.Vector4(),
	_clippedVertex2PositionScreen = new THREE.Vector4(),

	_face3VertexNormals;

	this.projectVector = function ( vector, camera ) {

		camera.matrixWorldInverse.getInverse( camera.matrixWorld );

		_projScreenMatrix.multiply( camera.projectionMatrix, camera.matrixWorldInverse );
		_projScreenMatrix.multiplyVector3( vector );

		return vector;

	};

	this.unprojectVector = function ( vector, camera ) {

		camera.projectionMatrixInverse.getInverse( camera.projectionMatrix );

		_projScreenMatrix.multiply( camera.matrixWorld, camera.projectionMatrixInverse );
		_projScreenMatrix.multiplyVector3( vector );

		return vector;

	};

	this.pickingRay = function ( vector, camera ) {

		var end, ray, t;

		// set two vectors with opposing z values
		vector.z = -1.0;
		end = new THREE.Vector3( vector.x, vector.y, 1.0 );

		this.unprojectVector( vector, camera );
		this.unprojectVector( end, camera );

		// find direction from vector to end
		end.subSelf( vector ).normalize();

		return new THREE.Ray( vector, end );

	};

	this.projectGraph = function ( root, sort ) {

		_objectCount = 0;

		_renderData.objects.length = 0;
		_renderData.sprites.length = 0;
		_renderData.lights.length = 0;

		var projectObject = function ( object ) {

			if ( object.visible === false ) return;

			if ( ( object instanceof THREE.Mesh || object instanceof THREE.Line ) &&
			( object.frustumCulled === false || _frustum.contains( object ) ) ) {

				_vector3.copy( object.matrixWorld.getPosition() );
				_projScreenMatrix.multiplyVector3( _vector3 );

				_object = getNextObjectInPool();
				_object.object = object;
				_object.z = _vector3.z;

				_renderData.objects.push( _object );

			} else if ( object instanceof THREE.Sprite || object instanceof THREE.Particle ) {

				_vector3.copy( object.matrixWorld.getPosition() );
				_projScreenMatrix.multiplyVector3( _vector3 );

				_object = getNextObjectInPool();
				_object.object = object;
				_object.z = _vector3.z;

				_renderData.sprites.push( _object );

			} else if ( object instanceof THREE.Light ) {

				_renderData.lights.push( object );

			}

			for ( var c = 0, cl = object.children.length; c < cl; c ++ ) {

				projectObject( object.children[ c ] );

			}

		};

		projectObject( root );

		sort && _renderData.objects.sort( painterSort );

		return _renderData;

	};

	this.projectScene = function ( scene, camera, sort ) {

		var near = camera.near, far = camera.far, visible = false,
		o, ol, v, vl, f, fl, n, nl, c, cl, u, ul, object,
		objectMatrixWorld, objectMatrixWorldRotation,
		geometry, geometryMaterials, vertices, vertex, vertexPositionScreen,
		faces, face, faceVertexNormals, normal, faceVertexUvs, uvs,
		v1, v2, v3, v4;

		_face3Count = 0;
		_face4Count = 0;
		_lineCount = 0;
		_particleCount = 0;

		_renderData.elements.length = 0;

		if ( camera.parent === undefined ) {

			console.warn( 'DEPRECATED: Camera hasn\'t been added to a Scene. Adding it...' );
			scene.add( camera );

		}

		scene.updateMatrixWorld();

		camera.matrixWorldInverse.getInverse( camera.matrixWorld );

		_projScreenMatrix.multiply( camera.projectionMatrix, camera.matrixWorldInverse );

		_frustum.setFromMatrix( _projScreenMatrix );

		_renderData = this.projectGraph( scene, false );

		for ( o = 0, ol = _renderData.objects.length; o < ol; o++ ) {

			object = _renderData.objects[ o ].object;

			objectMatrixWorld = object.matrixWorld;

			_vertexCount = 0;

			if ( object instanceof THREE.Mesh ) {

				geometry = object.geometry;
				geometryMaterials = object.geometry.materials;
				vertices = geometry.vertices;
				faces = geometry.faces;
				faceVertexUvs = geometry.faceVertexUvs;

				objectMatrixWorldRotation = object.matrixRotationWorld.extractRotation( objectMatrixWorld );

				for ( v = 0, vl = vertices.length; v < vl; v ++ ) {

					_vertex = getNextVertexInPool();
					_vertex.positionWorld.copy( vertices[ v ].position );

					objectMatrixWorld.multiplyVector3( _vertex.positionWorld );

					_vertex.positionScreen.copy( _vertex.positionWorld );
					_projScreenMatrix.multiplyVector4( _vertex.positionScreen );

					_vertex.positionScreen.x /= _vertex.positionScreen.w;
					_vertex.positionScreen.y /= _vertex.positionScreen.w;

					_vertex.visible = _vertex.positionScreen.z > near && _vertex.positionScreen.z < far;

				}

				for ( f = 0, fl = faces.length; f < fl; f ++ ) {

					face = faces[ f ];

					if ( face instanceof THREE.Face3 ) {

						v1 = _vertexPool[ face.a ];
						v2 = _vertexPool[ face.b ];
						v3 = _vertexPool[ face.c ];

						if ( v1.visible && v2.visible && v3.visible ) {

							visible = ( ( v3.positionScreen.x - v1.positionScreen.x ) * ( v2.positionScreen.y - v1.positionScreen.y ) -
								( v3.positionScreen.y - v1.positionScreen.y ) * ( v2.positionScreen.x - v1.positionScreen.x ) ) < 0;

							if ( object.doubleSided || visible != object.flipSided ) {

								_face = getNextFace3InPool();

								_face.v1.copy( v1 );
								_face.v2.copy( v2 );
								_face.v3.copy( v3 );

							} else {

								continue;

							}

						} else {

							continue;

						}

					} else if ( face instanceof THREE.Face4 ) {

						v1 = _vertexPool[ face.a ];
						v2 = _vertexPool[ face.b ];
						v3 = _vertexPool[ face.c ];
						v4 = _vertexPool[ face.d ];

						if ( v1.visible && v2.visible && v3.visible && v4.visible ) {

							visible = ( v4.positionScreen.x - v1.positionScreen.x ) * ( v2.positionScreen.y - v1.positionScreen.y ) -
								( v4.positionScreen.y - v1.positionScreen.y ) * ( v2.positionScreen.x - v1.positionScreen.x ) < 0 ||
								( v2.positionScreen.x - v3.positionScreen.x ) * ( v4.positionScreen.y - v3.positionScreen.y ) -
								( v2.positionScreen.y - v3.positionScreen.y ) * ( v4.positionScreen.x - v3.positionScreen.x ) < 0;


							if ( object.doubleSided || visible != object.flipSided ) {

								_face = getNextFace4InPool();

								_face.v1.copy( v1 );
								_face.v2.copy( v2 );
								_face.v3.copy( v3 );
								_face.v4.copy( v4 );

							} else {

								continue;

							}

						} else {

							continue;

						}

					}

					_face.normalWorld.copy( face.normal );
					if ( !visible && ( object.flipSided || object.doubleSided ) ) _face.normalWorld.negate();
					objectMatrixWorldRotation.multiplyVector3( _face.normalWorld );

					_face.centroidWorld.copy( face.centroid );
					objectMatrixWorld.multiplyVector3( _face.centroidWorld );

					_face.centroidScreen.copy( _face.centroidWorld );
					_projScreenMatrix.multiplyVector3( _face.centroidScreen );

					faceVertexNormals = face.vertexNormals;

					for ( n = 0, nl = faceVertexNormals.length; n < nl; n ++ ) {

						normal = _face.vertexNormalsWorld[ n ];
						normal.copy( faceVertexNormals[ n ] );
						if ( !visible && ( object.flipSided || object.doubleSided ) ) normal.negate();
						objectMatrixWorldRotation.multiplyVector3( normal );

					}

					for ( c = 0, cl = faceVertexUvs.length; c < cl; c ++ ) {

						uvs = faceVertexUvs[ c ][ f ];

						if ( !uvs ) continue;

						for ( u = 0, ul = uvs.length; u < ul; u ++ ) {

							_face.uvs[ c ][ u ] = uvs[ u ];

						}

					}

					_face.material = object.material;
					_face.faceMaterial = face.materialIndex !== null ? geometryMaterials[ face.materialIndex ] : null;

					_face.z = _face.centroidScreen.z;

					_renderData.elements.push( _face );

				}

			} else if ( object instanceof THREE.Line ) {

				_projScreenobjectMatrixWorld.multiply( _projScreenMatrix, objectMatrixWorld );

				vertices = object.geometry.vertices;
				
				v1 = getNextVertexInPool();
				v1.positionScreen.copy( vertices[ 0 ].position );
				_projScreenobjectMatrixWorld.multiplyVector4( v1.positionScreen );

				// Handle LineStrip and LinePieces
				var step = object.type === THREE.LinePieces ? 2 : 1;

				for ( v = 1, vl = vertices.length; v < vl; v ++ ) {

					v1 = getNextVertexInPool();
					v1.positionScreen.copy( vertices[ v ].position );
					_projScreenobjectMatrixWorld.multiplyVector4( v1.positionScreen );

					if ( ( v + 1 ) % step > 0 ) continue;

					v2 = _vertexPool[ _vertexCount - 2 ];

					_clippedVertex1PositionScreen.copy( v1.positionScreen );
					_clippedVertex2PositionScreen.copy( v2.positionScreen );

					if ( clipLine( _clippedVertex1PositionScreen, _clippedVertex2PositionScreen ) ) {

						// Perform the perspective divide
						_clippedVertex1PositionScreen.multiplyScalar( 1 / _clippedVertex1PositionScreen.w );
						_clippedVertex2PositionScreen.multiplyScalar( 1 / _clippedVertex2PositionScreen.w );

						_line = getNextLineInPool();
						_line.v1.positionScreen.copy( _clippedVertex1PositionScreen );
						_line.v2.positionScreen.copy( _clippedVertex2PositionScreen );

						_line.z = Math.max( _clippedVertex1PositionScreen.z, _clippedVertex2PositionScreen.z );

						_line.material = object.material;

						_renderData.elements.push( _line );

					}

				}

			}

		}

		for ( o = 0, ol = _renderData.sprites.length; o < ol; o++ ) {

			object = _renderData.sprites[ o ].object;

			objectMatrixWorld = object.matrixWorld;

			if ( object instanceof THREE.Particle ) {

				_vector4.set( objectMatrixWorld.elements[12], objectMatrixWorld.elements[13], objectMatrixWorld.elements[14], 1 );
				_projScreenMatrix.multiplyVector4( _vector4 );

				_vector4.z /= _vector4.w;

				if ( _vector4.z > 0 && _vector4.z < 1 ) {

					_particle = getNextParticleInPool();
					_particle.x = _vector4.x / _vector4.w;
					_particle.y = _vector4.y / _vector4.w;
					_particle.z = _vector4.z;

					_particle.rotation = object.rotation.z;

					_particle.scale.x = object.scale.x * Math.abs( _particle.x - ( _vector4.x + camera.projectionMatrix.elements[0] ) / ( _vector4.w + camera.projectionMatrix.elements[12] ) );
					_particle.scale.y = object.scale.y * Math.abs( _particle.y - ( _vector4.y + camera.projectionMatrix.elements[5] ) / ( _vector4.w + camera.projectionMatrix.elements[13] ) );

					_particle.material = object.material;

					_renderData.elements.push( _particle );

				}

			}

		}

		sort && _renderData.elements.sort( painterSort );

		return _renderData;

	};

	// Pools

	function getNextObjectInPool() {

		var object = _objectPool[ _objectCount ] = _objectPool[ _objectCount ] || new THREE.RenderableObject();

		_objectCount ++;

		return object;

	}

	function getNextVertexInPool() {

		var vertex = _vertexPool[ _vertexCount ] = _vertexPool[ _vertexCount ] || new THREE.RenderableVertex();

		_vertexCount ++;

		return vertex;

	}

	function getNextFace3InPool() {

		var face = _face3Pool[ _face3Count ] = _face3Pool[ _face3Count ] || new THREE.RenderableFace3();

		_face3Count ++;

		return face;

	}

	function getNextFace4InPool() {

		var face = _face4Pool[ _face4Count ] = _face4Pool[ _face4Count ] || new THREE.RenderableFace4();

		_face4Count ++;

		return face;

	}

	function getNextLineInPool() {

		var line = _linePool[ _lineCount ] = _linePool[ _lineCount ] || new THREE.RenderableLine();

		_lineCount ++;

		return line;

	}

	function getNextParticleInPool() {

		var particle = _particlePool[ _particleCount ] = _particlePool[ _particleCount ] || new THREE.RenderableParticle();
		_particleCount ++;
		return particle;

	}

	//

	function painterSort( a, b ) {

		return b.z - a.z;

	}

	function clipLine( s1, s2 ) {

		var alpha1 = 0, alpha2 = 1,

		// Calculate the boundary coordinate of each vertex for the near and far clip planes,
		// Z = -1 and Z = +1, respectively.
		bc1near =  s1.z + s1.w,
		bc2near =  s2.z + s2.w,
		bc1far =  - s1.z + s1.w,
		bc2far =  - s2.z + s2.w;

		if ( bc1near >= 0 && bc2near >= 0 && bc1far >= 0 && bc2far >= 0 ) {

			// Both vertices lie entirely within all clip planes.
			return true;

		} else if ( ( bc1near < 0 && bc2near < 0) || (bc1far < 0 && bc2far < 0 ) ) {

			// Both vertices lie entirely outside one of the clip planes.
			return false;

		} else {

			// The line segment spans at least one clip plane.

			if ( bc1near < 0 ) {

				// v1 lies outside the near plane, v2 inside
				alpha1 = Math.max( alpha1, bc1near / ( bc1near - bc2near ) );

			} else if ( bc2near < 0 ) {

				// v2 lies outside the near plane, v1 inside
				alpha2 = Math.min( alpha2, bc1near / ( bc1near - bc2near ) );

			}

			if ( bc1far < 0 ) {

				// v1 lies outside the far plane, v2 inside
				alpha1 = Math.max( alpha1, bc1far / ( bc1far - bc2far ) );

			} else if ( bc2far < 0 ) {

				// v2 lies outside the far plane, v2 inside
				alpha2 = Math.min( alpha2, bc1far / ( bc1far - bc2far ) );

			}

			if ( alpha2 < alpha1 ) {

				// The line segment spans two boundaries, but is outside both of them.
				// (This can't happen when we're only clipping against just near/far but good
				//  to leave the check here for future usage if other clip planes are added.)
				return false;

			} else {

				// Update the s1 and s2 vertices to match the clipped line segment.
				s1.lerpSelf( s2, alpha1 );
				s2.lerpSelf( s1, 1 - alpha2 );

				return true;

			}

		}

	}

};
/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Quaternion = function( x, y, z, w ) {

	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;
	this.w = ( w !== undefined ) ? w : 1;

};

THREE.Quaternion.prototype = {

	constructor: THREE.Quaternion,

	set: function ( x, y, z, w ) {

		this.x = x;
		this.y = y;
		this.z = z;
		this.w = w;

		return this;

	},

	copy: function ( q ) {

		this.x = q.x;
		this.y = q.y;
		this.z = q.z;
		this.w = q.w;

		return this;

	},

	setFromEuler: function ( vector ) {

		var c = Math.PI / 360, // 0.5 * Math.PI / 360, // 0.5 is an optimization
		x = vector.x * c,
		y = vector.y * c,
		z = vector.z * c,

		c1 = Math.cos( y  ),
		s1 = Math.sin( y  ),
		c2 = Math.cos( -z ),
		s2 = Math.sin( -z ),
		c3 = Math.cos( x  ),
		s3 = Math.sin( x  ),

		c1c2 = c1 * c2,
		s1s2 = s1 * s2;

		this.w = c1c2 * c3  - s1s2 * s3;
	  	this.x = c1c2 * s3  + s1s2 * c3;
		this.y = s1 * c2 * c3 + c1 * s2 * s3;
		this.z = c1 * s2 * c3 - s1 * c2 * s3;

		return this;

	},

	setFromAxisAngle: function ( axis, angle ) {

		// from http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
		// axis have to be normalized

		var halfAngle = angle / 2,
			s = Math.sin( halfAngle );

		this.x = axis.x * s;
		this.y = axis.y * s;
		this.z = axis.z * s;
		this.w = Math.cos( halfAngle );

		return this;

	},

	setFromRotationMatrix: function ( m ) {

		// Adapted from: http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm

		function copySign( a, b ) {

			return b < 0 ? -Math.abs( a ) : Math.abs( a );

		}

		var absQ = Math.pow( m.determinant(), 1.0 / 3.0 );
		this.w = Math.sqrt( Math.max( 0, absQ + m.elements[0] + m.elements[5] + m.elements[10] ) ) / 2;
		this.x = Math.sqrt( Math.max( 0, absQ + m.elements[0] - m.elements[5] - m.elements[10] ) ) / 2;
		this.y = Math.sqrt( Math.max( 0, absQ - m.elements[0] + m.elements[5] - m.elements[10] ) ) / 2;
		this.z = Math.sqrt( Math.max( 0, absQ - m.elements[0] - m.elements[5] + m.elements[10] ) ) / 2;
		this.x = copySign( this.x, ( m.elements[6] - m.elements[9] ) );
		this.y = copySign( this.y, ( m.elements[8] - m.elements[2] ) );
		this.z = copySign( this.z, ( m.elements[1] - m.elements[4] ) );
		this.normalize();

		return this;

	},

	calculateW : function () {

		this.w = - Math.sqrt( Math.abs( 1.0 - this.x * this.x - this.y * this.y - this.z * this.z ) );

		return this;

	},

	inverse: function () {

		this.x *= -1;
		this.y *= -1;
		this.z *= -1;

		return this;

	},

	length: function () {

		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w );

	},

	normalize: function () {

		var l = Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w );

		if ( l === 0 ) {

			this.x = 0;
			this.y = 0;
			this.z = 0;
			this.w = 0;

		} else {

			l = 1 / l;

			this.x = this.x * l;
			this.y = this.y * l;
			this.z = this.z * l;
			this.w = this.w * l;

		}

		return this;

	},

	multiply: function ( a, b ) {

		// from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm

		this.x =  a.x * b.w + a.y * b.z - a.z * b.y + a.w * b.x;
		this.y = -a.x * b.z + a.y * b.w + a.z * b.x + a.w * b.y;
		this.z =  a.x * b.y - a.y * b.x + a.z * b.w + a.w * b.z;
		this.w = -a.x * b.x - a.y * b.y - a.z * b.z + a.w * b.w;

		return this;

	},

	multiplySelf: function ( b ) {

		var qax = this.x, qay = this.y, qaz = this.z, qaw = this.w,
		qbx = b.x, qby = b.y, qbz = b.z, qbw = b.w;

		this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
		this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
		this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
		this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

		return this;

	},

	multiplyVector3: function ( vector, dest ) {

		if ( !dest ) { dest = vector; }

		var x    = vector.x,  y  = vector.y,  z  = vector.z,
			qx   = this.x, qy = this.y, qz = this.z, qw = this.w;

		// calculate quat * vector

		var ix =  qw * x + qy * z - qz * y,
			iy =  qw * y + qz * x - qx * z,
			iz =  qw * z + qx * y - qy * x,
			iw = -qx * x - qy * y - qz * z;

		// calculate result * inverse quat

		dest.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
		dest.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
		dest.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

		return dest;

	},

	clone: function () {

		return new THREE.Quaternion( this.x, this.y, this.z, this.w );

	}

}

THREE.Quaternion.slerp = function ( qa, qb, qm, t ) {

	// http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

	var cosHalfTheta = qa.w * qb.w + qa.x * qb.x + qa.y * qb.y + qa.z * qb.z;

	if (cosHalfTheta < 0) {
		qm.w = -qb.w; qm.x = -qb.x; qm.y = -qb.y; qm.z = -qb.z;
		cosHalfTheta = -cosHalfTheta;
	} else {
		qm.copy(qb);
	}

	if ( Math.abs( cosHalfTheta ) >= 1.0 ) {

		qm.w = qa.w; qm.x = qa.x; qm.y = qa.y; qm.z = qa.z;
		return qm;

	}

	var halfTheta = Math.acos( cosHalfTheta ),
	sinHalfTheta = Math.sqrt( 1.0 - cosHalfTheta * cosHalfTheta );

	if ( Math.abs( sinHalfTheta ) < 0.001 ) {

		qm.w = 0.5 * ( qa.w + qb.w );
		qm.x = 0.5 * ( qa.x + qb.x );
		qm.y = 0.5 * ( qa.y + qb.y );
		qm.z = 0.5 * ( qa.z + qb.z );

		return qm;

	}

	var ratioA = Math.sin( ( 1 - t ) * halfTheta ) / sinHalfTheta,
	ratioB = Math.sin( t * halfTheta ) / sinHalfTheta;

	qm.w = ( qa.w * ratioA + qm.w * ratioB );
	qm.x = ( qa.x * ratioA + qm.x * ratioB );
	qm.y = ( qa.y * ratioA + qm.y * ratioB );
	qm.z = ( qa.z * ratioA + qm.z * ratioB );

	return qm;

}
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.Vertex = function ( position ) {

	this.position = position || new THREE.Vector3();

};

THREE.Vertex.prototype = {

	constructor: THREE.Vertex,

	clone: function () {

		return new THREE.Vertex( this.position.clone() );

	}

};
/**
 * @author mr.doob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Face3 = function ( a, b, c, normal, color, materialIndex ) {

	this.a = a;
	this.b = b;
	this.c = c;

	this.normal = normal instanceof THREE.Vector3 ? normal : new THREE.Vector3();
	this.vertexNormals = normal instanceof Array ? normal : [ ];

	this.color = color instanceof THREE.Color ? color : new THREE.Color();
	this.vertexColors = color instanceof Array ? color : [];

	this.vertexTangents = [];

	this.materialIndex = materialIndex;

	this.centroid = new THREE.Vector3();

};

THREE.Face3.prototype = {

	constructor: THREE.Face3,

	clone: function () {

		var face = new THREE.Face3( this.a, this.b, this.c );

		face.normal.copy( this.normal );
		face.color.copy( this.color );
		face.centroid.copy( this.centroid );

		face.materialIndex = this.materialIndex;

		var i, il;
		for ( i = 0, il = this.vertexNormals.length; i < il; i ++ ) face.vertexNormals[ i ] = this.vertexNormals[ i ].clone();
		for ( i = 0, il = this.vertexColors.length; i < il; i ++ ) face.vertexColors[ i ] = this.vertexColors[ i ].clone();
		for ( i = 0, il = this.vertexTangents.length; i < il; i ++ ) face.vertexTangents[ i ] = this.vertexTangents[ i ].clone();

		return face;

	}

};
/**
 * @author mr.doob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Face4 = function ( a, b, c, d, normal, color, materialIndex ) {

	this.a = a;
	this.b = b;
	this.c = c;
	this.d = d;

	this.normal = normal instanceof THREE.Vector3 ? normal : new THREE.Vector3();
	this.vertexNormals = normal instanceof Array ? normal : [ ];

	this.color = color instanceof THREE.Color ? color : new THREE.Color();
	this.vertexColors = color instanceof Array ? color : [];

	this.vertexTangents = [];

	this.materialIndex = materialIndex;

	this.centroid = new THREE.Vector3();

};

THREE.Face4.prototype = {

	constructor: THREE.Face4,

	clone: function () {

		var face = new THREE.Face4( this.a, this.b, this.c, this.d );

		face.normal.copy( this.normal );
		face.color.copy( this.color );
		face.centroid.copy( this.centroid );

		face.materialIndex = this.materialIndex;

		var i, il;
		for ( i = 0, il = this.vertexNormals.length; i < il; i ++ ) face.vertexNormals[ i ] = this.vertexNormals[ i ].clone();
		for ( i = 0, il = this.vertexColors.length; i < il; i ++ ) face.vertexColors[ i ] = this.vertexColors[ i ].clone();
		for ( i = 0, il = this.vertexTangents.length; i < il; i ++ ) face.vertexTangents[ i ] = this.vertexTangents[ i ].clone();

		return face;

	}

};
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.UV = function ( u, v ) {

	this.u = u || 0;
	this.v = v || 0;

};

THREE.UV.prototype = {

	constructor: THREE.UV,

	set: function ( u, v ) {

		this.u = u;
		this.v = v;

		return this;

	},

	copy: function ( uv ) {

		this.u = uv.u;
		this.v = uv.v;

		return this;

	},

	lerpSelf: function ( uv, alpha ) {

		this.u += ( uv.u - this.u ) * alpha;
		this.v += ( uv.v - this.v ) * alpha;

		return this;

	},

	clone: function () {

		return new THREE.UV( this.u, this.v );

	}

};
/**
 * @author mr.doob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 */

THREE.Camera = function () {

	THREE.Object3D.call( this );

	this.matrixWorldInverse = new THREE.Matrix4();

	this.projectionMatrix = new THREE.Matrix4();
	this.projectionMatrixInverse = new THREE.Matrix4();

};

THREE.Camera.prototype = new THREE.Object3D();
THREE.Camera.prototype.constructor = THREE.Camera;

THREE.Camera.prototype.lookAt = function ( vector ) {

	// TODO: Add hierarchy support.

	this.matrix.lookAt( this.position, vector, this.up );

	if ( this.rotationAutoUpdate ) {

		this.rotation.getRotationFromMatrix( this.matrix );

	}

};
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.OrthographicCamera = function ( left, right, top, bottom, near, far ) {

	THREE.Camera.call( this );

	this.left = left;
	this.right = right;
	this.top = top;
	this.bottom = bottom;

	this.near = ( near !== undefined ) ? near : 0.1;
	this.far = ( far !== undefined ) ? far : 2000;

	this.updateProjectionMatrix();

};

THREE.OrthographicCamera.prototype = new THREE.Camera();
THREE.OrthographicCamera.prototype.constructor = THREE.OrthographicCamera;

THREE.OrthographicCamera.prototype.updateProjectionMatrix = function () {

	this.projectionMatrix.makeOrthographic( this.left, this.right, this.top, this.bottom, this.near, this.far );

};
/**
 * @author mr.doob / http://mrdoob.com/
 * @author greggman / http://games.greggman.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */

THREE.PerspectiveCamera = function ( fov, aspect, near, far ) {

	THREE.Camera.call( this );

	this.fov = fov !== undefined ? fov : 50;
	this.aspect = aspect !== undefined ? aspect : 1;
	this.near = near !== undefined ? near : 0.1;
	this.far = far !== undefined ? far : 2000;

	this.updateProjectionMatrix();

};

THREE.PerspectiveCamera.prototype = new THREE.Camera();
THREE.PerspectiveCamera.prototype.constructor = THREE.PerspectiveCamera;


/**
 * Uses Focal Length (in mm) to estimate and set FOV
 * 35mm (fullframe) camera is used if frame size is not specified;
 * Formula based on http://www.bobatkins.com/photography/technical/field_of_view.html
 */

THREE.PerspectiveCamera.prototype.setLens = function ( focalLength, frameHeight ) {

	frameHeight = frameHeight !== undefined ? frameHeight : 24;

	this.fov = 2 * Math.atan( frameHeight / ( focalLength * 2 ) ) * ( 180 / Math.PI );
	this.updateProjectionMatrix();

}


/**
 * Sets an offset in a larger frustum. This is useful for multi-window or
 * multi-monitor/multi-machine setups.
 *
 * For example, if you have 3x2 monitors and each monitor is 1920x1080 and
 * the monitors are in grid like this
 *
 *   +---+---+---+
 *   | A | B | C |
 *   +---+---+---+
 *   | D | E | F |
 *   +---+---+---+
 *
 * then for each monitor you would call it like this
 *
 *   var w = 1920;
 *   var h = 1080;
 *   var fullWidth = w * 3;
 *   var fullHeight = h * 2;
 *
 *   --A--
 *   camera.setOffset( fullWidth, fullHeight, w * 0, h * 0, w, h );
 *   --B--
 *   camera.setOffset( fullWidth, fullHeight, w * 1, h * 0, w, h );
 *   --C--
 *   camera.setOffset( fullWidth, fullHeight, w * 2, h * 0, w, h );
 *   --D--
 *   camera.setOffset( fullWidth, fullHeight, w * 0, h * 1, w, h );
 *   --E--
 *   camera.setOffset( fullWidth, fullHeight, w * 1, h * 1, w, h );
 *   --F--
 *   camera.setOffset( fullWidth, fullHeight, w * 2, h * 1, w, h );
 *
 *   Note there is no reason monitors have to be the same size or in a grid.
 */

THREE.PerspectiveCamera.prototype.setViewOffset = function ( fullWidth, fullHeight, x, y, width, height ) {

	this.fullWidth = fullWidth;
	this.fullHeight = fullHeight;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.updateProjectionMatrix();

};


THREE.PerspectiveCamera.prototype.updateProjectionMatrix = function () {

	if ( this.fullWidth ) {

		var aspect = this.fullWidth / this.fullHeight;
		var top = Math.tan( this.fov * Math.PI / 360 ) * this.near;
		var bottom = -top;
		var left = aspect * bottom;
		var right = aspect * top;
		var width = Math.abs( right - left );
		var height = Math.abs( top - bottom );

		this.projectionMatrix.makeFrustum(
			left + this.x * width / this.fullWidth,
			left + ( this.x + this.width ) * width / this.fullWidth,
			top - ( this.y + this.height ) * height / this.fullHeight,
			top - this.y * height / this.fullHeight,
			this.near,
			this.far
		);

	} else {

		this.projectionMatrix.makePerspective( this.fov, this.aspect, this.near, this.far );

	}

};
/**
 * @author mr.doob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */
 
THREE.Light = function ( hex ) {

	THREE.Object3D.call( this );

	this.color = new THREE.Color( hex );

};

THREE.Light.prototype = new THREE.Object3D();
THREE.Light.prototype.constructor = THREE.Light;
THREE.Light.prototype.supr = THREE.Object3D.prototype;
/**
 * @author mr.doob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Material = function ( parameters ) {

	parameters = parameters || {};

	this.id = THREE.MaterialCount ++;

	this.name = '';

	this.opacity = parameters.opacity !== undefined ? parameters.opacity : 1;
	this.transparent = parameters.transparent !== undefined ? parameters.transparent : false;

	this.blending = parameters.blending !== undefined ? parameters.blending : THREE.NormalBlending;

	this.blendSrc = parameters.blendSrc !== undefined ? parameters.blendSrc : THREE.SrcAlphaFactor;
	this.blendDst = parameters.blendDst !== undefined ? parameters.blendDst : THREE.OneMinusSrcAlphaFactor;
	this.blendEquation = parameters.blendEquation !== undefined ? parameters.blendEquation : THREE.AddEquation;

	this.depthTest = parameters.depthTest !== undefined ? parameters.depthTest : true;
	this.depthWrite = parameters.depthWrite !== undefined ? parameters.depthWrite : true;

	this.polygonOffset = parameters.polygonOffset !== undefined ? parameters.polygonOffset : false;
	this.polygonOffsetFactor = parameters.polygonOffsetFactor !== undefined ? parameters.polygonOffsetFactor : 0;
	this.polygonOffsetUnits = parameters.polygonOffsetUnits !== undefined ? parameters.polygonOffsetUnits : 0;

	this.alphaTest = parameters.alphaTest !== undefined ? parameters.alphaTest : 0;

	this.overdraw = parameters.overdraw !== undefined ? parameters.overdraw : false; // Boolean for fixing antialiasing gaps in CanvasRenderer

	this.needsUpdate = true;

}

THREE.MaterialCount = 0;

// shading

THREE.NoShading = 0;
THREE.FlatShading = 1;
THREE.SmoothShading = 2;

// colors

THREE.NoColors = 0;
THREE.FaceColors = 1;
THREE.VertexColors = 2;

// blending modes

THREE.NoBlending = 0;
THREE.NormalBlending = 1;
THREE.AdditiveBlending = 2;
THREE.SubtractiveBlending = 3;
THREE.MultiplyBlending = 4;
THREE.AdditiveAlphaBlending = 5;
THREE.CustomBlending = 6;

// custom blending equations
// (numbers start from 100 not to clash with other
//  mappings to OpenGL constants defined in Texture.js)

THREE.AddEquation = 100;
THREE.SubtractEquation = 101;
THREE.ReverseSubtractEquation = 102;

// custom blending destination factors

THREE.ZeroFactor = 200;
THREE.OneFactor = 201;
THREE.SrcColorFactor = 202;
THREE.OneMinusSrcColorFactor = 203;
THREE.SrcAlphaFactor = 204;
THREE.OneMinusSrcAlphaFactor = 205;
THREE.DstAlphaFactor = 206;
THREE.OneMinusDstAlphaFactor = 207;

// custom blending source factors

//THREE.ZeroFactor = 200;
//THREE.OneFactor = 201;
//THREE.SrcAlphaFactor = 204;
//THREE.OneMinusSrcAlphaFactor = 205;
//THREE.DstAlphaFactor = 206;
//THREE.OneMinusDstAlphaFactor = 207;
THREE.DstColorFactor = 208;
THREE.OneMinusDstColorFactor = 209;
THREE.SrcAlphaSaturateFactor = 210;

/**
 * @author mr.doob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *
 *  linewidth: <float>,
 *  linecap: "round",
 *  linejoin: "round",
 *
 *  vertexColors: <bool>
 *
 *  fog: <bool>
 * }
 */

THREE.LineBasicMaterial = function ( parameters ) {

	THREE.Material.call( this, parameters );

	parameters = parameters || {};

	this.color = parameters.color !== undefined ? new THREE.Color( parameters.color ) : new THREE.Color( 0xffffff );

	this.linewidth = parameters.linewidth !== undefined ? parameters.linewidth : 1;
	this.linecap = parameters.linecap !== undefined ? parameters.linecap : 'round';
	this.linejoin = parameters.linejoin !== undefined ? parameters.linejoin : 'round';

	this.vertexColors = parameters.vertexColors ? parameters.vertexColors : false;

	this.fog = parameters.fog !== undefined ? parameters.fog : true;

};

THREE.LineBasicMaterial.prototype = new THREE.Material();
THREE.LineBasicMaterial.prototype.constructor = THREE.LineBasicMaterial;
/**
 * @author mr.doob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *  map: new THREE.Texture( <Image> ),
 *
 *  lightMap: new THREE.Texture( <Image> ),
 *
 *  envMap: new THREE.TextureCube( [posx, negx, posy, negy, posz, negz] ),
 *  combine: THREE.Multiply,
 *  reflectivity: <float>,
 *  refractionRatio: <float>,
 *
 *  shading: THREE.SmoothShading,
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  vertexColors: THREE.NoColors / THREE.VertexColors / THREE.FaceColors,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *
 *	fog: <bool>
 * }
 */

THREE.MeshBasicMaterial = function ( parameters ) {

	THREE.Material.call( this, parameters );

	parameters = parameters || {};

	// color property represents emissive for MeshBasicMaterial

	this.color = parameters.color !== undefined ? new THREE.Color( parameters.color ) : new THREE.Color( 0xffffff );

	this.map = parameters.map !== undefined ? parameters.map : null;

	this.lightMap = parameters.lightMap !== undefined ? parameters.lightMap : null;

	this.envMap = parameters.envMap !== undefined ? parameters.envMap : null;
	this.combine = parameters.combine !== undefined ? parameters.combine : THREE.MultiplyOperation;
	this.reflectivity = parameters.reflectivity !== undefined ? parameters.reflectivity : 1;
	this.refractionRatio = parameters.refractionRatio !== undefined ? parameters.refractionRatio : 0.98;

	this.fog = parameters.fog !== undefined ? parameters.fog : true;

	this.shading = parameters.shading !== undefined ? parameters.shading : THREE.SmoothShading;

	this.wireframe = parameters.wireframe !== undefined ? parameters.wireframe : false;
	this.wireframeLinewidth = parameters.wireframeLinewidth !== undefined ? parameters.wireframeLinewidth : 1;
	this.wireframeLinecap = parameters.wireframeLinecap !== undefined ? parameters.wireframeLinecap : 'round';
	this.wireframeLinejoin = parameters.wireframeLinejoin !== undefined ? parameters.wireframeLinejoin : 'round';

	this.vertexColors = parameters.vertexColors !== undefined ? parameters.vertexColors : THREE.NoColors;

	this.skinning = parameters.skinning !== undefined ? parameters.skinning : false;
	this.morphTargets = parameters.morphTargets !== undefined ? parameters.morphTargets : false;

};

THREE.MeshBasicMaterial.prototype = new THREE.Material();
THREE.MeshBasicMaterial.prototype.constructor = THREE.MeshBasicMaterial;
/**
 * @author mr.doob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *  map: new THREE.Texture( <Image> ),
 *
 *  size: <float>,
 *
 *  blending: THREE.NormalBlending,
 *  depthTest: <bool>,
 *
 *  vertexColors: <bool>,
 *
 *  fog: <bool>
 * }
 */

THREE.ParticleBasicMaterial = function ( parameters ) {

	THREE.Material.call( this, parameters );

	parameters = parameters || {};

	this.color = parameters.color !== undefined ? new THREE.Color( parameters.color ) : new THREE.Color( 0xffffff );

	this.map = parameters.map !== undefined ? parameters.map : null;

	this.size = parameters.size !== undefined ? parameters.size : 1;
	this.sizeAttenuation = parameters.sizeAttenuation !== undefined ? parameters.sizeAttenuation : true;

	this.vertexColors = parameters.vertexColors !== undefined ? parameters.vertexColors : false;

	this.fog = parameters.fog !== undefined ? parameters.fog : true;

};

THREE.ParticleBasicMaterial.prototype = new THREE.Material();
THREE.ParticleBasicMaterial.prototype.constructor = THREE.ParticleBasicMaterial;
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.ParticleDOMMaterial = function ( domElement ) {

	THREE.Material.call( this );

	this.domElement = domElement;

};
/**
 * @author mr.doob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author szimek / https://github.com/szimek/
 */

THREE.Texture = function ( image, mapping, wrapS, wrapT, magFilter, minFilter, format, type ) {

	this.id = THREE.TextureCount ++;

	this.image = image;

	this.mapping = mapping !== undefined ? mapping : new THREE.UVMapping();

	this.wrapS = wrapS !== undefined ? wrapS : THREE.ClampToEdgeWrapping;
	this.wrapT = wrapT !== undefined ? wrapT : THREE.ClampToEdgeWrapping;

	this.magFilter = magFilter !== undefined ? magFilter : THREE.LinearFilter;
	this.minFilter = minFilter !== undefined ? minFilter : THREE.LinearMipMapLinearFilter;

	this.format = format !== undefined ? format : THREE.RGBAFormat;
	this.type = type !== undefined ? type : THREE.UnsignedByteType;

	this.offset = new THREE.Vector2( 0, 0 );
	this.repeat = new THREE.Vector2( 1, 1 );

	this.generateMipmaps = true;
	this.premultiplyAlpha = false;

	this.needsUpdate = false;
	this.onUpdate = null;

};

THREE.Texture.prototype = {

	constructor: THREE.Texture,

	clone: function () {

		var clonedTexture = new THREE.Texture( this.image, this.mapping, this.wrapS, this.wrapT, this.magFilter, this.minFilter, this.format, this.type );

		clonedTexture.offset.copy( this.offset );
		clonedTexture.repeat.copy( this.repeat );

		return clonedTexture;

	}

};

THREE.TextureCount = 0;

THREE.MultiplyOperation = 0;
THREE.MixOperation = 1;

// Mapping modes

THREE.UVMapping = function () {};

THREE.CubeReflectionMapping = function () {};
THREE.CubeRefractionMapping = function () {};

THREE.SphericalReflectionMapping = function () {};
THREE.SphericalRefractionMapping = function () {};

// Wrapping modes

THREE.RepeatWrapping = 0;
THREE.ClampToEdgeWrapping = 1;
THREE.MirroredRepeatWrapping = 2;

// Filters

THREE.NearestFilter = 3;
THREE.NearestMipMapNearestFilter = 4;
THREE.NearestMipMapLinearFilter = 5;
THREE.LinearFilter = 6;
THREE.LinearMipMapNearestFilter = 7;
THREE.LinearMipMapLinearFilter = 8;

// Types

THREE.ByteType = 9;
THREE.UnsignedByteType = 10;
THREE.ShortType = 11;
THREE.UnsignedShortType = 12;
THREE.IntType = 13;
THREE.UnsignedIntType = 14;
THREE.FloatType = 15;

// Formats

THREE.AlphaFormat = 16;
THREE.RGBFormat = 17;
THREE.RGBAFormat = 18;
THREE.LuminanceFormat = 19;
THREE.LuminanceAlphaFormat = 20;
/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.DataTexture = function ( data, width, height, format, type, mapping, wrapS, wrapT, magFilter, minFilter ) {

	THREE.Texture.call( this, null, mapping, wrapS, wrapT, magFilter, minFilter, format, type );

	this.image = { data: data, width: width, height: height };

};

THREE.DataTexture.prototype = new THREE.Texture();
THREE.DataTexture.prototype.constructor = THREE.DataTexture;

THREE.DataTexture.prototype.clone = function () {

	var clonedTexture = new THREE.DataTexture( this.image.data,  this.image.width, this.image.height, this.format, this.type, this.mapping, this.wrapS, this.wrapT, this.magFilter, this.minFilter );

	clonedTexture.offset.copy( this.offset );
	clonedTexture.repeat.copy( this.repeat );

	return clonedTexture;

};
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.Particle = function ( material ) {

	THREE.Object3D.call( this );

	this.material = material;

};

THREE.Particle.prototype = new THREE.Object3D();
THREE.Particle.prototype.constructor = THREE.Particle;
/**
 * @author mr.doob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 */

THREE.Mesh = function ( geometry, material ) {

	THREE.Object3D.call( this );

	this.geometry = geometry;
	this.material = ( material !== undefined ) ? material : new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, wireframe: true } );

	if ( this.geometry ) {

		// calc bound radius

		if( ! this.geometry.boundingSphere ) {

			this.geometry.computeBoundingSphere();

		}

		this.boundRadius = geometry.boundingSphere.radius;


		// setup morph targets

		if( this.geometry.morphTargets.length ) {

			this.morphTargetBase = -1;
			this.morphTargetForcedOrder = [];
			this.morphTargetInfluences = [];
			this.morphTargetDictionary = {};

			for( var m = 0; m < this.geometry.morphTargets.length; m ++ ) {

				this.morphTargetInfluences.push( 0 );
				this.morphTargetDictionary[ this.geometry.morphTargets[ m ].name ] = m;

			}

		}

	}

}

THREE.Mesh.prototype = new THREE.Object3D();
THREE.Mesh.prototype.constructor = THREE.Mesh;
THREE.Mesh.prototype.supr = THREE.Object3D.prototype;


/*
 * Get Morph Target Index by Name
 */

THREE.Mesh.prototype.getMorphTargetIndexByName = function( name ) {

	if ( this.morphTargetDictionary[ name ] !== undefined ) {

		return this.morphTargetDictionary[ name ];
	}

	console.log( "THREE.Mesh.getMorphTargetIndexByName: morph target " + name + " does not exist. Returning 0." );
	return 0;

}
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.Line = function ( geometry, material, type ) {

	THREE.Object3D.call( this );

	this.geometry = geometry;
	this.material = ( material !== undefined ) ? material : new THREE.LineBasicMaterial( { color: Math.random() * 0xffffff } );
	this.type = ( type !== undefined ) ? type : THREE.LineStrip;

	if ( this.geometry ) {

		if ( ! this.geometry.boundingSphere ) {

			this.geometry.computeBoundingSphere();

		}

	}

};

THREE.LineStrip = 0;
THREE.LinePieces = 1;

THREE.Line.prototype = new THREE.Object3D();
THREE.Line.prototype.constructor = THREE.Line;
/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Bone = function( belongsToSkin ) {

	THREE.Object3D.call( this );

	this.skin = belongsToSkin;
	this.skinMatrix = new THREE.Matrix4();

};

THREE.Bone.prototype = new THREE.Object3D();
THREE.Bone.prototype.constructor = THREE.Bone;
THREE.Bone.prototype.supr = THREE.Object3D.prototype;


THREE.Bone.prototype.update = function( parentSkinMatrix, forceUpdate ) {

	// update local

	if ( this.matrixAutoUpdate ) {

		forceUpdate |= this.updateMatrix();

	}

	// update skin matrix

	if ( forceUpdate || this.matrixWorldNeedsUpdate ) {

		if( parentSkinMatrix ) {

			this.skinMatrix.multiply( parentSkinMatrix, this.matrix );

		} else {

			this.skinMatrix.copy( this.matrix );

		}

		this.matrixWorldNeedsUpdate = false;
		forceUpdate = true;

	}

	// update children

	var child, i, l = this.children.length;

	for ( i = 0; i < l; i ++ ) {

		this.children[ i ].update( this.skinMatrix, forceUpdate );

	}

};

/**
 * @author mikael emtinger / http://gomo.se/
 */

THREE.Sprite = function ( parameters ) {

	THREE.Object3D.call( this );

	this.color = ( parameters.color !== undefined ) ? new THREE.Color( parameters.color ) : new THREE.Color( 0xffffff );
	this.map = ( parameters.map !== undefined ) ? parameters.map : new THREE.Texture();

	this.blending = ( parameters.blending !== undefined ) ? parameters.blending : THREE.NormalBlending;

	this.blendSrc = parameters.blendSrc !== undefined ? parameters.blendSrc : THREE.SrcAlphaFactor;
	this.blendDst = parameters.blendDst !== undefined ? parameters.blendDst : THREE.OneMinusSrcAlphaFactor;
	this.blendEquation = parameters.blendEquation !== undefined ? parameters.blendEquation : THREE.AddEquation;

	this.useScreenCoordinates = ( parameters.useScreenCoordinates !== undefined ) ? parameters.useScreenCoordinates : true;
	this.mergeWith3D = ( parameters.mergeWith3D !== undefined ) ? parameters.mergeWith3D : !this.useScreenCoordinates;
	this.affectedByDistance = ( parameters.affectedByDistance !== undefined ) ? parameters.affectedByDistance : !this.useScreenCoordinates;
	this.scaleByViewport = ( parameters.scaleByViewport !== undefined ) ? parameters.scaleByViewport : !this.affectedByDistance;
	this.alignment = ( parameters.alignment instanceof THREE.Vector2 ) ? parameters.alignment : THREE.SpriteAlignment.center;

	this.rotation3d = this.rotation;
	this.rotation = 0;
	this.opacity = 1;

	this.uvOffset = new THREE.Vector2( 0, 0 );
	this.uvScale  = new THREE.Vector2( 1, 1 );

};

THREE.Sprite.prototype = new THREE.Object3D();
THREE.Sprite.prototype.constructor = THREE.Sprite;


/*
 * Custom update matrix
 */

THREE.Sprite.prototype.updateMatrix = function () {

	this.matrix.setPosition( this.position );

	this.rotation3d.set( 0, 0, this.rotation );
	this.matrix.setRotationFromEuler( this.rotation3d );

	if ( this.scale.x !== 1 || this.scale.y !== 1 ) {

		this.matrix.scale( this.scale );
		this.boundRadiusScale = Math.max( this.scale.x, this.scale.y );

	}

	this.matrixWorldNeedsUpdate = true;

};

/*
 * Alignment
 */

THREE.SpriteAlignment = {};
THREE.SpriteAlignment.topLeft = new THREE.Vector2( 1, -1 );
THREE.SpriteAlignment.topCenter = new THREE.Vector2( 0, -1 );
THREE.SpriteAlignment.topRight = new THREE.Vector2( -1, -1 );
THREE.SpriteAlignment.centerLeft = new THREE.Vector2( 1, 0 );
THREE.SpriteAlignment.center = new THREE.Vector2( 0, 0 );
THREE.SpriteAlignment.centerRight = new THREE.Vector2( -1, 0 );
THREE.SpriteAlignment.bottomLeft = new THREE.Vector2( 1, 1 );
THREE.SpriteAlignment.bottomCenter = new THREE.Vector2( 0, 1 );
THREE.SpriteAlignment.bottomRight = new THREE.Vector2( -1, 1 );
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.Scene = function () {

	THREE.Object3D.call( this );

	this.fog = null;
	this.overrideMaterial = null;

	this.matrixAutoUpdate = false;

	this.__objects = [];
	this.__lights = [];

	this.__objectsAdded = [];
	this.__objectsRemoved = [];

};

THREE.Scene.prototype = new THREE.Object3D();
THREE.Scene.prototype.constructor = THREE.Scene;

THREE.Scene.prototype.__addObject = function ( object ) {

	if ( object instanceof THREE.Light ) {

		if ( this.__lights.indexOf( object ) === - 1 ) {

			this.__lights.push( object );

		}

	} else if ( !( object instanceof THREE.Camera || object instanceof THREE.Bone ) ) {

		if ( this.__objects.indexOf( object ) === - 1 ) {

			this.__objects.push( object );
			this.__objectsAdded.push( object );

			// check if previously removed

			var i = this.__objectsRemoved.indexOf( object );

			if ( i !== -1 ) {

				this.__objectsRemoved.splice( i, 1 );

			}

		}

	}

	for ( var c = 0; c < object.children.length; c ++ ) {

		this.__addObject( object.children[ c ] );

	}

};

THREE.Scene.prototype.__removeObject = function ( object ) {

	if ( object instanceof THREE.Light ) {

		var i = this.__lights.indexOf( object );

		if ( i !== -1 ) {

			this.__lights.splice( i, 1 );

		}

	} else if ( !( object instanceof THREE.Camera ) ) {

		var i = this.__objects.indexOf( object );

		if( i !== -1 ) {

			this.__objects.splice( i, 1 );
			this.__objectsRemoved.push( object );

			// check if previously added

			var ai = this.__objectsAdded.indexOf( object );

			if ( ai !== -1 ) {

				this.__objectsAdded.splice( ai, 1 );

			}

		}

	}

	for ( var c = 0; c < object.children.length; c ++ ) {

		this.__removeObject( object.children[ c ] );

	}

};
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.DOMRenderer = function () {

	var _renderData, _elements,
	_width, _height, _widthHalf, _heightHalf, _transformProp,
	_projector = new THREE.Projector();

	var getSupportedProp = function ( proparray ) {

		var root = document.documentElement

		for ( var i = 0; i < proparray.length; i ++ ) {

			if ( typeof root.style[ proparray[ i ] ] === "string" ) {

				return proparray[i];

			}

		}

		return null;

	};

	_transformProp = getSupportedProp( [ 'transform', 'MozTransform', 'WebkitTransform', 'msTransform', 'OTransform' ] );

	this.domElement = document.createElement( 'div' );

	this.setSize = function ( width, height ) {

		_width = width;
		_height = height;

		_widthHalf = _width / 2;
		_heightHalf = _height / 2;

	};

	this.render = function ( scene, camera ) {

		var e, el, m, ml, element, material, dom, v1x, v1y;

		_renderData = _projector.projectScene( scene, camera );
		_elements = _renderData.elements;

		for ( e = 0, el = _elements.length; e < el; e ++ ) {

			element = _elements[ e ];

			if ( element instanceof THREE.RenderableParticle && element.material instanceof THREE.ParticleDOMMaterial ) {

				dom = element.material.domElement;

				v1x = element.x * _widthHalf + _widthHalf - ( dom.offsetWidth >> 1 );
				v1y = element.y * _heightHalf + _heightHalf - ( dom.offsetHeight >> 1 );

				dom.style.left = v1x + 'px';
				dom.style.top = v1y + 'px';
				dom.style.zIndex = Math.abs( Math.floor( ( 1 - element.z ) * camera.far / camera.near ) )

				if ( _transformProp ) {

					var scaleX = element.scale.x * _widthHalf;
					var scaleY = element.scale.y * _heightHalf;
					var scaleVal = "scale(" + scaleX + "," + scaleY + ")";

					dom.style[ _transformProp ] = scaleVal;

				}

			}

		}

	};

};
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.RenderableParticle = function () {

	this.x = null;
	this.y = null;
	this.z = null;

	this.rotation = null;
	this.scale = new THREE.Vector2();

	this.material = null;

};
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.RenderableVertex = function () {

	this.positionWorld = new THREE.Vector3();
	this.positionScreen = new THREE.Vector4();

	this.visible = true;

};

THREE.RenderableVertex.prototype.copy = function ( vertex ) {

	this.positionWorld.copy( vertex.positionWorld );
	this.positionScreen.copy( vertex.positionScreen );

}
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.RenderableFace3 = function () {

	this.v1 = new THREE.RenderableVertex();
	this.v2 = new THREE.RenderableVertex();
	this.v3 = new THREE.RenderableVertex();

	this.centroidWorld = new THREE.Vector3();
	this.centroidScreen = new THREE.Vector3();

	this.normalWorld = new THREE.Vector3();
	this.vertexNormalsWorld = [ new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3() ];

	this.material = null;
	this.faceMaterial = null;
	this.uvs = [[]];

	this.z = null;

};
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.RenderableFace4 = function () {

	this.v1 = new THREE.RenderableVertex();
	this.v2 = new THREE.RenderableVertex();
	this.v3 = new THREE.RenderableVertex();
	this.v4 = new THREE.RenderableVertex();

	this.centroidWorld = new THREE.Vector3();
	this.centroidScreen = new THREE.Vector3();

	this.normalWorld = new THREE.Vector3();
	this.vertexNormalsWorld = [ new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3() ];

	this.material = null;
	this.faceMaterial = null;
	this.uvs = [[]];

	this.z = null;

};
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.RenderableObject = function () {

	this.object = null;
	this.z = null;

};
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.RenderableParticle = function () {

	this.x = null;
	this.y = null;
	this.z = null;

	this.rotation = null;
	this.scale = new THREE.Vector2();

	this.material = null;

};
/**
 * @author mr.doob / http://mrdoob.com/
 */

THREE.RenderableLine = function () {

	this.z = null;

	this.v1 = new THREE.RenderableVertex();
	this.v2 = new THREE.RenderableVertex();

	this.material = null;

};
=======
// ThreeDOM.js - http://github.com/mrdoob/three.js
'use strict';var THREE=THREE||{REVISION:"49dev"};self.Int32Array||(self.Int32Array=Array,self.Float32Array=Array);
(function(){for(var a=0,b=["ms","moz","webkit","o"],c=0;c<b.length&&!window.requestAnimationFrame;++c){window.requestAnimationFrame=window[b[c]+"RequestAnimationFrame"];window.cancelAnimationFrame=window[b[c]+"CancelAnimationFrame"]||window[b[c]+"CancelRequestAnimationFrame"]}if(!window.requestAnimationFrame)window.requestAnimationFrame=function(b){var c=Date.now(),f=Math.max(0,16-(c-a)),g=window.setTimeout(function(){b(c+f)},f);a=c+f;return g};if(!window.cancelAnimationFrame)window.cancelAnimationFrame=
function(a){clearTimeout(a)}})();THREE.Color=function(a){a!==void 0&&this.setHex(a);return this};
THREE.Color.prototype={constructor:THREE.Color,r:1,g:1,b:1,copy:function(a){this.r=a.r;this.g=a.g;this.b=a.b;return this},copyGammaToLinear:function(a){this.r=a.r*a.r;this.g=a.g*a.g;this.b=a.b*a.b;return this},copyLinearToGamma:function(a){this.r=Math.sqrt(a.r);this.g=Math.sqrt(a.g);this.b=Math.sqrt(a.b);return this},convertGammaToLinear:function(){var a=this.r,b=this.g,c=this.b;this.r=a*a;this.g=b*b;this.b=c*c;return this},convertLinearToGamma:function(){this.r=Math.sqrt(this.r);this.g=Math.sqrt(this.g);
this.b=Math.sqrt(this.b);return this},setRGB:function(a,b,c){this.r=a;this.g=b;this.b=c;return this},setHSV:function(a,b,c){var d,e,f;if(c===0)this.r=this.g=this.b=0;else{d=Math.floor(a*6);e=a*6-d;a=c*(1-b);f=c*(1-b*e);b=c*(1-b*(1-e));switch(d){case 1:this.r=f;this.g=c;this.b=a;break;case 2:this.r=a;this.g=c;this.b=b;break;case 3:this.r=a;this.g=f;this.b=c;break;case 4:this.r=b;this.g=a;this.b=c;break;case 5:this.r=c;this.g=a;this.b=f;break;case 6:case 0:this.r=c;this.g=b;this.b=a}}return this},setHex:function(a){a=
Math.floor(a);this.r=(a>>16&255)/255;this.g=(a>>8&255)/255;this.b=(a&255)/255;return this},lerpSelf:function(a,b){this.r=this.r+(a.r-this.r)*b;this.g=this.g+(a.g-this.g)*b;this.b=this.b+(a.b-this.b)*b;return this},getHex:function(){return Math.floor(this.r*255)<<16^Math.floor(this.g*255)<<8^Math.floor(this.b*255)},getContextStyle:function(){return"rgb("+Math.floor(this.r*255)+","+Math.floor(this.g*255)+","+Math.floor(this.b*255)+")"},clone:function(){return(new THREE.Color).setRGB(this.r,this.g,this.b)}};
THREE.Vector2=function(a,b){this.x=a||0;this.y=b||0};
THREE.Vector2.prototype={constructor:THREE.Vector2,set:function(a,b){this.x=a;this.y=b;return this},copy:function(a){this.x=a.x;this.y=a.y;return this},add:function(a,b){this.x=a.x+b.x;this.y=a.y+b.y;return this},addSelf:function(a){this.x=this.x+a.x;this.y=this.y+a.y;return this},sub:function(a,b){this.x=a.x-b.x;this.y=a.y-b.y;return this},subSelf:function(a){this.x=this.x-a.x;this.y=this.y-a.y;return this},multiplyScalar:function(a){this.x=this.x*a;this.y=this.y*a;return this},divideScalar:function(a){if(a){this.x=
this.x/a;this.y=this.y/a}else this.set(0,0);return this},negate:function(){return this.multiplyScalar(-1)},dot:function(a){return this.x*a.x+this.y*a.y},lengthSq:function(){return this.x*this.x+this.y*this.y},length:function(){return Math.sqrt(this.lengthSq())},normalize:function(){return this.divideScalar(this.length())},distanceTo:function(a){return Math.sqrt(this.distanceToSquared(a))},distanceToSquared:function(a){var b=this.x-a.x,a=this.y-a.y;return b*b+a*a},setLength:function(a){return this.normalize().multiplyScalar(a)},
lerpSelf:function(a,b){this.x=this.x+(a.x-this.x)*b;this.y=this.y+(a.y-this.y)*b;return this},equals:function(a){return a.x===this.x&&a.y===this.y},isZero:function(){return this.lengthSq()<1.0E-4},clone:function(){return new THREE.Vector2(this.x,this.y)}};THREE.Vector3=function(a,b,c){this.x=a||0;this.y=b||0;this.z=c||0};
THREE.Vector3.prototype={constructor:THREE.Vector3,set:function(a,b,c){this.x=a;this.y=b;this.z=c;return this},setX:function(a){this.x=a;return this},setY:function(a){this.y=a;return this},setZ:function(a){this.z=a;return this},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z;return this},add:function(a,b){this.x=a.x+b.x;this.y=a.y+b.y;this.z=a.z+b.z;return this},addSelf:function(a){this.x=this.x+a.x;this.y=this.y+a.y;this.z=this.z+a.z;return this},addScalar:function(a){this.x=this.x+a;this.y=this.y+
a;this.z=this.z+a;return this},sub:function(a,b){this.x=a.x-b.x;this.y=a.y-b.y;this.z=a.z-b.z;return this},subSelf:function(a){this.x=this.x-a.x;this.y=this.y-a.y;this.z=this.z-a.z;return this},multiply:function(a,b){this.x=a.x*b.x;this.y=a.y*b.y;this.z=a.z*b.z;return this},multiplySelf:function(a){this.x=this.x*a.x;this.y=this.y*a.y;this.z=this.z*a.z;return this},multiplyScalar:function(a){this.x=this.x*a;this.y=this.y*a;this.z=this.z*a;return this},divideSelf:function(a){this.x=this.x/a.x;this.y=
this.y/a.y;this.z=this.z/a.z;return this},divideScalar:function(a){if(a){this.x=this.x/a;this.y=this.y/a;this.z=this.z/a}else this.z=this.y=this.x=0;return this},negate:function(){return this.multiplyScalar(-1)},dot:function(a){return this.x*a.x+this.y*a.y+this.z*a.z},lengthSq:function(){return this.x*this.x+this.y*this.y+this.z*this.z},length:function(){return Math.sqrt(this.lengthSq())},lengthManhattan:function(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)},normalize:function(){return this.divideScalar(this.length())},
setLength:function(a){return this.normalize().multiplyScalar(a)},lerpSelf:function(a,b){this.x=this.x+(a.x-this.x)*b;this.y=this.y+(a.y-this.y)*b;this.z=this.z+(a.z-this.z)*b;return this},cross:function(a,b){this.x=a.y*b.z-a.z*b.y;this.y=a.z*b.x-a.x*b.z;this.z=a.x*b.y-a.y*b.x;return this},crossSelf:function(a){var b=this.x,c=this.y,d=this.z;this.x=c*a.z-d*a.y;this.y=d*a.x-b*a.z;this.z=b*a.y-c*a.x;return this},distanceTo:function(a){return Math.sqrt(this.distanceToSquared(a))},distanceToSquared:function(a){return(new THREE.Vector3).sub(this,
a).lengthSq()},getPositionFromMatrix:function(a){this.x=a.n14;this.y=a.n24;this.z=a.n34;return this},getRotationFromMatrix:function(a,b){var c=b?b.x:1,d=b?b.y:1,e=b?b.z:1,f=a.n11/c,g=a.n12/d,c=a.n21/c,d=a.n22/d,i=a.n23/e,k=a.n33/e;this.y=Math.asin(a.n13/e);e=Math.cos(this.y);if(Math.abs(e)>1.0E-5){this.x=Math.atan2(-i/e,k/e);this.z=Math.atan2(-g/e,f/e)}else{this.x=0;this.z=Math.atan2(c,d)}return this},getScaleFromMatrix:function(a){var b=this.set(a.n11,a.n21,a.n31).length(),c=this.set(a.n12,a.n22,
a.n32).length(),a=this.set(a.n13,a.n23,a.n33).length();this.x=b;this.y=c;this.z=a},equals:function(a){return a.x===this.x&&a.y===this.y&&a.z===this.z},isZero:function(){return this.lengthSq()<1.0E-4},clone:function(){return new THREE.Vector3(this.x,this.y,this.z)}};THREE.Vector4=function(a,b,c,d){this.x=a||0;this.y=b||0;this.z=c||0;this.w=d!==void 0?d:1};
THREE.Vector4.prototype={constructor:THREE.Vector4,set:function(a,b,c,d){this.x=a;this.y=b;this.z=c;this.w=d;return this},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z;this.w=a.w!==void 0?a.w:1;return this},add:function(a,b){this.x=a.x+b.x;this.y=a.y+b.y;this.z=a.z+b.z;this.w=a.w+b.w;return this},addSelf:function(a){this.x=this.x+a.x;this.y=this.y+a.y;this.z=this.z+a.z;this.w=this.w+a.w;return this},sub:function(a,b){this.x=a.x-b.x;this.y=a.y-b.y;this.z=a.z-b.z;this.w=a.w-b.w;return this},subSelf:function(a){this.x=
this.x-a.x;this.y=this.y-a.y;this.z=this.z-a.z;this.w=this.w-a.w;return this},multiplyScalar:function(a){this.x=this.x*a;this.y=this.y*a;this.z=this.z*a;this.w=this.w*a;return this},divideScalar:function(a){if(a){this.x=this.x/a;this.y=this.y/a;this.z=this.z/a;this.w=this.w/a}else{this.z=this.y=this.x=0;this.w=1}return this},negate:function(){return this.multiplyScalar(-1)},dot:function(a){return this.x*a.x+this.y*a.y+this.z*a.z+this.w*a.w},lengthSq:function(){return this.dot(this)},length:function(){return Math.sqrt(this.lengthSq())},
normalize:function(){return this.divideScalar(this.length())},setLength:function(a){return this.normalize().multiplyScalar(a)},lerpSelf:function(a,b){this.x=this.x+(a.x-this.x)*b;this.y=this.y+(a.y-this.y)*b;this.z=this.z+(a.z-this.z)*b;this.w=this.w+(a.w-this.w)*b;return this},clone:function(){return new THREE.Vector4(this.x,this.y,this.z,this.w)}};THREE.Frustum=function(){this.planes=[new THREE.Vector4,new THREE.Vector4,new THREE.Vector4,new THREE.Vector4,new THREE.Vector4,new THREE.Vector4]};
THREE.Frustum.prototype.setFromMatrix=function(a){var b,c=this.planes;c[0].set(a.n41-a.n11,a.n42-a.n12,a.n43-a.n13,a.n44-a.n14);c[1].set(a.n41+a.n11,a.n42+a.n12,a.n43+a.n13,a.n44+a.n14);c[2].set(a.n41+a.n21,a.n42+a.n22,a.n43+a.n23,a.n44+a.n24);c[3].set(a.n41-a.n21,a.n42-a.n22,a.n43-a.n23,a.n44-a.n24);c[4].set(a.n41-a.n31,a.n42-a.n32,a.n43-a.n33,a.n44-a.n34);c[5].set(a.n41+a.n31,a.n42+a.n32,a.n43+a.n33,a.n44+a.n34);for(a=0;a<6;a++){b=c[a];b.divideScalar(Math.sqrt(b.x*b.x+b.y*b.y+b.z*b.z))}};
THREE.Frustum.prototype.contains=function(a){for(var b=this.planes,c=a.matrixWorld,d=THREE.Frustum.__v1.set(c.getColumnX().length(),c.getColumnY().length(),c.getColumnZ().length()),d=-a.geometry.boundingSphere.radius*Math.max(d.x,Math.max(d.y,d.z)),e=0;e<6;e++){a=b[e].x*c.n14+b[e].y*c.n24+b[e].z*c.n34+b[e].w;if(a<=d)return false}return true};THREE.Frustum.__v1=new THREE.Vector3;
THREE.Ray=function(a,b){function c(a,b,c){p.sub(c,a);G=p.dot(b);w=o.add(a,q.copy(b).multiplyScalar(G));return C=c.distanceTo(w)}function d(a,b,c,d){p.sub(d,b);o.sub(c,b);q.sub(a,b);D=p.dot(p);r=p.dot(o);x=p.dot(q);t=o.dot(o);y=o.dot(q);H=1/(D*t-r*r);K=(t*x-r*y)*H;E=(D*y-r*x)*H;return K>=0&&E>=0&&K+E<1}this.origin=a||new THREE.Vector3;this.direction=b||new THREE.Vector3;var e=1.0E-4;this.setPrecision=function(a){e=a};var f=new THREE.Vector3,g=new THREE.Vector3,i=new THREE.Vector3,k=new THREE.Vector3,
h=new THREE.Vector3,j=new THREE.Vector3,l=new THREE.Vector3,n=new THREE.Vector3,m=new THREE.Vector3;this.intersectObject=function(a){var b,o=[];if(a instanceof THREE.Particle){var p=c(this.origin,this.direction,a.matrixWorld.getPosition());if(p>a.scale.x)return[];b={distance:p,point:a.position,face:null,object:a};o.push(b)}else if(a instanceof THREE.Mesh){var p=c(this.origin,this.direction,a.matrixWorld.getPosition()),M=THREE.Frustum.__v1.set(a.matrixWorld.getColumnX().length(),a.matrixWorld.getColumnY().length(),
a.matrixWorld.getColumnZ().length());if(p>a.geometry.boundingSphere.radius*Math.max(M.x,Math.max(M.y,M.z)))return o;var q,r,t=a.geometry,A=t.vertices,u;a.matrixRotationWorld.extractRotation(a.matrixWorld);p=0;for(M=t.faces.length;p<M;p++){b=t.faces[p];h.copy(this.origin);j.copy(this.direction);u=a.matrixWorld;l=u.multiplyVector3(l.copy(b.centroid)).subSelf(h);n=a.matrixRotationWorld.multiplyVector3(n.copy(b.normal));q=j.dot(n);if(!(Math.abs(q)<e)){r=n.dot(l)/q;if(!(r<0)&&(a.doubleSided||(a.flipSided?
q>0:q<0))){m.add(h,j.multiplyScalar(r));if(b instanceof THREE.Face3){f=u.multiplyVector3(f.copy(A[b.a]));g=u.multiplyVector3(g.copy(A[b.b]));i=u.multiplyVector3(i.copy(A[b.c]));if(d(m,f,g,i)){b={distance:h.distanceTo(m),point:m.clone(),face:b,object:a};o.push(b)}}else if(b instanceof THREE.Face4){f=u.multiplyVector3(f.copy(A[b.a]));g=u.multiplyVector3(g.copy(A[b.b]));i=u.multiplyVector3(i.copy(A[b.c]));k=u.multiplyVector3(k.copy(A[b.d]));if(d(m,f,g,k)||d(m,g,i,k)){b={distance:h.distanceTo(m),point:m.clone(),
face:b,object:a};o.push(b)}}}}}}return o};this.intersectObjects=function(a){for(var b=[],c=0,d=a.length;c<d;c++)Array.prototype.push.apply(b,this.intersectObject(a[c]));b.sort(function(a,b){return a.distance-b.distance});return b};var p=new THREE.Vector3,o=new THREE.Vector3,q=new THREE.Vector3,G,w,C,D,r,x,t,y,H,K,E};
THREE.Rectangle=function(){function a(){f=d-b;g=e-c}var b,c,d,e,f,g,i=true;this.getX=function(){return b};this.getY=function(){return c};this.getWidth=function(){return f};this.getHeight=function(){return g};this.getLeft=function(){return b};this.getTop=function(){return c};this.getRight=function(){return d};this.getBottom=function(){return e};this.set=function(f,h,g,l){i=false;b=f;c=h;d=g;e=l;a()};this.addPoint=function(f,h){if(i){i=false;b=f;c=h;d=f;e=h}else{b=b<f?b:f;c=c<h?c:h;d=d>f?d:f;e=e>h?
e:h}a()};this.add3Points=function(f,h,g,l,n,m){if(i){i=false;b=f<g?f<n?f:n:g<n?g:n;c=h<l?h<m?h:m:l<m?l:m;d=f>g?f>n?f:n:g>n?g:n;e=h>l?h>m?h:m:l>m?l:m}else{b=f<g?f<n?f<b?f:b:n<b?n:b:g<n?g<b?g:b:n<b?n:b;c=h<l?h<m?h<c?h:c:m<c?m:c:l<m?l<c?l:c:m<c?m:c;d=f>g?f>n?f>d?f:d:n>d?n:d:g>n?g>d?g:d:n>d?n:d;e=h>l?h>m?h>e?h:e:m>e?m:e:l>m?l>e?l:e:m>e?m:e}a()};this.addRectangle=function(f){if(i){i=false;b=f.getLeft();c=f.getTop();d=f.getRight();e=f.getBottom()}else{b=b<f.getLeft()?b:f.getLeft();c=c<f.getTop()?c:f.getTop();
d=d>f.getRight()?d:f.getRight();e=e>f.getBottom()?e:f.getBottom()}a()};this.inflate=function(f){b=b-f;c=c-f;d=d+f;e=e+f;a()};this.minSelf=function(f){b=b>f.getLeft()?b:f.getLeft();c=c>f.getTop()?c:f.getTop();d=d<f.getRight()?d:f.getRight();e=e<f.getBottom()?e:f.getBottom();a()};this.intersects=function(a){return d<a.getLeft()||b>a.getRight()||e<a.getTop()||c>a.getBottom()?false:true};this.empty=function(){i=true;e=d=c=b=0;a()};this.isEmpty=function(){return i}};
THREE.Math={clamp:function(a,b,c){return a<b?b:a>c?c:a},clampBottom:function(a,b){return a<b?b:a},mapLinear:function(a,b,c,d,e){return d+(a-b)*(e-d)/(c-b)},random16:function(){return(65280*Math.random()+255*Math.random())/65535},randInt:function(a,b){return a+Math.floor(Math.random()*(b-a+1))},randFloat:function(a,b){return a+Math.random()*(b-a)},randFloatSpread:function(a){return a*(0.5-Math.random())},sign:function(a){return a<0?-1:a>0?1:0}};THREE.Matrix3=function(){this.m=[]};
THREE.Matrix3.prototype={constructor:THREE.Matrix3,getInverse:function(a){var b=a.n33*a.n22-a.n32*a.n23,c=-a.n33*a.n21+a.n31*a.n23,d=a.n32*a.n21-a.n31*a.n22,e=-a.n33*a.n12+a.n32*a.n13,f=a.n33*a.n11-a.n31*a.n13,g=-a.n32*a.n11+a.n31*a.n12,i=a.n23*a.n12-a.n22*a.n13,k=-a.n23*a.n11+a.n21*a.n13,h=a.n22*a.n11-a.n21*a.n12,a=a.n11*b+a.n21*e+a.n31*i;a===0&&console.warn("Matrix3.getInverse(): determinant == 0");var a=1/a,j=this.m;j[0]=a*b;j[1]=a*c;j[2]=a*d;j[3]=a*e;j[4]=a*f;j[5]=a*g;j[6]=a*i;j[7]=a*k;j[8]=a*
h;return this},transposeIntoArray:function(a){var b=this.m;a[0]=b[0];a[1]=b[3];a[2]=b[6];a[3]=b[1];a[4]=b[4];a[5]=b[7];a[6]=b[2];a[7]=b[5];a[8]=b[8];return this}};THREE.Matrix4=function(a,b,c,d,e,f,g,i,k,h,j,l,n,m,p,o){this.set(a!==void 0?a:1,b||0,c||0,d||0,e||0,f!==void 0?f:1,g||0,i||0,k||0,h||0,j!==void 0?j:1,l||0,n||0,m||0,p||0,o!==void 0?o:1)};
THREE.Matrix4.prototype={constructor:THREE.Matrix4,set:function(a,b,c,d,e,f,g,i,k,h,j,l,n,m,p,o){this.n11=a;this.n12=b;this.n13=c;this.n14=d;this.n21=e;this.n22=f;this.n23=g;this.n24=i;this.n31=k;this.n32=h;this.n33=j;this.n34=l;this.n41=n;this.n42=m;this.n43=p;this.n44=o;return this},identity:function(){this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);return this},copy:function(a){this.set(a.n11,a.n12,a.n13,a.n14,a.n21,a.n22,a.n23,a.n24,a.n31,a.n32,a.n33,a.n34,a.n41,a.n42,a.n43,a.n44);return this},lookAt:function(a,
b,c){var d=THREE.Matrix4.__v1,e=THREE.Matrix4.__v2,f=THREE.Matrix4.__v3;f.sub(a,b).normalize();if(f.length()===0)f.z=1;d.cross(c,f).normalize();if(d.length()===0){f.x=f.x+1.0E-4;d.cross(c,f).normalize()}e.cross(f,d);this.n11=d.x;this.n12=e.x;this.n13=f.x;this.n21=d.y;this.n22=e.y;this.n23=f.y;this.n31=d.z;this.n32=e.z;this.n33=f.z;return this},multiply:function(a,b){var c=a.n11,d=a.n12,e=a.n13,f=a.n14,g=a.n21,i=a.n22,k=a.n23,h=a.n24,j=a.n31,l=a.n32,n=a.n33,m=a.n34,p=a.n41,o=a.n42,q=a.n43,G=a.n44,
w=b.n11,C=b.n12,D=b.n13,r=b.n14,x=b.n21,t=b.n22,y=b.n23,H=b.n24,K=b.n31,E=b.n32,J=b.n33,Q=b.n34,R=b.n41,S=b.n42,M=b.n43,T=b.n44;this.n11=c*w+d*x+e*K+f*R;this.n12=c*C+d*t+e*E+f*S;this.n13=c*D+d*y+e*J+f*M;this.n14=c*r+d*H+e*Q+f*T;this.n21=g*w+i*x+k*K+h*R;this.n22=g*C+i*t+k*E+h*S;this.n23=g*D+i*y+k*J+h*M;this.n24=g*r+i*H+k*Q+h*T;this.n31=j*w+l*x+n*K+m*R;this.n32=j*C+l*t+n*E+m*S;this.n33=j*D+l*y+n*J+m*M;this.n34=j*r+l*H+n*Q+m*T;this.n41=p*w+o*x+q*K+G*R;this.n42=p*C+o*t+q*E+G*S;this.n43=p*D+o*y+q*J+G*
M;this.n44=p*r+o*H+q*Q+G*T;return this},multiplySelf:function(a){return this.multiply(this,a)},multiplyToArray:function(a,b,c){this.multiply(a,b);c[0]=this.n11;c[1]=this.n21;c[2]=this.n31;c[3]=this.n41;c[4]=this.n12;c[5]=this.n22;c[6]=this.n32;c[7]=this.n42;c[8]=this.n13;c[9]=this.n23;c[10]=this.n33;c[11]=this.n43;c[12]=this.n14;c[13]=this.n24;c[14]=this.n34;c[15]=this.n44;return this},multiplyScalar:function(a){this.n11=this.n11*a;this.n12=this.n12*a;this.n13=this.n13*a;this.n14=this.n14*a;this.n21=
this.n21*a;this.n22=this.n22*a;this.n23=this.n23*a;this.n24=this.n24*a;this.n31=this.n31*a;this.n32=this.n32*a;this.n33=this.n33*a;this.n34=this.n34*a;this.n41=this.n41*a;this.n42=this.n42*a;this.n43=this.n43*a;this.n44=this.n44*a;return this},multiplyVector3:function(a){var b=a.x,c=a.y,d=a.z,e=1/(this.n41*b+this.n42*c+this.n43*d+this.n44);a.x=(this.n11*b+this.n12*c+this.n13*d+this.n14)*e;a.y=(this.n21*b+this.n22*c+this.n23*d+this.n24)*e;a.z=(this.n31*b+this.n32*c+this.n33*d+this.n34)*e;return a},
multiplyVector4:function(a){var b=a.x,c=a.y,d=a.z,e=a.w;a.x=this.n11*b+this.n12*c+this.n13*d+this.n14*e;a.y=this.n21*b+this.n22*c+this.n23*d+this.n24*e;a.z=this.n31*b+this.n32*c+this.n33*d+this.n34*e;a.w=this.n41*b+this.n42*c+this.n43*d+this.n44*e;return a},rotateAxis:function(a){var b=a.x,c=a.y,d=a.z;a.x=b*this.n11+c*this.n12+d*this.n13;a.y=b*this.n21+c*this.n22+d*this.n23;a.z=b*this.n31+c*this.n32+d*this.n33;a.normalize();return a},crossVector:function(a){var b=new THREE.Vector4;b.x=this.n11*a.x+
this.n12*a.y+this.n13*a.z+this.n14*a.w;b.y=this.n21*a.x+this.n22*a.y+this.n23*a.z+this.n24*a.w;b.z=this.n31*a.x+this.n32*a.y+this.n33*a.z+this.n34*a.w;b.w=a.w?this.n41*a.x+this.n42*a.y+this.n43*a.z+this.n44*a.w:1;return b},determinant:function(){var a=this.n11,b=this.n12,c=this.n13,d=this.n14,e=this.n21,f=this.n22,g=this.n23,i=this.n24,k=this.n31,h=this.n32,j=this.n33,l=this.n34,n=this.n41,m=this.n42,p=this.n43,o=this.n44;return d*g*h*n-c*i*h*n-d*f*j*n+b*i*j*n+c*f*l*n-b*g*l*n-d*g*k*m+c*i*k*m+d*e*
j*m-a*i*j*m-c*e*l*m+a*g*l*m+d*f*k*p-b*i*k*p-d*e*h*p+a*i*h*p+b*e*l*p-a*f*l*p-c*f*k*o+b*g*k*o+c*e*h*o-a*g*h*o-b*e*j*o+a*f*j*o},transpose:function(){var a;a=this.n21;this.n21=this.n12;this.n12=a;a=this.n31;this.n31=this.n13;this.n13=a;a=this.n32;this.n32=this.n23;this.n23=a;a=this.n41;this.n41=this.n14;this.n14=a;a=this.n42;this.n42=this.n24;this.n24=a;a=this.n43;this.n43=this.n34;this.n34=a;return this},flattenToArray:function(a){a[0]=this.n11;a[1]=this.n21;a[2]=this.n31;a[3]=this.n41;a[4]=this.n12;
a[5]=this.n22;a[6]=this.n32;a[7]=this.n42;a[8]=this.n13;a[9]=this.n23;a[10]=this.n33;a[11]=this.n43;a[12]=this.n14;a[13]=this.n24;a[14]=this.n34;a[15]=this.n44;return a},flattenToArrayOffset:function(a,b){a[b]=this.n11;a[b+1]=this.n21;a[b+2]=this.n31;a[b+3]=this.n41;a[b+4]=this.n12;a[b+5]=this.n22;a[b+6]=this.n32;a[b+7]=this.n42;a[b+8]=this.n13;a[b+9]=this.n23;a[b+10]=this.n33;a[b+11]=this.n43;a[b+12]=this.n14;a[b+13]=this.n24;a[b+14]=this.n34;a[b+15]=this.n44;return a},getPosition:function(){return THREE.Matrix4.__v1.set(this.n14,
this.n24,this.n34)},setPosition:function(a){this.n14=a.x;this.n24=a.y;this.n34=a.z;return this},getColumnX:function(){return THREE.Matrix4.__v1.set(this.n11,this.n21,this.n31)},getColumnY:function(){return THREE.Matrix4.__v1.set(this.n12,this.n22,this.n32)},getColumnZ:function(){return THREE.Matrix4.__v1.set(this.n13,this.n23,this.n33)},getInverse:function(a){var b=a.n11,c=a.n12,d=a.n13,e=a.n14,f=a.n21,g=a.n22,i=a.n23,k=a.n24,h=a.n31,j=a.n32,l=a.n33,n=a.n34,m=a.n41,p=a.n42,o=a.n43,q=a.n44;this.n11=
i*n*p-k*l*p+k*j*o-g*n*o-i*j*q+g*l*q;this.n12=e*l*p-d*n*p-e*j*o+c*n*o+d*j*q-c*l*q;this.n13=d*k*p-e*i*p+e*g*o-c*k*o-d*g*q+c*i*q;this.n14=e*i*j-d*k*j-e*g*l+c*k*l+d*g*n-c*i*n;this.n21=k*l*m-i*n*m-k*h*o+f*n*o+i*h*q-f*l*q;this.n22=d*n*m-e*l*m+e*h*o-b*n*o-d*h*q+b*l*q;this.n23=e*i*m-d*k*m-e*f*o+b*k*o+d*f*q-b*i*q;this.n24=d*k*h-e*i*h+e*f*l-b*k*l-d*f*n+b*i*n;this.n31=g*n*m-k*j*m+k*h*p-f*n*p-g*h*q+f*j*q;this.n32=e*j*m-c*n*m-e*h*p+b*n*p+c*h*q-b*j*q;this.n33=c*k*m-e*g*m+e*f*p-b*k*p-c*f*q+b*g*q;this.n34=e*g*h-
c*k*h-e*f*j+b*k*j+c*f*n-b*g*n;this.n41=i*j*m-g*l*m-i*h*p+f*l*p+g*h*o-f*j*o;this.n42=c*l*m-d*j*m+d*h*p-b*l*p-c*h*o+b*j*o;this.n43=d*g*m-c*i*m-d*f*p+b*i*p+c*f*o-b*g*o;this.n44=c*i*h-d*g*h+d*f*j-b*i*j-c*f*l+b*g*l;this.multiplyScalar(1/a.determinant());return this},setRotationFromEuler:function(a,b){var c=a.x,d=a.y,e=a.z,f=Math.cos(c),c=Math.sin(c),g=Math.cos(d),d=Math.sin(d),i=Math.cos(e),e=Math.sin(e);switch(b){case "YXZ":var k=g*i,h=g*e,j=d*i,l=d*e;this.n11=k+l*c;this.n12=j*c-h;this.n13=f*d;this.n21=
f*e;this.n22=f*i;this.n23=-c;this.n31=h*c-j;this.n32=l+k*c;this.n33=f*g;break;case "ZXY":k=g*i;h=g*e;j=d*i;l=d*e;this.n11=k-l*c;this.n12=-f*e;this.n13=j+h*c;this.n21=h+j*c;this.n22=f*i;this.n23=l-k*c;this.n31=-f*d;this.n32=c;this.n33=f*g;break;case "ZYX":k=f*i;h=f*e;j=c*i;l=c*e;this.n11=g*i;this.n12=j*d-h;this.n13=k*d+l;this.n21=g*e;this.n22=l*d+k;this.n23=h*d-j;this.n31=-d;this.n32=c*g;this.n33=f*g;break;case "YZX":k=f*g;h=f*d;j=c*g;l=c*d;this.n11=g*i;this.n12=l-k*e;this.n13=j*e+h;this.n21=e;this.n22=
f*i;this.n23=-c*i;this.n31=-d*i;this.n32=h*e+j;this.n33=k-l*e;break;case "XZY":k=f*g;h=f*d;j=c*g;l=c*d;this.n11=g*i;this.n12=-e;this.n13=d*i;this.n21=k*e+l;this.n22=f*i;this.n23=h*e-j;this.n31=j*e-h;this.n32=c*i;this.n33=l*e+k;break;default:k=f*i;h=f*e;j=c*i;l=c*e;this.n11=g*i;this.n12=-g*e;this.n13=d;this.n21=h+j*d;this.n22=k-l*d;this.n23=-c*g;this.n31=l-k*d;this.n32=j+h*d;this.n33=f*g}return this},setRotationFromQuaternion:function(a){var b=a.x,c=a.y,d=a.z,e=a.w,f=b+b,g=c+c,i=d+d,a=b*f,k=b*g,b=
b*i,h=c*g,c=c*i,d=d*i,f=e*f,g=e*g,e=e*i;this.n11=1-(h+d);this.n12=k-e;this.n13=b+g;this.n21=k+e;this.n22=1-(a+d);this.n23=c-f;this.n31=b-g;this.n32=c+f;this.n33=1-(a+h);return this},compose:function(a,b,c){var d=THREE.Matrix4.__m1,e=THREE.Matrix4.__m2;d.identity();d.setRotationFromQuaternion(b);e.makeScale(c.x,c.y,c.z);this.multiply(d,e);this.n14=a.x;this.n24=a.y;this.n34=a.z;return this},decompose:function(a,b,c){var d=THREE.Matrix4.__v1,e=THREE.Matrix4.__v2,f=THREE.Matrix4.__v3;d.set(this.n11,this.n21,
this.n31);e.set(this.n12,this.n22,this.n32);f.set(this.n13,this.n23,this.n33);a=a instanceof THREE.Vector3?a:new THREE.Vector3;b=b instanceof THREE.Quaternion?b:new THREE.Quaternion;c=c instanceof THREE.Vector3?c:new THREE.Vector3;c.x=d.length();c.y=e.length();c.z=f.length();a.x=this.n14;a.y=this.n24;a.z=this.n34;d=THREE.Matrix4.__m1;d.copy(this);d.n11=d.n11/c.x;d.n21=d.n21/c.x;d.n31=d.n31/c.x;d.n12=d.n12/c.y;d.n22=d.n22/c.y;d.n32=d.n32/c.y;d.n13=d.n13/c.z;d.n23=d.n23/c.z;d.n33=d.n33/c.z;b.setFromRotationMatrix(d);
return[a,b,c]},extractPosition:function(a){this.n14=a.n14;this.n24=a.n24;this.n34=a.n34;return this},extractRotation:function(a){var b=THREE.Matrix4.__v1,c=1/b.set(a.n11,a.n21,a.n31).length(),d=1/b.set(a.n12,a.n22,a.n32).length(),b=1/b.set(a.n13,a.n23,a.n33).length();this.n11=a.n11*c;this.n21=a.n21*c;this.n31=a.n31*c;this.n12=a.n12*d;this.n22=a.n22*d;this.n32=a.n32*d;this.n13=a.n13*b;this.n23=a.n23*b;this.n33=a.n33*b;return this},translate:function(a){var b=a.x,c=a.y,a=a.z;this.n14=this.n11*b+this.n12*
c+this.n13*a+this.n14;this.n24=this.n21*b+this.n22*c+this.n23*a+this.n24;this.n34=this.n31*b+this.n32*c+this.n33*a+this.n34;this.n44=this.n41*b+this.n42*c+this.n43*a+this.n44;return this},rotateX:function(a){var b=this.n12,c=this.n22,d=this.n32,e=this.n42,f=this.n13,g=this.n23,i=this.n33,k=this.n43,h=Math.cos(a),a=Math.sin(a);this.n12=h*b+a*f;this.n22=h*c+a*g;this.n32=h*d+a*i;this.n42=h*e+a*k;this.n13=h*f-a*b;this.n23=h*g-a*c;this.n33=h*i-a*d;this.n43=h*k-a*e;return this},rotateY:function(a){var b=
this.n11,c=this.n21,d=this.n31,e=this.n41,f=this.n13,g=this.n23,i=this.n33,k=this.n43,h=Math.cos(a),a=Math.sin(a);this.n11=h*b-a*f;this.n21=h*c-a*g;this.n31=h*d-a*i;this.n41=h*e-a*k;this.n13=h*f+a*b;this.n23=h*g+a*c;this.n33=h*i+a*d;this.n43=h*k+a*e;return this},rotateZ:function(a){var b=this.n11,c=this.n21,d=this.n31,e=this.n41,f=this.n12,g=this.n22,i=this.n32,k=this.n42,h=Math.cos(a),a=Math.sin(a);this.n11=h*b+a*f;this.n21=h*c+a*g;this.n31=h*d+a*i;this.n41=h*e+a*k;this.n12=h*f-a*b;this.n22=h*g-
a*c;this.n32=h*i-a*d;this.n42=h*k-a*e;return this},rotateByAxis:function(a,b){if(a.x===1&&a.y===0&&a.z===0)return this.rotateX(b);if(a.x===0&&a.y===1&&a.z===0)return this.rotateY(b);if(a.x===0&&a.y===0&&a.z===1)return this.rotateZ(b);var c=a.x,d=a.y,e=a.z,f=Math.sqrt(c*c+d*d+e*e),c=c/f,d=d/f,e=e/f,f=c*c,g=d*d,i=e*e,k=Math.cos(b),h=Math.sin(b),j=1-k,l=c*d*j,n=c*e*j,j=d*e*j,c=c*h,m=d*h,h=e*h,e=f+(1-f)*k,f=l+h,d=n-m,l=l-h,g=g+(1-g)*k,h=j+c,n=n+m,j=j-c,i=i+(1-i)*k,k=this.n11,c=this.n21,m=this.n31,p=this.n41,
o=this.n12,q=this.n22,G=this.n32,w=this.n42,C=this.n13,D=this.n23,r=this.n33,x=this.n43;this.n11=e*k+f*o+d*C;this.n21=e*c+f*q+d*D;this.n31=e*m+f*G+d*r;this.n41=e*p+f*w+d*x;this.n12=l*k+g*o+h*C;this.n22=l*c+g*q+h*D;this.n32=l*m+g*G+h*r;this.n42=l*p+g*w+h*x;this.n13=n*k+j*o+i*C;this.n23=n*c+j*q+i*D;this.n33=n*m+j*G+i*r;this.n43=n*p+j*w+i*x;return this},scale:function(a){var b=a.x,c=a.y,a=a.z;this.n11=this.n11*b;this.n12=this.n12*c;this.n13=this.n13*a;this.n21=this.n21*b;this.n22=this.n22*c;this.n23=
this.n23*a;this.n31=this.n31*b;this.n32=this.n32*c;this.n33=this.n33*a;this.n41=this.n41*b;this.n42=this.n42*c;this.n43=this.n43*a;return this},makeTranslation:function(a,b,c){this.set(1,0,0,a,0,1,0,b,0,0,1,c,0,0,0,1);return this},makeRotationX:function(a){var b=Math.cos(a),a=Math.sin(a);this.set(1,0,0,0,0,b,-a,0,0,a,b,0,0,0,0,1);return this},makeRotationY:function(a){var b=Math.cos(a),a=Math.sin(a);this.set(b,0,a,0,0,1,0,0,-a,0,b,0,0,0,0,1);return this},makeRotationZ:function(a){var b=Math.cos(a),
a=Math.sin(a);this.set(b,-a,0,0,a,b,0,0,0,0,1,0,0,0,0,1);return this},makeRotationAxis:function(a,b){var c=Math.cos(b),d=Math.sin(b),e=1-c,f=a.x,g=a.y,i=a.z,k=e*f,h=e*g;this.set(k*f+c,k*g-d*i,k*i+d*g,0,k*g+d*i,h*g+c,h*i-d*f,0,k*i-d*g,h*i+d*f,e*i*i+c,0,0,0,0,1);return this},makeScale:function(a,b,c){this.set(a,0,0,0,0,b,0,0,0,0,c,0,0,0,0,1);return this},makeFrustum:function(a,b,c,d,e,f){this.n11=2*e/(b-a);this.n12=0;this.n13=(b+a)/(b-a);this.n21=this.n14=0;this.n22=2*e/(d-c);this.n23=(d+c)/(d-c);this.n32=
this.n31=this.n24=0;this.n33=-(f+e)/(f-e);this.n34=-2*f*e/(f-e);this.n42=this.n41=0;this.n43=-1;this.n44=0;return this},makePerspective:function(a,b,c,d){var a=c*Math.tan(a*Math.PI/360),e=-a;return this.makeFrustum(e*b,a*b,e,a,c,d)},makeOrthographic:function(a,b,c,d,e,f){var g=b-a,i=c-d,k=f-e;this.n11=2/g;this.n13=this.n12=0;this.n14=-((b+a)/g);this.n21=0;this.n22=2/i;this.n23=0;this.n24=-((c+d)/i);this.n32=this.n31=0;this.n33=-2/k;this.n34=-((f+e)/k);this.n43=this.n42=this.n41=0;this.n44=1;return this},
clone:function(){return new THREE.Matrix4(this.n11,this.n12,this.n13,this.n14,this.n21,this.n22,this.n23,this.n24,this.n31,this.n32,this.n33,this.n34,this.n41,this.n42,this.n43,this.n44)}};THREE.Matrix4.__v1=new THREE.Vector3;THREE.Matrix4.__v2=new THREE.Vector3;THREE.Matrix4.__v3=new THREE.Vector3;THREE.Matrix4.__m1=new THREE.Matrix4;THREE.Matrix4.__m2=new THREE.Matrix4;
THREE.Object3D=function(){this.id=THREE.Object3DCount++;this.name="";this.parent=void 0;this.children=[];this.up=new THREE.Vector3(0,1,0);this.position=new THREE.Vector3;this.rotation=new THREE.Vector3;this.eulerOrder="XYZ";this.scale=new THREE.Vector3(1,1,1);this.flipSided=this.doubleSided=false;this.renderDepth=null;this.rotationAutoUpdate=true;this.matrix=new THREE.Matrix4;this.matrixWorld=new THREE.Matrix4;this.matrixRotationWorld=new THREE.Matrix4;this.matrixWorldNeedsUpdate=this.matrixAutoUpdate=
true;this.quaternion=new THREE.Quaternion;this.useQuaternion=false;this.boundRadius=0;this.boundRadiusScale=1;this.visible=true;this.receiveShadow=this.castShadow=false;this.frustumCulled=true;this._vector=new THREE.Vector3};
THREE.Object3D.prototype={constructor:THREE.Object3D,applyMatrix:function(a){this.matrix.multiply(a,this.matrix);this.scale.getScaleFromMatrix(this.matrix);this.rotation.getRotationFromMatrix(this.matrix,this.scale);this.position.getPositionFromMatrix(this.matrix)},translate:function(a,b){this.matrix.rotateAxis(b);this.position.addSelf(b.multiplyScalar(a))},translateX:function(a){this.translate(a,this._vector.set(1,0,0))},translateY:function(a){this.translate(a,this._vector.set(0,1,0))},translateZ:function(a){this.translate(a,
this._vector.set(0,0,1))},lookAt:function(a){this.matrix.lookAt(a,this.position,this.up);this.rotationAutoUpdate&&this.rotation.getRotationFromMatrix(this.matrix)},add:function(a){if(a===this)console.warn("THREE.Object3D.add: An object can't be added as a child of itself.");else if(a instanceof THREE.Object3D){a.parent!==void 0&&a.parent.remove(a);a.parent=this;this.children.push(a);for(var b=this;b.parent!==void 0;)b=b.parent;b!==void 0&&b instanceof THREE.Scene&&b.__addObject(a)}},remove:function(a){var b=
this.children.indexOf(a);if(b!==-1){a.parent=void 0;this.children.splice(b,1);for(b=this;b.parent!==void 0;)b=b.parent;b!==void 0&&b instanceof THREE.Scene&&b.__removeObject(a)}},getChildByName:function(a,b){var c,d,e;c=0;for(d=this.children.length;c<d;c++){e=this.children[c];if(e.name===a)return e;if(b){e=e.getChildByName(a,b);if(e!==void 0)return e}}},updateMatrix:function(){this.matrix.setPosition(this.position);this.useQuaternion?this.matrix.setRotationFromQuaternion(this.quaternion):this.matrix.setRotationFromEuler(this.rotation,
this.eulerOrder);if(this.scale.x!==1||this.scale.y!==1||this.scale.z!==1){this.matrix.scale(this.scale);this.boundRadiusScale=Math.max(this.scale.x,Math.max(this.scale.y,this.scale.z))}this.matrixWorldNeedsUpdate=true},updateMatrixWorld:function(a){this.matrixAutoUpdate&&this.updateMatrix();if(this.matrixWorldNeedsUpdate||a){this.parent?this.matrixWorld.multiply(this.parent.matrixWorld,this.matrix):this.matrixWorld.copy(this.matrix);this.matrixWorldNeedsUpdate=false;a=true}for(var b=0,c=this.children.length;b<
c;b++)this.children[b].updateMatrixWorld(a)}};THREE.Object3DCount=0;
THREE.Projector=function(){function a(){var a=g[f]=g[f]||new THREE.RenderableObject;f++;return a}function b(){var a=h[k]=h[k]||new THREE.RenderableVertex;k++;return a}function c(a,b){return b.z-a.z}function d(a,b){var c=0,d=1,e=a.z+a.w,f=b.z+b.w,h=-a.z+a.w,g=-b.z+b.w;if(e>=0&&f>=0&&h>=0&&g>=0)return true;if(e<0&&f<0||h<0&&g<0)return false;e<0?c=Math.max(c,e/(e-f)):f<0&&(d=Math.min(d,e/(e-f)));h<0?c=Math.max(c,h/(h-g)):g<0&&(d=Math.min(d,h/(h-g)));if(d<c)return false;a.lerpSelf(b,c);b.lerpSelf(a,1-
d);return true}var e,f,g=[],i,k,h=[],j,l,n=[],m,p=[],o,q,G=[],w,C,D=[],r={objects:[],sprites:[],lights:[],elements:[]},x=new THREE.Vector3,t=new THREE.Vector4,y=new THREE.Matrix4,H=new THREE.Matrix4,K=new THREE.Frustum,E=new THREE.Vector4,J=new THREE.Vector4;this.projectVector=function(a,b){b.matrixWorldInverse.getInverse(b.matrixWorld);y.multiply(b.projectionMatrix,b.matrixWorldInverse);y.multiplyVector3(a);return a};this.unprojectVector=function(a,b){b.projectionMatrixInverse.getInverse(b.projectionMatrix);
y.multiply(b.matrixWorld,b.projectionMatrixInverse);y.multiplyVector3(a);return a};this.pickingRay=function(a,b){var c;a.z=-1;c=new THREE.Vector3(a.x,a.y,1);this.unprojectVector(a,b);this.unprojectVector(c,b);c.subSelf(a).normalize();return new THREE.Ray(a,c)};this.projectGraph=function(b,d){f=0;r.objects.length=0;r.sprites.length=0;r.lights.length=0;var h=function(b){if(b.visible!==false){if((b instanceof THREE.Mesh||b instanceof THREE.Line)&&(b.frustumCulled===false||K.contains(b))){x.copy(b.matrixWorld.getPosition());
y.multiplyVector3(x);e=a();e.object=b;e.z=x.z;r.objects.push(e)}else if(b instanceof THREE.Sprite||b instanceof THREE.Particle){x.copy(b.matrixWorld.getPosition());y.multiplyVector3(x);e=a();e.object=b;e.z=x.z;r.sprites.push(e)}else b instanceof THREE.Light&&r.lights.push(b);for(var c=0,d=b.children.length;c<d;c++)h(b.children[c])}};h(b);d&&r.objects.sort(c);return r};this.projectScene=function(a,e,f){var g=e.near,x=e.far,O=false,U,A,u,I,s,B,z,F,v,L,N,V,W,X,P;C=q=m=l=0;r.elements.length=0;if(e.parent===
void 0){console.warn("DEPRECATED: Camera hasn't been added to a Scene. Adding it...");a.add(e)}a.updateMatrixWorld();e.matrixWorldInverse.getInverse(e.matrixWorld);y.multiply(e.projectionMatrix,e.matrixWorldInverse);K.setFromMatrix(y);r=this.projectGraph(a,false);a=0;for(U=r.objects.length;a<U;a++){v=r.objects[a].object;L=v.matrixWorld;k=0;if(v instanceof THREE.Mesh){N=v.geometry;V=v.geometry.materials;I=N.vertices;W=N.faces;X=N.faceVertexUvs;N=v.matrixRotationWorld.extractRotation(L);A=0;for(u=I.length;A<
u;A++){i=b();i.positionWorld.copy(I[A]);L.multiplyVector3(i.positionWorld);i.positionScreen.copy(i.positionWorld);y.multiplyVector4(i.positionScreen);i.positionScreen.x=i.positionScreen.x/i.positionScreen.w;i.positionScreen.y=i.positionScreen.y/i.positionScreen.w;i.visible=i.positionScreen.z>g&&i.positionScreen.z<x}I=0;for(A=W.length;I<A;I++){u=W[I];if(u instanceof THREE.Face3){s=h[u.a];B=h[u.b];z=h[u.c];if(s.visible&&B.visible&&z.visible){O=(z.positionScreen.x-s.positionScreen.x)*(B.positionScreen.y-
s.positionScreen.y)-(z.positionScreen.y-s.positionScreen.y)*(B.positionScreen.x-s.positionScreen.x)<0;if(v.doubleSided||O!=v.flipSided){F=n[l]=n[l]||new THREE.RenderableFace3;l++;j=F;j.v1.copy(s);j.v2.copy(B);j.v3.copy(z)}else continue}else continue}else if(u instanceof THREE.Face4){s=h[u.a];B=h[u.b];z=h[u.c];F=h[u.d];if(s.visible&&B.visible&&z.visible&&F.visible){O=(F.positionScreen.x-s.positionScreen.x)*(B.positionScreen.y-s.positionScreen.y)-(F.positionScreen.y-s.positionScreen.y)*(B.positionScreen.x-
s.positionScreen.x)<0||(B.positionScreen.x-z.positionScreen.x)*(F.positionScreen.y-z.positionScreen.y)-(B.positionScreen.y-z.positionScreen.y)*(F.positionScreen.x-z.positionScreen.x)<0;if(v.doubleSided||O!=v.flipSided){P=p[m]=p[m]||new THREE.RenderableFace4;m++;j=P;j.v1.copy(s);j.v2.copy(B);j.v3.copy(z);j.v4.copy(F)}else continue}else continue}j.normalWorld.copy(u.normal);!O&&(v.flipSided||v.doubleSided)&&j.normalWorld.negate();N.multiplyVector3(j.normalWorld);j.centroidWorld.copy(u.centroid);L.multiplyVector3(j.centroidWorld);
j.centroidScreen.copy(j.centroidWorld);y.multiplyVector3(j.centroidScreen);z=u.vertexNormals;s=0;for(B=z.length;s<B;s++){F=j.vertexNormalsWorld[s];F.copy(z[s]);!O&&(v.flipSided||v.doubleSided)&&F.negate();N.multiplyVector3(F)}s=0;for(B=X.length;s<B;s++)if(P=X[s][I]){z=0;for(F=P.length;z<F;z++)j.uvs[s][z]=P[z]}j.material=v.material;j.faceMaterial=u.materialIndex!==null?V[u.materialIndex]:null;j.z=j.centroidScreen.z;r.elements.push(j)}}else if(v instanceof THREE.Line){H.multiply(y,L);I=v.geometry.vertices;
s=b();s.positionScreen.copy(I[0]);H.multiplyVector4(s.positionScreen);L=v.type===THREE.LinePieces?2:1;A=1;for(u=I.length;A<u;A++){s=b();s.positionScreen.copy(I[A]);H.multiplyVector4(s.positionScreen);if(!((A+1)%L>0)){B=h[k-2];E.copy(s.positionScreen);J.copy(B.positionScreen);if(d(E,J)){E.multiplyScalar(1/E.w);J.multiplyScalar(1/J.w);V=G[q]=G[q]||new THREE.RenderableLine;q++;o=V;o.v1.positionScreen.copy(E);o.v2.positionScreen.copy(J);o.z=Math.max(E.z,J.z);o.material=v.material;r.elements.push(o)}}}}}a=
0;for(U=r.sprites.length;a<U;a++){v=r.sprites[a].object;L=v.matrixWorld;if(v instanceof THREE.Particle){t.set(L.n14,L.n24,L.n34,1);y.multiplyVector4(t);t.z=t.z/t.w;if(t.z>0&&t.z<1){g=D[C]=D[C]||new THREE.RenderableParticle;C++;w=g;w.x=t.x/t.w;w.y=t.y/t.w;w.z=t.z;w.rotation=v.rotation.z;w.scale.x=v.scale.x*Math.abs(w.x-(t.x+e.projectionMatrix.n11)/(t.w+e.projectionMatrix.n14));w.scale.y=v.scale.y*Math.abs(w.y-(t.y+e.projectionMatrix.n22)/(t.w+e.projectionMatrix.n24));w.material=v.material;r.elements.push(w)}}}f&&
r.elements.sort(c);return r}};THREE.Quaternion=function(a,b,c,d){this.x=a||0;this.y=b||0;this.z=c||0;this.w=d!==void 0?d:1};
THREE.Quaternion.prototype={constructor:THREE.Quaternion,set:function(a,b,c,d){this.x=a;this.y=b;this.z=c;this.w=d;return this},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z;this.w=a.w;return this},setFromEuler:function(a){var b=Math.PI/360,c=a.x*b,d=a.y*b,e=a.z*b,a=Math.cos(d),d=Math.sin(d),b=Math.cos(-e),e=Math.sin(-e),f=Math.cos(c),c=Math.sin(c),g=a*b,i=d*e;this.w=g*f-i*c;this.x=g*c+i*f;this.y=d*b*f+a*e*c;this.z=a*e*f-d*b*c;return this},setFromAxisAngle:function(a,b){var c=b/2,d=Math.sin(c);
this.x=a.x*d;this.y=a.y*d;this.z=a.z*d;this.w=Math.cos(c);return this},setFromRotationMatrix:function(a){var b=Math.pow(a.determinant(),1/3);this.w=Math.sqrt(Math.max(0,b+a.n11+a.n22+a.n33))/2;this.x=Math.sqrt(Math.max(0,b+a.n11-a.n22-a.n33))/2;this.y=Math.sqrt(Math.max(0,b-a.n11+a.n22-a.n33))/2;this.z=Math.sqrt(Math.max(0,b-a.n11-a.n22+a.n33))/2;this.x=a.n32-a.n23<0?-Math.abs(this.x):Math.abs(this.x);this.y=a.n13-a.n31<0?-Math.abs(this.y):Math.abs(this.y);this.z=a.n21-a.n12<0?-Math.abs(this.z):Math.abs(this.z);
this.normalize();return this},calculateW:function(){this.w=-Math.sqrt(Math.abs(1-this.x*this.x-this.y*this.y-this.z*this.z));return this},inverse:function(){this.x=this.x*-1;this.y=this.y*-1;this.z=this.z*-1;return this},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)},normalize:function(){var a=Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w);if(a===0)this.w=this.z=this.y=this.x=0;else{a=1/a;this.x=this.x*a;this.y=this.y*a;this.z=this.z*
a;this.w=this.w*a}return this},multiply:function(a,b){this.x=a.x*b.w+a.y*b.z-a.z*b.y+a.w*b.x;this.y=-a.x*b.z+a.y*b.w+a.z*b.x+a.w*b.y;this.z=a.x*b.y-a.y*b.x+a.z*b.w+a.w*b.z;this.w=-a.x*b.x-a.y*b.y-a.z*b.z+a.w*b.w;return this},multiplySelf:function(a){var b=this.x,c=this.y,d=this.z,e=this.w,f=a.x,g=a.y,i=a.z,a=a.w;this.x=b*a+e*f+c*i-d*g;this.y=c*a+e*g+d*f-b*i;this.z=d*a+e*i+b*g-c*f;this.w=e*a-b*f-c*g-d*i;return this},multiplyVector3:function(a,b){b||(b=a);var c=a.x,d=a.y,e=a.z,f=this.x,g=this.y,i=this.z,
k=this.w,h=k*c+g*e-i*d,j=k*d+i*c-f*e,l=k*e+f*d-g*c,c=-f*c-g*d-i*e;b.x=h*k+c*-f+j*-i-l*-g;b.y=j*k+c*-g+l*-f-h*-i;b.z=l*k+c*-i+h*-g-j*-f;return b},clone:function(){return new THREE.Quaternion(this.x,this.y,this.z,this.w)}};
THREE.Quaternion.slerp=function(a,b,c,d){var e=a.w*b.w+a.x*b.x+a.y*b.y+a.z*b.z;if(e<0){c.w=-b.w;c.x=-b.x;c.y=-b.y;c.z=-b.z;e=-e}else c.copy(b);if(Math.abs(e)>=1){c.w=a.w;c.x=a.x;c.y=a.y;c.z=a.z;return c}var f=Math.acos(e),e=Math.sqrt(1-e*e);if(Math.abs(e)<0.001){c.w=0.5*(a.w+b.w);c.x=0.5*(a.x+b.x);c.y=0.5*(a.y+b.y);c.z=0.5*(a.z+b.z);return c}b=Math.sin((1-d)*f)/e;d=Math.sin(d*f)/e;c.w=a.w*b+c.w*d;c.x=a.x*b+c.x*d;c.y=a.y*b+c.y*d;c.z=a.z*b+c.z*d;return c};THREE.Vertex=THREE.Vector3;
THREE.Face3=function(a,b,c,d,e,f){this.a=a;this.b=b;this.c=c;this.normal=d instanceof THREE.Vector3?d:new THREE.Vector3;this.vertexNormals=d instanceof Array?d:[];this.color=e instanceof THREE.Color?e:new THREE.Color;this.vertexColors=e instanceof Array?e:[];this.vertexTangents=[];this.materialIndex=f;this.centroid=new THREE.Vector3};
THREE.Face3.prototype={constructor:THREE.Face3,clone:function(){var a=new THREE.Face3(this.a,this.b,this.c);a.normal.copy(this.normal);a.color.copy(this.color);a.centroid.copy(this.centroid);a.materialIndex=this.materialIndex;var b,c;b=0;for(c=this.vertexNormals.length;b<c;b++)a.vertexNormals[b]=this.vertexNormals[b].clone();b=0;for(c=this.vertexColors.length;b<c;b++)a.vertexColors[b]=this.vertexColors[b].clone();b=0;for(c=this.vertexTangents.length;b<c;b++)a.vertexTangents[b]=this.vertexTangents[b].clone();
return a}};THREE.Face4=function(a,b,c,d,e,f,g){this.a=a;this.b=b;this.c=c;this.d=d;this.normal=e instanceof THREE.Vector3?e:new THREE.Vector3;this.vertexNormals=e instanceof Array?e:[];this.color=f instanceof THREE.Color?f:new THREE.Color;this.vertexColors=f instanceof Array?f:[];this.vertexTangents=[];this.materialIndex=g;this.centroid=new THREE.Vector3};
THREE.Face4.prototype={constructor:THREE.Face4,clone:function(){var a=new THREE.Face4(this.a,this.b,this.c,this.d);a.normal.copy(this.normal);a.color.copy(this.color);a.centroid.copy(this.centroid);a.materialIndex=this.materialIndex;var b,c;b=0;for(c=this.vertexNormals.length;b<c;b++)a.vertexNormals[b]=this.vertexNormals[b].clone();b=0;for(c=this.vertexColors.length;b<c;b++)a.vertexColors[b]=this.vertexColors[b].clone();b=0;for(c=this.vertexTangents.length;b<c;b++)a.vertexTangents[b]=this.vertexTangents[b].clone();
return a}};THREE.UV=function(a,b){this.u=a||0;this.v=b||0};THREE.UV.prototype={constructor:THREE.UV,set:function(a,b){this.u=a;this.v=b;return this},copy:function(a){this.u=a.u;this.v=a.v;return this},lerpSelf:function(a,b){this.u=this.u+(a.u-this.u)*b;this.v=this.v+(a.v-this.v)*b;return this},clone:function(){return new THREE.UV(this.u,this.v)}};
THREE.Camera=function(){THREE.Object3D.call(this);this.matrixWorldInverse=new THREE.Matrix4;this.projectionMatrix=new THREE.Matrix4;this.projectionMatrixInverse=new THREE.Matrix4};THREE.Camera.prototype=new THREE.Object3D;THREE.Camera.prototype.constructor=THREE.Camera;THREE.Camera.prototype.lookAt=function(a){this.matrix.lookAt(this.position,a,this.up);this.rotationAutoUpdate&&this.rotation.getRotationFromMatrix(this.matrix)};
THREE.OrthographicCamera=function(a,b,c,d,e,f){THREE.Camera.call(this);this.left=a;this.right=b;this.top=c;this.bottom=d;this.near=e!==void 0?e:0.1;this.far=f!==void 0?f:2E3;this.updateProjectionMatrix()};THREE.OrthographicCamera.prototype=new THREE.Camera;THREE.OrthographicCamera.prototype.constructor=THREE.OrthographicCamera;THREE.OrthographicCamera.prototype.updateProjectionMatrix=function(){this.projectionMatrix.makeOrthographic(this.left,this.right,this.top,this.bottom,this.near,this.far)};
THREE.PerspectiveCamera=function(a,b,c,d){THREE.Camera.call(this);this.fov=a!==void 0?a:50;this.aspect=b!==void 0?b:1;this.near=c!==void 0?c:0.1;this.far=d!==void 0?d:2E3;this.updateProjectionMatrix()};THREE.PerspectiveCamera.prototype=new THREE.Camera;THREE.PerspectiveCamera.prototype.constructor=THREE.PerspectiveCamera;THREE.PerspectiveCamera.prototype.setLens=function(a,b){this.fov=2*Math.atan((b!==void 0?b:24)/(a*2))*(180/Math.PI);this.updateProjectionMatrix()};
THREE.PerspectiveCamera.prototype.setViewOffset=function(a,b,c,d,e,f){this.fullWidth=a;this.fullHeight=b;this.x=c;this.y=d;this.width=e;this.height=f;this.updateProjectionMatrix()};
THREE.PerspectiveCamera.prototype.updateProjectionMatrix=function(){if(this.fullWidth){var a=this.fullWidth/this.fullHeight,b=Math.tan(this.fov*Math.PI/360)*this.near,c=-b,d=a*c,a=Math.abs(a*b-d),c=Math.abs(b-c);this.projectionMatrix.makeFrustum(d+this.x*a/this.fullWidth,d+(this.x+this.width)*a/this.fullWidth,b-(this.y+this.height)*c/this.fullHeight,b-this.y*c/this.fullHeight,this.near,this.far)}else this.projectionMatrix.makePerspective(this.fov,this.aspect,this.near,this.far)};
THREE.Light=function(a){THREE.Object3D.call(this);this.color=new THREE.Color(a)};THREE.Light.prototype=new THREE.Object3D;THREE.Light.prototype.constructor=THREE.Light;THREE.Light.prototype.supr=THREE.Object3D.prototype;
THREE.Material=function(a){a=a||{};this.id=THREE.MaterialCount++;this.name="";this.opacity=a.opacity!==void 0?a.opacity:1;this.transparent=a.transparent!==void 0?a.transparent:false;this.blending=a.blending!==void 0?a.blending:THREE.NormalBlending;this.blendSrc=a.blendSrc!==void 0?a.blendSrc:THREE.SrcAlphaFactor;this.blendDst=a.blendDst!==void 0?a.blendDst:THREE.OneMinusSrcAlphaFactor;this.blendEquation=a.blendEquation!==void 0?a.blendEquation:THREE.AddEquation;this.depthTest=a.depthTest!==void 0?
a.depthTest:true;this.depthWrite=a.depthWrite!==void 0?a.depthWrite:true;this.polygonOffset=a.polygonOffset!==void 0?a.polygonOffset:false;this.polygonOffsetFactor=a.polygonOffsetFactor!==void 0?a.polygonOffsetFactor:0;this.polygonOffsetUnits=a.polygonOffsetUnits!==void 0?a.polygonOffsetUnits:0;this.alphaTest=a.alphaTest!==void 0?a.alphaTest:0;this.overdraw=a.overdraw!==void 0?a.overdraw:false;this.needsUpdate=true};THREE.MaterialCount=0;THREE.NoShading=0;THREE.FlatShading=1;THREE.SmoothShading=2;
THREE.NoColors=0;THREE.FaceColors=1;THREE.VertexColors=2;THREE.NoBlending=0;THREE.NormalBlending=1;THREE.AdditiveBlending=2;THREE.SubtractiveBlending=3;THREE.MultiplyBlending=4;THREE.AdditiveAlphaBlending=5;THREE.CustomBlending=6;THREE.AddEquation=100;THREE.SubtractEquation=101;THREE.ReverseSubtractEquation=102;THREE.ZeroFactor=200;THREE.OneFactor=201;THREE.SrcColorFactor=202;THREE.OneMinusSrcColorFactor=203;THREE.SrcAlphaFactor=204;THREE.OneMinusSrcAlphaFactor=205;THREE.DstAlphaFactor=206;
THREE.OneMinusDstAlphaFactor=207;THREE.DstColorFactor=208;THREE.OneMinusDstColorFactor=209;THREE.SrcAlphaSaturateFactor=210;
THREE.LineBasicMaterial=function(a){THREE.Material.call(this,a);a=a||{};this.color=a.color!==void 0?new THREE.Color(a.color):new THREE.Color(16777215);this.linewidth=a.linewidth!==void 0?a.linewidth:1;this.linecap=a.linecap!==void 0?a.linecap:"round";this.linejoin=a.linejoin!==void 0?a.linejoin:"round";this.vertexColors=a.vertexColors?a.vertexColors:false;this.fog=a.fog!==void 0?a.fog:true};THREE.LineBasicMaterial.prototype=new THREE.Material;THREE.LineBasicMaterial.prototype.constructor=THREE.LineBasicMaterial;
THREE.MeshBasicMaterial=function(a){THREE.Material.call(this,a);a=a||{};this.color=a.color!==void 0?new THREE.Color(a.color):new THREE.Color(16777215);this.map=a.map!==void 0?a.map:null;this.lightMap=a.lightMap!==void 0?a.lightMap:null;this.envMap=a.envMap!==void 0?a.envMap:null;this.combine=a.combine!==void 0?a.combine:THREE.MultiplyOperation;this.reflectivity=a.reflectivity!==void 0?a.reflectivity:1;this.refractionRatio=a.refractionRatio!==void 0?a.refractionRatio:0.98;this.fog=a.fog!==void 0?a.fog:
true;this.shading=a.shading!==void 0?a.shading:THREE.SmoothShading;this.wireframe=a.wireframe!==void 0?a.wireframe:false;this.wireframeLinewidth=a.wireframeLinewidth!==void 0?a.wireframeLinewidth:1;this.wireframeLinecap=a.wireframeLinecap!==void 0?a.wireframeLinecap:"round";this.wireframeLinejoin=a.wireframeLinejoin!==void 0?a.wireframeLinejoin:"round";this.vertexColors=a.vertexColors!==void 0?a.vertexColors:THREE.NoColors;this.skinning=a.skinning!==void 0?a.skinning:false;this.morphTargets=a.morphTargets!==
void 0?a.morphTargets:false};THREE.MeshBasicMaterial.prototype=new THREE.Material;THREE.MeshBasicMaterial.prototype.constructor=THREE.MeshBasicMaterial;
THREE.ParticleBasicMaterial=function(a){THREE.Material.call(this,a);a=a||{};this.color=a.color!==void 0?new THREE.Color(a.color):new THREE.Color(16777215);this.map=a.map!==void 0?a.map:null;this.size=a.size!==void 0?a.size:1;this.sizeAttenuation=a.sizeAttenuation!==void 0?a.sizeAttenuation:true;this.vertexColors=a.vertexColors!==void 0?a.vertexColors:false;this.fog=a.fog!==void 0?a.fog:true};THREE.ParticleBasicMaterial.prototype=new THREE.Material;
THREE.ParticleBasicMaterial.prototype.constructor=THREE.ParticleBasicMaterial;THREE.ParticleDOMMaterial=function(a){THREE.Material.call(this);this.domElement=a};
THREE.Texture=function(a,b,c,d,e,f,g,i){this.id=THREE.TextureCount++;this.image=a;this.mapping=b!==void 0?b:new THREE.UVMapping;this.wrapS=c!==void 0?c:THREE.ClampToEdgeWrapping;this.wrapT=d!==void 0?d:THREE.ClampToEdgeWrapping;this.magFilter=e!==void 0?e:THREE.LinearFilter;this.minFilter=f!==void 0?f:THREE.LinearMipMapLinearFilter;this.format=g!==void 0?g:THREE.RGBAFormat;this.type=i!==void 0?i:THREE.UnsignedByteType;this.offset=new THREE.Vector2(0,0);this.repeat=new THREE.Vector2(1,1);this.generateMipmaps=
true;this.needsUpdate=this.premultiplyAlpha=false;this.onUpdate=null};THREE.Texture.prototype={constructor:THREE.Texture,clone:function(){var a=new THREE.Texture(this.image,this.mapping,this.wrapS,this.wrapT,this.magFilter,this.minFilter,this.format,this.type);a.offset.copy(this.offset);a.repeat.copy(this.repeat);return a}};THREE.TextureCount=0;THREE.MultiplyOperation=0;THREE.MixOperation=1;THREE.UVMapping=function(){};THREE.CubeReflectionMapping=function(){};THREE.CubeRefractionMapping=function(){};
THREE.SphericalReflectionMapping=function(){};THREE.SphericalRefractionMapping=function(){};THREE.RepeatWrapping=0;THREE.ClampToEdgeWrapping=1;THREE.MirroredRepeatWrapping=2;THREE.NearestFilter=3;THREE.NearestMipMapNearestFilter=4;THREE.NearestMipMapLinearFilter=5;THREE.LinearFilter=6;THREE.LinearMipMapNearestFilter=7;THREE.LinearMipMapLinearFilter=8;THREE.ByteType=9;THREE.UnsignedByteType=10;THREE.ShortType=11;THREE.UnsignedShortType=12;THREE.IntType=13;THREE.UnsignedIntType=14;THREE.FloatType=15;
THREE.AlphaFormat=16;THREE.RGBFormat=17;THREE.RGBAFormat=18;THREE.LuminanceFormat=19;THREE.LuminanceAlphaFormat=20;THREE.DataTexture=function(a,b,c,d,e,f,g,i,k,h){THREE.Texture.call(this,null,f,g,i,k,h,d,e);this.image={data:a,width:b,height:c}};THREE.DataTexture.prototype=new THREE.Texture;THREE.DataTexture.prototype.constructor=THREE.DataTexture;
THREE.DataTexture.prototype.clone=function(){var a=new THREE.DataTexture(this.image.data,this.image.width,this.image.height,this.format,this.type,this.mapping,this.wrapS,this.wrapT,this.magFilter,this.minFilter);a.offset.copy(this.offset);a.repeat.copy(this.repeat);return a};THREE.Particle=function(a){THREE.Object3D.call(this);this.material=a};THREE.Particle.prototype=new THREE.Object3D;THREE.Particle.prototype.constructor=THREE.Particle;
THREE.Mesh=function(a,b){THREE.Object3D.call(this);this.geometry=a;this.material=b!==void 0?b:new THREE.MeshBasicMaterial({color:Math.random()*16777215,wireframe:true});if(this.geometry){this.geometry.boundingSphere||this.geometry.computeBoundingSphere();this.boundRadius=a.boundingSphere.radius;if(this.geometry.morphTargets.length){this.morphTargetBase=-1;this.morphTargetForcedOrder=[];this.morphTargetInfluences=[];this.morphTargetDictionary={};for(var c=0;c<this.geometry.morphTargets.length;c++){this.morphTargetInfluences.push(0);
this.morphTargetDictionary[this.geometry.morphTargets[c].name]=c}}}};THREE.Mesh.prototype=new THREE.Object3D;THREE.Mesh.prototype.constructor=THREE.Mesh;THREE.Mesh.prototype.supr=THREE.Object3D.prototype;THREE.Mesh.prototype.getMorphTargetIndexByName=function(a){if(this.morphTargetDictionary[a]!==void 0)return this.morphTargetDictionary[a];console.log("THREE.Mesh.getMorphTargetIndexByName: morph target "+a+" does not exist. Returning 0.");return 0};
THREE.Line=function(a,b,c){THREE.Object3D.call(this);this.geometry=a;this.material=b!==void 0?b:new THREE.LineBasicMaterial({color:Math.random()*16777215});this.type=c!==void 0?c:THREE.LineStrip;this.geometry&&(this.geometry.boundingSphere||this.geometry.computeBoundingSphere())};THREE.LineStrip=0;THREE.LinePieces=1;THREE.Line.prototype=new THREE.Object3D;THREE.Line.prototype.constructor=THREE.Line;THREE.Bone=function(a){THREE.Object3D.call(this);this.skin=a;this.skinMatrix=new THREE.Matrix4};
THREE.Bone.prototype=new THREE.Object3D;THREE.Bone.prototype.constructor=THREE.Bone;THREE.Bone.prototype.supr=THREE.Object3D.prototype;THREE.Bone.prototype.update=function(a,b){this.matrixAutoUpdate&&(b=b|this.updateMatrix());if(b||this.matrixWorldNeedsUpdate){a?this.skinMatrix.multiply(a,this.matrix):this.skinMatrix.copy(this.matrix);this.matrixWorldNeedsUpdate=false;b=true}var c,d=this.children.length;for(c=0;c<d;c++)this.children[c].update(this.skinMatrix,b)};
THREE.Sprite=function(a){THREE.Object3D.call(this);this.color=a.color!==void 0?new THREE.Color(a.color):new THREE.Color(16777215);this.map=a.map!==void 0?a.map:new THREE.Texture;this.blending=a.blending!==void 0?a.blending:THREE.NormalBlending;this.blendSrc=a.blendSrc!==void 0?a.blendSrc:THREE.SrcAlphaFactor;this.blendDst=a.blendDst!==void 0?a.blendDst:THREE.OneMinusSrcAlphaFactor;this.blendEquation=a.blendEquation!==void 0?a.blendEquation:THREE.AddEquation;this.useScreenCoordinates=a.useScreenCoordinates!==
void 0?a.useScreenCoordinates:true;this.mergeWith3D=a.mergeWith3D!==void 0?a.mergeWith3D:!this.useScreenCoordinates;this.affectedByDistance=a.affectedByDistance!==void 0?a.affectedByDistance:!this.useScreenCoordinates;this.scaleByViewport=a.scaleByViewport!==void 0?a.scaleByViewport:!this.affectedByDistance;this.alignment=a.alignment instanceof THREE.Vector2?a.alignment:THREE.SpriteAlignment.center;this.rotation3d=this.rotation;this.rotation=0;this.opacity=1;this.uvOffset=new THREE.Vector2(0,0);this.uvScale=
new THREE.Vector2(1,1)};THREE.Sprite.prototype=new THREE.Object3D;THREE.Sprite.prototype.constructor=THREE.Sprite;THREE.Sprite.prototype.updateMatrix=function(){this.matrix.setPosition(this.position);this.rotation3d.set(0,0,this.rotation);this.matrix.setRotationFromEuler(this.rotation3d);if(this.scale.x!==1||this.scale.y!==1){this.matrix.scale(this.scale);this.boundRadiusScale=Math.max(this.scale.x,this.scale.y)}this.matrixWorldNeedsUpdate=true};THREE.SpriteAlignment={};
THREE.SpriteAlignment.topLeft=new THREE.Vector2(1,-1);THREE.SpriteAlignment.topCenter=new THREE.Vector2(0,-1);THREE.SpriteAlignment.topRight=new THREE.Vector2(-1,-1);THREE.SpriteAlignment.centerLeft=new THREE.Vector2(1,0);THREE.SpriteAlignment.center=new THREE.Vector2(0,0);THREE.SpriteAlignment.centerRight=new THREE.Vector2(-1,0);THREE.SpriteAlignment.bottomLeft=new THREE.Vector2(1,1);THREE.SpriteAlignment.bottomCenter=new THREE.Vector2(0,1);
THREE.SpriteAlignment.bottomRight=new THREE.Vector2(-1,1);THREE.Scene=function(){THREE.Object3D.call(this);this.overrideMaterial=this.fog=null;this.matrixAutoUpdate=false;this.__objects=[];this.__lights=[];this.__objectsAdded=[];this.__objectsRemoved=[]};THREE.Scene.prototype=new THREE.Object3D;THREE.Scene.prototype.constructor=THREE.Scene;
THREE.Scene.prototype.__addObject=function(a){if(a instanceof THREE.Light)this.__lights.indexOf(a)===-1&&this.__lights.push(a);else if(!(a instanceof THREE.Camera||a instanceof THREE.Bone)&&this.__objects.indexOf(a)===-1){this.__objects.push(a);this.__objectsAdded.push(a);var b=this.__objectsRemoved.indexOf(a);b!==-1&&this.__objectsRemoved.splice(b,1)}for(b=0;b<a.children.length;b++)this.__addObject(a.children[b])};
THREE.Scene.prototype.__removeObject=function(a){if(a instanceof THREE.Light){var b=this.__lights.indexOf(a);b!==-1&&this.__lights.splice(b,1)}else if(!(a instanceof THREE.Camera)){b=this.__objects.indexOf(a);if(b!==-1){this.__objects.splice(b,1);this.__objectsRemoved.push(a);b=this.__objectsAdded.indexOf(a);b!==-1&&this.__objectsAdded.splice(b,1)}}for(b=0;b<a.children.length;b++)this.__removeObject(a.children[b])};
THREE.DOMRenderer=function(){console.log("THREE.DOMRenderer",THREE.REVISION);var a,b,c,d,e,f,g,i=new THREE.Projector;g=function(a){for(var b=document.documentElement,c=0;c<a.length;c++)if(typeof b.style[a[c]]==="string")return a[c];return null}(["transform","MozTransform","WebkitTransform","msTransform","OTransform"]);this.domElement=document.createElement("div");this.setSize=function(a,b){c=a;d=b;e=c/2;f=d/2};this.render=function(c,d){var j,l,n,m,p,o;a=i.projectScene(c,d);b=a.elements;j=0;for(l=
b.length;j<l;j++){n=b[j];if(n instanceof THREE.RenderableParticle&&n.material instanceof THREE.ParticleDOMMaterial){m=n.material.domElement;p=n.x*e+e-(m.offsetWidth>>1);o=n.y*f+f-(m.offsetHeight>>1);m.style.left=p+"px";m.style.top=o+"px";m.style.zIndex=Math.abs(Math.floor((1-n.z)*d.far/d.near));g&&(m.style[g]="scale("+n.scale.x*e+","+n.scale.y*f+")")}}}};THREE.RenderableParticle=function(){this.rotation=this.z=this.y=this.x=null;this.scale=new THREE.Vector2;this.material=null};
THREE.RenderableVertex=function(){this.positionWorld=new THREE.Vector3;this.positionScreen=new THREE.Vector4;this.visible=true};THREE.RenderableVertex.prototype.copy=function(a){this.positionWorld.copy(a.positionWorld);this.positionScreen.copy(a.positionScreen)};
THREE.RenderableFace3=function(){this.v1=new THREE.RenderableVertex;this.v2=new THREE.RenderableVertex;this.v3=new THREE.RenderableVertex;this.centroidWorld=new THREE.Vector3;this.centroidScreen=new THREE.Vector3;this.normalWorld=new THREE.Vector3;this.vertexNormalsWorld=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3];this.faceMaterial=this.material=null;this.uvs=[[]];this.z=null};
THREE.RenderableFace4=function(){this.v1=new THREE.RenderableVertex;this.v2=new THREE.RenderableVertex;this.v3=new THREE.RenderableVertex;this.v4=new THREE.RenderableVertex;this.centroidWorld=new THREE.Vector3;this.centroidScreen=new THREE.Vector3;this.normalWorld=new THREE.Vector3;this.vertexNormalsWorld=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3,new THREE.Vector3];this.faceMaterial=this.material=null;this.uvs=[[]];this.z=null};THREE.RenderableObject=function(){this.z=this.object=null};
THREE.RenderableParticle=function(){this.rotation=this.z=this.y=this.x=null;this.scale=new THREE.Vector2;this.material=null};THREE.RenderableLine=function(){this.z=null;this.v1=new THREE.RenderableVertex;this.v2=new THREE.RenderableVertex;this.material=null};
>>>>>>> mrdoob/dev
