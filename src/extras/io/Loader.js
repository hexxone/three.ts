/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Loader = function() {
};

THREE.Loader.prototype = {

	// Load models generated by Blender exporter and original OBJ converter (converter_obj_three.py)

	loadAsciiOld: function( url, callback ) {

		var element = document.createElement( 'script' );
		element.type = 'text/javascript';
		element.onload = callback;
		element.src = url;
		document.getElementsByTagName( "head" )[ 0 ].appendChild( element );

	},

	// Load models generated by slim OBJ converter with ASCII option (converter_obj_three_slim.py -t ascii)
	//  - urlbase parameter is optional (it only applies to models with textures)

	loadAscii: function ( url, callback, urlbase ) {

		var s = (new Date).getTime(),
			worker = new Worker( url );

		worker.onmessage = function( event ) {

			THREE.Loader.prototype.createModel( event.data, callback, urlbase );

		};

		worker.postMessage( s );

	},

	// Load models generated by slim OBJ converter with BINARY option (converter_obj_three_slim.py -t binary)
	//  - urlbase parameter is mandatory (it applies to all models, it tells where to find the file with binary buffers)
	//  - binary models consist of two files: JS and BIN

	loadBinary: function( url, callback, urlbase ) {

		// #1 load JS part via web worker

		//  This isn't really necessary, JS part is tiny,
		//  could be done by more ordinary means.

		var s = (new Date).getTime(),
			worker = new Worker( url );

		worker.onmessage = function( event ) {

			var materials = event.data.materials,
				buffers = event.data.buffers;

			// #2 load BIN part via Ajax

			//  For some reason it is faster doing loading from here than from within the worker.
			//  Maybe passing of ginormous string as message between threads is costly? 
			//  Also, worker loading huge data by Ajax still freezes browser. Go figure, 
			//  worker with baked ascii JSON data keeps browser more responsive.

			THREE.Loader.prototype.loadAjaxBuffers( buffers, materials, callback, urlbase );

		};

		worker.onerror = function (event) {

			alert( "worker.onerror: " + event.message + "\n" + event.data );
			event.preventDefault();

		};

		worker.postMessage( s );

	},

	// Binary AJAX parser based on Magi binary loader
	// https://github.com/kig/magi

	// Should look more into HTML5 File API
	// See also other suggestions by Gregg Tavares
	// https://groups.google.com/group/o3d-discuss/browse_thread/thread/a8967bc9ce1e0978

	loadAjaxBuffers: function( buffers, materials, callback, urlbase ) {

		var xhr = new XMLHttpRequest(),
			url = urlbase + "/" + buffers;

		xhr.onreadystatechange = function() {

			if ( xhr.readyState == 4 ) {

				if ( xhr.status == 200 || xhr.status == 0 ) {

					THREE.Loader.prototype.createBinModel( xhr.responseText, callback, urlbase, materials );

				} else {

					alert( "Couldn't load [" + url + "] [" + xhr.status + "]" );

				}
			}
		}

		xhr.open("GET", url, true);
		xhr.overrideMimeType("text/plain; charset=x-user-defined");
		xhr.setRequestHeader("Content-Type", "text/plain");
		xhr.send(null);

	},

	createBinModel: function ( data, callback, urlbase, materials ) {

		var Model = function ( urlbase ) {

			//var s = (new Date).getTime();

			var scope = this,
				currentOffset = 0, 
				md,
				normals = [],
				uvs = [],
				tri_b, tri_c, tri_m, tri_na, tri_nb, tri_nc,
				quad_b, quad_c, quad_d, quad_m, quad_na, quad_nb, quad_nc, quad_nd,
				tri_uvb, tri_uvc, quad_uvb, quad_uvc, quad_uvd;


			THREE.Geometry.call(this);

			THREE.Loader.prototype.init_materials( scope, materials, urlbase );

			md = parseMetaData( data, currentOffset );
			currentOffset += md.header_bytes;

			// cache offsets
			
			tri_b   = md.vertex_index_bytes, 
			tri_c   = md.vertex_index_bytes*2, 
			tri_m   = md.vertex_index_bytes*3,
			tri_na  = md.vertex_index_bytes*3 + md.material_index_bytes,
			tri_nb  = md.vertex_index_bytes*3 + md.material_index_bytes + md.normal_index_bytes,
			tri_nc  = md.vertex_index_bytes*3 + md.material_index_bytes + md.normal_index_bytes*2,
		
			quad_b  = md.vertex_index_bytes,
			quad_c  = md.vertex_index_bytes*2,
			quad_d  = md.vertex_index_bytes*3,
			quad_m  = md.vertex_index_bytes*4,
			quad_na = md.vertex_index_bytes*4 + md.material_index_bytes,
			quad_nb = md.vertex_index_bytes*4 + md.material_index_bytes + md.normal_index_bytes,
			quad_nc = md.vertex_index_bytes*4 + md.material_index_bytes + md.normal_index_bytes*2,
			quad_nd = md.vertex_index_bytes*4 + md.material_index_bytes + md.normal_index_bytes*3,
		
			tri_uvb = md.uv_index_bytes,
			tri_uvc = md.uv_index_bytes * 2,
		
			quad_uvb = md.uv_index_bytes,
			quad_uvc = md.uv_index_bytes * 2,
			quad_uvd = md.uv_index_bytes * 3;
			
			currentOffset += init_vertices( currentOffset );
			currentOffset += init_normals( currentOffset );
			currentOffset += init_uvs( currentOffset );

			currentOffset += init_triangles_flat( currentOffset );
			currentOffset += init_triangles_smooth( currentOffset );
			currentOffset += init_triangles_flat_uv( currentOffset );
			currentOffset += init_triangles_smooth_uv( currentOffset );

			currentOffset += init_quads_flat( currentOffset );
			currentOffset += init_quads_smooth( currentOffset );
			currentOffset += init_quads_flat_uv( currentOffset );
			currentOffset += init_quads_smooth_uv( currentOffset );

			this.computeCentroids();
			this.computeNormals();

			//var e = (new Date).getTime();

			//log( "binary data parse time: " + (e-s) + " ms" );

			function parseMetaData( data, offset ) {

				var metaData = {

					'signature'               :parseString( data, offset, 8 ),
					'header_bytes'            :parseUChar8( data, offset + 8 ),

					'vertex_coordinate_bytes' :parseUChar8( data, offset + 9 ),
					'normal_coordinate_bytes' :parseUChar8( data, offset + 10 ),
					'uv_coordinate_bytes'     :parseUChar8( data, offset + 11 ),

					'vertex_index_bytes'      :parseUChar8( data, offset + 12 ),
					'normal_index_bytes'      :parseUChar8( data, offset + 13 ),
					'uv_index_bytes'          :parseUChar8( data, offset + 14 ),
					'material_index_bytes'    :parseUChar8( data, offset + 15 ),

					'nvertices'    :parseUInt32( data, offset + 16 ),
					'nnormals'     :parseUInt32( data, offset + 16 + 4*1 ),
					'nuvs'         :parseUInt32( data, offset + 16 + 4*2 ),

					'ntri_flat'      :parseUInt32( data, offset + 16 + 4*3 ),
					'ntri_smooth'    :parseUInt32( data, offset + 16 + 4*4 ),
					'ntri_flat_uv'   :parseUInt32( data, offset + 16 + 4*5 ),
					'ntri_smooth_uv' :parseUInt32( data, offset + 16 + 4*6 ),

					'nquad_flat'      :parseUInt32( data, offset + 16 + 4*7 ),
					'nquad_smooth'    :parseUInt32( data, offset + 16 + 4*8 ),
					'nquad_flat_uv'   :parseUInt32( data, offset + 16 + 4*9 ),
					'nquad_smooth_uv' :parseUInt32( data, offset + 16 + 4*10 )

				};

				/*
				log( "signature: " + metaData.signature );

				log( "header_bytes: " + metaData.header_bytes );
				log( "vertex_coordinate_bytes: " + metaData.vertex_coordinate_bytes );
				log( "normal_coordinate_bytes: " + metaData.normal_coordinate_bytes );
				log( "uv_coordinate_bytes: " + metaData.uv_coordinate_bytes );

				log( "vertex_index_bytes: " + metaData.vertex_index_bytes );
				log( "normal_index_bytes: " + metaData.normal_index_bytes );
				log( "uv_index_bytes: " + metaData.uv_index_bytes );
				log( "material_index_bytes: " + metaData.material_index_bytes );

				log( "nvertices: " + metaData.nvertices );
				log( "nnormals: " + metaData.nnormals );
				log( "nuvs: " + metaData.nuvs );

				log( "ntri_flat: " + metaData.ntri_flat );
				log( "ntri_smooth: " + metaData.ntri_smooth );
				log( "ntri_flat_uv: " + metaData.ntri_flat_uv );
				log( "ntri_smooth_uv: " + metaData.ntri_smooth_uv );

				log( "nquad_flat: " + metaData.nquad_flat );
				log( "nquad_smooth: " + metaData.nquad_smooth );
				log( "nquad_flat_uv: " + metaData.nquad_flat_uv );
				log( "nquad_smooth_uv: " + metaData.nquad_smooth_uv );

				var total = metaData.header_bytes
						  + metaData.nvertices * metaData.vertex_coordinate_bytes * 3
						  + metaData.nnormals * metaData.normal_coordinate_bytes * 3
						  + metaData.nuvs * metaData.uv_coordinate_bytes * 2
						  + metaData.ntri_flat * ( metaData.vertex_index_bytes*3 + metaData.material_index_bytes )
						  + metaData.ntri_smooth * ( metaData.vertex_index_bytes*3 + metaData.material_index_bytes + metaData.normal_index_bytes*3 )
						  + metaData.ntri_flat_uv * ( metaData.vertex_index_bytes*3 + metaData.material_index_bytes + metaData.uv_index_bytes*3 )
						  + metaData.ntri_smooth_uv * ( metaData.vertex_index_bytes*3 + metaData.material_index_bytes + metaData.normal_index_bytes*3 + metaData.uv_index_bytes*3 )
						  + metaData.nquad_flat * ( metaData.vertex_index_bytes*4 + metaData.material_index_bytes )
						  + metaData.nquad_smooth * ( metaData.vertex_index_bytes*4 + metaData.material_index_bytes + metaData.normal_index_bytes*4 )
						  + metaData.nquad_flat_uv * ( metaData.vertex_index_bytes*4 + metaData.material_index_bytes + metaData.uv_index_bytes*4 )
						  + metaData.nquad_smooth_uv * ( metaData.vertex_index_bytes*4 + metaData.material_index_bytes + metaData.normal_index_bytes*4 + metaData.uv_index_bytes*4 );
				log( "total bytes: " + total );
				*/

				return metaData;

			}

			function parseString( data, offset, length ) {

				return data.substr( offset, length );

			}

			function parseFloat32( data, offset ) {

				var b3 = parseUChar8( data, offset ),
					b2 = parseUChar8( data, offset + 1 ),
					b1 = parseUChar8( data, offset + 2 ),
					b0 = parseUChar8( data, offset + 3 ),

					sign = 1 - ( 2 * ( b0 >> 7 ) ),
					exponent = ((( b0 << 1 ) & 0xff) | ( b1 >> 7 )) - 127,
					mantissa = (( b1 & 0x7f ) << 16) | (b2 << 8) | b3;

					if (mantissa == 0 && exponent == -127)
						return 0.0;

					return sign * ( 1 + mantissa * Math.pow( 2, -23 ) ) * Math.pow( 2, exponent );

			}

			function parseUInt32( data, offset ) {

				var b0 = parseUChar8( data, offset ),
					b1 = parseUChar8( data, offset + 1 ),
					b2 = parseUChar8( data, offset + 2 ),
					b3 = parseUChar8( data, offset + 3 );

				return (b3 << 24) + (b2 << 16) + (b1 << 8) + b0;
			}

			function parseUInt16( data, offset ) {

				var b0 = parseUChar8( data, offset ),
					b1 = parseUChar8( data, offset + 1 );

				return (b1 << 8) + b0;

			}

			function parseSChar8( data, offset ) {

				var b = parseUChar8( data, offset );
				return b > 127 ? b - 256 : b;

			}

			function parseUChar8( data, offset ) {

				return data.charCodeAt( offset ) & 0xff;
			}

			function init_vertices( start ) {

				var i, x, y, z, 
					stride = md.vertex_coordinate_bytes * 3,
					end = start + md.nvertices * stride;

				for( i = start; i < end; i += stride ) {

					x = parseFloat32( data, i );
					y = parseFloat32( data, i + md.vertex_coordinate_bytes );
					z = parseFloat32( data, i + md.vertex_coordinate_bytes*2 );

					THREE.Loader.prototype.v( scope, x, y, z );

				}

				return md.nvertices * stride;

			}

			function init_normals( start ) {

				var i, x, y, z, 
					stride = md.normal_coordinate_bytes * 3,
					end = start + md.nnormals * stride;

				for( i = start; i < end; i += stride ) {

					x = parseSChar8( data, i );
					y = parseSChar8( data, i + md.normal_coordinate_bytes );
					z = parseSChar8( data, i + md.normal_coordinate_bytes*2 );

					normals.push( x/127, y/127, z/127 );

				}

				return md.nnormals * stride;

			}

			function init_uvs( start ) {

				var i, u, v, 
					stride = md.uv_coordinate_bytes * 2,
					end = start + md.nuvs * stride;

				for( i = start; i < end; i += stride ) {

					u = parseFloat32( data, i );
					v = parseFloat32( data, i + md.uv_coordinate_bytes );

					uvs.push( u, v );

				}
				
				return md.nuvs * stride;

			}			
			
			function add_tri( i ) {

				var a, b, c, m;

				a = parseUInt32( data, i );
				b = parseUInt32( data, i + tri_b );
				c = parseUInt32( data, i + tri_c );

				m = parseUInt16( data, i + tri_m );

				THREE.Loader.prototype.f3( scope, a, b, c, m );

			}

			function add_tri_n( i ) {

				var a, b, c, m, na, nb, nc;

				a  = parseUInt32( data, i );
				b  = parseUInt32( data, i + tri_b );
				c  = parseUInt32( data, i + tri_c );

				m  = parseUInt16( data, i + tri_m );

				na = parseUInt32( data, i + tri_na );
				nb = parseUInt32( data, i + tri_nb );
				nc = parseUInt32( data, i + tri_nc );

				THREE.Loader.prototype.f3n( scope, normals, a, b, c, m, na, nb, nc );

			}

			function add_quad( i ) {

				var a, b, c, d, m;

				a = parseUInt32( data, i );
				b = parseUInt32( data, i + quad_b );
				c = parseUInt32( data, i + quad_c );
				d = parseUInt32( data, i + quad_d );

				m = parseUInt16( data, i + quad_m );

				THREE.Loader.prototype.f4( scope, a, b, c, d, m );

			}

			function add_quad_n( i ) {

				var a, b, c, d, m, na, nb, nc, nd;

				a  = parseUInt32( data, i );
				b  = parseUInt32( data, i + quad_b );
				c  = parseUInt32( data, i + quad_c );
				d  = parseUInt32( data, i + quad_d );

				m  = parseUInt16( data, i + quad_m );

				na = parseUInt32( data, i + quad_na );
				nb = parseUInt32( data, i + quad_nb );
				nc = parseUInt32( data, i + quad_nc );
				nd = parseUInt32( data, i + quad_nd );

				THREE.Loader.prototype.f4n( scope, normals, a, b, c, d, m, na, nb, nc, nd );

			}

			function add_uv3( i ) {

				var uva, uvb, uvc, u1, u2, u3, v1, v2, v3;

				uva = parseUInt32( data, i );
				uvb = parseUInt32( data, i + tri_uvb );
				uvc = parseUInt32( data, i + tri_uvc );

				u1 = uvs[ uva*2 ];
				v1 = uvs[ uva*2 + 1 ];

				u2 = uvs[ uvb*2 ];
				v2 = uvs[ uvb*2 + 1 ];

				u3 = uvs[ uvc*2 ];
				v3 = uvs[ uvc*2 + 1 ];

				THREE.Loader.prototype.uv3( scope, u1, v1, u2, v2, u3, v3 );

			}

			function add_uv4( i ) {

				var uva, uvb, uvc, uvd, u1, u2, u3, u4, v1, v2, v3, v4;

				uva = parseUInt32( data, i );
				uvb = parseUInt32( data, i + quad_uvb );
				uvc = parseUInt32( data, i + quad_uvc );
				uvd = parseUInt32( data, i + quad_uvd );

				u1 = uvs[ uva*2 ];
				v1 = uvs[ uva*2 + 1 ];

				u2 = uvs[ uvb*2 ];
				v2 = uvs[ uvb*2 + 1 ];

				u3 = uvs[ uvc*2 ];
				v3 = uvs[ uvc*2 + 1 ];

				u4 = uvs[ uvd*2 ];
				v4 = uvs[ uvd*2 + 1 ];

				THREE.Loader.prototype.uv4( scope, u1, v1, u2, v2, u3, v3, u4, v4 );

			}

			function init_triangles_flat( start ) {

				var i, stride = md.vertex_index_bytes * 3 + md.material_index_bytes,
					end = start + md.ntri_flat * stride;

				for( i = start; i < end; i += stride ) {

					add_tri( i );

				}

				return end - start;

			}

			function init_triangles_flat_uv( start ) {

				var i, offset = md.vertex_index_bytes * 3 + md.material_index_bytes,
					stride = offset + md.uv_index_bytes * 3,
					end = start + md.ntri_flat_uv * stride;

				for( i = start; i < end; i += stride ) {

					add_tri( i );
					add_uv3( i + offset );

				}

				return end - start;

			}

			function init_triangles_smooth( start ) {

				var i, stride = md.vertex_index_bytes * 3 + md.material_index_bytes + md.normal_index_bytes * 3,
					end = start + md.ntri_smooth * stride;

				for( i = start; i < end; i += stride ) {

					add_tri_n( i );

				}

				return end - start;

			}

			function init_triangles_smooth_uv( start ) {

				var i, offset = md.vertex_index_bytes * 3 + md.material_index_bytes + md.normal_index_bytes * 3,
					stride = offset + md.uv_index_bytes * 3,
					end = start + md.ntri_smooth_uv * stride;

				for( i = start; i < end; i += stride ) {

					add_tri_n( i );
					add_uv3( i + offset );

				}

				return end - start;

			}

			function init_quads_flat( start ) {

				var i, stride = md.vertex_index_bytes * 4 + md.material_index_bytes,
					end = start + md.nquad_flat * stride;

				for( i = start; i < end; i += stride ) {

					add_quad( i );

				}

				return end - start;

			}

			function init_quads_flat_uv( start ) {

				var i, offset = md.vertex_index_bytes * 4 + md.material_index_bytes,
					stride = offset + md.uv_index_bytes * 4,
					end = start + md.nquad_flat_uv * stride;

				for( i = start; i < end; i += stride ) {

					add_quad( i );
					add_uv4( i + offset );

				}

				return end - start;

			}

			function init_quads_smooth( start ) {

				var i, stride = md.vertex_index_bytes * 4 + md.material_index_bytes + md.normal_index_bytes * 4,
					end = start + md.nquad_smooth * stride;

				for( i = start; i < end; i += stride ) {

					add_quad_n( i );
				}

				return end - start;

			}

			function init_quads_smooth_uv( start ) {

				var i, offset = md.vertex_index_bytes * 4 + md.material_index_bytes + md.normal_index_bytes * 4, 
					stride =  offset + md.uv_index_bytes * 4,
					end = start + md.nquad_smooth_uv * stride;

				for( i = start; i < end; i += stride ) {

					add_quad_n( i );
					add_uv4( i + offset );

				}

				return end - start;

			}

		}

		Model.prototype = new THREE.Geometry();
		Model.prototype.constructor = Model;

		callback( new Model( urlbase ) );

	},

	createModel: function ( data, callback, urlbase ) {

		var Model = function ( urlbase ) {

			var scope = this;

			THREE.Geometry.call(this);

			THREE.Loader.prototype.init_materials( scope, data.materials, urlbase );

			init_vertices();
			init_faces();

			this.computeCentroids();
			this.computeNormals();

			function init_vertices() {

				var i, l, x, y, z;

				for( i = 0, l = data.vertices.length; i < l; i += 3 ) {

					x = data.vertices[ i     ];
					y = data.vertices[ i + 1 ];
					z = data.vertices[ i + 2 ];

					THREE.Loader.prototype.v( scope, x, y, z );

				}

			}

			function init_faces() {

				function add_tri( src, i ) {

					var a, b, c, m;

					a = src[ i ];
					b = src[ i + 1 ];
					c = src[ i + 2 ];

					m = src[ i + 3 ];

					THREE.Loader.prototype.f3( scope, a, b, c, m );

				}

				function add_tri_n( src, i ) {

					var a, b, c, m, na, nb, nc;

					a  = src[ i ];
					b  = src[ i + 1 ];
					c  = src[ i + 2 ];

					m  = src[ i + 3 ];

					na = src[ i + 4 ];
					nb = src[ i + 5 ];
					nc = src[ i + 6 ];

					THREE.Loader.prototype.f3n( scope, data.normals, a, b, c, m, na, nb, nc );

				}

				function add_quad( src, i ) {

					var a, b, c, d, m;

					a = src[ i ];
					b = src[ i + 1 ];
					c = src[ i + 2 ];
					d = src[ i + 3 ];

					m = src[ i + 4 ];

					THREE.Loader.prototype.f4( scope, a, b, c, d, m );

				}

				function add_quad_n( src, i ) {

					var a, b, c, d, m, na, nb, nc, nd;

					a  = src[ i ];
					b  = src[ i + 1 ];
					c  = src[ i + 2 ];
					d  = src[ i + 3 ];

					m  = src[ i + 4 ];

					na = src[ i + 5 ];
					nb = src[ i + 6 ];
					nc = src[ i + 7 ];
					nd = src[ i + 8 ];

					THREE.Loader.prototype.f4n( scope, data.normals, a, b, c, d, m, na, nb, nc, nd );

				}

				function add_uv3( src, i ) {

					var uva, uvb, uvc, u1, u2, u3, v1, v2, v3;

					uva = src[ i ];
					uvb = src[ i + 1 ];
					uvc = src[ i + 2 ];

					u1 = data.uvs[ uva * 2 ];
					v1 = data.uvs[ uva * 2 + 1 ];

					u2 = data.uvs[ uvb * 2 ];
					v2 = data.uvs[ uvb * 2 + 1 ];

					u3 = data.uvs[ uvc * 2 ];
					v3 = data.uvs[ uvc * 2 + 1 ];

					THREE.Loader.prototype.uv3( scope, u1, v1, u2, v2, u3, v3 );

				}

				function add_uv4( src, i ) {

					var uva, uvb, uvc, uvd, u1, u2, u3, u4, v1, v2, v3, v4;

					uva = src[ i ];
					uvb = src[ i + 1 ];
					uvc = src[ i + 2 ];
					uvd = src[ i + 3 ];

					u1 = data.uvs[ uva * 2 ];
					v1 = data.uvs[ uva * 2 + 1 ];

					u2 = data.uvs[ uvb * 2 ];
					v2 = data.uvs[ uvb * 2 + 1 ];

					u3 = data.uvs[ uvc * 2 ];
					v3 = data.uvs[ uvc * 2 + 1 ];

					u4 = data.uvs[ uvd * 2 ];
					v4 = data.uvs[ uvd * 2 + 1 ];

					THREE.Loader.prototype.uv4( scope, u1, v1, u2, v2, u3, v3, u4, v4 );

				}

				var i, l;

				for ( i = 0, l = data.triangles.length; i < l; i += 4 ) {

					add_tri( data.triangles, i );

				}

				for ( i = 0, l = data.triangles_uv.length; i < l; i+= 7 ) {

					add_tri( data.triangles_uv, i );
					add_uv3( data.triangles_uv, i + 4 );

				}

				for ( i = 0, l = data.triangles_n.length; i < l; i += 7 ) {

					add_tri_n( data.triangles_n, i );

				}

				for ( i = 0, l = data.triangles_n_uv.length; i < l; i += 10 ) {

					add_tri_n( data.triangles_n_uv, i );
					add_uv3( data.triangles_n_uv, i + 7 );

				}


				for ( i = 0, l = data.quads.length; i < l; i += 5 ) {

					add_quad( data.quads, i );

				}

				for ( i = 0, l = data.quads_uv.length; i < l; i += 9 ) {

					add_quad( data.quads_uv, i );
					add_uv4( data.quads_uv, i + 5 );

				}

				for ( i = 0, l = data.quads_n.length; i < l; i += 9 ) {

					add_quad_n( data.quads_n, i );

				}

				for ( i = 0, l = data.quads_n_uv.length; i < l; i += 13 ) {

					add_quad_n( data.quads_n_uv, i );
					add_uv4( data.quads_n_uv, i + 9 );

				}

			}

		}

		Model.prototype = new THREE.Geometry();
		Model.prototype.constructor = Model;

		callback( new Model( urlbase ) );

	},

	v: function( scope, x, y, z ) {

		scope.vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );

	},

	f3: function( scope, a, b, c, mi ) {

		var material = scope.materials[ mi ];
		scope.faces.push( new THREE.Face3( a, b, c, null, material ) );

	},

	f4: function( scope, a, b, c, d, mi ) {

		var material = scope.materials[ mi ];
		scope.faces.push( new THREE.Face4( a, b, c, d, null, material ) );

	},

	f3n: function( scope, normals, a, b, c, mi, na, nb, nc ) {

		var material = scope.materials[ mi ],
			nax = normals[ na*3     ],
			nay = normals[ na*3 + 1 ],
			naz = normals[ na*3 + 2 ],

			nbx = normals[ nb*3     ],
			nby = normals[ nb*3 + 1 ],
			nbz = normals[ nb*3 + 2 ],

			ncx = normals[ nc*3     ],
			ncy = normals[ nc*3 + 1 ],
			ncz = normals[ nc*3 + 2 ];

		scope.faces.push( new THREE.Face3( a, b, c, 
						  [new THREE.Vector3( nax, nay, naz ), 
						   new THREE.Vector3( nbx, nby, nbz ), 
						   new THREE.Vector3( ncx, ncy, ncz )], 
						  material ) );

	},

	f4n: function( scope, normals, a, b, c, d, mi, na, nb, nc, nd ) {

		var material = scope.materials[ mi ],
			nax = normals[ na*3     ],
			nay = normals[ na*3 + 1 ],
			naz = normals[ na*3 + 2 ],

			nbx = normals[ nb*3     ],
			nby = normals[ nb*3 + 1 ],
			nbz = normals[ nb*3 + 2 ],

			ncx = normals[ nc*3     ],
			ncy = normals[ nc*3 + 1 ],
			ncz = normals[ nc*3 + 2 ],

			ndx = normals[ nd*3     ],
			ndy = normals[ nd*3 + 1 ],
			ndz = normals[ nd*3 + 2 ];

		scope.faces.push( new THREE.Face4( a, b, c, d,
						  [new THREE.Vector3( nax, nay, naz ), 
						   new THREE.Vector3( nbx, nby, nbz ), 
						   new THREE.Vector3( ncx, ncy, ncz ), 
						   new THREE.Vector3( ndx, ndy, ndz )], 
						  material ) );

	},

	uv3: function( scope, u1, v1, u2, v2, u3, v3 ) {

		var uv = [];
		uv.push( new THREE.UV( u1, v1 ) );
		uv.push( new THREE.UV( u2, v2 ) );
		uv.push( new THREE.UV( u3, v3 ) );
		scope.uvs.push( uv );

	},

	uv4: function( scope, u1, v1, u2, v2, u3, v3, u4, v4 ) {

		var uv = [];
		uv.push( new THREE.UV( u1, v1 ) );
		uv.push( new THREE.UV( u2, v2 ) );
		uv.push( new THREE.UV( u3, v3 ) );
		uv.push( new THREE.UV( u4, v4 ) );
		scope.uvs.push( uv );

	},

	init_materials: function( scope, materials, urlbase ) {

		scope.materials = [];

		for ( var i = 0; i < materials.length; ++i ) {

			scope.materials[i] = [ THREE.Loader.prototype.createMaterial( materials[i], urlbase ) ];

		}

	},

	createMaterial: function ( m, urlbase ) {

		function is_pow2( n ) {

			var l = Math.log(n) / Math.LN2;
			return Math.floor(l) == l;

		}

		function nearest_pow2( n ) {

			var l = Math.log(n) / Math.LN2;
			return Math.pow( 2, Math.round(l) );

		}

		var material, texture, image, color;

		if ( m.map_diffuse && urlbase ) {

			texture = document.createElement( 'canvas' );
			material = new THREE.MeshLambertMaterial( { map: new THREE.Texture( texture ) } );

			image = new Image();
			image.onload = function () {

				if ( !is_pow2( this.width ) || !is_pow2( this.height ) ) {

					var w = nearest_pow2( this.width ),
						h = nearest_pow2( this.height );

					material.map.image.width = w;
					material.map.image.height = h;
					material.map.image.getContext("2d").drawImage( this, 0, 0, w, h );

				} else {

					material.map.image = this;

				}

				material.map.image.loaded = 1;

			};

			image.src = urlbase + "/" + m.map_diffuse;

		} else if ( m.col_diffuse ) {

			color = (m.col_diffuse[0]*255 << 16) + (m.col_diffuse[1]*255 << 8) + m.col_diffuse[2]*255;
			material = new THREE.MeshLambertMaterial( { color: color, opacity: m.transparency } );

		} else if ( m.a_dbg_color ) {

			material = new THREE.MeshLambertMaterial( { color: m.a_dbg_color } );

		} else {

			material = new THREE.MeshLambertMaterial( { color: 0xeeeeee } );

		}

		return material;

	}

};
