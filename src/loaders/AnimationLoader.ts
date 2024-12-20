import { AnimationClip } from '../animation/AnimationClip';
import { FileLoader } from './FileLoader';
import { Loader } from './Loader';

class AnimationLoader extends Loader {

    constructor(manager) {
        super(manager);
    }

    load(url, onLoad, onProgress, onError) {
        // eslint-disable-next-line consistent-this, @typescript-eslint/no-this-alias
        const scope = this;

        const loader = new FileLoader(this.manager);

        loader.setPath(this.path);
        loader.setRequestHeader(this.requestHeader);
        loader.setWithCredentials(this.withCredentials);
        loader.load(
            url,
            (text) => {
                try {
                    onLoad(scope.parse(JSON.parse(text)));
                } catch (e) {
                    if (onError) {
                        onError(e);
                    } else {
                        console.error(e);
                    }

                    scope.manager.itemError(url);
                }
            },
            onProgress,
            onError
        );
    }

    parse(json) {
        const animations = [];

        for (let i = 0; i < json.length; i++) {
            const clip = AnimationClip.parse(json[i]);

            animations.push(clip);
        }

        return animations;
    }

}

export { AnimationLoader };
