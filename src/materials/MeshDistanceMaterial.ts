import { Material } from "./Material";
import { Vector3 } from "../";

/**
 * parameters = {
 *
 *  referencePosition: <float>,
 *  nearDistance: <float>,
 *  farDistance: <float>,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *
 *  map: new Texture( <Image> ),
 *
 *  alphaMap: new Texture( <Image> ),
 *
 *  displacementMap: new Texture( <Image> ),
 *  displacementScale: <float>,
 *  displacementBias: <float>
 *
 * }
 */

class MeshDistanceMaterial extends Material {
	referencePosition: Vector3;
	nearDistance: number;
	farDistance: number;

	constructor() {
		super();

		this.isMeshDistanceMaterial = true;
		this.type = "MeshDistanceMaterial";

		this.referencePosition = new Vector3();
		this.nearDistance = 1;
		this.farDistance = 1000;

		this.skinning = false;
		this.morphTargets = false;

		this.map = null;

		this.alphaMap = null;

		this.displacementMap = null;
		this.displacementScale = 1;
		this.displacementBias = 0;

		this.fog = false;
	}

	copy(source: MeshDistanceMaterial) {
		super.copy(source);

		this.referencePosition.copy(source.referencePosition);
		this.nearDistance = source.nearDistance;
		this.farDistance = source.farDistance;

		this.skinning = source.skinning;
		this.morphTargets = source.morphTargets;

		this.map = source.map;

		this.alphaMap = source.alphaMap;

		this.displacementMap = source.displacementMap;
		this.displacementScale = source.displacementScale;
		this.displacementBias = source.displacementBias;

		return this;
	}
}

export { MeshDistanceMaterial };
