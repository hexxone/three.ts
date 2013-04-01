/**
 * @author mrdoob / http://mrdoob.com/
 *
 * parameters = {
 *   canvas: canvas,
 *   contextAttributes: {
 *     alpha: true,
 *     depth: true,
 *     stencil: false,
 *     antialias: true,
 *     premultipliedAlpha: true,
 *     preserveDrawingBuffer: false
 *   }
 * }
 *
 */

THREE.WebGLRenderer3 = function ( parameters ) {

	console.log( 'THREE.WebGLRenderer3', THREE.REVISION );

	parameters = parameters || {};

	var canvas = parameters.canvas !== undefined ? parameters.canvas : document.createElement( 'canvas' );

	var gl;

	try {

		var attributes = parameters.contextAttributes || {}

		gl = canvas.getContext( 'webgl', attributes ) || canvas.getContext( 'experimental-webgl', attributes );

	} catch ( exception ) {

		console.error( exception );

	}

	var extensions = {};

	if ( gl !== null ) {

		extensions.element_index_uint = gl.getExtension( 'OES_element_index_uint' );
		extensions.texture_float = gl.getExtension( 'OES_texture_float' );
		extensions.standard_derivatives = gl.getExtension( 'OES_standard_derivatives' );
		extensions.texture_filter_anisotropic = gl.getExtension( 'EXT_texture_filter_anisotropic' ) || gl.getExtension( 'MOZ_EXT_texture_filter_anisotropic' ) || gl.getExtension( 'WEBKIT_EXT_texture_filter_anisotropic' );
		extensions.compressed_texture_s3tc = gl.getExtension( 'WEBGL_compressed_texture_s3tc' ) || gl.getExtension( 'MOZ_WEBGL_compressed_texture_s3tc' ) || gl.getExtension( 'WEBKIT_WEBGL_compressed_texture_s3tc' );

		gl.clearColor( 0, 0, 0, 1 );
		gl.clearDepth( 1 );
		gl.clearStencil( 0 );

		gl.enable( gl.DEPTH_TEST );
		gl.depthFunc( gl.LEQUAL );

		gl.enable( gl.CULL_FACE );
		gl.frontFace( gl.CCW );
		gl.cullFace( gl.BACK );

		gl.enable( gl.BLEND );
		gl.blendEquation( gl.FUNC_ADD );
		gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

		gl.clearColor( 1, 0, 0, 1 );

	}

	//

	var modelViewMatrix = new THREE.Matrix4();

	// buffers

	var buffers = {};

	var getBuffer = function ( geometry ) {

		if ( buffers[ geometry.id ] !== undefined ) {

			return buffers[ geometry.id ];

		}

		var vertices = geometry.vertices;
		var faces = geometry.faces;

		var positions = [];

		function addVertex( vertex ) {

			positions.push( vertex.x, vertex.y, vertex.z );

		}

		for ( var i = 0, l = faces.length; i < l; i ++ ) {

			var face = faces[ i ];

			addVertex( vertices[ face.a ] );
			addVertex( vertices[ face.b ] );
			addVertex( vertices[ face.c ] );

			if ( face instanceof THREE.Face4 ) {

				addVertex( vertices[ face.a ] );
				addVertex( vertices[ face.c ] );
				addVertex( vertices[ face.d ] );

			}

		}

		var buffer = {
			data: gl.createBuffer(),
			count: positions.length / 3
		};

		gl.bindBuffer( gl.ARRAY_BUFFER, buffer.data );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( positions ), gl.STATIC_DRAW );

		buffers[ geometry.id ] = buffer;

		return buffer;

	};

	// programs

	var programs = {};

	var getProgram = function ( material ) {

		if ( programs[ material.id ] !== undefined ) {

			return programs[ material.id ];

		}

		var program = gl.createProgram();

		var vertexShader = [
			'uniform mat4 modelViewMatrix;',
			'uniform mat4 projectionMatrix;',
			'attribute vec3 position;',
			'void main() {',
			'	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
			'}'
		].join( '\n' );
		var fragmentShader = [
			'void main() {',
			'	gl_FragColor = vec4(0,1,0,1);',
			'}'
		].join( '\n' );

		gl.attachShader( program, createShader( gl.VERTEX_SHADER, vertexShader ) );
		gl.attachShader( program, createShader( gl.FRAGMENT_SHADER, fragmentShader ) );
		gl.linkProgram( program );

		if ( gl.getProgramParameter( program, gl.LINK_STATUS ) === true ) {

			programs[ material.id ] = program;

		} else {

			programs[ material.id ] = null;
			console.error( 'VALIDATE_STATUS: ' + gl.getProgramParameter( program, gl.VALIDATE_STATUS ) );
			console.error( 'GL_ERROR: ' + gl.getError() );

		}

		return program;

	};

	var createShader = function ( type, string ) {

		var shader = gl.createShader( type );

		gl.shaderSource( shader, string );
		gl.compileShader( shader );

		if ( gl.getShaderParameter( shader, gl.COMPILE_STATUS ) === true ) {

			// console.log( string );

		} else {

			console.error( gl.getShaderInfoLog( shader ), string );
			return null;

		}

		return shader;

	};

	this.domElement = canvas;
	this.extensions = extensions;

	this.setSize = function ( width, height ) {

		canvas.width = width;
		canvas.height = height;

		gl.viewport( 0, 0, canvas.width, canvas.height );

	};

	this.clear = function ( color, depth, stencil ) {

		var bits = 0;

		if ( color === undefined || color ) bits |= gl.COLOR_BUFFER_BIT;
		if ( depth === undefined || depth ) bits |= gl.DEPTH_BUFFER_BIT;
		if ( stencil === undefined || stencil ) bits |= gl.STENCIL_BUFFER_BIT;

		gl.clear( bits );

	};

	this.render = function ( scene, camera ) {

		this.clear();

		scene.updateMatrixWorld();

		if ( camera.parent === undefined ) camera.updateMatrixWorld();

		camera.matrixWorldInverse.getInverse( camera.matrixWorld );

		var currentBuffer, currentProgram;
		var locations = {};

		for ( var i = 0, l = scene.children.length; i < l; i ++ ) {

			var object = scene.children[ i ];

			var program = getProgram( object.material );

			if ( program !== currentProgram ) {

				gl.useProgram( program );

				locations.position = gl.getAttribLocation( program, 'position' );
				locations.modelViewMatrix = gl.getUniformLocation( program, 'modelViewMatrix' );
				locations.projectionMatrix = gl.getUniformLocation( program, 'projectionMatrix' );

				gl.uniformMatrix4fv( locations.projectionMatrix, false, camera.projectionMatrix.elements );

				currentProgram = program;

			}

			var buffer = getBuffer( object.geometry );

			if ( buffer !== currentBuffer ) {

				gl.bindBuffer( gl.ARRAY_BUFFER, buffer.data );
				gl.enableVertexAttribArray( locations.position );
				gl.vertexAttribPointer( locations.position, 3, gl.FLOAT, false, 0, 0 );

				currentBuffer = buffer;

			}

			modelViewMatrix.multiplyMatrices( camera.matrixWorldInverse, object.matrixWorld );

			gl.uniformMatrix4fv( locations.modelViewMatrix, false, modelViewMatrix.elements );

			gl.drawArrays( gl.TRIANGLES, 0, buffer.count );

		}

	};

};
