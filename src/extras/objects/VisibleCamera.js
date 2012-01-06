/**
 * @author alteredq / http://alteredqualia.com/
 *
 *	- shows frustum, line of sight and up of the camera
 *	- suitable for fast updates
 * 	- based on frustum visualization in lightgl.js shadowmap example
 *		http://evanw.github.com/lightgl.js/tests/shadowmap.html
 */

THREE.VisibleCamera = function ( camera ) {

	THREE.Object3D.call( this );

	var _this = this;

	this.lineGeometry = new THREE.Geometry();
	this.lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors } );

	this.pointMap = {};

	// colors

	var hexFrustum = 0xffaa00,
	hexCone	   	   = 0xff0000,
	hexUp	   	   = 0x00aaff,
	hexTarget  	   = 0xffffff,
	hexCross   	   = 0x333333;

	// near

	addLine( "n1", "n2", hexFrustum );
	addLine( "n2", "n4", hexFrustum );
	addLine( "n4", "n3", hexFrustum );
	addLine( "n3", "n1", hexFrustum );

	// far

	addLine( "f1", "f2", hexFrustum );
	addLine( "f2", "f4", hexFrustum );
	addLine( "f4", "f3", hexFrustum );
	addLine( "f3", "f1", hexFrustum );

	// sides

	addLine( "n1", "f1", hexFrustum );
	addLine( "n2", "f2", hexFrustum );
	addLine( "n3", "f3", hexFrustum );
	addLine( "n4", "f4", hexFrustum );

	// cone

	addLine( "p", "n1", hexCone );
	addLine( "p", "n2", hexCone );
	addLine( "p", "n3", hexCone );
	addLine( "p", "n4", hexCone );

	// up

	addLine( "u1", "u2", hexUp );
	addLine( "u2", "u3", hexUp );
	addLine( "u3", "u1", hexUp );

	// target

	addLine( "c", "t", hexTarget );
	addLine( "p", "c", hexCross );

	// cross

	addLine( "cn1", "cn2", hexCross );
	addLine( "cn3", "cn4", hexCross );

	addLine( "cf1", "cf2", hexCross );
	addLine( "cf3", "cf4", hexCross );

	function addLine( a, b, hex ) {

		addPoint( a, hex );
		addPoint( b, hex );

	}

	function addPoint( id, hex ) {

		_this.lineGeometry.vertices.push( new THREE.Vertex( new THREE.Vector3() ) );
		_this.lineGeometry.colors.push( new THREE.Color( hex ) );

		if ( _this.pointMap[ id ] === undefined ) _this.pointMap[ id ] = [];
		_this.pointMap[ id ].push( _this.lineGeometry.vertices.length - 1 );

	}

	this.update( camera );

	this.lines = new THREE.Line( this.lineGeometry, this.lineMaterial, THREE.LinePieces );
	this.add( this.lines );

};

THREE.VisibleCamera.prototype = new THREE.Object3D();
THREE.VisibleCamera.prototype.constructor = THREE.VisibleCamera;

THREE.VisibleCamera.prototype.update = function ( camera ) {

	var w = 1;
	var h = 1;

	var _this = this;

	// we need just camera projection matrix
	// world matrix must be identity

	THREE.VisibleCamera.__c.projectionMatrix.copy( camera.projectionMatrix );

	// center / target

	setPoint( "c", 0, 0, 0 );
	setPoint( "t", 0, 0, 1 );

	// near

	setPoint( "n1", -w, -h, 0 );
	setPoint( "n2",  w, -h, 0 );
	setPoint( "n3", -w,  h, 0 );
	setPoint( "n4",  w,  h, 0 );

	// far

	setPoint( "f1", -w, -h, 1 );
	setPoint( "f2",  w, -h, 1 );
	setPoint( "f3", -w,  h, 1 );
	setPoint( "f4",  w,  h, 1 );

	// up

	setPoint( "u1",  w * 0.7, h * 1.1, 0 );
	setPoint( "u2", -w * 0.7, h * 1.1, 0 );
	setPoint( "u3",        0, h * 2,   0 );

	// cross

	setPoint( "cf1", -w,  0, 1 );
	setPoint( "cf2",  w,  0, 1 );
	setPoint( "cf3",  0, -h, 1 );
	setPoint( "cf4",  0,  h, 1 );

	setPoint( "cn1", -w,  0, 0 );
	setPoint( "cn2",  w,  0, 0 );
	setPoint( "cn3",  0, -h, 0 );
	setPoint( "cn4",  0,  h, 0 );

	function setPoint( point, x, y, z ) {

		THREE.VisibleCamera.__v.set( x, y, z );
		THREE.VisibleCamera.__projector.unprojectVector( THREE.VisibleCamera.__v, THREE.VisibleCamera.__c );

		var points = _this.pointMap[ point ];

		if ( points !== undefined ) {

			for ( var i = 0, il = points.length; i < il; i ++ ) {

				var j = points[ i ];
				_this.lineGeometry.vertices[ j ].position.copy( THREE.VisibleCamera.__v );

			}

		}

	}

	this.lineGeometry.__dirtyVertices = true;

};

THREE.VisibleCamera.__projector = new THREE.Projector();
THREE.VisibleCamera.__v = new THREE.Vector3();
THREE.VisibleCamera.__c = new THREE.Camera();

