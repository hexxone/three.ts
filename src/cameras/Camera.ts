import { Matrix4 } from '../math/Matrix4';
import { Object3D } from '../core/Object3D';
import { Vector3 } from '../math/Vector3';

export class Camera extends Object3D {

	isCamera = true;

	matrixWorldInverse: Matrix4;
	projectionMatrix: Matrix4;
	projectionMatrixInverse: Matrix4;

	constructor() {
		super();

		this.type = 'Camera';

		this.matrixWorldInverse = new Matrix4();

		this.projectionMatrix = new Matrix4();
		this.projectionMatrixInverse = new Matrix4();
	}


	copy(source, recursive?) {
		Object3D.prototype.copy.call(this, source, recursive);

		this.matrixWorldInverse.copy(source.matrixWorldInverse);

		this.projectionMatrix.copy(source.projectionMatrix);
		this.projectionMatrixInverse.copy(source.projectionMatrixInverse);

		return this;
	}

	getWorldDirection(target) {
		if (target === undefined) {
			console.warn('THREE.Camera: .getWorldDirection() target is now required');
			target = new Vector3();
		}

		this.updateWorldMatrix(true, false);

		const e = this.matrixWorld.elements;

		return target.set(- e[8], - e[9], - e[10]).normalize();
	}

	updateMatrixWorld(force) {
		Object3D.prototype.updateMatrixWorld.call(this, force);

		this.matrixWorldInverse.copy(this.matrixWorld).invert();
	}

	updateWorldMatrix(updateParents, updateChildren) {
		Object3D.prototype.updateWorldMatrix.call(this, updateParents, updateChildren);

		this.matrixWorldInverse.copy(this.matrixWorld).invert();
	}

	clone() {
		return new Camera().copy(this);
	}

}