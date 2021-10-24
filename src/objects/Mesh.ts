import { Vector3 } from '../math/Vector3';
import { Vector2 } from '../math/Vector2';
import { Sphere } from '../math/Sphere';
import { Ray } from '../math/Ray';
import { Matrix4 } from '../math/Matrix4';
import { Object3D } from '../core/Object3D';
import { Triangle } from '../math/Triangle';
import { DoubleSide, BackSide } from '../constants';
import { MeshBasicMaterial } from '../materials/MeshBasicMaterial';
import { BufferGeometry } from '../core/BufferGeometry';

const _inverseMatrix = new Matrix4();
const _ray = new Ray();
const _sphere = new Sphere();

const _vA = new Vector3();
const _vB = new Vector3();
const _vC = new Vector3();

const _tempA = new Vector3();
const _tempB = new Vector3();
const _tempC = new Vector3();

const _morphA = new Vector3();
const _morphB = new Vector3();
const _morphC = new Vector3();

const _uvA = new Vector2();
const _uvB = new Vector2();
const _uvC = new Vector2();

const _intersectionPoint = new Vector3();
const _intersectionPointWorld = new Vector3();

class Mesh extends Object3D {

	morphTargetInfluences: any;
	morphTargetDictionary: any;

	constructor(geometry = new BufferGeometry(), material = new MeshBasicMaterial()) {
		super();

		Object.defineProperty(this, 'isMesh', true);

		this.type = 'Mesh';

		this.geometry = geometry;
		this.material = material;

		this.updateMorphTargets();
	}


	copy(source) {
		Object3D.prototype.copy.call(this, source);

		if (source.morphTargetInfluences !== undefined) {
			this.morphTargetInfluences = source.morphTargetInfluences.slice();
		}

		if (source.morphTargetDictionary !== undefined) {
			this.morphTargetDictionary = Object.assign({}, source.morphTargetDictionary);
		}

		this.material = source.material;
		this.geometry = source.geometry;

		return this;
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
		} else {
			const morphTargets = geometry.morphTargets;

			if (morphTargets !== undefined && morphTargets.length > 0) {
				console.error('THREE.Mesh.updateMorphTargets() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.');
			}
		}
	}

	/**
	 * 
	 * @param args [0] = raycaster, [1] = intersects
	 * @returns 
	 */
	raycast(...args) {
		const raycaster = args[0];
		const intersects = args[1];

		const geometry = this.geometry;
		const material = this.material;
		const matrixWorld = this.matrixWorld;

		if (material === undefined) return;

		// Checking boundingSphere distance to ray

		if (geometry.boundingSphere === null) geometry.computeBoundingSphere();

		_sphere.copy(geometry.boundingSphere);
		_sphere.applyMatrix4(matrixWorld);

		if (raycaster.ray.intersectsSphere(_sphere) === false) return;

		//

		_inverseMatrix.copy(matrixWorld).invert();
		_ray.copy(raycaster.ray).applyMatrix4(_inverseMatrix);

		// Check boundingBox before continuing

		if (geometry.boundingBox !== null) {
			if (_ray.intersectsBox(geometry.boundingBox) === false) return;
		}

		let intersection;

		if (geometry.isBufferGeometry) {
			const index = geometry.index;
			const position = geometry.attributes.position;
			const morphPosition = geometry.morphAttributes.position;
			const morphTargetsRelative = geometry.morphTargetsRelative;
			const uv = geometry.attributes.uv;
			const uv2 = geometry.attributes.uv2;
			const groups = geometry.groups;
			const drawRange = geometry.drawRange;

			if (index !== null) {
				// indexed buffer geometry

				if (Array.isArray(material)) {
					for (let i = 0, il = groups.length; i < il; i++) {
						const group = groups[i];
						const groupMaterial = material[group.materialIndex];

						const start = Math.max(group.start, drawRange.start);
						const end = Math.min((group.start + group.count), (drawRange.start + drawRange.count));

						for (let j = start, jl = end; j < jl; j += 3) {
							const a = index.getX(j);
							const b = index.getX(j + 1);
							const c = index.getX(j + 2);

							intersection = checkBufferGeometryIntersection(this, groupMaterial, raycaster, _ray, position, morphPosition, morphTargetsRelative, uv, uv2, a, b, c);

							if (intersection) {
								intersection.faceIndex = Math.floor(j / 3); // triangle number in indexed buffer semantics
								intersection.face.materialIndex = group.materialIndex;
								intersects.push(intersection);
							}
						}
					}
				} else {
					const start = Math.max(0, drawRange.start);
					const end = Math.min(index.count, (drawRange.start + drawRange.count));

					for (let i = start, il = end; i < il; i += 3) {
						const a = index.getX(i);
						const b = index.getX(i + 1);
						const c = index.getX(i + 2);

						intersection = checkBufferGeometryIntersection(this, material, raycaster, _ray, position, morphPosition, morphTargetsRelative, uv, uv2, a, b, c);

						if (intersection) {
							intersection.faceIndex = Math.floor(i / 3); // triangle number in indexed buffer semantics
							intersects.push(intersection);
						}
					}
				}
			} else if (position !== undefined) {
				// non-indexed buffer geometry

				if (Array.isArray(material)) {
					for (let i = 0, il = groups.length; i < il; i++) {
						const group = groups[i];
						const groupMaterial = material[group.materialIndex];

						const start = Math.max(group.start, drawRange.start);
						const end = Math.min((group.start + group.count), (drawRange.start + drawRange.count));

						for (let j = start, jl = end; j < jl; j += 3) {
							const a = j;
							const b = j + 1;
							const c = j + 2;

							intersection = checkBufferGeometryIntersection(this, groupMaterial, raycaster, _ray, position, morphPosition, morphTargetsRelative, uv, uv2, a, b, c);

							if (intersection) {
								intersection.faceIndex = Math.floor(j / 3); // triangle number in non-indexed buffer semantics
								intersection.face.materialIndex = group.materialIndex;
								intersects.push(intersection);
							}
						}
					}
				} else {
					const start = Math.max(0, drawRange.start);
					const end = Math.min(position.count, (drawRange.start + drawRange.count));

					for (let i = start, il = end; i < il; i += 3) {
						const a = i;
						const b = i + 1;
						const c = i + 2;

						intersection = checkBufferGeometryIntersection(this, material, raycaster, _ray, position, morphPosition, morphTargetsRelative, uv, uv2, a, b, c);

						if (intersection) {
							intersection.faceIndex = Math.floor(i / 3); // triangle number in non-indexed buffer semantics
							intersects.push(intersection);
						}
					}
				}
			}
		} else if (geometry.isGeometry) {
			console.error('THREE.Mesh.raycast() no longer supports THREE.Geometry. Use THREE.BufferGeometry instead.');
		}
	}

}

function checkIntersection(object, material, raycaster, ray, pA, pB, pC, point) {
	let intersect;

	if (material.side === BackSide) {
		intersect = ray.intersectTriangle(pC, pB, pA, true, point);
	} else {
		intersect = ray.intersectTriangle(pA, pB, pC, material.side !== DoubleSide, point);
	}

	if (intersect === null) return null;

	_intersectionPointWorld.copy(point);
	_intersectionPointWorld.applyMatrix4(object.matrixWorld);

	const distance = raycaster.ray.origin.distanceTo(_intersectionPointWorld);

	if (distance < raycaster.near || distance > raycaster.far) return null;

	return {
		distance: distance,
		point: _intersectionPointWorld.clone(),
		object: object,
		face: null,
		uv2: null,
		uv: null,
	};
}

function checkBufferGeometryIntersection(object, material, raycaster, ray, position, morphPosition, morphTargetsRelative, uv, uv2, a, b, c) {
	_vA.fromBufferAttribute(position, a);
	_vB.fromBufferAttribute(position, b);
	_vC.fromBufferAttribute(position, c);

	const morphInfluences = object.morphTargetInfluences;

	if (material.morphTargets && morphPosition && morphInfluences) {
		_morphA.set(0, 0, 0);
		_morphB.set(0, 0, 0);
		_morphC.set(0, 0, 0);

		for (let i = 0, il = morphPosition.length; i < il; i++) {
			const influence = morphInfluences[i];
			const morphAttribute = morphPosition[i];

			if (influence === 0) continue;

			_tempA.fromBufferAttribute(morphAttribute, a);
			_tempB.fromBufferAttribute(morphAttribute, b);
			_tempC.fromBufferAttribute(morphAttribute, c);

			if (morphTargetsRelative) {
				_morphA.addScaledVector(_tempA, influence);
				_morphB.addScaledVector(_tempB, influence);
				_morphC.addScaledVector(_tempC, influence);
			} else {
				_morphA.addScaledVector(_tempA.sub(_vA), influence);
				_morphB.addScaledVector(_tempB.sub(_vB), influence);
				_morphC.addScaledVector(_tempC.sub(_vC), influence);
			}
		}

		_vA.add(_morphA);
		_vB.add(_morphB);
		_vC.add(_morphC);
	}

	if (object.isSkinnedMesh && material.skinning) {
		object.boneTransform(a, _vA);
		object.boneTransform(b, _vB);
		object.boneTransform(c, _vC);
	}

	const intersection = checkIntersection(object, material, raycaster, ray, _vA, _vB, _vC, _intersectionPoint);

	if (intersection) {
		if (uv) {
			_uvA.fromBufferAttribute(uv, a);
			_uvB.fromBufferAttribute(uv, b);
			_uvC.fromBufferAttribute(uv, c);

			intersection.uv = Triangle.getUV(_intersectionPoint, _vA, _vB, _vC, _uvA, _uvB, _uvC, new Vector2());
		}

		if (uv2) {
			_uvA.fromBufferAttribute(uv2, a);
			_uvB.fromBufferAttribute(uv2, b);
			_uvC.fromBufferAttribute(uv2, c);

			intersection.uv2 = Triangle.getUV(_intersectionPoint, _vA, _vB, _vC, _uvA, _uvB, _uvC, new Vector2());
		}

		const face = {
			a: a,
			b: b,
			c: c,
			normal: new Vector3(),
			materialIndex: 0,
		};

		Triangle.getNormal(_vA, _vB, _vC, face.normal);

		intersection.face = face;
	}

	return intersection;
}

export { Mesh };
