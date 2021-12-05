import {
	AddEquation,
	AlwaysStencilFunc,
	Color,
	EventDispatcher,
	FrontSide,
	KeepStencilOp,
	LessEqualDepth,
	MathUtils,
	NormalBlending,
	OneMinusSrcAlphaFactor,
	Plane,
	SrcAlphaFactor,
	Texture,
	Vector2,
} from "../";

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
	precision: any;
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
	shininess: number; // @todo or color?
	clearcoatRoughness: number;
	clearcoatMap: Texture;
	clearcoatRoughnessMap: Texture;
	clearcoatNormalMap: Texture;
	clearcoatNormalScale: Vector2;

	_sheen: any;
	_clearcoat: any;

	map: Texture;
	matcap: Texture;
	alphaMap: Texture;
	lightMap: Texture;
	lightMapIntensity: any;
	aoMap: Texture;
	aoMapIntensity: any;
	bumpMap: Texture;
	bumpScale: any;
	normalMap: Texture;
	normalMapType: any;
	normalScale: any;
	displacementMap: Texture;
	displacementScale: any;
	displacementBias: any;
	roughnessMap: Texture;
	metalnessMap: Texture;
	emissiveMap: Texture;
	specularMap: Texture;
	envMap: Texture;
	reflectivity: any;
	refractionRatio: any;
	combine: any;
	envMapIntensity: any;
	gradientMap: Texture;
	size: any;
	sizeAttenuation: any;
	rotation: number;
	linewidth: number;
	dashSize: any;
	gapSize: any;
	scale: any;
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

		this.uuid = MathUtils.generateUUID();

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

	/** function which runs before compilation */
	onBeforeCompile(shaderobject, renderer) {}

	customProgramCacheKey() {
		return this.onBeforeCompile.toString();
	}

	toJSON(meta) {
		const isRoot = meta === undefined || typeof meta === "string";

		if (isRoot) {
			meta = {
				textures: {},
				images: {},
			};
		}

		const data = {
			metadata: {
				version: 4.5,
				type: "Material",
				generator: "Material.toJSON",
			},
		} as any;

		// standard Material serialization
		data.uuid = this.uuid;
		data.type = this.type;

		if (this.name !== "") data.name = this.name;

		if (this.color && this.color.isColor) data.color = this.color.getHex();

		if (this.roughness !== undefined) data.roughness = this.roughness;
		if (this.metalness !== undefined) data.metalness = this.metalness;

		if (this.sheen && this.sheen.isColor) data.sheen = this.sheen.getHex();
		if (this.emissive && this.emissive.isColor)
			data.emissive = this.emissive.getHex();
		if (this.emissiveIntensity && this.emissiveIntensity !== 1)
			data.emissiveIntensity = this.emissiveIntensity;

		if (this.specular && this.specular.isColor)
			data.specular = this.specular.getHex();
		if (this.shininess !== undefined) data.shininess = this.shininess;
		if (this.clearcoat !== undefined) data.clearcoat = this.clearcoat;
		if (this.clearcoatRoughness !== undefined)
			data.clearcoatRoughness = this.clearcoatRoughness;

		if (this.clearcoatMap && this.clearcoatMap.isTexture) {
			data.clearcoatMap = this.clearcoatMap.toJSON(meta).uuid;
		}

		if (this.clearcoatRoughnessMap && this.clearcoatRoughnessMap.isTexture) {
			data.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(meta).uuid;
		}

		if (this.clearcoatNormalMap && this.clearcoatNormalMap.isTexture) {
			data.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(meta).uuid;
			data.clearcoatNormalScale = this.clearcoatNormalScale.toArray();
		}

		if (this.map && this.map.isTexture) data.map = this.map.toJSON(meta).uuid;
		if (this.matcap && this.matcap.isTexture)
			data.matcap = this.matcap.toJSON(meta).uuid;
		if (this.alphaMap && this.alphaMap.isTexture)
			data.alphaMap = this.alphaMap.toJSON(meta).uuid;

		if (this.lightMap && this.lightMap.isTexture) {
			data.lightMap = this.lightMap.toJSON(meta).uuid;
			data.lightMapIntensity = this.lightMapIntensity;
		}

		if (this.aoMap && this.aoMap.isTexture) {
			data.aoMap = this.aoMap.toJSON(meta).uuid;
			data.aoMapIntensity = this.aoMapIntensity;
		}

		if (this.bumpMap && this.bumpMap.isTexture) {
			data.bumpMap = this.bumpMap.toJSON(meta).uuid;
			data.bumpScale = this.bumpScale;
		}

		if (this.normalMap && this.normalMap.isTexture) {
			data.normalMap = this.normalMap.toJSON(meta).uuid;
			data.normalMapType = this.normalMapType;
			data.normalScale = this.normalScale.toArray();
		}

		if (this.displacementMap && this.displacementMap.isTexture) {
			data.displacementMap = this.displacementMap.toJSON(meta).uuid;
			data.displacementScale = this.displacementScale;
			data.displacementBias = this.displacementBias;
		}

		if (this.roughnessMap && this.roughnessMap.isTexture)
			data.roughnessMap = this.roughnessMap.toJSON(meta).uuid;
		if (this.metalnessMap && this.metalnessMap.isTexture)
			data.metalnessMap = this.metalnessMap.toJSON(meta).uuid;

		if (this.emissiveMap && this.emissiveMap.isTexture)
			data.emissiveMap = this.emissiveMap.toJSON(meta).uuid;
		if (this.specularMap && this.specularMap.isTexture)
			data.specularMap = this.specularMap.toJSON(meta).uuid;

		if (this.envMap && this.envMap.isTexture) {
			data.envMap = this.envMap.toJSON(meta).uuid;
			data.reflectivity = this.reflectivity; // Scale behind envMap
			data.refractionRatio = this.refractionRatio;

			if (this.combine !== undefined) data.combine = this.combine;
			if (this.envMapIntensity !== undefined)
				data.envMapIntensity = this.envMapIntensity;
		}

		if (this.gradientMap && this.gradientMap.isTexture) {
			data.gradientMap = this.gradientMap.toJSON(meta).uuid;
		}

		if (this.size !== undefined) data.size = this.size;
		if (this.sizeAttenuation !== undefined)
			data.sizeAttenuation = this.sizeAttenuation;

		if (this.blending !== NormalBlending) data.blending = this.blending;
		if (this.side !== FrontSide) data.side = this.side;
		if (this.vertexColors) data.vertexColors = true;

		if (this.opacity < 1) data.opacity = this.opacity;
		if (this.transparent === true) data.transparent = this.transparent;

		data.depthFunc = this.depthFunc;
		data.depthTest = this.depthTest;
		data.depthWrite = this.depthWrite;

		data.stencilWrite = this.stencilWrite;
		data.stencilWriteMask = this.stencilWriteMask;
		data.stencilFunc = this.stencilFunc;
		data.stencilRef = this.stencilRef;
		data.stencilFuncMask = this.stencilFuncMask;
		data.stencilFail = this.stencilFail;
		data.stencilZFail = this.stencilZFail;
		data.stencilZPass = this.stencilZPass;

		// rotation (SpriteMaterial)
		if (this.rotation && this.rotation !== 0) data.rotation = this.rotation;

		if (this.polygonOffset === true) data.polygonOffset = true;
		if (this.polygonOffsetFactor !== 0)
			data.polygonOffsetFactor = this.polygonOffsetFactor;
		if (this.polygonOffsetUnits !== 0)
			data.polygonOffsetUnits = this.polygonOffsetUnits;

		if (this.linewidth && this.linewidth !== 1) data.linewidth = this.linewidth;
		if (this.dashSize !== undefined) data.dashSize = this.dashSize;
		if (this.gapSize !== undefined) data.gapSize = this.gapSize;
		if (this.scale !== undefined) data.scale = this.scale;

		if (this.dithering === true) data.dithering = true;

		if (this.alphaTest > 0) data.alphaTest = this.alphaTest;
		if (this.premultipliedAlpha === true)
			data.premultipliedAlpha = this.premultipliedAlpha;

		if (this.wireframe === true) data.wireframe = this.wireframe;
		if (this.wireframeLinewidth > 1)
			data.wireframeLinewidth = this.wireframeLinewidth;
		if (this.wireframeLinecap !== "round")
			data.wireframeLinecap = this.wireframeLinecap;
		if (this.wireframeLinejoin !== "round")
			data.wireframeLinejoin = this.wireframeLinejoin;

		if (this.morphTargets === true) data.morphTargets = true;
		if (this.morphNormals === true) data.morphNormals = true;
		if (this.skinning === true) data.skinning = true;

		if (this.flatShading === true) data.flatShading = this.flatShading;

		if (this.visible === false) data.visible = false;

		if (this.toneMapped === false) data.toneMapped = false;

		if (JSON.stringify(this.userData) !== "{}") data.userData = this.userData;

		// TODO: Copied from Object3D.toJSON

		function extractFromCache(cache) {
			const values = [];

			for (const key in cache) {
				const data = cache[key];
				delete data.metadata;
				values.push(data);
			}

			return values;
		}

		if (isRoot) {
			const textures = extractFromCache(meta.textures);
			const images = extractFromCache(meta.images);

			if (textures.length > 0) data.textures = textures;
			if (images.length > 0) data.images = images;
		}

		return data;
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
