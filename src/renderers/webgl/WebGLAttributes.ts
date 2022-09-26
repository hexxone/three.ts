import { BufferAttribute } from "../../core/BufferAttribute";
import { GLBufferAttribute } from "../../core/GLBufferAttribute";
import { InterleavedBuffer } from "../../core/InterleavedBuffer";
import { InterleavedBufferAttribute } from "../../core/InterleavedBufferAttribute";
import { WebGLCapabilities } from "./WebGLCapabilities";

export type IBuffered = {
	buffer: GLESBuffer;
	type: number;
	bytesPerElement: number;
	version: number;
};

export class WebGLAttributes {
	_gl: GLESRenderingContext;
	_capabilities: WebGLCapabilities;

	isWebGL2: boolean;

	buffers = new WeakMap<
		GLBufferAttribute | BufferAttribute | InterleavedBuffer,
		IBuffered
	>();

	constructor(gl: GLESRenderingContext, capabilities: WebGLCapabilities) {
		this._gl = gl;
		this._capabilities = capabilities;

		this.isWebGL2 = capabilities.isWebGL2;
	}

	createBuffer(
		attribute: BufferAttribute | InterleavedBuffer,
		bufferType: number
	): IBuffered {
		const array = attribute.array;
		const usage = attribute.usage;

		const buffer = this._gl.createBuffer();

		this._gl.bindBuffer(bufferType, buffer);
		this._gl.bufferData(bufferType, array, usage);

		attribute.onUploadCallback();

		let type = this._gl.FLOAT;

		if (array instanceof Float32Array) {
			type = this._gl.FLOAT;
		} else if (array instanceof Float64Array) {
			console.warn(
				"WebGLAttributes: Unsupported data buffer format: Float64Array."
			);
		} else if (array instanceof Uint16Array) {
			if ((attribute as BufferAttribute).isFloat16BufferAttribute) {
				if (this.isWebGL2) {
					type = this._gl.HALF_FLOAT;
				} else {
					console.warn(
						"WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2."
					);
				}
			} else {
				type = this._gl.UNSIGNED_SHORT;
			}
		} else if (array instanceof Int16Array) {
			type = this._gl.SHORT;
		} else if (array instanceof Uint32Array) {
			type = this._gl.UNSIGNED_INT;
		} else if (array instanceof Int32Array) {
			type = this._gl.INT;
		} else if (array instanceof Int8Array) {
			type = this._gl.BYTE;
		} else if (array instanceof Uint8Array) {
			type = this._gl.UNSIGNED_BYTE;
		}

		return {
			buffer: buffer,
			type: type,
			bytesPerElement: array.BYTES_PER_ELEMENT,
			version: attribute.version,
		};
	}

	updateBuffer(
		buffer: GLESBuffer,
		attribute: BufferAttribute | InterleavedBuffer,
		bufferType: number
	) {
		const array = attribute.array;
		const updateRange = attribute.updateRange;

		this._gl.bindBuffer(bufferType, buffer);

		if (updateRange.count === -1) {
			// Not using update ranges

			this._gl.bufferSubData(bufferType, 0, array);
		} else {
			if (this.isWebGL2) {
				// TODO dont use as any but rather the correct webgl-spec
				(this._gl.bufferSubData as any)(
					bufferType,
					updateRange.offset * array.BYTES_PER_ELEMENT,
					array,
					updateRange.offset,
					updateRange.count
				);
			} else {
				this._gl.bufferSubData(
					bufferType,
					updateRange.offset * array.BYTES_PER_ELEMENT,
					array.subarray(
						updateRange.offset,
						updateRange.offset + updateRange.count
					)
				);
			}

			updateRange.count = -1; // reset range
		}
	}

	//

	get(attribute) {
		if (attribute.isInterleavedBufferAttribute) attribute = attribute.data;

		return this.buffers.get(attribute);
	}

	remove(attribute) {
		if (attribute.isInterleavedBufferAttribute) attribute = attribute.data;

		const data = this.buffers.get(attribute);

		if (data) {
			this._gl.deleteBuffer(data.buffer);

			this.buffers.delete(attribute);
		}
	}

	update(
		attribute: BufferAttribute | InterleavedBufferAttribute | GLBufferAttribute,
		bufferType
	) {
		if (attribute instanceof GLBufferAttribute) {
			const cached = this.buffers.get(attribute);

			if (!cached || cached.version < attribute.version) {
				this.buffers.set(attribute, {
					buffer: attribute.buffer,
					type: attribute.type,
					bytesPerElement: attribute.elementSize,
					version: attribute.version,
				});
			}

			return;
		}

		let attr =
			attribute instanceof InterleavedBufferAttribute
				? attribute.data
				: attribute;

		const data = this.buffers.get(attr);

		if (data === undefined) {
			this.buffers.set(attr, this.createBuffer(attr, bufferType));
		} else if (data.version < attr.version) {
			this.updateBuffer(data.buffer, attr, bufferType);

			data.version = attr.version;
		}
	}
}
