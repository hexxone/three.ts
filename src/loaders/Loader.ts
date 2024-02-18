import { DefaultLoadingManager, LoadingManager } from './LoadingManager';

/**
 * @public
 */
export class Loader {

    manager: LoadingManager;
    crossOrigin: string;
    withCredentials: boolean;
    path: string;
    resourcePath: string;
    requestHeader: any;

    constructor(manager?: LoadingManager) {
        this.manager = manager !== undefined ? manager : DefaultLoadingManager;

        this.crossOrigin = 'anonymous';
        this.withCredentials = false;
        this.path = '';
        this.resourcePath = '';
        this.requestHeader = {};
    }

    /**
     * functions needs to be overwritten by each loader
     * @param url file source
     * @param onLoad callback
     * @param onProgress callback
     * @param onError callback
     * @returns {void}
     * @public
     */
    load(url: string, onLoad?, onProgress?, onError?) {
        const e = 'Loader.load not implemented!';

        console.error(e);
        onError(e);
        throw e;
    }

    loadAsync(url, onProgress?) {
        // eslint-disable-next-line consistent-this, @typescript-eslint/no-this-alias
        const scope = this;

        return new Promise((resolve, reject) => {
            scope.load(url, resolve, onProgress, reject);
        });
    }

    parse(_data, _bool?): any {}

    setCrossOrigin(crossOrigin) {
        this.crossOrigin = crossOrigin;

        return this;
    }

    setWithCredentials(value) {
        this.withCredentials = value;

        return this;
    }

    setPath(path) {
        this.path = path;

        return this;
    }

    setResourcePath(resourcePath) {
        this.resourcePath = resourcePath;

        return this;
    }

    setRequestHeader(requestHeader) {
        this.requestHeader = requestHeader;

        return this;
    }

}
