import { InterleavedBuffer } from './InterleavedBuffer';

/**
 * @author benaadams / https://twitter.com/ben_a_adams
 */

function InstancedInterleavedBuffer( array, stride, meshPerAttribute ) {
	this.isInstancedInterleavedBuffer = this.isInterleavedBuffer = true;

	InterleavedBuffer.call( this, array, stride );

	this.meshPerAttribute = meshPerAttribute || 1;

};

InstancedInterleavedBuffer.prototype = Object.create( InterleavedBuffer.prototype );
InstancedInterleavedBuffer.prototype.constructor = InstancedInterleavedBuffer;

InstancedInterleavedBuffer.prototype.copy = function ( source ) {

	InterleavedBuffer.prototype.copy.call( this, source );

	this.meshPerAttribute = source.meshPerAttribute;

	return this;

};


export { InstancedInterleavedBuffer };