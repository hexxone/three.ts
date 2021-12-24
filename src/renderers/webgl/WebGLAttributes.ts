class WebGLAttributes {
	_gl;
	_capabilities;

	isWebGL2: boolean;

	buffers = new WeakMap();

	constructor(gl, capabilities) {
		this._gl = gl;
		this._capabilities = capabilities;

		this.isWebGL2 = capabilities.isWebGL2;
	}

	createBuffer(attribute, bufferType) {
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
				"THREE.WebGLAttributes: Unsupported data buffer format: Float64Array."
			);
		} else if (array instanceof Uint16Array) {
			if (attribute.isFloat16BufferAttribute) {
				if (this.isWebGL2) {
					type = this._gl.HALF_FLOAT;
				} else {
					console.warn(
						"THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2."
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
			"buffer": buffer,
			"type": type,
			"bytesPerElement": array.BYTES_PER_ELEMENT,
			"version": attribute.version,
		};
	}

	updateBuffer(buffer, attribute, bufferType) {
		const array = attribute.array;
		const updateRange = attribute.updateRange;

		this._gl.bindBuffer(bufferType, buffer);

		if (updateRange.count === -1) {
			// Not using update ranges

			this._gl.bufferSubData(bufferType, 0, array);
		} else {
			if (this.isWebGL2) {
				this._gl.bufferSubData(
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

	update(attribute, bufferType) {
		if (attribute.isGLBufferAttribute) {
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

		if (attribute.isInterleavedBufferAttribute) attribute = attribute.data;

		const data = this.buffers.get(attribute);

		if (data === undefined) {
			this.buffers.set(attribute, this.createBuffer(attribute, bufferType));
		} else if (data.version < attribute.version) {
			this.updateBuffer(data.buffer, attribute, bufferType);

			data.version = attribute.version;
		}
	}
}

export { WebGLAttributes };
