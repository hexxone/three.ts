/**
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author szimek / https://github.com/szimek/
 */

THREE.WebGLRenderer = function ( parameters ) {

	// Currently you can use just up to 4 directional / point lights total.
	// Chrome barfs on shader linking when there are more than 4 lights :(

	// The problem comes from shader using too many varying vectors.

	// This is not GPU limitation as the same shader works ok in Firefox
	// and Chrome with "--use-gl=desktop" flag.

	// Difference comes from Chrome on Windows using by default ANGLE,
	// thus going DirectX9 route (while FF uses OpenGL).

	// See http://code.google.com/p/chromium/issues/detail?id=63491

	var _gl,
	_canvas = document.createElement( 'canvas' ),
	_currentProgram = null,
	_currentFramebuffer = null,
	_currentDepthMask = true,

	_this = this,

	// gl state cache

	_oldDoubleSided = null,
	_oldFlipSided = null,
	_oldBlending = null,
	_oldDepth = null,
	_cullEnabled = true,

	_viewportX = 0,
	_viewportY = 0,
	_viewportWidth = 0,
	_viewportHeight = 0,

	// camera matrices caches

	_frustum = [
		new THREE.Vector4(),
		new THREE.Vector4(),
		new THREE.Vector4(),
		new THREE.Vector4(),
		new THREE.Vector4(),
		new THREE.Vector4()
	 ],

	_projScreenMatrix = new THREE.Matrix4(),
	_projectionMatrixArray = new Float32Array( 16 ),
	_viewMatrixArray = new Float32Array( 16 ),

	_vector3 = new THREE.Vector4(),

	// light arrays cache

	_lights = {

		ambient: [ 0, 0, 0 ],
		directional: { length: 0, colors: new Array(), positions: new Array() },
		point: { length: 0, colors: new Array(), positions: new Array(), distances: new Array() }

	},

	// parameters defaults

	stencil = true,
	antialias = true,
	clearColor = new THREE.Color( 0x000000 ),
	clearAlpha = 0;

	if ( parameters ) {

		if ( parameters.stencil != undefined ) stencil = parameters.stencil;
		if ( parameters.antialias !== undefined ) antialias = parameters.antialias;
		if ( parameters.clearColor !== undefined ) clearColor.setHex( parameters.clearColor );
		if ( parameters.clearAlpha !== undefined ) clearAlpha = parameters.clearAlpha;

	}

	this.maxMorphTargets = 8;
	this.domElement = _canvas;
	this.autoClear = true;
	this.sortObjects = true;

	initGL( antialias, clearColor, clearAlpha, stencil );

	this.context = _gl;


	// prepare stencil shadow polygon

	if( stencil ) {
		
		var _stencilShadow      = {};
		
		_stencilShadow.vertices = new Float32Array( 12 );
		_stencilShadow.faces    = new Uint16Array( 6 );
		_stencilShadow.darkness = 0.5;
		
		_stencilShadow.vertices[ 0 * 3 + 0 ] = -2; _stencilShadow.vertices[ 0 * 3 + 1 ] = -1; _stencilShadow.vertices[ 0 * 3 + 2 ] = -1;
		_stencilShadow.vertices[ 1 * 3 + 0 ] =  2; _stencilShadow.vertices[ 1 * 3 + 1 ] = -1; _stencilShadow.vertices[ 1 * 3 + 2 ] = -1;
		_stencilShadow.vertices[ 2 * 3 + 0 ] =  2; _stencilShadow.vertices[ 2 * 3 + 1 ] =  1; _stencilShadow.vertices[ 2 * 3 + 2 ] = -1;
		_stencilShadow.vertices[ 3 * 3 + 0 ] = -2; _stencilShadow.vertices[ 3 * 3 + 1 ] =  1; _stencilShadow.vertices[ 3 * 3 + 2 ] = -1;
		
		_stencilShadow.faces[ 0 ] = 0; _stencilShadow.faces[ 1 ] = 1; _stencilShadow.faces[ 2 ] = 2;
		_stencilShadow.faces[ 3 ] = 0; _stencilShadow.faces[ 4 ] = 2; _stencilShadow.faces[ 5 ] = 3;
	
	
		_stencilShadow.vertexBuffer  = _gl.createBuffer();
		_stencilShadow.elementBuffer = _gl.createBuffer();
		
		_gl.bindBuffer( _gl.ARRAY_BUFFER, _stencilShadow.vertexBuffer );
		_gl.bufferData( _gl.ARRAY_BUFFER,  _stencilShadow.vertices, _gl.STATIC_DRAW );
	
		_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, _stencilShadow.elementBuffer );
		_gl.bufferData( _gl.ELEMENT_ARRAY_BUFFER, _stencilShadow.faces, _gl.STATIC_DRAW );
		
	
		_stencilShadow.program = _gl.createProgram();
	
		_gl.attachShader( _stencilShadow.program, getShader( "fragment", THREE.ShaderLib.shadowPost.fragmentShader ));
		_gl.attachShader( _stencilShadow.program, getShader( "vertex",   THREE.ShaderLib.shadowPost.vertexShader   ));
	
		_gl.linkProgram( _stencilShadow.program );
	
		_stencilShadow.vertexLocation     = _gl.getAttribLocation ( _stencilShadow.program, "position"         );
		_stencilShadow.projectionLocation = _gl.getUniformLocation( _stencilShadow.program, "projectionMatrix" );
		_stencilShadow.darknessLocation   = _gl.getUniformLocation( _stencilShadow.program, "darkness"         );
	}
	
	
	// prepare lens flare
	
	var _lensFlare = {};
	var i;
	
	_lensFlare.vertices     = new Float32Array( 8 + 8 );
	_lensFlare.faces        = new Uint16Array( 6 );
	_lensFlare.transparency = 0.5;
	
	i = 0;
	_lensFlare.vertices[ i++ ] = -1; _lensFlare.vertices[ i++ ] = -1;	// vertex
	_lensFlare.vertices[ i++ ] = 0;  _lensFlare.vertices[ i++ ] = 0;	// uv... etc.
	_lensFlare.vertices[ i++ ] = 1;  _lensFlare.vertices[ i++ ] = -1;
	_lensFlare.vertices[ i++ ] = 1;  _lensFlare.vertices[ i++ ] = 0;
	_lensFlare.vertices[ i++ ] = 1;  _lensFlare.vertices[ i++ ] = 1;
	_lensFlare.vertices[ i++ ] = 1;  _lensFlare.vertices[ i++ ] = 1;
	_lensFlare.vertices[ i++ ] = -1; _lensFlare.vertices[ i++ ] = 1;
	_lensFlare.vertices[ i++ ] = 0;  _lensFlare.vertices[ i++ ] = 1;

	i = 0;
	_lensFlare.faces[ i++ ] = 0; _lensFlare.faces[ i++ ] = 1; _lensFlare.faces[ i++ ] = 2;
	_lensFlare.faces[ i++ ] = 0; _lensFlare.faces[ i++ ] = 2; _lensFlare.faces[ i++ ] = 3;

	_lensFlare.vertexBuffer  = _gl.createBuffer();
	_lensFlare.elementBuffer = _gl.createBuffer();
	_lensFlare.tempTexture   = _gl.createTexture();
	_lensFlare.readBackPixels = new Uint8Array( 16*16*4 );
	
	_gl.bindBuffer( _gl.ARRAY_BUFFER, _lensFlare.vertexBuffer );
	_gl.bufferData( _gl.ARRAY_BUFFER,  _lensFlare.vertices, _gl.STATIC_DRAW );

	_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, _lensFlare.elementBuffer );
	_gl.bufferData( _gl.ELEMENT_ARRAY_BUFFER, _lensFlare.faces, _gl.STATIC_DRAW );

	_gl.bindTexture( _gl.TEXTURE_2D, _lensFlare.tempTexture );
	_gl.texImage2D( _gl.TEXTURE_2D, 0, _gl.RGB, 16, 16, 0, _gl.RGB, _gl.UNSIGNED_BYTE, null );
	_gl.texParameteri( _gl.TEXTURE_2D, _gl.TEXTURE_WRAP_S, _gl.CLAMP_TO_EDGE );
	_gl.texParameteri( _gl.TEXTURE_2D, _gl.TEXTURE_WRAP_T, _gl.CLAMP_TO_EDGE );
	_gl.texParameteri( _gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, _gl.NEAREST );
	_gl.texParameteri( _gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, _gl.NEAREST );


	_lensFlare.program = _gl.createProgram();

	_gl.attachShader( _lensFlare.program, getShader( "fragment", THREE.ShaderLib.lensFlare.fragmentShader ));
	_gl.attachShader( _lensFlare.program, getShader( "vertex",   THREE.ShaderLib.lensFlare.vertexShader   ));

	_gl.linkProgram( _lensFlare.program );

	_lensFlare.attributes = {};
	_lensFlare.uniforms = {};
	_lensFlare.attributes.vertex       = _gl.getAttribLocation ( _lensFlare.program, "position" );
	_lensFlare.attributes.uv           = _gl.getAttribLocation ( _lensFlare.program, "UV" );
	_lensFlare.uniforms.map            = _gl.getUniformLocation( _lensFlare.program, "map" );
	_lensFlare.uniforms.opacity        = _gl.getUniformLocation( _lensFlare.program, "opacity" );
	_lensFlare.uniforms.scale          = _gl.getUniformLocation( _lensFlare.program, "scale" );
	_lensFlare.uniforms.rotation       = _gl.getUniformLocation( _lensFlare.program, "rotation" );
	_lensFlare.uniforms.screenPosition = _gl.getUniformLocation( _lensFlare.program, "screenPosition" );
	_lensFlare.uniforms.renderPink     = _gl.getUniformLocation( _lensFlare.program, "renderPink" );




	this.setSize = function ( width, height ) {

		_canvas.width = width;
		_canvas.height = height;

		this.setViewport( 0, 0, _canvas.width, _canvas.height );

	};

	this.setViewport = function ( x, y, width, height ) {

		_viewportX = x;
		_viewportY = y;

		_viewportWidth = width;
		_viewportHeight = height;

		_gl.viewport( _viewportX, _viewportY, _viewportWidth, _viewportHeight );

	};

	this.setScissor = function ( x, y, width, height ) {

		_gl.scissor( x, y, width, height );

	};

	this.enableScissorTest = function ( enable ) {

		if ( enable )
			_gl.enable( _gl.SCISSOR_TEST );
		else
			_gl.disable( _gl.SCISSOR_TEST );

	};

	this.enableDepthBufferWrite = function ( enable ) {

		_currentDepthMask = enable;
		_gl.depthMask( enable );

	};

	this.setClearColorHex = function ( hex, alpha ) {

		var color = new THREE.Color( hex );
		_gl.clearColor( color.r, color.g, color.b, alpha );

	};

	this.setClearColor = function ( color, alpha ) {

		_gl.clearColor( color.r, color.g, color.b, alpha );

	};

	this.clear = function () {

		_gl.clear( _gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT | _gl.STENCIL_BUFFER_BIT );

	};

	this.setStencilShadowDarkness = function( value ) {
		
		_stencilShadow.darkness = value;
	};


	function setupLights ( program, lights ) {

		var l, ll, light, r = 0, g = 0, b = 0,
		color, position, intensity, distance,

		zlights = _lights,

		dcolors = zlights.directional.colors,
		dpositions = zlights.directional.positions,

		pcolors = zlights.point.colors,
		ppositions = zlights.point.positions,
		pdistances = zlights.point.distances,

		dlength = 0,
		plength = 0,

		doffset = 0,
		poffset = 0;

		for ( l = 0, ll = lights.length; l < ll; l++ ) {

			light = lights[ l ];
			color = light.color;

			position = light.position;
			intensity = light.intensity;
			distance = light.distance;

			if ( light instanceof THREE.AmbientLight ) {

				r += color.r;
				g += color.g;
				b += color.b;

			} else if ( light instanceof THREE.DirectionalLight ) {

				doffset = dlength * 3;

				dcolors[ doffset ] = color.r * intensity;
				dcolors[ doffset + 1 ] = color.g * intensity;
				dcolors[ doffset + 2 ] = color.b * intensity;

				dpositions[ doffset ] = position.x;
				dpositions[ doffset + 1 ] = position.y;
				dpositions[ doffset + 2 ] = position.z;

				dlength += 1;

			} else if( light instanceof THREE.PointLight ) {

				poffset = plength * 3;

				pcolors[ poffset ] = color.r * intensity;
				pcolors[ poffset + 1 ] = color.g * intensity;
				pcolors[ poffset + 2 ] = color.b * intensity;

				ppositions[ poffset ] = position.x;
				ppositions[ poffset + 1 ] = position.y;
				ppositions[ poffset + 2 ] = position.z;

				pdistances[ plength ] = distance;

				plength += 1;

			}

		}

		// null eventual remains from removed lights
		// (this is to avoid if in shader)

		for( l = dlength * 3; l < dcolors.length; l++ ) dcolors[ l ] = 0.0;
		for( l = plength * 3; l < pcolors.length; l++ ) pcolors[ l ] = 0.0;

		zlights.point.length = plength;
		zlights.directional.length = dlength;

		zlights.ambient[ 0 ] = r;
		zlights.ambient[ 1 ] = g;
		zlights.ambient[ 2 ] = b;

	};

	function createParticleBuffers ( geometry ) {

		geometry.__webglVertexBuffer = _gl.createBuffer();
		geometry.__webglColorBuffer = _gl.createBuffer();

	};

	function createLineBuffers( geometry ) {

		geometry.__webglVertexBuffer = _gl.createBuffer();
		geometry.__webglColorBuffer = _gl.createBuffer();

	};

	function createRibbonBuffers( geometry ) {

		geometry.__webglVertexBuffer = _gl.createBuffer();
		geometry.__webglColorBuffer = _gl.createBuffer();

	};

	function createMeshBuffers( geometryGroup ) {

		geometryGroup.__webglVertexBuffer = _gl.createBuffer();
		geometryGroup.__webglNormalBuffer = _gl.createBuffer();
		geometryGroup.__webglTangentBuffer = _gl.createBuffer();
		geometryGroup.__webglColorBuffer = _gl.createBuffer();
		geometryGroup.__webglUVBuffer = _gl.createBuffer();
		geometryGroup.__webglUV2Buffer = _gl.createBuffer();

		geometryGroup.__webglSkinVertexABuffer = _gl.createBuffer();
		geometryGroup.__webglSkinVertexBBuffer = _gl.createBuffer();
		geometryGroup.__webglSkinIndicesBuffer = _gl.createBuffer();
		geometryGroup.__webglSkinWeightsBuffer = _gl.createBuffer();

		geometryGroup.__webglFaceBuffer = _gl.createBuffer();
		geometryGroup.__webglLineBuffer = _gl.createBuffer();

		if ( geometryGroup.numMorphTargets ) {

			var m, ml;
			geometryGroup.__webglMorphTargetsBuffers = []; 

			for ( m = 0, ml = geometryGroup.numMorphTargets; m < ml; m++ ) {

				geometryGroup.__webglMorphTargetsBuffers.push( _gl.createBuffer() );

			}

		}

	};

	function initLineBuffers ( geometry ) {

		var nvertices = geometry.vertices.length;

		geometry.__vertexArray = new Float32Array( nvertices * 3 );
		geometry.__colorArray = new Float32Array( nvertices * 3 );

		geometry.__webglLineCount = nvertices;

	};

	function initRibbonBuffers ( geometry ) {

		var nvertices = geometry.vertices.length;

		geometry.__vertexArray = new Float32Array( nvertices * 3 );
		geometry.__colorArray = new Float32Array( nvertices * 3 );

		geometry.__webglVertexCount = nvertices;

	};

	function initParticleBuffers ( geometry ) {

		var nvertices = geometry.vertices.length;

		geometry.__vertexArray = new Float32Array( nvertices * 3 );
		geometry.__colorArray = new Float32Array( nvertices * 3 );

		geometry.__sortArray = [];

		geometry.__webglParticleCount = nvertices;

	};

	function initMeshBuffers ( geometryGroup, object ) {

		var f, fl, fi, face,
		nvertices = 0, ntris = 0, nlines = 0,

		uvType,
		vertexColorType,
		normalType,
		materials,

		geometry = object.geometry,
		obj_faces = geometry.faces,
		chunk_faces = geometryGroup.faces;

		for ( f = 0, fl = chunk_faces.length; f < fl; f++ ) {

			fi = chunk_faces[ f ];
			face = obj_faces[ fi ];

			if ( face instanceof THREE.Face3 ) {

				nvertices += 3;
				ntris += 1;
				nlines += 3;

			} else if ( face instanceof THREE.Face4 ) {

				nvertices += 4;
				ntris += 2;
				nlines += 4;

			}

		}

		materials = unrollGroupMaterials( geometryGroup, object );

		uvType = bufferGuessUVType( materials, geometryGroup, object );
		normalType = bufferGuessNormalType( materials, geometryGroup, object );
		vertexColorType = bufferGuessVertexColorType( materials, geometryGroup, object );

		//console.log("uvType",uvType, "normalType",normalType, "vertexColorType",vertexColorType, object, geometryGroup, materials );

		geometryGroup.__vertexArray = new Float32Array( nvertices * 3 );

		if ( normalType ) {

			geometryGroup.__normalArray = new Float32Array( nvertices * 3 );

		}

		if ( geometry.hasTangents ) {

			geometryGroup.__tangentArray = new Float32Array( nvertices * 4 );

		}

		if ( vertexColorType ) {

			geometryGroup.__colorArray = new Float32Array( nvertices * 3 );

		}

		if ( uvType ) {

			if ( geometry.faceUvs.length > 0 || geometry.faceVertexUvs.length > 0 ) {

				geometryGroup.__uvArray = new Float32Array( nvertices * 2 );

			}

			if ( geometry.faceUvs.length > 1 || geometry.faceVertexUvs.length > 1 ) {

				geometryGroup.__uv2Array = new Float32Array( nvertices * 2 );

			}

		}

		if ( object.geometry.skinWeights.length && object.geometry.skinIndices.length ) {

			geometryGroup.__skinVertexAArray = new Float32Array( nvertices * 4 );
			geometryGroup.__skinVertexBArray = new Float32Array( nvertices * 4 );
			geometryGroup.__skinIndexArray = new Float32Array( nvertices * 4 );
			geometryGroup.__skinWeightArray = new Float32Array( nvertices * 4 );

		}

		geometryGroup.__faceArray = new Uint16Array( ntris * 3 + ( object.geometry.edgeFaces ? object.geometry.edgeFaces.length * 2 * 3 : 0 ));
		geometryGroup.__lineArray = new Uint16Array( nlines * 2 );

		if ( geometryGroup.numMorphTargets ) {

			var m, ml;
			geometryGroup.__morphTargetsArrays = []; 

			for ( m = 0, ml = geometryGroup.numMorphTargets; m < ml; m++ ) {

				geometryGroup.__morphTargetsArrays.push( new Float32Array( nvertices * 3 ) );

			}

		}

		geometryGroup.__needsSmoothNormals = ( normalType == THREE.SmoothShading );

		geometryGroup.__uvType = uvType;
		geometryGroup.__vertexColorType = vertexColorType;
		geometryGroup.__normalType = normalType;

		geometryGroup.__webglFaceCount = ntris * 3 + ( object.geometry.edgeFaces ? object.geometry.edgeFaces.length * 2 * 3 : 0 );
		geometryGroup.__webglLineCount = nlines * 2;

	};

	function setMeshBuffers ( geometryGroup, object, hint ) {

		var f, fl, fi, face, 
		vertexNormals, faceNormal, normal,
		vertexColors, faceColor,
		vertexTangents,
		uvType, vertexColorType, normalType,
		uv, uv2, v1, v2, v3, v4, t1, t2, t3, t4,
		c1, c2, c3, c4,
		sw1, sw2, sw3, sw4,
		si1, si2, si3, si4,
		sa1, sa2, sa3, sa4,
		sb1, sb2, sb3, sb4,
		m, ml, i,
		vn, uvi, uv2i,
		vk, vkl, vka,

		vertexIndex = 0,

		offset = 0,
		offset_uv = 0,
		offset_uv2 = 0,
		offset_face = 0,
		offset_normal = 0,
		offset_tangent = 0,
		offset_line = 0,
		offset_color = 0,
		offset_skin = 0,
		offset_morphTarget = 0,

		vertexArray = geometryGroup.__vertexArray,
		uvArray = geometryGroup.__uvArray,
		uv2Array = geometryGroup.__uv2Array,
		normalArray = geometryGroup.__normalArray,
		tangentArray = geometryGroup.__tangentArray,
		colorArray = geometryGroup.__colorArray,

		skinVertexAArray = geometryGroup.__skinVertexAArray,
		skinVertexBArray = geometryGroup.__skinVertexBArray,
		skinIndexArray = geometryGroup.__skinIndexArray,
		skinWeightArray = geometryGroup.__skinWeightArray,

		morphTargetsArrays = geometryGroup.__morphTargetsArrays,

		faceArray = geometryGroup.__faceArray,
		lineArray = geometryGroup.__lineArray,

		needsSmoothNormals = geometryGroup.__needsSmoothNormals,

		vertexColorType = geometryGroup.__vertexColorType,
		uvType = geometryGroup.__uvType,
		normalType = geometryGroup.__normalType,

		geometry = object.geometry, // this is shared for all chunks

		dirtyVertices = geometry.__dirtyVertices,
		dirtyElements = geometry.__dirtyElements,
		dirtyUvs = geometry.__dirtyUvs,
		dirtyNormals = geometry.__dirtyNormals,
		dirtyTangents = geometry.__dirtyTangents,
		dirtyColors = geometry.__dirtyColors,
		dirtyMorphTargets = geometry.__dirtyMorphTargets,

		vertices = geometry.vertices,
		chunk_faces = geometryGroup.faces,
		obj_faces = geometry.faces,

		obj_uvs  = geometry.faceVertexUvs[ 0 ],
		obj_uvs2 = geometry.faceVertexUvs[ 1 ],

		obj_colors = geometry.colors,

		obj_skinVerticesA = geometry.skinVerticesA,
		obj_skinVerticesB = geometry.skinVerticesB,
		obj_skinIndices = geometry.skinIndices,
		obj_skinWeights = geometry.skinWeights,
		obj_edgeFaces = geometry.edgeFaces,

		morphTargets = geometry.morphTargets;

		for ( f = 0, fl = chunk_faces.length; f < fl; f ++ ) {

			fi = chunk_faces[ f ];
			face = obj_faces[ fi ];

			if ( obj_uvs ) {

				uv = obj_uvs[ fi ];

			}

			if ( obj_uvs2 ) {

				uv2 = obj_uvs2[ fi ];

			}

			vertexNormals = face.vertexNormals;
			faceNormal = face.normal;

			vertexColors = face.vertexColors;
			faceColor = face.color;

			vertexTangents = face.vertexTangents;

			if ( face instanceof THREE.Face3 ) {

				if ( dirtyVertices ) {

					v1 = vertices[ face.a ].position;
					v2 = vertices[ face.b ].position;
					v3 = vertices[ face.c ].position;

					vertexArray[ offset ]     = v1.x;
					vertexArray[ offset + 1 ] = v1.y;
					vertexArray[ offset + 2 ] = v1.z;

					vertexArray[ offset + 3 ] = v2.x;
					vertexArray[ offset + 4 ] = v2.y;
					vertexArray[ offset + 5 ] = v2.z;

					vertexArray[ offset + 6 ] = v3.x;
					vertexArray[ offset + 7 ] = v3.y;
					vertexArray[ offset + 8 ] = v3.z;

					offset += 9;

				}

				if ( dirtyMorphTargets ) {

					for ( vk = 0, vkl = morphTargets.length; vk < vkl; vk ++ ) {

						v1 = morphTargets[ vk ].vertices[ face.a ].position;
						v2 = morphTargets[ vk ].vertices[ face.b ].position;
						v3 = morphTargets[ vk ].vertices[ face.c ].position;

						vka = morphTargetsArrays[ vk ];

						vka[ offset_morphTarget + 0 ] = v1.x;
						vka[ offset_morphTarget + 1 ] = v1.y;
						vka[ offset_morphTarget + 2 ] = v1.z;

						vka[ offset_morphTarget + 3 ] = v2.x;
						vka[ offset_morphTarget + 4 ] = v2.y;
						vka[ offset_morphTarget + 5 ] = v2.z;

						vka[ offset_morphTarget + 6 ] = v3.x;
						vka[ offset_morphTarget + 7 ] = v3.y;
						vka[ offset_morphTarget + 8 ] = v3.z;
					}

					offset_morphTarget += 9;

				}

				if ( obj_skinWeights.length ) {

					// weights

					sw1 = obj_skinWeights[ face.a ];
					sw2 = obj_skinWeights[ face.b ];
					sw3 = obj_skinWeights[ face.c ];

					skinWeightArray[ offset_skin ]     = sw1.x;
					skinWeightArray[ offset_skin + 1 ] = sw1.y;
					skinWeightArray[ offset_skin + 2 ] = sw1.z;
					skinWeightArray[ offset_skin + 3 ] = sw1.w;

					skinWeightArray[ offset_skin + 4 ] = sw2.x;
					skinWeightArray[ offset_skin + 5 ] = sw2.y;
					skinWeightArray[ offset_skin + 6 ] = sw2.z;
					skinWeightArray[ offset_skin + 7 ] = sw2.w;

					skinWeightArray[ offset_skin + 8 ]  = sw3.x;
					skinWeightArray[ offset_skin + 9 ]  = sw3.y;
					skinWeightArray[ offset_skin + 10 ] = sw3.z;
					skinWeightArray[ offset_skin + 11 ] = sw3.w;

					// indices

					si1 = obj_skinIndices[ face.a ];
					si2 = obj_skinIndices[ face.b ];
					si3 = obj_skinIndices[ face.c ];

					skinIndexArray[ offset_skin ]     = si1.x;
					skinIndexArray[ offset_skin + 1 ] = si1.y;
					skinIndexArray[ offset_skin + 2 ] = si1.z;
					skinIndexArray[ offset_skin + 3 ] = si1.w;

					skinIndexArray[ offset_skin + 4 ] = si2.x;
					skinIndexArray[ offset_skin + 5 ] = si2.y;
					skinIndexArray[ offset_skin + 6 ] = si2.z;
					skinIndexArray[ offset_skin + 7 ] = si2.w;

					skinIndexArray[ offset_skin + 8 ]  = si3.x;
					skinIndexArray[ offset_skin + 9 ]  = si3.y;
					skinIndexArray[ offset_skin + 10 ] = si3.z;
					skinIndexArray[ offset_skin + 11 ] = si3.w;

					// vertices A

					sa1 = obj_skinVerticesA[ face.a ];
					sa2 = obj_skinVerticesA[ face.b ];
					sa3 = obj_skinVerticesA[ face.c ];

					skinVertexAArray[ offset_skin ]     = sa1.x;
					skinVertexAArray[ offset_skin + 1 ] = sa1.y;
					skinVertexAArray[ offset_skin + 2 ] = sa1.z;
					skinVertexAArray[ offset_skin + 3 ] = 1; // pad for faster vertex shader

					skinVertexAArray[ offset_skin + 4 ] = sa2.x;
					skinVertexAArray[ offset_skin + 5 ] = sa2.y;
					skinVertexAArray[ offset_skin + 6 ] = sa2.z;
					skinVertexAArray[ offset_skin + 7 ] = 1;

					skinVertexAArray[ offset_skin + 8 ]  = sa3.x;
					skinVertexAArray[ offset_skin + 9 ]  = sa3.y;
					skinVertexAArray[ offset_skin + 10 ] = sa3.z;
					skinVertexAArray[ offset_skin + 11 ] = 1;

					// vertices B

					sb1 = obj_skinVerticesB[ face.a ];
					sb2 = obj_skinVerticesB[ face.b ];
					sb3 = obj_skinVerticesB[ face.c ];

					skinVertexBArray[ offset_skin ]     = sb1.x;
					skinVertexBArray[ offset_skin + 1 ] = sb1.y;
					skinVertexBArray[ offset_skin + 2 ] = sb1.z;
					skinVertexBArray[ offset_skin + 3 ] = 1; // pad for faster vertex shader

					skinVertexBArray[ offset_skin + 4 ] = sb2.x;
					skinVertexBArray[ offset_skin + 5 ] = sb2.y;
					skinVertexBArray[ offset_skin + 6 ] = sb2.z;
					skinVertexBArray[ offset_skin + 7 ] = 1;

					skinVertexBArray[ offset_skin + 8 ]  = sb3.x;
					skinVertexBArray[ offset_skin + 9 ]  = sb3.y;
					skinVertexBArray[ offset_skin + 10 ] = sb3.z;
					skinVertexBArray[ offset_skin + 11 ] = 1;

					offset_skin += 12;

				}

				if ( dirtyColors && vertexColorType ) {

					if ( vertexColors.length == 3 && vertexColorType == THREE.VertexColors ) {

						c1 = vertexColors[ 0 ];
						c2 = vertexColors[ 1 ];
						c3 = vertexColors[ 2 ];

					} else {

						c1 = faceColor;
						c2 = faceColor;
						c3 = faceColor;

					}

					colorArray[ offset_color ]     = c1.r;
					colorArray[ offset_color + 1 ] = c1.g;
					colorArray[ offset_color + 2 ] = c1.b;

					colorArray[ offset_color + 3 ] = c2.r;
					colorArray[ offset_color + 4 ] = c2.g;
					colorArray[ offset_color + 5 ] = c2.b;

					colorArray[ offset_color + 6 ] = c3.r;
					colorArray[ offset_color + 7 ] = c3.g;
					colorArray[ offset_color + 8 ] = c3.b;

					offset_color += 9;

				}

				if ( dirtyTangents && geometry.hasTangents ) {

					t1 = vertexTangents[ 0 ];
					t2 = vertexTangents[ 1 ];
					t3 = vertexTangents[ 2 ];

					tangentArray[ offset_tangent ]     = t1.x;
					tangentArray[ offset_tangent + 1 ] = t1.y;
					tangentArray[ offset_tangent + 2 ] = t1.z;
					tangentArray[ offset_tangent + 3 ] = t1.w;

					tangentArray[ offset_tangent + 4 ] = t2.x;
					tangentArray[ offset_tangent + 5 ] = t2.y;
					tangentArray[ offset_tangent + 6 ] = t2.z;
					tangentArray[ offset_tangent + 7 ] = t2.w;

					tangentArray[ offset_tangent + 8 ]  = t3.x;
					tangentArray[ offset_tangent + 9 ]  = t3.y;
					tangentArray[ offset_tangent + 10 ] = t3.z;
					tangentArray[ offset_tangent + 11 ] = t3.w;

					offset_tangent += 12;

				}

				if ( dirtyNormals && normalType ) {

					if ( vertexNormals.length == 3 && needsSmoothNormals ) {

						for ( i = 0; i < 3; i ++ ) {

							vn = vertexNormals[ i ];

							normalArray[ offset_normal ]     = vn.x;
							normalArray[ offset_normal + 1 ] = vn.y;
							normalArray[ offset_normal + 2 ] = vn.z;

							offset_normal += 3;

						}

					} else {

						for ( i = 0; i < 3; i ++ ) {

							normalArray[ offset_normal ]     = faceNormal.x;
							normalArray[ offset_normal + 1 ] = faceNormal.y;
							normalArray[ offset_normal + 2 ] = faceNormal.z;

							offset_normal += 3;

						}

					}

				}

				if ( dirtyUvs && uv !== undefined && uvType ) {

					for ( i = 0; i < 3; i ++ ) {

						uvi = uv[ i ];

						uvArray[ offset_uv ]     = uvi.u;
						uvArray[ offset_uv + 1 ] = uvi.v;

						offset_uv += 2;

					}

				}

				if ( dirtyUvs && uv2 !== undefined && uvType ) {

					for ( i = 0; i < 3; i ++ ) {

						uv2i = uv2[ i ];

						uv2Array[ offset_uv2 ]     = uv2i.u;
						uv2Array[ offset_uv2 + 1 ] = uv2i.v;

						offset_uv2 += 2;

					}

				}

				if ( dirtyElements ) {

					faceArray[ offset_face ] = vertexIndex;
					faceArray[ offset_face + 1 ] = vertexIndex + 1;
					faceArray[ offset_face + 2 ] = vertexIndex + 2;

					offset_face += 3;

					lineArray[ offset_line ]     = vertexIndex;
					lineArray[ offset_line + 1 ] = vertexIndex + 1;

					lineArray[ offset_line + 2 ] = vertexIndex;
					lineArray[ offset_line + 3 ] = vertexIndex + 2;

					lineArray[ offset_line + 4 ] = vertexIndex + 1;
					lineArray[ offset_line + 5 ] = vertexIndex + 2;

					offset_line += 6;

					vertexIndex += 3;

				}


			} else if ( face instanceof THREE.Face4 ) {

				if ( dirtyVertices ) {

					v1 = vertices[ face.a ].position;
					v2 = vertices[ face.b ].position;
					v3 = vertices[ face.c ].position;
					v4 = vertices[ face.d ].position;

					vertexArray[ offset ]     = v1.x;
					vertexArray[ offset + 1 ] = v1.y;
					vertexArray[ offset + 2 ] = v1.z;

					vertexArray[ offset + 3 ] = v2.x;
					vertexArray[ offset + 4 ] = v2.y;
					vertexArray[ offset + 5 ] = v2.z;

					vertexArray[ offset + 6 ] = v3.x;
					vertexArray[ offset + 7 ] = v3.y;
					vertexArray[ offset + 8 ] = v3.z;

					vertexArray[ offset + 9 ] = v4.x;
					vertexArray[ offset + 10 ] = v4.y;
					vertexArray[ offset + 11 ] = v4.z;

					offset += 12;

				}

				if ( dirtyMorphTargets ) {

					for ( vk = 0, vkl = morphTargets.length; vk < vkl; vk++ ) {

						v1 = morphTargets[ vk ].vertices[ face.a ].position;
						v2 = morphTargets[ vk ].vertices[ face.b ].position;
						v3 = morphTargets[ vk ].vertices[ face.c ].position;
						v4 = morphTargets[ vk ].vertices[ face.d ].position;

						vka = morphTargetsArrays[ vk ];

						vka[ offset_morphTarget + 0 ] = v1.x;
						vka[ offset_morphTarget + 1 ] = v1.y;
						vka[ offset_morphTarget + 2 ] = v1.z;

						vka[ offset_morphTarget + 3 ] = v2.x;
						vka[ offset_morphTarget + 4 ] = v2.y;
						vka[ offset_morphTarget + 5 ] = v2.z;

						vka[ offset_morphTarget + 6 ] = v3.x;
						vka[ offset_morphTarget + 7 ] = v3.y;
						vka[ offset_morphTarget + 8 ] = v3.z;

						vka[ offset_morphTarget + 9 ] = v4.x;
						vka[ offset_morphTarget + 10 ] = v4.y;
						vka[ offset_morphTarget + 11 ] = v4.z;
					}

					offset_morphTarget += 12;

				}

				if ( obj_skinWeights.length ) {

					// weights

					sw1 = obj_skinWeights[ face.a ];
					sw2 = obj_skinWeights[ face.b ];
					sw3 = obj_skinWeights[ face.c ];
					sw4 = obj_skinWeights[ face.d ];

					skinWeightArray[ offset_skin ]     = sw1.x;
					skinWeightArray[ offset_skin + 1 ] = sw1.y;
					skinWeightArray[ offset_skin + 2 ] = sw1.z;
					skinWeightArray[ offset_skin + 3 ] = sw1.w;

					skinWeightArray[ offset_skin + 4 ] = sw2.x;
					skinWeightArray[ offset_skin + 5 ] = sw2.y;
					skinWeightArray[ offset_skin + 6 ] = sw2.z;
					skinWeightArray[ offset_skin + 7 ] = sw2.w;

					skinWeightArray[ offset_skin + 8 ]  = sw3.x;
					skinWeightArray[ offset_skin + 9 ]  = sw3.y;
					skinWeightArray[ offset_skin + 10 ] = sw3.z;
					skinWeightArray[ offset_skin + 11 ] = sw3.w;

					skinWeightArray[ offset_skin + 12 ] = sw4.x;
					skinWeightArray[ offset_skin + 13 ] = sw4.y;
					skinWeightArray[ offset_skin + 14 ] = sw4.z;
					skinWeightArray[ offset_skin + 15 ] = sw4.w;

					// indices

					si1 = obj_skinIndices[ face.a ];
					si2 = obj_skinIndices[ face.b ];
					si3 = obj_skinIndices[ face.c ];
					si4 = obj_skinIndices[ face.d ];

					skinIndexArray[ offset_skin ]     = si1.x;
					skinIndexArray[ offset_skin + 1 ] = si1.y;
					skinIndexArray[ offset_skin + 2 ] = si1.z;
					skinIndexArray[ offset_skin + 3 ] = si1.w;

					skinIndexArray[ offset_skin + 4 ] = si2.x;
					skinIndexArray[ offset_skin + 5 ] = si2.y;
					skinIndexArray[ offset_skin + 6 ] = si2.z;
					skinIndexArray[ offset_skin + 7 ] = si2.w;

					skinIndexArray[ offset_skin + 8 ]  = si3.x;
					skinIndexArray[ offset_skin + 9 ]  = si3.y;
					skinIndexArray[ offset_skin + 10 ] = si3.z;
					skinIndexArray[ offset_skin + 11 ] = si3.w;

					skinIndexArray[ offset_skin + 12 ] = si4.x;
					skinIndexArray[ offset_skin + 13 ] = si4.y;
					skinIndexArray[ offset_skin + 14 ] = si4.z;
					skinIndexArray[ offset_skin + 15 ] = si4.w;

					// vertices A

					sa1 = obj_skinVerticesA[ face.a ];
					sa2 = obj_skinVerticesA[ face.b ];
					sa3 = obj_skinVerticesA[ face.c ];
					sa4 = obj_skinVerticesA[ face.d ];

					skinVertexAArray[ offset_skin ]     = sa1.x;
					skinVertexAArray[ offset_skin + 1 ] = sa1.y;
					skinVertexAArray[ offset_skin + 2 ] = sa1.z;
					skinVertexAArray[ offset_skin + 3 ] = 1; // pad for faster vertex shader

					skinVertexAArray[ offset_skin + 4 ] = sa2.x;
					skinVertexAArray[ offset_skin + 5 ] = sa2.y;
					skinVertexAArray[ offset_skin + 6 ] = sa2.z;
					skinVertexAArray[ offset_skin + 7 ] = 1;

					skinVertexAArray[ offset_skin + 8 ]  = sa3.x;
					skinVertexAArray[ offset_skin + 9 ]  = sa3.y;
					skinVertexAArray[ offset_skin + 10 ] = sa3.z;
					skinVertexAArray[ offset_skin + 11 ] = 1;

					skinVertexAArray[ offset_skin + 12 ] = sa4.x;
					skinVertexAArray[ offset_skin + 13 ] = sa4.y;
					skinVertexAArray[ offset_skin + 14 ] = sa4.z;
					skinVertexAArray[ offset_skin + 15 ] = 1;

					// vertices B

					sb1 = obj_skinVerticesB[ face.a ];
					sb2 = obj_skinVerticesB[ face.b ];
					sb3 = obj_skinVerticesB[ face.c ];
					sb4 = obj_skinVerticesB[ face.d ];

					skinVertexBArray[ offset_skin ]     = sb1.x;
					skinVertexBArray[ offset_skin + 1 ] = sb1.y;
					skinVertexBArray[ offset_skin + 2 ] = sb1.z;
					skinVertexBArray[ offset_skin + 3 ] = 1; // pad for faster vertex shader

					skinVertexBArray[ offset_skin + 4 ] = sb2.x;
					skinVertexBArray[ offset_skin + 5 ] = sb2.y;
					skinVertexBArray[ offset_skin + 6 ] = sb2.z;
					skinVertexBArray[ offset_skin + 7 ] = 1;

					skinVertexBArray[ offset_skin + 8 ]  = sb3.x;
					skinVertexBArray[ offset_skin + 9 ]  = sb3.y;
					skinVertexBArray[ offset_skin + 10 ] = sb3.z;
					skinVertexBArray[ offset_skin + 11 ] = 1;

					skinVertexBArray[ offset_skin + 12 ]  = sb4.x;
					skinVertexBArray[ offset_skin + 13 ]  = sb4.y;
					skinVertexBArray[ offset_skin + 14 ] = sb4.z;
					skinVertexBArray[ offset_skin + 15 ] = 1;

					offset_skin += 16;

				}

				if ( dirtyColors && vertexColorType ) {

					if ( vertexColors.length == 4 && vertexColorType == THREE.VertexColors ) {

						c1 = vertexColors[ 0 ];
						c2 = vertexColors[ 1 ];
						c3 = vertexColors[ 2 ];
						c4 = vertexColors[ 3 ];

					} else {

						c1 = faceColor;
						c2 = faceColor;
						c3 = faceColor;
						c4 = faceColor;

					}

					colorArray[ offset_color ]     = c1.r;
					colorArray[ offset_color + 1 ] = c1.g;
					colorArray[ offset_color + 2 ] = c1.b;

					colorArray[ offset_color + 3 ] = c2.r;
					colorArray[ offset_color + 4 ] = c2.g;
					colorArray[ offset_color + 5 ] = c2.b;

					colorArray[ offset_color + 6 ] = c3.r;
					colorArray[ offset_color + 7 ] = c3.g;
					colorArray[ offset_color + 8 ] = c3.b;

					colorArray[ offset_color + 9 ]  = c4.r;
					colorArray[ offset_color + 10 ] = c4.g;
					colorArray[ offset_color + 11 ] = c4.b;

					offset_color += 12;

				}

				if ( dirtyTangents && geometry.hasTangents ) {

					t1 = vertexTangents[ 0 ];
					t2 = vertexTangents[ 1 ];
					t3 = vertexTangents[ 2 ];
					t4 = vertexTangents[ 3 ];

					tangentArray[ offset_tangent ]     = t1.x;
					tangentArray[ offset_tangent + 1 ] = t1.y;
					tangentArray[ offset_tangent + 2 ] = t1.z;
					tangentArray[ offset_tangent + 3 ] = t1.w;

					tangentArray[ offset_tangent + 4 ] = t2.x;
					tangentArray[ offset_tangent + 5 ] = t2.y;
					tangentArray[ offset_tangent + 6 ] = t2.z;
					tangentArray[ offset_tangent + 7 ] = t2.w;

					tangentArray[ offset_tangent + 8 ] = t3.x;
					tangentArray[ offset_tangent + 9 ] = t3.y;
					tangentArray[ offset_tangent + 10 ] = t3.z;
					tangentArray[ offset_tangent + 11 ] = t3.w;

					tangentArray[ offset_tangent + 12 ] = t4.x;
					tangentArray[ offset_tangent + 13 ] = t4.y;
					tangentArray[ offset_tangent + 14 ] = t4.z;
					tangentArray[ offset_tangent + 15 ] = t4.w;

					offset_tangent += 16;

				}

				if( dirtyNormals && normalType ) {

					if ( vertexNormals.length == 4 && needsSmoothNormals ) {

						for ( i = 0; i < 4; i ++ ) {

							vn = vertexNormals[ i ];

							normalArray[ offset_normal ]     = vn.x;
							normalArray[ offset_normal + 1 ] = vn.y;
							normalArray[ offset_normal + 2 ] = vn.z;

							offset_normal += 3;

						}

					} else {

						for ( i = 0; i < 4; i ++ ) {

							normalArray[ offset_normal ]     = faceNormal.x;
							normalArray[ offset_normal + 1 ] = faceNormal.y;
							normalArray[ offset_normal + 2 ] = faceNormal.z;

							offset_normal += 3;

						}

					}

				}

				if ( dirtyUvs && uv !== undefined && uvType ) {

					for ( i = 0; i < 4; i ++ ) {

						uvi = uv[ i ];

						uvArray[ offset_uv ]     = uvi.u;
						uvArray[ offset_uv + 1 ] = uvi.v;

						offset_uv += 2;

					}

				}

				if ( dirtyUvs && uv2 !== undefined && uvType ) {

					for ( i = 0; i < 4; i ++ ) {

						uv2i = uv2[ i ];

						uv2Array[ offset_uv2 ]     = uv2i.u;
						uv2Array[ offset_uv2 + 1 ] = uv2i.v;

						offset_uv2 += 2;

					}

				}

				if ( dirtyElements ) {

					faceArray[ offset_face ]     = vertexIndex;
					faceArray[ offset_face + 1 ] = vertexIndex + 1;
					faceArray[ offset_face + 2 ] = vertexIndex + 3;

					faceArray[ offset_face + 3 ] = vertexIndex + 1;
					faceArray[ offset_face + 4 ] = vertexIndex + 2;
					faceArray[ offset_face + 5 ] = vertexIndex + 3;

					offset_face += 6;

					lineArray[ offset_line ]     = vertexIndex;
					lineArray[ offset_line + 1 ] = vertexIndex + 1;

					lineArray[ offset_line + 2 ] = vertexIndex;
					lineArray[ offset_line + 3 ] = vertexIndex + 3;

					lineArray[ offset_line + 4 ] = vertexIndex + 1;
					lineArray[ offset_line + 5 ] = vertexIndex + 2;

					lineArray[ offset_line + 6 ] = vertexIndex + 2;
					lineArray[ offset_line + 7 ] = vertexIndex + 3;

					offset_line += 8;

					vertexIndex += 4;

				}

			}

		}

		if ( obj_edgeFaces ) {

			for ( f = 0, fl = obj_edgeFaces.length; f < fl; f ++ ) {

				faceArray[ offset_face ]     = obj_edgeFaces[ f ].a;
				faceArray[ offset_face + 1 ] = obj_edgeFaces[ f ].b;
				faceArray[ offset_face + 2 ] = obj_edgeFaces[ f ].c;

				faceArray[ offset_face + 3 ] = obj_edgeFaces[ f ].a;
				faceArray[ offset_face + 4 ] = obj_edgeFaces[ f ].c;
				faceArray[ offset_face + 5 ] = obj_edgeFaces[ f ].d;

				offset_face += 6;
			}

		}

		if ( dirtyVertices ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglVertexBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, vertexArray, hint );

		}

		if ( dirtyMorphTargets ) {

			for ( vk = 0, vkl = morphTargets.length; vk < vkl; vk ++ ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglMorphTargetsBuffers[ vk ] );
				_gl.bufferData( _gl.ARRAY_BUFFER, morphTargetsArrays[ vk ], hint );

			}
		}

		if ( dirtyColors && offset_color > 0 ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglColorBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, colorArray, hint );

		}

		if ( dirtyNormals ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglNormalBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, normalArray, hint );

		}

		if ( dirtyTangents && geometry.hasTangents ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglTangentBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, tangentArray, hint );

		}

		if ( dirtyUvs && offset_uv > 0 ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglUVBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, uvArray, hint );

		}

		if ( dirtyUvs && offset_uv2 > 0 ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglUV2Buffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, uv2Array, hint );

		}

		if ( dirtyElements ) {

			_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, geometryGroup.__webglFaceBuffer );
			_gl.bufferData( _gl.ELEMENT_ARRAY_BUFFER, faceArray, hint );

			_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, geometryGroup.__webglLineBuffer );
			_gl.bufferData( _gl.ELEMENT_ARRAY_BUFFER, lineArray, hint );

		}

		if ( offset_skin > 0 ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglSkinVertexABuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, skinVertexAArray, hint );

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglSkinVertexBBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, skinVertexBArray, hint );

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglSkinIndicesBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, skinIndexArray, hint );

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglSkinWeightsBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, skinWeightArray, hint );

		}

	};

	function setLineBuffers ( geometry, hint ) {

		var v, c, vertex, offset,
		vertices = geometry.vertices,
		colors = geometry.colors,
		vl = vertices.length,
		cl = colors.length,

		vertexArray = geometry.__vertexArray,
		colorArray = geometry.__colorArray,

		dirtyVertices = geometry.__dirtyVertices,
		dirtyColors = geometry.__dirtyColors;

		if ( dirtyVertices ) {

			for ( v = 0; v < vl; v++ ) {

				vertex = vertices[ v ].position;

				offset = v * 3;

				vertexArray[ offset ]     = vertex.x;
				vertexArray[ offset + 1 ] = vertex.y;
				vertexArray[ offset + 2 ] = vertex.z;

			}

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometry.__webglVertexBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, vertexArray, hint );

		}

		if ( dirtyColors ) {

			for ( c = 0; c < cl; c++ ) {

				color = colors[ c ];

				offset = c * 3;

				colorArray[ offset ]     = color.r;
				colorArray[ offset + 1 ] = color.g;
				colorArray[ offset + 2 ] = color.b;

			}

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometry.__webglColorBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, colorArray, hint );

		}

	};

	function setRibbonBuffers ( geometry, hint ) {

		var v, c, vertex, offset,
		vertices = geometry.vertices,
		colors = geometry.colors,
		vl = vertices.length,
		cl = colors.length,

		vertexArray = geometry.__vertexArray,
		colorArray = geometry.__colorArray,

		dirtyVertices = geometry.__dirtyVertices,
		dirtyColors = geometry.__dirtyColors;

		if ( dirtyVertices ) {

			for ( v = 0; v < vl; v++ ) {

				vertex = vertices[ v ].position;

				offset = v * 3;

				vertexArray[ offset ]     = vertex.x;
				vertexArray[ offset + 1 ] = vertex.y;
				vertexArray[ offset + 2 ] = vertex.z;

			}

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometry.__webglVertexBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, vertexArray, hint );

		}

		if ( dirtyColors ) {

			for ( c = 0; c < cl; c++ ) {

				color = colors[ c ];

				offset = c * 3;

				colorArray[ offset ]     = color.r;
				colorArray[ offset + 1 ] = color.g;
				colorArray[ offset + 2 ] = color.b;

			}

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometry.__webglColorBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, colorArray, hint );

		}

	};

	function setParticleBuffers ( geometry, hint, object ) {

		var v, c, vertex, offset,
		vertices = geometry.vertices,
		vl = vertices.length,

		colors = geometry.colors,
		cl = colors.length,

		vertexArray = geometry.__vertexArray,
		colorArray = geometry.__colorArray,

		sortArray = geometry.__sortArray,

		dirtyVertices = geometry.__dirtyVertices,
		dirtyElements = geometry.__dirtyElements,
		dirtyColors = geometry.__dirtyColors;

		if ( object.sortParticles ) {

			_projScreenMatrix.multiplySelf( object.matrixWorld );

			for ( v = 0; v < vl; v++ ) {

				vertex = vertices[ v ].position;

				_vector3.copy( vertex );
				_projScreenMatrix.multiplyVector3( _vector3 );

				sortArray[ v ] = [ _vector3.z, v ];

			}

			sortArray.sort( function(a,b) { return b[0] - a[0]; } );

			for ( v = 0; v < vl; v++ ) {

				vertex = vertices[ sortArray[v][1] ].position;

				offset = v * 3;

				vertexArray[ offset ]     = vertex.x;
				vertexArray[ offset + 1 ] = vertex.y;
				vertexArray[ offset + 2 ] = vertex.z;

			}

			for ( c = 0; c < cl; c++ ) {

				offset = c * 3;

				color = colors[ sortArray[c][1] ];

				colorArray[ offset ]     = color.r;
				colorArray[ offset + 1 ] = color.g;
				colorArray[ offset + 2 ] = color.b;

			}


		} else {

			if ( dirtyVertices ) {

				for ( v = 0; v < vl; v++ ) {

					vertex = vertices[ v ].position;

					offset = v * 3;

					vertexArray[ offset ]     = vertex.x;
					vertexArray[ offset + 1 ] = vertex.y;
					vertexArray[ offset + 2 ] = vertex.z;

				}

			}

			if ( dirtyColors ) {

				for ( c = 0; c < cl; c++ ) {

					color = colors[ c ];

					offset = c * 3;

					colorArray[ offset ]     = color.r;
					colorArray[ offset + 1 ] = color.g;
					colorArray[ offset + 2 ] = color.b;

				}

			}

		}

		if ( dirtyVertices || object.sortParticles ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometry.__webglVertexBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, vertexArray, hint );

		}

		if ( dirtyColors || object.sortParticles ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometry.__webglColorBuffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, colorArray, hint );

		}

	};

	function setMaterialShaders( material, shaders ) {

		material.uniforms = Uniforms.clone( shaders.uniforms );
		material.vertexShader = shaders.vertexShader;
		material.fragmentShader = shaders.fragmentShader;

	};

	function refreshUniformsCommon( uniforms, material ) {

		uniforms.diffuse.value.setRGB( material.color.r, material.color.g, material.color.b );
		uniforms.opacity.value = material.opacity;
		uniforms.map.texture = material.map;

		uniforms.lightMap.texture = material.lightMap;

		uniforms.envMap.texture = material.envMap;
		uniforms.reflectivity.value = material.reflectivity;
		uniforms.refractionRatio.value = material.refractionRatio;
		uniforms.combine.value = material.combine;
		uniforms.useRefract.value = material.envMap && material.envMap.mapping instanceof THREE.CubeRefractionMapping;

	};

	function refreshUniformsLine( uniforms, material ) {

		uniforms.diffuse.value.setRGB( material.color.r, material.color.g, material.color.b );
		uniforms.opacity.value = material.opacity;

	};

	function refreshUniformsParticle( uniforms, material ) {

		uniforms.psColor.value.setRGB( material.color.r, material.color.g, material.color.b );
		uniforms.opacity.value = material.opacity;
		uniforms.size.value = material.size;
		uniforms.scale.value = _canvas.height / 2.0; // TODO: Cache this.
		uniforms.map.texture = material.map;

	};

	function refreshUniformsFog( uniforms, fog ) {

		uniforms.fogColor.value.setHex( fog.color.hex );

		if ( fog instanceof THREE.Fog ) {

			uniforms.fogNear.value = fog.near;
			uniforms.fogFar.value = fog.far;

		} else if ( fog instanceof THREE.FogExp2 ) {

			uniforms.fogDensity.value = fog.density;

		}

	};

	function refreshUniformsPhong( uniforms, material ) {

		//uniforms.ambient.value.setHex( material.ambient.hex );
		//uniforms.specular.value.setHex( material.specular.hex );
		uniforms.ambient.value.setRGB( material.ambient.r, material.ambient.g, material.ambient.b );
		uniforms.specular.value.setRGB( material.specular.r, material.specular.g, material.specular.b );
		uniforms.shininess.value = material.shininess;

	};


	function refreshUniformsLights( uniforms, lights ) {

		uniforms.enableLighting.value = lights.directional.length + lights.point.length;
		uniforms.ambientLightColor.value = lights.ambient;
		uniforms.directionalLightColor.value = lights.directional.colors;
		uniforms.directionalLightDirection.value = lights.directional.positions;
		uniforms.pointLightColor.value = lights.point.colors;
		uniforms.pointLightPosition.value = lights.point.positions;
		uniforms.pointLightDistance.value = lights.point.distances;

	};

	this.initMaterial = function ( material, lights, fog, object ) {

		var u, a, identifiers, i, parameters, maxLightCount, maxBones;

		if ( material instanceof THREE.MeshDepthMaterial ) {

			setMaterialShaders( material, THREE.ShaderLib[ 'depth' ] );

		} else if ( material instanceof THREE.ShadowVolumeDynamicMaterial ) {

			setMaterialShaders( material, THREE.ShaderLib[ 'shadowVolumeDynamic' ] );

		} else if ( material instanceof THREE.MeshNormalMaterial ) {

			setMaterialShaders( material, THREE.ShaderLib[ 'normal' ] );

		} else if ( material instanceof THREE.MeshBasicMaterial ) {

			setMaterialShaders( material, THREE.ShaderLib[ 'basic' ] );

		} else if ( material instanceof THREE.MeshLambertMaterial ) {

			setMaterialShaders( material, THREE.ShaderLib[ 'lambert' ] );

		} else if ( material instanceof THREE.MeshPhongMaterial ) {

			setMaterialShaders( material, THREE.ShaderLib[ 'phong' ] );

		} else if ( material instanceof THREE.LineBasicMaterial ) {

			setMaterialShaders( material, THREE.ShaderLib[ 'basic' ] );

		} else if ( material instanceof THREE.ParticleBasicMaterial ) {

			setMaterialShaders( material, THREE.ShaderLib[ 'particle_basic' ] );

		}

		if ( ! material.program ) {

			// heuristics to create shader parameters according to lights in the scene
			// (not to blow over maxLights budget)

			maxLightCount = allocateLights( lights, 4 );

			maxBones = allocateBones( object );

			parameters = {
				map: material.map, envMap: material.envMap, lightMap: material.lightMap, vertexColors: material.vertexColors,
				fog: fog, sizeAttenuation: material.sizeAttenuation,
				skinning: material.skinning,
				morphTargets: material.morphTargets,
				maxDirLights: maxLightCount.directional, maxPointLights: maxLightCount.point,
				maxBones: maxBones
			};

			material.program = buildProgram( material.fragmentShader, material.vertexShader, parameters );

			// load uniforms

			identifiers = [
				'viewMatrix', 'modelViewMatrix', 'projectionMatrix', 'normalMatrix', 'objectMatrix', 'cameraPosition',
				'cameraInverseMatrix', 'boneGlobalMatrices', 'morphTargetInfluences'
			];


			for ( u in material.uniforms ) {

				identifiers.push(u);

			}

			cacheUniformLocations( material.program, identifiers );


			// load attributes

			identifiers = [
				"position", "normal", "uv", "uv2", "tangent", "color",
				"skinVertexA", "skinVertexB", "skinIndex", "skinWeight"
			];

			for ( i = 0; i < this.maxMorphTargets; i++ ) {

				identifiers.push( "morphTarget" + i );

			}

			for ( a in material.attributes ) {

				identifiers.push( a );

			}

			cacheAttributeLocations( material.program, identifiers );

			var attributes = material.program.attributes;

			_gl.enableVertexAttribArray( attributes.position );

			if ( attributes.color >= 0 ) _gl.enableVertexAttribArray( attributes.color );
			if ( attributes.normal >= 0 ) _gl.enableVertexAttribArray( attributes.normal );
			if ( attributes.tangent >= 0 ) _gl.enableVertexAttribArray( attributes.tangent );

			if ( material.skinning &&
				 attributes.skinVertexA >=0 && attributes.skinVertexB >= 0 &&
				 attributes.skinIndex >= 0 && attributes.skinWeight >= 0 ) {

				_gl.enableVertexAttribArray( attributes.skinVertexA );
				_gl.enableVertexAttribArray( attributes.skinVertexB );
				_gl.enableVertexAttribArray( attributes.skinIndex );
				_gl.enableVertexAttribArray( attributes.skinWeight );

			}

			if ( material.morphTargets ) {

				material.numSupportedMorphTargets = 0;

				if ( attributes.morphTarget0 >= 0 ) {

					_gl.enableVertexAttribArray( attributes.morphTarget0 );
					material.numSupportedMorphTargets ++;

				}

				if ( attributes.morphTarget1 >= 0 ) {

					_gl.enableVertexAttribArray( attributes.morphTarget1 );
					material.numSupportedMorphTargets ++;

				}

				if ( attributes.morphTarget2 >= 0 ) {

					_gl.enableVertexAttribArray( attributes.morphTarget2 );
					material.numSupportedMorphTargets ++;
				}

				if ( attributes.morphTarget3 >= 0 ) {

					_gl.enableVertexAttribArray( attributes.morphTarget3 );
					material.numSupportedMorphTargets ++;
				}

				if ( attributes.morphTarget4 >= 0 ) {

					_gl.enableVertexAttribArray( attributes.morphTarget4 );
					material.numSupportedMorphTargets ++;

				}

				if ( attributes.morphTarget5 >= 0 ) {

					_gl.enableVertexAttribArray( attributes.morphTarget5 );
					material.numSupportedMorphTargets ++;
				}

				if ( attributes.morphTarget6 >= 0 ) {

					_gl.enableVertexAttribArray( attributes.morphTarget6 );
					material.numSupportedMorphTargets ++;

				}

				if ( attributes.morphTarget7 >= 0 ) {

					_gl.enableVertexAttribArray( attributes.morphTarget7 );
					material.numSupportedMorphTargets ++;

				}

				object.__webglMorphTargetInfluences = new Float32Array( this.maxMorphTargets );

				for ( var i = 0, il = this.maxMorphTargets; i < il; i ++ ) {

					object.__webglMorphTargetInfluences[ i ] = 0;

				}

			}

		}

		material.__webglProgram = true;

	};

	function setProgram( camera, lights, fog, material, object ) {

		if ( ! material.__webglProgram ) {

			_this.initMaterial( material, lights, fog, object );

		}

		var program = material.program,
			p_uniforms = program.uniforms,
			m_uniforms = material.uniforms;

		if ( program != _currentProgram ) {

			_gl.useProgram( program );
			_currentProgram = program;

		}

		_gl.uniformMatrix4fv( p_uniforms.projectionMatrix, false, _projectionMatrixArray );

		// refresh uniforms common to several materials

		if ( fog && (
			 material instanceof THREE.MeshBasicMaterial ||
			 material instanceof THREE.MeshLambertMaterial ||
			 material instanceof THREE.MeshPhongMaterial ||
			 material instanceof THREE.LineBasicMaterial ||
			 material instanceof THREE.ParticleBasicMaterial )
			) {

			refreshUniformsFog( m_uniforms, fog );

		}

		if ( material instanceof THREE.MeshPhongMaterial ||
			 material instanceof THREE.MeshLambertMaterial ||
			 material.lights ) {

			setupLights( program, lights );
			refreshUniformsLights( m_uniforms, _lights );

		}

		if ( material instanceof THREE.MeshBasicMaterial ||
			 material instanceof THREE.MeshLambertMaterial ||
			 material instanceof THREE.MeshPhongMaterial ) {

			refreshUniformsCommon( m_uniforms, material );

		}

		// refresh single material specific uniforms

		if ( material instanceof THREE.LineBasicMaterial ) {

			refreshUniformsLine( m_uniforms, material );

		} else if ( material instanceof THREE.ParticleBasicMaterial ) {

			refreshUniformsParticle( m_uniforms, material );

		} else if ( material instanceof THREE.MeshPhongMaterial ) {

			refreshUniformsPhong( m_uniforms, material );

		} else if ( material instanceof THREE.MeshDepthMaterial ) {

			m_uniforms.mNear.value = camera.near;
			m_uniforms.mFar.value = camera.far;
			m_uniforms.opacity.value = material.opacity;

		} else if ( material instanceof THREE.MeshNormalMaterial ) {

			m_uniforms.opacity.value = material.opacity;
		}

		// load common uniforms

		loadUniformsGeneric( program, m_uniforms );
		loadUniformsMatrices( p_uniforms, object );

		// load material specific uniforms
		// (shader material also gets them for the sake of genericity)

		if ( material instanceof THREE.MeshShaderMaterial ||
			 material instanceof THREE.MeshPhongMaterial ||
			 material.envMap ) {

			_gl.uniform3f( p_uniforms.cameraPosition, camera.position.x, camera.position.y, camera.position.z );

		}

		if ( material instanceof THREE.MeshShaderMaterial ||
			 material.envMap ||
			 material.skinning ) {

			_gl.uniformMatrix4fv( p_uniforms.objectMatrix, false, object._objectMatrixArray );

		}

		if ( material instanceof THREE.MeshPhongMaterial ||
			 material instanceof THREE.MeshLambertMaterial ||
			 material instanceof THREE.MeshShaderMaterial ||
			 material.skinning ) {

			_gl.uniformMatrix4fv( p_uniforms.viewMatrix, false, _viewMatrixArray );

		}

		if ( material instanceof THREE.ShadowVolumeDynamicMaterial ) {

			var dirLight = m_uniforms.directionalLightDirection.value;

			dirLight[ 0 ] = -lights.position.x;
			dirLight[ 1 ] = -lights.position.y;
			dirLight[ 2 ] = -lights.position.z;

			_gl.uniform3fv( p_uniforms.directionalLightDirection, dirLight );
			_gl.uniformMatrix4fv( p_uniforms.objectMatrix, false, object._objectMatrixArray );
			_gl.uniformMatrix4fv( p_uniforms.viewMatrix, false, _viewMatrixArray );
		}


		if ( material.skinning ) {

			loadUniformsSkinning( p_uniforms, object );

		}

		return program;

	};

	function renderBuffer ( camera, lights, fog, material, geometryGroup, object ) {

		if ( material.opacity == 0 ) return;

		var program, attributes, linewidth, primitives;

		program = setProgram( camera, lights, fog, material, object );

		attributes = program.attributes;

		// vertices

		if ( !material.morphTargets ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglVertexBuffer );
			_gl.vertexAttribPointer( attributes.position, 3, _gl.FLOAT, false, 0, 0 );

		} else {

			setupMorphTargets( material, geometryGroup, object );

		}

		// colors

		if ( attributes.color >= 0 ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglColorBuffer );
			_gl.vertexAttribPointer( attributes.color, 3, _gl.FLOAT, false, 0, 0 );

		}

		// normals

		if ( attributes.normal >= 0 ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglNormalBuffer );
			_gl.vertexAttribPointer( attributes.normal, 3, _gl.FLOAT, false, 0, 0 );

		}

		// tangents

		if ( attributes.tangent >= 0 ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglTangentBuffer );
			_gl.vertexAttribPointer( attributes.tangent, 4, _gl.FLOAT, false, 0, 0 );

		}

		// uvs

		if ( attributes.uv >= 0 ) {

			if ( geometryGroup.__webglUVBuffer ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglUVBuffer );
				_gl.vertexAttribPointer( attributes.uv, 2, _gl.FLOAT, false, 0, 0 );

				_gl.enableVertexAttribArray( attributes.uv );

			} else {

				_gl.disableVertexAttribArray( attributes.uv );

			}

		}

		if ( attributes.uv2 >= 0 ) {

			if ( geometryGroup.__webglUV2Buffer ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglUV2Buffer );
				_gl.vertexAttribPointer( attributes.uv2, 2, _gl.FLOAT, false, 0, 0 );

				_gl.enableVertexAttribArray( attributes.uv2 );

			} else {

				_gl.disableVertexAttribArray( attributes.uv2 );

			}

		}

		if ( material.skinning &&
			 attributes.skinVertexA >= 0 && attributes.skinVertexB >= 0 &&
			 attributes.skinIndex >= 0 && attributes.skinWeight >= 0 ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglSkinVertexABuffer );
			_gl.vertexAttribPointer( attributes.skinVertexA, 4, _gl.FLOAT, false, 0, 0 );

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglSkinVertexBBuffer );
			_gl.vertexAttribPointer( attributes.skinVertexB, 4, _gl.FLOAT, false, 0, 0 );

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglSkinIndicesBuffer );
			_gl.vertexAttribPointer( attributes.skinIndex, 4, _gl.FLOAT, false, 0, 0 );

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglSkinWeightsBuffer );
			_gl.vertexAttribPointer( attributes.skinWeight, 4, _gl.FLOAT, false, 0, 0 );

		}

		// render mesh

		if ( object instanceof THREE.Mesh ) {

			// wireframe

			if ( material.wireframe ) {

				_gl.lineWidth( material.wireframeLinewidth );
				_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, geometryGroup.__webglLineBuffer );
				_gl.drawElements( _gl.LINES, geometryGroup.__webglLineCount, _gl.UNSIGNED_SHORT, 0 );

			// triangles

			} else {

				_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, geometryGroup.__webglFaceBuffer );
				_gl.drawElements( _gl.TRIANGLES, geometryGroup.__webglFaceCount, _gl.UNSIGNED_SHORT, 0 );

			}

		// render lines

		} else if ( object instanceof THREE.Line ) {

			primitives = ( object.type == THREE.LineStrip ) ? _gl.LINE_STRIP : _gl.LINES;

			_gl.lineWidth( material.linewidth );
			_gl.drawArrays( primitives, 0, geometryGroup.__webglLineCount );

		// render particles

		} else if ( object instanceof THREE.ParticleSystem ) {

			_gl.drawArrays( _gl.POINTS, 0, geometryGroup.__webglParticleCount );

		// render ribbon

		} else if ( object instanceof THREE.Ribbon ) {

			_gl.drawArrays( _gl.TRIANGLE_STRIP, 0, geometryGroup.__webglVertexCount );

		}

	};


	function setupMorphTargets( material, geometryGroup, object ) {

		// set base

		var attributes = material.program.attributes;

		if(  object.morphTargetBase !== -1 ) {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglMorphTargetsBuffers[ object.morphTargetBase ] );
			_gl.vertexAttribPointer( attributes.position, 3, _gl.FLOAT, false, 0, 0 );

		} else {

			_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglVertexBuffer );
			_gl.vertexAttribPointer( attributes.position, 3, _gl.FLOAT, false, 0, 0 );

		}

		if( object.morphTargetForcedOrder.length ) {

			// set forced order

			var m = 0;
			var order = object.morphTargetForcedOrder;
			var influences = object.morphTargetInfluences;

			while ( m < material.numSupportedMorphTargets && m < order.length ) {

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglMorphTargetsBuffers[ order[ m ] ] );
				_gl.vertexAttribPointer( attributes[ "morphTarget" + m ], 3, _gl.FLOAT, false, 0, 0 );

				object.__webglMorphTargetInfluences[ m ] = influences[ order[ m ]];

				m ++;
			}

		} else {

			// find most influencing

			var used = [];
			var candidateInfluence = - 1;
			var candidate = 0;
			var influences = object.morphTargetInfluences;
			var i, il = influences.length;
			var m = 0;

			if ( object.morphTargetBase !== -1 ) {

				used[ object.morphTargetBase ] = true;

			}

			while ( m < material.numSupportedMorphTargets ) {

				for ( i = 0; i < il; i++ ) {

					if ( !used[ i ] && influences[ i ] > candidateInfluence ) {

						candidate = i;
						candidateInfluence = influences[ candidate ];
					}
				}

				_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglMorphTargetsBuffers[ candidate ] );
				_gl.vertexAttribPointer( attributes[ "morphTarget" + m ], 3, _gl.FLOAT, false, 0, 0 );

				object.__webglMorphTargetInfluences[ m ] = candidateInfluence;

				used[ candidate ] = 1;
				candidateInfluence = -1;
				m ++;
			}
		}

		// load updated influences uniform

		_gl.uniform1fv( material.program.uniforms.morphTargetInfluences, object.__webglMorphTargetInfluences );
	}


	function renderBufferImmediate ( object, program ) {

		if ( ! object.__webglVertexBuffer ) object.__webglVertexBuffer = _gl.createBuffer();
		if ( ! object.__webglNormalBuffer ) object.__webglNormalBuffer = _gl.createBuffer();

		if ( object.hasPos ) {

		  _gl.bindBuffer( _gl.ARRAY_BUFFER, object.__webglVertexBuffer );
		  _gl.bufferData( _gl.ARRAY_BUFFER, object.positionArray, _gl.DYNAMIC_DRAW );
		  _gl.enableVertexAttribArray( program.attributes.position );
		  _gl.vertexAttribPointer( program.attributes.position, 3, _gl.FLOAT, false, 0, 0 );

		}

		if ( object.hasNormal ) {

		  _gl.bindBuffer( _gl.ARRAY_BUFFER, object.__webglNormalBuffer );
		  _gl.bufferData( _gl.ARRAY_BUFFER, object.normalArray, _gl.DYNAMIC_DRAW );
		  _gl.enableVertexAttribArray( program.attributes.normal );
		  _gl.vertexAttribPointer( program.attributes.normal, 3, _gl.FLOAT, false, 0, 0 );

		}

		_gl.drawArrays( _gl.TRIANGLES, 0, object.count );

		object.count = 0;

	};

	function setObjectFaces ( object ) {

		if ( _oldDoubleSided != object.doubleSided ) {

			if( object.doubleSided ) {

				_gl.disable( _gl.CULL_FACE );

			} else {

				_gl.enable( _gl.CULL_FACE );

			}

			_oldDoubleSided = object.doubleSided;

		}

		if ( _oldFlipSided != object.flipSided ) {

			if( object.flipSided ) {

				_gl.frontFace( _gl.CW );

			} else {

				_gl.frontFace( _gl.CCW );

			}

			_oldFlipSided = object.flipSided;

		}

	};

	function setDepthTest ( test ) {

		if ( _oldDepth != test ) {

			if( test ) {

				_gl.enable( _gl.DEPTH_TEST );

			} else {

				_gl.disable( _gl.DEPTH_TEST );

			}

			_oldDepth = test;

		}

	};

	function computeFrustum ( m ) {

		_frustum[ 0 ].set( m.n41 - m.n11, m.n42 - m.n12, m.n43 - m.n13, m.n44 - m.n14 );
		_frustum[ 1 ].set( m.n41 + m.n11, m.n42 + m.n12, m.n43 + m.n13, m.n44 + m.n14 );
		_frustum[ 2 ].set( m.n41 + m.n21, m.n42 + m.n22, m.n43 + m.n23, m.n44 + m.n24 );
		_frustum[ 3 ].set( m.n41 - m.n21, m.n42 - m.n22, m.n43 - m.n23, m.n44 - m.n24 );
		_frustum[ 4 ].set( m.n41 - m.n31, m.n42 - m.n32, m.n43 - m.n33, m.n44 - m.n34 );
		_frustum[ 5 ].set( m.n41 + m.n31, m.n42 + m.n32, m.n43 + m.n33, m.n44 + m.n34 );

		var i, plane;

		for ( i = 0; i < 6; i ++ ) {

			plane = _frustum[ i ];
			plane.divideScalar( Math.sqrt( plane.x * plane.x + plane.y * plane.y + plane.z * plane.z ) );

		}

	};

	function isInFrustum ( object ) {

		var distance, matrix = object.matrixWorld,
		radius = - object.geometry.boundingSphere.radius * Math.max( object.scale.x, Math.max( object.scale.y, object.scale.z ) );

		for ( var i = 0; i < 6; i ++ ) {

			distance = _frustum[ i ].x * matrix.n14 + _frustum[ i ].y * matrix.n24 + _frustum[ i ].z * matrix.n34 + _frustum[ i ].w;
			if ( distance <= radius ) return false;

		}

		return true;

	};

	function addToFixedArray ( where, what ) {

		where.list[ where.count ] = what;
		where.count += 1;

	};

	function unrollImmediateBufferMaterials ( globject ) {

		var i, l, m, ml, material,
			object = globject.object,
			opaque = globject.opaque,
			transparent = globject.transparent;

		transparent.count = 0;
		opaque.count = 0;

		for ( m = 0, ml = object.materials.length; m < ml; m++ ) {

			material = object.materials[ m ];
			material.transparent ? addToFixedArray( transparent, material ) : addToFixedArray( opaque, material );

		}

	};

	function unrollBufferMaterials ( globject ) {

		var i, l, m, ml, material, meshMaterial,
			object = globject.object,
			buffer = globject.buffer,
			opaque = globject.opaque,
			transparent = globject.transparent;

		transparent.count = 0;
		opaque.count = 0;

		for ( m = 0, ml = object.materials.length; m < ml; m++ ) {

			meshMaterial = object.materials[ m ];

			if ( meshMaterial instanceof THREE.MeshFaceMaterial ) {

				for ( i = 0, l = buffer.materials.length; i < l; i++ ) {

					material = buffer.materials[ i ];
					if ( material ) material.transparent ? addToFixedArray( transparent, material ) : addToFixedArray( opaque, material );

				}

			} else {

				material = meshMaterial;
				if ( material ) material.transparent ? addToFixedArray( transparent, material ) : addToFixedArray( opaque, material );

			}

		}

	};


	function painterSort ( a, b ) {

		return b.z - a.z;

	};

	this.render = function ( scene, camera, renderTarget, forceClear ) {

		var i, program, opaque, transparent, material,
			o, ol, oil, webglObject, object, buffer,
			lights = scene.lights,
			fog = scene.fog;

		camera.matrixAutoUpdate && camera.updateMatrix();

		scene.update( undefined, false, camera );

		camera.matrixWorldInverse.flattenToArray( _viewMatrixArray );
		camera.projectionMatrix.flattenToArray( _projectionMatrixArray );

		_projScreenMatrix.multiply( camera.projectionMatrix, camera.matrixWorldInverse );
		computeFrustum( _projScreenMatrix );

		this.initWebGLObjects( scene );

		setRenderTarget( renderTarget );

		if ( this.autoClear || forceClear ) {

			this.clear();

		}

		// set matrices

		ol = scene.__webglObjects.length;

		for ( o = 0; o < ol; o++ ) {

			webglObject = scene.__webglObjects[ o ];
			object = webglObject.object;

			if ( object.visible ) {

				if ( ! ( object instanceof THREE.Mesh ) || isInFrustum( object ) ) {

					object.matrixWorld.flattenToArray( object._objectMatrixArray );

					setupMatrices( object, camera );

					unrollBufferMaterials( webglObject );

					webglObject.render = true;

					if ( this.sortObjects ) {

						_vector3.copy( object.position );
						_projScreenMatrix.multiplyVector3( _vector3 );

						webglObject.z = _vector3.z;

					}

				} else {

					webglObject.render = false;

				}

			} else {

				webglObject.render = false;

			}

		}

		if ( this.sortObjects ) {

			scene.__webglObjects.sort( painterSort );

		}

		oil = scene.__webglObjectsImmediate.length;

		for ( o = 0; o < oil; o++ ) {

			webglObject = scene.__webglObjectsImmediate[ o ];
			object = webglObject.object;

			if ( object.visible ) {

				if( object.matrixAutoUpdate ) {

					object.matrixWorld.flattenToArray( object._objectMatrixArray );

				}

				setupMatrices( object, camera );

				unrollImmediateBufferMaterials( webglObject );

			}

		}

		// opaque pass

		setBlending( THREE.NormalBlending );

		for ( o = 0; o < ol; o ++ ) {

			webglObject = scene.__webglObjects[ o ];

			if ( webglObject.render ) {

				object = webglObject.object;
				buffer = webglObject.buffer;
				opaque = webglObject.opaque;

				setObjectFaces( object );

				for ( i = 0; i < opaque.count; i ++ ) {

					material = opaque.list[ i ];

					setDepthTest( material.depthTest );
					renderBuffer( camera, lights, fog, material, buffer, object );

				}

			}

		}

		// opaque pass (immediate simulator)

		for ( o = 0; o < oil; o++ ) {

			webglObject = scene.__webglObjectsImmediate[ o ];
			object = webglObject.object;

			if ( object.visible ) {

				opaque = webglObject.opaque;

				setObjectFaces( object );

				for( i = 0; i < opaque.count; i++ ) {

					material = opaque.list[ i ];

					setDepthTest( material.depthTest );

					program = setProgram( camera, lights, fog, material, object );
					object.render( function( object ) { renderBufferImmediate( object, program ); } );

				}

			}

		}

		// transparent pass

		for ( o = 0; o < ol; o ++ ) {

			webglObject = scene.__webglObjects[ o ];

			if ( webglObject.render ) {

				object = webglObject.object;
				buffer = webglObject.buffer;
				transparent = webglObject.transparent;

				setObjectFaces( object );

				for ( i = 0; i < transparent.count; i ++ ) {

					material = transparent.list[ i ];

					setBlending( material.blending );
					setDepthTest( material.depthTest );

					renderBuffer( camera, lights, fog, material, buffer, object );

				}

			}

		}

		// transparent pass (immediate simulator)

		for ( o = 0; o < oil; o++ ) {

			webglObject = scene.__webglObjectsImmediate[ o ];
			object = webglObject.object;

			if ( object.visible ) {

				transparent = webglObject.transparent;

				setObjectFaces( object );

				for ( i = 0; i < transparent.count; i ++ ) {

					material = transparent.list[ i ];

					setBlending( material.blending );
					setDepthTest( material.depthTest );

					program = setProgram( camera, lights, fog, material, object );
					object.render( function( object ) { renderBufferImmediate( object, program ); } );

				}

			}

		}

		// render stencil shadows

		if ( stencil && scene.__webglShadowVolumes.length && scene.lights.length ) {

			renderStencilShadows( scene );

		}

		// render lens flares

		if ( scene.__webglLensFlares.length ) {

			renderLensFlares( scene, camera );

		}


		// Generate mipmap if we're using any kind of mipmap filtering

		if ( renderTarget && renderTarget.minFilter !== THREE.NearestFilter && renderTarget.minFilter !== THREE.LinearFilter ) {

			updateRenderTargetMipmap( renderTarget );

		}

	};



	/*
	 * Stencil Shadows
	 * method: we're rendering the world in light, then the shadow
	 *         volumes into the stencil and last a big darkening 
	 *         quad over the whole thing. This is not how "you're
	 *	       supposed to" do stencil shadows but is much faster
	 * 
	 */

	function renderStencilShadows( scene ) {

		// setup stencil

		_gl.enable( _gl.POLYGON_OFFSET_FILL );
		_gl.polygonOffset( 0.1, 1.0 );
		_gl.enable( _gl.STENCIL_TEST );
		_gl.depthMask( false );
		_gl.colorMask( false, false, false, false );

		_gl.stencilFunc( _gl.ALWAYS, 1, 0xFF );
		_gl.stencilOpSeparate( _gl.BACK,  _gl.KEEP, _gl.INCR, _gl.KEEP );
		_gl.stencilOpSeparate( _gl.FRONT, _gl.KEEP, _gl.DECR, _gl.KEEP );


		// loop through all directional lights

		var l, ll = scene.lights.length;
		var p;
		var light, lights = scene.lights;
		var dirLight = [];
		var object, geometryGroup, material;
		var program;
		var p_uniforms;
		var m_uniforms;
		var attributes;
		var o, ol = scene.__webglShadowVolumes.length;

		for ( l = 0; l < ll; l++ ) {

			light = scene.lights[ l ];

			if ( light instanceof THREE.DirectionalLight ) {

				dirLight[ 0 ] = -light.position.x;
				dirLight[ 1 ] = -light.position.y;
				dirLight[ 2 ] = -light.position.z;

				// render all volumes

				for ( o = 0; o < ol; o++ ) {

					object        = scene.__webglShadowVolumes[ o ].object;
					geometryGroup = scene.__webglShadowVolumes[ o ].buffer;
					material      = object.materials[ 0 ];

					if ( !material.program ) _this.initMaterial( material, lights, undefined, object );

					program = material.program,
		  			p_uniforms = program.uniforms,
					m_uniforms = material.uniforms,
					attributes = program.attributes;

					if ( _currentProgram !== program ) {

						_gl.useProgram( program );
						_currentProgram = program;

						_gl.uniformMatrix4fv( p_uniforms.projectionMatrix, false, _projectionMatrixArray );
						_gl.uniformMatrix4fv( p_uniforms.viewMatrix, false, _viewMatrixArray );
						_gl.uniform3fv( p_uniforms.directionalLightDirection, dirLight );
					}


					object.matrixWorld.flattenToArray( object._objectMatrixArray );
					_gl.uniformMatrix4fv( p_uniforms.objectMatrix, false, object._objectMatrixArray );


					_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglVertexBuffer );
					_gl.vertexAttribPointer( attributes.position, 3, _gl.FLOAT, false, 0, 0 );

					_gl.bindBuffer( _gl.ARRAY_BUFFER, geometryGroup.__webglNormalBuffer );
					_gl.vertexAttribPointer( attributes.normal, 3, _gl.FLOAT, false, 0, 0 );

					_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, geometryGroup.__webglFaceBuffer );

					_gl.cullFace( _gl.FRONT );
					_gl.drawElements( _gl.TRIANGLES, geometryGroup.__webglFaceCount, _gl.UNSIGNED_SHORT, 0 );

					_gl.cullFace( _gl.BACK );
					_gl.drawElements( _gl.TRIANGLES, geometryGroup.__webglFaceCount, _gl.UNSIGNED_SHORT, 0 );

				}

			}

		}


		// setup color+stencil

		_gl.disable( _gl.POLYGON_OFFSET_FILL );
		_gl.colorMask( true, true, true, true );
		_gl.stencilFunc( _gl.NOTEQUAL, 0, 0xFF );
		_gl.stencilOp( _gl.KEEP, _gl.KEEP, _gl.KEEP );
		_gl.disable( _gl.DEPTH_TEST );


		// draw darkening polygon

		_oldBlending = "";
		_currentProgram = _stencilShadow.program;

		_gl.useProgram( _stencilShadow.program );
		_gl.uniformMatrix4fv( _stencilShadow.projectionLocation, false, _projectionMatrixArray );
		_gl.uniform1f( _stencilShadow.darknessLocation, _stencilShadow.darkness );

		_gl.bindBuffer( _gl.ARRAY_BUFFER, _stencilShadow.vertexBuffer );
		_gl.vertexAttribPointer( _stencilShadow.vertexLocation, 3, _gl.FLOAT, false, 0, 0 );
		_gl.enableVertexAttribArray( _stencilShadow.vertexLocation );

		_gl.blendFunc( _gl.ONE, _gl.ONE_MINUS_SRC_ALPHA );
		_gl.blendEquation( _gl.FUNC_ADD );

		_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, _stencilShadow.elementBuffer );
		_gl.drawElements( _gl.TRIANGLES, 6, _gl.UNSIGNED_SHORT, 0 );


		// disable stencil

		_gl.disable( _gl.STENCIL_TEST );
		_gl.enable( _gl.DEPTH_TEST );
		_gl.depthMask( _currentDepthMask );

	}

	/*
	 * Render lens flares
	 * Method: renders 16x16 0xff00ff-colored points scattered over the light source area, 
	 *         reads these back and calculates occlusion.  
	 *         Then LensFlare.updateLensFlares() is called to re-position and 
	 *         update transparency of flares. Then they are rendered.
	 * 
	 */

	function renderLensFlares( scene, camera ) {

		var object, objectZ, geometryGroup, material;
		var o, ol = scene.__webglLensFlares.length;
		var f, fl, flare;
		var tempPosition = new THREE.Vector3();
		var invAspect = _viewportHeight / _viewportWidth;
		var halfViewportWidth = _viewportWidth * 0.5;
		var halfViewportHeight = _viewportHeight * 0.5;
		var size = 16 / _viewportHeight;
		var scale = [ size * invAspect, size ];
		var screenPosition = [ 1, 1, 0 ];
		var screenPositionPixels = [ 1, 1 ];
		var sampleX, sampleY, readBackPixels = _lensFlare.readBackPixels;
		var sampleMidX = 7 * 4;
		var sampleMidY = 7 * 16 * 4;
		var sampleIndex, visibility;
		var uniforms = _lensFlare.uniforms;
		var attributes = _lensFlare.attributes;


		// set lensflare program and reset blending

		_gl.useProgram( _lensFlare.program );
		_currentProgram = _lensFlare.program;
		_oldBlending = "";


		// loop through all lens flares to update their occlusion and positions
		// setup gl and common used attribs/unforms

		_gl.uniform1i( uniforms.map, 0 );
		_gl.activeTexture( _gl.TEXTURE0 );

		_gl.uniform1f( uniforms.opacity, 1 );
		_gl.uniform1f( uniforms.rotation, 0 );
		_gl.uniform2fv( uniforms.scale, scale );

		_gl.bindBuffer( _gl.ARRAY_BUFFER, _lensFlare.vertexBuffer );
		_gl.vertexAttribPointer( attributes.vertex, 2, _gl.FLOAT, false, 2 * 8, 0 );
		_gl.vertexAttribPointer( attributes.uv, 2, _gl.FLOAT, false, 2 * 8, 8 );

		_gl.bindTexture( _gl.TEXTURE_2D, _lensFlare.tempTexture );

		_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, _lensFlare.elementBuffer );

		_gl.disable( _gl.CULL_FACE );
		_gl.depthMask( false );


		for ( o = 0; o < ol; o ++ ) {

			// calc object screen position

			object = scene.__webglLensFlares[ o ].object;

			tempPosition.set( object.matrixWorld.n14, object.matrixWorld.n24, object.matrixWorld.n34 );

			camera.matrixWorldInverse.multiplyVector3( tempPosition );
			objectZ = tempPosition.z;
			camera.projectionMatrix.multiplyVector3( tempPosition );


			// setup arrays for gl programs

			screenPosition[ 0 ] = tempPosition.x;
			screenPosition[ 1 ] = tempPosition.y;
			screenPosition[ 2 ] = tempPosition.z;

			screenPositionPixels[ 0 ] = screenPosition[ 0 ] * halfViewportWidth + halfViewportWidth;
			screenPositionPixels[ 1 ] = screenPosition[ 1 ] * halfViewportHeight + halfViewportHeight;


			// save current RGB to temp texture

			_gl.copyTexSubImage2D( _gl.TEXTURE_2D, 0, 0, 0, screenPositionPixels[ 0 ] - 8, screenPositionPixels[ 1 ] - 8, 16, 16 );


			// render pink quad

			_gl.uniform3fv( uniforms.screenPosition, screenPosition );
			_gl.uniform1i( uniforms.renderPink, 1 );

			_gl.enable( _gl.DEPTH_TEST );

			_gl.drawElements( _gl.TRIANGLES, 6, _gl.UNSIGNED_SHORT, 0 );


			// read back

			try {

				_gl.readPixels( screenPositionPixels[ 0 ] - 8, screenPositionPixels[ 1 ] - 8, 16, 16, _gl.RGBA, _gl.UNSIGNED_BYTE, _lensFlare.readBackPixels );

			} catch( error ) {

				console.log( "WebGLRenderer.renderLensFlare: readPixels failed!" );

			}

			if ( _gl.getError() ) {

				console.log( "WebGLRenderer.renderLensFlare: readPixels failed!" );

			}


			// sample read back pixels

			sampleDistance = parseInt( 5 * ( 1 - Math.max( 0, Math.min( -objectZ, camera.far )) / camera.far ), 10 ) + 2;
			sampleX = sampleDistance * 4;
			sampleY = sampleDistance * 4 * 16;

			visibility = 0;

			sampleIndex = ( sampleMidX - sampleX ) + ( sampleMidY - sampleY );	// upper left
			if( _lensFlare.readBackPixels[ sampleIndex + 0 ] === 255 && 
				_lensFlare.readBackPixels[ sampleIndex + 1 ] === 0 &&
				_lensFlare.readBackPixels[ sampleIndex + 2 ] === 255 ) visibility += 0.2;

			sampleIndex = ( sampleMidX + sampleX ) + ( sampleMidY - sampleY );	// upper right
			if( readBackPixels[ sampleIndex + 0 ] === 255 && 
				readBackPixels[ sampleIndex + 1 ] === 0 &&
				readBackPixels[ sampleIndex + 2 ] === 255 ) visibility += 0.2;

			sampleIndex = ( sampleMidX + sampleX ) + ( sampleMidY + sampleY );	// lower right
			if( readBackPixels[ sampleIndex + 0 ] === 255 && 
				readBackPixels[ sampleIndex + 1 ] === 0 &&
				readBackPixels[ sampleIndex + 2 ] === 255 ) visibility += 0.2;

			sampleIndex = ( sampleMidX - sampleX ) + ( sampleMidY + sampleY );	// lower left
			if( readBackPixels[ sampleIndex + 0 ] === 255 && 
				readBackPixels[ sampleIndex + 1 ] === 0 &&
				readBackPixels[ sampleIndex + 2 ] === 255 ) visibility += 0.2;

			sampleIndex = sampleMidX + sampleMidY;								// center
			if( readBackPixels[ sampleIndex + 0 ] === 255 && 
				readBackPixels[ sampleIndex + 1 ] === 0 &&
				readBackPixels[ sampleIndex + 2 ] === 255 ) visibility += 0.2;


			object.positionScreen.x = screenPosition[ 0 ];
			object.positionScreen.y = screenPosition[ 1 ];
			object.positionScreen.z = screenPosition[ 2 ];

			if ( object.customUpdateCallback ) {

				object.customUpdateCallback( visibility, object );

			} else {

				object.updateLensFlares( visibility );

			}


			// restore graphics

			_gl.uniform1i( uniforms.renderPink, 0 );
			_gl.disable( _gl.DEPTH_TEST );
			_gl.drawElements( _gl.TRIANGLES, 6, _gl.UNSIGNED_SHORT, 0 );

		}


		// loop through all lens flares and draw their flares
		// setup gl

		for ( o = 0; o < ol; o ++ ) {

			object = scene.__webglLensFlares[ o ].object;

			for ( f = 0, fl = object.lensFlares.length; f < fl; f ++ ) {

				flare = object.lensFlares[ f ];

				if ( flare.opacity > 0.001 && flare.scale > 0.001 ) {

					screenPosition[ 0 ] = flare.x;
					screenPosition[ 1 ] = flare.y;
					screenPosition[ 2 ] = flare.z;

					size = flare.size * flare.scale / _viewportHeight;
					scale[ 0 ] = size * invAspect;
					scale[ 1 ] = size;

					_gl.uniform3fv( uniforms.screenPosition, screenPosition );
					_gl.uniform1f( uniforms.rotation, flare.rotation );
					_gl.uniform2fv( uniforms.scale, scale );
					_gl.uniform1f( uniforms.opacity, flare.opacity );

					setBlending( flare.blending );
					setTexture( flare.texture, 0 );

					// todo: only draw if loaded

					_gl.drawElements( _gl.TRIANGLES, 6, _gl.UNSIGNED_SHORT, 0 );

				}

			}

		}

		// restore gl

		_gl.enable( _gl.CULL_FACE );
		_gl.enable( _gl.DEPTH_TEST );
		_gl.depthMask( _currentDepthMask );

	}


	function setupMatrices ( object, camera ) {

		object._modelViewMatrix.multiplyToArray( camera.matrixWorldInverse, object.matrixWorld, object._modelViewMatrixArray );
		THREE.Matrix4.makeInvert3x3( object._modelViewMatrix ).transposeIntoArray( object._normalMatrixArray );

	}

	this.initWebGLObjects = function ( scene ) {

		if ( !scene.__webglObjects ) {

			scene.__webglObjects = [];
			scene.__webglObjectsImmediate = [];
			scene.__webglShadowVolumes = [];
			scene.__webglLensFlares = [];
		}

		while ( scene.__objectsAdded.length ) {

			addObject( scene.__objectsAdded[ 0 ], scene );
			scene.__objectsAdded.splice( 0, 1 );

		}

		while ( scene.__objectsRemoved.length ) {

			removeObject( scene.__objectsRemoved[ 0 ], scene );
			scene.__objectsRemoved.splice( 0, 1 );

		}

		// update must be called after objects adding / removal

		for ( var o = 0, ol = scene.__webglObjects.length; o < ol; o ++ ) {

			updateObject( scene.__webglObjects[ o ].object, scene );

		}

		for ( var o = 0, ol = scene.__webglShadowVolumes.length; o < ol; o ++ ) {

			updateObject( scene.__webglShadowVolumes[ o ].object, scene );

		}

		for ( var o = 0, ol = scene.__webglLensFlares.length; o < ol; o ++ ) {

			updateObject( scene.__webglLensFlares[ o ].object, scene );

		}

	};

	function addObject ( object, scene ) {

		var g, geometry, geometryGroup;

		if ( object._modelViewMatrix == undefined ) {

			object._modelViewMatrix = new THREE.Matrix4();

			object._normalMatrixArray = new Float32Array( 9 );
			object._modelViewMatrixArray = new Float32Array( 16 );
			object._objectMatrixArray = new Float32Array( 16 );

			object.matrixWorld.flattenToArray( object._objectMatrixArray );

		}

		if ( object instanceof THREE.Mesh ) {

			geometry = object.geometry;

			if ( geometry.geometryGroups == undefined ) {

				sortFacesByMaterial( geometry );

			}

			// create separate VBOs per geometry chunk

			for ( g in geometry.geometryGroups ) {

				geometryGroup = geometry.geometryGroups[ g ];

				// initialise VBO on the first access

				if ( ! geometryGroup.__webglVertexBuffer ) {

					createMeshBuffers( geometryGroup );
					initMeshBuffers( geometryGroup, object );

					geometry.__dirtyVertices = true;
					geometry.__dirtyMorphTargets = true;
					geometry.__dirtyElements = true;
					geometry.__dirtyUvs = true;
					geometry.__dirtyNormals = true;
					geometry.__dirtyTangents = true;
					geometry.__dirtyColors = true;

				}

				// create separate wrapper per each use of VBO

				if ( object instanceof THREE.ShadowVolume ) {

					addBuffer( scene.__webglShadowVolumes, geometryGroup, object );

				} else {

					addBuffer( scene.__webglObjects, geometryGroup, object );

				}

			}

		} else if ( object instanceof THREE.LensFlare ) {

			addBuffer( scene.__webglLensFlares, undefined, object );

		} else if ( object instanceof THREE.Ribbon ) {

			geometry = object.geometry;

			if( ! geometry.__webglVertexBuffer ) {

				createRibbonBuffers( geometry );
				initRibbonBuffers( geometry );

				geometry.__dirtyVertices = true;
				geometry.__dirtyColors = true;

			}

			addBuffer( scene.__webglObjects, geometry, object );

		} else if ( object instanceof THREE.Line ) {

			geometry = object.geometry;

			if( ! geometry.__webglVertexBuffer ) {

				createLineBuffers( geometry );
				initLineBuffers( geometry );

				geometry.__dirtyVertices = true;
				geometry.__dirtyColors = true;

			}

			addBuffer( scene.__webglObjects, geometry, object );

		} else if ( object instanceof THREE.ParticleSystem ) {

			geometry = object.geometry;

			if ( ! geometry.__webglVertexBuffer ) {

				createParticleBuffers( geometry );
				initParticleBuffers( geometry );

				geometry.__dirtyVertices = true;
				geometry.__dirtyColors = true;

			}

			addBuffer( scene.__webglObjects, geometry, object );

		} else if ( THREE.MarchingCubes !== undefined && object instanceof THREE.MarchingCubes ) {

			addBufferImmediate( scene.__webglObjectsImmediate, object );

		}/*else if ( object instanceof THREE.Particle ) {

		}*/

	};

	function updateObject ( object, scene ) {

		var g, geometry, geometryGroup;

		if ( object instanceof THREE.Mesh ) {

			geometry = object.geometry;

			// check all geometry groups

			for ( g in geometry.geometryGroups ) {

				geometryGroup = geometry.geometryGroups[ g ];

				if ( geometry.__dirtyVertices || geometry.__dirtyMorphTargets || geometry.__dirtyElements ||
					geometry.__dirtyUvs || geometry.__dirtyNormals ||
					geometry.__dirtyColors || geometry.__dirtyTangents ) {

					setMeshBuffers( geometryGroup, object, _gl.DYNAMIC_DRAW );

				}

			}

			geometry.__dirtyVertices = false;
			geometry.__dirtyMorphTargets = false;
			geometry.__dirtyElements = false;
			geometry.__dirtyUvs = false;
			geometry.__dirtyNormals = false;
			geometry.__dirtyTangents = false;
			geometry.__dirtyColors = false;

		} else if ( object instanceof THREE.Ribbon ) {

			geometry = object.geometry;

			if( geometry.__dirtyVertices || geometry.__dirtyColors ) {

				setRibbonBuffers( geometry, _gl.DYNAMIC_DRAW );

			}

			geometry.__dirtyVertices = false;
			geometry.__dirtyColors = false;

		} else if ( object instanceof THREE.Line ) {

			geometry = object.geometry;

			if( geometry.__dirtyVertices ||  geometry.__dirtyColors ) {

				setLineBuffers( geometry, _gl.DYNAMIC_DRAW );

			}

			geometry.__dirtyVertices = false;
			geometry.__dirtyColors = false;

		} else if ( object instanceof THREE.ParticleSystem ) {

			geometry = object.geometry;

			if ( geometry.__dirtyVertices || geometry.__dirtyColors || object.sortParticles ) {

				setParticleBuffers( geometry, _gl.DYNAMIC_DRAW, object );

			}

			geometry.__dirtyVertices = false;
			geometry.__dirtyColors = false;

		}/* else if ( THREE.MarchingCubes !== undefined && object instanceof THREE.MarchingCubes ) {

			// it updates itself in render callback

		} else if ( object instanceof THREE.Particle ) {

		}*/

	};

	function removeObject ( object, scene ) {

		var o, ol, zobject;

		for ( o = scene.__webglObjects.length - 1; o >= 0; o-- ) {

			zobject = scene.__webglObjects[ o ].object;

			if ( object == zobject ) {

				scene.__webglObjects.splice( o, 1 );

			}

		}

	};

	function sortFacesByMaterial ( geometry ) {

		// TODO
		// Should optimize by grouping faces with ColorFill / ColorStroke materials
		// which could then use vertex color attributes instead of each being
		// in its separate VBO

		var i, l, f, fl, face, material, materials, vertices, mhash, ghash, hash_map = {};
		var numMorphTargets = geometry.morphTargets !== undefined ? geometry.morphTargets.length : 0;

		geometry.geometryGroups = {};

		function materialHash( material ) {

			var hash_array = [];

			for ( i = 0, l = material.length; i < l; i++ ) {

				if ( material[ i ] == undefined ) {

					hash_array.push( "undefined" );

				} else {

					hash_array.push( material[ i ].id );

				}

			}

			return hash_array.join( '_' );

		}

		for ( f = 0, fl = geometry.faces.length; f < fl; f++ ) {

			face = geometry.faces[ f ];
			materials = face.materials;

			mhash = materialHash( materials );

			if ( hash_map[ mhash ] == undefined ) {

				hash_map[ mhash ] = { 'hash': mhash, 'counter': 0 };

			}

			ghash = hash_map[ mhash ].hash + '_' + hash_map[ mhash ].counter;

			if ( geometry.geometryGroups[ ghash ] == undefined ) {

				geometry.geometryGroups[ ghash ] = { 'faces': [], 'materials': materials, 'vertices': 0, 'numMorphTargets': numMorphTargets };

			}

			vertices = face instanceof THREE.Face3 ? 3 : 4;

			if ( geometry.geometryGroups[ ghash ].vertices + vertices > 65535 ) {

				hash_map[ mhash ].counter += 1;
				ghash = hash_map[ mhash ].hash + '_' + hash_map[ mhash ].counter;

				if ( geometry.geometryGroups[ ghash ] == undefined ) {

					geometry.geometryGroups[ ghash ] = { 'faces': [], 'materials': materials, 'vertices': 0, 'numMorphTargets': numMorphTargets };

				}

			}

			geometry.geometryGroups[ ghash ].faces.push( f );
			geometry.geometryGroups[ ghash ].vertices += vertices;

		}

	};

	function addBuffer ( objlist, buffer, object ) {

		objlist.push( {
			buffer: buffer, object: object,
			opaque: { list: [], count: 0 },
			transparent: { list: [], count: 0 }
		} );

	};

	function addBufferImmediate ( objlist, object ) {

		objlist.push( {
			object: object,
			opaque: { list: [], count: 0 },
			transparent: { list: [], count: 0 }
		} );

	};

	this.setFaceCulling = function ( cullFace, frontFace ) {

		if ( cullFace ) {

			if ( !frontFace || frontFace == "ccw" ) {

				_gl.frontFace( _gl.CCW );

			} else {

				_gl.frontFace( _gl.CW );

			}

			if( cullFace == "back" ) {

				_gl.cullFace( _gl.BACK );

			} else if( cullFace == "front" ) {

				_gl.cullFace( _gl.FRONT );

			} else {

				_gl.cullFace( _gl.FRONT_AND_BACK );

			}

			_gl.enable( _gl.CULL_FACE );

		} else {

			_gl.disable( _gl.CULL_FACE );

		}

	};

	this.supportsVertexTextures = function () {

		return maxVertexTextures() > 0;

	};

	function maxVertexTextures () {

		return _gl.getParameter( _gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS );

	};

	function initGL ( antialias, clearColor, clearAlpha, stencil ) {

		try {

			if ( ! ( _gl = _canvas.getContext( 'experimental-webgl', { antialias: antialias, stencil: stencil } ) ) ) {

				throw 'Error creating WebGL context.';

			}

		} catch ( e ) {

			console.error( e );

		}

		_gl.clearColor( 0, 0, 0, 1 );
		_gl.clearDepth( 1 );

		_gl.enable( _gl.DEPTH_TEST );
		_gl.depthFunc( _gl.LEQUAL );

		_gl.frontFace( _gl.CCW );
		_gl.cullFace( _gl.BACK );
		_gl.enable( _gl.CULL_FACE );

		_gl.enable( _gl.BLEND );
		_gl.blendEquation( _gl.FUNC_ADD );
		_gl.blendFunc( _gl.SRC_ALPHA, _gl.ONE_MINUS_SRC_ALPHA );

		_gl.clearColor( clearColor.r, clearColor.g, clearColor.b, clearAlpha );

		// _gl.pixelStorei( _gl.UNPACK_FLIP_Y_WEBGL, true );

		_cullEnabled = true;

	};

	function buildProgram ( fragmentShader, vertexShader, parameters ) {

		var program = _gl.createProgram(),

		prefix_fragment = [
			"#ifdef GL_ES",
			"precision highp float;",
			"#endif",

			"#define MAX_DIR_LIGHTS " + parameters.maxDirLights,
			"#define MAX_POINT_LIGHTS " + parameters.maxPointLights,

			parameters.fog ? "#define USE_FOG" : "",
			parameters.fog instanceof THREE.FogExp2 ? "#define FOG_EXP2" : "",

			parameters.map ? "#define USE_MAP" : "",
			parameters.envMap ? "#define USE_ENVMAP" : "",
			parameters.lightMap ? "#define USE_LIGHTMAP" : "",
			parameters.vertexColors ? "#define USE_COLOR" : "",

			"uniform mat4 viewMatrix;",
			"uniform vec3 cameraPosition;",
			""
		].join("\n"),

		prefix_vertex = [
			maxVertexTextures() > 0 ? "#define VERTEX_TEXTURES" : "",

			"#define MAX_DIR_LIGHTS " + parameters.maxDirLights,
			"#define MAX_POINT_LIGHTS " + parameters.maxPointLights,

			"#define MAX_BONES " + parameters.maxBones,

			parameters.map ? "#define USE_MAP" : "",
			parameters.envMap ? "#define USE_ENVMAP" : "",
			parameters.lightMap ? "#define USE_LIGHTMAP" : "",
			parameters.vertexColors ? "#define USE_COLOR" : "",
			parameters.skinning ? "#define USE_SKINNING" : "",
			parameters.morphTargets ? "#define USE_MORPHTARGETS" : "",


			parameters.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "",

			"uniform mat4 objectMatrix;",
			"uniform mat4 modelViewMatrix;",
			"uniform mat4 projectionMatrix;",
			"uniform mat4 viewMatrix;",
			"uniform mat3 normalMatrix;",
			"uniform vec3 cameraPosition;",

			"uniform mat4 cameraInverseMatrix;",

			"attribute vec3 position;",
			"attribute vec3 normal;",
			"attribute vec2 uv;",
			"attribute vec2 uv2;",

			"#ifdef USE_COLOR",

				"attribute vec3 color;",

			"#endif",

			"#ifdef USE_MORPHTARGETS",

				"attribute vec3 morphTarget0;",
				"attribute vec3 morphTarget1;",
				"attribute vec3 morphTarget2;",
				"attribute vec3 morphTarget3;",
				"attribute vec3 morphTarget4;",
				"attribute vec3 morphTarget5;",
				"attribute vec3 morphTarget6;",
				"attribute vec3 morphTarget7;",

			"#endif",

			"#ifdef USE_SKINNING",

				"attribute vec4 skinVertexA;",
				"attribute vec4 skinVertexB;",
				"attribute vec4 skinIndex;",
				"attribute vec4 skinWeight;",

			"#endif",

			""
		].join("\n");

		_gl.attachShader( program, getShader( "fragment", prefix_fragment + fragmentShader ) );
		_gl.attachShader( program, getShader( "vertex", prefix_vertex + vertexShader ) );

		_gl.linkProgram( program );

		if ( !_gl.getProgramParameter( program, _gl.LINK_STATUS ) ) {

			console.error( "Could not initialise shader\n" + "VALIDATE_STATUS: " + _gl.getProgramParameter( program, _gl.VALIDATE_STATUS ) + ", gl error [" + _gl.getError() + "]" );

		}

		//console.log( prefix_fragment + fragmentShader );
		//console.log( prefix_vertex + vertexShader );

		program.uniforms = {};
		program.attributes = {};

		return program;

	};

	function loadUniformsSkinning ( uniforms, object ) {

		_gl.uniformMatrix4fv( uniforms.cameraInverseMatrix, false, _viewMatrixArray );
		_gl.uniformMatrix4fv( uniforms.boneGlobalMatrices, false, object.boneMatrices );

	};


	function loadUniformsMatrices ( uniforms, object ) {

		_gl.uniformMatrix4fv( uniforms.modelViewMatrix, false, object._modelViewMatrixArray );
		_gl.uniformMatrix3fv( uniforms.normalMatrix, false, object._normalMatrixArray );

	};

	function loadUniformsGeneric ( program, uniforms ) {

		var u, uniform, value, type, location, texture;

		for( u in uniforms ) {

			location = program.uniforms[u];
			if ( !location ) continue;

			uniform = uniforms[u];

			type = uniform.type;
			value = uniform.value;

			if( type == "i" ) {

				_gl.uniform1i( location, value );

			} else if( type == "f" ) {

				_gl.uniform1f( location, value );

			} else if( type == "fv1" ) {

				_gl.uniform1fv( location, value );

			} else if( type == "fv" ) {

				_gl.uniform3fv( location, value );

			} else if( type == "v2" ) {

				_gl.uniform2f( location, value.x, value.y );

			} else if( type == "v3" ) {

				_gl.uniform3f( location, value.x, value.y, value.z );

			} else if( type == "c" ) {

				_gl.uniform3f( location, value.r, value.g, value.b );

			} else if( type == "t" ) {

				_gl.uniform1i( location, value );

				texture = uniform.texture;

				if ( !texture ) continue;

				if ( texture.image instanceof Array && texture.image.length == 6 ) {

					setCubeTexture( texture, value );

				} else {

					setTexture( texture, value );

				}

			}

		}

	};

	function setBlending ( blending ) {

		if ( blending != _oldBlending ) {

			switch ( blending ) {

				case THREE.AdditiveAlphaBlending:

					_gl.blendEquation( _gl.FUNC_ADD );
					_gl.blendFunc( _gl.SRC_ALPHA, _gl.ONE );

					break;

				case THREE.AdditiveBlending:

					_gl.blendEquation( _gl.FUNC_ADD );
					_gl.blendFunc( _gl.SRC_ALPHA, _gl.ONE );

					break;

				case THREE.SubtractiveBlending:

					// TODO: Find blendFuncSeparate() combination

					_gl.blendEquation( _gl.FUNC_ADD );
					_gl.blendFunc( _gl.ZERO, _gl.ONE_MINUS_SRC_COLOR );

					break;

				case THREE.MultiplyBlending:

					// TODO: Find blendFuncSeparate() combination

					_gl.blendEquation( _gl.FUNC_ADD );
					_gl.blendFunc( _gl.ZERO, _gl.SRC_COLOR );

					break;

				default:

					_gl.blendEquationSeparate( _gl.FUNC_ADD, _gl.FUNC_ADD );
					_gl.blendFuncSeparate( _gl.SRC_ALPHA, _gl.ONE_MINUS_SRC_ALPHA, _gl.ONE, _gl.ONE_MINUS_SRC_ALPHA );

					break;

			}

			_oldBlending = blending;

		}

	};

	function setTextureParameters ( textureType, texture, image ) {

		if ( isPowerOfTwo( image.width ) && isPowerOfTwo( image.height ) ) {

			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_S, paramThreeToGL( texture.wrapS ) );
			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_T, paramThreeToGL( texture.wrapT ) );

			_gl.texParameteri( textureType, _gl.TEXTURE_MAG_FILTER, paramThreeToGL( texture.magFilter ) );
			_gl.texParameteri( textureType, _gl.TEXTURE_MIN_FILTER, paramThreeToGL( texture.minFilter ) );

			_gl.generateMipmap( textureType );

		} else {

			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_S, _gl.CLAMP_TO_EDGE );
			_gl.texParameteri( textureType, _gl.TEXTURE_WRAP_T, _gl.CLAMP_TO_EDGE );

			_gl.texParameteri( textureType, _gl.TEXTURE_MAG_FILTER, filterFallback( texture.magFilter ) );
			_gl.texParameteri( textureType, _gl.TEXTURE_MIN_FILTER, filterFallback( texture.minFilter ) );

		}

	};

	function setTexture ( texture, slot ) {

		if ( texture.needsUpdate ) {

			if ( !texture.__webglInit ) {

				texture.__webglTexture = _gl.createTexture();

				_gl.bindTexture( _gl.TEXTURE_2D, texture.__webglTexture );
				_gl.texImage2D( _gl.TEXTURE_2D, 0, _gl.RGBA, _gl.RGBA, _gl.UNSIGNED_BYTE, texture.image );

				texture.__webglInit = true;

			} else {

				_gl.bindTexture( _gl.TEXTURE_2D, texture.__webglTexture );
				_gl.texSubImage2D( _gl.TEXTURE_2D, 0, 0, 0, _gl.RGBA, _gl.UNSIGNED_BYTE, texture.image );

			}

			setTextureParameters( _gl.TEXTURE_2D, texture, texture.image );
			_gl.bindTexture( _gl.TEXTURE_2D, null );

			texture.needsUpdate = false;

		}

		_gl.activeTexture( _gl.TEXTURE0 + slot );
		_gl.bindTexture( _gl.TEXTURE_2D, texture.__webglTexture );

	};

	function setCubeTexture ( texture, slot ) {

		if ( texture.image.length == 6 ) {

			if ( texture.needsUpdate ) {

				if ( !texture.__webglInit ) {

					texture.image.__webglTextureCube = _gl.createTexture();

					_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, texture.image.__webglTextureCube );

					for ( var i = 0; i < 6; ++i ) {

						_gl.texImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, _gl.RGBA, _gl.RGBA, _gl.UNSIGNED_BYTE, texture.image[ i ] );

					}

					texture.__webglInit = true;

				} else {

					_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, texture.image.__webglTextureCube );

					for ( var i = 0; i < 6; ++i ) {

						_gl.texSubImage2D( _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, 0, 0, _gl.RGBA, _gl.UNSIGNED_BYTE, texture.image[ i ] );

					}

				}

				setTextureParameters( _gl.TEXTURE_CUBE_MAP, texture, texture.image[0] );
				_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, null );

				texture.needsUpdate = false;

			}

			_gl.activeTexture( _gl.TEXTURE0 + slot );
			_gl.bindTexture( _gl.TEXTURE_CUBE_MAP, texture.image.__webglTextureCube );

		}

	};

	function setRenderTarget ( renderTexture ) {

		if ( renderTexture && !renderTexture.__webglFramebuffer ) {

			renderTexture.__webglFramebuffer = _gl.createFramebuffer();
			renderTexture.__webglRenderbuffer = _gl.createRenderbuffer();
			renderTexture.__webglTexture = _gl.createTexture();

			// Setup renderbuffer

			_gl.bindRenderbuffer( _gl.RENDERBUFFER, renderTexture.__webglRenderbuffer );
			_gl.renderbufferStorage( _gl.RENDERBUFFER, _gl.DEPTH_COMPONENT16, renderTexture.width, renderTexture.height );

			// Setup texture

			_gl.bindTexture( _gl.TEXTURE_2D, renderTexture.__webglTexture );
			_gl.texParameteri( _gl.TEXTURE_2D, _gl.TEXTURE_WRAP_S, paramThreeToGL( renderTexture.wrapS ) );
			_gl.texParameteri( _gl.TEXTURE_2D, _gl.TEXTURE_WRAP_T, paramThreeToGL( renderTexture.wrapT ) );
			_gl.texParameteri( _gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, paramThreeToGL( renderTexture.magFilter ) );
			_gl.texParameteri( _gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, paramThreeToGL( renderTexture.minFilter ) );
			_gl.texImage2D( _gl.TEXTURE_2D, 0, paramThreeToGL( renderTexture.format ), renderTexture.width, renderTexture.height, 0, paramThreeToGL( renderTexture.format ), paramThreeToGL( renderTexture.type ), null );

			// Setup framebuffer

			_gl.bindFramebuffer( _gl.FRAMEBUFFER, renderTexture.__webglFramebuffer );
			_gl.framebufferTexture2D( _gl.FRAMEBUFFER, _gl.COLOR_ATTACHMENT0, _gl.TEXTURE_2D, renderTexture.__webglTexture, 0 );
			_gl.framebufferRenderbuffer( _gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.RENDERBUFFER, renderTexture.__webglRenderbuffer );

			// Release everything

			_gl.bindTexture( _gl.TEXTURE_2D, null );
			_gl.bindRenderbuffer( _gl.RENDERBUFFER, null );
			_gl.bindFramebuffer( _gl.FRAMEBUFFER, null);

		}

		var framebuffer, width, height;

		if ( renderTexture ) {

			framebuffer = renderTexture.__webglFramebuffer;
			width = renderTexture.width;
			height = renderTexture.height;

		} else {

			framebuffer = null;
			width = _viewportWidth;
			height = _viewportHeight;

		}

		if( framebuffer != _currentFramebuffer ) {

			_gl.bindFramebuffer( _gl.FRAMEBUFFER, framebuffer );
			_gl.viewport( _viewportX, _viewportY, width, height );

			_currentFramebuffer = framebuffer;

		}

	};

	function updateRenderTargetMipmap ( renderTarget ) {

		_gl.bindTexture( _gl.TEXTURE_2D, renderTarget.__webglTexture );
		_gl.generateMipmap( _gl.TEXTURE_2D );
		_gl.bindTexture( _gl.TEXTURE_2D, null );

	};

	function cacheUniformLocations ( program, identifiers ) {

		var i, l, id;

		for( i = 0, l = identifiers.length; i < l; i++ ) {

			id = identifiers[ i ];
			program.uniforms[ id ] = _gl.getUniformLocation( program, id );

		}

	};

	function cacheAttributeLocations ( program, identifiers ) {

		var i, l, id;

		for( i = 0, l = identifiers.length; i < l; i++ ) {

			id = identifiers[ i ];
			program.attributes[ id ] = _gl.getAttribLocation( program, id );

		}

	};

	function getShader ( type, string ) {

		var shader;

		if ( type == "fragment" ) {

			shader = _gl.createShader( _gl.FRAGMENT_SHADER );

		} else if ( type == "vertex" ) {

			shader = _gl.createShader( _gl.VERTEX_SHADER );

		}

		_gl.shaderSource( shader, string );
		_gl.compileShader( shader );

		if ( !_gl.getShaderParameter( shader, _gl.COMPILE_STATUS ) ) {

			console.error( _gl.getShaderInfoLog( shader ) );
			console.error( string );
			return null;

		}

		return shader;

	};

	// fallback filters for non-power-of-2 textures

	function filterFallback ( f ) {

		switch ( f ) {

			case THREE.NearestFilter:
			case THREE.NearestMipMapNearestFilter:
			case THREE.NearestMipMapLinearFilter: return _gl.NEAREST; break;

			case THREE.LinearFilter:
			case THREE.LinearMipMapNearestFilter:
			case THREE.LinearMipMapLinearFilter: 
			default:
				
				return _gl.LINEAR; break;

		}
		
	};
	
	function paramThreeToGL ( p ) {

		switch ( p ) {

			case THREE.RepeatWrapping: return _gl.REPEAT; break;
			case THREE.ClampToEdgeWrapping: return _gl.CLAMP_TO_EDGE; break;
			case THREE.MirroredRepeatWrapping: return _gl.MIRRORED_REPEAT; break;

			case THREE.NearestFilter: return _gl.NEAREST; break;
			case THREE.NearestMipMapNearestFilter: return _gl.NEAREST_MIPMAP_NEAREST; break;
			case THREE.NearestMipMapLinearFilter: return _gl.NEAREST_MIPMAP_LINEAR; break;

			case THREE.LinearFilter: return _gl.LINEAR; break;
			case THREE.LinearMipMapNearestFilter: return _gl.LINEAR_MIPMAP_NEAREST; break;
			case THREE.LinearMipMapLinearFilter: return _gl.LINEAR_MIPMAP_LINEAR; break;

			case THREE.ByteType: return _gl.BYTE; break;
			case THREE.UnsignedByteType: return _gl.UNSIGNED_BYTE; break;
			case THREE.ShortType: return _gl.SHORT; break;
			case THREE.UnsignedShortType: return _gl.UNSIGNED_SHORT; break;
			case THREE.IntType: return _gl.INT; break;
			case THREE.UnsignedShortType: return _gl.UNSIGNED_INT; break;
			case THREE.FloatType: return _gl.FLOAT; break;

			case THREE.AlphaFormat: return _gl.ALPHA; break;
			case THREE.RGBFormat: return _gl.RGB; break;
			case THREE.RGBAFormat: return _gl.RGBA; break;
			case THREE.LuminanceFormat: return _gl.LUMINANCE; break;
			case THREE.LuminanceAlphaFormat: return _gl.LUMINANCE_ALPHA; break;

		}

		return 0;

	};

	function isPowerOfTwo ( value ) {

		return ( value & ( value - 1 ) ) == 0;

	};

	function materialNeedsSmoothNormals ( material ) {

		return material && material.shading != undefined && material.shading == THREE.SmoothShading;

	};

	function bufferNeedsSmoothNormals ( geometryGroup, object ) {

		var m, ml, i, l, meshMaterial, needsSmoothNormals = false;

		for ( m = 0, ml = object.materials.length; m < ml; m++ ) {

			meshMaterial = object.materials[ m ];

			if ( meshMaterial instanceof THREE.MeshFaceMaterial ) {

				for ( i = 0, l = geometryGroup.materials.length; i < l; i++ ) {

					if ( materialNeedsSmoothNormals( geometryGroup.materials[ i ] ) ) {

						needsSmoothNormals = true;
						break;

					}

				}

			} else {

				if ( materialNeedsSmoothNormals( meshMaterial ) ) {

					needsSmoothNormals = true;
					break;

				}

			}

			if ( needsSmoothNormals ) break;

		}

		return needsSmoothNormals;

	};

	function unrollGroupMaterials( geometryGroup, object ) {
		
		var m, ml, i, il,
			material, meshMaterial,
			materials = [];
		
		for ( m = 0, ml = object.materials.length; m < ml; m++ ) {

			meshMaterial = object.materials[ m ];

			if ( meshMaterial instanceof THREE.MeshFaceMaterial ) {

				for ( i = 0, l = geometryGroup.materials.length; i < l; i++ ) {

					material = geometryGroup.materials[ i ];

					if ( material ) {
						
						materials.push( material );

					}

				}

			} else {

				material = meshMaterial;

				if ( material ) {

					materials.push( material );

				}

			}

		}

		return materials;

	};

	function bufferGuessVertexColorType ( materials, geometryGroup, object ) {

		var i, m, ml = materials.length;

		// use vertexColor type from the first material in unrolled materials

		for ( i = 0; i < ml; i++ ) {

			m = materials[ i ];

			if ( m.vertexColors ) {

				return m.vertexColors;

			}

		}

		return false;

	};

	function bufferGuessNormalType ( materials, geometryGroup, object ) {

		var i, m, ml = materials.length;

		// only MeshBasicMaterial and MeshDepthMaterial don't need normals

		for ( i = 0; i < ml; i++ ) {

			m = materials[ i ];

			if ( ( m instanceof THREE.MeshBasicMaterial && !m.envMap ) || m instanceof THREE.MeshDepthMaterial ) continue;

			if ( materialNeedsSmoothNormals( m ) ) {

				return THREE.SmoothShading;

			} else {

				return THREE.FlatShading;

			}

		}

		return false;

	};

	function bufferGuessUVType ( materials, geometryGroup, object ) {

		var i, m, ml = materials.length;

		// material must use some texture to require uvs

		for ( i = 0; i < ml; i++ ) {

			m = materials[ i ];

			if ( m.map || m.lightMap || m instanceof THREE.MeshShaderMaterial ) {

				return true;

			}

		}

		return false;

	};

	function allocateBones ( object ) {

		// default for when object is not specified
		// ( for example when prebuilding shader
		//   to be used with multiple objects )
		//
		// 	- leave some extra space for other uniforms
		//  - limit here is ANGLE's 254 max uniform vectors
		//    (up to 54 should be safe)

		var maxBones = 50;

		if ( object !== undefined && object instanceof THREE.SkinnedMesh ) {

			maxBones = object.bones.length;

		}

		return maxBones;

	};

	function allocateLights ( lights, maxLights ) {

		var l, ll, light, dirLights, pointLights, maxDirLights, maxPointLights;
		dirLights = pointLights = maxDirLights = maxPointLights = 0;

		for ( l = 0, ll = lights.length; l < ll; l++ ) {

			light = lights[ l ];

			if ( light instanceof THREE.DirectionalLight ) dirLights++;
			if ( light instanceof THREE.PointLight ) pointLights++;

		}

		if ( ( pointLights + dirLights ) <= maxLights ) {

			maxDirLights = dirLights;
			maxPointLights = pointLights;

		} else {

			maxDirLights = Math.ceil( maxLights * dirLights / ( pointLights + dirLights ) );
			maxPointLights = maxLights - maxDirLights;

		}

		return { 'directional' : maxDirLights, 'point' : maxPointLights };

	};

	/* DEBUG
	function getGLParams() {

		var params  = {

			'MAX_VARYING_VECTORS': _gl.getParameter( _gl.MAX_VARYING_VECTORS ),
			'MAX_VERTEX_ATTRIBS': _gl.getParameter( _gl.MAX_VERTEX_ATTRIBS ),

			'MAX_TEXTURE_IMAGE_UNITS': _gl.getParameter( _gl.MAX_TEXTURE_IMAGE_UNITS ),
			'MAX_VERTEX_TEXTURE_IMAGE_UNITS': _gl.getParameter( _gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS ),
			'MAX_COMBINED_TEXTURE_IMAGE_UNITS' : _gl.getParameter( _gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS ),

			'MAX_VERTEX_UNIFORM_VECTORS': _gl.getParameter( _gl.MAX_VERTEX_UNIFORM_VECTORS ),
			'MAX_FRAGMENT_UNIFORM_VECTORS': _gl.getParameter( _gl.MAX_FRAGMENT_UNIFORM_VECTORS )
		}

		return params;
	};

	function dumpObject( obj ) {

		var p, str = "";
		for ( p in obj ) {

			str += p + ": " + obj[p] + "\n";

		}

		return str;
	}
	*/
};

