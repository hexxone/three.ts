import { Color } from "../";
import { TFog } from "./TFog";

/**
 * @public
 */
class Fog extends TFog {
	isFog = true;

	constructor(color: Color, near: number, far: number) {
		super();

		this.name = "";
		this.color = new Color(color);

		this.near = near !== undefined ? near : 1;
		this.far = far !== undefined ? far : 1000;
	}

	clone() {
		return new Fog(this.color, this.near, this.far);
	}
}

export { Fog };
