import { WebGLCapabilities } from "./WebGLCapabilities";

const MOZ_EXTENSIONS = [
	"WEBGL_depth_texture",
	"EXT_texture_filter_anisotropic",
	"WEBGL_compressed_texture_s3tc",
];

const WEBKIT_EXTENSIONS = [...MOZ_EXTENSIONS, "WEBGL_compressed_texture_pvrtc"];

class WebGLExtensions {
	_gl: GLESRenderingContext;

	extensions = {};

	constructor(gl: GLESRenderingContext) {
		this._gl = gl;
	}

	getExtension(name: string) {
		// try get existing
		if (this.extensions[name] !== undefined) {
			return this.extensions[name];
		}

		// try get default
		let extension = this._gl.getExtension(name);

		// try get Firefox specific
		if (!extension && MOZ_EXTENSIONS.includes(name)) {
			extension = this._gl.getExtension("MOZ_" + name);
		}

		// try get Apple specific
		if (!extension && WEBKIT_EXTENSIONS.includes(name)) {
			extension = this._gl.getExtension("WEBKIT_" + name);
		}

		// save & return
		this.extensions[name] = extension;
		return extension;
	}

	has(name: string) {
		return this.getExtension(name) !== null;
	}

	init(capabilities: WebGLCapabilities) {
		if (capabilities.isWebGL2) {
			this.getExtension("EXT_color_buffer_float");
		} else {
			this.getExtension("WEBGL_depth_texture");
			this.getExtension("OES_texture_float");
			this.getExtension("OES_texture_half_float");
			this.getExtension("OES_texture_half_float_linear");
			this.getExtension("OES_standard_derivatives");
			this.getExtension("OES_element_index_uint");
			this.getExtension("OES_vertex_array_object");
			this.getExtension("ANGLE_instanced_arrays");
		}

		this.getExtension("OES_texture_float_linear");
		this.getExtension("EXT_color_buffer_half_float");
	}

	get(name: string) {
		const extension = this.getExtension(name);

		if (extension === null) {
			console.warn(
				"THREE.WebGLRenderer: " + name + " extension not supported."
			);
		}

		return extension;
	}
}

export { WebGLExtensions };
