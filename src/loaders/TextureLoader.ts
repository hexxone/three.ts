import { RGBAFormat, RGBFormat } from '../constants';
import { Texture } from '../textures/Texture';
import { ImageLoader } from './ImageLoader';
import { Loader } from './Loader';

class TextureLoader extends Loader {

    constructor() {
        super();
    }

    load(url: string, onLoad?: (t: Texture) => void, onProgress?, onError?) {
        const texture = new Texture();
        const loader = new ImageLoader(this.manager);

        loader.setCrossOrigin(this.crossOrigin);
        loader.setPath(this.path);

        loader.load(
            url,
            (image) => {
                texture.image = image;

                // JPEGs can't have an alpha channel, so memory can be saved by storing them as RGB.
                const isJPEG
                    = url.search(/\.jpe?g($|\?)/i) > 0
                    || url.search(/^data:image\/jpeg/) === 0;

                texture.format = isJPEG ? RGBFormat : RGBAFormat;
                texture.needsUpdate = true;

                if (onLoad !== undefined) {
                    onLoad(texture);
                }
            },
            onProgress,
            onError
        );

        return texture;
    }

}

export { TextureLoader };
