import { Vector2 } from '../../math/Vector2';
import { Curve } from '../core/Curve';

class EllipseCurve extends Curve {

    aX: number;
    aY: number;
    xRadius: number;
    yRadius: number;
    aStartAngle: number;
    aEndAngle: number;
    aClockwise: boolean;
    aRotation: number;

    constructor(
        aX = 0,
        aY = 0,
        xRadius = 1,
        yRadius = 1,
        aStartAngle = 0,
        aEndAngle = Math.PI * 2,
        aClockwise = false,
        aRotation = 0
    ) {
        super();

        this.isEllipseCurve = true;
        this.type = 'EllipseCurve';

        this.aX = aX;
        this.aY = aY;

        this.xRadius = xRadius;
        this.yRadius = yRadius;

        this.aStartAngle = aStartAngle;
        this.aEndAngle = aEndAngle;

        this.aClockwise = aClockwise;

        this.aRotation = aRotation;
    }

    getPoint(t: number, point = new Vector2()) {
        const twoPi = Math.PI * 2;
        let deltaAngle = this.aEndAngle - this.aStartAngle;
        const samePoints = Math.abs(deltaAngle) < Number.EPSILON;

        // ensures that deltaAngle is 0 .. 2 PI
        while (deltaAngle < 0) { deltaAngle += twoPi; }
        while (deltaAngle > twoPi) { deltaAngle -= twoPi; }

        if (deltaAngle < Number.EPSILON) {
            if (samePoints) {
                deltaAngle = 0;
            } else {
                deltaAngle = twoPi;
            }
        }

        if (this.aClockwise === true && !samePoints) {
            if (deltaAngle === twoPi) {
                deltaAngle = -twoPi;
            } else {
                deltaAngle -= twoPi;
            }
        }

        const angle = this.aStartAngle + t * deltaAngle;
        let x = this.aX + this.xRadius * Math.cos(angle);
        let y = this.aY + this.yRadius * Math.sin(angle);

        if (this.aRotation !== 0) {
            const cos = Math.cos(this.aRotation);
            const sin = Math.sin(this.aRotation);

            const tx = x - this.aX;
            const ty = y - this.aY;

            // Rotate the point about the center of the ellipse.
            x = tx * cos - ty * sin + this.aX;
            y = tx * sin + ty * cos + this.aY;
        }

        return point.set(x, y);
    }

    copy(source: EllipseCurve) {
        super.copy(source);

        this.aX = source.aX;
        this.aY = source.aY;

        this.xRadius = source.xRadius;
        this.yRadius = source.yRadius;

        this.aStartAngle = source.aStartAngle;
        this.aEndAngle = source.aEndAngle;

        this.aClockwise = source.aClockwise;

        this.aRotation = source.aRotation;

        return this;
    }

    fromJSON(json) {
        super.fromJSON(json);

        this.aX = json.aX;
        this.aY = json.aY;

        this.xRadius = json.xRadius;
        this.yRadius = json.yRadius;

        this.aStartAngle = json.aStartAngle;
        this.aEndAngle = json.aEndAngle;

        this.aClockwise = json.aClockwise;

        this.aRotation = json.aRotation;

        return this;
    }

}

export { EllipseCurve };
