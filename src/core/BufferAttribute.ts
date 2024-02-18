import { StaticDrawUsage } from '../constants';
import { Color } from '../math/Color';
import { Matrix3 } from '../math/Matrix3';
import { Matrix4 } from '../math/Matrix4';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { Vector4 } from '../math/Vector4';
import { ObjectHelper } from './ObjectHelper';

const _vector = new Vector3();
const _vector2 = new Vector2();

/**
 * @public
 */
class BufferAttribute {

    name: string;
    array: AnyTypedArray;
    itemSize: number;

    count: number;
    normalized: boolean;
    usage: number;
    updateRange: { offset: number; count: number };
    version: number;

    isBufferAttribute = true;
    isInstancedBufferAttribute: boolean;
    isInterleavedBufferAttribute: boolean;
    isFloat16BufferAttribute: boolean;

    constructor(array, itemSize, normalized?) {
        if (Array.isArray(array)) {
            throw new TypeError(
                'BufferAttribute: array should be a Typed Array.'
            );
        }

        this.name = '';

        this.array = array;
        this.itemSize = itemSize;
        this.count = array !== undefined ? array.length / itemSize : 0;
        this.normalized = normalized === true;

        this.usage = StaticDrawUsage;
        this.updateRange = {
            offset: 0,
            count: -1
        };

        this.version = 0;
    }

    set needsUpdate(value: boolean) {
        if (value === true) { this.version++; }
    }

    onUploadCallback() {}

    setUsage(value) {
        this.usage = value;

        return this;
    }

    copy(source: BufferAttribute) {
        this.name = source.name;
        this.array = ObjectHelper.deepCopy(source.array);
        this.itemSize = source.itemSize;
        this.count = source.count;
        this.normalized = source.normalized;

        this.usage = source.usage;

        return this;
    }

    copyAt(index1, attribute: BufferAttribute, index2) {
        index1 *= this.itemSize;
        index2 *= attribute.itemSize;

        for (let i = 0, l = this.itemSize; i < l; i++) {
            this.array[index1 + i] = attribute.array[index2 + i];
        }

        return this;
    }

    copyArray(array) {
        this.array.set(array);

        return this;
    }

    copyColorsArray(colors: Color[]) {
        const { array } = this;
        let offset = 0;

        for (let i = 0, l = colors.length; i < l; i++) {
            let color = colors[i];

            if (color === undefined) {
                console.warn(
                    'BufferAttribute.copyColorsArray(): color is undefined',
                    i
                );
                color = new Color(0, 0, 0);
            }

            array[offset++] = color.r;
            array[offset++] = color.g;
            array[offset++] = color.b;
        }

        return this;
    }

    copyVector2sArray(vectors: Vector2[]) {
        const { array } = this;
        let offset = 0;

        for (let i = 0, l = vectors.length; i < l; i++) {
            let vector = vectors[i];

            if (vector === undefined) {
                console.warn(
                    'BufferAttribute.copyVector2sArray(): vector is undefined',
                    i
                );
                vector = new Vector2();
            }

            array[offset++] = vector.x;
            array[offset++] = vector.y;
        }

        return this;
    }

    copyVector3sArray(vectors: Vector3[]) {
        const { array } = this;
        let offset = 0;

        for (let i = 0, l = vectors.length; i < l; i++) {
            let vector = vectors[i];

            if (vector === undefined) {
                console.warn(
                    'BufferAttribute.copyVector3sArray(): vector is undefined',
                    i
                );
                vector = new Vector3();
            }

            array[offset++] = vector.x;
            array[offset++] = vector.y;
            array[offset++] = vector.z;
        }

        return this;
    }

    copyVector4sArray(vectors: Vector4[]) {
        const { array } = this;
        let offset = 0;

        for (let i = 0, l = vectors.length; i < l; i++) {
            let vector = vectors[i];

            if (vector === undefined) {
                console.warn(
                    'BufferAttribute.copyVector4sArray(): vector is undefined',
                    i
                );
                vector = new Vector4();
            }

            array[offset++] = vector.x;
            array[offset++] = vector.y;
            array[offset++] = vector.z;
            array[offset++] = vector.w;
        }

        return this;
    }

    applyMatrix3(m: Matrix3) {
        if (this.itemSize === 2) {
            for (let i = 0, l = this.count; i < l; i++) {
                _vector2.fromBufferAttribute(this, i);
                _vector2.applyMatrix3(m);

                this.setXY(i, _vector2.x, _vector2.y);
            }
        } else if (this.itemSize === 3) {
            for (let i = 0, l = this.count; i < l; i++) {
                _vector.fromBufferAttribute(this, i);
                _vector.applyMatrix3(m);

                this.setXYZ(i, _vector.x, _vector.y, _vector.z);
            }
        }

        return this;
    }

    applyMatrix4(m: Matrix4) {
        for (let i = 0, l = this.count; i < l; i++) {
            _vector.x = Number(this.getX(i));
            _vector.y = Number(this.getY(i));
            _vector.z = Number(this.getZ(i));

            _vector.applyMatrix4(m);

            this.setXYZ(i, _vector.x, _vector.y, _vector.z);
        }

        return this;
    }

    applyNormalMatrix(m: Matrix3) {
        for (let i = 0, l = this.count; i < l; i++) {
            _vector.x = Number(this.getX(i));
            _vector.y = Number(this.getY(i));
            _vector.z = Number(this.getZ(i));

            _vector.applyNormalMatrix(m);

            this.setXYZ(i, _vector.x, _vector.y, _vector.z);
        }

        return this;
    }

    transformDirection(m: Matrix4) {
        for (let i = 0, l = this.count; i < l; i++) {
            _vector.x = Number(this.getX(i));
            _vector.y = Number(this.getY(i));
            _vector.z = Number(this.getZ(i));

            _vector.transformDirection(m);

            this.setXYZ(i, _vector.x, _vector.y, _vector.z);
        }

        return this;
    }

    set(value, offset = 0) {
        this.array.set(value, offset);

        return this;
    }

    getX(index) {
        return this.array[index * this.itemSize];
    }

    setX(index, x) {
        this.array[index * this.itemSize] = x;

        return this;
    }

    getY(index) {
        return this.array[index * this.itemSize + 1];
    }

    setY(index, y) {
        this.array[index * this.itemSize + 1] = y;

        return this;
    }

    getZ(index) {
        return this.array[index * this.itemSize + 2];
    }

    setZ(index, z) {
        this.array[index * this.itemSize + 2] = z;

        return this;
    }

    getW(index) {
        return this.array[index * this.itemSize + 3];
    }

    setW(index, w) {
        this.array[index * this.itemSize + 3] = w;

        return this;
    }

    setXY(index, x, y) {
        index *= this.itemSize;

        this.array[index + 0] = x;
        this.array[index + 1] = y;

        return this;
    }

    setXYZ(index, x, y, z) {
        index *= this.itemSize;

        this.array[index + 0] = x;
        this.array[index + 1] = y;
        this.array[index + 2] = z;

        return this;
    }

    setXYZW(index, x, y, z, w) {
        index *= this.itemSize;

        this.array[index + 0] = x;
        this.array[index + 1] = y;
        this.array[index + 2] = z;
        this.array[index + 3] = w;

        return this;
    }

    onUpload(callback) {
        this.onUploadCallback = callback;

        return this;
    }

    clone(..._args) {
        return new BufferAttribute(this.array, this.itemSize).copy(this);
    }

}

//

class Int8BufferAttribute extends BufferAttribute {

    constructor(array, itemSize, normalized?) {
        super(new Int8Array(array), itemSize, normalized);
    }

}

class Uint8BufferAttribute extends BufferAttribute {

    constructor(array, itemSize, normalized?) {
        super(new Uint8Array(array), itemSize, normalized);
    }

}

class Uint8ClampedBufferAttribute extends BufferAttribute {

    constructor(array, itemSize, normalized?) {
        super(new Uint8ClampedArray(array), itemSize, normalized);
    }

}

//

class Int16BufferAttribute extends BufferAttribute {

    constructor(array, itemSize, normalized?) {
        super(new Int16Array(array), itemSize, normalized);
    }

}

class Uint16BufferAttribute extends BufferAttribute {

    constructor(array, itemSize, normalized?) {
        super(new Uint16Array(array), itemSize, normalized);
    }

}

//

class Int32BufferAttribute extends BufferAttribute {

    constructor(array, itemSize, normalized?) {
        super(new Int32Array(array), itemSize, normalized);
    }

}

class Uint32BufferAttribute extends BufferAttribute {

    constructor(array, itemSize, normalized?) {
        super(new Uint32Array(array), itemSize, normalized);
    }

}

//

class Float16BufferAttribute extends BufferAttribute {

    constructor(array, itemSize, normalized?) {
        super(new Uint16Array(array), itemSize, normalized);
    }

}

class Float32BufferAttribute extends BufferAttribute {

    constructor(array, itemSize, normalized?) {
        super(new Float32Array(array), itemSize, normalized);
    }

}

class Float64BufferAttribute extends BufferAttribute {

    constructor(array, itemSize, normalized?) {
        super(new Float64Array(array), itemSize, normalized);
    }

}
//

export {
    Float64BufferAttribute,
    Float32BufferAttribute,
    Float16BufferAttribute,
    Uint32BufferAttribute,
    Int32BufferAttribute,
    Uint16BufferAttribute,
    Int16BufferAttribute,
    Uint8ClampedBufferAttribute,
    Uint8BufferAttribute,
    Int8BufferAttribute,
    BufferAttribute
};
