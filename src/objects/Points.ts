import {
	BufferGeometry,
	Matrix4,
	Object3D,
	PointsMaterial,
	Ray,
	Raycaster,
	Sphere,
	Vector3,
} from "..";

const _inverseMatrix = new Matrix4();
const _ray = new Ray();
const _sphere = new Sphere();
const _position = new Vector3();

/**
 * @public
 */
export class Points extends Object3D {
	constructor(
		geometry = new BufferGeometry(),
		material = new PointsMaterial()
	) {
		super();

		this.isPoints = true;

		this.type = "Points";

		this.geometry = geometry;
		this.material = material;

		this.updateMorphTargets();
	}

	copy(source: Points) {
		super.copy(source);

		this.material = source.material;
		this.geometry = source.geometry;

		return this;
	}

	raycast(raycaster: Raycaster, intersects: any[]) {
		const geometry = this.geometry as BufferGeometry;
		const matrixWorld = this.matrixWorld;
		const threshold = raycaster.params.Points.threshold;

		// Checking boundingSphere distance to ray

		if (geometry.boundingSphere === null) geometry.computeBoundingSphere();

		_sphere.copy(geometry.boundingSphere);
		_sphere.applyMatrix4(matrixWorld);
		_sphere.radius += threshold;

		if (raycaster.ray.intersectsSphere(_sphere) === false) return;

		//

		_inverseMatrix.copy(matrixWorld).invert();
		_ray.copy(raycaster.ray).applyMatrix4(_inverseMatrix);

		const localThreshold =
			threshold / ((this.scale.x + this.scale.y + this.scale.z) / 3);
		const localThresholdSq = localThreshold * localThreshold;

		if (geometry.isBufferGeometry) {
			const index = geometry.index;
			const attributes = geometry.attributes;
			const positionAttribute = attributes.position;

			if (index !== null) {
				const indices = index.array;

				for (let i = 0, il = indices.length; i < il; i++) {
					const a = indices[i];

					_position.fromBufferAttribute(positionAttribute, Number(a));

					testPoint(
						_position,
						a,
						localThresholdSq,
						matrixWorld,
						raycaster,
						intersects,
						this
					);
				}
			} else {
				for (let i = 0, l = positionAttribute.count; i < l; i++) {
					_position.fromBufferAttribute(positionAttribute, i);

					testPoint(
						_position,
						i,
						localThresholdSq,
						matrixWorld,
						raycaster,
						intersects,
						this
					);
				}
			}
		} else {
			console.error(
				"Points.raycast() no longer supports Geometry. Use BufferGeometry instead."
			);
		}
	}

	updateMorphTargets() {
		if (this.geometry instanceof BufferGeometry) {
			const morphAttributes = this.geometry.morphAttributes;
			const keys = Object.keys(morphAttributes);

			if (keys.length > 0) {
				const morphAttribute = morphAttributes[keys[0]];

				if (morphAttribute !== undefined) {
					this.morphTargetInfluences = [];
					this.morphTargetDictionary = {};

					for (let m = 0, ml = morphAttribute.length; m < ml; m++) {
						const name = morphAttribute[m].name || String(m);

						this.morphTargetInfluences.push(0);
						this.morphTargetDictionary[name] = m;
					}
				}
			}
		}
	}
}

function testPoint(
	point,
	index,
	localThresholdSq,
	matrixWorld,
	raycaster,
	intersects,
	object
) {
	const rayPointDistanceSq = _ray.distanceSqToPoint(point);

	if (rayPointDistanceSq < localThresholdSq) {
		const intersectPoint = new Vector3();

		_ray.closestPointToPoint(point, intersectPoint);
		intersectPoint.applyMatrix4(matrixWorld);

		const distance = raycaster.ray.origin.distanceTo(intersectPoint);

		if (distance < raycaster.near || distance > raycaster.far) return;

		intersects.push({
			distance: distance,
			distanceToRay: Math.sqrt(rayPointDistanceSq),
			point: intersectPoint,
			index: index,
			face: null,
			object: object,
		});
	}
}
