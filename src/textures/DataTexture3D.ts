import { Texture } from "..";
import { ClampToEdgeWrapping, NearestFilter } from "..";

/**
 * @public
 */
class DataTexture3D extends Texture {
	wrapR: number;

	constructor(data = null, width = 1, height = 1, depth = 1) {
		// We're going to add .setXXX() methods for setting properties later.
		// Users can still set in DataTexture3D directly.
		//
		//	const texture = new DataTexture3D( data, width, height, depth );
		// 	texture.anisotropy = 16;
		//
		// See #14839
		super(null);

		this.isDataTexture3D = true;

		this.image = { data, width, height, depth };

		this.magFilter = NearestFilter;
		this.minFilter = NearestFilter;

		this.wrapR = ClampToEdgeWrapping;

		this.generateMipmaps = false;
		this.flipY = false;

		this.needsUpdate = true;
	}
}

export { DataTexture3D };
