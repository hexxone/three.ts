import { WebGLRenderTarget } from "..";

class WebGLMultisampleRenderTarget extends WebGLRenderTarget {
	samples: number;

	constructor(width, height, options) {
		super(width, height, options);

		this.isWebGLMultisampleRenderTarget = true;
		this.samples = 4;
	}

	copy(source: WebGLMultisampleRenderTarget) {
		super.copy(source);

		this.samples = source.samples;

		return this;
	}
}

export { WebGLMultisampleRenderTarget };
