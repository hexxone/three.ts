import { Texture } from "..";

/**
 * @public
 */
class CanvasTexture extends Texture {
	constructor(
		canvas,
		mapping,
		wrapS,
		wrapT,
		magFilter,
		minFilter,
		format,
		type,
		anisotropy
	) {
		super(
			canvas,
			mapping,
			wrapS,
			wrapT,
			magFilter,
			minFilter,
			format,
			type,
			anisotropy
		);

		this.isCanvasTexture = true;

		this.needsUpdate = true;
	}
}

export { CanvasTexture };
