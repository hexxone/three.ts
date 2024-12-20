import { Font } from '../extras/core/Font';
import { FileLoader } from './FileLoader';
import { Loader } from './Loader';

class FontLoader extends Loader {

    constructor(manager?) {
        super(manager);
    }

    load(url, onLoad?, onProgress?, onError?) {
        // eslint-disable-next-line consistent-this, @typescript-eslint/no-this-alias
        const scope = this;

        const loader = new FileLoader(this.manager);

        loader.setPath(this.path);
        loader.setRequestHeader(this.requestHeader);
        loader.setWithCredentials(scope.withCredentials);
        loader.load(
            url,
            (text) => {
                let json;

                try {
                    json = JSON.parse(text);
                } catch (e) {
                    console.warn(
                        'FontLoader: typeface.js support is being deprecated. Use typeface.json instead.'
                    );
                    json = JSON.parse(text.substring(65, text.length - 2));
                }

                const font = scope.parse(json);

                if (onLoad) { onLoad(font); }
            },
            onProgress,
            onError
        );
    }

    parse(json) {
        return new Font(json);
    }

}

export { FontLoader };
