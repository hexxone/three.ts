/**
 * Uniform Utilities
 */

import { Color, Material, Matrix3, Matrix4, Quaternion, Texture, Vector2, Vector3, Vector4 } from '../../';

export function cloneUniforms( src ) {
	const dst = {};

	for ( const u in src ) {
		dst[ u ] = {};

		for ( const p in src[ u ] ) {
			const property = src[ u ][ p ] as Material;

			if ( property && (
				property instanceof Color || property instanceof Matrix3 ||
				property instanceof Matrix4 || property instanceof Vector2 ||
				property instanceof Vector3 || property instanceof Vector4 ||
				property instanceof Texture || property instanceof Quaternion ) ) {
				dst[ u ][ p ] = property.clone();
			} else if ( Array.isArray( property ) ) {
				dst[ u ][ p ] = property.slice();
			} else {
				dst[ u ][ p ] = property;
			}
		}
	}

	return dst;
}

export function mergeUniforms( uniforms ) {
	const merged = {};

	for ( let u = 0; u < uniforms.length; u ++ ) {
		const tmp = cloneUniforms( uniforms[ u ] );

		for ( const p in tmp ) {
			merged[ p ] = tmp[ p ];
		}
	}

	return merged;
}

// Legacy

const UniformsUtils = { clone: cloneUniforms, merge: mergeUniforms };

export { UniformsUtils };
