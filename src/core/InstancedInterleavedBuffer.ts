import { InterleavedBuffer } from "./InterleavedBuffer";

class InstancedInterleavedBuffer extends InterleavedBuffer {
	meshPerAttribute: number;

	isInstancedInterleavedBuffer = true;

	constructor(array, stride, meshPerAttribute) {
		super(array, stride);

		this.meshPerAttribute = meshPerAttribute || 1;
	}

	copy(source: InstancedInterleavedBuffer) {
		super.copy(source);

		this.meshPerAttribute = source.meshPerAttribute;

		return this;
	}

	clone(data) {
		const ib = super.clone(data) as any;

		ib.meshPerAttribute = this.meshPerAttribute;

		return ib;
	}

	toJSON(data) {
		const json = InterleavedBuffer.prototype.toJSON.call(this, data);

		json.isInstancedInterleavedBuffer = true;
		json.meshPerAttribute = this.meshPerAttribute;

		return json;
	}
}

export { InstancedInterleavedBuffer };
