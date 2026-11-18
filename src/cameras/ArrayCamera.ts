import { PerspectiveCamera } from './PerspectiveCamera';

class ArrayCamera extends PerspectiveCamera {

    cameras: PerspectiveCamera[];

    constructor(array: PerspectiveCamera[] = []) {
        super();

        this.isArrayCamera = true;

        this.cameras = array;
    }

}

export { ArrayCamera };
