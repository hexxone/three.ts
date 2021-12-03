import { BufferAttribute } from './BufferAttribute';

class InstancedBufferAttribute extends BufferAttribute {
	meshPerAttribute: number;

	constructor( array, itemSize, normalized, meshPerAttribute = 1 ) {
		if ( typeof normalized === 'number' ) {
			meshPerAttribute = normalized;
			normalized = false;
			console.error( 'THREE.InstancedBufferAttribute: The constructor now expects normalized as the third argument.' );
		}

		super( array, itemSize, normalized );

		this.isInstancedBufferAttribute = true;

		this.meshPerAttribute = meshPerAttribute;
	}

	copy( source: InstancedBufferAttribute ) {
		super.copy( source );

		this.meshPerAttribute = source.meshPerAttribute;

		return this;
	}

	toJSON() {
		const data = super.toJSON() as any;
		data.meshPerAttribute = this.meshPerAttribute;
		data.isInstancedBufferAttribute = true;
		return data;
	}
}

export { InstancedBufferAttribute };
