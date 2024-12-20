/* eslint-disable no-invalid-this */
import { Loader } from './Loader';
import { Cache } from './Cache';

export class ImageLoader extends Loader {

    constructor(manager?) {
        super(manager);
    }

    load(url, onLoad?, onProgress?, onError?) {
        if (this.path !== undefined) { url = this.path + url; }

        url = this.manager.resolveURL(url);

        // eslint-disable-next-line consistent-this, @typescript-eslint/no-this-alias
        const scope = this;

        const cached = Cache.get(url);

        if (cached !== undefined) {
            scope.manager.itemStart(url);

            setTimeout(() => {
                if (onLoad) { onLoad(cached); }

                scope.manager.itemEnd(url);
            }, 0);

            return cached;
        }

        const image = document.createElementNS(
            'http://www.w3.org/1999/xhtml',
            'img'
        );

        const onImageLoad = function() {
            image.removeEventListener('load', onImageLoad, false);
            image.removeEventListener('error', onImageError, false);

            Cache.add(url, this);

            if (onLoad) { onLoad(this); }

            scope.manager.itemEnd(url);
        };

        const onImageError = function(event) {
            image.removeEventListener('load', onImageLoad, false);
            image.removeEventListener('error', onImageError, false);

            if (onError) { onError(event); }

            scope.manager.itemError(url);
            scope.manager.itemEnd(url);
        };

        image.addEventListener('load', onImageLoad, false);
        image.addEventListener('error', onImageError, false);

        if (url.substr(0, 5) !== 'data:') {
            if (this.crossOrigin !== undefined) { image.setAttribute('crossOrigin', this.crossOrigin); }
        }

        scope.manager.itemStart(url);

        image.setAttribute('src', url);

        return image;
    }

}
