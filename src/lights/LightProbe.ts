import { SphericalHarmonics3 } from '../math/SphericalHarmonics3';
import { Light } from './Light';

class LightProbe extends Light {

    sh: SphericalHarmonics3;

    constructor(sh = new SphericalHarmonics3(), intensity = 1) {
        super(undefined, intensity);

        this.isLightProbe = true;

        this.sh = sh;
    }

    copy(source: LightProbe) {
        super.copy(source);

        this.sh.copy(source.sh);

        return this;
    }

    fromJSON(json) {
        super.fromJSON(json);

        this.sh.fromArray(json.sh);

        return this;
    }

}

export { LightProbe };
