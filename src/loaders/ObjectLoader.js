/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.ObjectLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.ObjectLoader.prototype = {

	constructor: THREE.ObjectLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		if ( this.texturePath === undefined ) {

			this.texturePath = url.substring( 0, url.lastIndexOf( '/' ) + 1 );

		}

		var scope = this;

		var loader = new THREE.XHRLoader( scope.manager );
		loader.setCrossOrigin( this.crossOrigin );
		loader.load( url, function ( text ) {

			scope.parse( JSON.parse( text ), onLoad );

		}, onProgress, onError );

	},

	setTexturePath: function ( value ) {

		this.texturePath = value;

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	},

	parse: function ( json, onLoad ) {

		var scope = this;
		var geometries, materials, images, textures;

		this.manager.itemStart( json.object.uuid );

		geometries = this.parseGeometries( json.geometries );
		images = this.parseImages( json.images, function () {

			textures  = scope.parseTextures( json.textures, images );
			materials = scope.parseMaterials( json.materials, textures );

			onLoad( scope.parseObject( json.object, geometries, materials ) );

			// report back to parent manager
			scope.manager.itemEnd( json.object.uuid );

		} );

	},

	parseGeometries: function ( json ) {

		var geometries = {};

		if ( json !== undefined ) {

			var geometryLoader = new THREE.JSONLoader();
			var bufferGeometryLoader = new THREE.BufferGeometryLoader();

			for ( var i = 0, l = json.length; i < l; i ++ ) {

				var geometry;
				var data = json[ i ];

				switch ( data.type ) {

					case 'PlaneGeometry':

						geometry = new THREE.PlaneGeometry(
							data.width,
							data.height,
							data.widthSegments,
							data.heightSegments
						);

						break;

					case 'BoxGeometry':
					case 'CubeGeometry': // backwards compatible

						geometry = new THREE.BoxGeometry(
							data.width,
							data.height,
							data.depth,
							data.widthSegments,
							data.heightSegments,
							data.depthSegments
						);

						break;

					case 'CircleGeometry':

						geometry = new THREE.CircleGeometry(
							data.radius,
							data.segments
						);

						break;

					case 'CylinderGeometry':

						geometry = new THREE.CylinderGeometry(
							data.radiusTop,
							data.radiusBottom,
							data.height,
							data.radialSegments,
							data.heightSegments,
							data.openEnded
						);

						break;

					case 'SphereGeometry':

						geometry = new THREE.SphereGeometry(
							data.radius,
							data.widthSegments,
							data.heightSegments,
							data.phiStart,
							data.phiLength,
							data.thetaStart,
							data.thetaLength
						);

						break;

					case 'IcosahedronGeometry':

						geometry = new THREE.IcosahedronGeometry(
							data.radius,
							data.detail
						);

						break;

					case 'TorusGeometry':

						geometry = new THREE.TorusGeometry(
							data.radius,
							data.tube,
							data.radialSegments,
							data.tubularSegments,
							data.arc
						);

						break;

					case 'TorusKnotGeometry':

						geometry = new THREE.TorusKnotGeometry(
							data.radius,
							data.tube,
							data.radialSegments,
							data.tubularSegments,
							data.p,
							data.q,
							data.heightScale
						);

						break;

					case 'BufferGeometry':

						geometry = bufferGeometryLoader.parse( data.data );

						break;

					case 'Geometry':

						geometry = geometryLoader.parse( data.data ).geometry;

						break;

				}

				geometry.uuid = data.uuid;

				if ( data.name !== undefined ) geometry.name = data.name;

				geometries[ data.uuid ] = geometry;

			}

		}

		return geometries;

	},

	parseMaterials: function ( json, textures ) {

		var materials = {};

		if ( json !== undefined ) {

			var loader = new THREE.MaterialLoader();

			for ( var i = 0, l = json.length; i < l; i ++ ) {

				var data = json[ i ];
				var material = loader.parse( data );

				material.uuid = data.uuid;

				if ( data.name !== undefined ) material.name = data.name;

				if ( data.map ) {

					if ( textures[ data.map ] === undefined ) {

						console.warn( 'THREE.ObjectLoader: Undefined texture', data.map );

					}

					material.map = textures[ data.map ];

				}
				
				if ( data.bumpMap ) {	
			
					if ( !textures[data.bumpMap] ) {
						
						console.warn( 'THREE.ObjectLoader: Undefined texture', data.bumpMap );
					
					}
					
					material.bumpMap = textures[data.bumpMap];
					
				}
				
				if ( data.alphaMap ) {
					
					if ( !textures[data.alphaMap] ) {
						
						console.warn( 'THREE.ObjectLoader: Undefined texture', data.alphaMap );
						
					}
					
					material.alphaMap = textures[data.alphaMap];
					
				}
				
				if ( data.envMap ) {
				
					if ( !textures[data.envMap] ) {
						
						console.warn( 'THREE.ObjectLoader: Undefined texture', data.envMap );
						
					}
					
					material.envMap = textures[data.envMap];
					
				}
				
				if ( data.normalMap ) {
				
					if ( !textures[data.normalMap] ) {
						
						console.warn( 'THREE.ObjectLoader: Undefined texture', data.normalMap );
						
					}
					
					material.normalMap = textures[data.normalMap];
					
				}
				
				if ( data.lightMap ) {
				
					if ( !textures[data.lightMap] ) {
						
						console.warn( 'THREE.ObjectLoader: Undefined texture', data.lightMap );
						
					}
					
					material.lightMap = textures[data.lightMap];
					
				}
				
				if ( data.specularMap ) {
				
					if ( !textures[data.specularMap] ) {
						
						console.warn( 'THREE.ObjectLoader: Undefined texture', data.specularMap );
						
					}
					
					material.specularMap = textures[data.specularMap];
					
				}

				materials[ data.uuid ] = material;

			}

		}

		return materials;

	},

	parseImages: function ( json, onLoad ) {

		var scope = this;
		var images = {};

		if ( json !== undefined && json.length > 0 ) {

			var manager = new THREE.LoadingManager( onLoad );

			var loader = new THREE.ImageLoader( manager );
			loader.setCrossOrigin( this.crossOrigin );

			var loadImage = function ( data ) {

				var url = scope.texturePath + data.url;

				scope.manager.itemStart( url );

				loader.load( url, function ( image ) {

					scope.manager.itemEnd( url );

					images[ data.uuid ] = image;

				} );

			};

			for ( var i = 0, l = json.length; i < l; i ++ ) {

				loadImage( json[ i ] );

			}

		} else {

			onLoad();

		}

		return images;

	},

	parseTextures: function ( json, images ) {

		var textures = {};

		if ( json !== undefined ) {

			for ( var i = 0, l = json.length; i < l; i ++ ) {

				var data = json[ i ];

				if ( data.image === undefined ) {

					console.warn( 'THREE.ObjectLoader: No "image" speficied for', data.uuid );

				}

				if ( images[ data.image ] === undefined ) {

					console.warn( 'THREE.ObjectLoader: Undefined image', data.image );

				}

				var texture = new THREE.Texture( images[ data.image ] );
				texture.needsUpdate = true;

				texture.uuid = data.uuid;

				if ( data.name !== undefined ) texture.name = data.name;
				if ( data.repeat !== undefined ) texture.repeat = new THREE.Vector2( data.repeat[ 0 ], data.repeat[ 1 ] );
				if ( data.minFilter !== undefined ) texture.minFilter = THREE[ data.minFilter ];
				if ( data.magFilter !== undefined ) texture.magFilter = THREE[ data.magFilter ];
				if ( data.anisotropy !== undefined ) texture.anisotropy = data.anisotropy;
				if ( data.wrap instanceof Array ) {

					texture.wrapS = THREE[ data.wrap[ 0 ] ];
					texture.wrapT = THREE[ data.wrap[ 1 ] ];

				}

				textures[ data.uuid ] = texture;

			}

		}

		return textures;

	},

	parseObject: function () {

		var matrix = new THREE.Matrix4();

		return function ( data, geometries, materials ) {

			var object;

			switch ( data.type ) {

				case 'Scene':

					object = new THREE.Scene();

					break;

				case 'PerspectiveCamera':

					object = new THREE.PerspectiveCamera( data.fov, data.aspect, data.near, data.far );

					break;

				case 'OrthographicCamera':

					object = new THREE.OrthographicCamera( data.left, data.right, data.top, data.bottom, data.near, data.far );

					break;

				case 'AmbientLight':

					object = new THREE.AmbientLight( data.color );

					break;

				case 'DirectionalLight':

					object = new THREE.DirectionalLight( data.color, data.intensity );

					break;

				case 'PointLight':

					object = new THREE.PointLight( data.color, data.intensity, data.distance, data.decay );

					break;

				case 'SpotLight':

					object = new THREE.SpotLight( data.color, data.intensity, data.distance, data.angle, data.exponent, data.decay );

					break;

				case 'HemisphereLight':

					object = new THREE.HemisphereLight( data.color, data.groundColor, data.intensity );

					break;

				case 'Mesh':

					var geometry = geometries[ data.geometry ];
					var material = materials[ data.material ];

					if ( geometry === undefined ) {

						THREE.warn( 'THREE.ObjectLoader: Undefined geometry', data.geometry );

					}

					if ( material === undefined ) {

						THREE.warn( 'THREE.ObjectLoader: Undefined material', data.material );

					}

					object = new THREE.Mesh( geometry, material );

					break;

				case 'Line':

					var geometry = geometries[ data.geometry ];
					var material = materials[ data.material ];

					if ( geometry === undefined ) {

						THREE.warn( 'THREE.ObjectLoader: Undefined geometry', data.geometry );

					}

					if ( material === undefined ) {

						THREE.warn( 'THREE.ObjectLoader: Undefined material', data.material );

					}

					object = new THREE.Line( geometry, material );

					break;
					
				case 'PointCloud':

					var geometry = geometries[ data.geometry ];
					var material = materials[ data.material ];

					if ( geometry === undefined ) {

						console.warn( 'THREE.ObjectLoader: Undefined geometry', data.geometry );

					}

					if ( material === undefined ) {

						console.warn( 'THREE.ObjectLoader: Undefined material', data.material );

					}

					object = new THREE.PointCloud( geometry, material );

					break;

				case 'Sprite':

					var material = materials[ data.material ];

					if ( material === undefined ) {

						THREE.warn( 'THREE.ObjectLoader: Undefined material', data.material );

					}

					object = new THREE.Sprite( material );

					break;

				case 'Group':

					object = new THREE.Group();

					break;

				default:

					object = new THREE.Object3D();

			}

			object.uuid = data.uuid;

			if ( data.name !== undefined ) object.name = data.name;
			if ( data.matrix !== undefined ) {

				matrix.fromArray( data.matrix );
				matrix.decompose( object.position, object.quaternion, object.scale );

			} else {

				if ( data.position !== undefined ) object.position.fromArray( data.position );
				if ( data.rotation !== undefined ) object.rotation.fromArray( data.rotation );
				if ( data.scale !== undefined ) object.scale.fromArray( data.scale );

			}

			if ( data.visible !== undefined ) object.visible = data.visible;
			if ( data.userData !== undefined ) object.userData = data.userData;

			if ( data.children !== undefined ) {

				for ( var child in data.children ) {

					object.add( this.parseObject( data.children[ child ], geometries, materials ) );

				}

			}

			return object;

		}

	}()

};
