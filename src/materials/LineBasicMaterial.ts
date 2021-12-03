import { Material } from "./Material";
import { Color } from "../";

/**
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *
 *  linewidth: <float>,
 *  linecap: "round",
 *  linejoin: "round"
 * }
 */

class LineBasicMaterial extends Material {
	linecap: string;
	linejoin: string;

	constructor() {
		super();

		this.isLineBasicMaterial = true;
		this.type = "LineBasicMaterial";

		this.color = new Color(0xffffff);

		this.linewidth = 1;
		this.linecap = "round";
		this.linejoin = "round";

		this.morphTargets = false;
	}

	copy(source: LineBasicMaterial) {
		super.copy(source);

		this.color.copy(source.color);

		this.linewidth = source.linewidth;
		this.linecap = source.linecap;
		this.linejoin = source.linejoin;

		this.morphTargets = source.morphTargets;

		return this;
	}
}

export { LineBasicMaterial };
