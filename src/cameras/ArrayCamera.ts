import { PerspectiveCamera } from "./";

class ArrayCamera extends PerspectiveCamera {
	cameras: any;

	constructor(array = []) {
		super();

		this.isArrayCamera = true;

		this.cameras = array;
	}
}

export { ArrayCamera };
