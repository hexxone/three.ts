import { Texture } from "../";
import { WebGLRenderTarget } from "./WebGLRenderTarget";

class WebGLMultipleRenderTargets extends WebGLRenderTarget {
	textures: Texture[];

	constructor(width, height, count) {
		super(width, height);

		this.isWebGLMultipleRenderTargets = true;

		const texture = this.texture;

		this.textures = [];

		for (let i = 0; i < count; i++) {
			this.textures[i] = texture.clone();
		}
	}

	setSize(width, height, depth = 1) {
		if (
			this.width !== width ||
			this.height !== height ||
			this.depth !== depth
		) {
			this.width = width;
			this.height = height;
			this.depth = depth;

			for (let i = 0, il = this.textures.length; i < il; i++) {
				this.textures[i].image.width = width;
				this.textures[i].image.height = height;
				this.textures[i].image.depth = depth;
			}

			this.dispose();
		}

		this.viewport.set(0, 0, width, height);
		this.scissor.set(0, 0, width, height);

		return this;
	}

	copy(source: WebGLMultipleRenderTargets) {
		this.dispose();

		this.width = source.width;
		this.height = source.height;
		this.depth = source.depth;

		this.viewport.set(0, 0, this.width, this.height);
		this.scissor.set(0, 0, this.width, this.height);

		this.depthBuffer = source.depthBuffer;
		this.stencilBuffer = source.stencilBuffer;
		this.depthTexture = source.depthTexture;

		this.textures.length = 0;

		for (let i = 0, il = source.textures.length; i < il; i++) {
			this.textures[i] = source.textures[i].clone();
		}

		return this;
	}
}

export { WebGLMultipleRenderTargets };
