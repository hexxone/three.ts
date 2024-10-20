import { CubeReflectionMapping,
    CubeRefractionMapping,
    EquirectangularReflectionMapping,
    EquirectangularRefractionMapping } from '../../constants';
import { PMREMGenerator } from '../../extras/PMREMGenerator';
import { Texture } from '../../textures/Texture';
import { WebGLRenderer } from '../WebGLRenderer';

/**
 * @public
 */
class WebGLCubeUVMaps {

    _renderer: WebGLRenderer;

    cubeUVmaps = new WeakMap();
    pmremGenerator: PMREMGenerator;

    constructor(renderer: WebGLRenderer) {
        this._renderer = renderer;
    }

    get(texture: Texture) {
        if (
            texture
            && texture.isTexture
            && texture.isRenderTargetTexture === false
        ) {
            const { mapping } = texture;

            const isEquirectMap
                = mapping === EquirectangularReflectionMapping
                || mapping === EquirectangularRefractionMapping;
            const isCubeMap
                = mapping === CubeReflectionMapping
                || mapping === CubeRefractionMapping;

            if (isEquirectMap || isCubeMap) {
                // equirect/cube map to cubeUV conversion

                if (this.cubeUVmaps.has(texture)) {
                    return this.cubeUVmaps.get(texture).texture;
                }
                const { image } = texture;

                if (
                    (isEquirectMap && image && image.height > 0)
                        || (isCubeMap
                            && image
                            && this.isCubeTextureComplete(image))
                ) {
                    const currentRenderTarget
                            = this._renderer.getRenderTarget();

                    if (this.pmremGenerator === null) {
                        this.pmremGenerator = new PMREMGenerator(
                            this._renderer
                        );
                    }

                    const renderTarget = isEquirectMap
                        ? this.pmremGenerator.fromEquirectangular(texture)
                        : this.pmremGenerator.fromCubemap(texture);

                    this.cubeUVmaps.set(texture, renderTarget);

                    this._renderer.setRenderTarget(currentRenderTarget);

                    texture.addEventListener('dispose', (e) => { return this.onTextureDispose(e); }
                    );

                    return renderTarget.texture;
                }
                // image not yet ready. try the conversion next frame

                return null;
            }
        }

        return texture;
    }

    dispose() {
        this.cubeUVmaps = new WeakMap();

        if (this.pmremGenerator !== null) {
            this.pmremGenerator.dispose();
            this.pmremGenerator = null;
        }
    }

    isCubeTextureComplete(image) {
        let count = 0;
        const length = 6;

        for (let i = 0; i < length; i++) {
            if (image[i] !== undefined) { count++; }
        }

        return count === length;
    }

    onTextureDispose(event) {
        const texture = event.target;

        texture.removeEventListener('dispose', this.onTextureDispose);

        const cubemapUV = this.cubeUVmaps.get(texture);

        if (cubemapUV !== undefined) {
            this.cubeUVmaps.delete(texture);
            cubemapUV.dispose();
        }
    }

}

export { WebGLCubeUVMaps };
