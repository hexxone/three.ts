import { Camera } from '../cameras/Camera';
import { BufferAttribute } from '../core/BufferAttribute';
import { InterleavedBufferAttribute } from '../core/InterleavedBufferAttribute';
import { Cylindrical } from './Cylindrical';
import { Euler } from './Euler';
import { clamp } from './MathUtils';
import { Matrix3 } from './Matrix3';
import { Matrix4 } from './Matrix4';
import { Quaternion } from './Quaternion';
import { Spherical } from './Spherical';

/**
 * @public
 */
class Vector3 {

    x: number;
    y: number;
    z: number;
    isVector3 = true;

    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    set(x, y, z) {
        if (z === undefined) {
            ({ z } = this);
        } // sprite.scale.set(x,y)

        this.x = x;
        this.y = y;
        this.z = z;

        return this;
    }

    setScalar(scalar) {
        this.x = scalar;
        this.y = scalar;
        this.z = scalar;

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

    setZ(z) {
        this.z = z;

        return this;
    }

    setComponent(index: number, value: number) {
        switch (index) {
            case 0:
                this.x = value;
                break;
            case 1:
                this.y = value;
                break;
            case 2:
                this.z = value;
                break;
            default:
                throw new Error(`index is out of range: ${index}`);
        }

        return this;
    }

    getComponent(index: number) {
        switch (index) {
            case 0:
                return this.x;
            case 1:
                return this.y;
            case 2:
                return this.z;
            default:
                throw new Error(`index is out of range: ${index}`);
        }
    }

    clone() {
        return new Vector3(this.x, this.y, this.z);
    }

    copy(from: Vector3) {
        this.x = from.x;
        this.y = from.y;
        this.z = from.z;

        return this;
    }

    add(v: Vector3, w?) {
        if (w !== undefined) {
            console.warn(
                'Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.'
            );

            return this.addVectors(v, w);
        }

        this.x += v.x;
        this.y += v.y;
        this.z += v.z;

        return this;
    }

    addScalar(s: number) {
        this.x += s;
        this.y += s;
        this.z += s;

        return this;
    }

    addVectors(a: Vector3, b: Vector3) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;

        return this;
    }

    addScaledVector(v: Vector3, s: number) {
        this.x += v.x * s;
        this.y += v.y * s;
        this.z += v.z * s;

        return this;
    }

    sub(v: Vector3, w?) {
        if (w !== undefined) {
            console.warn(
                'Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.'
            );

            return this.subVectors(v, w);
        }

        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;

        return this;
    }

    subScalar(s: number) {
        this.x -= s;
        this.y -= s;
        this.z -= s;

        return this;
    }

    subVectors(a: Vector3, b: Vector3) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;

        return this;
    }

    multiply(v: Vector3, w?) {
        if (w !== undefined) {
            console.warn(
                'Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.'
            );

            return this.multiplyVectors(v, w);
        }

        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;

        return this;
    }

    multiplyScalar(scalar: number) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;

        return this;
    }

    multiplyVectors(a: Vector3, b: Vector3) {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        this.z = a.z * b.z;

        return this;
    }

    applyEuler(euler: Euler) {
        if (!(euler && euler.isEuler)) {
            console.error(
                'Vector3: .applyEuler() now expects an Euler rotation rather than a Vector3 and order.'
            );
        }

        return this.applyQuaternion(_quaternion.setFromEuler(euler));
    }

    applyAxisAngle(axis: Vector3, angle) {
        return this.applyQuaternion(_quaternion.setFromAxisAngle(axis, angle));
    }

    applyMatrix3(m: Matrix3) {
        const { x } = this;
        const { y } = this;
        const { z } = this;
        const e = m.elements;

        this.x = e[0] * x + e[3] * y + e[6] * z;
        this.y = e[1] * x + e[4] * y + e[7] * z;
        this.z = e[2] * x + e[5] * y + e[8] * z;

        return this;
    }

    applyNormalMatrix(m: Matrix3) {
        return this.applyMatrix3(m).normalize();
    }

    applyMatrix4(m: Matrix4) {
        const { x } = this;
        const { y } = this;
        const { z } = this;
        const e = m.elements;

        const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

        this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
        this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
        this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;

        return this;
    }

    applyQuaternion(q: Quaternion) {
        const { x } = this;
        const { y } = this;
        const { z } = this;
        const qx = q.x;
        const qy = q.y;
        const qz = q.z;
        const qw = q.w;

        // calculate quat * vector

        const ix = qw * x + qy * z - qz * y;
        const iy = qw * y + qz * x - qx * z;
        const iz = qw * z + qx * y - qy * x;
        const iw = -qx * x - qy * y - qz * z;

        // calculate result * inverse quat

        this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

        return this;
    }

    project(camera: Camera) {
        return this.applyMatrix4(camera.matrixWorldInverse).applyMatrix4(
            camera.projectionMatrix
        );
    }

    unproject(camera: Camera) {
        return this.applyMatrix4(camera.projectionMatrixInverse).applyMatrix4(
            camera.matrixWorld
        );
    }

    transformDirection(m: Matrix4) {
        // input: Matrix4 affine matrix
        // vector interpreted as a direction

        const { x } = this;
        const { y } = this;
        const { z } = this;
        const e = m.elements;

        this.x = e[0] * x + e[4] * y + e[8] * z;
        this.y = e[1] * x + e[5] * y + e[9] * z;
        this.z = e[2] * x + e[6] * y + e[10] * z;

        return this.normalize();
    }

    divide(v: Vector3) {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;

        return this;
    }

    divideScalar(scalar: number) {
        return this.multiplyScalar(1 / scalar);
    }

    min(v: Vector3) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);
        this.z = Math.min(this.z, v.z);

        return this;
    }

    max(v: Vector3) {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);
        this.z = Math.max(this.z, v.z);

        return this;
    }

    clamp(min: Vector3, max: Vector3) {
        // assumes min < max, componentwise

        this.x = Math.max(min.x, Math.min(max.x, this.x));
        this.y = Math.max(min.y, Math.min(max.y, this.y));
        this.z = Math.max(min.z, Math.min(max.z, this.z));

        return this;
    }

    clampScalar(minVal: number, maxVal: number) {
        this.x = Math.max(minVal, Math.min(maxVal, this.x));
        this.y = Math.max(minVal, Math.min(maxVal, this.y));
        this.z = Math.max(minVal, Math.min(maxVal, this.z));

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
        this.z = Math.floor(this.z);

        return this;
    }

    ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.z = Math.ceil(this.z);

        return this;
    }

    round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);

        return this;
    }

    roundToZero() {
        this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x);
        this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y);
        this.z = this.z < 0 ? Math.ceil(this.z) : Math.floor(this.z);

        return this;
    }

    negate() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;

        return this;
    }

    dot(v: Vector3) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    // TODO lengthSquared?

    lengthSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    manhattanLength() {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    }

    normalize() {
        return this.divideScalar(this.length() || 1);
    }

    setLength(length: number) {
        return this.normalize().multiplyScalar(length);
    }

    lerp(v: Vector3, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        this.z += (v.z - this.z) * alpha;

        return this;
    }

    lerpVectors(v1: Vector3, v2: Vector3, alpha) {
        this.x = v1.x + (v2.x - v1.x) * alpha;
        this.y = v1.y + (v2.y - v1.y) * alpha;
        this.z = v1.z + (v2.z - v1.z) * alpha;

        return this;
    }

    cross(v: Vector3, w?) {
        if (w !== undefined) {
            console.warn(
                'Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.'
            );

            return this.crossVectors(v, w);
        }

        return this.crossVectors(this, v);
    }

    crossVectors(a: Vector3, b: Vector3) {
        const ax = a.x;
        const ay = a.y;
        const az = a.z;
        const bx = b.x;
        const by = b.y;
        const bz = b.z;

        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;

        return this;
    }

    projectOnVector(v: Vector3) {
        const denominator = v.lengthSq();

        if (denominator === 0) { return this.set(0, 0, 0); }

        const scalar = v.dot(this) / denominator;

        return this.copy(v).multiplyScalar(scalar);
    }

    projectOnPlane(planeNormal: Vector3) {
        _vector.copy(this).projectOnVector(planeNormal);

        return this.sub(_vector);
    }

    reflect(normal: Vector3) {
        // reflect incident vector off plane orthogonal to normal
        // normal is assumed to have unit length

        return this.sub(
            _vector.copy(normal).multiplyScalar(2 * this.dot(normal))
        );
    }

    angleTo(v: Vector3) {
        const denominator = Math.sqrt(this.lengthSq() * v.lengthSq());

        if (denominator === 0) { return Math.PI / 2; }

        const theta = this.dot(v) / denominator;

        // clamp, to handle numerical problems

        return Math.acos(clamp(theta, -1, 1));
    }

    distanceTo(v: Vector3) {
        return Math.sqrt(this.distanceToSquared(v));
    }

    /**
     * Takes the dot product of the distance, without the square root, for being more efficient.
     * @param v Distance to calculate to
     * @returns {number} float
     */
    distanceToSquared(v: Vector3) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        const dz = this.z - v.z;

        return dx * dx + dy * dy + dz * dz;
    }

    manhattanDistanceTo(v: Vector3) {
        return (
            Math.abs(this.x - v.x)
            + Math.abs(this.y - v.y)
            + Math.abs(this.z - v.z)
        );
    }

    setFromSpherical(s: Spherical) {
        return this.setFromSphericalCoords(s.radius, s.phi, s.theta);
    }

    setFromSphericalCoords(radius: number, phi: number, theta: number) {
        const sinPhiRadius = Math.sin(phi) * radius;

        this.x = sinPhiRadius * Math.sin(theta);
        this.y = Math.cos(phi) * radius;
        this.z = sinPhiRadius * Math.cos(theta);

        return this;
    }

    setFromCylindrical(c: Cylindrical) {
        return this.setFromCylindricalCoords(c.radius, c.theta, c.y);
    }

    setFromCylindricalCoords(radius, theta, y) {
        this.x = radius * Math.sin(theta);
        this.y = y;
        this.z = radius * Math.cos(theta);

        return this;
    }

    setFromMatrixPosition(m: Matrix4) {
        const e = m.elements;

        this.x = e[12];
        this.y = e[13];
        this.z = e[14];

        return this;
    }

    setFromMatrixScale(m: Matrix4) {
        const sx = this.setFromMatrixColumn(m, 0).length();
        const sy = this.setFromMatrixColumn(m, 1).length();
        const sz = this.setFromMatrixColumn(m, 2).length();

        this.x = sx;
        this.y = sy;
        this.z = sz;

        return this;
    }

    setFromMatrixColumn(m: Matrix4, index) {
        return this.fromArray(m.elements, index * 4);
    }

    setFromMatrix3Column(m: Matrix3, index) {
        return this.fromArray(m.elements, index * 3);
    }

    equals(v: Vector3) {
        return v.x === this.x && v.y === this.y && v.z === this.z;
    }

    fromArray(array: number[] | AnyTypedArray, offset = 0) {
        this.x = Number(array[offset]);
        this.y = Number(array[offset + 1]);
        this.z = Number(array[offset + 2]);

        return this;
    }

    toArray(array: number[] = [], offset = 0): number[] {
        array[offset] = this.x;
        array[offset + 1] = this.y;
        array[offset + 2] = this.z;

        return array;
    }

    fromBufferAttribute(
        attribute: BufferAttribute | InterleavedBufferAttribute,
        index: number
    ) {
        this.x = Number(attribute.getX(index));
        this.y = Number(attribute.getY(index));
        this.z = Number(attribute.getZ(index));

        return this;
    }

    random() {
        this.x = Math.random();
        this.y = Math.random();
        this.z = Math.random();

        return this;
    }

}

const _vector = /* @__PURE__*/ new Vector3();
const _quaternion = /* @__PURE__*/ new Quaternion();

export { Vector3 };
