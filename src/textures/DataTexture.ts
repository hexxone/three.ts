import { Texture } from "..";
import { NearestFilter } from "..";

class DataTexture extends Texture {
	isDataTexture: boolean;

	constructor(
		data?: ArrayBufferLike,
		width?,
		height?,
		format?,
		type?,
		mapping?,
		wrapS?,
		wrapT?,
		magFilter?,
		minFilter?,
		anisotropy?,
		encoding?
	) {
		super(
			null,
			mapping,
			wrapS,
			wrapT,
			magFilter,
			minFilter,
			format,
			type,
			anisotropy,
			encoding
		);

		this.isDataTexture = true;

		this.image = { data: data || null, width: width || 1, height: height || 1 };

		this.magFilter = magFilter !== undefined ? magFilter : NearestFilter;
		this.minFilter = minFilter !== undefined ? minFilter : NearestFilter;

		this.generateMipmaps = false;
		this.flipY = false;
		this.unpackAlignment = 1;

		this.needsUpdate = true;
	}
}

export { DataTexture };
