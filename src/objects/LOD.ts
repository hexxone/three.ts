import { Camera, Raycaster, Object3D, Vector3 } from "../";

const _v1 = /* @__PURE__*/ new Vector3();
const _v2 = /* @__PURE__*/ new Vector3();

/**
 * @public
 */
class LOD extends Object3D {
	_currentLevel: number;
	levels: any;

	constructor() {
		super();

		this._currentLevel = 0;

		this.type = "LOD";

		Object.defineProperties(this, {
			levels: {
				enumerable: true,
				value: [],
			},
			isLOD: {
				value: true,
			},
		});

		this.autoUpdate = true;
	}

	copy(source: LOD) {
		super.copy(source, false);

		const levels = source.levels;

		for (let i = 0, l = levels.length; i < l; i++) {
			const level = levels[i];

			this.addLevel(level.object.clone(), level.distance);
		}

		this.autoUpdate = source.autoUpdate;

		return this;
	}

	addLevel(object, distance = 0) {
		distance = Math.abs(distance);

		const levels = this.levels;

		let l;

		for (l = 0; l < levels.length; l++) {
			if (distance < levels[l].distance) {
				break;
			}
		}

		levels.splice(l, 0, { distance: distance, object: object });

		this.add(object);

		return this;
	}

	getCurrentLevel() {
		return this._currentLevel;
	}

	getObjectForDistance(distance) {
		const levels = this.levels;

		if (levels.length > 0) {
			let i;
			let l;

			for (i = 1, l = levels.length; i < l; i++) {
				if (distance < levels[i].distance) {
					break;
				}
			}

			return levels[i - 1].object;
		}

		return null;
	}

	raycast(raycaster: Raycaster, intersects: any[]) {
		if (this.levels.length > 0) {
			_v1.setFromMatrixPosition(this.matrixWorld);

			const distance = raycaster.ray.origin.distanceTo(_v1);

			this.getObjectForDistance(distance).raycast(raycaster, intersects);
		}
	}

	update(...args) {
		const camera = args[0] as Camera;
		const levels = this.levels;

		if (levels.length > 1) {
			_v1.setFromMatrixPosition(camera.matrixWorld);
			_v2.setFromMatrixPosition(this.matrixWorld);

			const distance = _v1.distanceTo(_v2) / camera.zoom;

			levels[0].object.visible = true;

			let i;
			let l;

			for (i = 1, l = levels.length; i < l; i++) {
				if (distance >= levels[i].distance) {
					levels[i - 1].object.visible = false;
					levels[i].object.visible = true;
				} else {
					break;
				}
			}

			this._currentLevel = i - 1;

			for (; i < l; i++) {
				levels[i].object.visible = false;
			}
		}
	}
}

export { LOD };
