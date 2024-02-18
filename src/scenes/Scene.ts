import { ensureInit } from '../ensureInit';
import { Object3D } from '../core/Object3D';
import { Material } from '../materials/Material';
import { Color } from '../math/Color';
import { WebGLRenderTarget } from '../renderers/WebGLRenderTarget';
import { Texture } from '../textures/Texture';
import { TFog } from './TFog';

/**
 * @public
 */
class Scene extends Object3D {

    background: WebGLRenderTarget | Texture | Color;
    environment: Texture;
    fog: TFog;
    overrideMaterial: Material;

    constructor() {
        super();
        ensureInit();

        this.isScene = true;
        this.type = 'Scene';

        this.background = null;
        this.environment = null;
        this.fog = null;

        this.overrideMaterial = null;

        this.autoUpdate = true; // checked by the renderer

        if (typeof __THREE_DEVTOOLS__ !== 'undefined') {
            __THREE_DEVTOOLS__.dispatchEvent(
                new CustomEvent('observe', {
                    detail: this
                })
            );
        }
    }

    copy(source: Scene, recursive: boolean) {
        super.copy(source, recursive);

        if (source.background !== null) { this.background = source.background.clone(); }
        if (source.environment !== null) { this.environment = source.environment.clone(); }
        if (source.fog !== null) { this.fog = source.fog.clone(); }

        if (source.overrideMaterial !== null) { this.overrideMaterial = source.overrideMaterial.clone(); }

        this.autoUpdate = source.autoUpdate;
        this.matrixAutoUpdate = source.matrixAutoUpdate;

        return this;
    }

}

export { Scene };
