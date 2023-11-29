import { AddEquation, AlwaysStencilFunc, FrontSide, KeepStencilOp, LessEqualDepth, NormalBlending, OneMinusSrcAlphaFactor, SrcAlphaFactor } from "../constants";
import { EventDispatcher } from "../core/EventDispatcher";
import { Color } from "../math/Color";
import { generateUUID } from "../math/MathUtils";
import { Plane } from "../math/Plane";
import { Vector2 } from "../math/Vector2";
import { WebGlProgramsParameters } from "../renderers/webgl/WebGLPrograms";
import { WebGLRenderer } from "../renderers/WebGLRenderer";
import { Texture } from "../textures/Texture";

let materialId = 0;

export type MaterialParameters = {
	alphaTest?: number;
	blendDst?: number;
	blendDstAlpha?: number;
	blendEquation?: number;
	blendEquationAlpha?: number;
	blending?: number;
	blendSrc?: number;
	blendSrcAlpha?: number;
	clipIntersection?: boolean;
	clippingPlanes?: Plane[];
	clipShadows?: boolean;
	colorWrite?: boolean;
	defines?: any;
	depthFunc?: number;
	depthTest?: boolean;
	depthWrite?: boolean;
	fog?: boolean;
	name?: string;
	opacity?: number;
	polygonOffset?: boolean;
	polygonOffsetFactor?: number;
	polygonOffsetUnits?: number;
	precision?: "highp" | "mediump" | "lowp" | null;
	premultipliedAlpha?: boolean;
	dithering?: boolean;
	side?: number;
	shadowSide?: number;
	toneMapped?: boolean;
	transparent?: boolean;
	vertexColors?: boolean;
	visible?: boolean;
	stencilWrite?: boolean;
	stencilFunc?: number;
	stencilRef?: number;
	stencilWriteMask?: number;
	stencilFuncMask?: number;
	stencilFail?: number;
	stencilZFail?: number;
	stencilZPass?: number;
	userData?: any;

	color?: any;
	map?: Texture;
	alphaMap?: Texture;
	size?: number;
	sizeAttenuation?: boolean;
	morphTargets?: boolean;
};

/**
 * @public
 */
class Material extends EventDispatcher {
	id: number;
	uuid: string;
	name: string;
	type: string;

	fog: boolean;
	blending: number;
	side: number;
	vertexColors: boolean;
	opacity: number;
	transparent: boolean;
	clipping: boolean;

	blendSrc: number;
	blendDst: number;
	blendEquation: number;
	blendSrcAlpha: any;
	blendDstAlpha: any;
	blendEquationAlpha: any;

	depthFunc: number;
	depthTest: boolean;
	depthWrite: boolean;

	stencilWriteMask: number;
	stencilFunc: number;
	stencilRef: number;
	stencilFuncMask: number;
	stencilFail: number;
	stencilZFail: number;
	stencilZPass: number;
	stencilWrite: boolean;

	clippingPlanes: Plane[];
	clipIntersection: boolean;
	clipShadows: boolean;
	shadowSide: any;
	colorWrite: boolean;
	precision: string;
	polygonOffset: boolean;
	polygonOffsetFactor: number;
	polygonOffsetUnits: number;
	dithering: boolean;
	alphaTest: number;
	premultipliedAlpha: boolean;
	visible: boolean;
	toneMapped: boolean;
	userData: {};
	version: number;
	flatShading: boolean;
	color: Color;
	roughness: number;
	metalness: number;
	emissive: Color;
	emissiveIntensity: number;
	specular: Color;
	shininess: number; // TODO or color?
	clearcoatRoughness: number;
	clearcoatMap: Texture;
	clearcoatRoughnessMap: Texture;
	clearcoatNormalMap: Texture;
	clearcoatNormalScale: Vector2;

	_sheen: number;
	_clearcoat: number;

	map: Texture;
	matcap: Texture;
	alphaMap: Texture;
	lightMap: Texture;
	lightMapIntensity: number;
	aoMap: Texture;
	aoMapIntensity: number;
	bumpMap: Texture;
	bumpScale: number;
	normalMap: Texture;
	normalMapType: number;
	normalScale: Vector2;
	displacementMap: Texture;
	displacementScale: number;
	displacementBias: number;
	roughnessMap: Texture;
	metalnessMap: Texture;
	emissiveMap: Texture;
	specularMap: Texture;
	envMap: Texture;
	reflectivity: number;
	refractionRatio: number;
	combine: number;
	envMapIntensity: number;
	gradientMap: Texture;
	size: number;
	sizeAttenuation: boolean;
	rotation: number;
	linewidth: number;
	dashSize: number;
	gapSize: number;
	scale: number;
	wireframe: boolean;
	wireframeLinewidth: number;
	wireframeLinecap: string;
	wireframeLinejoin: string;
	morphTargets: boolean;
	morphNormals: boolean;
	skinning: boolean;

	needsUpdate: boolean;
	uniformsNeedUpdate: boolean;

	isMaterial = true;
	isMeshBasicMaterial: boolean;
	isMeshLambertMaterial: boolean;
	isMeshToonMaterial: boolean;
	isMeshPhongMaterial: boolean;
	isMeshStandardMaterial: boolean;
	isMeshPhysicalMaterial: boolean;
	isMeshMatcapMaterial: boolean;
	isMeshDepthMaterial: boolean;
	isMeshDistanceMaterial: boolean;
	isMeshNormalMaterial: boolean;
	isLineBasicMaterial: boolean;
	isLineDashedMaterial: boolean;
	isPointsMaterial: boolean;
	isSpriteMaterial: boolean;
	isShadowMaterial: boolean;
	isShaderMaterial: boolean;

	constructor() {
		super();

		Object.defineProperty(this, "id", {
			value: materialId++,
		});
		Object.defineProperty(this, "needsUpdate", {
			set(value) {
				if (value === true) this.version++;
			},
		});

		this.uuid = generateUUID();

		this.name = "";
		this.type = "Material";

		this.fog = true;

		this.blending = NormalBlending;
		this.side = FrontSide;
		this.vertexColors = false;

		this.opacity = 1;
		this.transparent = false;

		this.blendSrc = SrcAlphaFactor;
		this.blendDst = OneMinusSrcAlphaFactor;
		this.blendEquation = AddEquation;
		this.blendSrcAlpha = null;
		this.blendDstAlpha = null;
		this.blendEquationAlpha = null;

		this.depthFunc = LessEqualDepth;
		this.depthTest = true;
		this.depthWrite = true;

		this.stencilWriteMask = 0xff;
		this.stencilFunc = AlwaysStencilFunc;
		this.stencilRef = 0;
		this.stencilFuncMask = 0xff;
		this.stencilFail = KeepStencilOp;
		this.stencilZFail = KeepStencilOp;
		this.stencilZPass = KeepStencilOp;
		this.stencilWrite = false;

		this.clippingPlanes = null;
		this.clipIntersection = false;
		this.clipShadows = false;

		this.shadowSide = null;

		this.colorWrite = true;

		this.precision = null; // override the renderer's default precision for this material

		this.polygonOffset = false;
		this.polygonOffsetFactor = 0;
		this.polygonOffsetUnits = 0;

		this.dithering = false;

		this.alphaTest = 0;
		this.premultipliedAlpha = false;

		this.visible = true;

		this.toneMapped = true;

		this.userData = {};

		this.version = 0;
	}

	get sheen() {
		return this._sheen;
	}

	set sheen(value) {
		if (this._sheen > 0 !== value > 0) {
			this.version++;
		}

		this._sheen = value;
	}

	get clearcoat() {
		return this._clearcoat;
	}

	set clearcoat(value) {
		if (this._clearcoat > 0 !== value > 0) {
			this.version++;
		}

		this._clearcoat = value;
	}

	/* shaderobject, renderer */
	onBuild(...args) { }

	/* renderer, scene, camera, geometry, object, group */
	onBeforeRender(...args) { }

	/** function which runs before compilation */
	onBeforeCompile(
		shaderobject: WebGlProgramsParameters,
		renderer: WebGLRenderer
	) { }

	customProgramCacheKey() {
		return this.onBeforeCompile.toString();
	}

	clone() {
		return new Material().copy(this);
	}

	copy(source: Material) {
		this.name = source.name;

		this.fog = source.fog;

		this.blending = source.blending;
		this.side = source.side;
		this.vertexColors = source.vertexColors;

		this.opacity = source.opacity;
		this.transparent = source.transparent;

		this.blendSrc = source.blendSrc;
		this.blendDst = source.blendDst;
		this.blendEquation = source.blendEquation;
		this.blendSrcAlpha = source.blendSrcAlpha;
		this.blendDstAlpha = source.blendDstAlpha;
		this.blendEquationAlpha = source.blendEquationAlpha;

		this.depthFunc = source.depthFunc;
		this.depthTest = source.depthTest;
		this.depthWrite = source.depthWrite;

		this.stencilWriteMask = source.stencilWriteMask;
		this.stencilFunc = source.stencilFunc;
		this.stencilRef = source.stencilRef;
		this.stencilFuncMask = source.stencilFuncMask;
		this.stencilFail = source.stencilFail;
		this.stencilZFail = source.stencilZFail;
		this.stencilZPass = source.stencilZPass;
		this.stencilWrite = source.stencilWrite;

		const srcPlanes = source.clippingPlanes;
		let dstPlanes = null;

		if (srcPlanes !== null) {
			const n = srcPlanes.length;
			dstPlanes = new Array(n);

			for (let i = 0; i !== n; ++i) {
				dstPlanes[i] = srcPlanes[i].clone();
			}
		}

		this.clippingPlanes = dstPlanes;
		this.clipIntersection = source.clipIntersection;
		this.clipShadows = source.clipShadows;

		this.shadowSide = source.shadowSide;

		this.colorWrite = source.colorWrite;

		this.precision = source.precision;

		this.polygonOffset = source.polygonOffset;
		this.polygonOffsetFactor = source.polygonOffsetFactor;
		this.polygonOffsetUnits = source.polygonOffsetUnits;

		this.dithering = source.dithering;

		this.alphaTest = source.alphaTest;
		this.premultipliedAlpha = source.premultipliedAlpha;

		this.visible = source.visible;

		this.toneMapped = source.toneMapped;

		this.userData = JSON.parse(JSON.stringify(source.userData));

		return this;
	}

	dispose() {
		this.dispatchEvent({ type: "dispose" });
	}
	dispatchEvent(arg0: { type: string }) {
		throw new Error("Method not implemented.");
	}
}

export { Material };
