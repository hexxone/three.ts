import { Vector2 } from '../../math/Vector2';
import { Vector3 } from '../../math/Vector3';
import { Curve } from '../core/Curve';
import { catmullRom } from '../core/Interpolations';

class SplineCurve extends Curve {

    points: Vector2[];

    constructor(points?: Vector2[]) {
        super();

        this.isSplineCurve = true;
        this.type = 'SplineCurve';

        this.points = points || [];
    }

    getPoint(t: number, optionalTarget = new Vector2()) {
        const point = optionalTarget;

        const { points } = this;
        const p = (points.length - 1) * t;

        const intPoint = Math.floor(p);
        const weight = p - intPoint;

        const p0 = points[intPoint === 0 ? intPoint : intPoint - 1];
        const p1 = points[intPoint];
        const p2
            = points[
                intPoint > points.length - 2 ? points.length - 1 : intPoint + 1
            ];
        const p3
            = points[
                intPoint > points.length - 3 ? points.length - 1 : intPoint + 2
            ];

        point.set(
            catmullRom(weight, p0.x, p1.x, p2.x, p3.x),
            catmullRom(weight, p0.y, p1.y, p2.y, p3.y)
        );

        return point;
    }

    copy(source: SplineCurve) {
        super.copy(source);

        this.points = [];

        for (let i = 0, l = source.points.length; i < l; i++) {
            const point = source.points[i];

            this.points.push(point.clone());
        }

        return this;
    }

    fromJSON(json) {
        super.fromJSON(json);

        this.points = [];

        for (let i = 0, l = json.points.length; i < l; i++) {
            const point = json.points[i];

            this.points.push(new Vector2().fromArray(point));
        }

        return this;
    }

}

export { SplineCurve };
