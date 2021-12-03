
import { Color, StaticDrawUsage, Vector2, Vector3, Vector4 } from '../';

const _vector = new Vector3();
const _vector2 = new Vector2();

class BufferAttribute {
	name: string;
	array: any;
	itemSize: any;
	count: number;
	normalized: boolean;
	usage: number;
	updateRange: { offset: number; count: number; };
	version: number;

	isBufferAttribute = true;
	isInstancedBufferAttribute: boolean;
	isInterleavedBufferAttribute: boolean;

	constructor( array, itemSize, normalized? ) {
		if ( Array.isArray( array ) ) {
			throw new TypeError( 'THREE.BufferAttribute: array should be a Typed Array.' );
		}

		this.name = '';

		this.array = array;
		this.itemSize = itemSize;
		this.count = array !== undefined ? array.length / itemSize : 0;
		this.normalized = normalized === true;

		this.usage = StaticDrawUsage;
		this.updateRange = { offset: 0, count: - 1 };

		this.version = 0;
	}


	set needsUpdate( value ) {
		if ( value === true ) this.version ++;
	}

	onUploadCallback() {

	}

	setUsage( value ) {
		this.usage = value;

		return this;
	}

	copy( source ) {
		this.name = source.name;
		this.array = new source.array.constructor( source.array );
		this.itemSize = source.itemSize;
		this.count = source.count;
		this.normalized = source.normalized;

		this.usage = source.usage;

		return this;
	}

	copyAt( index1, attribute, index2 ) {
		index1 *= this.itemSize;
		index2 *= attribute.itemSize;

		for ( let i = 0, l = this.itemSize; i < l; i ++ ) {
			this.array[ index1 + i ] = attribute.array[ index2 + i ];
		}

		return this;
	}

	copyArray( array ) {
		this.array.set( array );

		return this;
	}

	copyColorsArray( colors ) {
		const array = this.array;
		let offset = 0;

		for ( let i = 0, l = colors.length; i < l; i ++ ) {
			let color = colors[ i ];

			if ( color === undefined ) {
				console.warn( 'THREE.BufferAttribute.copyColorsArray(): color is undefined', i );
				color = new Color( 0, 0, 0 );
			}

			array[ offset ++ ] = color.r;
			array[ offset ++ ] = color.g;
			array[ offset ++ ] = color.b;
		}

		return this;
	}

	copyVector2sArray( vectors ) {
		const array = this.array;
		let offset = 0;

		for ( let i = 0, l = vectors.length; i < l; i ++ ) {
			let vector = vectors[ i ];

			if ( vector === undefined ) {
				console.warn( 'THREE.BufferAttribute.copyVector2sArray(): vector is undefined', i );
				vector = new Vector2();
			}

			array[ offset ++ ] = vector.x;
			array[ offset ++ ] = vector.y;
		}

		return this;
	}

	copyVector3sArray( vectors ) {
		const array = this.array;
		let offset = 0;

		for ( let i = 0, l = vectors.length; i < l; i ++ ) {
			let vector = vectors[ i ];

			if ( vector === undefined ) {
				console.warn( 'THREE.BufferAttribute.copyVector3sArray(): vector is undefined', i );
				vector = new Vector3();
			}

			array[ offset ++ ] = vector.x;
			array[ offset ++ ] = vector.y;
			array[ offset ++ ] = vector.z;
		}

		return this;
	}

	copyVector4sArray( vectors ) {
		const array = this.array;
		let offset = 0;

		for ( let i = 0, l = vectors.length; i < l; i ++ ) {
			let vector = vectors[ i ];

			if ( vector === undefined ) {
				console.warn( 'THREE.BufferAttribute.copyVector4sArray(): vector is undefined', i );
				vector = new Vector4();
			}

			array[ offset ++ ] = vector.x;
			array[ offset ++ ] = vector.y;
			array[ offset ++ ] = vector.z;
			array[ offset ++ ] = vector.w;
		}

		return this;
	}

	applyMatrix3( m ) {
		if ( this.itemSize === 2 ) {
			for ( let i = 0, l = this.count; i < l; i ++ ) {
				_vector2.fromBufferAttribute( this, i );
				_vector2.applyMatrix3( m );

				this.setXY( i, _vector2.x, _vector2.y );
			}
		} else if ( this.itemSize === 3 ) {
			for ( let i = 0, l = this.count; i < l; i ++ ) {
				_vector.fromBufferAttribute( this, i );
				_vector.applyMatrix3( m );

				this.setXYZ( i, _vector.x, _vector.y, _vector.z );
			}
		}

		return this;
	}

	applyMatrix4( m ) {
		for ( let i = 0, l = this.count; i < l; i ++ ) {
			_vector.x = this.getX( i );
			_vector.y = this.getY( i );
			_vector.z = this.getZ( i );

			_vector.applyMatrix4( m );

			this.setXYZ( i, _vector.x, _vector.y, _vector.z );
		}

		return this;
	}

	applyNormalMatrix( m ) {
		for ( let i = 0, l = this.count; i < l; i ++ ) {
			_vector.x = this.getX( i );
			_vector.y = this.getY( i );
			_vector.z = this.getZ( i );

			_vector.applyNormalMatrix( m );

			this.setXYZ( i, _vector.x, _vector.y, _vector.z );
		}

		return this;
	}

	transformDirection( m ) {
		for ( let i = 0, l = this.count; i < l; i ++ ) {
			_vector.x = this.getX( i );
			_vector.y = this.getY( i );
			_vector.z = this.getZ( i );

			_vector.transformDirection( m );

			this.setXYZ( i, _vector.x, _vector.y, _vector.z );
		}

		return this;
	}

	set( value, offset = 0 ) {
		this.array.set( value, offset );

		return this;
	}

	getX( index ) {
		return this.array[ index * this.itemSize ];
	}

	setX( index, x ) {
		this.array[ index * this.itemSize ] = x;

		return this;
	}

	getY( index ) {
		return this.array[ index * this.itemSize + 1 ];
	}

	setY( index, y ) {
		this.array[ index * this.itemSize + 1 ] = y;

		return this;
	}

	getZ( index ) {
		return this.array[ index * this.itemSize + 2 ];
	}

	setZ( index, z ) {
		this.array[ index * this.itemSize + 2 ] = z;

		return this;
	}

	getW( index ) {
		return this.array[ index * this.itemSize + 3 ];
	}

	setW( index, w ) {
		this.array[ index * this.itemSize + 3 ] = w;

		return this;
	}

	setXY( index, x, y ) {
		index *= this.itemSize;

		this.array[ index + 0 ] = x;
		this.array[ index + 1 ] = y;

		return this;
	}

	setXYZ( index, x, y, z ) {
		index *= this.itemSize;

		this.array[ index + 0 ] = x;
		this.array[ index + 1 ] = y;
		this.array[ index + 2 ] = z;

		return this;
	}

	setXYZW( index, x, y, z, w ) {
		index *= this.itemSize;

		this.array[ index + 0 ] = x;
		this.array[ index + 1 ] = y;
		this.array[ index + 2 ] = z;
		this.array[ index + 3 ] = w;

		return this;
	}

	onUpload( callback ) {
		this.onUploadCallback = callback;

		return this;
	}

	clone( ...args ) {
		return new BufferAttribute( this.array, this.itemSize ).copy( this );
	}

	toJSON() {
		return {
			itemSize: this.itemSize,
			type: this.array.constructor.name,
			array: Array.prototype.slice.call( this.array ),
			normalized: this.normalized,
		};
	}
}

//

class Int8BufferAttribute extends BufferAttribute {
	constructor( array, itemSize, normalized? ) {
		super( new Int8Array( array ), itemSize, normalized );
	}
}

class Uint8BufferAttribute extends BufferAttribute {
	constructor( array, itemSize, normalized? ) {
		super( new Uint8Array( array ), itemSize, normalized );
	}
}

class Uint8ClampedBufferAttribute extends BufferAttribute {
	constructor( array, itemSize, normalized? ) {
		super( new Uint8ClampedArray( array ), itemSize, normalized );
	}
}

//

class Int16BufferAttribute extends BufferAttribute {
	constructor( array, itemSize, normalized? ) {
		super( new Int16Array( array ), itemSize, normalized );
	}
}

class Uint16BufferAttribute extends BufferAttribute {
	constructor( array, itemSize, normalized? ) {
		super( new Uint16Array( array ), itemSize, normalized );
	}
}

//

class Int32BufferAttribute extends BufferAttribute {
	constructor( array, itemSize, normalized? ) {
		super( new Int32Array( array ), itemSize, normalized );
	}
}


class Uint32BufferAttribute extends BufferAttribute {
	constructor( array, itemSize, normalized? ) {
		super( new Uint32Array( array ), itemSize, normalized );
	}
}

//

class Float16BufferAttribute extends BufferAttribute {
	constructor( array, itemSize, normalized? ) {
		super( new Uint16Array( array ), itemSize, normalized );
	}
}

class Float32BufferAttribute extends BufferAttribute {
	constructor( array, itemSize, normalized? ) {
		super( new Float32Array( array ), itemSize, normalized );
	}
}

class Float64BufferAttribute extends BufferAttribute {
	constructor( array, itemSize, normalized? ) {
		super( new Float64Array( array ), itemSize, normalized );
	}
}
//

export {
	Float64BufferAttribute,
	Float32BufferAttribute,
	Float16BufferAttribute,
	Uint32BufferAttribute,
	Int32BufferAttribute,
	Uint16BufferAttribute,
	Int16BufferAttribute,
	Uint8ClampedBufferAttribute,
	Uint8BufferAttribute,
	Int8BufferAttribute,
	BufferAttribute,
};
