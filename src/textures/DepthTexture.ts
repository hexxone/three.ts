import { DepthFormat,
    DepthStencilFormat,
    NearestFilter,
    UnsignedInt248Type,
    UnsignedShortType } from '../constants';
import { Texture } from './Texture';

/**
 * @public
 */
class DepthTexture extends Texture {

    constructor(
        width,
        height,
        type,
        mapping,
        wrapS,
        wrapT,
        magFilter,
        minFilter,
        anisotropy,
        format
    ) {
        format = format !== undefined ? format : DepthFormat;
        if (format !== DepthFormat && format !== DepthStencilFormat) {
            throw new Error(
                'DepthTexture format must be either DepthFormat or DepthStencilFormat'
            );
        }

        if (type === undefined && format === DepthFormat) { type = UnsignedShortType; }
        if (type === undefined && format === DepthStencilFormat) { type = UnsignedInt248Type; }
        super(
            null,
            mapping,
            wrapS,
            wrapT,
            magFilter,
            minFilter,
            format,
            type,
            anisotropy
        );

        this.isDepthTexture = true;

        this.image = {
            width,
            height
        };

        this.magFilter = magFilter !== undefined ? magFilter : NearestFilter;
        this.minFilter = minFilter !== undefined ? minFilter : NearestFilter;

        this.flipY = false;
        this.generateMipmaps = false;
    }

}

export { DepthTexture };
