import { EllipseCurve } from './EllipseCurve';

class ArcCurve extends EllipseCurve {
	constructor(aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise) {
		super(aX, aY, aRadius, aRadius, aStartAngle, aEndAngle, aClockwise);

		Object.defineProperty(this, 'isArcCurce', {
			value: true
		});

		this.type = 'ArcCurve';
	}
}

export { ArcCurve };
