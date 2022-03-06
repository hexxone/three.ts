import { Camera, Light, Object3D, ShadowMaterial } from "../..";
import { WebGLCapabilities } from "./WebGLCapabilities";
import { WebGLExtensions } from "./WebGLExtensions";
import { WebGLLights } from "./WebGLLights";

/**
 * @public
 */
class WebGLRenderState {
	lights: WebGLLights;

	lightsArray: Light[] = [];
	shadowsArray: Light[] = [];

	constructor(extensions: WebGLExtensions, capabilities: WebGLCapabilities) {
		this.lights = new WebGLLights(extensions, capabilities);
	}

	init() {
		this.lightsArray.length = 0;
		this.shadowsArray.length = 0;
	}

	pushLight(light) {
		this.lightsArray.push(light);
	}

	pushShadow(shadowLight) {
		this.shadowsArray.push(shadowLight);
	}

	setupLights() {
		this.lights.setup(this.lightsArray);
	}

	setupLightsView(camera: Camera) {
		this.lights.setupView(this.lightsArray, camera);
	}
}

class WebGLRenderStates {
	_extensions: WebGLExtensions;
	_capabilities: WebGLCapabilities;

	renderStates = new WeakMap<Object3D, WebGLRenderState[]>();

	constructor(extensions: WebGLExtensions, capabilities: WebGLCapabilities) {
		this._extensions = extensions;
		this._capabilities = capabilities;
	}

	get(scene: Object3D, renderCallDepth = 0): WebGLRenderState {
		let renderState;

		if (!this.renderStates.has(scene)) {
			renderState = new WebGLRenderState(this._extensions, this._capabilities);
			this.renderStates.set(scene, [renderState]);
		} else {
			if (renderCallDepth >= this.renderStates.get(scene).length) {
				renderState = new WebGLRenderState(
					this._extensions,
					this._capabilities
				);
				this.renderStates.get(scene).push(renderState);
			} else {
				renderState = this.renderStates.get(scene)[renderCallDepth];
			}
		}

		return renderState;
	}

	dispose() {
		this.renderStates = new WeakMap();
	}
}

export { WebGLRenderState, WebGLRenderStates };
