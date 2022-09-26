import { Vector3 } from "../math/Vector3";
import { getTypedArray } from "../utils";
import { BufferAttribute } from "./BufferAttribute";
import { InterleavedBuffer } from "./InterleavedBuffer";

const _vector = new Vector3();

class InterleavedBufferAttribute {
	name: string;
	data: InterleavedBuffer;
	itemSize: any;

	offset: any;
	normalized: boolean;

	count: number;
	interleavedBuffers: any;
	isInterleavedBufferAttribute = true;

	constructor(
		interleavedBuffer: InterleavedBuffer,
		itemSize,
		offset,
		normalized
	) {
		this.name = "";

		this.data = interleavedBuffer;
		this.itemSize = itemSize;
		this.offset = offset;

		this.normalized = normalized === true;
	}

	get gount() {
		return this.data.count;
	}

	get array() {
		return this.data.array;
	}

	set needsUpdate(value) {
		this.data.needsUpdate = value;
	}

	applyMatrix4(m) {
		for (let i = 0, l = this.data.count; i < l; i++) {
			_vector.x = Number(this.getX(i));
			_vector.y = Number(this.getY(i));
			_vector.z = Number(this.getZ(i));

			_vector.applyMatrix4(m);

			this.setXYZ(i, _vector.x, _vector.y, _vector.z);
		}

		return this;
	}

	setX(index, x) {
		this.data.array[index * this.data.stride + this.offset] = x;

		return this;
	}

	setY(index, y) {
		this.data.array[index * this.data.stride + this.offset + 1] = y;

		return this;
	}

	setZ(index, z) {
		this.data.array[index * this.data.stride + this.offset + 2] = z;

		return this;
	}

	setW(index, w) {
		this.data.array[index * this.data.stride + this.offset + 3] = w;

		return this;
	}

	getX(index) {
		return this.data.array[index * this.data.stride + this.offset];
	}

	getY(index) {
		return this.data.array[index * this.data.stride + this.offset + 1];
	}

	getZ(index) {
		return this.data.array[index * this.data.stride + this.offset + 2];
	}

	getW(index) {
		return this.data.array[index * this.data.stride + this.offset + 3];
	}

	setXY(index, x, y) {
		index = index * this.data.stride + this.offset;

		this.data.array[index + 0] = x;
		this.data.array[index + 1] = y;

		return this;
	}

	setXYZ(index, x, y, z) {
		index = index * this.data.stride + this.offset;

		this.data.array[index + 0] = x;
		this.data.array[index + 1] = y;
		this.data.array[index + 2] = z;

		return this;
	}

	setXYZW(index, x, y, z, w) {
		index = index * this.data.stride + this.offset;

		this.data.array[index + 0] = x;
		this.data.array[index + 1] = y;
		this.data.array[index + 2] = z;
		this.data.array[index + 3] = w;

		return this;
	}

	clone(data) {
		if (data === undefined) {
			console.log(
				"InterleavedBufferAttribute.clone(): Cloning an interlaved buffer attribute will deinterleave buffer data."
			);

			const array = [];

			for (let i = 0; i < this.count; i++) {
				const index = i * this.data.stride + this.offset;

				for (let j = 0; j < this.itemSize; j++) {
					array.push(this.data.array[index + j]);
				}
			}

			return new BufferAttribute(
				getTypedArray((this.array as any).constructor.name, array),
				this.itemSize,
				this.normalized
			);
		} else {
			if (data.interleavedBuffers === undefined) {
				data.interleavedBuffers = {};
			}

			if (data.interleavedBuffers[this.data.uuid] === undefined) {
				data.interleavedBuffers[this.data.uuid] = this.data.clone(data);
			}

			return new InterleavedBufferAttribute(
				data.interleavedBuffers[this.data.uuid],
				this.itemSize,
				this.offset,
				this.normalized
			);
		}
	}
}

export { InterleavedBufferAttribute };
