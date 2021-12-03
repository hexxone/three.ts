import { Object3D } from "../";

class Group extends Object3D {
	constructor() {
		super();

		this.isGroup = true;

		this.type = "Group";
	}
}

export { Group };
