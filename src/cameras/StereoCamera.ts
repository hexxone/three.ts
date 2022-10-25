import { DEG2RAD } from "../math/MathUtils";
import { Matrix4 } from "../math/Matrix4";
import { PerspectiveCamera } from "./PerspectiveCamera";

const _eyeRight = new Matrix4();
const _eyeLeft = new Matrix4();

class StereoCamera {
	type: string;
	aspect: number;
	eyeSep: number;
	cameraL: PerspectiveCamera;
	cameraR: PerspectiveCamera;
	_cache: {
		focus: any;
		fov: any;
		aspect: any;
		near: any;
		far: any;
		zoom: any;
		eyeSep: any;
	};

	constructor() {
		this.type = "StereoCamera";

		this.aspect = 1;

		this.eyeSep = 0.064;

		this.cameraL = new PerspectiveCamera();
		this.cameraL.layers.enable(1);
		this.cameraL.matrixAutoUpdate = false;

		this.cameraR = new PerspectiveCamera();
		this.cameraR.layers.enable(2);
		this.cameraR.matrixAutoUpdate = false;

		this._cache = {
			focus: null,
			fov: null,
			aspect: null,
			near: null,
			far: null,
			zoom: null,
			eyeSep: null,
		};
	}

	update(camera) {
		const cache = this._cache;

		const needsUpdate =
			cache.focus !== camera.focus ||
			cache.fov !== camera.fov ||
			cache.aspect !== camera.aspect * this.aspect ||
			cache.near !== camera.near ||
			cache.far !== camera.far ||
			cache.zoom !== camera.zoom ||
			cache.eyeSep !== this.eyeSep;

		if (needsUpdate) {
			cache.focus = camera.focus;
			cache.fov = camera.fov;
			cache.aspect = camera.aspect * this.aspect;
			cache.near = camera.near;
			cache.far = camera.far;
			cache.zoom = camera.zoom;
			cache.eyeSep = this.eyeSep;

			// Off-axis stereoscopic effect based on
			// http://paulbourke.net/stereographics/stereorender/

			const projectionMatrix = camera.projectionMatrix.clone();
			const eyeSepHalf = cache.eyeSep / 2;
			const eyeSepOnProjection = (eyeSepHalf * cache.near) / cache.focus;
			const ymax =
				(cache.near * Math.tan(DEG2RAD * cache.fov * 0.5)) /
				cache.zoom;
			let xmin;
			let xmax;

			// translate xOffset

			_eyeLeft.elements[12] = -eyeSepHalf;
			_eyeRight.elements[12] = eyeSepHalf;

			// for left eye

			xmin = -ymax * cache.aspect + eyeSepOnProjection;
			xmax = ymax * cache.aspect + eyeSepOnProjection;

			projectionMatrix.elements[0] = (2 * cache.near) / (xmax - xmin);
			projectionMatrix.elements[8] = (xmax + xmin) / (xmax - xmin);

			this.cameraL.projectionMatrix.copy(projectionMatrix);

			// for right eye

			xmin = -ymax * cache.aspect - eyeSepOnProjection;
			xmax = ymax * cache.aspect - eyeSepOnProjection;

			projectionMatrix.elements[0] = (2 * cache.near) / (xmax - xmin);
			projectionMatrix.elements[8] = (xmax + xmin) / (xmax - xmin);

			this.cameraR.projectionMatrix.copy(projectionMatrix);
		}

		this.cameraL.matrixWorld.copy(camera.matrixWorld).multiply(_eyeLeft);
		this.cameraR.matrixWorld.copy(camera.matrixWorld).multiply(_eyeRight);
	}
}

export { StereoCamera };
