import { Light } from './Light';

class RectAreaLight extends Light {

    constructor(color, intensity, width = 10, height = 10) {
        super(color, intensity);

        this.isRectAreaLight = true;

        this.type = 'RectAreaLight';

        this.width = width;
        this.height = height;
    }

    copy(source: RectAreaLight) {
        super.copy(source);

        this.width = source.width;
        this.height = source.height;

        return this;
    }

}

export { RectAreaLight };
