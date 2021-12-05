import { Curve, Vector3 } from "../../";

class LineCurve3 extends Curve {
	v1: Vector3;
	v2: Vector3;

	constructor(v1 = new Vector3(), v2 = new Vector3()) {
		super();

		this.isLineCurve3 = true;
		this.type = "LineCurve3";

		this.v1 = v1;
		this.v2 = v2;
	}

	getPoint(t, optionalTarget = new Vector3()) {
		const point = optionalTarget;

		if (t === 1) {
			point.copy(this.v2);
		} else {
			point.copy(this.v2).sub(this.v1);
			point.multiplyScalar(t).add(this.v1);
		}

		return point;
	}

	// Line curve is linear, so we can overwrite default getPointAt
	getPointAt(u, optionalTarget) {
		return this.getPoint(u, optionalTarget);
	}

	copy(source: LineCurve3) {
		super.copy(source);

		this.v1.copy(source.v1);
		this.v2.copy(source.v2);

		return this;
	}

	fromJSON(json) {
		super.fromJSON(json);

		this.v1.fromArray(json.v1);
		this.v2.fromArray(json.v2);

		return this;
	}
}

export { LineCurve3 };
