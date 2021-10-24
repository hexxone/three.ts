import { Light } from './Light';
import { Color } from '../math/Color';
import { Object3D } from '../core/Object3D';

class HemisphereLight extends Light {
	constructor( skyColor, groundColor, intensity ) {
		super( skyColor, intensity );

		this.type = 'HemisphereLight';

		this.position.copy( Object3D.DefaultUp );
		this.updateMatrix();

		this.groundColor = new Color( groundColor );
	}

	copy( source ) {
		Light.prototype.copy.call( this, source );

		this.groundColor.copy( source.groundColor );

		return this;
	}
}

HemisphereLight.prototype.isHemisphereLight = true;

export { HemisphereLight };
