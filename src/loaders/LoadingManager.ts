/**
 * @public
 */
export class LoadingManager {

    onStart: any;
    onLoad: any;
    onProgress: any;
    onError: any;
    isLoading = false;
    itemsLoaded = 0;
    itemsTotal = 0;
    urlModifier = undefined;
    handlers = [];

    constructor(onLoad?, onProgress?, onError?) {
        // Refer to #5689 for the reason why we don't set .onStart
        // in the constructor
        this.onStart = undefined;
        this.onLoad = onLoad;
        this.onProgress = onProgress;
        this.onError = onError;
    }

    itemStart(url) {
        this.itemsTotal++;

        if (this.isLoading === false) {
            if (this.onStart !== undefined) {
                this.onStart(url, this.itemsLoaded, this.itemsTotal);
            }
        }

        this.isLoading = true;
    }

    itemEnd(url) {
        this.itemsLoaded++;

        if (this.onProgress !== undefined) {
            this.onProgress(url, this.itemsLoaded, this.itemsTotal);
        }

        if (this.itemsLoaded === this.itemsTotal) {
            this.isLoading = false;

            if (this.onLoad !== undefined) {
                this.onLoad();
            }
        }
    }

    itemError(url) {
        if (this.onError !== undefined) {
            this.onError(url);
        }
    }

    resolveURL(url) {
        if (this.urlModifier) {
            return this.urlModifier(url);
        }

        return url;
    }

    setURLModifier(transform) {
        this.urlModifier = transform;

        return this;
    }

    addHandler(regex, loader) {
        this.handlers.push(regex, loader);

        return this;
    }

    removeHandler(regex) {
        const index = this.handlers.indexOf(regex);

        if (index !== -1) {
            this.handlers.splice(index, 2);
        }

        return this;
    }

    getHandler(file) {
        for (let i = 0, l = this.handlers.length; i < l; i += 2) {
            const regex = this.handlers[i];
            const loader = this.handlers[i + 1];

            if (regex.global) { regex.lastIndex = 0; } // see #17920

            if (regex.test(file)) {
                return loader;
            }
        }

        return null;
    }

}

export const DefaultLoadingManager = new LoadingManager();
