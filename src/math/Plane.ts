import { Box3, Line, Line3, Matrix4, Sphere } from "../";
import { Matrix3 } from "./Matrix3";
import { Vector3 } from "./Vector3";

const _vector1 = /* @__PURE__*/ new Vector3();
const _vector2 = /* @__PURE__*/ new Vector3();
const _normalMatrix = /* @__PURE__*/ new Matrix3();

class Plane {
	normal: Vector3;
	constant: number;
	isPlane = true;

	constructor(normal = new Vector3(1, 0, 0), constant = 0) {
		// normal is assumed to be normalized

		this.normal = normal;
		this.constant = constant;
	}

	set(normal: Vector3, constant: number) {
		this.normal.copy(normal);
		this.constant = constant;

		return this;
	}

	setComponents(x: number, y: number, z: number, w: number) {
		this.normal.set(x, y, z);
		this.constant = w;

		return this;
	}

	setFromNormalAndCoplanarPoint(normal: Vector3, point: Vector3) {
		this.normal.copy(normal);
		this.constant = -point.dot(this.normal);

		return this;
	}

	setFromCoplanarPoints(a: Vector3, b: Vector3, c: Vector3) {
		const normal = _vector1
			.subVectors(c, b)
			.cross(_vector2.subVectors(a, b))
			.normalize();

		// Q: should an error be thrown if normal is zero (e.g. degenerate plane)?

		this.setFromNormalAndCoplanarPoint(normal, a);

		return this;
	}

	copy(plane: Plane) {
		this.normal.copy(plane.normal);
		this.constant = plane.constant;

		return this;
	}

	normalize() {
		// Note: will lead to a divide by zero if the plane is invalid.

		const inverseNormalLength = 1.0 / this.normal.length();
		this.normal.multiplyScalar(inverseNormalLength);
		this.constant *= inverseNormalLength;

		return this;
	}

	negate() {
		this.constant *= -1;
		this.normal.negate();

		return this;
	}

	distanceToPoint(point: Vector3) {
		return this.normal.dot(point) + this.constant;
	}

	distanceToSphere(sphere: Sphere) {
		return this.distanceToPoint(sphere.center) - sphere.radius;
	}

	projectPoint(point: Vector3, target: Vector3) {
		return target
			.copy(this.normal)
			.multiplyScalar(-this.distanceToPoint(point))
			.add(point);
	}

	intersectLine(line: Line3, target: Vector3) {
		const direction = line.delta(_vector1);

		const denominator = this.normal.dot(direction);

		if (denominator === 0) {
			// line is coplanar, return origin
			if (this.distanceToPoint(line.start) === 0) {
				return target.copy(line.start);
			}

			// Unsure if this is the correct method to handle this case.
			return undefined;
		}

		const t = -(line.start.dot(this.normal) + this.constant) / denominator;

		if (t < 0 || t > 1) {
			return undefined;
		}

		return target.copy(direction).multiplyScalar(t).add(line.start);
	}

	intersectsLine(line: Line3) {
		// Note: this tests if a line intersects the plane, not whether it (or its end-points) are coplanar with it.

		const startSign = this.distanceToPoint(line.start);
		const endSign = this.distanceToPoint(line.end);

		return (startSign < 0 && endSign > 0) || (endSign < 0 && startSign > 0);
	}

	intersectsBox(box: Box3) {
		return box.intersectsPlane(this);
	}

	intersectsSphere(sphere: Sphere) {
		return sphere.intersectsPlane(this);
	}

	coplanarPoint(target: Vector3) {
		return target.copy(this.normal).multiplyScalar(-this.constant);
	}

	applyMatrix4(matrix: Matrix4, optionalNormalMatrix: Matrix3) {
		const normalMatrix =
			optionalNormalMatrix || _normalMatrix.getNormalMatrix(matrix);

		const referencePoint = this.coplanarPoint(_vector1).applyMatrix4(matrix);

		const normal = this.normal.applyMatrix3(normalMatrix).normalize();

		this.constant = -referencePoint.dot(normal);

		return this;
	}

	translate(offset) {
		this.constant -= offset.dot(this.normal);

		return this;
	}

	equals(plane: Plane) {
		return plane.normal.equals(this.normal) && plane.constant === this.constant;
	}

	clone() {
		return new Plane().copy(this);
	}
}

export { Plane };
