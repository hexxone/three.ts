import { Material } from "../materials/Material";
import { Euler } from "../math/Euler";
import { generateUUID } from "../math/MathUtils";
import { Matrix3 } from "../math/Matrix3";
import { Matrix4 } from "../math/Matrix4";
import { Quaternion } from "../math/Quaternion";
import { Vector3 } from "../math/Vector3";
import { IIntersection } from "../objects/IIntersection";
import { Skeleton } from "../objects/Skeleton";
import { BufferAttribute } from "./BufferAttribute";
import { BufferGeometry } from "./BufferGeometry";
import { EventDispatcher, EventObject } from "./EventDispatcher";
import { Layers } from "./Layers";
import { Raycaster } from "./Raycaster";


let _object3DId = 0;

const _v1 = new Vector3();
const _q1 = new Quaternion();
const _m1 = new Matrix4();
const _target = new Vector3();

const _position = new Vector3();
const _scale = new Vector3();
const _quaternion = new Quaternion();

const _xAxis = new Vector3(1, 0, 0);
const _yAxis = new Vector3(0, 1, 0);
const _zAxis = new Vector3(0, 0, 1);

const _addedEvent = { type: "added" } as EventObject;
const _removedEvent = { type: "removed" } as EventObject;

export const DefaultMatrixAutoUpdate = true;
export const DefaultUp = new Vector3(0, 1, 0);

/**
 * @public
 */
export class Object3D extends EventDispatcher {
	isObject3D: boolean;

	id: number;
	uuid: string;
	name: string;
	type: string;

	parent: Object3D;
	children: Object3D[];

	up: Vector3 = null;
	position: Vector3 = null;
	rotation: Euler = null;
	quaternion: Quaternion = null;
	scale: Vector3 = null;

	modelViewMatrix = new Matrix4();
	normalMatrix = new Matrix3();

	matrix = new Matrix4();
	matrixWorld = new Matrix4();
	matrixAutoUpdate = DefaultMatrixAutoUpdate;
	matrixWorldNeedsUpdate = false;
	instanceMatrix: BufferAttribute;

	layers = new Layers();
	visible = true;
	castShadow = false;
	receiveShadow = false;
	frustumCulled = true;

	renderOrder = 0;
	animations = [];
	userData = {};
	geometry: BufferGeometry;

	count: number;

	bindMode: string;
	bindMatrix: Matrix4;

	skeleton: Skeleton;
	material: Material;

	customDepthMaterial?: Material;
	customDistanceMaterial?: Material;

	morphTargetInfluences: number[];
	morphTargetDictionary: {
		[name: string]: number;
	};

	isBone: boolean;
	isCamera: boolean;
	isLight: boolean;
	isInstancedMesh: boolean;
	isMesh: boolean;
	isLine: boolean;
	isPoints: boolean;
	isSkinnedMesh: boolean;
	isScene: boolean;
	autoUpdate: boolean;
	isImmediateRenderObject: boolean;
	isGroup: boolean;
	isLOD: boolean;
	isSprite: boolean;
	isSkeletonHelper: boolean;

	constructor() {
		super();
		this.isObject3D = true;

		Object.defineProperty(this, "id", { value: _object3DId++ });

		this.uuid = generateUUID();

		this.name = "";
		this.type = "Object3D";

		this.parent = null;
		this.children = [];

		this.up = DefaultUp.clone();

		this.position = new Vector3();

		this.rotation = new Euler();
		this.rotation._onChange(this._onRotationChange.bind(this));

		this.quaternion = new Quaternion();
		this.quaternion._onChange(this._onQuaternionChange.bind(this));

		this.scale = new Vector3(1, 1, 1);
	}

	_onRotationChange() {
		this.quaternion.setFromEuler(this.rotation, false);
	}

	_onQuaternionChange() {
		this.rotation.setFromQuaternion(this.quaternion, null, false);
	}

	onBeforeRender(...args) {}

	onAfterRender(...args) {}

	update(...args) {}

	applyMatrix4(matrix: Matrix4) {
		if (this.matrixAutoUpdate) this.updateMatrix();

		this.matrix.premultiply(matrix);

		this.matrix.decompose(this.position, this.quaternion, this.scale);
	}

	applyQuaternion(q: Quaternion) {
		this.quaternion.premultiply(q);

		return this;
	}

	setRotationFromAxisAngle(axis, angle) {
		// assumes axis is normalized

		this.quaternion.setFromAxisAngle(axis, angle);
	}

	setRotationFromEuler(euler: Euler) {
		this.quaternion.setFromEuler(euler, true);
	}

	setRotationFromMatrix(m: Matrix4) {
		// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

		this.quaternion.setFromRotationMatrix(m);
	}

	setRotationFromQuaternion(q: Quaternion) {
		// assumes q is normalized

		this.quaternion.copy(q);
	}

	rotateOnAxis(axis: Vector3, angle) {
		// rotate object on axis in object space
		// axis is assumed to be normalized

		_q1.setFromAxisAngle(axis, angle);

		this.quaternion.multiply(_q1);

		return this;
	}

	rotateOnWorldAxis(axis, angle) {
		// rotate object on axis in world space
		// axis is assumed to be normalized
		// method assumes no rotated parent

		_q1.setFromAxisAngle(axis, angle);

		this.quaternion.premultiply(_q1);

		return this;
	}

	rotateX(angle) {
		return this.rotateOnAxis(_xAxis, angle);
	}

	rotateY(angle) {
		return this.rotateOnAxis(_yAxis, angle);
	}

	rotateZ(angle) {
		return this.rotateOnAxis(_zAxis, angle);
	}

	translateOnAxis(axis, distance) {
		// translate object by distance along axis in object space
		// axis is assumed to be normalized

		_v1.copy(axis).applyQuaternion(this.quaternion);

		this.position.add(_v1.multiplyScalar(distance));

		return this;
	}

	translateX(distance) {
		return this.translateOnAxis(_xAxis, distance);
	}

	translateY(distance) {
		return this.translateOnAxis(_yAxis, distance);
	}

	translateZ(distance) {
		return this.translateOnAxis(_zAxis, distance);
	}

	localToWorld(vector: Vector3) {
		return vector.applyMatrix4(this.matrixWorld);
	}

	worldToLocal(vector: Vector3) {
		return vector.applyMatrix4(_m1.copy(this.matrixWorld).invert());
	}

	lookAt(x, y?, z?) {
		// This method does not support objects having non-uniformly-scaled parent(s)

		if (x.isVector3) {
			_target.copy(x);
		} else {
			_target.set(x, y, z);
		}

		const parent = this.parent;

		this.updateWorldMatrix(true, false);

		_position.setFromMatrixPosition(this.matrixWorld);

		if (this.isCamera || this.isLight) {
			_m1.lookAt(_position, _target, this.up);
		} else {
			_m1.lookAt(_target, _position, this.up);
		}

		this.quaternion.setFromRotationMatrix(_m1);

		if (parent) {
			_m1.extractRotation(parent.matrixWorld);
			_q1.setFromRotationMatrix(_m1);
			this.quaternion.premultiply(_q1.invert());
		}
	}

	add(...args: Object3D[]) {
		const object = args[0];

		if (args.length > 1) {
			for (let i = 0; i < args.length; i++) {
				this.add(args[i]);
			}

			return this;
		}

		if (object === this) {
			console.error(
				"Object3D.add: object can't be added as a child of itself.",
				object
			);
			return this;
		}

		if (object && object.isObject3D) {
			if (object.parent !== null) {
				object.parent.remove(object);
			}

			object.parent = this;
			this.children.push(object);

			object.dispatchEvent(_addedEvent);
		} else {
			console.error(
				"Object3D.add: object not an instance of Object3D.",
				object
			);
		}

		return this;
	}

	remove(...args: Object3D[]) {
		const object = args[0];

		if (args.length > 1) {
			for (let i = 0; i < args.length; i++) {
				this.remove(args[i]);
			}

			return this;
		}

		const index = this.children.indexOf(object);

		if (index !== -1) {
			object.parent = null;
			this.children.splice(index, 1);

			object.dispatchEvent(_removedEvent);
		}

		return this;
	}

	clear() {
		for (let i = 0; i < this.children.length; i++) {
			const object = this.children[i];

			object.parent = null;

			object.dispatchEvent(_removedEvent);
		}

		this.children.length = 0;

		return this;
	}

	attach(object: Object3D) {
		// adds object as a child of this, while maintaining the object's world transform

		this.updateWorldMatrix(true, false);

		_m1.copy(this.matrixWorld).invert();

		if (object.parent !== null) {
			object.parent.updateWorldMatrix(true, false);

			_m1.multiply(object.parent.matrixWorld);
		}

		object.applyMatrix4(_m1);

		this.add(object);

		object.updateWorldMatrix(false, true);

		return this;
	}

	getObjectById(id) {
		return this.getObjectByProperty("id", id);
	}

	getObjectByName(name) {
		return this.getObjectByProperty("name", name);
	}

	getObjectByProperty(name, value) {
		if (this[name] === value) return this;

		for (let i = 0, l = this.children.length; i < l; i++) {
			const child = this.children[i];
			const object = child.getObjectByProperty(name, value);

			if (object !== undefined) {
				return object;
			}
		}

		return undefined;
	}

	getWorldPosition(target: Vector3) {
		this.updateWorldMatrix(true, false);

		return target.setFromMatrixPosition(this.matrixWorld);
	}

	getWorldQuaternion(target: Quaternion) {
		this.updateWorldMatrix(true, false);

		this.matrixWorld.decompose(_position, target, _scale);

		return target;
	}

	getWorldScale(target: Vector3) {
		this.updateWorldMatrix(true, false);

		this.matrixWorld.decompose(_position, _quaternion, target);

		return target;
	}

	getWorldDirection(target: Vector3) {
		this.updateWorldMatrix(true, false);

		const e = this.matrixWorld.elements;

		return target.set(e[8], e[9], e[10]).normalize();
	}

	raycast(raycaster: Raycaster, intersects: IIntersection[]) {
		// TODO fix impl arguments
	}

	traverse(callback: (object: Object3D) => void) {
		callback(this);

		const children = this.children;

		for (let i = 0, l = children.length; i < l; i++) {
			children[i].traverse(callback);
		}
	}

	traverseVisible(callback: (object: Object3D) => void) {
		if (this.visible === false) return;

		callback(this);

		const children = this.children;

		for (let i = 0, l = children.length; i < l; i++) {
			children[i].traverseVisible(callback);
		}
	}

	traverseAncestors(callback: (object: Object3D) => void) {
		const parent = this.parent;

		if (parent !== null) {
			callback(parent);

			parent.traverseAncestors(callback);
		}
	}

	updateMatrix() {
		this.matrix.compose(this.position, this.quaternion, this.scale);

		this.matrixWorldNeedsUpdate = true;
	}

	updateMatrixWorld(force?) {
		if (this.matrixAutoUpdate) this.updateMatrix();

		if (this.matrixWorldNeedsUpdate || force) {
			if (this.parent === null) {
				this.matrixWorld.copy(this.matrix);
			} else {
				this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);
			}

			this.matrixWorldNeedsUpdate = false;

			force = true;
		}

		// update children

		const children = this.children;

		for (let i = 0, l = children.length; i < l; i++) {
			children[i].updateMatrixWorld(force);
		}
	}

	updateWorldMatrix(updateParents, updateChildren) {
		const parent = this.parent;

		if (updateParents === true && parent !== null) {
			parent.updateWorldMatrix(true, false);
		}

		if (this.matrixAutoUpdate) this.updateMatrix();

		if (this.parent === null) {
			this.matrixWorld.copy(this.matrix);
		} else {
			this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);
		}

		// update children

		if (updateChildren === true) {
			const children = this.children;

			for (let i = 0, l = children.length; i < l; i++) {
				children[i].updateWorldMatrix(false, true);
			}
		}
	}

	clone(recursive?) {
		return new Object3D().copy(this, recursive);
	}

	copy(source: Object3D, recursive = true) {
		this.name = source.name;

		this.up.copy(source.up);

		this.position.copy(source.position);
		this.rotation.order = source.rotation.order;
		this.quaternion.copy(source.quaternion);
		this.scale.copy(source.scale);

		this.matrix.copy(source.matrix);
		this.matrixWorld.copy(source.matrixWorld);

		this.matrixAutoUpdate = source.matrixAutoUpdate;
		this.matrixWorldNeedsUpdate = source.matrixWorldNeedsUpdate;

		this.layers.mask = source.layers.mask;
		this.visible = source.visible;

		this.castShadow = source.castShadow;
		this.receiveShadow = source.receiveShadow;

		this.frustumCulled = source.frustumCulled;
		this.renderOrder = source.renderOrder;

		this.userData = JSON.parse(JSON.stringify(source.userData));

		if (recursive === true) {
			for (let i = 0; i < source.children.length; i++) {
				const child = source.children[i];
				this.add(child.clone());
			}
		}

		return this;
	}
}
