
/**
 * parameters = {
 *  color: <Color>
 * }
 */

import { Color } from "../math/Color";
import { Material } from "./Material";

class ShadowMaterial extends Material {
	constructor() {
		super();

		this.isShadowMaterial = true;
		this.type = "ShadowMaterial";

		this.color = new Color(0x000000);
		this.transparent = true;
	}

	copy(source: ShadowMaterial) {
		super.copy(source);

		this.color.copy(source.color);

		return this;
	}
}

export { ShadowMaterial };
