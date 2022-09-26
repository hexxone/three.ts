// eslint-disable no-invalid-this

import { Color } from "../../math/Color";
import { Matrix3 } from "../../math/Matrix3";
import { Matrix4 } from "../../math/Matrix4";
import { Vector3 } from "../../math/Vector3";
import { Vector4 } from "../../math/Vector4";
import { CubeTexture } from "../../textures/CubeTexture";
import { DataTexture2DArray } from "../../textures/DataTexture2DArray";
import { DataTexture3D } from "../../textures/DataTexture3D";
import { Texture } from "../../textures/Texture";
import { WebGLTextures } from "./WebGLTextures";

/**
 * Uniforms of a program.
 * Those form a tree structure with a special top-level container for the root,
 * which you get by calling 'new WebGLUniforms( gl, program )'.
 *
 *
 * Properties of inner nodes including the top-level container:
 *
 * .seq - array of nested uniforms
 * .map - nested uniforms by name
 *
 *
 * Methods of all nodes except the top-level container:
 *
 * .setValue( gl, value, [textures] )
 *
 * 		uploads a uniform value(s)
 *  	the 'textures' parameter is needed for sampler uniforms
 *
 *
 * Static methods of the top-level container (textures factorizations):
 *
 * .upload( gl, seq, values, textures )
 *
 * 		sets uniforms in 'seq' to 'values[id].value'
 *
 * .seqWithValue( seq, values ) : filteredSeq
 *
 * 		filters 'seq' entries with corresponding entry in values
 *
 *
 * Methods of the top-level container (textures factorizations):
 *
 * .setValue( gl, name, value, textures )
 *
 * 		sets uniform with  name 'name' to 'value'
 *
 * .setOptional( gl, obj, prop )
 *
 * 		like .set for an optional property of the object
 *
 */

const emptyTexture = new Texture();
const emptyTexture2dArray = new DataTexture2DArray();
const emptyTexture3d = new DataTexture3D();
const emptyCubeTexture = new CubeTexture();

// --- Utilities ---

// Array Caches (provide typed arrays for temporary by size)

const arrayCacheF32 = [];
const arrayCacheI32 = [];

// Float32Array caches used for uploading Matrix uniforms

const mat4array = new Float32Array(16);
const mat3array = new Float32Array(9);
const mat2array = new Float32Array(4);

// Flattening for arrays of vectors and matrices

function flatten(array, nBlocks, blockSize) {
	const firstElem = array[0];

	if (firstElem <= 0 || firstElem > 0) return array;
	// unoptimized: ! isNaN( firstElem )
	// see http://jacksondunstan.com/articles/983

	const n = nBlocks * blockSize;
	let r = arrayCacheF32[n];

	if (r === undefined) {
		r = new Float32Array(n);
		arrayCacheF32[n] = r;
	}

	if (nBlocks !== 0) {
		firstElem.toArray(r, 0);

		for (let i = 1, offset = 0; i !== nBlocks; ++i) {
			offset += blockSize;
			array[i].toArray(r, offset);
		}
	}

	return r;
}

function arraysEqual(a, b) {
	if (a.length !== b.length) return false;

	for (let i = 0, l = a.length; i < l; i++) {
		if (a[i] !== b[i]) return false;
	}

	return true;
}

function copyArray(
	a: any[] | Float32Array | Int32Array,
	b: any[] | Float32Array | Int32Array
) {
	for (let i = 0, l = b.length; i < l; i++) {
		a[i] = b[i];
	}
}

// Texture unit allocation

function allocTexUnits(textures: WebGLTextures, n) {
	let r = arrayCacheI32[n];

	if (r === undefined) {
		r = new Int32Array(n);
		arrayCacheI32[n] = r;
	}

	for (let i = 0; i !== n; ++i) {
		r[i] = textures.allocateTextureUnit();
	}

	return r;
}

// --- Setters ---

// Note: Defining these methods externally, because they come in a bunch
// and this way their names minify.

// Single scalar

function setValueV1f(gl: GLESRenderingContext, v) {
	const cache = this.cache;

	if (cache[0] === v) return;

	gl.uniform1f(this.addr, v);

	cache[0] = v;
}

// Single float vector (from flat array or VectorN)

function setValueV2f(gl: GLESRenderingContext, v) {
	const cache = this.cache;

	if (v.x !== undefined) {
		if (cache[0] !== v.x || cache[1] !== v.y) {
			gl.uniform2f(this.addr, v.x, v.y);

			cache[0] = v.x;
			cache[1] = v.y;
		}
	} else {
		if (arraysEqual(cache, v)) return;

		gl.uniform2fv(this.addr, v);

		copyArray(cache, v);
	}
}

function setValueV3f(
	gl: GLESRenderingContext,
	v: Vector3 | Color | Float32Array
) {
	const cache = this.cache;

	if (v instanceof Vector3) {
		if (cache[0] !== v.x || cache[1] !== v.y || cache[2] !== v.z) {
			gl.uniform3f(this.addr, v.x, v.y, v.z);

			cache[0] = v.x;
			cache[1] = v.y;
			cache[2] = v.z;
		}
	} else if (v instanceof Color) {
		if (cache[0] !== v.r || cache[1] !== v.g || cache[2] !== v.b) {
			gl.uniform3f(this.addr, v.r, v.g, v.b);

			cache[0] = v.r;
			cache[1] = v.g;
			cache[2] = v.b;
		}
	} else {
		if (arraysEqual(cache, v)) return;

		gl.uniform3fv(this.addr, v);

		copyArray(cache, v);
	}
}

function setValueV4f(gl: GLESRenderingContext, v: Vector4 | Float32Array) {
	const cache = this.cache;

	if (v instanceof Vector4) {
		if (
			cache[0] !== v.x ||
			cache[1] !== v.y ||
			cache[2] !== v.z ||
			cache[3] !== v.w
		) {
			gl.uniform4f(this.addr, v.x, v.y, v.z, v.w);

			cache[0] = v.x;
			cache[1] = v.y;
			cache[2] = v.z;
			cache[3] = v.w;
		}
	} else {
		if (arraysEqual(cache, v)) return;

		gl.uniform4fv(this.addr, v);

		copyArray(cache, v);
	}
}

// Single matrix (from flat array or MatrixN)

function setValueM2(gl: GLESRenderingContext, v: Matrix4 | Float32Array) {
	const cache = this.cache;

	if (v instanceof Float32Array) {
		if (arraysEqual(cache, v)) return;

		gl.uniformMatrix2fv(this.addr, false, v);

		copyArray(cache, v);
	} else {
		const elements = v.elements;

		if (arraysEqual(cache, elements)) return;

		mat2array.set(elements);

		gl.uniformMatrix2fv(this.addr, false, mat2array);

		copyArray(cache, elements);
	}
}

function setValueM3(gl: GLESRenderingContext, v: Matrix3 | Float32Array) {
	const cache = this.cache;

	if (v instanceof Float32Array) {
		if (arraysEqual(cache, v)) return;

		gl.uniformMatrix3fv(this.addr, false, v);

		copyArray(cache, v);
	} else {
		const elements = v.elements;

		if (arraysEqual(cache, elements)) return;

		mat3array.set(elements);

		gl.uniformMatrix3fv(this.addr, false, mat3array);

		copyArray(cache, elements);
	}
}

function setValueM4(gl: GLESRenderingContext, v: Matrix4 | Float32Array) {
	const cache = this.cache;

	if (v instanceof Float32Array) {
		if (arraysEqual(cache, v)) return;

		gl.uniformMatrix4fv(this.addr, false, v);

		copyArray(cache, v);
	} else {
		const elements = v.elements;

		if (arraysEqual(cache, elements)) return;

		mat4array.set(elements);

		gl.uniformMatrix4fv(this.addr, false, mat4array);

		copyArray(cache, elements);
	}
}

// Single texture (2D / Cube)

function setValueT1(gl: GLESRenderingContext, v, textures: WebGLTextures) {
	const cache = this.cache;
	const unit = textures.allocateTextureUnit();

	if (cache[0] !== unit) {
		gl.uniform1i(this.addr, unit);
		cache[0] = unit;
	}

	textures.safeSetTexture2D(v || emptyTexture, unit);
}

function setValueT2DArray1(
	gl: GLESRenderingContext,
	v,
	textures: WebGLTextures
) {
	const cache = this.cache;
	const unit = textures.allocateTextureUnit();

	if (cache[0] !== unit) {
		gl.uniform1i(this.addr, unit);
		cache[0] = unit;
	}

	textures.setTexture2DArray(v || emptyTexture2dArray, unit);
}

function setValueT3D1(gl: GLESRenderingContext, v, textures: WebGLTextures) {
	const cache = this.cache;
	const unit = textures.allocateTextureUnit();

	if (cache[0] !== unit) {
		gl.uniform1i(this.addr, unit);
		cache[0] = unit;
	}

	textures.setTexture3D(v || emptyTexture3d, unit);
}

function setValueT6(gl: GLESRenderingContext, v, textures: WebGLTextures) {
	const cache = this.cache;
	const unit = textures.allocateTextureUnit();

	if (cache[0] !== unit) {
		gl.uniform1i(this.addr, unit);
		cache[0] = unit;
	}

	textures.safeSetTextureCube(v || emptyCubeTexture, unit);
}

// Integer / Boolean vectors or arrays thereof (always flat arrays)

function setValueV1i(gl: GLESRenderingContext, v: number) {
	const cache = this.cache;

	if (cache[0] === v) return;

	gl.uniform1i(this.addr, v);

	cache[0] = v;
}

function setValueV2i(gl: GLESRenderingContext, v: Int32Array) {
	const cache = this.cache;

	if (arraysEqual(cache, v)) return;

	gl.uniform2iv(this.addr, v);

	copyArray(cache, v);
}

function setValueV3i(gl: GLESRenderingContext, v: Int32Array) {
	const cache = this.cache;

	if (arraysEqual(cache, v)) return;

	gl.uniform3iv(this.addr, v);

	copyArray(cache, v);
}

function setValueV4i(gl: GLESRenderingContext, v: Int32Array) {
	const cache = this.cache;

	if (arraysEqual(cache, v)) return;

	gl.uniform4iv(this.addr, v);

	copyArray(cache, v);
}

// uint

function setValueV1ui(gl: GLESRenderingContext, v: number) {
	const cache = this.cache;

	if (cache[0] === v) return;

	gl.uniform1ui(this.addr, v);

	cache[0] = v;
}

// Helper to pick the right setter for the singular case

function getSingularSetter(type: number) {
	switch (type) {
		case 0x1406:
			return setValueV1f; // FLOAT
		case 0x8b50:
			return setValueV2f; // _VEC2
		case 0x8b51:
			return setValueV3f; // _VEC3
		case 0x8b52:
			return setValueV4f; // _VEC4

		case 0x8b5a:
			return setValueM2; // _MAT2
		case 0x8b5b:
			return setValueM3; // _MAT3
		case 0x8b5c:
			return setValueM4; // _MAT4

		case 0x1404:
		case 0x8b56:
			return setValueV1i; // INT, BOOL
		case 0x8b53:
		case 0x8b57:
			return setValueV2i; // _VEC2
		case 0x8b54:
		case 0x8b58:
			return setValueV3i; // _VEC3
		case 0x8b55:
		case 0x8b59:
			return setValueV4i; // _VEC4

		case 0x1405:
			return setValueV1ui; // UINT

		case 0x8b5e: // SAMPLER_2D
		case 0x8d66: // SAMPLER_EXTERNAL_OES
		case 0x8dca: // INT_SAMPLER_2D
		case 0x8dd2: // UNSIGNED_INT_SAMPLER_2D
		case 0x8b62: // SAMPLER_2D_SHADOW
			return setValueT1;

		case 0x8b5f: // SAMPLER_3D
		case 0x8dcb: // INT_SAMPLER_3D
		case 0x8dd3: // UNSIGNED_INT_SAMPLER_3D
			return setValueT3D1;

		case 0x8b60: // SAMPLER_CUBE
		case 0x8dcc: // INT_SAMPLER_CUBE
		case 0x8dd4: // UNSIGNED_INT_SAMPLER_CUBE
		case 0x8dc5: // SAMPLER_CUBE_SHADOW
			return setValueT6;

		case 0x8dc1: // SAMPLER_2D_ARRAY
		case 0x8dcf: // INT_SAMPLER_2D_ARRAY
		case 0x8dd7: // UNSIGNED_INT_SAMPLER_2D_ARRAY
		case 0x8dc4: // SAMPLER_2D_ARRAY_SHADOW
			return setValueT2DArray1;
	}
}

// Array of scalars
function setValueV1fArray(gl: GLESRenderingContext, v) {
	gl.uniform1fv(this.addr, v);
}

// Integer / Boolean vectors or arrays thereof (always flat arrays)
function setValueV1iArray(gl: GLESRenderingContext, v) {
	gl.uniform1iv(this.addr, v);
}

function setValueV2iArray(gl: GLESRenderingContext, v) {
	gl.uniform2iv(this.addr, v);
}

function setValueV3iArray(gl: GLESRenderingContext, v) {
	gl.uniform3iv(this.addr, v);
}

function setValueV4iArray(gl: GLESRenderingContext, v) {
	gl.uniform4iv(this.addr, v);
}

// Array of vectors (flat or from THREE classes)

function setValueV2fArray(gl: GLESRenderingContext, v) {
	const data = flatten(v, this.size, 2);

	gl.uniform2fv(this.addr, data);
}

function setValueV3fArray(gl: GLESRenderingContext, v) {
	const data = flatten(v, this.size, 3);

	gl.uniform3fv(this.addr, data);
}

function setValueV4fArray(gl: GLESRenderingContext, v) {
	const data = flatten(v, this.size, 4);

	gl.uniform4fv(this.addr, data);
}

// Array of matrices (flat or from THREE clases)

function setValueM2Array(gl: GLESRenderingContext, v) {
	const data = flatten(v, this.size, 4);

	gl.uniformMatrix2fv(this.addr, false, data);
}

function setValueM3Array(gl: GLESRenderingContext, v) {
	const data = flatten(v, this.size, 9);

	gl.uniformMatrix3fv(this.addr, false, data);
}

function setValueM4Array(gl: GLESRenderingContext, v) {
	const data = flatten(v, this.size, 16);

	gl.uniformMatrix4fv(this.addr, false, data);
}

// Array of textures (2D / Cube)

function setValueT1Array(gl: GLESRenderingContext, v: Texture[], textures: WebGLTextures) {
	const n = v.length;

	const units = allocTexUnits(textures, n);

	gl.uniform1iv(this.addr, units);

	for (let i = 0; i !== n; ++i) {
		textures.safeSetTexture2D(v[i] || emptyTexture, units[i]);
	}
}

function setValueT6Array(gl: GLESRenderingContext, v: CubeTexture[], textures: WebGLTextures) {
	const n = v.length;

	const units = allocTexUnits(textures, n);

	gl.uniform1iv(this.addr, units);

	for (let i = 0; i !== n; ++i) {
		textures.safeSetTextureCube(v[i] || emptyCubeTexture, units[i]);
	}
}

// Helper to pick the right setter for a pure (bottom-level) array

function getPureArraySetter(type) {
	switch (type) {
		case 0x1406:
			return setValueV1fArray; // FLOAT
		case 0x8b50:
			return setValueV2fArray; // _VEC2
		case 0x8b51:
			return setValueV3fArray; // _VEC3
		case 0x8b52:
			return setValueV4fArray; // _VEC4

		case 0x8b5a:
			return setValueM2Array; // _MAT2
		case 0x8b5b:
			return setValueM3Array; // _MAT3
		case 0x8b5c:
			return setValueM4Array; // _MAT4

		case 0x1404:
		case 0x8b56:
			return setValueV1iArray; // INT, BOOL
		case 0x8b53:
		case 0x8b57:
			return setValueV2iArray; // _VEC2
		case 0x8b54:
		case 0x8b58:
			return setValueV3iArray; // _VEC3
		case 0x8b55:
		case 0x8b59:
			return setValueV4iArray; // _VEC4

		case 0x8b5e: // SAMPLER_2D
		case 0x8d66: // SAMPLER_EXTERNAL_OES
		case 0x8dca: // INT_SAMPLER_2D
		case 0x8dd2: // UNSIGNED_INT_SAMPLER_2D
		case 0x8b62: // SAMPLER_2D_SHADOW
			return setValueT1Array;

		case 0x8b60: // SAMPLER_CUBE
		case 0x8dcc: // INT_SAMPLER_CUBE
		case 0x8dd4: // UNSIGNED_INT_SAMPLER_CUBE
		case 0x8dc5: // SAMPLER_CUBE_SHADOW
			return setValueT6Array;
	}
}

// --- Uniform Classes ---

/**
 * @public
 */
interface IUniform {
	id: number;

	setValue: (gl: GLESRenderingContext, v: Texture[], textures: WebGLTextures) => void;
}

/**
 * @public
 */
class SingleUniform implements IUniform {
	id: number;
	addr: GLESUniformLocation;
	cache: any[];

	// path = activeInfo.name; // DEBUG

	constructor(id: number, activeInfo: GLESActiveInfo, addr: GLESUniformLocation) {
		this.id = id;
		this.addr = addr;
		this.cache = [];

		this.setValue = getSingularSetter(activeInfo.type);
	}

	/** virtual */
	setValue: (gl: GLESRenderingContext, v: Texture[], textures: WebGLTextures) => void;
}

/**
 * @public
 */
class PureArrayUniform implements IUniform {
	id: number;
	addr: GLESUniformLocation;
	cache: Array<any> | Float32Array;
	size: number;

	constructor(id: number, activeInfo, addr: GLESUniformLocation) {
		this.id = id;
		this.addr = addr;
		this.cache = [];
		this.size = activeInfo.size;

		this.setValue = getPureArraySetter(activeInfo.type);
	}

	/** virtual */
	setValue: (gl: any, v: any, textures: any) => void;

	updateCache(data: any) {
		const cache = this.cache;

		if (data instanceof Float32Array && cache.length !== data.length) {
			this.cache = new Float32Array(data.length);
		}

		copyArray(cache, data);
	}
}

/**
 * @public
 */
class StructuredUniform implements IUniform {
	id: number;

	seq: IUniform[];
	map: {};

	constructor(id) {
		this.id = id;

		this.seq = [];
		this.map = {};
	}

	setValue(gl: GLESRenderingContext, value: any, textures: WebGLTextures) {
		const seq = this.seq;

		for (let i = 0, n = seq.length; i !== n; ++i) {
			const u = seq[i];
			u.setValue(gl, value[u.id], textures);
		}
	}
}

// --- Top-level ---

// Parser - builds up the property tree from the path strings

const RePathPart = /(\w+)(\])?(\[|\.)?/g;

// extracts
// 	- the identifier (member name or array index)
//  - followed by an optional right bracket (found when array index)
//  - followed by an optional left bracket or dot (type of subscript)
//
// Note: These portions can be read in a non-overlapping fashion and
// allow straightforward parsing of the hierarchy that WebGL encodes
// in the uniform names.

function addUniform(container: WebGLUniforms, uniformObject: IUniform) {
	container.seq.push(uniformObject);
	container.map[uniformObject.id] = uniformObject;
}

function parseUniform(
	activeInfo: GLESActiveInfo,
	addr: GLESUniformLocation,
	container: WebGLUniforms
) {
	const path = activeInfo.name;
	const pathLength = path.length;

	// reset RegExp object, because of the early exit of a previous run
	RePathPart.lastIndex = 0;

	while (true) {
		const match = RePathPart.exec(path);
		const matchEnd = RePathPart.lastIndex;

		let id = match[1] as any;
		const idIsIndex = match[2] === "]";
		const subscript = match[3];

		if (idIsIndex) id = id | 0; // convert to integer

		if (
			subscript === undefined ||
			(subscript === "[" && matchEnd + 2 === pathLength)
		) {
			// bare name or "pure" bottom-level array "[0]" suffix

			addUniform(
				container,
				subscript === undefined
					? new SingleUniform(id, activeInfo, addr)
					: new PureArrayUniform(id, activeInfo, addr)
			);

			break;
		} else {
			// step into inner node / create it in case it doesn't exist

			const map = container.map;
			let next = map[id];

			if (next === undefined) {
				next = new StructuredUniform(id);
				addUniform(container, next);
			}

			container = next;
		}
	}
}

// Root Container

/**
 * @public
 */
class WebGLUniforms {
	seq: IUniform[] = [];
	map: any = {};

	constructor(gl: GLESRenderingContext, program) {
		const n = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

		for (let i = 0; i < n; ++i) {
			const info = gl.getActiveUniform(program, i);
			const addr = gl.getUniformLocation(program, info.name);

			parseUniform(info, addr, this);
		}
	}

	setValue(
		gl: GLESRenderingContext,
		name: any,
		value: any,
		textures?: any
	): void {
		const u = this.map[name];

		if (u !== undefined) u.setValue(gl, value, textures);
	}

	setOptional(gl: GLESRenderingContext, object: any, name: any): void {
		const v = object[name];

		if (v !== undefined) this.setValue(gl, name, v);
	}

	static upload(
		gl: GLESRenderingContext,
		seq: any,
		values: any,
		textures?: any
	): void {
		for (let i = 0, n = seq.length; i !== n; ++i) {
			const u = seq[i];
			const v = values[u.id];

			if (v.needsUpdate !== false) {
				// note: always updating when .needsUpdate is undefined
				u.setValue(gl, v.value, textures);
			}
		}
	}

	static seqWithValue(seq: IUniform[], values: any[]): IUniform[] {
		const r = [];

		for (let i = 0, n = seq.length; i !== n; ++i) {
			const u = seq[i];
			if (u.id in values) r.push(u);
		}

		return r;
	}
}

export { IUniform, WebGLUniforms };
