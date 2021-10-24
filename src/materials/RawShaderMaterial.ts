import { ShaderMaterial } from './ShaderMaterial';

class RawShaderMaterial extends ShaderMaterial {

	constructor(parameters) {
		super(parameters);

		Object.defineProperty(this, 'isRawShaderMaterial', {
			value: true
		});

		this.type = 'RawShaderMaterial';
	}
}

export { RawShaderMaterial };
