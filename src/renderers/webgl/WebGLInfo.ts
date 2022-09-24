
/**
 * @public
 */
class WebGLInfo {
	_gl: GLESRenderingContext;

	memory = {
		geometries: 0,
		textures: 0,
	};

	render = {
		frame: 0,
		calls: 0,
		triangles: 0,
		points: 0,
		lines: 0,
	};

	programs: any[];
	autoReset: boolean;

	constructor(gl: GLESRenderingContext) {
		this._gl = gl;
	}

	update(count: number, mode: number, instanceCount: number) {
		this.render.calls++;

		switch (mode) {
			case this._gl.TRIANGLES:
				this.render.triangles += instanceCount * (count / 3);
				break;

			case this._gl.LINES:
				this.render.lines += instanceCount * (count / 2);
				break;

			case this._gl.LINE_STRIP:
				this.render.lines += instanceCount * (count - 1);
				break;

			case this._gl.LINE_LOOP:
				this.render.lines += instanceCount * count;
				break;

			case this._gl.POINTS:
				this.render.points += instanceCount * count;
				break;

			default:
				console.error("WebGLInfo: Unknown draw mode:", mode);
				break;
		}
	}

	reset() {
		this.render.frame++;
		this.render.calls = 0;
		this.render.triangles = 0;
		this.render.points = 0;
		this.render.lines = 0;
	}
}

export { WebGLInfo };
