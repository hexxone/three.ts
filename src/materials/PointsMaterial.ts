import { Material } from "./Material";
import { Color } from "../";

/**
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *  map: new Texture( <Image> ),
 *  alphaMap: new Texture( <Image> ),
 *
 *  size: <float>,
 *  sizeAttenuation: <bool>
 *
 *  morphTargets: <bool>
 * }
 */
class PointsMaterial extends Material {
	constructor() {
		super();

		this.isPointsMaterial = true;
		this.type = "PointsMaterial";

		this.color = new Color(0xffffff);

		this.map = null;

		this.alphaMap = null;

		this.size = 1;
		this.sizeAttenuation = true;

		this.morphTargets = false;
	}

	copy(source: PointsMaterial) {
		super.copy(source);

		this.color.copy(source.color);

		this.map = source.map;

		this.alphaMap = source.alphaMap;

		this.size = source.size;
		this.sizeAttenuation = source.sizeAttenuation;

		this.morphTargets = source.morphTargets;

		return this;
	}
}

export { PointsMaterial };
