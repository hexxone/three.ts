import { PerspectiveCamera } from './PerspectiveCamera';

class ArrayCamera extends PerspectiveCamera {

	isArrayCamera: true;
	cameras: any;

	constructor( array = [] ) {
		super();

		this.cameras = array;
	}
}

export { ArrayCamera };
