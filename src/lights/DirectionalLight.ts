import { DefaultUp, Light, Object3D } from '../';
import { DirectionalLightShadow } from './DirectionalLightShadow';

class DirectionalLight extends Light {
	target: Object3D;

	constructor( color, intensity ) {
		super( color, intensity );

		this.isDirectionalLight = true;
		this.type = 'DirectionalLight';

		this.position.copy( DefaultUp );
		this.updateMatrix();

		this.target = new Object3D();

		this.shadow = new DirectionalLightShadow();
	}

	copy( source: DirectionalLight ) {
		super.copy( source );

		this.target = source.target.clone();
		this.shadow = source.shadow.clone();

		return this;
	}
}

export { DirectionalLight };
