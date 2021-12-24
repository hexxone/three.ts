import { Matrix4, Object3D, Vector3 } from "../";

export class Camera extends Object3D {
	isCamera = true;
	isOrthographicCamera: boolean;
	isPerspectiveCamera: boolean;
	isArrayCamera: boolean;

	zoom: number;
	view: any;
	near: number;
	far: number;

	matrixWorldInverse: Matrix4;
	projectionMatrix: Matrix4;
	projectionMatrixInverse: Matrix4;

	constructor() {
		super();

		this.type = "Camera";

		this.matrixWorldInverse = new Matrix4();

		this.projectionMatrix = new Matrix4();
		this.projectionMatrixInverse = new Matrix4();
	}

	copy(source, recursive?) {
		super.copy(source, recursive);

		this.matrixWorldInverse.copy(source.matrixWorldInverse);

		this.projectionMatrix.copy(source.projectionMatrix);
		this.projectionMatrixInverse.copy(source.projectionMatrixInverse);

		return this;
	}

	getWorldDirection(target) {
		if (target === undefined) {
			console.warn("Camera: .getWorldDirection() target is now required");
			target = new Vector3();
		}

		this.updateWorldMatrix(true, false);

		const e = this.matrixWorld.elements;

		return target.set(-e[8], -e[9], -e[10]).normalize();
	}

	updateMatrixWorld(force?) {
		super.updateMatrixWorld(force);

		this.matrixWorldInverse.copy(this.matrixWorld).invert();
	}

	updateWorldMatrix(updateParents, updateChildren) {
		super.updateWorldMatrix(updateParents, updateChildren);

		this.matrixWorldInverse.copy(this.matrixWorld).invert();
	}

	updateProjectionMatrix() {}

	clone() {
		return new Camera().copy(this);
	}
}
