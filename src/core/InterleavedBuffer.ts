import { StaticDrawUsage } from '../constants';
import { generateUUID } from '../math/MathUtils';
import { ObjectHelper } from './ObjectHelper';

class InterleavedBuffer {

    array: AnyTypedArray;
    stride: number;
    count: number;
    usage: number;
    updateRange: { offset: number; count: number };
    version: number;
    uuid: string;

    constructor(array: AnyTypedArray, stride: number) {
        this.array = array;
        this.stride = stride;
        this.count = array !== undefined ? array.length / stride : 0;

        this.usage = StaticDrawUsage;
        this.updateRange = {
            offset: 0,
            count: -1
        };

        this.version = 0;

        this.uuid = generateUUID();
    }

    set needsUpdate(value) {
        if (value === true) { this.version++; }
    }

    onUploadCallback() {}

    setUsage(value) {
        this.usage = value;

        return this;
    }

    copy(source: InterleavedBuffer) {
        this.array = ObjectHelper.deepCopy(source.array);
        this.count = source.count;
        this.stride = source.stride;
        this.usage = source.usage;

        return this;
    }

    copyAt(index1, attribute, index2) {
        index1 *= this.stride;
        index2 *= attribute.stride;

        for (let i = 0, l = this.stride; i < l; i++) {
            this.array[index1 + i] = attribute.array[index2 + i];
        }

        return this;
    }

    set(value, offset = 0) {
        this.array.set(value, offset);

        return this;
    }

    clone(data) {
        if (data.arrayBuffers === undefined) {
            data.arrayBuffers = {};
        }

        if ((this.array.buffer as any)._uuid === undefined) {
            (this.array.buffer as any)._uuid = generateUUID();
        }

        if (data.arrayBuffers[(this.array.buffer as any)._uuid] === undefined) {
            data.arrayBuffers[(this.array.buffer as any)._uuid]
                = this.array.slice(0).buffer;
        }

        const array = new (this.array.constructor as any)(
            data.arrayBuffers[(this.array.buffer as any)._uuid]
        );

        const ib = new InterleavedBuffer(array, this.stride);

        ib.setUsage(this.usage);

        return ib;
    }

    onUpload(callback) {
        this.onUploadCallback = callback;

        return this;
    }

}

export { InterleavedBuffer };
