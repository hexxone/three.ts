/**
 * @author bhouston / http://exocortex.com
 */

module( "Sphere" );

test( "constructor", function() {
	var a = new THREE.Sphere();
	ok( a.center.equals( zero3 ), "Passed!" );
	ok( a.radius == 0, "Passed!" );

	a = new THREE.Sphere( one3, 1 );
	ok( a.center.equals( one3 ), "Passed!" );
	ok( a.radius == 1, "Passed!" );
});

test( "copy", function() {
	var a = new THREE.Sphere( one3, 1 );
	var b = new THREE.Sphere().copy( a );

	ok( b.center.equals( one3 ), "Passed!" );
	ok( b.radius == 1, "Passed!" );

	// ensure that it is a true copy
	a.center = zero3;
	a.radius = 0;
	ok( b.center.equals( one3 ), "Passed!" );
	ok( b.radius == 1, "Passed!" );
});

test( "set", function() {
	var a = new THREE.Sphere();
	ok( a.center.equals( zero3 ), "Passed!" );
	ok( a.radius == 0, "Passed!" );

	a.set( one3, 1 );
	ok( a.center.equals( one3 ), "Passed!" );
	ok( a.radius == 1, "Passed!" );
});

test( "empty", function() {
	var a = new THREE.Sphere();
	ok( a.empty(), "Passed!" );

	a.set( one3, 1 );
	ok( ! a.empty(), "Passed!" );
});

test( "containsPoint", function() {
	var a = new THREE.Sphere( one3, 1 );

	ok( ! a.containsPoint( zero3 ), "Passed!" );
	ok( a.containsPoint( one3 ), "Passed!" );
});

test( "distanceToPoint", function() {
	var a = new THREE.Sphere( one3, 1 );

	ok( ( a.distanceToPoint( zero3 ) - 0.7320 ) < 0.001, "Passed!" );
	ok( a.distanceToPoint( one3 ) === -1, "Passed!" );
});

test( "isIntersectionSphere", function() {
	var a = new THREE.Sphere( one3, 1 );
	var b = new THREE.Sphere( zero3, 1 );
	var c = new THREE.Sphere( zero3, 0.25 );

	ok( a.isIntersectionSphere( b ) , "Passed!" );
	ok( ! a.isIntersectionSphere( c ) , "Passed!" );
});

test( "clampPoint", function() {
	var a = new THREE.Sphere( one3, 1 );

	ok( a.clampPoint( new THREE.Vector3( 1, 1, 3 ) ).equals( new THREE.Vector3( 1, 1, 2 ) ), "Passed!" );
	ok( a.clampPoint( new THREE.Vector3( 1, 1, -3 ) ).equals( new THREE.Vector3( 1, 1, 0 ) ), "Passed!" );
});

test( "getBoundingBox", function() {
	var a = new THREE.Sphere( one3, 1 );

	ok( a.getBoundingBox().equals( new THREE.Box3( zero3, two3 ) ), "Passed!" );

	a.set( zero3, 0 )
	ok( a.getBoundingBox().equals( new THREE.Box3( zero3, zero3 ) ), "Passed!" );
});

test( "transform", function() {
	var a = new THREE.Sphere( one3, 1 );

	var m = new THREE.Matrix4();
	var t1 = new THREE.Vector3( 1, -2, 1 );
	m.makeTranslation( t1 );

	ok( a.clone().transform( m ).getBoundingBox().equals( a.getBoundingBox().transform( m ) ), "Passed!" );
});

test( "translate", function() {
	var a = new THREE.Sphere( one3, 1 );

	a.translate( one3.clone().negate() );
	ok( a.center.equals( zero3 ), "Passed!" );
});
