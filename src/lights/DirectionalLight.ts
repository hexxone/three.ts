import { Light } from './Light';
import { DirectionalLightShadow } from './DirectionalLightShadow';
import { Object3D } from '../core/Object3D';

class DirectionalLight extends Light {
	constructor( color, intensity ) {
		super( color, intensity );

		this.type = 'DirectionalLight';

		this.position.copy( Object3D.DefaultUp );
		this.updateMatrix();

		this.target = new Object3D();

		this.shadow = new DirectionalLightShadow();
	}

	copy( source ) {
		super.copy( source );

		this.target = source.target.clone();
		this.shadow = source.shadow.clone();

		return this;
	}
}

DirectionalLight.prototype.isDirectionalLight = true;

export { DirectionalLight };
