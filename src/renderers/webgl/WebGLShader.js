THREE.WebGLShader = ( function () {

	var addLineNumbers = function ( string ) {

		var lines = string.split( '\n' );

		for ( var i = 0; i < lines.length; i ++ ) {

			lines[ i ] = ( i + 1 ) + ': ' + lines[ i ];

		}

		return lines.join( '\n' );

	};

	return function ( gl, type, string ) {

		var shader; 

		if ( type === 'vertex' ) {

			shader = gl.createShader( gl.VERTEX_SHADER );

		} else if ( type === 'fragment' ) {

			shader = gl.createShader( gl.FRAGMENT_SHADER );

		} else {

			console.error( 'THREE.WebGLShader:', 'Unrecognised shader type', type );
			return null;

		}

		gl.shaderSource( shader, string );
		gl.compileShader( shader );

		/*
		if ( gl.getShaderParameter( shader, gl.COMPILE_STATUS ) === false ) {


		}
		*/

		if ( gl.getShaderInfoLog( shader ) !== '' ) {

			console.error( 'THREE.WebGLShader:', 'gl.getShaderInfoLog()', gl.getShaderInfoLog( shader ) );
			console.error( addLineNumbers( string ) );

		}

		return shader;

	};

} )();