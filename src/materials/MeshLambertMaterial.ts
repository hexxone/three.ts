
/**
 * parameters = {
 *  color: <hex>,
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
 *  specularMap: new Texture( <Image> ),
 *
 *  alphaMap: new Texture( <Image> ),
 *
 *  envMap: new CubeTexture( [posx, negx, posy, negy, posz, negz] ),
 *  combine: Multiply,
 *  reflectivity: <float>,
 *  refractionRatio: <float>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *  morphNormals: <bool>
 * }
 */

import { MultiplyOperation } from "../constants";
import { Color } from "../math/Color";
import { Material } from "./Material";

class MeshLambertMaterial extends Material {
	constructor() {
		super();

		this.isMeshLambertMaterial = true;

		this.type = "MeshLambertMaterial";

		this.color = new Color(0xffffff); // diffuse

		this.map = null;

		this.lightMap = null;
		this.lightMapIntensity = 1.0;

		this.aoMap = null;
		this.aoMapIntensity = 1.0;

		this.emissive = new Color(0x000000);
		this.emissiveIntensity = 1.0;
		this.emissiveMap = null;

		this.specularMap = null;

		this.alphaMap = null;

		this.envMap = null;
		this.combine = MultiplyOperation;
		this.reflectivity = 1;
		this.refractionRatio = 0.98;

		this.wireframe = false;
		this.wireframeLinewidth = 1;
		this.wireframeLinecap = "round";
		this.wireframeLinejoin = "round";

		this.skinning = false;
		this.morphTargets = false;
		this.morphNormals = false;
	}

	copy(source: MeshLambertMaterial) {
		super.copy(source);

		this.color.copy(source.color);

		this.map = source.map;

		this.lightMap = source.lightMap;
		this.lightMapIntensity = source.lightMapIntensity;

		this.aoMap = source.aoMap;
		this.aoMapIntensity = source.aoMapIntensity;

		this.emissive.copy(source.emissive);
		this.emissiveMap = source.emissiveMap;
		this.emissiveIntensity = source.emissiveIntensity;

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
		this.morphNormals = source.morphNormals;

		return this;
	}
}

export { MeshLambertMaterial };
