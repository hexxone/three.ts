import { Vector3 } from '../../math/Vector3';
import { Curve } from '../core/Curve';
import { cubicBezier } from '../core/Interpolations';

class CubicBezierCurve3 extends Curve {

    v0: Vector3;
    v1: Vector3;
    v2: Vector3;
    v3: Vector3;

    constructor(
        v0 = new Vector3(),
        v1 = new Vector3(),
        v2 = new Vector3(),
        v3 = new Vector3()
    ) {
        super();

        this.isCubicBezierCurve3 = true;
        this.type = 'CubicBezierCurve3';

        this.v0 = v0;
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
    }

    getPoint(t, optionalTarget = new Vector3()) {
        const point = optionalTarget;

        const { v0 } = this;
        const { v1 } = this;
        const { v2 } = this;
        const { v3 } = this;

        point.set(
            cubicBezier(t, v0.x, v1.x, v2.x, v3.x),
            cubicBezier(t, v0.y, v1.y, v2.y, v3.y),
            cubicBezier(t, v0.z, v1.z, v2.z, v3.z)
        );

        return point;
    }

    copy(source: CubicBezierCurve3) {
        super.copy(source);

        this.v0.copy(source.v0);
        this.v1.copy(source.v1);
        this.v2.copy(source.v2);
        this.v3.copy(source.v3);

        return this;
    }

    fromJSON(json) {
        super.fromJSON(json);

        this.v0.fromArray(json.v0);
        this.v1.fromArray(json.v1);
        this.v2.fromArray(json.v2);
        this.v3.fromArray(json.v3);

        return this;
    }

}

export { CubicBezierCurve3 };
