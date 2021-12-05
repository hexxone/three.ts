import { SpriteMaterial, RawShaderMaterial, ShaderMaterial, PointsMaterial, MeshPhysicalMaterial, MeshStandardMaterial, MeshPhongMaterial, MeshToonMaterial, MeshNormalMaterial, MeshLambertMaterial, MeshDepthMaterial, MeshDistanceMaterial, MeshBasicMaterial, MeshMatcapMaterial, LineDashedMaterial, LineBasicMaterial, Material, ShadowMaterial } from ".";

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