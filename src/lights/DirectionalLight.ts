import { DefaultUp, Object3D } from "../core/Object3D";
import { DirectionalLightShadow } from "./DirectionalLightShadow";
import { Light } from "./Light";


class DirectionalLight extends Light {
	target: Object3D;

	constructor(color, intensity) {
		super(color, intensity);

		this.isDirectionalLight = true;
		this.type = "DirectionalLight";

		this.position.copy(DefaultUp);
		this.updateMatrix();

		this.target = new Object3D();

		this.shadow = new DirectionalLightShadow();
	}

	copy(source: DirectionalLight) {
		super.copy(source);

		this.target = source.target.clone();
		this.shadow = source.shadow.clone();

		return this;
	}
}

export { DirectionalLight };
