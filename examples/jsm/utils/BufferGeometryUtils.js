import {
	BufferAttribute,
	BufferGeometry,
	InterleavedBuffer,
	InterleavedBufferAttribute,
	TriangleFanDrawMode,
	TriangleStripDrawMode,
	TrianglesDrawMode,
	Vector2,
	Vector3
} from '../../../build/three.module.js';

var BufferGeometryUtils = {

	computeTangents: function ( geometry ) {

		var index = geometry.index;
		var attributes = geometry.attributes;

		// based on http://www.terathon.com/code/tangent.html
		// (per vertex tangents)

		if ( index === null ||
			 attributes.position === undefined ||
			 attributes.normal === undefined ||
			 attributes.uv === undefined ) {

			console.error( 'THREE.BufferGeometryUtils: .computeTangents() failed. Missing required attributes (index, position, normal or uv)' );
			return;

		}

		var indices = index.array;
		var positions = attributes.position.array;
		var normals = attributes.normal.array;
		var uvs = attributes.uv.array;

		var nVertices = positions.length / 3;

		if ( attributes.tangent === undefined ) {

			geometry.setAttribute( 'tangent', new BufferAttribute( new Float32Array( 4 * nVertices ), 4 ) );

		}

		var tangents = attributes.tangent.array;

		var tan1 = [], tan2 = [];

		for ( var i = 0; i < nVertices; i ++ ) {

			tan1[ i ] = new Vector3();
			tan2[ i ] = new Vector3();

		}

		var vA = new Vector3(),
			vB = new Vector3(),
			vC = new Vector3(),

			uvA = new Vector2(),
			uvB = new Vector2(),
			uvC = new Vector2(),

			sdir = new Vector3(),
			tdir = new Vector3();

		function handleTriangle( a, b, c ) {

			vA.fromArray( positions, a * 3 );
			vB.fromArray( positions, b * 3 );
			vC.fromArray( positions, c * 3 );

			uvA.fromArray( uvs, a * 2 );
			uvB.fromArray( uvs, b * 2 );
			uvC.fromArray( uvs, c * 2 );

			vB.sub( vA );
			vC.sub( vA );

			uvB.sub( uvA );
			uvC.sub( uvA );

			var r = 1.0 / ( uvB.x * uvC.y - uvC.x * uvB.y );

			// silently ignore degenerate uv triangles having coincident or colinear vertices

			if ( ! isFinite( r ) ) return;

			sdir.copy( vB ).multiplyScalar( uvC.y ).addScaledVector( vC, - uvB.y ).multiplyScalar( r );
			tdir.copy( vC ).multiplyScalar( uvB.x ).addScaledVector( vB, - uvC.x ).multiplyScalar( r );

			tan1[ a ].add( sdir );
			tan1[ b ].add( sdir );
			tan1[ c ].add( sdir );

			tan2[ a ].add( tdir );
			tan2[ b ].add( tdir );
			tan2[ c ].add( tdir );

		}

		var groups = geometry.groups;

		if ( groups.length === 0 ) {

			groups = [ {
				start: 0,
				count: indices.length
			} ];

		}

		for ( var i = 0, il = groups.length; i < il; ++ i ) {

			var group = groups[ i ];

			var start = group.start;
			var count = group.count;

			for ( var j = start, jl = start + count; j < jl; j += 3 ) {

				handleTriangle(
					indices[ j + 0 ],
					indices[ j + 1 ],
					indices[ j + 2 ]
				);

			}

		}

		var tmp = new Vector3(), tmp2 = new Vector3();
		var n = new Vector3(), n2 = new Vector3();
		var w, t, test;

		function handleVertex( v ) {

			n.fromArray( normals, v * 3 );
			n2.copy( n );

			t = tan1[ v ];

			// Gram-Schmidt orthogonalize

			tmp.copy( t );
			tmp.sub( n.multiplyScalar( n.dot( t ) ) ).normalize();

			// Calculate handedness

			tmp2.crossVectors( n2, t );
			test = tmp2.dot( tan2[ v ] );
			w = ( test < 0.0 ) ? - 1.0 : 1.0;

			tangents[ v * 4 ] = tmp.x;
			tangents[ v * 4 + 1 ] = tmp.y;
			tangents[ v * 4 + 2 ] = tmp.z;
			tangents[ v * 4 + 3 ] = w;

		}

		for ( var i = 0, il = groups.length; i < il; ++ i ) {

			var group = groups[ i ];

			var start = group.start;
			var count = group.count;

			for ( var j = start, jl = start + count; j < jl; j += 3 ) {

				handleVertex( indices[ j + 0 ] );
				handleVertex( indices[ j + 1 ] );
				handleVertex( indices[ j + 2 ] );

			}

		}

	},

	/**
	 * @param  {Array<BufferGeometry>} geometries
	 * @param  {Boolean} useGroups
	 * @return {BufferGeometry}
	 */
	mergeBufferGeometries: function ( geometries, useGroups ) {

		var isIndexed = geometries[ 0 ].index !== null;

		var attributesUsed = new Set( Object.keys( geometries[ 0 ].attributes ) );
		var morphAttributesUsed = new Set( Object.keys( geometries[ 0 ].morphAttributes ) );

		var attributes = {};
		var morphAttributes = {};

		var morphTargetsRelative = geometries[ 0 ].morphTargetsRelative;

		var mergedGeometry = new BufferGeometry();

		var offset = 0;

		for ( var i = 0; i < geometries.length; ++ i ) {

			var geometry = geometries[ i ];
			var attributesCount = 0;

			// ensure that all geometries are indexed, or none

			if ( isIndexed !== ( geometry.index !== null ) ) {

				console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.' );
				return null;

			}

			// gather attributes, exit early if they're different

			for ( var name in geometry.attributes ) {

				if ( ! attributesUsed.has( name ) ) {

					console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '. All geometries must have compatible attributes; make sure "' + name + '" attribute exists among all geometries, or in none of them.' );
					return null;

				}

				if ( attributes[ name ] === undefined ) attributes[ name ] = [];

				attributes[ name ].push( geometry.attributes[ name ] );

				attributesCount ++;

			}

			// ensure geometries have the same number of attributes

			if ( attributesCount !== attributesUsed.size ) {

				console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '. Make sure all geometries have the same number of attributes.' );
				return null;

			}

			// gather morph attributes, exit early if they're different

			if ( morphTargetsRelative !== geometry.morphTargetsRelative ) {

				console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '. .morphTargetsRelative must be consistent throughout all geometries.' );
				return null;

			}

			for ( var name in geometry.morphAttributes ) {

				if ( ! morphAttributesUsed.has( name ) ) {

					console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '.  .morphAttributes must be consistent throughout all geometries.' );
					return null;

				}

				if ( morphAttributes[ name ] === undefined ) morphAttributes[ name ] = [];

				morphAttributes[ name ].push( geometry.morphAttributes[ name ] );

			}

			// gather .userData

			mergedGeometry.userData.mergedUserData = mergedGeometry.userData.mergedUserData || [];
			mergedGeometry.userData.mergedUserData.push( geometry.userData );

			if ( useGroups ) {

				var count;

				if ( isIndexed ) {

					count = geometry.index.count;

				} else if ( geometry.attributes.position !== undefined ) {

					count = geometry.attributes.position.count;

				} else {

					console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed with geometry at index ' + i + '. The geometry must have either an index or a position attribute' );
					return null;

				}

				mergedGeometry.addGroup( offset, count, i );

				offset += count;

			}

		}

		// merge indices

		if ( isIndexed ) {

			var indexOffset = 0;
			var mergedIndex = [];

			for ( var i = 0; i < geometries.length; ++ i ) {

				var index = geometries[ i ].index;

				for ( var j = 0; j < index.count; ++ j ) {

					mergedIndex.push( index.getX( j ) + indexOffset );

				}

				indexOffset += geometries[ i ].attributes.position.count;

			}

			mergedGeometry.setIndex( mergedIndex );

		}

		// merge attributes

		for ( var name in attributes ) {

			var mergedAttribute = this.mergeBufferAttributes( attributes[ name ] );

			if ( ! mergedAttribute ) {

				console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed while trying to merge the ' + name + ' attribute.' );
				return null;

			}

			mergedGeometry.setAttribute( name, mergedAttribute );

		}

		// merge morph attributes

		for ( var name in morphAttributes ) {

			var numMorphTargets = morphAttributes[ name ][ 0 ].length;

			if ( numMorphTargets === 0 ) break;

			mergedGeometry.morphAttributes = mergedGeometry.morphAttributes || {};
			mergedGeometry.morphAttributes[ name ] = [];

			for ( var i = 0; i < numMorphTargets; ++ i ) {

				var morphAttributesToMerge = [];

				for ( var j = 0; j < morphAttributes[ name ].length; ++ j ) {

					morphAttributesToMerge.push( morphAttributes[ name ][ j ][ i ] );

				}

				var mergedMorphAttribute = this.mergeBufferAttributes( morphAttributesToMerge );

				if ( ! mergedMorphAttribute ) {

					console.error( 'THREE.BufferGeometryUtils: .mergeBufferGeometries() failed while trying to merge the ' + name + ' morphAttribute.' );
					return null;

				}

				mergedGeometry.morphAttributes[ name ].push( mergedMorphAttribute );

			}

		}

		return mergedGeometry;

	},

	/**
	 * @param {Array<BufferAttribute>} attributes
	 * @return {BufferAttribute}
	 */
	mergeBufferAttributes: function ( attributes ) {

		var TypedArray;
		var itemSize;
		var normalized;
		var arrayLength = 0;

		for ( var i = 0; i < attributes.length; ++ i ) {

			var attribute = attributes[ i ];

			if ( attribute.isInterleavedBufferAttribute ) {

				console.error( 'THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. InterleavedBufferAttributes are not supported.' );
				return null;

			}

			if ( TypedArray === undefined ) TypedArray = attribute.array.constructor;
			if ( TypedArray !== attribute.array.constructor ) {

				console.error( 'THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.' );
				return null;

			}

			if ( itemSize === undefined ) itemSize = attribute.itemSize;
			if ( itemSize !== attribute.itemSize ) {

				console.error( 'THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.' );
				return null;

			}

			if ( normalized === undefined ) normalized = attribute.normalized;
			if ( normalized !== attribute.normalized ) {

				console.error( 'THREE.BufferGeometryUtils: .mergeBufferAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.' );
				return null;

			}

			arrayLength += attribute.array.length;

		}

		var array = new TypedArray( arrayLength );
		var offset = 0;

		for ( var i = 0; i < attributes.length; ++ i ) {

			array.set( attributes[ i ].array, offset );

			offset += attributes[ i ].array.length;

		}

		return new BufferAttribute( array, itemSize, normalized );

	},

	/**
	 * @param {Array<BufferAttribute>} attributes
	 * @return {Array<InterleavedBufferAttribute>}
	 */
	interleaveAttributes: function ( attributes ) {

		// Interleaves the provided attributes into an InterleavedBuffer and returns
		// a set of InterleavedBufferAttributes for each attribute
		var TypedArray;
		var arrayLength = 0;
		var stride = 0;

		// calculate the the length and type of the interleavedBuffer
		for ( var i = 0, l = attributes.length; i < l; ++ i ) {

			var attribute = attributes[ i ];

			if ( TypedArray === undefined ) TypedArray = attribute.array.constructor;
			if ( TypedArray !== attribute.array.constructor ) {

				console.error( 'AttributeBuffers of different types cannot be interleaved' );
				return null;

			}

			arrayLength += attribute.array.length;
			stride += attribute.itemSize;

		}

		// Create the set of buffer attributes
		var interleavedBuffer = new InterleavedBuffer( new TypedArray( arrayLength ), stride );
		var offset = 0;
		var res = [];
		var getters = [ 'getX', 'getY', 'getZ', 'getW' ];
		var setters = [ 'setX', 'setY', 'setZ', 'setW' ];

		for ( var j = 0, l = attributes.length; j < l; j ++ ) {

			var attribute = attributes[ j ];
			var itemSize = attribute.itemSize;
			var count = attribute.count;
			var iba = new InterleavedBufferAttribute( interleavedBuffer, itemSize, offset, attribute.normalized );
			res.push( iba );

			offset += itemSize;

			// Move the data for each attribute into the new interleavedBuffer
			// at the appropriate offset
			for ( var c = 0; c < count; c ++ ) {

				for ( var k = 0; k < itemSize; k ++ ) {

					iba[ setters[ k ] ]( c, attribute[ getters[ k ] ]( c ) );

				}

			}

		}

		return res;

	},

	/**
	 * @param {Array<BufferGeometry>} geometry
	 * @return {number}
	 */
	estimateBytesUsed: function ( geometry ) {

		// Return the estimated memory used by this geometry in bytes
		// Calculate using itemSize, count, and BYTES_PER_ELEMENT to account
		// for InterleavedBufferAttributes.
		var mem = 0;
		for ( var name in geometry.attributes ) {

			var attr = geometry.getAttribute( name );
			mem += attr.count * attr.itemSize * attr.array.BYTES_PER_ELEMENT;

		}

		var indices = geometry.getIndex();
		mem += indices ? indices.count * indices.itemSize * indices.array.BYTES_PER_ELEMENT : 0;
		return mem;

	},

	/**
	 * @param {BufferGeometry} geometry
	 * @param {number} tolerance
	 * @return {BufferGeometry>}
	 */
	mergeVertices: function ( geometry, tolerance = 1e-4 ) {

		tolerance = Math.max( tolerance, Number.EPSILON );

		// Generate an index buffer if the geometry doesn't have one, or optimize it
		// if it's already available.
		var hashToIndex = {};
		var indices = geometry.getIndex();
		var positions = geometry.getAttribute( 'position' );
		var vertexCount = indices ? indices.count : positions.count;

		// next value for triangle indices
		var nextIndex = 0;

		// attributes and new attribute arrays
		var attributeNames = Object.keys( geometry.attributes );
		var attrArrays = {};
		var morphAttrsArrays = {};
		var newIndices = [];
		var getters = [ 'getX', 'getY', 'getZ', 'getW' ];

		// initialize the arrays
		for ( var i = 0, l = attributeNames.length; i < l; i ++ ) {

			var name = attributeNames[ i ];

			attrArrays[ name ] = [];

			var morphAttr = geometry.morphAttributes[ name ];
			if ( morphAttr ) {

				morphAttrsArrays[ name ] = new Array( morphAttr.length ).fill().map( () => [] );

			}

		}

		// convert the error tolerance to an amount of decimal places to truncate to
		var decimalShift = Math.log10( 1 / tolerance );
		var shiftMultiplier = Math.pow( 10, decimalShift );
		for ( var i = 0; i < vertexCount; i ++ ) {

			var index = indices ? indices.getX( i ) : i;

			// Generate a hash for the vertex attributes at the current index 'i'
			var hash = '';
			for ( var j = 0, l = attributeNames.length; j < l; j ++ ) {

				var name = attributeNames[ j ];
				var attribute = geometry.getAttribute( name );
				var itemSize = attribute.itemSize;

				for ( var k = 0; k < itemSize; k ++ ) {

					// double tilde truncates the decimal value
					hash += `${ ~ ~ ( attribute[ getters[ k ] ]( index ) * shiftMultiplier ) },`;

				}

			}

			// Add another reference to the vertex if it's already
			// used by another index
			if ( hash in hashToIndex ) {

				newIndices.push( hashToIndex[ hash ] );

			} else {

				// copy data to the new index in the attribute arrays
				for ( var j = 0, l = attributeNames.length; j < l; j ++ ) {

					var name = attributeNames[ j ];
					var attribute = geometry.getAttribute( name );
					var morphAttr = geometry.morphAttributes[ name ];
					var itemSize = attribute.itemSize;
					var newarray = attrArrays[ name ];
					var newMorphArrays = morphAttrsArrays[ name ];

					for ( var k = 0; k < itemSize; k ++ ) {

						var getterFunc = getters[ k ];
						newarray.push( attribute[ getterFunc ]( index ) );

						if ( morphAttr ) {

							for ( var m = 0, ml = morphAttr.length; m < ml; m ++ ) {

								newMorphArrays[ m ].push( morphAttr[ m ][ getterFunc ]( index ) );

							}

						}

					}

				}

				hashToIndex[ hash ] = nextIndex;
				newIndices.push( nextIndex );
				nextIndex ++;

			}

		}

		// Generate typed arrays from new attribute arrays and update
		// the attributeBuffers
		const result = geometry.clone();
		for ( var i = 0, l = attributeNames.length; i < l; i ++ ) {

			var name = attributeNames[ i ];
			var oldAttribute = geometry.getAttribute( name );

			var buffer = new oldAttribute.array.constructor( attrArrays[ name ] );
			var attribute = new BufferAttribute( buffer, oldAttribute.itemSize, oldAttribute.normalized );

			result.setAttribute( name, attribute );

			// Update the attribute arrays
			if ( name in morphAttrsArrays ) {

				for ( var j = 0; j < morphAttrsArrays[ name ].length; j ++ ) {

					var oldMorphAttribute = geometry.morphAttributes[ name ][ j ];

					var buffer = new oldMorphAttribute.array.constructor( morphAttrsArrays[ name ][ j ] );
					var morphAttribute = new BufferAttribute( buffer, oldMorphAttribute.itemSize, oldMorphAttribute.normalized );
					result.morphAttributes[ name ][ j ] = morphAttribute;

				}

			}

		}

		// indices

		result.setIndex( newIndices );

		return result;

	},

	/**
	 * @param {BufferGeometry} geometry
	 * @param {number} drawMode
	 * @return {BufferGeometry>}
	 */
	toTrianglesDrawMode: function ( geometry, drawMode ) {

		if ( drawMode === TrianglesDrawMode ) {

			console.warn( 'THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles.' );
			return geometry;

		}

		if ( drawMode === TriangleFanDrawMode || drawMode === TriangleStripDrawMode ) {

			var index = geometry.getIndex();

			// generate index if not present

			if ( index === null ) {

				var indices = [];

				var position = geometry.getAttribute( 'position' );

				if ( position !== undefined ) {

					for ( var i = 0; i < position.count; i ++ ) {

						indices.push( i );

					}

					geometry.setIndex( indices );
					index = geometry.getIndex();

				} else {

					console.error( 'THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible.' );
					return geometry;

				}

			}

			//

			var numberOfTriangles = index.count - 2;
			var newIndices = [];

			if ( drawMode === TriangleFanDrawMode ) {

				// gl.TRIANGLE_FAN

				for ( var i = 1; i <= numberOfTriangles; i ++ ) {

					newIndices.push( index.getX( 0 ) );
					newIndices.push( index.getX( i ) );
					newIndices.push( index.getX( i + 1 ) );

				}

			} else {

				// gl.TRIANGLE_STRIP

				for ( var i = 0; i < numberOfTriangles; i ++ ) {

					if ( i % 2 === 0 ) {

						newIndices.push( index.getX( i ) );
						newIndices.push( index.getX( i + 1 ) );
						newIndices.push( index.getX( i + 2 ) );

					} else {

						newIndices.push( index.getX( i + 2 ) );
						newIndices.push( index.getX( i + 1 ) );
						newIndices.push( index.getX( i ) );

					}

				}

			}

			if ( ( newIndices.length / 3 ) !== numberOfTriangles ) {

				console.error( 'THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.' );

			}

			// build final geometry

			var newGeometry = geometry.clone();
			newGeometry.setIndex( newIndices );
			newGeometry.clearGroups();

			return newGeometry;

		} else {

			console.error( 'THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:', drawMode );
			return geometry;

		}

	},

	/**
	 * Calculates the morphed attributes of a morphed/skinned BufferGeometry.
	 * Helpful for Raytracing or Decals.
	 * @param {Object3D} object
	 * @return {Object} An Object with original position/normal attributes and morphed ones.
	 */
	computeMorphedBufferGeometry: function ( object ) {

		if ( ! object ) {

			console.error( 'Please provide an object' );
			return null;

		}

		if ( ! object.geometry ) {

			console.error( 'Please provide an object with a geometry' );
			return null;

		}

		if ( ! object.geometry.isBufferGeometry ) {

			console.error( 'Geometry is not a BufferGeometry' );
			return null;

		}

		var _vA = new THREE.Vector3();
		var _vB = new THREE.Vector3();
		var _vC = new THREE.Vector3();

		var _tempA = new THREE.Vector3();
		var _tempB = new THREE.Vector3();
		var _tempC = new THREE.Vector3();

		var _morphA = new THREE.Vector3();
		var _morphB = new THREE.Vector3();
		var _morphC = new THREE.Vector3();

		function _calculateMorphedAttributeData(
			object,
			material,
			attribute,
			morphAttribute,
			morphTargetsRelative,
			a,
			b,
			c,
			modifiedAttributeArray
		) {

			_vA.fromBufferAttribute( attribute, a );
			_vB.fromBufferAttribute( attribute, b );
			_vC.fromBufferAttribute( attribute, c );

			var morphInfluences = object.morphTargetInfluences;

			if ( material.morphTargets && morphAttribute && morphInfluences ) {

				_morphA.set( 0, 0, 0 );
				_morphB.set( 0, 0, 0 );
				_morphC.set( 0, 0, 0 );

				for ( var i = 0, il = morphAttribute.length; i < il; i ++ ) {

					var influence = morphInfluences[ i ];
					var morphAttribute = morphAttribute[ i ];

					if ( influence === 0 ) continue;

					_tempA.fromBufferAttribute( morphAttribute, a );
					_tempB.fromBufferAttribute( morphAttribute, b );
					_tempC.fromBufferAttribute( morphAttribute, c );

					if ( morphTargetsRelative ) {

						_morphA.addScaledVector( _tempA, influence );
						_morphB.addScaledVector( _tempB, influence );
						_morphC.addScaledVector( _tempC, influence );

					} else {

						_morphA.addScaledVector( _tempA.sub( _vA ), influence );
						_morphB.addScaledVector( _tempB.sub( _vB ), influence );
						_morphC.addScaledVector( _tempC.sub( _vC ), influence );

					}

				}

				_vA.add( _morphA );
				_vB.add( _morphB );
				_vC.add( _morphC );

			}

			if ( object.isSkinnedMesh ) {

				object.boneTransform( a, _vA );
				object.boneTransform( b, _vB );
				object.boneTransform( c, _vC );

			}

			modifiedAttributeArray[ a * 3 + 0 ] = _vA.x;
			modifiedAttributeArray[ a * 3 + 1 ] = _vA.y;
			modifiedAttributeArray[ a * 3 + 2 ] = _vA.z;
			modifiedAttributeArray[ b * 3 + 0 ] = _vB.x;
			modifiedAttributeArray[ b * 3 + 1 ] = _vB.y;
			modifiedAttributeArray[ b * 3 + 2 ] = _vB.z;
			modifiedAttributeArray[ c * 3 + 0 ] = _vC.x;
			modifiedAttributeArray[ c * 3 + 1 ] = _vC.y;
			modifiedAttributeArray[ c * 3 + 2 ] = _vC.z;

		}

		var geometry = object.geometry;
		var material = object.material;

		var a, b, c;
		var index = geometry.index;
		var positionAttribute = geometry.attributes.position;
		var morphPosition = geometry.morphAttributes.position;
		var morphTargetsRelative = geometry.morphTargetsRelative;
		var normalAttribute = geometry.attributes.normal;
		var morphNormal = geometry.morphAttributes.position;

		var groups = geometry.groups;
		var drawRange = geometry.drawRange;
		var i, j, il, jl;
		var group, groupMaterial;
		var start, end;

		var modifiedPosition = new Float32Array( positionAttribute.count * positionAttribute.itemSize );
		var modifiedNormal = new Float32Array( normalAttribute.count * normalAttribute.itemSize );

		if ( index !== null ) {

			// indexed buffer geometry

			if ( Array.isArray( material ) ) {

				for ( i = 0, il = groups.length; i < il; i ++ ) {

					group = groups[ i ];
					groupMaterial = material[ group.materialIndex ];

					start = Math.max( group.start, drawRange.start );
					end = Math.min( ( group.start + group.count ), ( drawRange.start + drawRange.count ) );

					for ( j = start, jl = end; j < jl; j += 3 ) {

						a = index.getX( j );
						b = index.getX( j + 1 );
						c = index.getX( j + 2 );

						_calculateMorphedAttributeData(
							object,
							groupMaterial,
							positionAttribute,
							morphPosition,
							morphTargetsRelative,
							a, b, c,
							modifiedPosition
						);

						_calculateMorphedAttributeData(
							object,
							groupMaterial,
							normalAttribute,
							morphNormal,
							morphTargetsRelative,
							a, b, c,
							modifiedNormal
						);

					}

				}

			} else {

				start = Math.max( 0, drawRange.start );
				end = Math.min( index.count, ( drawRange.start + drawRange.count ) );

				for ( i = start, il = end; i < il; i += 3 ) {

					a = index.getX( i );
					b = index.getX( i + 1 );
					c = index.getX( i + 2 );

					_calculateMorphedAttributeData(
						object,
						material,
						positionAttribute,
						morphPosition,
						morphTargetsRelative,
						a, b, c,
						modifiedPosition
					);

					_calculateMorphedAttributeData(
						object,
						material,
						normalAttribute,
						morphNormal,
						morphTargetsRelative,
						a, b, c,
						modifiedNormal
					);

				}

			}

		} else if ( positionAttribute !== undefined ) {

			// non-indexed buffer geometry

			if ( Array.isArray( material ) ) {

				for ( i = 0, il = groups.length; i < il; i ++ ) {

					group = groups[ i ];
					groupMaterial = material[ group.materialIndex ];

					start = Math.max( group.start, drawRange.start );
					end = Math.min( ( group.start + group.count ), ( drawRange.start + drawRange.count ) );

					for ( j = start, jl = end; j < jl; j += 3 ) {

						a = j;
						b = j + 1;
						c = j + 2;

						_calculateMorphedAttributeData(
							object,
							groupMaterial,
							positionAttribute,
							morphPosition,
							morphTargetsRelative,
							a, b, c,
							modifiedPosition
						);

						_calculateMorphedAttributeData(
							object,
							groupMaterial,
							normalAttribute,
							morphNormal,
							morphTargetsRelative,
							a, b, c,
							modifiedNormal
						);

					}

				}

			} else {

				start = Math.max( 0, drawRange.start );
				end = Math.min( positionAttribute.count, ( drawRange.start + drawRange.count ) );

				for ( i = start, il = end; i < il; i += 3 ) {

					a = i;
					b = i + 1;
					c = i + 2;

					_calculateMorphedAttributeData(
						object,
						material,
						positionAttribute,
						morphPosition,
						morphTargetsRelative,
						a, b, c,
						modifiedPosition
					);

					_calculateMorphedAttributeData(
						object,
						material,
						normalAttribute,
						morphNormal,
						morphTargetsRelative,
						a, b, c,
						modifiedNormal
					);

				}

			}

		}

		var morphedPositionAttribute = new THREE.Float32BufferAttribute( modifiedPosition, 3 );
		var morphedNormalAttribute = new THREE.Float32BufferAttribute( modifiedNormal, 3 );

		return {

			positionAttribute: positionAttribute,
			normalAttribute: normalAttribute,
			morphedPositionAttribute: morphedPositionAttribute,
			morphedNormalAttribute: morphedNormalAttribute

		};

	}

};

export { BufferGeometryUtils };
