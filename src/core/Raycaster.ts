import { Camera } from "../cameras/Camera";
import { Vector2 } from "../math";
import { Ray } from "../math/Ray";
import { Vector3 } from "../math/Vector3";
import { Mesh } from "../objects/Mesh";
import { Layers } from "./Layers";
import { Object3D } from "./Object3D";

function ascSort(a, b) {
	return a.distance - b.distance;
}

function intersectObject(
	object: Object3D,
	raycaster: Raycaster,
	intersects,
	recursive: boolean
) {
	if (object.layers.test(raycaster.layers)) {
		object.raycast(raycaster, intersects);
	}

	if (recursive === true) {
		const children = object.children;

		for (let i = 0, l = children.length; i < l; i++) {
			intersectObject(children[i], raycaster, intersects, true);
		}
	}
}

/**
 * @public
 */
class Raycaster {
	ray: Ray;
	near: number;
	far: number;

	camera: Camera;
	layers: Layers;

	params: {
		Mesh: Mesh;
		Line: { threshold: number };
		LOD: {};
		Points: { threshold: number };
		Sprite: {};
	};

	constructor(origin?: Vector3, direction?, near = 0, far = Infinity) {
		this.ray = new Ray(origin, direction);
		// direction is assumed to be normalized (for accurate distance calculations)

		this.near = near;
		this.far = far;
		this.camera = null;
		this.layers = new Layers();

		this.params = {
			Mesh: new Mesh(),
			Line: { threshold: 1 },
			LOD: {},
			Points: { threshold: 1 },
			Sprite: {},
		};
	}

	set(origin: Vector3, direction) {
		// direction is assumed to be normalized (for accurate distance calculations)

		this.ray.set(origin, direction);
	}

	setFromCamera(coords: Vector2, camera: Camera) {
		if (camera && camera.isPerspectiveCamera) {
			this.ray.origin.setFromMatrixPosition(camera.matrixWorld);
			this.ray.direction
				.set(coords.x, coords.y, 0.5)
				.unproject(camera)
				.sub(this.ray.origin)
				.normalize();
			this.camera = camera;
		} else if (camera && camera.isOrthographicCamera) {
			this.ray.origin
				.set(
					coords.x,
					coords.y,
					(camera.near + camera.far) / (camera.near - camera.far)
				)
				.unproject(camera); // set origin in plane of camera
			this.ray.direction.set(0, 0, -1).transformDirection(camera.matrixWorld);
			this.camera = camera;
		} else {
			console.error("Raycaster: Unsupported camera type: " + camera.type);
		}
	}

	intersectObject(object: Object3D, recursive = false, intersects = []) {
		intersectObject(object, this, intersects, recursive);

		intersects.sort(ascSort);

		return intersects;
	}

	intersectObjects(objects: Object3D[], recursive = false, intersects = []) {
		for (let i = 0, l = objects.length; i < l; i++) {
			intersectObject(objects[i], this, intersects, recursive);
		}

		intersects.sort(ascSort);

		return intersects;
	}
}

export { Raycaster };
