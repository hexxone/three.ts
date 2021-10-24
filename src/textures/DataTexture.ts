import { Texture } from './Texture';
import { NearestFilter } from '../constants';

class DataTexture extends Texture {
	image: { data: any; width: any; height: any; };
	magFilter: any;
	minFilter: any;
	generateMipmaps: boolean;
	flipY: boolean;
	unpackAlignment: number;
	isDataTexture: boolean;

	constructor( data, width, height, format?, type?, mapping?, wrapS?, wrapT?, magFilter?, minFilter?, anisotropy?, encoding? ) {
		super( null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding );

		this.image = { data: data || null, width: width || 1, height: height || 1 };

		this.magFilter = magFilter !== undefined ? magFilter : NearestFilter;
		this.minFilter = minFilter !== undefined ? minFilter : NearestFilter;

		this.generateMipmaps = false;
		this.flipY = false;
		this.unpackAlignment = 1;

		this.needsUpdate = true;
	}
}

DataTexture.prototype.isDataTexture = true;

export { DataTexture };
