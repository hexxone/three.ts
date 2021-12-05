import { BufferGeometry } from "./BufferGeometry";

class InstancedBufferGeometry extends BufferGeometry {
	instanceCount = Infinity;

	constructor() {
		super();
		this.type = "InstancedBufferGeometry";
	}

	copy(source) {
		super.copy(source);

		this.instanceCount = source.instanceCount;

		return this;
	}

	clone() {
		return new InstancedBufferGeometry().copy(this);
	}
}

export { InstancedBufferGeometry };
