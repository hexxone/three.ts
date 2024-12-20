/**
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *  map: new Texture( <Image> ),
 *
 *  lightMap: new Texture( <Image> ),
 *  lightMapIntensity: <float>
 *
 *  aoMap: new Texture( <Image> ),
 *  aoMapIntensity: <float>
 *
 *  specularMap: new Texture( <Image> ),
 *
 *  alphaMap: new Texture( <Image> ),
 *
 *  envMap: new CubeTexture( [posx, negx, posy, negy, posz, negz] ),
 *  combine: Multiply,
 *  reflectivity: <float>,
 *  refractionRatio: <float>,
 *
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>
 * }
 */

import { MultiplyOperation } from '../constants';
import { Color } from '../math/Color';
import { Material } from './Material';

class MeshBasicMaterial extends Material {

    constructor() {
        super();

        this.isMeshBasicMaterial = true;

        this.type = 'MeshBasicMaterial';

        this.color = new Color(0xffffff); // emissive

        this.map = null;

        this.lightMap = null;
        this.lightMapIntensity = 1.0;

        this.aoMap = null;
        this.aoMapIntensity = 1.0;

        this.specularMap = null;

        this.alphaMap = null;

        this.envMap = null;
        this.combine = MultiplyOperation;
        this.reflectivity = 1;
        this.refractionRatio = 0.98;

        this.wireframe = false;
        this.wireframeLinewidth = 1;
        this.wireframeLinecap = 'round';
        this.wireframeLinejoin = 'round';

        this.skinning = false;
        this.morphTargets = false;
    }

    copy(source: MeshBasicMaterial) {
        super.copy(source);

        this.color.copy(source.color);

        this.map = source.map;

        this.lightMap = source.lightMap;
        this.lightMapIntensity = source.lightMapIntensity;

        this.aoMap = source.aoMap;
        this.aoMapIntensity = source.aoMapIntensity;

        this.specularMap = source.specularMap;

        this.alphaMap = source.alphaMap;

        this.envMap = source.envMap;
        this.combine = source.combine;
        this.reflectivity = source.reflectivity;
        this.refractionRatio = source.refractionRatio;

        this.wireframe = source.wireframe;
        this.wireframeLinewidth = source.wireframeLinewidth;
        this.wireframeLinecap = source.wireframeLinecap;
        this.wireframeLinejoin = source.wireframeLinejoin;

        this.skinning = source.skinning;
        this.morphTargets = source.morphTargets;

        return this;
    }

}

export { MeshBasicMaterial };
