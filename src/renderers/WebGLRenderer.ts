
import { ensureInit } from "../ensureInit";
import { ArrayCamera } from "../cameras/ArrayCamera";
import { Camera } from "../cameras/Camera";
import { FloatType, HalfFloatType, LinearEncoding, NoToneMapping, RGBAFormat, UnsignedByteType } from "../constants";
import { BufferGeometry } from "../core/BufferGeometry";
import { InstancedBufferGeometry } from "../core/InstancedBufferGeometry";
import { Object3D } from "../core/Object3D";
import { ImmediateRenderObject } from "../extras/objects/ImmediateRenderObject";
import { Material } from "../materials/Material";
import { RawShaderMaterial } from "../materials/RawShaderMaterial";
import { ShaderMaterial } from "../materials/ShaderMaterial";
import { Color } from "../math/Color";
import { Frustum } from "../math/Frustum";
import { Matrix4 } from "../math/Matrix4";
import { Vector2 } from "../math/Vector2";
import { Vector3 } from "../math/Vector3";
import { Vector4 } from "../math/Vector4";
import { Line } from "../objects/Line";
import { Mesh } from "../objects/Mesh";
import { Sprite } from "../objects/Sprite";
import { Scene } from "../scenes/Scene";
import { DataTexture } from "../textures/DataTexture";
import { Texture } from "../textures/Texture";
import { XRFrameRequestCallback } from "../XRWebGL";
import { WebGLAnimation } from "./webgl/WebGLAnimation";
import { IBuffered, WebGLAttributes } from "./webgl/WebGLAttributes";
import { WebGLBackground } from "./webgl/WebGLBackground";
import { WebGLBindingStates } from "./webgl/WebGLBindingStates";
import { WebGLBufferRenderer } from "./webgl/WebGLBufferRenderer";
import { WebGLCapabilities } from "./webgl/WebGLCapabilities";
import { WebGLClipping } from "./webgl/WebGLClipping";
import { WebGLCubeMaps } from "./webgl/WebGLCubeMaps";
import { WebGLExtensions } from "./webgl/WebGLExtensions";
import { WebGLGeometries } from "./webgl/WebGLGeometries";
import { WebGLIndexedBufferRenderer } from "./webgl/WebGLIndexedBufferRenderer";
import { WebGLInfo } from "./webgl/WebGLInfo";
import { WebGLMaterials } from "./webgl/WebGLMaterials";
import { WebGLMorphtargets } from "./webgl/WebGLMorphtargets";
import { WebGLObjects } from "./webgl/WebGLObjects";
import { WebGLProgram } from "./webgl/WebGLProgram";
import { WebGLPrograms, WebGlProgramsParameters } from "./webgl/WebGLPrograms";
import { WebGLProperties } from "./webgl/WebGLProperties";
import { RenderItem, WebGLRenderList, WebGLRenderLists } from "./webgl/WebGLRenderLists";
import { WebGLRenderState, WebGLRenderStates } from "./webgl/WebGLRenderStates";
import { WebGLShadowMap } from "./webgl/WebGLShadowMap";
import { WebGLState } from "./webgl/WebGLState";
import { WebGLTextures } from "./webgl/WebGLTextures";
import { WebGLUniforms } from "./webgl/WebGLUniforms";
import { WebGLUtils } from "./webgl/WebGLUtils";
import { WebGLRenderTarget } from "./WebGLRenderTarget";
import { WebXRManager } from "./webxr/WebXRManager";
import { ceilPowerOfTwo } from "../math/MathUtils";

function createCanvasElement() {
	const canvas = document.createElementNS(
		"http://www.w3.org/1999/xhtml",
		"canvas"
	) as HTMLCanvasElement;
	canvas.style.display = "block";
	return canvas;
}

export interface Renderer {
	domElement: HTMLCanvasElement | OffscreenCanvas;
	render(scene: Object3D, camera: Camera): void;
	setSize(width: number, height: number, updateStyle?: boolean): void;
}

/**
 * @public
 */
type ContextAttributes =
	| CanvasRenderingContext2DSettings
	| ImageBitmapRenderingContextSettings
	| WebGLContextAttributes;

/**
 * @public
 */
export interface WebGLRendererParameters {
	/**
	 * A Canvas where the renderer draws its output.
	 */
	canvas?: HTMLCanvasElement | OffscreenCanvas;

	/**
	 * A WebGL Rendering Context.
	 * (https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext)
	 * Default is null
	 */
	context?: WebGLRenderingContext;

	/**
	 * shader precision. Can be "highp", "mediump" or "lowp".
	 */
	precision?: string;

	/**
	 * default is false.
	 */
	alpha?: boolean;

	/**
	 * default is true.
	 */
	premultipliedAlpha?: boolean;

	/**
	 * default is false.
	 */
	antialias?: boolean;

	/**
	 * default is true.
	 */
	stencil?: boolean;

	/**
	 * default is false.
	 */
	preserveDrawingBuffer?: boolean;

	/**
	 * Can be "high-performance", "low-power" or "default"
	 */
	powerPreference?: string;

	/**
	 * default is true.
	 */
	depth?: boolean;

	/**
	 * default is false.
	 */
	logarithmicDepthBuffer?: boolean;

	/**
	 * default is false.
	 */
	failIfMajorPerformanceCaveat?: boolean;
}

/**
 * @public
 */
export class WebGLRenderer implements Renderer {
	/**
	 * PRIVATE
	 */
	_parameters: WebGLRendererParameters;

	// we use a different type here for optimization reasons
	gl: GLESRenderingContext;

	context: WebGLRenderingContext;

	_alpha: any;
	_depth: any;
	_stencil: any;
	_antialias: any;
	_premultipliedAlpha: any;
	_preserveDrawingBuffer: any;
	_powerPreference: any;
	_failIfMajorPerformanceCaveat: any;

	_currentRenderList: WebGLRenderList = null;
	_currentRenderState: WebGLRenderState = null;

	// render() can be called from within a callback triggered by another render.
	// We track this so that the nested render call gets its list and state isolated from the parent render call.
	_renderListStack: WebGLRenderList[] = [];
	_renderStateStack: WebGLRenderState[] = [];

	_isContextLost = false;

	// internal state cache
	_framebuffer = null;

	_currentActiveCubeFace = 0;
	_currentActiveMipmapLevel = 0;
	_currentRenderTarget: WebGLRenderTarget = null;
	_currentFramebuffer: WebGLFramebuffer = null;
	_currentMaterialId = -1;

	_currentCamera = null;

	// view
	_viewport: Vector4;
	_currentViewport = new Vector4();

	_scissor: Vector4;
	_currentScissor = new Vector4();

	_scissorTest = false;
	_currentScissorTest = null;
	// size
	_width: number;
	_height: number;
	// ratio
	_pixelRatio = 1;
	_opaqueSort = null;
	_transparentSort = null;
	// frustum
	_frustum = new Frustum();
	// clipping
	_clippingEnabled = false;
	_localClippingEnabled = false;
	// camera matrices cache
	_projScreenMatrix = new Matrix4();
	_vector3 = new Vector3();
	_emptyScene = new Scene();

	/**
	 * PUBLIC
	 */

	domElement: (HTMLCanvasElement | OffscreenCanvas);

	/**
	 * Enables error checking and reporting when shader programs are being compiled
	 * @type {boolean}
	 */
	debug = {
		checkShaderErrors: true,
	};

	// render clearing / sorting
	autoClear = true;
	autoClearColor = true;
	autoClearDepth = true;
	autoClearStencil = true;
	sortObjects = true;

	// user-defined clipping
	clippingPlanes = [];
	localClippingEnabled = false;

	// physically based shading
	// for backwards compatibility
	gammaFactor = 2.0;
	outputEncoding = LinearEncoding;

	// physical lights
	physicallyCorrectLights = false;

	toneMapping = NoToneMapping;
	toneMappingExposure = 1.0;

	maxMorphTargets = 8;
	maxMorphNormals = 4;

	extensions: WebGLExtensions;
	capabilities: WebGLCapabilities;

	animation = new WebGLAnimation();
	onAnimationFrameCallback: XRFrameRequestCallback = null;

	isWebGL1Renderer: boolean;

	xr: WebXRManager;
	shadowMap: WebGLShadowMap;
	objects: WebGLObjects;
	utils: WebGLUtils;
	state: WebGLState;
	info: WebGLInfo;
	properties: WebGLProperties;
	textures: WebGLTextures;
	cubemaps: WebGLCubeMaps;
	attributes: WebGLAttributes;
	bindingStates: WebGLBindingStates;
	geometries: WebGLGeometries;
	morphtargets: WebGLMorphtargets;
	clipping: WebGLClipping;
	programCache: WebGLPrograms;
	materials: WebGLMaterials;
	renderLists: WebGLRenderLists;
	renderStates: WebGLRenderStates;
	background: WebGLBackground;
	bufferRenderer: WebGLBufferRenderer;
	indexedBufferRenderer: WebGLIndexedBufferRenderer;

	constructor(parameters?: WebGLRendererParameters) {
		ensureInit();

		this._parameters = parameters = parameters || {};

		this.domElement =
			parameters.canvas !== undefined
				? parameters.canvas
				: createCanvasElement();
		this._width = this.domElement.width;
		this._height = this.domElement.height;
		this._viewport = new Vector4(0, 0, this._width, this._height);
		this._scissor = new Vector4(0, 0, this._width, this._height);

		this.context = parameters.context !== undefined ? parameters.context : null;
		this._alpha = parameters.alpha !== undefined ? parameters.alpha : false;
		this._depth = parameters.depth !== undefined ? parameters.depth : true;
		this._stencil =
			parameters.stencil !== undefined ? parameters.stencil : true;
		this._antialias =
			parameters.antialias !== undefined ? parameters.antialias : false;
		this._premultipliedAlpha =
			parameters.premultipliedAlpha !== undefined
				? parameters.premultipliedAlpha
				: true;
		this._preserveDrawingBuffer =
			parameters.preserveDrawingBuffer !== undefined
				? parameters.preserveDrawingBuffer
				: false;
		this._powerPreference =
			parameters.powerPreference !== undefined
				? parameters.powerPreference
				: "default";
		this._failIfMajorPerformanceCaveat =
			parameters.failIfMajorPerformanceCaveat !== undefined
				? parameters.failIfMajorPerformanceCaveat
				: false;

		try {
			// event listeners must be registered before WebGL context is created, see #12753

			this.domElement.addEventListener(
				"webglcontextlost",
				(e) => this._onContextLost(e),
				false
			);
			this.domElement.addEventListener(
				"webglcontextrestored",
				(e) => this._onContextRestore(),
				false
			);

			if (typeof this.gl === "undefined") {
				const contextNames = ["webgl2", "webgl", "experimental-webgl"];

				if (this.isWebGL1Renderer === true) {
					contextNames.shift();
				}

				/**
				 * @public
				 */
				const contextAttributes = {
					alpha: this._alpha,
					depth: this._depth,
					stencil: this._stencil,
					antialias: this._antialias,
					premultipliedAlpha: this._premultipliedAlpha,
					preserveDrawingBuffer: this._preserveDrawingBuffer,
					powerPreference: this._powerPreference,
					failIfMajorPerformanceCaveat: this._failIfMajorPerformanceCaveat,
				};
				this.gl = this._getContext(contextNames, contextAttributes);

				if (this.gl === null) {
					if (this._getContext(contextNames)) {
						throw new Error(
							"Error creating WebGL context with your selected attributes."
						);
					} else {
						throw new Error("Error creating WebGL context.");
					}
				}
			}

			// Some experimental-webgl implementations do not have getShaderPrecisionFormat

			if (typeof this.gl.getShaderPrecisionFormat === "undefined") {
				this.gl.getShaderPrecisionFormat = function () {
					return { rangeMin: 1, rangeMax: 1, precision: 1 };
				};
			}
		} catch (error) {
			console.error("WebGLRenderer: " + error.message);
			throw error;
		}

		// init
		this._initGLContext();

		// xr
		const xr = new WebXRManager(this, this.gl);
		this.xr = xr;

		// shadow map
		this.shadowMap = new WebGLShadowMap(
			this,
			this.objects,
			this.capabilities.maxTextureSize
		);

		if (typeof window !== "undefined") {
			this.animation.setContext(window);
		}

		if (typeof __THREE_DEVTOOLS__ !== "undefined") {
			__THREE_DEVTOOLS__.dispatchEvent(
				new CustomEvent("observe", { detail: this })
			);
		}

		this.animation.setAnimationLoop(this.onAnimationFrame.bind(this));
	}

	_onContextLost(event) {
		event.preventDefault();

		console.log("WebGLRenderer: Context Lost.");

		this._isContextLost = true;
	}

	_onContextRestore(/* event */) {
		console.log("WebGLRenderer: Context Restored.");
		this._isContextLost = false;
		this._initGLContext();
	}

	_onMaterialDispose(event) {
		const material = event.target;
		material.removeEventListener("dispose", this._onMaterialDispose);
		this.deallocateMaterial(material);
	}

	_getTargetPixelRatio() {
		return this._currentRenderTarget === null ? this._pixelRatio : 1;
	}

	_getContext(
		contextNames: string[],
		contextAttributes?: ContextAttributes
	): GLESRenderingContext {
		for (let i = 0; i < contextNames.length; i++) {
			const contextName = contextNames[i];
			const context = this.domElement.getContext(
				contextName as any,
				contextAttributes
			);
			if (context !== null) return context as any;
		}

		return null;
	}

	// TODO test
	_initGLContext() {
		this.extensions = new WebGLExtensions(this.gl);

		this.capabilities = new WebGLCapabilities(
			this.gl,
			this.extensions,
			this._parameters
		);

		this.extensions.init(this.capabilities);

		this.utils = new WebGLUtils(this.gl, this.extensions, this.capabilities);

		this.state = new WebGLState(this.gl, this.extensions, this.capabilities);
		this.state.scissor(
			this._currentScissor
				.copy(this._scissor)
				.multiplyScalar(this._pixelRatio)
				.floor()
		);
		this.state.viewport(
			this._currentViewport
				.copy(this._viewport)
				.multiplyScalar(this._pixelRatio)
				.floor()
		);

		this.info = new WebGLInfo(this.gl);
		this.properties = new WebGLProperties();
		this.textures = new WebGLTextures(
			this.gl,
			this.extensions,
			this.state,
			this.properties,
			this.capabilities,
			this.utils,
			this.info
		);
		this.cubemaps = new WebGLCubeMaps(this);
		this.attributes = new WebGLAttributes(this.gl, this.capabilities);
		this.bindingStates = new WebGLBindingStates(
			this.gl,
			this.extensions,
			this.attributes,
			this.capabilities
		);
		this.geometries = new WebGLGeometries(
			this.gl,
			this.attributes,
			this.info,
			this.bindingStates
		);
		this.objects = new WebGLObjects(
			this.gl,
			this.geometries,
			this.attributes,
			this.info
		);
		this.morphtargets = new WebGLMorphtargets(this.gl);
		this.clipping = new WebGLClipping(this.properties);
		this.programCache = new WebGLPrograms(
			this,
			this.cubemaps,
			this.extensions,
			this.capabilities,
			this.bindingStates,
			this.clipping
		);
		this.materials = new WebGLMaterials(this.properties);
		this.renderLists = new WebGLRenderLists(this.properties);
		this.renderStates = new WebGLRenderStates(
			this.extensions,
			this.capabilities
		);
		this.background = new WebGLBackground(
			this,
			this.cubemaps,
			this.state,
			this.objects,
			this._premultipliedAlpha
		);

		this.bufferRenderer = new WebGLBufferRenderer(
			this.gl,
			this.extensions,
			this.info,
			this.capabilities
		);
		this.indexedBufferRenderer = new WebGLIndexedBufferRenderer(
			this.gl,
			this.extensions,
			this.info,
			this.capabilities
		);

		this.info.programs = this.programCache.programs;
	}

	/**
	 * API
	 */

	getContext() {
		return this.gl;
	}

	getContextAttributes() {
		return this.gl.getContextAttributes();
	}

	forceContextLoss() {
		const extension = this.extensions.get(
			"WEBGL_lose_context"
		) as WEBGL_lose_context;
		if (extension) extension.loseContext();
	}

	forceContextRestore() {
		const extension = this.extensions.get(
			"WEBGL_lose_context"
		) as WEBGL_lose_context;
		if (extension) extension.restoreContext();
	}

	getPixelRatio() {
		return this._pixelRatio;
	}

	setPixelRatio(value) {
		if (value === undefined) return;

		this._pixelRatio = value;

		this.setSize(this._width, this._height, false);
	}

	getSize(target: Vector2) {
		return target.set(this._width, this._height);
	}

	setSize(width: number, height: number, updateStyle?) {
		if (this.xr.isPresenting) {
			console.warn(
				"WebGLRenderer: Can't change size while VR device is presenting."
			);
			return;
		}

		this._width = width;
		this._height = height;

		this.domElement.width = Math.floor(width * this._pixelRatio);
		this.domElement.height = Math.floor(height * this._pixelRatio);

		if (updateStyle !== false && this.domElement instanceof HTMLCanvasElement) {
			this.domElement.style.width = width + "px";
			this.domElement.style.height = height + "px";
		}

		this.setViewport(0, 0, width, height);
	}

	getDrawingBufferSize(target: Vector2) {
		if (target === undefined) {
			console.warn(
				"WebGLRenderer: .getdrawingBufferSize() now requires a Vector2 as an argument"
			);

			target = new Vector2();
		}

		return target
			.set(this._width * this._pixelRatio, this._height * this._pixelRatio)
			.floor();
	}

	setDrawingBufferSize(width, height, pixelRatio) {
		this._width = width;
		this._height = height;

		this._pixelRatio = pixelRatio;

		this.domElement.width = Math.floor(width * pixelRatio);
		this.domElement.height = Math.floor(height * pixelRatio);

		this.setViewport(0, 0, width, height);
	}

	getCurrentViewport(target: Vector4) {
		return target.copy(this._currentViewport);
	}

	getViewport(target: Vector4) {
		return target.copy(this._viewport);
	}

	setViewport(
		x: number | Vector4,
		y?: number,
		width?: number,
		height?: number
	) {
		if (x instanceof Vector4) {
			this._viewport.set(x.x, x.y, x.z, x.w);
		} else {
			this._viewport.set(x, y, width, height);
		}

		this.state.viewport(
			this._currentViewport
				.copy(this._viewport)
				.multiplyScalar(this._pixelRatio)
				.floor()
		);
	}

	getScissor(target: Vector4) {
		return target.copy(this._scissor);
	}

	setScissor(x: number | Vector4, y?: number, width?: number, height?: number) {
		if (x instanceof Vector4) {
			this._scissor.set(x.x, x.y, x.z, x.w);
		} else {
			this._scissor.set(x, y, width, height);
		}

		this.state.scissor(
			this._currentScissor
				.copy(this._scissor)
				.multiplyScalar(this._pixelRatio)
				.floor()
		);
	}

	getScissorTest() {
		return this._scissorTest;
	}

	setScissorTest(boolean) {
		this.state.setScissorTest((this._scissorTest = boolean));
	}

	setOpaqueSort(method) {
		this._opaqueSort = method;
	}

	setTransparentSort(method) {
		this._transparentSort = method;
	}

	// Clearing

	getClearColor(target: Color) {
		if (target === undefined) target = new Color(0, 0, 0);
		return target.copy(this.background.getClearColor());
	}

	setClearColor(...args) {
		this.background.setClearColor.apply(this.background, args);
	}

	getClearAlpha() {
		return this.background.getClearAlpha();
	}

	setClearAlpha(...args) {
		this.background.setClearAlpha.apply(this.background, args);
	}

	clear(color?: boolean, depth?: boolean, stencil?: boolean) {
		let bits = 0;

		if (color === undefined || color) bits |= this.gl.COLOR_BUFFER_BIT;
		if (depth === undefined || depth) bits |= this.gl.DEPTH_BUFFER_BIT;
		if (stencil === undefined || stencil) bits |= this.gl.STENCIL_BUFFER_BIT;

		this.gl.clear(bits);
	}

	clearColor() {
		this.clear(true, false, false);
	}

	clearDepth() {
		this.clear(false, true, false);
	}

	clearStencil() {
		this.clear(false, false, true);
	}

	//

	dispose() {
		this.domElement.removeEventListener(
			"webglcontextlost",
			this._onContextLost,
			false
		);
		this.domElement.removeEventListener(
			"webglcontextrestored",
			this._onContextRestore,
			false
		);

		this.renderLists.dispose();
		this.renderStates.dispose();
		this.properties.dispose();
		this.cubemaps.dispose();
		this.objects.dispose();
		this.bindingStates.dispose();

		this.xr.dispose();

		this.animation.stop();
	}

	/**
	 * Buffer deallocation
	 */

	deallocateMaterial(material) {
		this.releaseMaterialProgramReference(material);
		this.properties.remove(material);
	}

	releaseMaterialProgramReference(material: Material) {
		const programInfo = this.properties.get(material).program;
		if (programInfo !== undefined) {
			this.programCache.releaseProgram(programInfo);
		}
	}

	// Buffer rendering

	renderObjectImmediate(object: ImmediateRenderObject, program: WebGLProgram) {
		object.render((object) => {
			this.renderBufferImmediate(object, program);
		});
	}

	renderBufferImmediate(object: ImmediateRenderObject, program: WebGLProgram) {
		this.bindingStates.initAttributes();

		const buffers = this.properties.get(object);

		if (object.hasPositions && !buffers.position)
			buffers.position = this.gl.createBuffer();

		if (object.hasNormals && !buffers.normal)
			buffers.normal = this.gl.createBuffer();

		if (object.hasUvs && !buffers.uv) buffers.uv = this.gl.createBuffer();

		if (object.hasColors && !buffers.color)
			buffers.color = this.gl.createBuffer();

		const programAttributes = program.getAttributes();

		if (object.hasPositions) {
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.position);
			this.gl.bufferData(
				this.gl.ARRAY_BUFFER,
				object.positionArray,
				this.gl.DYNAMIC_DRAW
			);

			this.bindingStates.enableAttribute(programAttributes.position);
			this.gl.vertexAttribPointer(
				programAttributes.position,
				3,
				this.gl.FLOAT,
				false,
				0,
				0
			);
		}

		if (object.hasNormals) {
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.normal);
			this.gl.bufferData(
				this.gl.ARRAY_BUFFER,
				object.normalArray,
				this.gl.DYNAMIC_DRAW
			);

			this.bindingStates.enableAttribute(programAttributes.normal);
			this.gl.vertexAttribPointer(
				programAttributes.normal,
				3,
				this.gl.FLOAT,
				false,
				0,
				0
			);
		}

		if (object.hasUvs) {
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.uv);
			this.gl.bufferData(
				this.gl.ARRAY_BUFFER,
				object.uvArray,
				this.gl.DYNAMIC_DRAW
			);

			this.bindingStates.enableAttribute(programAttributes.uv);
			this.gl.vertexAttribPointer(
				programAttributes.uv,
				2,
				this.gl.FLOAT,
				false,
				0,
				0
			);
		}

		if (object.hasColors) {
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffers.color);
			this.gl.bufferData(
				this.gl.ARRAY_BUFFER,
				object.colorArray,
				this.gl.DYNAMIC_DRAW
			);

			this.bindingStates.enableAttribute(programAttributes.color);
			this.gl.vertexAttribPointer(
				programAttributes.color,
				3,
				this.gl.FLOAT,
				false,
				0,
				0
			);
		}

		this.bindingStates.disableUnusedAttributes();

		this.gl.drawArrays(this.gl.TRIANGLES, 0, object.count);

		object.count = 0;
	}

	renderBufferDirect(
		camera: Camera,
		scene: Object3D,
		geometry: BufferGeometry,
		material: Material,
		object: Object3D,
		group
	) {
		if (scene === null) scene = this._emptyScene; // renderBufferDirect second parameter used to be fog (could be null)

		const frontFaceCW = object.isMesh && object.matrixWorld.determinant() < 0;

		const program = this.setProgram(camera, scene, material, object);

		this.state.setMaterial(material, frontFaceCW);

		//

		let index = geometry.index;
		const position = geometry.attributes.position;

		//

		if (index === null) {
			if (position === undefined || position.count === 0) return;
		} else if (index.count === 0) {
			return;
		}

		//

		let rangeFactor = 1;

		if (material.wireframe === true) {
			index = this.geometries.getWireframeAttribute(geometry);
			rangeFactor = 2;
		}

		if (material.morphTargets || material.morphNormals) {
			this.morphtargets.update(object, geometry, material, program);
		}

		this.bindingStates.setup(object, material, program, geometry, index);

		let attribute: IBuffered;
		let renderer = this.bufferRenderer;

		if (index !== null) {
			attribute = this.attributes.get(index);

			this.indexedBufferRenderer.setIndex(attribute);
			renderer = this.indexedBufferRenderer;
		}

		//

		const dataCount = index !== null ? index.count : position.count;

		const rangeStart = geometry.drawRange.start * rangeFactor;
		const rangeCount = geometry.drawRange.count * rangeFactor;

		const groupStart = group !== null ? group.start * rangeFactor : 0;
		const groupCount = group !== null ? group.count * rangeFactor : Infinity;

		const drawStart = Math.max(rangeStart, groupStart);
		const drawEnd =
			Math.min(dataCount, rangeStart + rangeCount, groupStart + groupCount) - 1;

		const drawCount = Math.max(0, drawEnd - drawStart + 1);

		if (drawCount === 0) return;

		//

		if (object.isMesh) {
			if (material.wireframe === true) {
				this.state.setLineWidth(
					material.wireframeLinewidth * this._getTargetPixelRatio()
				);
				renderer.setMode(this.gl.LINES);
			} else {
				renderer.setMode(this.gl.TRIANGLES);
			}
		} else if (object.isLine) {
			const line = object as Line;

			let lineWidth = material.linewidth;

			if (lineWidth === undefined) lineWidth = 1; // Not using Line*Material

			this.state.setLineWidth(lineWidth * this._getTargetPixelRatio());

			if (line.isLineSegments) {
				renderer.setMode(this.gl.LINES);
			} else if (line.isLineLoop) {
				renderer.setMode(this.gl.LINE_LOOP);
			} else {
				renderer.setMode(this.gl.LINE_STRIP);
			}
		} else if (object.isPoints) {
			renderer.setMode(this.gl.POINTS);
		} else if (object.isSprite) {
			renderer.setMode(this.gl.TRIANGLES);
		}

		if (object.isInstancedMesh) {
			renderer.renderInstances(drawStart, drawCount, object.count);
		} else if (geometry instanceof InstancedBufferGeometry) {
			const instanceCount = Math.min(
				geometry.instanceCount,
				geometry._maxInstanceCount
			);

			renderer.renderInstances(drawStart, drawCount, instanceCount);
		} else {
			renderer.render(drawStart, drawCount);
		}
	}

	// Compile
	compile(scene: Scene | Mesh, camera: Camera) {
		this._currentRenderState = this.renderStates.get(scene);
		this._currentRenderState.init();

		scene.traverseVisible((object) => {
			if (object.isLight && object.layers.test(camera.layers)) {
				this._currentRenderState.pushLight(object);

				if (object.castShadow) {
					this._currentRenderState.pushShadow(object);
				}
			}
		});

		this._currentRenderState.setupLights();

		const compiled = new WeakMap();

		scene.traverse((object) => {
			const material = object.material;

			if (material) {
				if (Array.isArray(material)) {
					for (let i = 0; i < material.length; i++) {
						const material2 = material[i];

						if (!compiled.has(material2)) {
							this.initMaterial(material2, scene as any, object);
							compiled.set(material2, {});
						}
					}
				} else if (!compiled.has(material)) {
					this.initMaterial(material, scene as any, object);
					compiled.set(material, {});
				}
			}
		});
	}

	onAnimationFrame(time: DOMHighResTimeStamp, frame: XRFrame) {
		if (this.xr.isPresenting) return;
		if (this.onAnimationFrameCallback)
			this.onAnimationFrameCallback(time, frame);
	}

	setAnimationLoop(callback: XRFrameRequestCallback | undefined) {
		this.onAnimationFrameCallback = callback;
		this.xr.setAnimationLoop(callback);

		callback === null ? this.animation.stop() : this.animation.start();
	}

	render(scene: Scene | Mesh, camera: Camera) {
		if (camera !== undefined && camera.isCamera !== true) {
			console.error(
				"WebGLRenderer.render: camera is not an instance of Camera."
			);
			return;
		}

		if (this._isContextLost === true) return;

		// reset caching for this frame

		this.bindingStates.resetDefaultState();
		this._currentMaterialId = -1;
		this._currentCamera = null;

		// update scene graph

		if (scene.autoUpdate === true) scene.updateMatrixWorld();

		// update camera matrices and frustum

		if (camera.parent === null) camera.updateMatrixWorld();

		if (this.xr.enabled === true && this.xr.isPresenting === true) {
			camera = this.xr.getCamera(camera);
		}

		//
		if (scene.isScene === true)
			scene.onBeforeRender(this, scene, camera, this._currentRenderTarget);

		this._currentRenderState = this.renderStates.get(
			scene,
			this._renderStateStack.length
		);
		this._currentRenderState.init();

		this._renderStateStack.push(this._currentRenderState);

		this._projScreenMatrix.multiplyMatrices(
			camera.projectionMatrix,
			camera.matrixWorldInverse
		);
		this._frustum.setFromProjectionMatrix(this._projScreenMatrix);

		this._localClippingEnabled = this.localClippingEnabled;
		this._clippingEnabled = this.clipping.init(
			this.clippingPlanes,
			this._localClippingEnabled,
			camera
		);

		this._currentRenderList = this.renderLists.get(
			scene,
			this._renderListStack.length
		);
		this._currentRenderList.init();

		this._renderListStack.push(this._currentRenderList);

		this.projectObject(scene, camera, 0, this.sortObjects);

		this._currentRenderList.finish();

		if (this.sortObjects === true) {
			this._currentRenderList.sort(this._opaqueSort, this._transparentSort);
		}

		//

		if (this._clippingEnabled === true) this.clipping.beginShadows();

		const shadowsArray = this._currentRenderState.shadowsArray;

		this.shadowMap.render(shadowsArray, scene, camera);

		this._currentRenderState.setupLights();
		this._currentRenderState.setupLightsView(camera);

		if (this._clippingEnabled === true) this.clipping.endShadows();

		if (this.info.autoReset === true) this.info.reset();

		// if (renderTarget !== undefined) {
		// 	this.setRenderTarget(renderTarget);
		// }

		this.background.render(this._currentRenderList, scene, camera);

		// render scene

		const opaqueObjects = this._currentRenderList.opaque;
		const transparentObjects = this._currentRenderList.transparent;

		if (opaqueObjects.length > 0)
			this.renderObjects(opaqueObjects, scene, camera);
		if (transparentObjects.length > 0)
			this.renderObjects(transparentObjects, scene, camera);

		//

		if (scene.isScene === true) scene.onAfterRender(this, scene, camera);

		//

		if (this._currentRenderTarget !== null) {
			// Generate mipmap if we're using any kind of mipmap filtering

			this.textures.updateRenderTargetMipmap(this._currentRenderTarget);

			// resolve multisample renderbuffers to a single-sample texture if necessary

			this.textures.updateMultisampleRenderTarget(this._currentRenderTarget);
		}

		// Ensure depth buffer writing is enabled so it can be cleared on next render

		this.state.depthBuffer.setTest(true);
		this.state.depthBuffer.setMask(true);
		this.state.colorBuffer.setMask(true);

		this.state.setPolygonOffset(false);

		// this._gl.finish();

		this._renderStateStack.pop();

		if (this._renderStateStack.length > 0) {
			this._currentRenderState =
				this._renderStateStack[this._renderStateStack.length - 1];
		} else {
			this._currentRenderState = null;
		}

		this._renderListStack.pop();

		if (this._renderListStack.length > 0) {
			this._currentRenderList =
				this._renderListStack[this._renderListStack.length - 1];
		} else {
			this._currentRenderList = null;
		}
	}

	projectObject(
		object: Object3D,
		camera: Camera,
		groupOrder: number,
		sortObjects: boolean
	) {
		if (object.visible === false) return;

		const visible = object.layers.test(camera.layers);

		if (visible) {
			if (object.isGroup) {
				groupOrder = object.renderOrder;
			} else if (object.isLOD) {
				if (object.autoUpdate === true) object.update(camera);
			} else if (object.isLight) {
				this._currentRenderState.pushLight(object);

				if (object.castShadow) {
					this._currentRenderState.pushShadow(object);
				}
			} else if (object.isSprite) {
				if (!object.frustumCulled || this._frustum.intersectsSprite(object)) {
					if (sortObjects) {
						this._vector3
							.setFromMatrixPosition(object.matrixWorld)
							.applyMatrix4(this._projScreenMatrix);
					}

					const geometry = this.objects.update(object);
					const material = object.material;

					if (material.visible) {
						this._currentRenderList.push(
							object,
							geometry,
							material,
							groupOrder,
							this._vector3.z,
							null
						);
					}
				}
			} else if (object.isImmediateRenderObject) {
				if (sortObjects) {
					this._vector3
						.setFromMatrixPosition(object.matrixWorld)
						.applyMatrix4(this._projScreenMatrix);
				}

				this._currentRenderList.push(
					object,
					null,
					object.material,
					groupOrder,
					this._vector3.z,
					null
				);
			} else if (object.isMesh || object.isLine || object.isPoints) {
				if (object.isSkinnedMesh) {
					// update skeleton only once in a frame

					if (object.skeleton.frame !== this.info.render.frame) {
						object.skeleton.update();
						object.skeleton.frame = this.info.render.frame;
					}
				}

				if (!object.frustumCulled || this._frustum.intersectsObject(object)) {
					if (sortObjects) {
						this._vector3
							.setFromMatrixPosition(object.matrixWorld)
							.applyMatrix4(this._projScreenMatrix);
					}

					const geometry = this.objects.update(object);
					const material = object.material;

					if (Array.isArray(material)) {
						const groups = geometry.groups;

						for (let i = 0, l = groups.length; i < l; i++) {
							const group = groups[i];
							const groupMaterial = material[group.materialIndex];

							if (groupMaterial && groupMaterial.visible) {
								this._currentRenderList.push(
									object,
									geometry,
									groupMaterial,
									groupOrder,
									this._vector3.z,
									group
								);
							}
						}
					} else if (material.visible) {
						this._currentRenderList.push(
							object,
							geometry,
							material,
							groupOrder,
							this._vector3.z,
							null
						);
					}
				}
			}
		}

		const children = object.children;

		for (let i = 0, l = children.length; i < l; i++) {
			this.projectObject(children[i], camera, groupOrder, sortObjects);
		}
	}

	renderObjects(renderList: RenderItem[], scene: Object3D, camera: Camera) {
		const overrideMaterial =
			scene instanceof Scene ? scene.overrideMaterial : null;

		for (let i = 0, l = renderList.length; i < l; i++) {
			const renderItem = renderList[i];

			const object = renderItem.object;
			const geometry = renderItem.geometry;
			const material =
				overrideMaterial === null ? renderItem.material : overrideMaterial;
			const group = renderItem.group;

			if (camera instanceof ArrayCamera) {
				const cameras = camera.cameras;

				for (let j = 0, jl = cameras.length; j < jl; j++) {
					const camera2 = cameras[j];

					if (object.layers.test(camera2.layers)) {
						this.state.viewport(this._currentViewport.copy(camera2.viewport));

						this._currentRenderState.setupLightsView(camera2);

						this.renderObject(
							object,
							scene,
							camera2,
							geometry,
							material,
							group
						);
					}
				}
			} else {
				this.renderObject(object, scene, camera, geometry, material, group);
			}
		}
	}

	renderObject(
		object: Object3D,
		scene: Object3D,
		camera: Camera,
		geometry: BufferGeometry,
		material: Material,
		group
	) {
		object.onBeforeRender(this, scene, camera, geometry, material, group);

		object.modelViewMatrix.multiplyMatrices(
			camera.matrixWorldInverse,
			object.matrixWorld
		);
		object.normalMatrix.getNormalMatrix(object.modelViewMatrix);

		material.onBeforeRender(this, scene, camera, geometry, material, group);

		if (object instanceof ImmediateRenderObject) {
			const program = this.setProgram(camera, scene, material, object);

			this.state.setMaterial(material);

			this.bindingStates.reset();

			this.renderObjectImmediate(object, program);
		} else {
			this.renderBufferDirect(camera, scene, geometry, material, object, group);
		}

		object.onAfterRender(this, scene, camera, geometry, material, group);
	}

	initMaterial(material: Material, scene: Scene, object: Object3D) {
		if (scene.isScene !== true) scene = this._emptyScene; // scene could be a Mesh, Line, Points, ...

		const materialProperties = this.properties.get(material);

		const lights = this._currentRenderState.lights;
		const shadowsArray = this._currentRenderState.shadowsArray;

		const lightsStateVersion = lights.state.version;

		const parameters: WebGlProgramsParameters = this.programCache.getParameters(
			material,
			lights.state,
			shadowsArray,
			scene,
			object
		);
		const programCacheKey = this.programCache.getProgramCacheKey(parameters);

		let program = materialProperties.program;
		let programChange = true;

		// always update environment and fog - changing these trigger an initMaterial call, but it's possible that the program doesn't change

		materialProperties.environment = material.isMeshStandardMaterial
			? scene.environment
			: null;
		materialProperties.fog = scene.fog;
		materialProperties.envMap = this.cubemaps.get(
			material.envMap || materialProperties.environment
		);

		if (program === undefined) {
			// new material
			material.addEventListener("dispose", (e) => this._onMaterialDispose(e));
		} else if (program.cacheKey !== programCacheKey) {
			// changed glsl or parameters
			this.releaseMaterialProgramReference(material);
		} else if (materialProperties.lightsStateVersion !== lightsStateVersion) {
			programChange = false;
		} else if (parameters.shaderID !== undefined) {
			// same glsl and uniform list
			return;
		} else {
			// only rebuild uniform list
			programChange = false;
		}

		if (programChange) {
			parameters.uniforms = this.programCache.getUniforms(material);

			material.onBeforeCompile(parameters, this);

			program = this.programCache.acquireProgram(parameters, programCacheKey);

			materialProperties.program = program;
			materialProperties.uniforms = parameters.uniforms;
			materialProperties.outputEncoding = parameters.outputEncoding;
		}

		const uniforms = materialProperties.uniforms;

		if (
			(!material.isShaderMaterial &&
				!(material instanceof RawShaderMaterial)) ||
			material.clipping === true
		) {
			materialProperties.numClippingPlanes = this.clipping.numPlanes;
			materialProperties.numIntersection = this.clipping.numIntersection;
			uniforms.clippingPlanes = this.clipping.uniform;
		}

		// store the light setup it was created for

		materialProperties.needsLights = this.materialNeedsLights(material);
		materialProperties.lightsStateVersion = lightsStateVersion;

		if (materialProperties.needsLights) {
			// wire up the material to this renderer's lighting state

			uniforms.ambientLightColor.value = lights.state.ambient;
			uniforms.lightProbe.value = lights.state.probe;
			uniforms.directionalLights.value = lights.state.directional;
			uniforms.directionalLightShadows.value = lights.state.directionalShadow;
			uniforms.spotLights.value = lights.state.spot;
			uniforms.spotLightShadows.value = lights.state.spotShadow;
			uniforms.rectAreaLights.value = lights.state.rectArea;
			uniforms.ltc_1.value = lights.state.rectAreaLTC1;
			uniforms.ltc_2.value = lights.state.rectAreaLTC2;
			uniforms.pointLights.value = lights.state.point;
			uniforms.pointLightShadows.value = lights.state.pointShadow;
			uniforms.hemisphereLights.value = lights.state.hemi;

			uniforms.directionalShadowMap.value = lights.state.directionalShadowMap;
			uniforms.directionalShadowMatrix.value =
				lights.state.directionalShadowMatrix;
			uniforms.spotShadowMap.value = lights.state.spotShadowMap;
			uniforms.spotShadowMatrix.value = lights.state.spotShadowMatrix;
			uniforms.pointShadowMap.value = lights.state.pointShadowMap;
			uniforms.pointShadowMatrix.value = lights.state.pointShadowMatrix;
			// TODO (abelnation): add area lights shadow info to uniforms
		}

		const progUniforms: WebGLUniforms = (
			materialProperties.program as WebGLProgram
		).getUniforms();
		const uniformsList = WebGLUniforms.seqWithValue(progUniforms.seq, uniforms);

		materialProperties.uniformsList = uniformsList;
	}

	setProgram(
		camera: Camera,
		sce: Object3D,
		material: Material,
		object: Object3D
	): WebGLProgram {
		if (!(sce instanceof Scene)) sce = this._emptyScene; // scene could be a Mesh, Line, Points, ...
		const scene = sce as Scene;

		this.textures.resetTextureUnits();

		const fog = scene.fog;
		const environment = material.isMeshStandardMaterial
			? scene.environment
			: null;
		const encoding =
			this._currentRenderTarget === null
				? this.outputEncoding
				: this._currentRenderTarget.texture.encoding;
		const envMap = this.cubemaps.get(material.envMap || environment);

		const materialProperties = this.properties.get(material);
		const lights = this._currentRenderState.lights;

		if (this._clippingEnabled === true) {
			if (
				this._localClippingEnabled === true ||
				camera !== this._currentCamera
			) {
				const useCache =
					camera === this._currentCamera &&
					material.id === this._currentMaterialId;

				// we might want to call this function with some ClippingGroup
				// object instead of the material, once it becomes feasible
				// (#8465, #8379)
				this.clipping.setState(material, camera, useCache);
			}
		}

		if (material.version === materialProperties.__version) {
			if (material.fog && materialProperties.fog !== fog) {
				this.initMaterial(material, scene, object);
			} else if (materialProperties.environment !== environment) {
				this.initMaterial(material, scene, object);
			} else if (
				materialProperties.needsLights &&
				materialProperties.lightsStateVersion !== lights.state.version
			) {
				this.initMaterial(material, scene, object);
			} else if (
				materialProperties.numClippingPlanes !== undefined &&
				(materialProperties.numClippingPlanes !== this.clipping.numPlanes ||
					materialProperties.numIntersection !== this.clipping.numIntersection)
			) {
				this.initMaterial(material, scene, object);
			} else if (materialProperties.outputEncoding !== encoding) {
				this.initMaterial(material, scene, object);
			} else if (materialProperties.envMap !== envMap) {
				this.initMaterial(material, scene, object);
			}
		} else {
			this.initMaterial(material, scene, object);
			materialProperties.__version = material.version;
		}

		let refreshProgram = false;
		let refreshMaterial = false;
		let refreshLights = false;

		const program = materialProperties.program;
		const p_uniforms = program.getUniforms();
		const m_uniforms = materialProperties.uniforms;

		if (this.state.useProgram(program.program)) {
			refreshProgram = true;
			refreshMaterial = true;
			refreshLights = true;
		}

		if (material.id !== this._currentMaterialId) {
			this._currentMaterialId = material.id;

			refreshMaterial = true;
		}

		if (refreshProgram || this._currentCamera !== camera) {
			p_uniforms.setValue(this.gl, "projectionMatrix", camera.projectionMatrix);

			if (this.capabilities.logarithmicDepthBuffer) {
				p_uniforms.setValue(
					this.gl,
					"logDepthBufFC",
					2.0 / (Math.log(camera.far + 1.0) / Math.LN2)
				);
			}

			if (this._currentCamera !== camera) {
				this._currentCamera = camera;

				// lighting uniforms depend on the camera so enforce an update
				// now, in case this material supports lights - or later, when
				// the next material that does gets activated:

				refreshMaterial = true; // set to true on material change
				refreshLights = true; // remains set until update done
			}

			// load material specific uniforms
			// (shader material also gets them for the sake of genericity)

			if (
				material.isShaderMaterial ||
				material.isMeshPhongMaterial ||
				material.isMeshToonMaterial ||
				material.isMeshStandardMaterial ||
				material.envMap
			) {
				const uCamPos = p_uniforms.map.cameraPosition;

				if (uCamPos !== undefined) {
					uCamPos.setValue(
						this.gl,
						this._vector3.setFromMatrixPosition(camera.matrixWorld)
					);
				}
			}

			if (
				material.isMeshPhongMaterial ||
				material.isMeshToonMaterial ||
				material.isMeshLambertMaterial ||
				material.isMeshBasicMaterial ||
				material.isMeshStandardMaterial ||
				material.isShaderMaterial
			) {
				p_uniforms.setValue(
					this.gl,
					"isOrthographic",
					camera.isOrthographicCamera === true
				);
			}

			if (
				material.isMeshPhongMaterial ||
				material.isMeshToonMaterial ||
				material.isMeshLambertMaterial ||
				material.isMeshBasicMaterial ||
				material.isMeshStandardMaterial ||
				material.isShaderMaterial ||
				material.isShadowMaterial ||
				material.skinning
			) {
				p_uniforms.setValue(this.gl, "viewMatrix", camera.matrixWorldInverse);
			}
		}

		// skinning uniforms must be set even if material didn't change
		// auto-setting of texture unit for bone texture must go before other textures
		// otherwise textures used for skinning can take over texture units reserved for other material textures

		if (material.skinning) {
			p_uniforms.setOptional(this.gl, object, "bindMatrix");
			p_uniforms.setOptional(this.gl, object, "bindMatrixInverse");

			const skeleton = object.skeleton;

			if (skeleton) {
				const bones = skeleton.bones;

				if (this.capabilities.floatVertexTextures) {
					if (skeleton.boneTexture === null) {
						// layout (1 matrix = 4 pixels)
						//      RGBA RGBA RGBA RGBA (=> column1, column2, column3, column4)
						//  with  8x8  pixel texture max   16 bones * 4 pixels =  (8 * 8)
						//       16x16 pixel texture max   64 bones * 4 pixels = (16 * 16)
						//       32x32 pixel texture max  256 bones * 4 pixels = (32 * 32)
						//       64x64 pixel texture max 1024 bones * 4 pixels = (64 * 64)

						let size = Math.sqrt(bones.length * 4); // 4 pixels needed for 1 matrix
						size = ceilPowerOfTwo(size);
						size = Math.max(size, 4);

						const boneMatrices = new Float32Array(size * size * 4); // 4 floats per RGBA pixel
						boneMatrices.set(skeleton.boneMatrices); // copy current values

						const boneTexture = new DataTexture(
							boneMatrices,
							size,
							size,
							RGBAFormat,
							FloatType
						);

						skeleton.boneMatrices = boneMatrices;
						skeleton.boneTexture = boneTexture;
						skeleton.boneTextureSize = size;
					}

					p_uniforms.setValue(
						this.gl,
						"boneTexture",
						skeleton.boneTexture,
						this.textures
					);
					p_uniforms.setValue(
						this.gl,
						"boneTextureSize",
						skeleton.boneTextureSize
					);
				} else {
					p_uniforms.setOptional(this.gl, skeleton, "boneMatrices");
				}
			}
		}

		if (
			refreshMaterial ||
			materialProperties.receiveShadow !== object.receiveShadow
		) {
			materialProperties.receiveShadow = object.receiveShadow;
			p_uniforms.setValue(this.gl, "receiveShadow", object.receiveShadow);
		}

		if (refreshMaterial) {
			p_uniforms.setValue(
				this.gl,
				"toneMappingExposure",
				this.toneMappingExposure
			);

			if (materialProperties.needsLights) {
				// the current material requires lighting info

				// note: all lighting uniforms are always set correctly
				// they simply reference the renderer's state for their
				// values
				//
				// use the current material's .needsUpdate flags to set
				// the GL state when required

				this.markUniformsLightsNeedsUpdate(m_uniforms, refreshLights);
			}

			// refresh uniforms common to several materials

			if (fog && material.fog) {
				this.materials.refreshFogUniforms(m_uniforms, fog);
			}

			this.materials.refreshMaterialUniforms(
				m_uniforms,
				material,
				this._pixelRatio,
				this._height
			);

			WebGLUniforms.upload(
				this.gl,
				materialProperties.uniformsList,
				m_uniforms,
				this.textures
			);
		}

		if (material.isShaderMaterial && material.uniformsNeedUpdate === true) {
			WebGLUniforms.upload(
				this.gl,
				materialProperties.uniformsList,
				m_uniforms,
				this.textures
			);
			material.uniformsNeedUpdate = false;
		}

		if (material.isSpriteMaterial) {
			p_uniforms.setValue(this.gl, "center", (object as Sprite).center);
		}

		// common matrices

		p_uniforms.setValue(this.gl, "modelViewMatrix", object.modelViewMatrix);
		p_uniforms.setValue(this.gl, "normalMatrix", object.normalMatrix);
		p_uniforms.setValue(this.gl, "modelMatrix", object.matrixWorld);

		return program;
	}

	// If uniforms are marked as clean, they don't need to be loaded to the GPU.

	markUniformsLightsNeedsUpdate(uniforms, value: boolean) {
		uniforms.ambientLightColor.needsUpdate = value;
		uniforms.lightProbe.needsUpdate = value;

		uniforms.directionalLights.needsUpdate = value;
		uniforms.directionalLightShadows.needsUpdate = value;
		uniforms.pointLights.needsUpdate = value;
		uniforms.pointLightShadows.needsUpdate = value;
		uniforms.spotLights.needsUpdate = value;
		uniforms.spotLightShadows.needsUpdate = value;
		uniforms.rectAreaLights.needsUpdate = value;
		uniforms.hemisphereLights.needsUpdate = value;
	}

	materialNeedsLights(material: Material) {
		return (
			material.isMeshLambertMaterial ||
			material.isMeshToonMaterial ||
			material.isMeshPhongMaterial ||
			material.isMeshStandardMaterial ||
			material.isShadowMaterial ||
			(material instanceof ShaderMaterial && material.lights === true)
		);
	}

	//
	setFramebuffer(value: GLESFramebuffer) {
		if (this._framebuffer !== value && this._currentRenderTarget === null)
			this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, value);

		this._framebuffer = value;
	}

	getActiveCubeFace() {
		return this._currentActiveCubeFace;
	}

	getActiveMipmapLevel() {
		return this._currentActiveMipmapLevel;
	}

	getRenderTarget() {
		return this._currentRenderTarget;
	}

	setRenderTarget(
		renderTarget: WebGLRenderTarget | undefined,
		activeCubeFace = 0,
		activeMipmapLevel = 0
	) {
		this._currentRenderTarget = renderTarget;
		this._currentActiveCubeFace = activeCubeFace;
		this._currentActiveMipmapLevel = activeMipmapLevel;

		if (
			renderTarget &&
			this.properties.get(renderTarget).__webglFramebuffer === undefined
		) {
			this.textures.setupRenderTarget(renderTarget);
		}

		let framebuffer = this._framebuffer;
		let isCube = false;
		let isRenderTarget3D = false;

		if (renderTarget) {
			const texture = renderTarget.texture;

			if (texture.isDataTexture3D || texture.isDataTexture2DArray) {
				isRenderTarget3D = true;
			}

			const __webglFramebuffer =
				this.properties.get(renderTarget).__webglFramebuffer;

			if (renderTarget.isWebGLCubeRenderTarget) {
				framebuffer = __webglFramebuffer[activeCubeFace];
				isCube = true;
			} else if (renderTarget.isWebGLMultisampleRenderTarget) {
				framebuffer =
					this.properties.get(renderTarget).__webglMultisampledFramebuffer;
			} else {
				framebuffer = __webglFramebuffer;
			}

			this._currentViewport.copy(renderTarget.viewport);
			this._currentScissor.copy(renderTarget.scissor);
			this._currentScissorTest = renderTarget.scissorTest;
		} else {
			this._currentViewport
				.copy(this._viewport)
				.multiplyScalar(this._pixelRatio)
				.floor();
			this._currentScissor
				.copy(this._scissor)
				.multiplyScalar(this._pixelRatio)
				.floor();
			this._currentScissorTest = this._scissorTest;
		}

		if (this._currentFramebuffer !== framebuffer) {
			this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer);
			this._currentFramebuffer = framebuffer;
		}

		this.state.viewport(this._currentViewport);
		this.state.scissor(this._currentScissor);
		this.state.setScissorTest(this._currentScissorTest);

		if (isCube) {
			const textureProperties = this.properties.get(renderTarget.texture);
			this.gl.framebufferTexture2D(
				this.gl.FRAMEBUFFER,
				this.gl.COLOR_ATTACHMENT0,
				this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + activeCubeFace,
				textureProperties.__webglTexture,
				activeMipmapLevel
			);
		} else if (isRenderTarget3D) {
			const textureProperties = this.properties.get(renderTarget.texture);
			const layer = activeCubeFace || 0;
			this.gl.framebufferTextureLayer(
				this.gl.FRAMEBUFFER,
				this.gl.COLOR_ATTACHMENT0,
				textureProperties.__webglTexture,
				activeMipmapLevel || 0,
				layer
			);
		}
	}

	readRenderTargetPixels(
		renderTarget,
		x,
		y,
		width,
		height,
		buffer,
		activeCubeFaceIndex
	) {
		if (!(renderTarget && renderTarget.isWebGLRenderTarget)) {
			console.error(
				"WebGLRenderer.readRenderTargetPixels: renderTarget is not WebGLRenderTarget."
			);
			return;
		}

		let framebuffer = this.properties.get(renderTarget).__webglFramebuffer;

		if (
			renderTarget.isWebGLCubeRenderTarget &&
			activeCubeFaceIndex !== undefined
		) {
			framebuffer = framebuffer[activeCubeFaceIndex];
		}

		if (framebuffer) {
			let restore = false;

			if (framebuffer !== this._currentFramebuffer) {
				this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer);

				restore = true;
			}

			try {
				const texture = renderTarget.texture;
				const textureFormat = texture.format;
				const textureType = texture.type;

				if (
					textureFormat !== RGBAFormat &&
					this.utils.convert(textureFormat) !==
						this.gl.getParameter(this.gl.IMPLEMENTATION_COLOR_READ_FORMAT)
				) {
					console.error(
						"WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format."
					);
					return;
				}

				const halfFloatSupportedByExt =
					textureType === HalfFloatType &&
					(this.extensions.has("EXT_color_buffer_half_float") ||
						(this.capabilities.isWebGL2 &&
							this.extensions.has("EXT_color_buffer_float")));

				if (
					textureType !== UnsignedByteType &&
					this.utils.convert(textureType) !==
						this.gl.getParameter(this.gl.IMPLEMENTATION_COLOR_READ_TYPE) && // Edge and Chrome Mac < 52 (#9513)
					!(
						textureType === FloatType &&
						(this.capabilities.isWebGL2 ||
							this.extensions.has("OES_texture_float") ||
							this.extensions.has("WEBGL_color_buffer_float"))
					) && // Chrome Mac >= 52 and Firefox
					!halfFloatSupportedByExt
				) {
					console.error(
						"WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type."
					);
					return;
				}

				if (
					this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER) ===
					this.gl.FRAMEBUFFER_COMPLETE
				) {
					// the following if statement ensures valid read requests (no out-of-bounds pixels, see #8604)

					if (
						x >= 0 &&
						x <= renderTarget.width - width &&
						y >= 0 &&
						y <= renderTarget.height - height
					) {
						this.gl.readPixels(
							x,
							y,
							width,
							height,
							this.utils.convert(textureFormat),
							this.utils.convert(textureType),
							buffer
						);
					}
				} else {
					console.error(
						"WebGLRenderer.readRenderTargetPixels: readPixels from renderTarget failed. Framebuffer not complete."
					);
				}
			} finally {
				if (restore) {
					this.gl.bindFramebuffer(
						this.gl.FRAMEBUFFER,
						this._currentFramebuffer
					);
				}
			}
		}
	}

	copyFramebufferToTexture(position, texture, level = 0) {
		const levelScale = Math.pow(2, -level);
		const width = Math.floor(texture.image.width * levelScale);
		const height = Math.floor(texture.image.height * levelScale);
		const glFormat = this.utils.convert(texture.format);
		this.textures.setTexture2D(texture, 0);
		this.gl.copyTexImage2D(
			this.gl.TEXTURE_2D,
			level,
			glFormat,
			position.x,
			position.y,
			width,
			height,
			0
		);
		this.state.unbindTexture();
	}

	copyTextureToTexture(position: Vector3, srcTexture: Texture, dstTexture, level = 0) {
		const width = srcTexture.image.width;
		const height = srcTexture.image.height;
		const glFormat = this.utils.convert(dstTexture.format);
		const glType = this.utils.convert(dstTexture.type);

		this.textures.setTexture2D(dstTexture, 0);

		// As another texture upload may have changed pixelStorei
		// parameters, make sure they are correct for the dstTexture
		this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, dstTexture.flipY);
		this.gl.pixelStorei(
			this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
			dstTexture.premultiplyAlpha
		);
		this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, dstTexture.unpackAlignment);
		if (srcTexture.isDataTexture) {
			this.gl.texSubImage2D(
				this.gl.TEXTURE_2D,
				level,
				position.x,
				position.y,
				width,
				height,
				glFormat,
				glType,
				srcTexture.image.data as ArrayBufferView
			);
		} else {
			if (srcTexture.isCompressedTexture) {
				this.gl.compressedTexSubImage2D(
					this.gl.TEXTURE_2D,
					level,
					position.x,
					position.y,
					srcTexture.mipmaps[0].width,
					srcTexture.mipmaps[0].height,
					glFormat,
					srcTexture.mipmaps[0].data
				);
			} else {
				this.gl.texSubImage2D(
					this.gl.TEXTURE_2D,
					level,
					position.x,
					position.y,
					glFormat,
					glType,
					srcTexture.image as TexImageSource
				);
			}
		}

		// Generate mipmaps only when copying level 0
		if (level === 0 && dstTexture.generateMipmaps)
			this.gl.generateMipmap(this.gl.TEXTURE_2D);

		this.state.unbindTexture();
	}

	copyTextureToTexture3D(
		sourceBox,
		position,
		srcTexture,
		dstTexture,
		level = 0
	) {
		if (this.isWebGL1Renderer) {
			console.warn(
				"WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2."
			);
			return;
		}

		const { width, height, data } = srcTexture.image;
		const glFormat = this.utils.convert(dstTexture.format);
		const glType = this.utils.convert(dstTexture.type);
		let glTarget;

		if (dstTexture.isDataTexture3D) {
			this.textures.setTexture3D(dstTexture, 0);
			glTarget = this.gl.TEXTURE_3D;
		} else if (dstTexture.isDataTexture2DArray) {
			this.textures.setTexture2DArray(dstTexture, 0);
			glTarget = this.gl.TEXTURE_2D_ARRAY;
		} else {
			console.warn(
				"WebGLRenderer.copyTextureToTexture3D: only supports DataTexture3D and DataTexture2DArray."
			);
			return;
		}

		this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, dstTexture.flipY);
		this.gl.pixelStorei(
			this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
			dstTexture.premultiplyAlpha
		);
		this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, dstTexture.unpackAlignment);

		const unpackRowLen = this.gl.getParameter(this.gl.UNPACK_ROW_LENGTH);
		const unpackImageHeight = this.gl.getParameter(this.gl.UNPACK_IMAGE_HEIGHT);
		const unpackSkipPixels = this.gl.getParameter(this.gl.UNPACK_SKIP_PIXELS);
		const unpackSkipRows = this.gl.getParameter(this.gl.UNPACK_SKIP_ROWS);
		const unpackSkipImages = this.gl.getParameter(this.gl.UNPACK_SKIP_IMAGES);

		this.gl.pixelStorei(this.gl.UNPACK_ROW_LENGTH, width);
		this.gl.pixelStorei(this.gl.UNPACK_IMAGE_HEIGHT, height);
		this.gl.pixelStorei(this.gl.UNPACK_SKIP_PIXELS, sourceBox.min.x);
		this.gl.pixelStorei(this.gl.UNPACK_SKIP_ROWS, sourceBox.min.y);
		this.gl.pixelStorei(this.gl.UNPACK_SKIP_IMAGES, sourceBox.min.z);

		this.gl.texSubImage3D(
			glTarget,
			level,
			position.x,
			position.y,
			position.z,
			sourceBox.max.x - sourceBox.min.x + 1,
			sourceBox.max.y - sourceBox.min.y + 1,
			sourceBox.max.z - sourceBox.min.z + 1,
			glFormat,
			glType,
			data
		);

		this.gl.pixelStorei(this.gl.UNPACK_ROW_LENGTH, unpackRowLen);
		this.gl.pixelStorei(this.gl.UNPACK_IMAGE_HEIGHT, unpackImageHeight);
		this.gl.pixelStorei(this.gl.UNPACK_SKIP_PIXELS, unpackSkipPixels);
		this.gl.pixelStorei(this.gl.UNPACK_SKIP_ROWS, unpackSkipRows);
		this.gl.pixelStorei(this.gl.UNPACK_SKIP_IMAGES, unpackSkipImages);

		// Generate mipmaps only when copying level 0
		if (level === 0 && dstTexture.generateMipmaps)
			this.gl.generateMipmap(glTarget);

		this.state.unbindTexture();
	}

	initTexture(texture) {
		this.textures.setTexture2D(texture, 0);

		this.state.unbindTexture();
	}

	resetState() {
		this.state.reset();
		this.bindingStates.reset();
	}
}
