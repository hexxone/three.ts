import { WebGLCapabilities } from './WebGLCapabilities';

const MOZ_EXTENSIONS = [
    'WEBGL_depth_texture',
    'EXT_texture_filter_anisotropic',
    'WEBGL_compressed_texture_s3tc'
];

// TODO missing? lol
type WEBGL_compressed_texture_pvrtc = {
    readonly COMPRESSED_RGB_PVRTC_4BPPV1_IMG: GLenum;
    readonly COMPRESSED_RGB_PVRTC_2BPPV1_IMG: GLenum;
    readonly COMPRESSED_RGBA_PVRTC_4BPPV1_IMG: GLenum;
    readonly COMPRESSED_RGBA_PVRTC_2BPPV1_IMG: GLenum;
}

export type AnyExtension = EXT_blend_minmax &
    EXT_color_buffer_float &
    EXT_color_buffer_half_float &
    EXT_float_blend &
    EXT_texture_filter_anisotropic &
    EXT_frag_depth &
    EXT_shader_texture_lod &
    EXT_sRGB &
    KHR_parallel_shader_compile &
    OES_vertex_array_object &
    OVR_multiview2 &
    WEBGL_color_buffer_float &
    WEBGL_compressed_texture_astc &
    WEBGL_compressed_texture_etc &
    WEBGL_compressed_texture_etc1 &
    WEBGL_compressed_texture_pvrtc &
    WEBGL_compressed_texture_s3tc_srgb &
    WEBGL_debug_shaders &
    WEBGL_draw_buffers &
    WEBGL_lose_context &
    WEBGL_depth_texture &
    WEBGL_debug_renderer_info &
    WEBGL_compressed_texture_s3tc &
    OES_texture_half_float_linear &
    OES_texture_half_float &
    OES_texture_float_linear &
    OES_texture_float &
    OES_standard_derivatives &
    OES_element_index_uint &
    ANGLE_instanced_arrays;

const WEBKIT_EXTENSIONS = [...MOZ_EXTENSIONS, 'WEBGL_compressed_texture_pvrtc'];

/**
 * @public
 */
class WebGLExtensions {

    _gl: GLESRenderingContext;

    extensions: {
        [name: string]: Partial<AnyExtension>;
    } = {};

    constructor(gl: GLESRenderingContext) {
        this._gl = gl;
    }

    private getExtension(name: string): Partial<AnyExtension> {
        // try get existing
        if (this.extensions[name] !== undefined) {
            return this.extensions[name];
        }

        // try get default
        let extension = this._gl.getExtension(name);

        // try get Firefox specific
        if (!extension && MOZ_EXTENSIONS.includes(name)) {
            extension = this._gl.getExtension(`MOZ_${name}`);
        }

        // try get Apple specific
        if (!extension && WEBKIT_EXTENSIONS.includes(name)) {
            extension = this._gl.getExtension(`WEBKIT_${name}`);
        }

        // save & return
        this.extensions[name] = extension;

        return extension;
    }

    has(name: string): boolean {
        return this.getExtension(name) !== null;
    }

    init(capabilities: WebGLCapabilities) {
        if (capabilities.isWebGL2) {
            this.getExtension('EXT_color_buffer_float');
        } else {
            this.getExtension('WEBGL_depth_texture');
            this.getExtension('OES_texture_float');
            this.getExtension('OES_texture_half_float');
            this.getExtension('OES_texture_half_float_linear');
            this.getExtension('OES_standard_derivatives');
            this.getExtension('OES_element_index_uint');
            this.getExtension('OES_vertex_array_object');
            this.getExtension('ANGLE_instanced_arrays');
        }

        this.getExtension('OES_texture_float_linear');
        this.getExtension('EXT_color_buffer_half_float');
    }

    get(name: string): Partial<AnyExtension> {
        const extension = this.getExtension(name);

        if (extension === null) {
            console.warn(
                `WebGLRenderer: ${name} extension not supported.`
            );
        }

        return extension;
    }

}

export { WebGLExtensions };
