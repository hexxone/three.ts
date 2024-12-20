import default_vertex from '../renderers/shaders/ShaderChunk/default_vertex.glsl';
import default_fragment from '../renderers/shaders/ShaderChunk/default_fragment.glsl';
import { Material } from './Material';
import { cloneUniforms } from '../renderers/shaders/UniformsUtils';

export type IUniformPartial = { value: any; properties?: any };

export type IUniformType = { [key: string]: IUniformPartial };

/**
 * @public
 */
class ShaderMaterial extends Material {

    isRawShaderMaterial: boolean;

    /** @public */
    defines: any;

    /** @public */
    uniforms: IUniformType;

    vertexShader: string;
    fragmentShader: string;
    lights: boolean;

    /** @public */
    extensions: {
        derivatives?: string; // set to use derivatives
        fragDepth?: string; // set to use fragment depth values
        drawBuffers?: string; // set to use draw buffers
        shaderTextureLOD?: string;
    };

    defaultAttributeValues: { color: number[]; uv: number[]; uv2: number[] };
    index0AttributeName: string;
    glslVersion: string;

    constructor() {
        super();

        this.isShaderMaterial = true;

        this.type = 'ShaderMaterial';

        this.defines = {};
        this.uniforms = {};

        this.vertexShader = default_vertex;
        this.fragmentShader = default_fragment;

        this.linewidth = 1;

        this.wireframe = false;
        this.wireframeLinewidth = 1;

        this.fog = false; // set to use scene fog
        this.lights = false; // set to use scene lights
        this.clipping = false; // set to use user-defined clipping planes

        this.skinning = false; // set to use skinning attribute streams
        this.morphTargets = false; // set to use morph targets
        this.morphNormals = false; // set to use morph normals

        this.extensions = {
            derivatives: undefined, // set to use derivatives
            fragDepth: undefined, // set to use fragment depth values
            drawBuffers: undefined, // set to use draw buffers
            shaderTextureLOD: undefined // set to use shader texture LOD
        };

        // When rendered geometry doesn't include these attributes but the material does,
        // use these default values in WebGL. This avoids errors when buffer data is missing.
        this.defaultAttributeValues = {
            color: [1, 1, 1],
            uv: [0, 0],
            uv2: [0, 0]
        };

        this.index0AttributeName = undefined;
        this.uniformsNeedUpdate = false;

        this.glslVersion = null;
    }

    clone() {
        return new ShaderMaterial().copy(this);
    }

    copy(source: ShaderMaterial) {
        super.copy(source);

        this.fragmentShader = source.fragmentShader;
        this.vertexShader = source.vertexShader;

        this.uniforms = cloneUniforms(source.uniforms);

        this.defines = {
            ...source.defines
        };

        this.wireframe = source.wireframe;
        this.wireframeLinewidth = source.wireframeLinewidth;

        this.lights = source.lights;
        this.clipping = source.clipping;

        this.skinning = source.skinning;

        this.morphTargets = source.morphTargets;
        this.morphNormals = source.morphNormals;

        this.extensions = {
            ...source.extensions
        };

        this.glslVersion = source.glslVersion;

        return this;
    }

}

export { ShaderMaterial };
