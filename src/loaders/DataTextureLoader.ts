/**
 * Abstract Base class to load generic binary textures formats (rgbe, hdr, ...)
 *
 * Sub classes have to implement the parse() method which will be used in load().
 */

import { ClampToEdgeWrapping,
    LinearFilter,
    LinearMipmapLinearFilter } from '../constants';
import { DataTexture } from '../textures/DataTexture';
import { FileLoader } from './FileLoader';
import { Loader } from './Loader';

// TODO MAKE CLASS
function DataTextureLoader(manager) {
    Loader.call(this, manager);
}

DataTextureLoader.prototype = Object.assign(Object.create(Loader.prototype), {
    constructor: DataTextureLoader,

    load(url, onLoad, onProgress, onError) {
        // eslint-disable-next-line consistent-this, @typescript-eslint/no-this-alias
        const scope = this;

        const texture = new DataTexture();

        const loader = new FileLoader(this.manager);

        loader.setResponseType('arraybuffer');
        loader.setRequestHeader(this.requestHeader);
        loader.setPath(this.path);
        loader.setWithCredentials(scope.withCredentials);
        loader.load(
            url,
            (buffer) => {
                const texData = scope.parse(buffer);

                if (!texData) { return; }

                if (texData.image !== undefined) {
                    texture.image = texData.image;
                } else if (texData.data !== undefined) {
                    texture.image.width = texData.width;
                    texture.image.height = texData.height;
                    texture.image.data = texData.data;
                }

                texture.wrapS
                    = texData.wrapS !== undefined
                        ? texData.wrapS
                        : ClampToEdgeWrapping;
                texture.wrapT
                    = texData.wrapT !== undefined
                        ? texData.wrapT
                        : ClampToEdgeWrapping;

                texture.magFilter
                    = texData.magFilter !== undefined
                        ? texData.magFilter
                        : LinearFilter;
                texture.minFilter
                    = texData.minFilter !== undefined
                        ? texData.minFilter
                        : LinearFilter;

                texture.anisotropy
                    = texData.anisotropy !== undefined ? texData.anisotropy : 1;

                if (texData.encoding !== undefined) {
                    texture.encoding = texData.encoding;
                }

                if (texData.flipY !== undefined) {
                    texture.flipY = texData.flipY;
                }

                if (texData.format !== undefined) {
                    texture.format = texData.format;
                }

                if (texData.type !== undefined) {
                    texture.type = texData.type;
                }

                if (texData.mipmaps !== undefined) {
                    texture.mipmaps = texData.mipmaps;
                    texture.minFilter = LinearMipmapLinearFilter; // presumably...
                }

                if (texData.mipmapCount === 1) {
                    texture.minFilter = LinearFilter;
                }

                texture.needsUpdate = true;

                if (onLoad) { onLoad(texture, texData); }
            },
            onProgress,
            onError
        );

        return texture;
    }
});

export { DataTextureLoader };
