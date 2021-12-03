import { Color, DefaultUp, Light } from '../';

class HemisphereLight extends Light {
	constructor( skyColor, groundColor, intensity ) {
		super( skyColor, intensity );

		this.isHemisphereLight = true;
		this.type = 'HemisphereLight';

		this.position.copy( DefaultUp );
		this.updateMatrix();

		this.groundColor = new Color( groundColor );
	}

	copy( source: HemisphereLight ) {
		super.copy( source );

		this.groundColor.copy( source.groundColor );

		return this;
	}
}

export { HemisphereLight };
