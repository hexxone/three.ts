import { SphericalHarmonics3 } from '../';
import { Light } from './Light';

class LightProbe extends Light {
	sh: SphericalHarmonics3;

	constructor( sh = new SphericalHarmonics3(), intensity = 1 ) {
		super( undefined, intensity );

		this.isLightProbe = true;

		this.sh = sh;
	}

	copy( source: LightProbe ) {
		super.copy( source );

		this.sh.copy( source.sh );

		return this;
	}

	fromJSON( json ) {
		this.intensity = json.intensity; // TODO: Move this bit to Light.fromJSON();
		this.sh.fromArray( json.sh );

		return this;
	}

	toJSON( meta ) {
		const data = super.toJSON( meta );

		data.object.sh = this.sh.toArray();

		return data;
	}
}

export { LightProbe };
