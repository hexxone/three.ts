import { Object3D } from "..";

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
