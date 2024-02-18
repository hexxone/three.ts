import { Color } from '../math/Color';
import { TFog } from './TFog';

/**
 * @public
 */
class FogExp2 extends TFog {

    isFogExp2 = true;

    constructor(color: Color, density) {
        super();
        this.name = '';

        this.color = color;
        this.density = density !== undefined ? density : 0.00025;
    }

    clone() {
        return new FogExp2(this.color, this.density);
    }

}

export { FogExp2 };
