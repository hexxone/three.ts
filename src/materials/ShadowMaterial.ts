import { Material } from './Material';
import { Color } from '../';

/**
 * parameters = {
 *  color: <THREE.Color>
 * }
 */

class ShadowMaterial extends Material {
	constructor( parameters ) {
		super();

		this.isShadowMaterial = true;
		this.type = 'ShadowMaterial';

		this.color = new Color( 0x000000 );
		this.transparent = true;

		this.setValues( parameters );
	}

	copy( source: ShadowMaterial ) {
		super.copy( source );

		this.color.copy( source.color );

		return this;
	}
}

export { ShadowMaterial };
