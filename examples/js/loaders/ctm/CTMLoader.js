/**
 * Loader for CTM encoded models generated by OpenCTM tools:
 *	http://openctm.sourceforge.net/
 *
 * Uses js-openctm library by Juan Mellado
 *	http://code.google.com/p/js-openctm/
 *
 * @author alteredq / http://alteredqualia.com/
 */

THREE.CTMLoader = function ( showStatus ) {

	THREE.Loader.call( this, showStatus );

};

THREE.CTMLoader.prototype = Object.create( THREE.Loader.prototype );

// Load multiple CTM parts defined in JSON

THREE.CTMLoader.prototype.loadParts = function( url, callback, parameters ) {

	parameters = parameters || {};

	var scope = this;

	var xhr = new XMLHttpRequest();

	var basePath = parameters.basePath ? parameters.basePath : this.extractUrlBase( url );

	xhr.onreadystatechange = function() {

		if ( xhr.readyState === 4 ) {

			if ( xhr.status === 200 || xhr.status === 0 ) {

				var jsonObject = JSON.parse( xhr.responseText );

				var materials = [], geometries = [], counter = 0;

				function callbackFinal( geometry ) {

					counter += 1;

					geometries.push( geometry );

					if ( counter === jsonObject.offsets.length ) {

						callback( geometries, materials );

					}

				}


				// init materials

				for ( var i = 0; i < jsonObject.materials.length; i ++ ) {

					materials[ i ] = scope.createMaterial( jsonObject.materials[ i ], basePath );

				}

				// load joined CTM file

				var partUrl = basePath + jsonObject.data;
				var parametersPart = { useWorker: parameters.useWorker, offsets: jsonObject.offsets };
				scope.load( partUrl, callbackFinal, parametersPart );

			}

		}

	}

	xhr.open( "GET", url, true );
	xhr.setRequestHeader( "Content-Type", "text/plain" );
	xhr.send( null );

};

// Load CTMLoader compressed models
//	- parameters
//		- url (required)
//		- callback (required)

THREE.CTMLoader.prototype.load = function( url, callback, parameters ) {

	parameters = parameters || {};

	var scope = this;

	var offsets = parameters.offsets !== undefined ? parameters.offsets : [ 0 ];

	var xhr = new XMLHttpRequest(),
		callbackProgress = null;

	var length = 0;

	xhr.onreadystatechange = function() {

		if ( xhr.readyState === 4 ) {

			if ( xhr.status === 200 || xhr.status === 0 ) {

				var binaryData = new Uint8Array(xhr.response);

				var s = Date.now();

				if ( parameters.useWorker ) {

					var worker = new Worker( "js/loaders/ctm/CTMWorker.js" );

					worker.onmessage = function( event ) {

						var files = event.data;

						for ( var i = 0; i < files.length; i ++ ) {

							var ctmFile = files[ i ];

							var e1 = Date.now();
							// console.log( "CTM data parse time [worker]: " + (e1-s) + " ms" );

							scope.createModel( ctmFile, callback );

							var e = Date.now();
							console.log( "model load time [worker]: " + (e-e1) + " ms, total: " + (e-s));

						}


					};

					worker.postMessage( { "data": binaryData, "offsets": offsets } );

				} else {

					for ( var i = 0; i < offsets.length; i ++ ) {

						var stream = new CTM.Stream( binaryData );
						stream.offset = offsets[ i ];

						var ctmFile = new CTM.File( stream );

						scope.createModel( ctmFile, callback );

					}

					//var e = Date.now();
					//console.log( "CTM data parse time [inline]: " + (e-s) + " ms" );

				}

			} else {

				console.error( "Couldn't load [" + url + "] [" + xhr.status + "]" );

			}

		} else if ( xhr.readyState === 3 ) {

			if ( callbackProgress ) {

				if ( length === 0 ) {

					length = xhr.getResponseHeader( "Content-Length" );

				}

				callbackProgress( { total: length, loaded: xhr.responseText.length } );

			}

		} else if ( xhr.readyState === 2 ) {

			length = xhr.getResponseHeader( "Content-Length" );

		}

	}

	xhr.open( "GET", url, true );
	xhr.responseType = "arraybuffer";

	xhr.send( null );

};


THREE.CTMLoader.prototype.createModel = function ( file, callback ) {

	var Model = function ( ) {

		THREE.BufferGeometry.call( this );

		this.materials = [];

		// init GL buffers
		var indices = file.body.indices,
		positions = file.body.vertices,
		normals = file.body.normals;

		var uvs, colors;

		if ( file.body.uvMaps !== undefined && file.body.uvMaps.length > 0 ) {
			uvs = file.body.uvMaps[ 0 ].uv;
		}

		if ( file.body.attrMaps !== undefined && file.body.attrMaps.length > 0 && file.body.attrMaps[ 0 ].name === "Color" ) {
			colors = file.body.attrMaps[ 0 ].attr;
		}

		this.addAttribute( 'index', new THREE.Uint32Attribute( indices.length, 1 ).set( indices ) );
		this.addAttribute( 'position', new THREE.Float32Attribute( positions.length, 3 ).set( positions ) );

		if ( normals !== undefined ) 
			this.addAttribute( 'normal', new THREE.Float32Attribute( normals.length, 3 ).set( normals ) );

		if ( uvs !== undefined ) 
			this.addAttribute( 'uv', new THREE.Float32Attribute( uvs.length, 2 ).set( uvs ) );

		if ( colors !== undefined ) 
			this.addAttribute( 'color', new THREE.Float32Attribute( colors.length, 4 ).set( colors ) );

	}

	Model.prototype = Object.create( THREE.BufferGeometry.prototype );

	var geometry = new Model();

	geometry.computeOffsets();

	// compute vertex normals if not present in the CTM model
	if ( geometry.attributes[ "normal" ] === undefined ) {
		geometry.computeVertexNormals();
	}

	callback( geometry );

};