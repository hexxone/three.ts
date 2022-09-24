import {
	BufferAttribute,
	BufferGeometry,
	InstancedBufferAttribute,
	InstancedInterleavedBuffer,
	InstancedMesh,
	InterleavedBuffer,
	InterleavedBufferAttribute,
	Material,
	Object3D,
	ShaderMaterial,
	WebGLAttributes,
	WebGLCapabilities,
	WebGLExtensions,
	WebGLProgram,
} from "../../";

/**
 * @public
 */
interface WebGLBindingState {
	// for backward compatibility on non-VAO support browser
	geometry: number;
	program: number;
	wireframe: boolean;

	newAttributes: number[];
	enabledAttributes: number[];
	attributeDivisors: number[];
	attributesNum: number;

	object: WebGLVertexArrayObject;
	attributes: {
		[name: string]: { attribute: BufferAttribute; data: InterleavedBuffer };
	};
	index: null;
}

class WebGLBindingStates {
	_gl: GLESRenderingContext;
	_extensions: WebGLExtensions;
	_attributes: WebGLAttributes;
	_capabilities: WebGLCapabilities;

	maxVertexAttributes: number;
	extension;
	vaoAvailable;

	bindingStates = {};

	defaultState: WebGLBindingState;
	currentState: WebGLBindingState;

	constructor(
		gl: GLESRenderingContext,
		extensions: WebGLExtensions,
		attributes: WebGLAttributes,
		capabilities: WebGLCapabilities
	) {
		this._gl = gl;
		this._extensions = extensions;
		this._attributes = attributes;
		this._capabilities = capabilities;

		this.maxVertexAttributes = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);

		this.extension = capabilities.isWebGL2
			? null
			: extensions.get("OES_vertex_array_object");
		this.vaoAvailable = capabilities.isWebGL2 || this.extension !== null;

		this.defaultState = this.createBindingState(null);
		this.currentState = this.defaultState;
	}

	setup(
		object: Object3D,
		material: Material,
		program: WebGLProgram,
		geometry: BufferGeometry,
		index
	) {
		let updateBuffers = false;

		if (this.vaoAvailable) {
			const state = this.getBindingState(geometry, program, material);

			if (this.currentState !== state) {
				this.currentState = state;
				this.bindVertexArrayObject(this.currentState.object);
			}

			updateBuffers = this.needsUpdate(geometry, index);

			if (updateBuffers) this.saveCache(geometry, index);
		} else {
			const wireframe = material.wireframe === true;

			if (
				this.currentState.geometry !== geometry.id ||
				this.currentState.program !== program.id ||
				this.currentState.wireframe !== wireframe
			) {
				this.currentState.geometry = geometry.id;
				this.currentState.program = program.id;
				this.currentState.wireframe = wireframe;

				updateBuffers = true;
			}
		}

		if (object.isInstancedMesh === true) {
			updateBuffers = true;
		}

		if (index !== null) {
			this._attributes.update(index, this._gl.ELEMENT_ARRAY_BUFFER);
		}

		if (updateBuffers) {
			this.setupVertexAttributes(object, material, program, geometry);

			if (index !== null) {
				this._gl.bindBuffer(
					this._gl.ELEMENT_ARRAY_BUFFER,
					this._attributes.get(index).buffer
				);
			}
		}
	}

	createVertexArrayObject() {
		if (this._capabilities.isWebGL2) return this._gl.createVertexArray();

		return this.extension.createVertexArrayOES();
	}

	bindVertexArrayObject(vao: WebGLVertexArrayObject) {
		if (this._capabilities.isWebGL2) return this._gl.bindVertexArray(vao);

		return this.extension.bindVertexArrayOES(vao);
	}

	deleteVertexArrayObject(vao: WebGLVertexArrayObject) {
		if (this._capabilities.isWebGL2) return this._gl.deleteVertexArray(vao);

		return this.extension.deleteVertexArrayOES(vao);
	}

	getBindingState(
		geometry: BufferGeometry,
		program: WebGLProgram,
		material: Material
	): WebGLBindingState {
		const wireframe = material.wireframe === true;

		let programMap = this.bindingStates[geometry.id];

		if (programMap === undefined) {
			programMap = {};
			this.bindingStates[geometry.id] = programMap;
		}

		let stateMap = programMap[program.id];

		if (stateMap === undefined) {
			stateMap = {};
			programMap[program.id] = stateMap;
		}

		let state = stateMap[wireframe];

		if (state === undefined) {
			state = this.createBindingState(this.createVertexArrayObject());
			stateMap[wireframe] = state;
		}

		return state;
	}

	createBindingState(vao: WebGLVertexArrayObject): WebGLBindingState {
		const newAttributes = [];
		const enabledAttributes = [];
		const attributeDivisors = [];

		for (let i = 0; i < this.maxVertexAttributes; i++) {
			newAttributes[i] = 0;
			enabledAttributes[i] = 0;
			attributeDivisors[i] = 0;
		}

		return {
			// for backward compatibility on non-VAO support browser
			geometry: null,
			program: null,
			wireframe: false,

			newAttributes: newAttributes,
			enabledAttributes: enabledAttributes,
			attributeDivisors: attributeDivisors,
			attributesNum: undefined,

			object: vao,
			attributes: {},
			index: null,
		};
	}

	needsUpdate(geometry: BufferGeometry, index) {
		const cachedAttributes = this.currentState.attributes;
		const geometryAttributes = geometry.attributes;

		let attributesNum = 0;

		for (const key in geometryAttributes) {
			const cachedAttribute = cachedAttributes[key];
			const geometryAttribute = geometryAttributes[key];

			if (cachedAttribute === undefined) return true;

			if (cachedAttribute instanceof InterleavedBufferAttribute) {
				if (cachedAttribute.attribute !== geometryAttribute) return true;
			}

			if (
				cachedAttribute instanceof InterleavedBufferAttribute &&
				geometryAttribute instanceof InterleavedBufferAttribute
			) {
				if (cachedAttribute.data !== geometryAttribute.data) return true;
			}
			attributesNum++;
		}

		if (this.currentState.attributesNum !== attributesNum) return true;

		if (this.currentState.index !== index) return true;

		return false;
	}

	saveCache(geometry: BufferGeometry, index) {
		const attributes = geometry.attributes;

		// TODO lets hope we dont get an error due to async? overwriting
		this.currentState.attributes = {};
		this.currentState.attributesNum = 0;
		for (const key in attributes) {
			const attribute = attributes[key];

			const data = {
				attribute,
				data: null,
			};

			if (attribute instanceof InterleavedBufferAttribute) {
				data.data = attribute.data;
			}

			this.currentState.attributes[key] = data;

			this.currentState.attributesNum++;
		}

		this.currentState.index = index;
	}

	initAttributes() {
		const newAttributes = this.currentState.newAttributes;

		for (let i = 0, il = newAttributes.length; i < il; i++) {
			newAttributes[i] = 0;
		}
	}

	enableAttribute(attribute) {
		this.enableAttributeAndDivisor(attribute, 0);
	}

	enableAttributeAndDivisor(attribute: number, meshPerAttribute) {
		const newAttributes = this.currentState.newAttributes;
		const enabledAttributes = this.currentState.enabledAttributes;
		const attributeDivisors = this.currentState.attributeDivisors;

		newAttributes[attribute] = 1;

		if (enabledAttributes[attribute] === 0) {
			this._gl.enableVertexAttribArray(attribute);
			enabledAttributes[attribute] = 1;
		}

		if (attributeDivisors[attribute] !== meshPerAttribute) {
			const extension = this._capabilities.isWebGL2
				? this._gl
				: this._extensions.get("ANGLE_instanced_arrays");

			extension[
				this._capabilities.isWebGL2
					? "vertexAttribDivisor"
					: "vertexAttribDivisorANGLE"
			](attribute, meshPerAttribute);
			attributeDivisors[attribute] = meshPerAttribute;
		}
	}

	disableUnusedAttributes() {
		const newAttributes = this.currentState.newAttributes;
		const enabledAttributes = this.currentState.enabledAttributes;

		for (let i = 0, il = enabledAttributes.length; i < il; i++) {
			if (enabledAttributes[i] !== newAttributes[i]) {
				this._gl.disableVertexAttribArray(i);
				enabledAttributes[i] = 0;
			}
		}
	}

	vertexAttribPointer(
		index: number,
		size: number,
		type: number,
		normalized: boolean,
		stride: number,
		offset: number
	) {
		if (
			this._capabilities.isWebGL2 === true &&
			(type === this._gl.INT || type === this._gl.UNSIGNED_INT)
		) {
			this._gl.vertexAttribIPointer(index, size, type, stride, offset);
		} else {
			this._gl.vertexAttribPointer(
				index,
				size,
				type,
				normalized,
				stride,
				offset
			);
		}
	}

	setupVertexAttributes(
		object: Object3D,
		material: Material,
		program: WebGLProgram,
		geometry: BufferGeometry
	) {
		if (
			this._capabilities.isWebGL2 === false &&
			(object.isInstancedMesh || geometry.isInstancedBufferGeometry)
		) {
			if (this._extensions.get("ANGLE_instanced_arrays") === null) return;
		}

		this.initAttributes();

		const geometryAttributes = geometry.attributes;

		const programAttributes = program.getAttributes();

		for (const name in programAttributes) {
			const programAttribute = programAttributes[name];

			if (programAttribute >= 0) {
				const geometryAttribute = geometryAttributes[name];

				if (geometryAttribute !== undefined) {
					const normalized = geometryAttribute.normalized;
					const size = geometryAttribute.itemSize;

					const attribute = this._attributes.get(geometryAttribute);

					// TODO Attribute may not be available on context restore

					if (attribute === undefined) continue;

					const buffer = attribute.buffer;
					const type = attribute.type;
					const bytesPerElement = attribute.bytesPerElement;

					if (geometryAttribute instanceof InterleavedBufferAttribute) {
						const data = geometryAttribute.data;
						const stride = data.stride;
						const offset = geometryAttribute.offset;

						if (data && data instanceof InstancedInterleavedBuffer) {
							this.enableAttributeAndDivisor(
								programAttribute,
								data.meshPerAttribute
							);

							if (geometry._maxInstanceCount === undefined) {
								geometry._maxInstanceCount = data.meshPerAttribute * data.count;
							}
						} else {
							this.enableAttribute(programAttribute);
						}

						this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer);
						this.vertexAttribPointer(
							programAttribute,
							size,
							type,
							normalized,
							stride * bytesPerElement,
							offset * bytesPerElement
						);
					} else {
						if (geometryAttribute instanceof InstancedBufferAttribute) {
							this.enableAttributeAndDivisor(
								programAttribute,
								geometryAttribute.meshPerAttribute
							);

							if (geometry._maxInstanceCount === undefined) {
								geometry._maxInstanceCount =
									geometryAttribute.meshPerAttribute * geometryAttribute.count;
							}
						} else {
							this.enableAttribute(programAttribute);
						}

						this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer);
						this.vertexAttribPointer(
							programAttribute,
							size,
							type,
							normalized,
							0,
							0
						);
					}
				} else if (name === "instanceMatrix") {
					const attribute = this._attributes.get(object.instanceMatrix);

					// TODO Attribute may not be available on context restore

					if (attribute === undefined) continue;

					const buffer = attribute.buffer;
					const type = attribute.type;

					this.enableAttributeAndDivisor(programAttribute + 0, 1);
					this.enableAttributeAndDivisor(programAttribute + 1, 1);
					this.enableAttributeAndDivisor(programAttribute + 2, 1);
					this.enableAttributeAndDivisor(programAttribute + 3, 1);

					this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer);

					this._gl.vertexAttribPointer(
						programAttribute + 0,
						4,
						type,
						false,
						64,
						0
					);
					this._gl.vertexAttribPointer(
						programAttribute + 1,
						4,
						type,
						false,
						64,
						16
					);
					this._gl.vertexAttribPointer(
						programAttribute + 2,
						4,
						type,
						false,
						64,
						32
					);
					this._gl.vertexAttribPointer(
						programAttribute + 3,
						4,
						type,
						false,
						64,
						48
					);
				} else if (object instanceof InstancedMesh) {
					const attribute = this._attributes.get(object.instanceColor);

					// TODO Attribute may not be available on context restore

					if (attribute === undefined) continue;

					const buffer = attribute.buffer;
					const type = attribute.type;

					this.enableAttributeAndDivisor(programAttribute, 1);

					this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer);

					this._gl.vertexAttribPointer(programAttribute, 3, type, false, 12, 0);
				} else if (material instanceof ShaderMaterial) {
					const value = material.defaultAttributeValues[name];

					if (value !== undefined) {
						switch (value.length) {
							case 2:
								this._gl.vertexAttrib2fv(programAttribute, value);
								break;

							case 3:
								this._gl.vertexAttrib3fv(programAttribute, value);
								break;

							case 4:
								this._gl.vertexAttrib4fv(programAttribute, value);
								break;

							default:
								this._gl.vertexAttrib1fv(programAttribute, value);
						}
					}
				}
			}
		}

		this.disableUnusedAttributes();
	}

	dispose() {
		this.reset();

		for (const geometryId in this.bindingStates) {
			const programMap = this.bindingStates[geometryId];

			for (const programId in programMap) {
				const stateMap = programMap[programId];

				for (const wireframe in stateMap) {
					this.deleteVertexArrayObject(stateMap[wireframe].object);

					delete stateMap[wireframe];
				}

				delete programMap[programId];
			}

			delete this.bindingStates[geometryId];
		}
	}

	releaseStatesOfGeometry(geometry) {
		if (this.bindingStates[geometry.id] === undefined) return;

		const programMap = this.bindingStates[geometry.id];

		for (const programId in programMap) {
			const stateMap = programMap[programId];

			for (const wireframe in stateMap) {
				this.deleteVertexArrayObject(stateMap[wireframe].object);

				delete stateMap[wireframe];
			}

			delete programMap[programId];
		}

		delete this.bindingStates[geometry.id];
	}

	releaseStatesOfProgram(program) {
		for (const geometryId in this.bindingStates) {
			const programMap = this.bindingStates[geometryId];

			if (programMap[program.id] === undefined) continue;

			const stateMap = programMap[program.id];

			for (const wireframe in stateMap) {
				this.deleteVertexArrayObject(stateMap[wireframe].object);

				delete stateMap[wireframe];
			}

			delete programMap[program.id];
		}
	}

	reset() {
		this.resetDefaultState();

		if (this.currentState === this.defaultState) return;

		this.currentState = this.defaultState;
		this.bindVertexArrayObject(this.currentState.object);
	}

	// for backward-compatilibity

	resetDefaultState() {
		this.defaultState.geometry = null;
		this.defaultState.program = null;
		this.defaultState.wireframe = false;
	}
}

export { WebGLBindingStates };
