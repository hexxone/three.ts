import { WebGLRendererParameters } from '../WebGLRenderer';
import { WebGLExtensions } from './WebGLExtensions';

class WebGLCapabilities {

    logarithmicDepthBuffer: boolean;

    maxTextures: number;
    maxVertexTextures: number;
    maxTextureSize: number;
    maxCubemapSize: number;
    maxAttributes: number;
    maxVertexUniforms: number;
    maxVaryings: number;
    maxFragmentUniforms: number;
    maxSamples: number;

    vertexTextures: boolean;
    floatFragmentTextures: boolean;
    floatVertexTextures: boolean;

    isWebGL2: boolean;

    precision: string;
    maxPrecision: string;

    maxAnisotropy: number;

    constructor(
        gl: GLESRenderingContext,
        extensions: WebGLExtensions,
        parameters: WebGLRendererParameters
    ) {
        /* eslint-disable no-undef */
        this.isWebGL2
            = typeof WebGL2RenderingContext !== 'undefined'
            && gl instanceof WebGL2RenderingContext;
        /* eslint-enable no-undef */

        this.getMaxAnisotropy(gl, extensions);

        this.precision
            = parameters.precision !== undefined ? parameters.precision : 'highp';
        this.maxPrecision = this.getMaxPrecision(gl, this.precision);

        if (this.maxPrecision !== this.precision) {
            console.warn(
                'WebGLRenderer:',
                this.precision,
                'not supported, using',
                this.maxPrecision,
                'instead.'
            );
            this.precision = this.maxPrecision;
        }

        this.logarithmicDepthBuffer
            = parameters.logarithmicDepthBuffer === true;
        this.maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        this.maxVertexTextures = gl.getParameter(
            gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS
        );
        this.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        this.maxCubemapSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);
        this.maxAttributes = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
        this.maxVertexUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
        this.maxVaryings = gl.getParameter(gl.MAX_VARYING_VECTORS);
        this.maxFragmentUniforms = gl.getParameter(
            gl.MAX_FRAGMENT_UNIFORM_VECTORS
        );

        this.vertexTextures = this.maxVertexTextures > 0;
        this.floatFragmentTextures
            = this.isWebGL2 || extensions.has('OES_texture_float');
        this.floatVertexTextures
            = this.vertexTextures && this.floatFragmentTextures;
        this.maxSamples = this.isWebGL2 ? gl.getParameter(gl.MAX_SAMPLES) : 0;
    }

    getMaxAnisotropy(gl: GLESRenderingContext, ext: WebGLExtensions) {
        if (this.maxAnisotropy !== undefined) { return this.maxAnisotropy; }

        if (ext.has('EXT_texture_filter_anisotropic')) {
            const extension = ext.get(
                'EXT_texture_filter_anisotropic'
            ) as EXT_texture_filter_anisotropic;

            this.maxAnisotropy = gl.getParameter(
                extension.MAX_TEXTURE_MAX_ANISOTROPY_EXT
            );
        } else {
            this.maxAnisotropy = 0;
        }
    }

    getMaxPrecision(gl: GLESRenderingContext, precision?: string) {
        if (precision === 'highp') {
            if (
                gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT)
                    .precision > 0
                && gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT)
                    .precision > 0
            ) {
                return 'highp';
            }

            precision = 'mediump';
        }

        if (precision === 'mediump') {
            if (
                gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT)
                    .precision > 0
                && gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT)
                    .precision > 0
            ) {
                return 'mediump';
            }
        }

        return 'lowp';
    }

}

export { WebGLCapabilities };
