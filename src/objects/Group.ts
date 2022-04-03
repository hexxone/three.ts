import { Object3D } from "..";

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
