import { DefaultUp, Object3D } from '../core/Object3D';
import { Light } from './Light';
import { SpotLightShadow } from './SpotLightShadow';

class SpotLight extends Light {

    target: Object3D;

    constructor(
        color,
        intensity,
        distance = 0,
        angle = Math.PI / 3,
        penumbra = 0,
        decay = 1
    ) {
        super(color, intensity);

        this.isSpotLight = true;

        this.type = 'SpotLight';

        this.position.copy(DefaultUp);
        this.updateMatrix();

        this.target = new Object3D();

        this.distance = distance;
        this.angle = angle;
        this.penumbra = penumbra;
        this.decay = decay; // for physically correct lights, should be 2.

        this.shadow = new SpotLightShadow();
    }

    get power() {
        // intensity = power per solid angle.
        // ref: equation (17) from https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
        return this.intensity * Math.PI;
    }

    set power(power) {
        // intensity = power per solid angle.
        // ref: equation (17) from https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
        this.intensity = power / Math.PI;
    }

    copy(source: SpotLight) {
        super.copy(source);

        this.distance = source.distance;
        this.angle = source.angle;
        this.penumbra = source.penumbra;
        this.decay = source.decay;

        this.target = source.target.clone();

        this.shadow = source.shadow.clone();

        return this;
    }

}

export { SpotLight };
