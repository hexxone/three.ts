/**
 * parameters = {
 *
 *  opacity: <float>,
 *
 *  map: new Texture( <Image> ),
 *
 *  alphaMap: new Texture( <Image> ),
 *
 *  displacementMap: new Texture( <Image> ),
 *  displacementScale: <float>,
 *  displacementBias: <float>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>
 * }
 */

import { BasicDepthPacking } from '../constants';
import { Material } from './Material';

class MeshDepthMaterial extends Material {

    depthPacking: number;

    constructor() {
        super();

        this.isMeshDepthMaterial = true;
        this.type = 'MeshDepthMaterial';

        this.depthPacking = BasicDepthPacking;

        this.skinning = false;
        this.morphTargets = false;

        this.map = null;

        this.alphaMap = null;

        this.displacementMap = null;
        this.displacementScale = 1;
        this.displacementBias = 0;

        this.wireframe = false;
        this.wireframeLinewidth = 1;

        this.fog = false;
    }

    copy(source: MeshDepthMaterial) {
        super.copy(source);

        this.depthPacking = source.depthPacking;

        this.skinning = source.skinning;
        this.morphTargets = source.morphTargets;

        this.map = source.map;

        this.alphaMap = source.alphaMap;

        this.displacementMap = source.displacementMap;
        this.displacementScale = source.displacementScale;
        this.displacementBias = source.displacementBias;

        this.wireframe = source.wireframe;
        this.wireframeLinewidth = source.wireframeLinewidth;

        return this;
    }

}

export { MeshDepthMaterial };
