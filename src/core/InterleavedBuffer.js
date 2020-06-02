import { MathUtils } from '../math/MathUtils.js';
import { StaticDrawUsage } from '../constants.js';

/**
 * @author benaadams / https://twitter.com/ben_a_adams
 */

function InterleavedBuffer( array, stride ) {

	this.array = array;
	this.stride = stride;
	this.count = array !== undefined ? array.length / stride : 0;

	this.usage = StaticDrawUsage;
	this.updateRange = { offset: 0, count: - 1 };

	this.version = 0;

	this.uuid = MathUtils.generateUUID();

}

Object.defineProperty( InterleavedBuffer.prototype, 'needsUpdate', {

	set: function ( value ) {

		if ( value === true ) this.version ++;

	}

} );

Object.assign( InterleavedBuffer.prototype, {

	isInterleavedBuffer: true,

	onUploadCallback: function () {},

	setUsage: function ( value ) {

		this.usage = value;

		return this;

	},

	copy: function ( source ) {

		this.array = new source.array.constructor( source.array );
		this.count = source.count;
		this.stride = source.stride;
		this.usage = source.usage;

		return this;

	},

	copyAt: function ( index1, attribute, index2 ) {

		index1 *= this.stride;
		index2 *= attribute.stride;

		for ( let i = 0, l = this.stride; i < l; i ++ ) {

			this.array[ index1 + i ] = attribute.array[ index2 + i ];

		}

		return this;

	},

	set: function ( value, offset ) {

		if ( offset === undefined ) offset = 0;

		this.array.set( value, offset );

		return this;

	},

	clone: function () {

		return new this.constructor().copy( this );

	},

	onUpload: function ( callback ) {

		this.onUploadCallback = callback;

		return this;

	},

	toJSON: function ( data ) {

		if ( data.arrayBuffers === undefined ) {

			data.arrayBuffers = {};

		}

		// generate UUID for array buffer if necessary

		if ( this.array.buffer._uuid === undefined ) {

			this.array.buffer._uuid = MathUtils.generateUUID();

		}

		if ( data.arrayBuffers[ this.array.buffer._uuid ] === undefined ) {

			data.arrayBuffers[ this.array.buffer._uuid ] = arrayBufferToBase64( this.array.buffer );

		}

		//

		return {
			uuid: this.uuid,
			buffer: this.array.buffer._uuid,
			type: this.array.constructor.name,
			stride: this.stride
		};

	}

} );

function arrayBufferToBase64( buffer ) {

	let binary = '';
	const bytes = new Uint8Array( buffer );

	for ( let i = 0, l = bytes.byteLength; i < l; i ++ ) {

		binary += String.fromCharCode( bytes[ i ] );

	}

	return window.btoa( binary );

}


export { InterleavedBuffer };
