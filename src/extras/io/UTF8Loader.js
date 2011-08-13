/**
 * Loader for UTF8 encoded models generated by:
 *	http://code.google.com/p/webgl-loader/
 *
 * Limitations:
 *  - number of vertices < 65536 (this is after optimizations in compressor, input OBJ may have even less)
 *	- models must have normals and texture coordinates
 *  - texture coordinates must be only from <0,1>
 *  - no materials support yet
 *  - models are scaled and offset (copy numbers from compressor and use them as parameters in UTF8Loader.load() )
 *
 * @author alteredq / http://alteredqualia.com/
 * @author won3d / http://twitter.com/won3d
 */

THREE.UTF8Loader = function ( ) {

};

THREE.UTF8Loader.prototype = new THREE.UTF8Loader();
THREE.UTF8Loader.prototype.constructor = THREE.UTF8Loader;


THREE.UTF8Loader.prototype = {

	// Load UTF8 compressed models generated by objcompress
	//  - parameters
	//		- model (required)
	//		- callback (required)

	load: function( parameters ) {

		var xhr = new XMLHttpRequest(),
			url = parameters.model,

			callback = parameters.callback,
			callback_progress = null,

			scale = parameters.scale !== undefined ? parameters.scale : 1,
			offsetX = parameters.offsetX !== undefined ? parameters.offsetX : 0,
			offsetY = parameters.offsetY !== undefined ? parameters.offsetY : 0,
			offsetZ = parameters.offsetZ !== undefined ? parameters.offsetZ : 0;

		var length = 0;

		xhr.onreadystatechange = function() {

			if ( xhr.readyState == 4 ) {

				if ( xhr.status == 200 || xhr.status == 0 ) {

					THREE.UTF8Loader.prototype.createModel( xhr.responseText, callback, scale, offsetX, offsetY, offsetZ );

				} else {

					alert( "Couldn't load [" + url + "] [" + xhr.status + "]" );

				}

			} else if ( xhr.readyState == 3 ) {

				if ( callback_progress ) {

					if ( length == 0 ) {

						length = xhr.getResponseHeader( "Content-Length" );

					}

					callback_progress( { total: length, loaded: xhr.responseText.length } );

				}

			} else if ( xhr.readyState == 2 ) {

				length = xhr.getResponseHeader( "Content-Length" );

			}

		}

		xhr.open( "GET", url, true );
		xhr.send( null );

	},

	// UTF-8 decoder from webgl-loader
	// http://code.google.com/p/webgl-loader/

	// Copyright 2011 Google Inc. All Rights Reserved.
	//
	// Licensed under the Apache License, Version 2.0 (the "License"); you
	// may not use this file except in compliance with the License. You
	// may obtain a copy of the License at
	//
	// http://www.apache.org/licenses/LICENSE-2.0
	//
	// Unless required by applicable law or agreed to in writing, software
	// distributed under the License is distributed on an "AS IS" BASIS,
	// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
	// implied. See the License for the specific language governing
	// permissions and limitations under the License.

	decompressMesh: function ( str ) {

		var num_verts = str.charCodeAt( 0 );

		if ( num_verts >= 0xE000 ) {

			num_verts -= 0x0800;

		}

		num_verts ++;

		var attribs_out = new Float32Array( 8 * num_verts );

		var offset = 1;

		for ( var i = 0; i < 8; i ++ ) {

			var prev_attrib = 0;

			for ( var j = 0; j < num_verts; ++ j ) {

				var code = str.charCodeAt( j + offset );

				prev_attrib += ( code >> 1 ) ^ ( - ( code & 1 ) );

				attribs_out[ 8 * j + i ] = prev_attrib;

			}

			offset += num_verts;

		}

		var num_indices = str.length - offset;

		var indices_out = new Uint16Array( num_indices );

		var index_high_water_mark = 0;

		for ( var i = 0; i < num_indices; i ++ ) {

			var code = str.charCodeAt( i + offset );

			indices_out[ i ] = index_high_water_mark - code;

			if ( code == 0 ) {

				index_high_water_mark ++;

			}

		}

		return [ attribs_out, indices_out ];

	},

	createModel: function ( data, callback, scale, offsetX, offsetY, offsetZ ) {

		var Model = function ( texture_path ) {

			var s = (new Date).getTime();

			var scope = this;

			scope.materials = [];

			THREE.Geometry.call( this );

			var buffers = THREE.UTF8Loader.prototype.decompressMesh( data );

			var normals = [],
				uvs = [];

			init_vertices( buffers[ 0 ], 8, 0 );
			init_uvs( buffers[ 0 ], 8, 3 );
			init_normals( buffers[ 0 ], 8, 5 );

			init_faces( buffers[ 1 ] );

			this.computeCentroids();
			this.computeFaceNormals();
			//this.computeTangents();

			var e = (new Date).getTime();

			console.log( "utf8 data parse time: " + (e-s) + " ms" );

			function init_vertices( data, stride, offset ) {

				var i, x, y, z,
					end = data.length;

				for( i = offset; i < end; i += stride ) {

					x = data[ i ];
					y = data[ i + 1 ];
					z = data[ i + 2 ];

					// fix scale and offsets

					x = ( x / 16383 ) * scale;
					y = ( y / 16383 ) * scale;
					z = ( z / 16383 ) * scale;

					x += offsetX;
					y += offsetY;
					z += offsetZ;

					THREE.UTF8Loader.prototype.v( scope, x, y, z );

				}

			}

			function init_normals( data, stride, offset ) {

				var i, x, y, z,
					end = data.length;

				for( i = offset; i < end; i += stride ) {

					x = data[ i ];
					y = data[ i + 1 ];
					z = data[ i + 2 ];

					// normalize to <-1,1>

					x = ( x - 512 ) / 511;
					y = ( y - 512 ) / 511;
					z = ( z - 512 ) / 511;

					normals.push( x, y, z );

				}

			}

			function init_uvs( data, stride, offset ) {

				var i, u, v,
					end = data.length;

				for( i = offset; i < end; i += stride ) {

					u = data[ i ];
					v = data[ i + 1 ];

					// normalize to <0,1>

					u /= 1023;
					v /= 1023;

					uvs.push( u, v );

				}

			}

			function init_faces( indices ) {

				var i,
					a, b, c,
					u1, v1, u2, v2, u3, v3,
					m,
					end = indices.length;

				m = 0; // all faces defaulting to material 0

				for( i = 0; i < end; i += 3 ) {

					a = indices[ i ];
					b = indices[ i + 1 ];
					c = indices[ i + 2 ];

					THREE.UTF8Loader.prototype.f3n( scope, normals, a, b, c, m, a, b, c );

					u1 = uvs[ a * 2 ];
					v1 = uvs[ a * 2 + 1 ];

					u2 = uvs[ b * 2 ];
					v2 = uvs[ b * 2 + 1 ];

					u3 = uvs[ c * 2 ];
					v3 = uvs[ c * 2 + 1 ];

					THREE.UTF8Loader.prototype.uv3( scope.faceVertexUvs[ 0 ], u1, v1, u2, v2, u3, v3 );

				}


			}

		}

		Model.prototype = new THREE.Geometry();
		Model.prototype.constructor = Model;

		callback( new Model() );

	},


	v: function( scope, x, y, z ) {

		scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );

	},

	f3n: function( scope, normals, a, b, c, mi, na, nb, nc ) {

		var material = scope.materials[ mi ],

			nax = normals[ na * 3     ],
			nay = normals[ na * 3 + 1 ],
			naz = normals[ na * 3 + 2 ],

			nbx = normals[ nb * 3     ],
			nby = normals[ nb * 3 + 1 ],
			nbz = normals[ nb * 3 + 2 ],

			ncx = normals[ nc * 3     ],
			ncy = normals[ nc * 3 + 1 ],
			ncz = normals[ nc * 3 + 2 ];

		var na = new THREE.Vector3( nax, nay, naz ),
			nb = new THREE.Vector3( nbx, nby, nbz ),
			nc = new THREE.Vector3( ncx, ncy, ncz );

		scope.faces.push( new THREE.Face3( a, b, c, [ na, nb, nc ], null, material ) );

	},

	uv3: function( where, u1, v1, u2, v2, u3, v3 ) {

		var uv = [];
		uv.push( new THREE.UV( u1, v1 ) );
		uv.push( new THREE.UV( u2, v2 ) );
		uv.push( new THREE.UV( u3, v3 ) );
		where.push( uv );

	},

	constructor : THREE.UTF8Loader

};
