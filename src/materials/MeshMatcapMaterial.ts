import { Color, TangentSpaceNormalMap, Vector2, Material } from "..";

/**
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *
 *  matcap: new Texture( <Image> ),
 *
 *  map: new Texture( <Image> ),
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
 *  alphaMap: new Texture( <Image> ),
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *  morphNormals: <bool>
 *
 *  flatShading: <bool>
 * }
 */

class MeshMatcapMaterial extends Material {
	defines: { MATCAP: string };

	constructor() {
		super();

		this.isMeshMatcapMaterial = true;
		this.type = "MeshMatcapMaterial";

		this.color = new Color(0xffffff); // diffuse

		this.matcap = null;

		this.map = null;

		this.bumpMap = null;
		this.bumpScale = 1;

		this.normalMap = null;
		this.normalMapType = TangentSpaceNormalMap;
		this.normalScale = new Vector2(1, 1);

		this.displacementMap = null;
		this.displacementScale = 1;
		this.displacementBias = 0;

		this.alphaMap = null;

		this.skinning = false;
		this.morphTargets = false;
		this.morphNormals = false;

		this.flatShading = false;

		this.defines = { MATCAP: "" };
	}

	copy(source: MeshMatcapMaterial) {
		super.copy(source);

		this.defines = { MATCAP: "" };

		this.color.copy(source.color);

		this.matcap = source.matcap;

		this.map = source.map;

		this.bumpMap = source.bumpMap;
		this.bumpScale = source.bumpScale;

		this.normalMap = source.normalMap;
		this.normalMapType = source.normalMapType;
		this.normalScale.copy(source.normalScale);

		this.displacementMap = source.displacementMap;
		this.displacementScale = source.displacementScale;
		this.displacementBias = source.displacementBias;

		this.alphaMap = source.alphaMap;

		this.skinning = source.skinning;
		this.morphTargets = source.morphTargets;
		this.morphNormals = source.morphNormals;

		this.flatShading = source.flatShading;

		return this;
	}
}

export { MeshMatcapMaterial };
