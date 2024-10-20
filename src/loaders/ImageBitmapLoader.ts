import { Loader } from './Loader';
import { Cache } from './Cache';

function ImageBitmapLoader(manager) {
    if (typeof createImageBitmap === 'undefined') {
        console.warn('ImageBitmapLoader: createImageBitmap() not supported.');
    }

    if (typeof fetch === 'undefined') {
        console.warn('ImageBitmapLoader: fetch() not supported.');
    }

    Loader.call(this, manager);

    this.options = {
        premultiplyAlpha: 'none'
    };
}

ImageBitmapLoader.prototype = Object.assign(Object.create(Loader.prototype), {
    constructor: ImageBitmapLoader,

    isImageBitmapLoader: true,

    setOptions: function setOptions(options) {
        this.options = options;

        return this;
    },

    load(url, onLoad, onProgress, onError) {
        if (url === undefined) { url = ''; }

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

        const fetchOptions = {} as any;

        fetchOptions.credentials
            = this.crossOrigin === 'anonymous' ? 'same-origin' : 'include';
        fetchOptions.headers = this.requestHeader;

        fetch(url, fetchOptions)
            .then((res) => {
                return res.blob();
            })
            .then((blob) => {
                return createImageBitmap(
                    blob,
                    Object.assign(scope.options, {
                        colorSpaceConversion: 'none'
                    })
                );
            })
            .then((imageBitmap) => {
                Cache.add(url, imageBitmap);

                if (onLoad) { onLoad(imageBitmap); }

                scope.manager.itemEnd(url);
            })
            .catch((e) => {
                if (onError) { onError(e); }

                scope.manager.itemError(url);
                scope.manager.itemEnd(url);
            });

        scope.manager.itemStart(url);
    }
});

export { ImageBitmapLoader };
