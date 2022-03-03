import {
	LessEqualDepth,
	CullFaceFront,
	CullFaceBack,
	CullFaceNone,
	DoubleSide,
	BackSide,
	CustomBlending,
	MultiplyBlending,
	SubtractiveBlending,
	AdditiveBlending,
	NoBlending,
	NormalBlending,
	AddEquation,
	SubtractEquation,
	ReverseSubtractEquation,
	MinEquation,
	MaxEquation,
	ZeroFactor,
	OneFactor,
	SrcColorFactor,
	SrcAlphaFactor,
	SrcAlphaSaturateFactor,
	DstColorFactor,
	DstAlphaFactor,
	OneMinusSrcColorFactor,
	OneMinusSrcAlphaFactor,
	OneMinusDstColorFactor,
	OneMinusDstAlphaFactor,
	Material,
	Vector4,
} from "../../";

import { WebGLCapabilities } from "./WebGLCapabilities";
import { WebGLExtensions } from "./WebGLExtensions";
import { ColorBuffer, DepthBuffer, StencilBuffer } from "./WebGLStateBuffers";

class WebGLState {
	_gl: GLESRenderingContext;

	public isWebGL2: boolean;

	colorBuffer: ColorBuffer;
	depthBuffer: DepthBuffer;
	stencilBuffer: StencilBuffer;

	enabledCapabilities = {};

	currentProgram: GLESProgram;

	currentBlendingEnabled = false;
	currentBlending: number;
	currentBlendEquation: number;
	currentBlendSrc = null;
	currentBlendDst = null;
	currentBlendEquationAlpha = null;
	currentBlendSrcAlpha = null;
	currentBlendDstAlpha = null;
	currentPremultipledAlpha = false;

	currentFlipSided: boolean;
	currentCullFace: number;

	currentLineWidth: number;

	currentPolygonOffsetFactor: number;
	currentPolygonOffsetUnits: number;

	maxTextures: number;
	glVersion: string;

	lineWidthAvailable = false;
	version = 0;

	currentTextureSlot: number;
	currentBoundTextures = {};

	currentScissor = new Vector4();
	currentViewport = new Vector4();

	emptyTextures = {};

	equationToGL;
	factorToGL;

	constructor(
		gl: GLESRenderingContext,
		extensions: WebGLExtensions,
		capabilities: WebGLCapabilities
	) {
		this._gl = gl;

		this.colorBuffer = new ColorBuffer(gl);
		this.depthBuffer = new DepthBuffer(gl, this);
		this.stencilBuffer = new StencilBuffer(gl, this);

		this.isWebGL2 = capabilities.isWebGL2;

		this.maxTextures = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
		this.glVersion = gl.getParameter(gl.VERSION);

		if (this.glVersion.indexOf("WebGL") !== -1) {
			this.version = parseFloat(/^WebGL (\d)/.exec(this.glVersion)[1]);
			this.lineWidthAvailable = this.version >= 1.0;
		} else if (this.glVersion.indexOf("OpenGL ES") !== -1) {
			this.version = parseFloat(/^OpenGL ES (\d)/.exec(this.glVersion)[1]);
			this.lineWidthAvailable = this.version >= 2.0;
		}

		this.emptyTextures[gl.TEXTURE_2D] = this.createTexture(
			this._gl.TEXTURE_2D,
			this._gl.TEXTURE_2D,
			1
		);
		this.emptyTextures[gl.TEXTURE_CUBE_MAP] = this.createTexture(
			this._gl.TEXTURE_CUBE_MAP,
			this._gl.TEXTURE_CUBE_MAP_POSITIVE_X,
			6
		);

		// init

		this.colorBuffer.setClear(0, 0, 0, 1);
		this.depthBuffer.setClear(1);
		this.stencilBuffer.setClear(0);

		this.enable(this._gl.DEPTH_TEST);
		this.depthBuffer.setFunc(LessEqualDepth);

		this.setFlipSided(false);
		this.setCullFace(CullFaceBack);
		this.enable(this._gl.CULL_FACE);

		this.setBlending(NoBlending);

		this.equationToGL = {
			[AddEquation]: gl.FUNC_ADD,
			[SubtractEquation]: gl.FUNC_SUBTRACT,
			[ReverseSubtractEquation]: gl.FUNC_REVERSE_SUBTRACT,
		};

		if (this.isWebGL2) {
			this.equationToGL[MinEquation] = gl.MIN;
			this.equationToGL[MaxEquation] = gl.MAX;
		} else {
			const extension = extensions.get("EXT_blend_minmax") as EXT_blend_minmax;

			if (extension !== null) {
				this.equationToGL[MinEquation] = extension.MIN_EXT;
				this.equationToGL[MaxEquation] = extension.MAX_EXT;
			}
		}

		this.factorToGL = {
			[ZeroFactor]: gl.ZERO,
			[OneFactor]: gl.ONE,
			[SrcColorFactor]: gl.SRC_COLOR,
			[SrcAlphaFactor]: gl.SRC_ALPHA,
			[SrcAlphaSaturateFactor]: gl.SRC_ALPHA_SATURATE,
			[DstColorFactor]: gl.DST_COLOR,
			[DstAlphaFactor]: gl.DST_ALPHA,
			[OneMinusSrcColorFactor]: gl.ONE_MINUS_SRC_COLOR,
			[OneMinusSrcAlphaFactor]: gl.ONE_MINUS_SRC_ALPHA,
			[OneMinusDstColorFactor]: gl.ONE_MINUS_DST_COLOR,
			[OneMinusDstAlphaFactor]: gl.ONE_MINUS_DST_ALPHA,
		};
	}

	createTexture(type: number, target: number, count: number) {
		const data = new Uint8Array(4); // 4 is required to match default unpack alignment of 4.
		const texture = this._gl.createTexture();

		this._gl.bindTexture(type, texture);
		this._gl.texParameteri(type, this._gl.TEXTURE_MIN_FILTER, this._gl.NEAREST);
		this._gl.texParameteri(type, this._gl.TEXTURE_MAG_FILTER, this._gl.NEAREST);

		for (let i = 0; i < count; i++) {
			this._gl.texImage2D(
				target + i,
				0,
				this._gl.RGBA,
				1,
				1,
				0,
				this._gl.RGBA,
				this._gl.UNSIGNED_BYTE,
				data
			);
		}

		return texture;
	}

	enable(id: number) {
		if (this.enabledCapabilities[id] !== true) {
			this._gl.enable(id);
			this.enabledCapabilities[id] = true;
		}
	}

	disable(id: number) {
		if (this.enabledCapabilities[id] !== false) {
			this._gl.disable(id);
			this.enabledCapabilities[id] = false;
		}
	}

	useProgram(program: GLESProgram) {
		if (this.currentProgram !== program) {
			this._gl.useProgram(program);

			this.currentProgram = program;

			return true;
		}

		return false;
	}

	setBlending(
		blending: number,
		blendEquation?: number,
		blendSrc?: number,
		blendDst?: number,
		blendEquationAlpha?: number,
		blendSrcAlpha?: number,
		blendDstAlpha?: number,
		premultipliedAlpha?: boolean
	) {
		if (blending === NoBlending) {
			if (this.currentBlendingEnabled === true) {
				this.disable(this._gl.BLEND);
				this.currentBlendingEnabled = false;
			}

			return;
		}

		if (this.currentBlendingEnabled === false) {
			this.enable(this._gl.BLEND);
			this.currentBlendingEnabled = true;
		}

		if (blending !== CustomBlending) {
			if (
				blending !== this.currentBlending ||
				premultipliedAlpha !== this.currentPremultipledAlpha
			) {
				if (
					this.currentBlendEquation !== AddEquation ||
					this.currentBlendEquationAlpha !== AddEquation
				) {
					this._gl.blendEquation(this._gl.FUNC_ADD);

					this.currentBlendEquation = AddEquation;
					this.currentBlendEquationAlpha = AddEquation;
				}

				if (premultipliedAlpha) {
					switch (blending) {
						case NormalBlending:
							this._gl.blendFuncSeparate(
								this._gl.ONE,
								this._gl.ONE_MINUS_SRC_ALPHA,
								this._gl.ONE,
								this._gl.ONE_MINUS_SRC_ALPHA
							);
							break;

						case AdditiveBlending:
							this._gl.blendFunc(this._gl.ONE, this._gl.ONE);
							break;

						case SubtractiveBlending:
							this._gl.blendFuncSeparate(
								this._gl.ZERO,
								this._gl.ZERO,
								this._gl.ONE_MINUS_SRC_COLOR,
								this._gl.ONE_MINUS_SRC_ALPHA
							);
							break;

						case MultiplyBlending:
							this._gl.blendFuncSeparate(
								this._gl.ZERO,
								this._gl.SRC_COLOR,
								this._gl.ZERO,
								this._gl.SRC_ALPHA
							);
							break;

						default:
							console.error("WebGLState: Invalid blending: ", blending);
							break;
					}
				} else {
					switch (blending) {
						case NormalBlending:
							this._gl.blendFuncSeparate(
								this._gl.SRC_ALPHA,
								this._gl.ONE_MINUS_SRC_ALPHA,
								this._gl.ONE,
								this._gl.ONE_MINUS_SRC_ALPHA
							);
							break;

						case AdditiveBlending:
							this._gl.blendFunc(this._gl.SRC_ALPHA, this._gl.ONE);
							break;

						case SubtractiveBlending:
							this._gl.blendFunc(this._gl.ZERO, this._gl.ONE_MINUS_SRC_COLOR);
							break;

						case MultiplyBlending:
							this._gl.blendFunc(this._gl.ZERO, this._gl.SRC_COLOR);
							break;

						default:
							console.error("WebGLState: Invalid blending: ", blending);
							break;
					}
				}

				this.currentBlendSrc = null;
				this.currentBlendDst = null;
				this.currentBlendSrcAlpha = null;
				this.currentBlendDstAlpha = null;

				this.currentBlending = blending;
				this.currentPremultipledAlpha = premultipliedAlpha;
			}

			return;
		}

		// custom blending

		blendEquationAlpha = blendEquationAlpha || blendEquation;
		blendSrcAlpha = blendSrcAlpha || blendSrc;
		blendDstAlpha = blendDstAlpha || blendDst;

		if (
			blendEquation !== this.currentBlendEquation ||
			blendEquationAlpha !== this.currentBlendEquationAlpha
		) {
			this._gl.blendEquationSeparate(
				this.equationToGL[blendEquation],
				this.equationToGL[blendEquationAlpha]
			);

			this.currentBlendEquation = blendEquation;
			this.currentBlendEquationAlpha = blendEquationAlpha;
		}

		if (
			blendSrc !== this.currentBlendSrc ||
			blendDst !== this.currentBlendDst ||
			blendSrcAlpha !== this.currentBlendSrcAlpha ||
			blendDstAlpha !== this.currentBlendDstAlpha
		) {
			this._gl.blendFuncSeparate(
				this.factorToGL[blendSrc],
				this.factorToGL[blendDst],
				this.factorToGL[blendSrcAlpha],
				this.factorToGL[blendDstAlpha]
			);

			this.currentBlendSrc = blendSrc;
			this.currentBlendDst = blendDst;
			this.currentBlendSrcAlpha = blendSrcAlpha;
			this.currentBlendDstAlpha = blendDstAlpha;
		}

		this.currentBlending = blending;
		this.currentPremultipledAlpha = null;
	}

	setMaterial(material: Material, frontFaceCW?: boolean) {
		material.side === DoubleSide
			? this.disable(this._gl.CULL_FACE)
			: this.enable(this._gl.CULL_FACE);

		let flipSided = material.side === BackSide;
		if (frontFaceCW) flipSided = !flipSided;

		this.setFlipSided(flipSided);

		material.blending === NormalBlending && material.transparent === false
			? this.setBlending(NoBlending)
			: this.setBlending(
					material.blending,
					material.blendEquation,
					material.blendSrc,
					material.blendDst,
					material.blendEquationAlpha,
					material.blendSrcAlpha,
					material.blendDstAlpha,
					material.premultipliedAlpha
			  );

		this.depthBuffer.setFunc(material.depthFunc);
		this.depthBuffer.setTest(material.depthTest);
		this.depthBuffer.setMask(material.depthWrite);
		this.colorBuffer.setMask(material.colorWrite);

		const stencilWrite = material.stencilWrite;
		this.stencilBuffer.setTest(stencilWrite);
		if (stencilWrite) {
			this.stencilBuffer.setMask(material.stencilWriteMask);
			this.stencilBuffer.setFunc(
				material.stencilFunc,
				material.stencilRef,
				material.stencilFuncMask
			);
			this.stencilBuffer.setOp(
				material.stencilFail,
				material.stencilZFail,
				material.stencilZPass
			);
		}

		this.setPolygonOffset(
			material.polygonOffset,
			material.polygonOffsetFactor,
			material.polygonOffsetUnits
		);
	}

	//

	setFlipSided(flipSided: boolean) {
		if (this.currentFlipSided !== flipSided) {
			if (flipSided) {
				this._gl.frontFace(this._gl.CW);
			} else {
				this._gl.frontFace(this._gl.CCW);
			}

			this.currentFlipSided = flipSided;
		}
	}

	setCullFace(cullFace: number) {
		if (cullFace !== CullFaceNone) {
			this.enable(this._gl.CULL_FACE);

			if (cullFace !== this.currentCullFace) {
				if (cullFace === CullFaceBack) {
					this._gl.cullFace(this._gl.BACK);
				} else if (cullFace === CullFaceFront) {
					this._gl.cullFace(this._gl.FRONT);
				} else {
					this._gl.cullFace(this._gl.FRONT_AND_BACK);
				}
			}
		} else {
			this.disable(this._gl.CULL_FACE);
		}

		this.currentCullFace = cullFace;
	}

	setLineWidth(width: number) {
		if (width !== this.currentLineWidth) {
			if (this.lineWidthAvailable) this._gl.lineWidth(width);

			this.currentLineWidth = width;
		}
	}

	setPolygonOffset(polygonOffset: boolean, factor?: number, units?: number) {
		if (polygonOffset) {
			this.enable(this._gl.POLYGON_OFFSET_FILL);

			if (
				this.currentPolygonOffsetFactor !== factor ||
				this.currentPolygonOffsetUnits !== units
			) {
				this._gl.polygonOffset(factor, units);

				this.currentPolygonOffsetFactor = factor;
				this.currentPolygonOffsetUnits = units;
			}
		} else {
			this.disable(this._gl.POLYGON_OFFSET_FILL);
		}
	}

	setScissorTest(scissorTest: boolean) {
		if (scissorTest) {
			this.enable(this._gl.SCISSOR_TEST);
		} else {
			this.disable(this._gl.SCISSOR_TEST);
		}
	}

	// texture

	activeTexture(webglSlot?: number) {
		if (webglSlot === undefined)
			webglSlot = this._gl.TEXTURE0 + this.maxTextures - 1;

		if (this.currentTextureSlot !== webglSlot) {
			this._gl.activeTexture(webglSlot);
			this.currentTextureSlot = webglSlot;
		}
	}

	bindTexture(webglType: number, webglTexture: GLESTexture) {
		if (this.currentTextureSlot === null) {
			this.activeTexture();
		}

		let boundTexture = this.currentBoundTextures[this.currentTextureSlot];

		if (boundTexture === undefined) {
			boundTexture = { type: undefined, texture: undefined };
			this.currentBoundTextures[this.currentTextureSlot] = boundTexture;
		}

		if (
			boundTexture.type !== webglType ||
			boundTexture.texture !== webglTexture
		) {
			this._gl.bindTexture(
				webglType,
				webglTexture || this.emptyTextures[webglType]
			);

			boundTexture.type = webglType;
			boundTexture.texture = webglTexture;
		}
	}

	unbindTexture() {
		const boundTexture = this.currentBoundTextures[this.currentTextureSlot];

		if (boundTexture !== undefined && boundTexture.type !== undefined) {
			this._gl.bindTexture(boundTexture.type, null);

			boundTexture.type = undefined;
			boundTexture.texture = undefined;
		}
	}

	compressedTexImage2D(...args) {
		try {
			this._gl.compressedTexImage2D.apply(this._gl, args);
		} catch (error) {
			console.error("WebGLState:", error);
		}
	}

	texImage2D(...args) {
		try {
			this._gl.texImage2D.apply(this._gl, args);
		} catch (error) {
			console.error("WebGLState:", error);
		}
	}

	texImage3D(...args) {
		try {
			this._gl.texImage3D.apply(this._gl, args);
		} catch (error) {
			console.error("WebGLState:", error);
		}
	}

	//

	scissor(scissor: Vector4) {
		if (this.currentScissor.equals(scissor) === false) {
			this._gl.scissor(scissor.x, scissor.y, scissor.z, scissor.w);
			this.currentScissor.copy(scissor);
		}
	}

	viewport(viewport: Vector4) {
		if (this.currentViewport.equals(viewport) === false) {
			this._gl.viewport(viewport.x, viewport.y, viewport.z, viewport.w);
			this.currentViewport.copy(viewport);
		}
	}

	//

	reset() {
		// reset state

		this._gl.disable(this._gl.BLEND);
		this._gl.disable(this._gl.CULL_FACE);
		this._gl.disable(this._gl.DEPTH_TEST);
		this._gl.disable(this._gl.POLYGON_OFFSET_FILL);
		this._gl.disable(this._gl.SCISSOR_TEST);
		this._gl.disable(this._gl.STENCIL_TEST);

		this._gl.blendEquation(this._gl.FUNC_ADD);
		this._gl.blendFunc(this._gl.ONE, this._gl.ZERO);
		this._gl.blendFuncSeparate(
			this._gl.ONE,
			this._gl.ZERO,
			this._gl.ONE,
			this._gl.ZERO
		);

		this._gl.colorMask(true, true, true, true);
		this._gl.clearColor(0, 0, 0, 0);

		this._gl.depthMask(true);
		this._gl.depthFunc(this._gl.LESS);
		this._gl.clearDepth(1);

		this._gl.stencilMask(0xffffffff);
		this._gl.stencilFunc(this._gl.ALWAYS, 0, 0xffffffff);
		this._gl.stencilOp(this._gl.KEEP, this._gl.KEEP, this._gl.KEEP);
		this._gl.clearStencil(0);

		this._gl.cullFace(this._gl.BACK);
		this._gl.frontFace(this._gl.CCW);

		this._gl.polygonOffset(0, 0);

		this._gl.activeTexture(this._gl.TEXTURE0);

		this._gl.useProgram(null);

		this._gl.lineWidth(1);

		this._gl.scissor(0, 0, this._gl.canvas.width, this._gl.canvas.height);
		this._gl.viewport(0, 0, this._gl.canvas.width, this._gl.canvas.height);

		// reset internals

		this.enabledCapabilities = {};

		this.currentTextureSlot = null;
		this.currentBoundTextures = {};

		this.currentProgram = null;

		this.currentBlendingEnabled = false;
		this.currentBlending = null;
		this.currentBlendEquation = null;
		this.currentBlendSrc = null;
		this.currentBlendDst = null;
		this.currentBlendEquationAlpha = null;
		this.currentBlendSrcAlpha = null;
		this.currentBlendDstAlpha = null;
		this.currentPremultipledAlpha = false;

		this.currentFlipSided = null;
		this.currentCullFace = null;

		this.currentLineWidth = null;

		this.currentPolygonOffsetFactor = null;
		this.currentPolygonOffsetUnits = null;

		this.colorBuffer.reset();
		this.depthBuffer.reset();
		this.stencilBuffer.reset();
	}
}

export { WebGLState };
