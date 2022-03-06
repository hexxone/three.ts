export * from "./LineBasicMaterial";
export * from "./LineDashedMaterial";
export * from "./Material";
export * from "./MeshBasicMaterial";
export * from "./MeshDepthMaterial";
export * from "./MeshDistanceMaterial";
export * from "./MeshLambertMaterial";
export * from "./MeshMatcapMaterial";
export * from "./MeshNormalMaterial";
export * from "./MeshPhongMaterial";
export * from "./MeshPhysicalMaterial";
export * from "./MeshStandardMaterial";
export * from "./MeshToonMaterial";
export * from "./PointsMaterial";
export * from "./RawShaderMaterial";
export * from "./ShaderMaterial";
export * from "./ShadowMaterial";
export * from "./SpriteMaterial";

import {
	SpriteMaterial,
	RawShaderMaterial,
	ShaderMaterial,
	PointsMaterial,
	MeshPhysicalMaterial,
	MeshStandardMaterial,
	MeshPhongMaterial,
	MeshToonMaterial,
	MeshNormalMaterial,
	MeshLambertMaterial,
	MeshDepthMaterial,
	MeshDistanceMaterial,
	MeshBasicMaterial,
	MeshMatcapMaterial,
	LineDashedMaterial,
	LineBasicMaterial,
	Material,
	ShadowMaterial,
} from ".";

export const MaterialMap = {
	ShadowMaterial: ShadowMaterial,
	SpriteMaterial: SpriteMaterial,
	RawShaderMaterial: RawShaderMaterial,
	ShaderMaterial: ShaderMaterial,
	PointsMaterial: PointsMaterial,
	MeshPhysicalMaterial: MeshPhysicalMaterial,
	MeshStandardMaterial: MeshStandardMaterial,
	MeshPhongMaterial: MeshPhongMaterial,
	MeshToonMaterial: MeshToonMaterial,
	MeshNormalMaterial: MeshNormalMaterial,
	MeshLambertMaterial: MeshLambertMaterial,
	MeshDepthMaterial: MeshDepthMaterial,
	MeshDistanceMaterial: MeshDistanceMaterial,
	MeshBasicMaterial: MeshBasicMaterial,
	MeshMatcapMaterial: MeshMatcapMaterial,
	LineDashedMaterial: LineDashedMaterial,
	LineBasicMaterial: LineBasicMaterial,
	Material: Material,
};
