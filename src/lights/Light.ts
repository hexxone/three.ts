import { Color, Object3D } from "../";
import { LightShadow } from "./LightShadow";

class Light extends Object3D {
	color: Color;
	intensity: number;
	groundColor: any;
	distance: any;
	angle: any;
	decay: any;
	penumbra: any;
	shadow: LightShadow;

	width: number;
	height: number;

	isLightProbe: boolean;
	isAmbientLight: boolean;
	isAmbientLightProbe: boolean;
	isDirectionalLight: boolean;
	isSpotLight: boolean;
	isRectAreaLight: boolean;
	isPointLight: boolean;
	isHemisphereLight: boolean;
	isHemisphereLightProbe: boolean;

	constructor(color, intensity = 1) {
		super();

		this.isLight = true;
		this.type = "Light";

		this.color = new Color(color);
		this.intensity = intensity;
	}

	copy(source: Light) {
		super.copy(source);

		this.color.copy(source.color);
		this.intensity = source.intensity;

		return this;
	}

	toJSON(meta) {
		const data = super.toJSON(meta);

		data.object.color = this.color.getHex();
		data.object.intensity = this.intensity;

		if (this.groundColor !== undefined)
			data.object.groundColor = this.groundColor.getHex();

		if (this.distance !== undefined) data.object.distance = this.distance;
		if (this.angle !== undefined) data.object.angle = this.angle;
		if (this.decay !== undefined) data.object.decay = this.decay;
		if (this.penumbra !== undefined) data.object.penumbra = this.penumbra;

		if (this.shadow !== undefined) data.object.shadow = this.shadow.toJSON();

		return data;
	}
}

export { Light };
