import { Vector4 } from '../math/Vector4';
import { Vector3 } from '../math/Vector3';
import { Vector2 } from '../math/Vector2';
import { Color } from '../math/Color';
import { StaticDrawUsage } from '../constants';

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


	isBufferAttribute: true

	onUploadCallback() { }

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

	clone() {
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

Object.defineProperty( BufferAttribute.prototype, 'needsUpdate', {
	set: function( value ) {
		if ( value === true ) this.version ++;
	},
} );

//

function Int8BufferAttribute( array, itemSize, normalized? ) {
	BufferAttribute.call( this, new Int8Array( array ), itemSize, normalized );
}

Int8BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
Int8BufferAttribute.prototype.constructor = Int8BufferAttribute;


function Uint8BufferAttribute( array, itemSize, normalized? ) {
	BufferAttribute.call( this, new Uint8Array( array ), itemSize, normalized );
}

Uint8BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
Uint8BufferAttribute.prototype.constructor = Uint8BufferAttribute;


function Uint8ClampedBufferAttribute( array, itemSize, normalized? ) {
	BufferAttribute.call( this, new Uint8ClampedArray( array ), itemSize, normalized );
}

Uint8ClampedBufferAttribute.prototype = Object.create( BufferAttribute.prototype );
Uint8ClampedBufferAttribute.prototype.constructor = Uint8ClampedBufferAttribute;


function Int16BufferAttribute( array, itemSize, normalized? ) {
	BufferAttribute.call( this, new Int16Array( array ), itemSize, normalized );
}

Int16BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
Int16BufferAttribute.prototype.constructor = Int16BufferAttribute;


function Uint16BufferAttribute( array, itemSize, normalized? ) {
	BufferAttribute.call( this, new Uint16Array( array ), itemSize, normalized );
}

Uint16BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
Uint16BufferAttribute.prototype.constructor = Uint16BufferAttribute;


function Int32BufferAttribute( array, itemSize, normalized? ) {
	BufferAttribute.call( this, new Int32Array( array ), itemSize, normalized );
}

Int32BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
Int32BufferAttribute.prototype.constructor = Int32BufferAttribute;


function Uint32BufferAttribute( array, itemSize, normalized? ) {
	BufferAttribute.call( this, new Uint32Array( array ), itemSize, normalized );
}

Uint32BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
Uint32BufferAttribute.prototype.constructor = Uint32BufferAttribute;

function Float16BufferAttribute( array, itemSize, normalized? ) {
	BufferAttribute.call( this, new Uint16Array( array ), itemSize, normalized );
}

Float16BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
Float16BufferAttribute.prototype.constructor = Float16BufferAttribute;
Float16BufferAttribute.prototype.isFloat16BufferAttribute = true;

function Float32BufferAttribute( array, itemSize, normalized? ) {
	BufferAttribute.call( this, new Float32Array( array ), itemSize, normalized );
}

Float32BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
Float32BufferAttribute.prototype.constructor = Float32BufferAttribute;


function Float64BufferAttribute( array, itemSize, normalized? ) {
	BufferAttribute.call( this, new Float64Array( array ), itemSize, normalized );
}

Float64BufferAttribute.prototype = Object.create( BufferAttribute.prototype );
Float64BufferAttribute.prototype.constructor = Float64BufferAttribute;

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
