import { LineBasicMaterial } from "./LineBasicMaterial";
import { LineDashedMaterial } from "./LineDashedMaterial";
import { Material } from "./Material";
import { MeshBasicMaterial } from "./MeshBasicMaterial";
import { MeshDepthMaterial } from "./MeshDepthMaterial";
import { MeshDistanceMaterial } from "./MeshDistanceMaterial";
import { MeshLambertMaterial } from "./MeshLambertMaterial";
import { MeshMatcapMaterial } from "./MeshMatcapMaterial";
import { MeshNormalMaterial } from "./MeshNormalMaterial";
import { MeshPhongMaterial } from "./MeshPhongMaterial";
import { MeshPhysicalMaterial } from "./MeshPhysicalMaterial";
import { MeshStandardMaterial } from "./MeshStandardMaterial";
import { MeshToonMaterial } from "./MeshToonMaterial";
import { PointsMaterial } from "./PointsMaterial";
import { RawShaderMaterial } from "./RawShaderMaterial";
import { ShaderMaterial } from "./ShaderMaterial";
import { ShadowMaterial } from "./ShadowMaterial";
import { SpriteMaterial } from "./SpriteMaterial";

const MaterialMap = {
	"ShadowMaterial": ShadowMaterial,
	"SpriteMaterial": SpriteMaterial,
	"RawShaderMaterial": RawShaderMaterial,
	"ShaderMaterial": ShaderMaterial,
	"PointsMaterial": PointsMaterial,
	"MeshPhysicalMaterial": MeshPhysicalMaterial,
	"MeshStandardMaterial": MeshStandardMaterial,
	"MeshPhongMaterial": MeshPhongMaterial,
	"MeshToonMaterial": MeshToonMaterial,
	"MeshNormalMaterial": MeshNormalMaterial,
	"MeshLambertMaterial": MeshLambertMaterial,
	"MeshDepthMaterial": MeshDepthMaterial,
	"MeshDistanceMaterial": MeshDistanceMaterial,
	"MeshBasicMaterial": MeshBasicMaterial,
	"MeshMatcapMaterial": MeshMatcapMaterial,
	"LineDashedMaterial": LineDashedMaterial,
	"LineBasicMaterial": LineBasicMaterial,
	"Material": Material,
};

export * from "./ShadowMaterial";
export * from "./SpriteMaterial";
export * from "./RawShaderMaterial";
export * from "./ShaderMaterial";
export * from "./PointsMaterial";
export * from "./MeshPhysicalMaterial";
export * from "./MeshStandardMaterial";
export * from "./MeshPhongMaterial";
export * from "./MeshToonMaterial";
export * from "./MeshNormalMaterial";
export * from "./MeshLambertMaterial";
export * from "./MeshDepthMaterial";
export * from "./MeshDistanceMaterial";
export * from "./MeshBasicMaterial";
export * from "./MeshMatcapMaterial";
export * from "./LineDashedMaterial";
export * from "./LineBasicMaterial";
export * from "./Material";

export { MaterialMap };
