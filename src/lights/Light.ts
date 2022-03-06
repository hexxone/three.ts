import { Color, Object3D, LightShadow } from "..";

/**
 * @public
 */
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

	fromJSON(json) {
		this.intensity = json.intensity; // TODO: Move this bit to Light.fromJSON();

		return this;
	}
}

export { Light };
