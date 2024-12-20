/**
 * parameters = {
 *  color: <hex>,
 *  roughness: <float>,
 *  metalness: <float>,
 *  opacity: <float>,
 *
 *  map: new Texture( <Image> ),
 *
 *  lightMap: new Texture( <Image> ),
 *  lightMapIntensity: <float>
 *
 *  aoMap: new Texture( <Image> ),
 *  aoMapIntensity: <float>
 *
 *  emissive: <hex>,
 *  emissiveIntensity: <float>
 *  emissiveMap: new Texture( <Image> ),
 *
 *  bumpMap: new Texture( <Image> ),
 *  bumpScale: <float>,
 *
 *  normalMap: new Texture( <Image> ),
 *  normalMapType: TangentSpaceNormalMap,
 *  normalScale: <Vector2>,
 *
 *  displacementMap: new Texture( <Image> ),
 *  displacementScale: <float>,
 *  displacementBias: <float>,
 *
 *  roughnessMap: new Texture( <Image> ),
 *
 *  metalnessMap: new Texture( <Image> ),
 *
 *  alphaMap: new Texture( <Image> ),
 *
 *  envMap: new CubeTexture( [posx, negx, posy, negy, posz, negz] ),
 *  envMapIntensity: <float>
 *
 *  refractionRatio: <float>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *  morphNormals: <bool>,
 *
 *  flatShading: <bool>
 * }
 */

import { TangentSpaceNormalMap } from '../constants';
import { Color } from '../math/Color';
import { Vector2 } from '../math/Vector2';
import { Material } from './Material';

class MeshStandardMaterial extends Material {

    defines: any;
    vertexTangents: boolean;

    constructor() {
        super();

        this.isMeshStandardMaterial = true;
        this.defines = {
            STANDARD: ''
        };

        this.type = 'MeshStandardMaterial';

        this.color = new Color(0xffffff); // diffuse
        this.roughness = 1.0;
        this.metalness = 0.0;

        this.map = null;

        this.lightMap = null;
        this.lightMapIntensity = 1.0;

        this.aoMap = null;
        this.aoMapIntensity = 1.0;

        this.emissive = new Color(0x000000);
        this.emissiveIntensity = 1.0;
        this.emissiveMap = null;

        this.bumpMap = null;
        this.bumpScale = 1;

        this.normalMap = null;
        this.normalMapType = TangentSpaceNormalMap;
        this.normalScale = new Vector2(1, 1);

        this.displacementMap = null;
        this.displacementScale = 1;
        this.displacementBias = 0;

        this.roughnessMap = null;

        this.metalnessMap = null;

        this.alphaMap = null;

        this.envMap = null;
        this.envMapIntensity = 1.0;

        this.refractionRatio = 0.98;

        this.wireframe = false;
        this.wireframeLinewidth = 1;
        this.wireframeLinecap = 'round';
        this.wireframeLinejoin = 'round';

        this.skinning = false;
        this.morphTargets = false;
        this.morphNormals = false;

        this.flatShading = false;

        this.vertexTangents = false;
    }

    copy(source: MeshStandardMaterial) {
        super.copy(source);

        this.defines = {
            STANDARD: ''
        };

        this.color.copy(source.color);
        this.roughness = source.roughness;
        this.metalness = source.metalness;

        this.map = source.map;

        this.lightMap = source.lightMap;
        this.lightMapIntensity = source.lightMapIntensity;

        this.aoMap = source.aoMap;
        this.aoMapIntensity = source.aoMapIntensity;

        this.emissive.copy(source.emissive);
        this.emissiveMap = source.emissiveMap;
        this.emissiveIntensity = source.emissiveIntensity;

        this.bumpMap = source.bumpMap;
        this.bumpScale = source.bumpScale;

        this.normalMap = source.normalMap;
        this.normalMapType = source.normalMapType;
        this.normalScale.copy(source.normalScale);

        this.displacementMap = source.displacementMap;
        this.displacementScale = source.displacementScale;
        this.displacementBias = source.displacementBias;

        this.roughnessMap = source.roughnessMap;

        this.metalnessMap = source.metalnessMap;

        this.alphaMap = source.alphaMap;

        this.envMap = source.envMap;
        this.envMapIntensity = source.envMapIntensity;

        this.refractionRatio = source.refractionRatio;

        this.wireframe = source.wireframe;
        this.wireframeLinewidth = source.wireframeLinewidth;
        this.wireframeLinecap = source.wireframeLinecap;
        this.wireframeLinejoin = source.wireframeLinejoin;

        this.skinning = source.skinning;
        this.morphTargets = source.morphTargets;
        this.morphNormals = source.morphNormals;

        this.flatShading = source.flatShading;

        this.vertexTangents = source.vertexTangents;

        return this;
    }

}

export { MeshStandardMaterial };
