import { ClampToEdgeWrapping,
    LinearFilter,
    LinearMipmapLinearFilter,
    RGBAFormat,
    UnsignedByteType,
    LinearEncoding } from '../constants';
import { Texture } from './Texture';

/**
 * @public
 */
class CanvasTexture extends Texture {

    constructor(
        canvas = Texture.DEFAULT_IMAGE,
        mapping = Texture.DEFAULT_MAPPING,
        wrapS = ClampToEdgeWrapping,
        wrapT = ClampToEdgeWrapping,
        magFilter = LinearFilter,
        minFilter = LinearMipmapLinearFilter,
        format = RGBAFormat,
        type = UnsignedByteType,
        anisotropy = 1,
        encoding = LinearEncoding
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
            anisotropy,
            encoding
        );

        this.isCanvasTexture = true;

        this.needsUpdate = true;
    }

}

export { CanvasTexture };
