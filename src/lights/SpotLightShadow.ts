import { PerspectiveCamera } from '../cameras/PerspectiveCamera';
import { RAD2DEG } from '../math/MathUtils';
import { Light } from './Light';
import { LightShadow } from './LightShadow';

class SpotLightShadow extends LightShadow {

    focus: number;

    constructor() {
        super(new PerspectiveCamera(50, 1, 0.5, 500));

        this.isSpotLightShadow = true;

        this.focus = 1;
    }

    updateMatrices(light: Light) {
        const camera = this.camera as PerspectiveCamera;

        const fov = RAD2DEG * 2 * light.angle * this.focus;
        const aspect = this.mapSize.width / this.mapSize.height;
        const far = light.distance || camera.far;

        if (
            fov !== camera.fov
            || aspect !== camera.aspect
            || far !== camera.far
        ) {
            camera.fov = fov;
            camera.aspect = aspect;
            camera.far = far;
            camera.updateProjectionMatrix();
        }

        super.updateMatrices(light);
    }

}

export { SpotLightShadow };
