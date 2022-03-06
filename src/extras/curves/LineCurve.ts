import { Curve, Vector2 } from "../../";

class LineCurve extends Curve {
	v1: Vector2;
	v2: Vector2;

	constructor(v1 = new Vector2(), v2 = new Vector2()) {
		super();

		this.isLineCurve = true;
		this.type = "LineCurve";

		this.v1 = v1;
		this.v2 = v2;

		this.isLineCurve = true;
	}

	getPoint(t: number, optionalTarget = new Vector2()) {
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

	getTangent(t, optionalTarget) {
		const tangent = optionalTarget || new Vector2();

		tangent.copy(this.v2).sub(this.v1).normalize();

		return tangent;
	}

	copy(source: LineCurve) {
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

export { LineCurve };
