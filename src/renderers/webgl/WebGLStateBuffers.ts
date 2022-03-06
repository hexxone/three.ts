import {
	NeverDepth,
	AlwaysDepth,
	LessDepth,
	LessEqualDepth,
	EqualDepth,
	GreaterEqualDepth,
	GreaterDepth,
	NotEqualDepth,
	Vector4,
} from "../..";
import { WebGLState } from "..";

export class StencilBuffer {
	_gl: GLESRenderingContext;
	_state: WebGLState;

	locked = false;

	currentStencilMask = null;
	currentStencilFunc = null;
	currentStencilRef = null;
	currentStencilFuncMask = null;
	currentStencilFail = null;
	currentStencilZFail = null;
	currentStencilZPass = null;
	currentStencilClear: number;

	constructor(gl: GLESRenderingContext, state: WebGLState) {
		this._gl = gl;
		this._state = state;
	}

	setTest(stencilTest) {
		if (!this.locked) {
			if (stencilTest) {
				this._state.enable(this._gl.STENCIL_TEST);
			} else {
				this._state.disable(this._gl.STENCIL_TEST);
			}
		}
	}

	setMask(stencilMask) {
		if (this.currentStencilMask !== stencilMask && !this.locked) {
			this._gl.stencilMask(stencilMask);
			this.currentStencilMask = stencilMask;
		}
	}

	setFunc(stencilFunc, stencilRef, stencilMask) {
		if (
			this.currentStencilFunc !== stencilFunc ||
			this.currentStencilRef !== stencilRef ||
			this.currentStencilFuncMask !== stencilMask
		) {
			this._gl.stencilFunc(stencilFunc, stencilRef, stencilMask);

			this.currentStencilFunc = stencilFunc;
			this.currentStencilRef = stencilRef;
			this.currentStencilFuncMask = stencilMask;
		}
	}

	setOp(stencilFail, stencilZFail, stencilZPass) {
		if (
			this.currentStencilFail !== stencilFail ||
			this.currentStencilZFail !== stencilZFail ||
			this.currentStencilZPass !== stencilZPass
		) {
			this._gl.stencilOp(stencilFail, stencilZFail, stencilZPass);

			this.currentStencilFail = stencilFail;
			this.currentStencilZFail = stencilZFail;
			this.currentStencilZPass = stencilZPass;
		}
	}

	setLocked(lock) {
		this.locked = lock;
	}

	setClear(stencil: number) {
		if (this.currentStencilClear !== stencil) {
			this._gl.clearStencil(stencil);
			this.currentStencilClear = stencil;
		}
	}

	reset() {
		this.locked = false;

		this.currentStencilMask = null;
		this.currentStencilFunc = null;
		this.currentStencilRef = null;
		this.currentStencilFuncMask = null;
		this.currentStencilFail = null;
		this.currentStencilZFail = null;
		this.currentStencilZPass = null;
		this.currentStencilClear = null;
	}
}

export class DepthBuffer {
	_gl: GLESRenderingContext;
	_state: WebGLState;

	locked = false;

	currentDepthMask = null;
	currentDepthFunc = null;
	currentDepthClear = null;

	constructor(gl: GLESRenderingContext, state: WebGLState) {
		this._gl = gl;
		this._state = state;
	}

	setTest(depthTest) {
		if (depthTest) {
			this._state.enable(this._gl.DEPTH_TEST);
		} else {
			this._state.disable(this._gl.DEPTH_TEST);
		}
	}

	setMask(depthMask) {
		if (this.currentDepthMask !== depthMask && !this.locked) {
			this._gl.depthMask(depthMask);
			this.currentDepthMask = depthMask;
		}
	}

	setFunc(depthFunc) {
		if (this.currentDepthFunc !== depthFunc) {
			if (depthFunc) {
				switch (depthFunc) {
					case NeverDepth:
						this._gl.depthFunc(this._gl.NEVER);
						break;

					case AlwaysDepth:
						this._gl.depthFunc(this._gl.ALWAYS);
						break;

					case LessDepth:
						this._gl.depthFunc(this._gl.LESS);
						break;

					case LessEqualDepth:
						this._gl.depthFunc(this._gl.LEQUAL);
						break;

					case EqualDepth:
						this._gl.depthFunc(this._gl.EQUAL);
						break;

					case GreaterEqualDepth:
						this._gl.depthFunc(this._gl.GEQUAL);
						break;

					case GreaterDepth:
						this._gl.depthFunc(this._gl.GREATER);
						break;

					case NotEqualDepth:
						this._gl.depthFunc(this._gl.NOTEQUAL);
						break;

					default:
						this._gl.depthFunc(this._gl.LEQUAL);
				}
			} else {
				this._gl.depthFunc(this._gl.LEQUAL);
			}

			this.currentDepthFunc = depthFunc;
		}
	}

	setLocked(lock) {
		this.locked = lock;
	}

	setClear(depth: number) {
		if (this.currentDepthClear !== depth) {
			this._gl.clearDepth(depth);
			this.currentDepthClear = depth;
		}
	}

	reset() {
		this.locked = false;

		this.currentDepthMask = null;
		this.currentDepthFunc = null;
		this.currentDepthClear = null;
	}
}

export class ColorBuffer {
	_gl: GLESRenderingContext;

	locked = false;

	color = new Vector4();
	currentColorMask: boolean;
	currentColorClear = new Vector4(0, 0, 0, 0);

	constructor(gl: GLESRenderingContext) {
		this._gl = gl;
	}

	setMask(colorMask: boolean) {
		if (this.currentColorMask !== colorMask && !this.locked) {
			this._gl.colorMask(colorMask, colorMask, colorMask, colorMask);
			this.currentColorMask = colorMask;
		}
	}

	setLocked(lock: boolean) {
		this.locked = lock;
	}

	setClear(
		r: number,
		g: number,
		b: number,
		a: number,
		premultipliedAlpha?: boolean
	) {
		if (premultipliedAlpha === true) {
			r *= a;
			g *= a;
			b *= a;
		}

		this.color.set(r, g, b, a);

		if (this.currentColorClear.equals(this.color) === false) {
			this._gl.clearColor(r, g, b, a);
			this.currentColorClear.copy(this.color);
		}
	}

	reset() {
		this.locked = false;

		this.currentColorMask = null;
		this.currentColorClear.set(-1, 0, 0, 0); // set to invalid state
	}
}
