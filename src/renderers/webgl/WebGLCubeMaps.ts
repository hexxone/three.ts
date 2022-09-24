import { WebGLRenderer } from "..";
import {
	CubeReflectionMapping,
	CubeRefractionMapping,
	EquirectangularReflectionMapping,
	EquirectangularRefractionMapping,
	WebGLCubeRenderTarget,
} from "../../";
import { Texture } from "../../textures";

/**
 * @public
 */
class WebGLCubeMaps {
	_renderer: WebGLRenderer;

	cubemaps = new WeakMap();

	constructor(renderer: WebGLRenderer) {
		this._renderer = renderer;
	}

	_mapTextureMapping(texture: Texture, mapping: number) {
		if (mapping === EquirectangularReflectionMapping) {
			texture.mapping = CubeReflectionMapping;
		} else if (mapping === EquirectangularRefractionMapping) {
			texture.mapping = CubeRefractionMapping;
		}

		return texture;
	}

	_onTextureDispose(event) {
		const texture = event.target;

		texture.removeEventListener("dispose", this._onTextureDispose);

		const cubemap = this.cubemaps.get(texture);

		if (cubemap !== undefined) {
			this.cubemaps.delete(texture);
			cubemap.dispose();
		}
	}

	get(texture: Texture) {
		if (texture && texture.isTexture) {
			const mapping = texture.mapping;

			if (
				mapping === EquirectangularReflectionMapping ||
				mapping === EquirectangularRefractionMapping
			) {
				if (this.cubemaps.has(texture)) {
					const cubemap = this.cubemaps.get(texture).texture;
					return this._mapTextureMapping(cubemap, texture.mapping);
				} else {
					const image = texture.image;

					if (image && image.height > 0) {
						const currentRenderTarget = this._renderer.getRenderTarget();

						const renderTarget = new WebGLCubeRenderTarget(image.height / 2);
						renderTarget.fromEquirectangularTexture(this._renderer, texture);
						this.cubemaps.set(texture, renderTarget);

						this._renderer.setRenderTarget(currentRenderTarget);

						texture.addEventListener("dispose", (e) =>
							this._onTextureDispose(e)
						);

						return this._mapTextureMapping(
							renderTarget.texture,
							texture.mapping
						);
					} else {
						// image not yet ready. try the conversion next frame

						return null;
					}
				}
			}
		}

		return texture;
	}

	dispose() {
		this.cubemaps = new WeakMap();
	}
}

export { WebGLCubeMaps };
