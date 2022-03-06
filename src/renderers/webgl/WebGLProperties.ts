import { IUniform, WebGLRenderTarget } from "..";
import { Fog, ImmediateRenderObject, Material, Texture } from "../..";
import { WebGLProgram } from "./WebGLProgram";

type WebGLImmediateProperties = {
	__webglTexture: GLESTexture;
	__webglFramebuffer: GLESFramebuffer;
	__maxMipLevel: number;

	position: GLESBuffer;
	normal: GLESBuffer;
	uv: GLESBuffer;
	color: GLESBuffer;
};

type WebGLMaterialProperies = {
	__version: number;

	program: WebGLProgram;
	environment: Texture;
	fog: Fog;
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

type WebGLTextureProperies = {
	__webglInit: boolean;
	__webglTexture: GLESTexture;
	__version: number;
	__currentAnisotropy: number;
};

type WebGLTargetProperies = {
	__webglFramebuffer: GLESFramebuffer;
	__webglDepthbuffer: GLESFramebuffer;
	__webglMultisampledFramebuffer: GLESFramebuffer;
	__webglColorRenderbuffer: GLESFramebuffer;
	__webglDepthRenderbuffer: GLESFramebuffer;
};

class WebGLProperties {
	properties = new WeakMap();

	get(object: ImmediateRenderObject): WebGLImmediateProperties;
	get(object: Material): WebGLMaterialProperies;
	get(object: Texture): WebGLTextureProperies;
	get(object: WebGLRenderTarget): WebGLTargetProperies;
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

export { WebGLProperties };
