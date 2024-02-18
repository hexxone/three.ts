import { Color } from '../math/Color';

/**
 * @public
 */
abstract class TFog {

    name: string;
    color: Color;

    near: number;
    far: number;
    isFog: boolean;

    density: number;
    isFogExp2: boolean;

    clone(): TFog {
        return null;
    }

}

export { TFog };
