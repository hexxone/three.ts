import {
	Material,
	Object3D,
	WebGLRenderTarget,
	Texture,
	Color,
	FogExp2,
} from "../";
import { Fog } from "./Fog";

class Scene extends Object3D {
	background: WebGLRenderTarget & Texture & Color;
	environment: any;
	fog: Fog | FogExp2;
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

		if (source.background !== null)
			this.background = source.background.clone() as any;
		if (source.environment !== null)
			this.environment = source.environment.clone();
		if (source.fog !== null) this.fog = source.fog.clone();

		if (source.overrideMaterial !== null)
			this.overrideMaterial = source.overrideMaterial.clone();

		this.autoUpdate = source.autoUpdate;
		this.matrixAutoUpdate = source.matrixAutoUpdate;

		return this;
	}

	toJSON(meta) {
		const data = super.toJSON(meta);

		if (this.background !== null)
			data.object.background = this.background.toJSON(meta);
		if (this.environment !== null)
			data.object.environment = this.environment.toJSON(meta);
		if (this.fog !== null) data.object.fog = this.fog.toJSON();

		return data;
	}
}

export { Scene };
