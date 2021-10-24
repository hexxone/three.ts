import { Object3D } from '../core/Object3D';

class Bone extends Object3D {
	constructor() {
		super();

		this.type = 'Bone';

		Object.defineProperty(this, 'isBone', { value: true });
	}
}

export { Bone };
