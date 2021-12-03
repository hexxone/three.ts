import { BufferGeometry } from './BufferGeometry';


class InstancedBufferGeometry extends BufferGeometry {
	instanceCount = Infinity;

	constructor() {
		super();
		this.type = 'InstancedBufferGeometry';
	}

	copy( source ) {
		super.copy( source );

		this.instanceCount = source.instanceCount;

		return this;
	}

	clone() {
		return new InstancedBufferGeometry().copy( this );
	}

	toJSON() {
		const data = super.toJSON() as any;

		data.instanceCount = this.instanceCount;

		data.isInstancedBufferGeometry = true;

		return data;
	}
}

export { InstancedBufferGeometry };
