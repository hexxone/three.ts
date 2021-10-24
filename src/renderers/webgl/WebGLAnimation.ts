class WebGLAnimation {
	context = null;
	isAnimating = false;
	animationLoop = null;
	requestId = null;

	constructor() { }

	private _onAnimationFrame(time, frame) {
		this.animationLoop(time, frame);
		this.requestId = this.context.requestAnimationFrame(this._onAnimationFrame);
	}

	start() {
		if (this.isAnimating === true) return;
		if (this.animationLoop === null) return;

		this.requestId = this.context.requestAnimationFrame(this._onAnimationFrame);
		this.isAnimating = true;
	}

	stop() {
		this.context.cancelAnimationFrame(this.requestId);
		this.isAnimating = false;
	}

	setAnimationLoop(callback) {
		this.animationLoop = callback;
	}

	setContext(value) {
		this.context = value;
	}
}

export { WebGLAnimation };
