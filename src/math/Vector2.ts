import { BufferAttribute } from '../core/BufferAttribute';
import { InterleavedBufferAttribute } from '../core/InterleavedBufferAttribute';
import { Matrix3 } from './Matrix3';

/**
 * @public
 */
class Vector2 {

    x: any;
    y: any;
    isVector2 = true;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    get width() {
        return this.x;
    }

    set width(value) {
        this.x = value;
    }

    get height() {
        return this.y;
    }

    set height(value) {
        this.y = value;
    }

    set(x, y) {
        this.x = x;
        this.y = y;

        return this;
    }

    setScalar(scalar) {
        this.x = scalar;
        this.y = scalar;

        return this;
    }

    setX(x) {
        this.x = x;

        return this;
    }

    setY(y) {
        this.y = y;

        return this;
    }

    setComponent(index, value) {
        switch (index) {
            case 0:
                this.x = value;
                break;
            case 1:
                this.y = value;
                break;
            default:
                throw new Error(`index is out of range: ${index}`);
        }

        return this;
    }

    getComponent(index) {
        switch (index) {
            case 0:
                return this.x;
            case 1:
                return this.y;
            default:
                throw new Error(`index is out of range: ${index}`);
        }
    }

    clone() {
        return new Vector2(this.x, this.y);
    }

    copy(v: Vector2) {
        this.x = v.x;
        this.y = v.y;

        return this;
    }

    add(v: Vector2, w?) {
        if (w !== undefined) {
            console.warn(
                'Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead.'
            );

            return this.addVectors(v, w);
        }

        this.x += v.x;
        this.y += v.y;

        return this;
    }

    addScalar(s: number) {
        this.x += s;
        this.y += s;

        return this;
    }

    addVectors(a: Vector2, b: Vector2) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;

        return this;
    }

    addScaledVector(v: Vector2, s: number) {
        this.x += v.x * s;
        this.y += v.y * s;

        return this;
    }

    sub(v: Vector2, w?) {
        if (w !== undefined) {
            console.warn(
                'Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.'
            );

            return this.subVectors(v, w);
        }

        this.x -= v.x;
        this.y -= v.y;

        return this;
    }

    subScalar(s: number) {
        this.x -= s;
        this.y -= s;

        return this;
    }

    subVectors(a: Vector2, b: Vector2) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;

        return this;
    }

    multiply(v: Vector2) {
        this.x *= v.x;
        this.y *= v.y;

        return this;
    }

    multiplyScalar(scalar: number) {
        this.x *= scalar;
        this.y *= scalar;

        return this;
    }

    divide(v: Vector2) {
        this.x /= v.x;
        this.y /= v.y;

        return this;
    }

    divideScalar(scalar: number) {
        return this.multiplyScalar(1 / scalar);
    }

    applyMatrix3(m: Matrix3) {
        const { x } = this;
        const { y } = this;
        const e = m.elements;

        this.x = e[0] * x + e[3] * y + e[6];
        this.y = e[1] * x + e[4] * y + e[7];

        return this;
    }

    min(v: Vector2) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);

        return this;
    }

    max(v: Vector2) {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);

        return this;
    }

    clamp(min: Vector2, max: Vector2) {
        // assumes min < max, componentwise

        this.x = Math.max(min.x, Math.min(max.x, this.x));
        this.y = Math.max(min.y, Math.min(max.y, this.y));

        return this;
    }

    clampScalar(minVal: number, maxVal: number) {
        this.x = Math.max(minVal, Math.min(maxVal, this.x));
        this.y = Math.max(minVal, Math.min(maxVal, this.y));

        return this;
    }

    clampLength(min: number, max: number) {
        const length = this.length();

        return this.divideScalar(length || 1).multiplyScalar(
            Math.max(min, Math.min(max, length))
        );
    }

    floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);

        return this;
    }

    ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);

        return this;
    }

    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);

        return this;
    }

    roundToZero() {
        this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x);
        this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y);

        return this;
    }

    negate() {
        this.x = -this.x;
        this.y = -this.y;

        return this;
    }

    dot(v: Vector2) {
        return this.x * v.x + this.y * v.y;
    }

    cross(v: Vector2) {
        return this.x * v.y - this.y * v.x;
    }

    lengthSq() {
        return this.x * this.x + this.y * this.y;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    manhattanLength() {
        return Math.abs(this.x) + Math.abs(this.y);
    }

    normalize() {
        return this.divideScalar(this.length() || 1);
    }

    angle() {
        // computes the angle in radians with respect to the positive x-axis

        const angle = Math.atan2(-this.y, -this.x) + Math.PI;

        return angle;
    }

    distanceTo(v: Vector2) {
        return Math.sqrt(this.distanceToSquared(v));
    }

    distanceToSquared(v: Vector2) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;

        return dx * dx + dy * dy;
    }

    manhattanDistanceTo(v: Vector2) {
        return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
    }

    setLength(length: number) {
        return this.normalize().multiplyScalar(length);
    }

    lerp(v: Vector2, alpha: number) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;

        return this;
    }

    lerpVectors(v1: Vector2, v2: Vector2, alpha) {
        this.x = v1.x + (v2.x - v1.x) * alpha;
        this.y = v1.y + (v2.y - v1.y) * alpha;

        return this;
    }

    equals(v: Vector2) {
        return v.x === this.x && v.y === this.y;
    }

    fromArray(array: number[] | AnyTypedArray, offset = 0) {
        this.x = array[offset];
        this.y = array[offset + 1];

        return this;
    }

    toArray(array: number[] = [], offset = 0): number[] {
        array[offset] = this.x;
        array[offset + 1] = this.y;

        return array;
    }

    fromBufferAttribute(
        attribute: BufferAttribute | InterleavedBufferAttribute,
        index: number
    ) {
        this.x = attribute.getX(index);
        this.y = attribute.getY(index);

        return this;
    }

    rotateAround(center: Vector2, angle: number) {
        const c = Math.cos(angle);
        const s = Math.sin(angle);

        const x = this.x - center.x;
        const y = this.y - center.y;

        this.x = x * c - y * s + center.x;
        this.y = x * s + y * c + center.y;

        return this;
    }

    random() {
        this.x = Math.random();
        this.y = Math.random();

        return this;
    }

}

export { Vector2 };
