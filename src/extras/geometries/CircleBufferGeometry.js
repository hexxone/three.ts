/**
 * @author benaadams / https://twitter.com/ben_a_adams
 */

THREE.CircleBufferGeometry = function ( radius, segments, thetaStart, thetaLength ) {

	THREE.BufferGeometry.call( this );

	this.type = 'CircleBufferGeometry';

	this.parameters = {
		radius: radius,
		segments: segments,
		thetaStart: thetaStart,
		thetaLength: thetaLength
	};

	radius = radius || 50;
	segments = segments !== undefined ? Math.max( 3, segments ) : 8;

	thetaStart = thetaStart !== undefined ? thetaStart : 0;
	thetaLength = thetaLength !== undefined ? thetaLength : Math.PI * 2;

	var i;
	var vertices = segments + 2;

	var positions = new Float32Array( 3 * vertices );
	this.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
	var normals = new Float32Array( 3 * vertices );
	this.addAttribute( 'normal', new THREE.BufferAttribute( normals, 3 ) );
	var uvs = new Float32Array( 2 * vertices );
	this.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );

	// center data is already zero, but need to set a few extras
	normals[3] = 1.0;
	uvs[0] = 0.5;
	uvs[1] = 0.5;

	for ( s = 0, i = 3, ii = 2 ; s < vertices; s++, i += 3, ii += 2 ) {

		var segment = thetaStart + s / segments * thetaLength;

		positions[i] = radius * Math.cos( segment ); 
		positions[i + 1] = radius * Math.sin( segment );

		normals[i + 2] = 1; // normal z

		uvs[ii] = ( positions[i] / radius + 1 ) / 2; 
		uvs[ii + 1] = ( positions[i + 1] / radius + 1 ) / 2; 

	}

	var indices = [];

	for ( i = 1; i <= segments; i ++ ) {

		indices.push( i );
		indices.push( i + 1 );
		indices.push( 0 );

	}

	this.addAttribute( 'index', new THREE.BufferAttribute( new Uint16Array( indices ), 1 ) );

	this.computeFaceNormals();

	this.boundingSphere = new THREE.Sphere( new THREE.Vector3(), radius );

};

THREE.CircleBufferGeometry.prototype = Object.create( THREE.BufferGeometry.prototype );
THREE.CircleBufferGeometry.prototype.constructor = THREE.CircleBufferGeometry;
