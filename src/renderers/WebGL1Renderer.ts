import { WebGLRenderer } from "..";

class WebGL1Renderer extends WebGLRenderer {
	constructor(parameters?) {
		super(parameters);

		this.isWebGL1Renderer = true;
	}
}

export { WebGL1Renderer };
