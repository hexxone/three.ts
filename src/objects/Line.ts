import { Float32BufferAttribute } from "../core/BufferAttribute";
import { BufferGeometry } from "../core/BufferGeometry";
import { Object3D } from "../core/Object3D";
import { Raycaster } from "../core/Raycaster";
import { LineBasicMaterial } from "../materials/LineBasicMaterial";
import { Material } from "../materials/Material";
import { Matrix4 } from "../math/Matrix4";
import { Ray } from "../math/Ray";
import { Sphere } from "../math/Sphere";
import { Vector3 } from "../math/Vector3";

const _start = new Vector3();
const _end = new Vector3();
const _inverseMatrix = new Matrix4();
const _ray = new Ray();
const _sphere = new Sphere();

/**
 * @public
 */
class Line extends Object3D {
	isLineLoop: boolean;
	isLineSegments: boolean;

	/**
	 * Construct a new basic line
	 * @param geometry Line path
	 * @param material Line visuals
	 */
	constructor(
		geometry: BufferGeometry = new BufferGeometry(),
		material: Material = new LineBasicMaterial()
	) {
		super();

		this.isLine = true;
		this.type = "Line";

		this.geometry = geometry;
		this.material = material;

		this.updateMorphTargets();
	}

	copy(source: Line) {
		super.copy(source);

		this.material = source.material;
		this.geometry = source.geometry;

		return this;
	}

	computeLineDistances() {
		const geometry = this.geometry as BufferGeometry;

		if (geometry.isBufferGeometry) {
			// we assume non-indexed geometry

			if (geometry.index === null) {
				const positionAttribute = geometry.attributes.position;
				const lineDistances = [0];

				for (let i = 1, l = positionAttribute.count; i < l; i++) {
					_start.fromBufferAttribute(positionAttribute, i - 1);
					_end.fromBufferAttribute(positionAttribute, i);

					lineDistances[i] = lineDistances[i - 1];
					lineDistances[i] += _start.distanceTo(_end);
				}

				geometry.setAttribute(
					"lineDistance",
					new Float32BufferAttribute(lineDistances, 1)
				);
			} else {
				console.warn(
					"Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry."
				);
			}
		}

		return this;
	}

	raycast(raycaster: Raycaster, intersects: any[]) {
		const geometry = this.geometry;
		const matrixWorld = this.matrixWorld;
		const threshold = raycaster.params.Line.threshold;

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

		const vStart = new Vector3();
		const vEnd = new Vector3();
		const interSegment = new Vector3();
		const interRay = new Vector3();
		const step = this.isLineSegments ? 2 : 1;

		if (geometry.isBufferGeometry) {
			const index = geometry.index;
			const attributes = geometry.attributes;
			const positionAttribute = attributes.position;

			if (index !== null) {
				const indices = index.array;

				for (let i = 0, l = indices.length - 1; i < l; i += step) {
					const a = indices[i];
					const b = indices[i + 1];

					vStart.fromBufferAttribute(positionAttribute, Number(a));
					vEnd.fromBufferAttribute(positionAttribute, Number(b));

					const distSq = _ray.distanceSqToSegment(
						vStart,
						vEnd,
						interRay,
						interSegment
					);

					if (distSq > localThresholdSq) continue;

					interRay.applyMatrix4(this.matrixWorld); // Move back to world space for distance calculation

					const distance = raycaster.ray.origin.distanceTo(interRay);

					if (distance < raycaster.near || distance > raycaster.far) continue;

					intersects.push({
						distance: distance,
						// What do we want? intersection point on the ray or on the segment??
						// point: raycaster.ray.at( distance ),
						point: interSegment.clone().applyMatrix4(this.matrixWorld),
						index: i,
						face: null,
						faceIndex: null,
						object: this,
					});
				}
			} else {
				for (let i = 0, l = positionAttribute.count - 1; i < l; i += step) {
					vStart.fromBufferAttribute(positionAttribute, i);
					vEnd.fromBufferAttribute(positionAttribute, i + 1);

					const distSq = _ray.distanceSqToSegment(
						vStart,
						vEnd,
						interRay,
						interSegment
					);

					if (distSq > localThresholdSq) continue;

					interRay.applyMatrix4(this.matrixWorld); // Move back to world space for distance calculation

					const distance = raycaster.ray.origin.distanceTo(interRay);

					if (distance < raycaster.near || distance > raycaster.far) continue;

					intersects.push({
						distance: distance,
						// What do we want? intersection point on the ray or on the segment??
						// point: raycaster.ray.at( distance ),
						point: interSegment.clone().applyMatrix4(this.matrixWorld),
						index: i,
						face: null,
						faceIndex: null,
						object: this,
					});
				}
			}
		}
	}

	updateMorphTargets() {
		const geometry = this.geometry;

		if (geometry.isBufferGeometry) {
			const morphAttributes = geometry.morphAttributes;
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

export { Line };
