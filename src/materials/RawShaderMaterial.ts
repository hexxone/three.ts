import { ShaderMaterial } from "./ShaderMaterial";

class RawShaderMaterial extends ShaderMaterial {
	constructor(parameters) {
		super(parameters);

		this.isRawShaderMaterial = true;
		this.type = "RawShaderMaterial";
	}
}

export { RawShaderMaterial };
