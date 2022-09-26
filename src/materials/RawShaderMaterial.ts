import { ShaderMaterial } from "./ShaderMaterial";

class RawShaderMaterial extends ShaderMaterial {
	constructor() {
		super();

		this.isRawShaderMaterial = true;
		this.type = "RawShaderMaterial";
	}
}

export { RawShaderMaterial };
