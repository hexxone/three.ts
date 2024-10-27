class GLBufferAttribute {

    isGLBufferAttribute = true;

    buffer: any;
    type: any;
    itemSize: any;
    elementSize: any;
    count: any;
    version: number;

    constructor(buffer, type, itemSize, elementSize, count) {
        this.buffer = buffer;
        this.type = type;
        this.itemSize = itemSize;
        this.elementSize = elementSize;
        this.count = count;

        this.version = 0;
    }

    set needsUpdate(value) {
        if (value === true) { this.version++; }
    }

    setBuffer(buffer) {
        this.buffer = buffer;

        return this;
    }

    setType(type, elementSize) {
        this.type = type;
        this.elementSize = elementSize;

        return this;
    }

    setItemSize(itemSize) {
        this.itemSize = itemSize;

        return this;
    }

    setCount(count) {
        this.count = count;

        return this;
    }

}

export { GLBufferAttribute };