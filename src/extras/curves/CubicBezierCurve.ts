import { Vector2, Curve, cubicBezier } from "../../";

class CubicBezierCurve extends Curve {
	v0: Vector2;
	v1: Vector2;
	v2: Vector2;
	v3: Vector2;

	constructor(
		v0 = new Vector2(),
		v1 = new Vector2(),
		v2 = new Vector2(),
		v3 = new Vector2()
	) {
		super();

		this.isCubicBezierCurve = true;
		this.type = "CubicBezierCurve";

		this.v0 = v0;
		this.v1 = v1;
		this.v2 = v2;
		this.v3 = v3;
	}

	getPoint(t: number, optionalTarget = new Vector2()) {
		const point = optionalTarget;

		const v0 = this.v0;
		const v1 = this.v1;
		const v2 = this.v2;
		const v3 = this.v3;

		point.set(
			cubicBezier(t, v0.x, v1.x, v2.x, v3.x),
			cubicBezier(t, v0.y, v1.y, v2.y, v3.y)
		);

		return point;
	}

	copy(source: CubicBezierCurve) {
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

export { CubicBezierCurve };
