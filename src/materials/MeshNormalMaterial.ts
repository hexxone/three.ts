import { TangentSpaceNormalMap, Vector2, Material } from "..";

/**
 * parameters = {
 *  opacity: <float>,
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
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *  morphNormals: <bool>,
 *
 *  flatShading: <bool>
 * }
 */

class MeshNormalMaterial extends Material {
	constructor() {
		super();

		this.isMeshNormalMaterial = true;
		this.type = "MeshNormalMaterial";

		this.bumpMap = null;
		this.bumpScale = 1;

		this.normalMap = null;
		this.normalMapType = TangentSpaceNormalMap;
		this.normalScale = new Vector2(1, 1);

		this.displacementMap = null;
		this.displacementScale = 1;
		this.displacementBias = 0;

		this.wireframe = false;
		this.wireframeLinewidth = 1;

		this.fog = false;

		this.skinning = false;
		this.morphTargets = false;
		this.morphNormals = false;

		this.flatShading = false;
	}

	copy(source: MeshNormalMaterial) {
		super.copy(source);

		this.bumpMap = source.bumpMap;
		this.bumpScale = source.bumpScale;

		this.normalMap = source.normalMap;
		this.normalMapType = source.normalMapType;
		this.normalScale.copy(source.normalScale);

		this.displacementMap = source.displacementMap;
		this.displacementScale = source.displacementScale;
		this.displacementBias = source.displacementBias;

		this.wireframe = source.wireframe;
		this.wireframeLinewidth = source.wireframeLinewidth;

		this.skinning = source.skinning;
		this.morphTargets = source.morphTargets;
		this.morphNormals = source.morphNormals;

		this.flatShading = source.flatShading;

		return this;
	}
}

export { MeshNormalMaterial };
