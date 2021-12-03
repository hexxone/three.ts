import { Object3D } from '../';

class Bone extends Object3D {
	constructor() {
		super();

		this.isBone = true;
		this.type = 'Bone';
	}
}

export { Bone };
