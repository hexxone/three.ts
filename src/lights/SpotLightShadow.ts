import { LightShadow } from './LightShadow';
import { MathUtils } from '../math/MathUtils';
import { PerspectiveCamera } from '../cameras/PerspectiveCamera';

class SpotLightShadow extends LightShadow {
	constructor() {
		super( new PerspectiveCamera( 50, 1, 0.5, 500 ) );

		this.focus = 1;
	}

	updateMatrices( light ) {
		const camera = this.camera;

		const fov = MathUtils.RAD2DEG * 2 * light.angle * this.focus;
		const aspect = this.mapSize.width / this.mapSize.height;
		const far = light.distance || camera.far;

		if ( fov !== camera.fov || aspect !== camera.aspect || far !== camera.far ) {
			camera.fov = fov;
			camera.aspect = aspect;
			camera.far = far;
			camera.updateProjectionMatrix();
		}

		super.updateMatrices( light );
	}
}

SpotLightShadow.prototype.isSpotLightShadow = true;

export { SpotLightShadow };
