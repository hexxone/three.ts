import { ClampToEdgeWrapping, NearestFilter } from '../constants';
import { Texture } from './Texture';

/**
 * @public
 */
class DataTexture2DArray extends Texture {

    wrapR: number;

    constructor(data = null, width = 1, height = 1, depth = 1) {
        super(null);

        this.isDataTexture2DArray = true;

        this.image = {
            data,
            width,
            height,
            depth
        };

        this.magFilter = NearestFilter;
        this.minFilter = NearestFilter;

        this.wrapR = ClampToEdgeWrapping;

        this.generateMipmaps = false;
        this.flipY = false;

        this.needsUpdate = true;
    }

}

export { DataTexture2DArray };
