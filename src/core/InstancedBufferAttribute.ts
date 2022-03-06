import { BufferAttribute } from "..";

class InstancedBufferAttribute extends BufferAttribute {
	meshPerAttribute: number;

	constructor(array, itemSize, normalized, meshPerAttribute = 1) {
		if (typeof normalized === "number") {
			meshPerAttribute = normalized;
			normalized = false;
			console.error(
				"InstancedBufferAttribute: The constructor now expects normalized as the third argument."
			);
		}

		super(array, itemSize, normalized);

		this.isInstancedBufferAttribute = true;

		this.meshPerAttribute = meshPerAttribute;
	}

	copy(source: InstancedBufferAttribute) {
		super.copy(source);

		this.meshPerAttribute = source.meshPerAttribute;

		return this;
	}
}

export { InstancedBufferAttribute };
