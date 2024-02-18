import { IImage, Texture } from './Texture';

/**
 * @public
 */
class CompressedTexture extends Texture {

    images: IImage[];

    constructor(
        mipmaps?,
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

        this.isCompressedTexture = true;
        this.image = {
            width,
            height
        };
        this.mipmaps = mipmaps;

        // no flipping for cube textures
        // (also flipping doesn't work for compressed textures )

        this.flipY = false;

        // can't generate mipmaps for compressed textures
        // mips must be embedded in DDS files

        this.generateMipmaps = false;
    }

}

export { CompressedTexture };
