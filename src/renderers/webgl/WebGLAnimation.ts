import { XRFrameRequestCallback } from 'src/we_utils/src/XRWebGL';

class WebGLAnimation {
	context: XRSession | Window & typeof globalThis = null;

	isAnimating: boolean = false;
	requestId: number;

	constructor() { }

	_animationLoop: XRFrameRequestCallback;

	_onAnimationFrame(time: DOMHighResTimeStamp, frame: XRFrame) {
		this._animationLoop(time, frame);
		this.requestId = this.context.requestAnimationFrame(this._onAnimationFrame.bind(this));
	}

	start() {
		if (this.isAnimating === true) return;
		if (this._animationLoop === null) return;

		this.requestId = this.context.requestAnimationFrame(this._onAnimationFrame.bind(this));
		this.isAnimating = true;
	}

	stop() {
		this.context.cancelAnimationFrame(this.requestId);
		this.isAnimating = false;
	}

	setAnimationLoop(callback: XRFrameRequestCallback) {
		this._animationLoop = callback;
	}

	setContext(value: XRSession | Window & typeof globalThis) {
		this.context = value;
	}
}

export { WebGLAnimation };
