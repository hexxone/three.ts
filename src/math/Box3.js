import { Vector3 } from './Vector3.js';

/**
 * @author bhouston / http://clara.io
 * @author WestLangley / http://github.com/WestLangley
 */

var points;
var vector;

var v0, v1, v2;
var f0, f1, f2;
var center;
var extents;
var triangleNormal;

function Box3( min, max ) {

	this.min = ( min !== undefined ) ? min : new Vector3( + Infinity, + Infinity, + Infinity );
	this.max = ( max !== undefined ) ? max : new Vector3( - Infinity, - Infinity, - Infinity );

}

Object.assign( Box3.prototype, {

	isBox3: true,

	set: function ( min, max ) {

		this.min.copy( min );
		this.max.copy( max );

		return this;

	},

	setFromArray: function ( array ) {

		var minX = + Infinity;
		var minY = + Infinity;
		var minZ = + Infinity;

		var maxX = - Infinity;
		var maxY = - Infinity;
		var maxZ = - Infinity;

		for ( var i = 0, l = array.length; i < l; i += 3 ) {

			var x = array[ i ];
			var y = array[ i + 1 ];
			var z = array[ i + 2 ];

			if ( x < minX ) minX = x;
			if ( y < minY ) minY = y;
			if ( z < minZ ) minZ = z;

			if ( x > maxX ) maxX = x;
			if ( y > maxY ) maxY = y;
			if ( z > maxZ ) maxZ = z;

		}

		this.min.set( minX, minY, minZ );
		this.max.set( maxX, maxY, maxZ );

		return this;

	},

	setFromBufferAttribute: function ( attribute ) {

		var minX = + Infinity;
		var minY = + Infinity;
		var minZ = + Infinity;

		var maxX = - Infinity;
		var maxY = - Infinity;
		var maxZ = - Infinity;

		for ( var i = 0, l = attribute.count; i < l; i ++ ) {

			var x = attribute.getX( i );
			var y = attribute.getY( i );
			var z = attribute.getZ( i );

			if ( x < minX ) minX = x;
			if ( y < minY ) minY = y;
			if ( z < minZ ) minZ = z;

			if ( x > maxX ) maxX = x;
			if ( y > maxY ) maxY = y;
			if ( z > maxZ ) maxZ = z;

		}

		this.min.set( minX, minY, minZ );
		this.max.set( maxX, maxY, maxZ );

		return this;

	},

	setFromPoints: function ( points ) {

		this.makeEmpty();

		for ( var i = 0, il = points.length; i < il; i ++ ) {

			this.expandByPoint( points[ i ] );

		}

		return this;

	},

	setFromCenterAndSize: function ( center, size ) {

		if ( vector === undefined ) vector = new Vector3();

		var halfSize = vector.copy( size ).multiplyScalar( 0.5 );

		this.min.copy( center ).sub( halfSize );
		this.max.copy( center ).add( halfSize );

		return this;

	},

	setFromObject: function ( object ) {

		this.makeEmpty();

		return this.expandByObject( object );

	},

	clone: function () {

		return new this.constructor().copy( this );

	},

	copy: function ( box ) {

		this.min.copy( box.min );
		this.max.copy( box.max );

		return this;

	},

	makeEmpty: function () {

		this.min.x = this.min.y = this.min.z = + Infinity;
		this.max.x = this.max.y = this.max.z = - Infinity;

		return this;

	},

	isEmpty: function () {

		// this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes

		return ( this.max.x < this.min.x ) || ( this.max.y < this.min.y ) || ( this.max.z < this.min.z );

	},

	getCenter: function ( target ) {

		if ( target === undefined ) {

			console.warn( 'THREE.Box3: .getCenter() target is now required' );
			target = new Vector3();

		}

		return this.isEmpty() ? target.set( 0, 0, 0 ) : target.addVectors( this.min, this.max ).multiplyScalar( 0.5 );

	},

	getSize: function ( target ) {

		if ( target === undefined ) {

			console.warn( 'THREE.Box3: .getSize() target is now required' );
			target = new Vector3();

		}

		return this.isEmpty() ? target.set( 0, 0, 0 ) : target.subVectors( this.max, this.min );

	},

	expandByPoint: function ( point ) {

		this.min.min( point );
		this.max.max( point );

		return this;

	},

	expandByVector: function ( vector ) {

		this.min.sub( vector );
		this.max.add( vector );

		return this;

	},

	expandByScalar: function ( scalar ) {

		this.min.addScalar( - scalar );
		this.max.addScalar( scalar );

		return this;

	},

	expandByObject: function ( object ) {

		if ( vector === undefined ) vector = new Vector3();

		var i, l;

		// Computes the world-axis-aligned bounding box of an object (including its children),
		// accounting for both the object's, and children's, world transforms

		object.updateWorldMatrix( false, false );

		var geometry = object.geometry;

		if ( geometry !== undefined ) {

			if ( geometry.isGeometry ) {

				var vertices = geometry.vertices;

				for ( i = 0, l = vertices.length; i < l; i ++ ) {

					vector.copy( vertices[ i ] );
					vector.applyMatrix4( object.matrixWorld );

					this.expandByPoint( vector );

				}

			} else if ( geometry.isBufferGeometry ) {

				var attribute = geometry.attributes.position;

				if ( attribute !== undefined ) {

					for ( i = 0, l = attribute.count; i < l; i ++ ) {

						vector.fromBufferAttribute( attribute, i ).applyMatrix4( object.matrixWorld );

						this.expandByPoint( vector );

					}

				}

			}

		}

		//

		var children = object.children;

		for ( i = 0, l = children.length; i < l; i ++ ) {

			this.expandByObject( children[ i ] );

		}

		return this;

	},

	containsPoint: function ( point ) {

		return point.x < this.min.x || point.x > this.max.x ||
			point.y < this.min.y || point.y > this.max.y ||
			point.z < this.min.z || point.z > this.max.z ? false : true;

	},

	containsBox: function ( box ) {

		return this.min.x <= box.min.x && box.max.x <= this.max.x &&
			this.min.y <= box.min.y && box.max.y <= this.max.y &&
			this.min.z <= box.min.z && box.max.z <= this.max.z;

	},

	getParameter: function ( point, target ) {

		// This can potentially have a divide by zero if the box
		// has a size dimension of 0.

		if ( target === undefined ) {

			console.warn( 'THREE.Box3: .getParameter() target is now required' );
			target = new Vector3();

		}

		return target.set(
			( point.x - this.min.x ) / ( this.max.x - this.min.x ),
			( point.y - this.min.y ) / ( this.max.y - this.min.y ),
			( point.z - this.min.z ) / ( this.max.z - this.min.z )
		);

	},

	intersectsBox: function ( box ) {

		// using 6 splitting planes to rule out intersections.
		return box.max.x < this.min.x || box.min.x > this.max.x ||
			box.max.y < this.min.y || box.min.y > this.max.y ||
			box.max.z < this.min.z || box.min.z > this.max.z ? false : true;

	},

	intersectsSphere: function ( sphere ) {

		if ( vector === undefined ) vector = new Vector3();

		// Find the point on the AABB closest to the sphere center.
		this.clampPoint( sphere.center, vector );

		// If that point is inside the sphere, the AABB and sphere intersect.
		return vector.distanceToSquared( sphere.center ) <= ( sphere.radius * sphere.radius );

	},

	intersectsPlane: function ( plane ) {

		// We compute the minimum and maximum dot product values. If those values
		// are on the same side (back or front) of the plane, then there is no intersection.

		var min, max;

		if ( plane.normal.x > 0 ) {

			min = plane.normal.x * this.min.x;
			max = plane.normal.x * this.max.x;

		} else {

			min = plane.normal.x * this.max.x;
			max = plane.normal.x * this.min.x;

		}

		if ( plane.normal.y > 0 ) {

			min += plane.normal.y * this.min.y;
			max += plane.normal.y * this.max.y;

		} else {

			min += plane.normal.y * this.max.y;
			max += plane.normal.y * this.min.y;

		}

		if ( plane.normal.z > 0 ) {

			min += plane.normal.z * this.min.z;
			max += plane.normal.z * this.max.z;

		} else {

			min += plane.normal.z * this.max.z;
			max += plane.normal.z * this.min.z;

		}

		return ( min <= - plane.constant && max >= - plane.constant );

	},

	intersectsTriangle: function ( triangle ) {

		if ( v0 === undefined ) {

			// triangle centered vertices

			v0 = new Vector3();
			v1 = new Vector3();
			v2 = new Vector3();

			// triangle edge vectors

			f0 = new Vector3();
			f1 = new Vector3();
			f2 = new Vector3();

			center = new Vector3();
			extents = new Vector3();
			triangleNormal = new Vector3();

		}

		if ( this.isEmpty() ) {

			return false;

		}

		// compute box center and extents
		this.getCenter( center );
		extents.subVectors( this.max, center );

		// translate triangle to aabb origin
		v0.subVectors( triangle.a, center );
		v1.subVectors( triangle.b, center );
		v2.subVectors( triangle.c, center );

		// compute edge vectors for triangle
		f0.subVectors( v1, v0 );
		f1.subVectors( v2, v1 );
		f2.subVectors( v0, v2 );

		// test against axes that are given by cross product combinations of the edges of the triangle and the edges of the aabb
		// make an axis testing of each of the 3 sides of the aabb against each of the 3 sides of the triangle = 9 axis of separation
		// axis_ij = u_i x f_j (u0, u1, u2 = face normals of aabb = x,y,z axes vectors since aabb is axis aligned)
		var axes = [
			0, - f0.z, f0.y, 0, - f1.z, f1.y, 0, - f2.z, f2.y,
			f0.z, 0, - f0.x, f1.z, 0, - f1.x, f2.z, 0, - f2.x,
			- f0.y, f0.x, 0, - f1.y, f1.x, 0, - f2.y, f2.x, 0
		];
		if ( ! satForAxes( axes, v0, v1, v2, extents ) ) {

			return false;

		}

		// test 3 face normals from the aabb
		axes = [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ];
		if ( ! satForAxes( axes, v0, v1, v2, extents ) ) {

			return false;

		}

		// finally testing the face normal of the triangle
		// use already existing triangle edge vectors here
		triangleNormal.crossVectors( f0, f1 );
		axes = [ triangleNormal.x, triangleNormal.y, triangleNormal.z ];

		return satForAxes( axes, v0, v1, v2, extents );

	},

	clampPoint: function ( point, target ) {

		if ( target === undefined ) {

			console.warn( 'THREE.Box3: .clampPoint() target is now required' );
			target = new Vector3();

		}

		return target.copy( point ).clamp( this.min, this.max );

	},

	distanceToPoint: function ( point ) {

		if ( vector === undefined ) vector = new Vector3();

		var clampedPoint = vector.copy( point ).clamp( this.min, this.max );

		return clampedPoint.sub( point ).length();

	},

	getBoundingSphere: function ( target ) {

		if ( vector === undefined ) vector = new Vector3();

		if ( target === undefined ) {

			console.error( 'THREE.Box3: .getBoundingSphere() target is now required' );
			//target = new Sphere(); // removed to avoid cyclic dependency

		}

		this.getCenter( target.center );

		target.radius = this.getSize( vector ).length() * 0.5;

		return target;

	},

	intersect: function ( box ) {

		this.min.max( box.min );
		this.max.min( box.max );

		// ensure that if there is no overlap, the result is fully empty, not slightly empty with non-inf/+inf values that will cause subsequence intersects to erroneously return valid values.
		if ( this.isEmpty() ) this.makeEmpty();

		return this;

	},

	union: function ( box ) {

		this.min.min( box.min );
		this.max.max( box.max );

		return this;

	},

	applyMatrix4: function ( matrix ) {

		if ( points === undefined ) {

			points = [
				new Vector3(),
				new Vector3(),
				new Vector3(),
				new Vector3(),
				new Vector3(),
				new Vector3(),
				new Vector3(),
				new Vector3()
			];

		}

		// transform of empty box is an empty box.
		if ( this.isEmpty() ) return this;

		// NOTE: I am using a binary pattern to specify all 2^3 combinations below
		points[ 0 ].set( this.min.x, this.min.y, this.min.z ).applyMatrix4( matrix ); // 000
		points[ 1 ].set( this.min.x, this.min.y, this.max.z ).applyMatrix4( matrix ); // 001
		points[ 2 ].set( this.min.x, this.max.y, this.min.z ).applyMatrix4( matrix ); // 010
		points[ 3 ].set( this.min.x, this.max.y, this.max.z ).applyMatrix4( matrix ); // 011
		points[ 4 ].set( this.max.x, this.min.y, this.min.z ).applyMatrix4( matrix ); // 100
		points[ 5 ].set( this.max.x, this.min.y, this.max.z ).applyMatrix4( matrix ); // 101
		points[ 6 ].set( this.max.x, this.max.y, this.min.z ).applyMatrix4( matrix ); // 110
		points[ 7 ].set( this.max.x, this.max.y, this.max.z ).applyMatrix4( matrix ); // 111

		this.setFromPoints( points );

		return this;

	},

	translate: function ( offset ) {

		this.min.add( offset );
		this.max.add( offset );

		return this;

	},

	equals: function ( box ) {

		return box.min.equals( this.min ) && box.max.equals( this.max );

	}

} );

var testAxis;

function satForAxes( axes, v0, v1, v2, extents ) {

	if ( testAxis === undefined ) testAxis = new Vector3();

	var i, j;

	for ( i = 0, j = axes.length - 3; i <= j; i += 3 ) {

		testAxis.fromArray( axes, i );
		// project the aabb onto the seperating axis
		var r = extents.x * Math.abs( testAxis.x ) + extents.y * Math.abs( testAxis.y ) + extents.z * Math.abs( testAxis.z );
		// project all 3 vertices of the triangle onto the seperating axis
		var p0 = v0.dot( testAxis );
		var p1 = v1.dot( testAxis );
		var p2 = v2.dot( testAxis );
		// actual test, basically see if either of the most extreme of the triangle points intersects r
		if ( Math.max( - Math.max( p0, p1, p2 ), Math.min( p0, p1, p2 ) ) > r ) {

			// points of the projected triangle are outside the projected half-length of the aabb
			// the axis is seperating and we can exit
			return false;

		}

	}

	return true;

}

export { Box3 };
