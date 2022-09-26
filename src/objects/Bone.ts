import { Object3D } from "../core/Object3D";

/**
 * @public
 */
export class Bone extends Object3D {
	constructor() {
		super();

		this.isBone = true;
		this.type = "Bone";
	}
}
