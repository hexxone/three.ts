import { Object3D } from "../core/Object3D";

/**
 * @public
 */
export class Group extends Object3D {
	constructor() {
		super();

		this.isGroup = true;

		this.type = "Group";
	}
}
