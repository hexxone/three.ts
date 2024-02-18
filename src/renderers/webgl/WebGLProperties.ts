import { ImmediateRenderObject } from '../../extras/objects/ImmediateRenderObject';
import { Material } from '../../materials/Material';
import { TFog } from '../../scenes/TFog';
import { Texture } from '../../textures/Texture';
import { WebGLRenderTarget } from '../WebGLRenderTarget';
import { WebGLProgram } from './WebGLProgram';
import { IUniform } from './WebGLUniforms';

/**
 * @public
 */
type WebGLImmediateProperties = {
    __webglTexture: GLESTexture;
    __webglFramebuffer: GLESFramebuffer;
    __maxMipLevel: number;

    position: GLESBuffer;
    normal: GLESBuffer;
    uv: GLESBuffer;
    color: GLESBuffer;
};

/**
 * @public
 */
type WebGLMaterialProperies = {
    __version: number;

    program: WebGLProgram;
    environment: Texture;
    fog: TFog;
    envMap: Texture;
    lightsStateVersion: number;
    uniforms: any;
    outputEncoding: number;
    numClippingPlanes: number;
    numIntersection: number;
    needsLights: boolean;
    uniformsList: IUniform[];
    receiveShadow: boolean;
    clippingState: Float32Array;
};

/**
 * @public
 */
type WebGLTextureProperies = {
    __webglInit: boolean;
    __webglTexture: GLESTexture;
    __version: number;
    __currentAnisotropy: number;
};

/**
 * @public
 */
type WebGLTargetProperies = {
    __webglFramebuffer: GLESFramebuffer;
    __webglDepthbuffer: GLESFramebuffer;
    __webglMultisampledFramebuffer: GLESFramebuffer;
    __webglColorRenderbuffer: GLESFramebuffer;
    __webglDepthRenderbuffer: GLESFramebuffer;
};

/**
 * @public
 */
export type AllGLTypeProperties = WebGLImmediateProperties &
    WebGLMaterialProperies &
    WebGLTextureProperies &
    WebGLTargetProperies;

/**
 * @public
 */
export class WebGLProperties {

    properties = new WeakMap();

    get(object: ImmediateRenderObject): Partial<AllGLTypeProperties>;
    get(object: Material): Partial<AllGLTypeProperties>;
    get(object: Texture): Partial<AllGLTypeProperties>;
    get(object: WebGLRenderTarget): Partial<AllGLTypeProperties>;
    get(object) {
        let map = this.properties.get(object);

        if (map === undefined) {
            map = {};
            this.properties.set(object, map);
        }

        return map;
    }

    remove(object) {
        this.properties.delete(object);
    }

    update(object, key, value) {
        this.properties.get(object)[key] = value;
    }

    dispose() {
        this.properties = new WeakMap();
    }

}
