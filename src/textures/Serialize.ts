import { DataTexture } from './DataTexture';
import { ImageUtils } from '../extras/ImageUtils';

export function serializeImage(image: HTMLImageElement | HTMLCanvasElement | ImageBitmap | DataTexture) {
    if (
        (typeof HTMLImageElement !== 'undefined'
            && image instanceof HTMLImageElement)
        || (typeof HTMLCanvasElement !== 'undefined'
            && image instanceof HTMLCanvasElement)
        || (typeof ImageBitmap !== 'undefined' && image instanceof ImageBitmap)
    ) {
        // default images

        return ImageUtils.getDataURL(image);
    }

    if (image instanceof DataTexture) {
        // images of DataTexture

        return {
            data: Array.prototype.slice.call(image.image.data),
            width: image.image.width,
            height: image.image.height,
            type: image.image.data.constructor.name
        };
    }

    console.warn('Texture: Unable to serialize Texture.');

    return {};
}
