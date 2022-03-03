import {
	Material,
	Object3D,
	WebGLRenderTarget,
	Texture,
	Color,
	TFog,
} from "../";

/**
 * @public
 */
class Scene extends Object3D {
	background: WebGLRenderTarget | Texture | Color;
	environment: Texture;
	fog: TFog;
	overrideMaterial: Material;

	constructor() {
		super();

		this.isScene = true;
		this.type = "Scene";

		this.background = null;
		this.environment = null;
		this.fog = null;

		this.overrideMaterial = null;

		this.autoUpdate = true; // checked by the renderer

		if (
			typeof window !== "undefined" &&
			typeof window["__THREE_DEVTOOLS__"] !== "undefined"
		) {
			window["__THREE_DEVTOOLS__"].dispatchEvent(
				new CustomEvent("observe", { detail: this })
			); // eslint-disable-line no-undef
		}
	}

	copy(source: Scene, recursive: boolean) {
		super.copy(source, recursive);

		if (source.background !== null) this.background = source.background.clone();
		if (source.environment !== null)
			this.environment = source.environment.clone();
		if (source.fog !== null) this.fog = source.fog.clone();

		if (source.overrideMaterial !== null)
			this.overrideMaterial = source.overrideMaterial.clone();

		this.autoUpdate = source.autoUpdate;
		this.matrixAutoUpdate = source.matrixAutoUpdate;

		return this;
	}
}

export { Scene };
