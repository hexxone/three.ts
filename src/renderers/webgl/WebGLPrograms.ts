import { BackSide, CubeUVReflectionMapping, CubeUVRefractionMapping, DoubleSide, LinearEncoding, NoToneMapping, ObjectSpaceNormalMap, TangentSpaceNormalMap } from "../../constants";
import { Object3D } from "../../core/Object3D";
import { LineBasicMaterial } from "../../materials/LineBasicMaterial";
import { LineDashedMaterial } from "../../materials/LineDashedMaterial";
import { Material } from "../../materials/Material";
import { MeshBasicMaterial } from "../../materials/MeshBasicMaterial";
import { MeshDepthMaterial } from "../../materials/MeshDepthMaterial";
import { MeshDistanceMaterial } from "../../materials/MeshDistanceMaterial";
import { MeshLambertMaterial } from "../../materials/MeshLambertMaterial";
import { MeshMatcapMaterial } from "../../materials/MeshMatcapMaterial";
import { MeshNormalMaterial } from "../../materials/MeshNormalMaterial";
import { MeshPhongMaterial } from "../../materials/MeshPhongMaterial";
import { MeshPhysicalMaterial } from "../../materials/MeshPhysicalMaterial";
import { MeshStandardMaterial } from "../../materials/MeshStandardMaterial";
import { MeshToonMaterial } from "../../materials/MeshToonMaterial";
import { PointsMaterial } from "../../materials/PointsMaterial";
import { ShaderMaterial } from "../../materials/ShaderMaterial";
import { ShadowMaterial } from "../../materials/ShadowMaterial";
import { SpriteMaterial } from "../../materials/SpriteMaterial";
import { InstancedMesh } from "../../objects/InstancedMesh";
import { FogExp2 } from "../../scenes/FogExp2";
import { Scene } from "../../scenes/Scene";
import { Texture } from "../../textures/Texture";
import { ShaderLib } from "../shaders/ShaderLib";
import { UniformsUtils } from "../shaders/UniformsUtils";
import { WebGLRenderer } from "../WebGLRenderer";
import { WebGLRenderTarget } from "../WebGLRenderTarget";
import { WebGLBindingStates } from "./WebGLBindingStates";
import { WebGLCapabilities } from "./WebGLCapabilities";
import { WebGLClipping } from "./WebGLClipping";
import { WebGLCubeMaps } from "./WebGLCubeMaps";
import { WebGLExtensions } from "./WebGLExtensions";
import { WebGLLights } from "./WebGLLights";
import { WebGLProgram } from "./WebGLProgram";

/**
 * @public
 */
export type WebGlProgramsParameters = {
	isWebGL2: any;
	shaderID: any;
	shaderName: string;
	vertexShader: any;
	fragmentShader: any;
	defines: any;
	isRawShaderMaterial: boolean;
	glslVersion: any;
	precision: any;
	instancing: boolean;
	instancingColor: boolean;
	supportsVertexTextures: any;
	outputEncoding: any;
	map: boolean;
	mapEncoding: any;
	matcap: boolean;
	matcapEncoding: any;
	envMap: boolean;
	envMapMode: any;
	envMapEncoding: any;
	envMapCubeUV: boolean;
	lightMap: boolean;
	lightMapEncoding: any;
	aoMap: boolean;
	emissiveMap: boolean;
	emissiveMapEncoding: any;
	bumpMap: boolean;
	normalMap: boolean;
	objectSpaceNormalMap: boolean;
	tangentSpaceNormalMap: boolean;
	clearcoatMap: boolean;
	clearcoatRoughnessMap: boolean;
	clearcoatNormalMap: boolean;
	displacementMap: boolean;
	roughnessMap: boolean;
	metalnessMap: boolean;
	specularMap: boolean;
	alphaMap: boolean;
	gradientMap: boolean;
	sheen: boolean;
	transmissionMap: boolean;
	combine: any;
	vertexTangents: boolean;
	vertexColors: boolean;
	vertexUvs: boolean;
	uvsVertexOnly: boolean;
	fog: boolean;
	useFog: boolean;
	fogExp2: boolean;
	flatShading: boolean;
	sizeAttenuation: any;
	logarithmicDepthBuffer: any;
	skinning: boolean;
	maxBones: number;
	useVertexTexture: any;
	morphTargets: boolean;
	morphNormals: boolean;
	maxMorphTargets: number;
	maxMorphNormals: number;
	numDirLights: number;
	numPointLights: number;
	numSpotLights: number;
	numRectAreaLights: number;
	numHemiLights: number;
	numDirLightShadows: number;
	numPointLightShadows: number;
	numSpotLightShadows: number;
	numClippingPlanes: number;
	numClipIntersection: number;
	dithering: boolean;
	shadowMapEnabled: boolean;
	shadowMapType: number;
	toneMapping: number;
	physicallyCorrectLights: boolean;
	premultipliedAlpha: boolean;
	alphaTest: number;
	doubleSided: boolean;
	flipSided: boolean;
	depthPacking: number | boolean;
	index0AttributeName: any;
	extensionDerivatives: boolean;
	extensionFragDepth: boolean;
	extensionDrawBuffers: boolean;
	extensionShaderTextureLOD: boolean;
	rendererExtensionFragDepth: any;
	rendererExtensionDrawBuffers: any;
	rendererExtensionShaderTextureLod: any;
	customProgramCacheKey: string;
	uniforms: any;
};

class WebGLPrograms {
	_renderer: WebGLRenderer;
	_cubemaps: WebGLCubeMaps;
	_extensions: WebGLExtensions;
	_capabilities: WebGLCapabilities;
	_bindingStates: WebGLBindingStates;
	_clipping: WebGLClipping;

	isWebGL2: any;

	programs: WebGLProgram[];
	logarithmicDepthBuffer: any;
	floatVertexTextures: any;
	maxVertexUniforms: any;
	vertexTextures: any;
	precision: any;

	constructor(
		renderer: WebGLRenderer,
		cubemaps: WebGLCubeMaps,
		extensions: WebGLExtensions,
		capabilities: WebGLCapabilities,
		bindingStates: WebGLBindingStates,
		clipping: WebGLClipping
	) {
		this._renderer = renderer;
		this._cubemaps = cubemaps;
		this._extensions = extensions;
		this._capabilities = capabilities;
		this._bindingStates = bindingStates;
		this._clipping = clipping;

		this.programs = [];

		this.isWebGL2 = capabilities.isWebGL2;
		this.logarithmicDepthBuffer = capabilities.logarithmicDepthBuffer;
		this.floatVertexTextures = capabilities.floatVertexTextures;
		this.maxVertexUniforms = capabilities.maxVertexUniforms;
		this.vertexTextures = capabilities.vertexTextures;

		this.precision = capabilities.precision;
	}

	parameterNames = [
		"precision",
		"isWebGL2",
		"supportsVertexTextures",
		"outputEncoding",
		"instancing",
		"instancingColor",
		"map",
		"mapEncoding",
		"matcap",
		"matcapEncoding",
		"envMap",
		"envMapMode",
		"envMapEncoding",
		"envMapCubeUV",
		"lightMap",
		"lightMapEncoding",
		"aoMap",
		"emissiveMap",
		"emissiveMapEncoding",
		"bumpMap",
		"normalMap",
		"objectSpaceNormalMap",
		"tangentSpaceNormalMap",
		"clearcoatMap",
		"clearcoatRoughnessMap",
		"clearcoatNormalMap",
		"displacementMap",
		"specularMap",
		"roughnessMap",
		"metalnessMap",
		"gradientMap",
		"alphaMap",
		"combine",
		"vertexColors",
		"vertexTangents",
		"vertexUvs",
		"uvsVertexOnly",
		"fog",
		"useFog",
		"fogExp2",
		"flatShading",
		"sizeAttenuation",
		"logarithmicDepthBuffer",
		"skinning",
		"maxBones",
		"useVertexTexture",
		"morphTargets",
		"morphNormals",
		"maxMorphTargets",
		"maxMorphNormals",
		"premultipliedAlpha",
		"numDirLights",
		"numPointLights",
		"numSpotLights",
		"numHemiLights",
		"numRectAreaLights",
		"numDirLightShadows",
		"numPointLightShadows",
		"numSpotLightShadows",
		"shadowMapEnabled",
		"shadowMapType",
		"toneMapping",
		"physicallyCorrectLights",
		"alphaTest",
		"doubleSided",
		"flipSided",
		"numClippingPlanes",
		"numClipIntersection",
		"depthPacking",
		"dithering",
		"sheen",
		"transmissionMap",
	];

	getMaxBones(object: Object3D) {
		const skeleton = object.skeleton;
		const bones = skeleton.bones;

		if (this.floatVertexTextures) {
			return 1024;
		} else {
			// default for when object is not specified
			// ( for example when prebuilding shader to be used with multiple objects )
			//
			//  - leave some extra space for other uniforms
			//  - limit here is ANGLE's 254 max uniform vectors
			//    (up to 54 should be safe)

			const nVertexUniforms = this.maxVertexUniforms;
			const nVertexMatrices = Math.floor((nVertexUniforms - 20) / 4);

			const maxBones = Math.min(nVertexMatrices, bones.length);

			if (maxBones < bones.length) {
				console.warn(
					"WebGLRenderer: Skeleton has " +
						bones.length +
						" bones. This GPU supports " +
						maxBones +
						"."
				);
				return 0;
			}

			return maxBones;
		}
	}

	getTextureEncodingFromMap(map: Texture) {
		let encoding;

		if (map && map.isTexture) {
			encoding = map.encoding;
		} else if (map && map instanceof WebGLRenderTarget) {
			console.warn(
				"WebGLPrograms.getTextureEncodingFromMap: don't use render targets as textures. Use their .texture property instead."
			);
			encoding = map.texture.encoding;
		} else {
			encoding = LinearEncoding;
		}

		return encoding;
	}

	getShader(material: Material): {
		uniforms: any;
		vertexShader: string;
		fragmentShader: string;
	} {
		if (material instanceof MeshDepthMaterial) {
			return ShaderLib.depth;
		} else if (material instanceof MeshDistanceMaterial) {
			return ShaderLib.distanceRGBA;
		} else if (material instanceof MeshNormalMaterial) {
			return ShaderLib.normal;
		} else if (material instanceof MeshBasicMaterial) {
			return ShaderLib.basic;
		} else if (material instanceof MeshLambertMaterial) {
			return ShaderLib.lambert;
		} else if (material instanceof MeshPhongMaterial) {
			return ShaderLib.phong;
		} else if (material instanceof MeshToonMaterial) {
			return ShaderLib.toon;
		} else if (material instanceof MeshStandardMaterial) {
			return ShaderLib.physical;
		} else if (material instanceof MeshPhysicalMaterial) {
			return ShaderLib.physical;
		} else if (material instanceof MeshMatcapMaterial) {
			return ShaderLib.matcap;
		} else if (material instanceof LineBasicMaterial) {
			return ShaderLib.basic;
		} else if (material instanceof LineDashedMaterial) {
			return ShaderLib.dashed;
		} else if (material instanceof PointsMaterial) {
			return ShaderLib.points;
		} else if (material instanceof ShadowMaterial) {
			return ShaderLib.shadow;
		} else if (material instanceof SpriteMaterial) {
			return ShaderLib.sprite;
		}
	}

	getParameters(
		material: Material,
		lights: WebGLLights["state"],
		shadows: any[],
		scene: Scene,
		object: Object3D
	): WebGlProgramsParameters {
		const fog = scene.fog;
		const environment = material.isMeshStandardMaterial
			? scene.environment
			: null;

		const envMap = this._cubemaps.get(material.envMap || environment);

		const shaderMaterial = material as ShaderMaterial;
		const meshPhysMaterial = material as MeshPhysicalMaterial;
		const meshStdMaterial = material as MeshStandardMaterial;

		// heuristics to create shader parameters according to lights in the scene
		// (not to blow over maxLights budget)

		const maxBones = object.isSkinnedMesh ? this.getMaxBones(object) : 0;

		if (material.precision !== null) {
			this.precision = this._capabilities.getMaxPrecision(
				this._renderer.gl,
				material.precision
			);

			if (this.precision !== material.precision) {
				console.warn(
					"WebGLProgram.getParameters:",
					material.precision,
					"not supported, using",
					this.precision,
					"instead."
				);
			}
		}

		let vertexShader;
		let fragmentShader;

		const shadr = this.getShader(material);
		if (shadr) {
			vertexShader = shadr.vertexShader;
			fragmentShader = shadr.fragmentShader;
		} else {
			vertexShader = shaderMaterial.vertexShader;
			fragmentShader = shaderMaterial.fragmentShader;
		}

		const currentRenderTarget = this._renderer.getRenderTarget();

		const objInstanced = object instanceof InstancedMesh;

		/**
		 * @public
		 */
		return {
			isWebGL2: this.isWebGL2,

			shaderID: shadr,
			shaderName: material.type,

			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			defines: shaderMaterial.defines,

			isRawShaderMaterial: shaderMaterial.isRawShaderMaterial === true,
			glslVersion: shaderMaterial.glslVersion,

			precision: this.precision,

			instancing: objInstanced,
			instancingColor: objInstanced && object.instanceColor !== null,

			supportsVertexTextures: this.vertexTextures,
			outputEncoding:
				currentRenderTarget !== null
					? this.getTextureEncodingFromMap(currentRenderTarget.texture)
					: this._renderer.outputEncoding,
			map: !!material.map,
			mapEncoding: this.getTextureEncodingFromMap(material.map),
			matcap: !!material.matcap,
			matcapEncoding: this.getTextureEncodingFromMap(material.matcap),
			envMap: !!envMap,
			envMapMode: envMap && envMap.mapping,
			envMapEncoding: this.getTextureEncodingFromMap(envMap),
			envMapCubeUV:
				!!envMap &&
				(envMap.mapping === CubeUVReflectionMapping ||
					envMap.mapping === CubeUVRefractionMapping),
			lightMap: !!material.lightMap,
			lightMapEncoding: this.getTextureEncodingFromMap(material.lightMap),
			aoMap: !!material.aoMap,
			emissiveMap: !!material.emissiveMap,
			emissiveMapEncoding: this.getTextureEncodingFromMap(material.emissiveMap),
			bumpMap: !!material.bumpMap,
			normalMap: !!material.normalMap,
			objectSpaceNormalMap: material.normalMapType === ObjectSpaceNormalMap,
			tangentSpaceNormalMap: material.normalMapType === TangentSpaceNormalMap,
			clearcoatMap: !!material.clearcoatMap,
			clearcoatRoughnessMap: !!material.clearcoatRoughnessMap,
			clearcoatNormalMap: !!material.clearcoatNormalMap,
			displacementMap: !!material.displacementMap,
			roughnessMap: !!material.roughnessMap,
			metalnessMap: !!material.metalnessMap,
			specularMap: !!material.specularMap,
			alphaMap: !!material.alphaMap,

			gradientMap: !!material.gradientMap,

			sheen: !!material.sheen,

			transmissionMap: !!meshPhysMaterial.transmissionMap,

			combine: material.combine,

			vertexTangents: material.normalMap && meshStdMaterial.vertexTangents,
			vertexColors: material.vertexColors,

			vertexUvs:
				!!material.map ||
				!!material.bumpMap ||
				!!material.normalMap ||
				!!material.specularMap ||
				!!material.alphaMap ||
				!!material.emissiveMap ||
				!!material.roughnessMap ||
				!!material.metalnessMap ||
				!!material.clearcoatMap ||
				!!material.clearcoatRoughnessMap ||
				!!material.clearcoatNormalMap ||
				!!material.displacementMap ||
				!!meshPhysMaterial.transmissionMap,

			uvsVertexOnly:
				!(
					!!material.map ||
					!!material.bumpMap ||
					!!material.normalMap ||
					!!material.specularMap ||
					!!material.alphaMap ||
					!!material.emissiveMap ||
					!!material.roughnessMap ||
					!!material.metalnessMap ||
					!!material.clearcoatNormalMap ||
					!!meshPhysMaterial.transmissionMap
				) && !!material.displacementMap,

			fog: !!fog,
			useFog: material.fog,
			fogExp2: fog && fog instanceof FogExp2,

			flatShading: !!material.flatShading,

			sizeAttenuation: material.sizeAttenuation,
			logarithmicDepthBuffer: this.logarithmicDepthBuffer,

			skinning: material.skinning && maxBones > 0,
			maxBones: maxBones,
			useVertexTexture: this.floatVertexTextures,

			morphTargets: material.morphTargets,
			morphNormals: material.morphNormals,
			maxMorphTargets: this._renderer.maxMorphTargets,
			maxMorphNormals: this._renderer.maxMorphNormals,

			numDirLights: lights.directional.length,
			numPointLights: lights.point.length,
			numSpotLights: lights.spot.length,
			numRectAreaLights: lights.rectArea.length,
			numHemiLights: lights.hemi.length,

			numDirLightShadows: lights.directionalShadowMap.length,
			numPointLightShadows: lights.pointShadowMap.length,
			numSpotLightShadows: lights.spotShadowMap.length,

			numClippingPlanes: this._clipping.numPlanes,
			numClipIntersection: this._clipping.numIntersection,

			dithering: material.dithering,

			shadowMapEnabled: this._renderer.shadowMap.enabled && shadows.length > 0,
			shadowMapType: this._renderer.shadowMap.type,

			toneMapping: material.toneMapped
				? this._renderer.toneMapping
				: NoToneMapping,

			physicallyCorrectLights: this._renderer.physicallyCorrectLights,

			premultipliedAlpha: material.premultipliedAlpha,

			alphaTest: material.alphaTest,
			doubleSided: material.side === DoubleSide,
			flipSided: material.side === BackSide,

			depthPacking:
				material instanceof MeshDepthMaterial
				? material.depthPacking : false,

			index0AttributeName: shaderMaterial.index0AttributeName,

			extensionDerivatives:
				shaderMaterial.extensions && shaderMaterial.extensions.derivatives,
			extensionFragDepth:
				shaderMaterial.extensions && shaderMaterial.extensions.fragDepth,
			extensionDrawBuffers:
				shaderMaterial.extensions && shaderMaterial.extensions.drawBuffers,
			extensionShaderTextureLOD:
				shaderMaterial.extensions && shaderMaterial.extensions.shaderTextureLOD,

			rendererExtensionFragDepth:
				this.isWebGL2 || this._extensions.has("EXT_frag_depth"),
			rendererExtensionDrawBuffers:
				this.isWebGL2 || this._extensions.has("WEBGL_draw_buffers"),
			rendererExtensionShaderTextureLod:
				this.isWebGL2 || this._extensions.has("EXT_shader_texture_lod"),

			customProgramCacheKey: material.customProgramCacheKey(),

			uniforms: {},
		};
	}

	getProgramCacheKey(parameters: WebGlProgramsParameters): string {
		const array = [];

		if (parameters.shaderID) {
			array.push(parameters.shaderID);
		} else {
			array.push(parameters.fragmentShader);
			array.push(parameters.vertexShader);
		}

		if (parameters.defines !== undefined) {
			for (const name in parameters.defines) {
				array.push(name);
				array.push(parameters.defines[name]);
			}
		}

		if (parameters.isRawShaderMaterial === false) {
			for (let i = 0; i < this.parameterNames.length; i++) {
				array.push(parameters[this.parameterNames[i]]);
			}

			array.push(this._renderer.outputEncoding);
			array.push(this._renderer.gammaFactor);
		}

		array.push(parameters.customProgramCacheKey);

		return array.join();
	}

	getUniforms(material: Material): any {
		let uniforms;
		const shadr = this.getShader(material);
		if (shadr) {
			uniforms = UniformsUtils.clone(shadr.uniforms);
		} else {
			uniforms = (material as ShaderMaterial).uniforms;
		}

		return uniforms;
	}

	acquireProgram(parameters: WebGlProgramsParameters, cacheKey): WebGLProgram {
		let program: WebGLProgram;

		// Check if code has been already compiled
		for (let p = 0, pl = this.programs.length; p < pl; p++) {
			const preexistingProgram = this.programs[p];

			if (preexistingProgram.cacheKey === cacheKey) {
				program = preexistingProgram;
				++program.usedTimes;

				break;
			}
		}

		if (program === undefined) {
			program = new WebGLProgram(
				this._renderer,
				cacheKey,
				parameters,
				this._bindingStates
			);
			this.programs.push(program);
		}

		return program;
	}

	releaseProgram(program: WebGLProgram) {
		if (--program.usedTimes === 0) {
			// Remove from unordered set
			const i = this.programs.indexOf(program);
			this.programs[i] = this.programs[this.programs.length - 1];
			this.programs.pop();

			// Free WebGL resources
			program.destroy();
		}
	}
}

export { WebGLPrograms };
