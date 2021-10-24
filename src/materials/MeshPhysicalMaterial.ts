import { Vector2 } from '../math/Vector2';
import { MeshStandardMaterial } from './MeshStandardMaterial';
import { Color } from '../math/Color';
import { MathUtils } from '../math/MathUtils';

/**
 * parameters = {
 *  clearcoat: <float>,
 *  clearcoatMap: new THREE.Texture( <Image> ),
 *  clearcoatRoughness: <float>,
 *  clearcoatRoughnessMap: new THREE.Texture( <Image> ),
 *  clearcoatNormalScale: <Vector2>,
 *  clearcoatNormalMap: new THREE.Texture( <Image> ),
 *
 *  reflectivity: <float>,
 *  ior: <float>,
 *
 *  sheen: <Color>,
 *
 *  transmission: <float>,
 *  transmissionMap: new THREE.Texture( <Image> )
 * }
 */

class MeshPhysicalMaterial extends MeshStandardMaterial {

	transmission: number;
	transmissionMap: any;

	constructor(parameters) {
		super(parameters);

		Object.defineProperty(this, 'isMeshPhysicalMaterial', { value: true });

		this.defines = {
			'STANDARD': '',
			'PHYSICAL': '',
		};

		this.type = 'MeshPhysicalMaterial';

		this.clearcoat = 0.0;
		this.clearcoatMap = null;
		this.clearcoatRoughness = 0.0;
		this.clearcoatRoughnessMap = null;
		this.clearcoatNormalScale = new Vector2(1, 1);
		this.clearcoatNormalMap = null;

		this.reflectivity = 0.5; // maps to F0 = 0.04

		Object.defineProperty(this, 'ior', {
			get: function () {
				return (1 + 0.4 * this.reflectivity) / (1 - 0.4 * this.reflectivity);
			},
			set: function (ior) {
				this.reflectivity = MathUtils.clamp(2.5 * (ior - 1) / (ior + 1), 0, 1);
			},
		});

		this.sheen = null; // null will disable sheen bsdf

		this.transmission = 0.0;
		this.transmissionMap = null;

		this.setValues(parameters);

	}
}

export { MeshPhysicalMaterial };
