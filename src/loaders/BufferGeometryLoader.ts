import { BufferAttribute } from '../core/BufferAttribute';
import { BufferGeometry } from '../core/BufferGeometry';
import { InstancedBufferAttribute } from '../core/InstancedBufferAttribute';
import { InstancedBufferGeometry } from '../core/InstancedBufferGeometry';
import { InterleavedBuffer } from '../core/InterleavedBuffer';
import { InterleavedBufferAttribute } from '../core/InterleavedBufferAttribute';
import { Sphere } from '../math/Sphere';
import { Vector3 } from '../math/Vector3';
import { getTypedArray } from '../utils';
import { FileLoader } from './FileLoader';
import { Loader } from './Loader';

class BufferGeometryLoader extends Loader {

    constructor(manager?) {
        super(manager);
    }

    load(url, onLoad, onProgress, onError) {
        // eslint-disable-next-line consistent-this, @typescript-eslint/no-this-alias
        const scope = this;

        const loader = new FileLoader(scope.manager);

        loader.setPath(scope.path);
        loader.setRequestHeader(scope.requestHeader);
        loader.setWithCredentials(scope.withCredentials);
        loader.load(
            url,
            (text) => {
                try {
                    onLoad(scope.parse(JSON.parse(text)));
                } catch (e) {
                    if (onError) {
                        onError(e);
                    } else {
                        console.error(e);
                    }

                    scope.manager.itemError(url);
                }
            },
            onProgress,
            onError
        );
    }

    parse(json) {
        const interleavedBufferMap = {};
        const arrayBufferMap = {};

        function getInterleavedBuffer(json, uuid) {
            if (interleavedBufferMap[uuid] !== undefined) { return interleavedBufferMap[uuid]; }

            const { interleavedBuffers } = json;
            const interleavedBuffer = interleavedBuffers[uuid];

            const buffer = getArrayBuffer(json, interleavedBuffer.buffer);

            const array = getTypedArray(interleavedBuffer.type, buffer);
            const ib = new InterleavedBuffer(array, interleavedBuffer.stride);

            ib.uuid = interleavedBuffer.uuid;

            interleavedBufferMap[uuid] = ib;

            return ib;
        }

        function getArrayBuffer(json, uuid) {
            if (arrayBufferMap[uuid] !== undefined) { return arrayBufferMap[uuid]; }

            const { arrayBuffers } = json;
            const arrayBuffer = arrayBuffers[uuid];

            const ab = new Uint32Array(arrayBuffer).buffer;

            arrayBufferMap[uuid] = ab;

            return ab;
        }

        const geometry = json.isInstancedBufferGeometry
            ? new InstancedBufferGeometry()
            : new BufferGeometry();

        const { index } = json.data;

        if (index !== undefined) {
            const typedArray = getTypedArray(index.type, index.array);

            geometry.setIndex(new BufferAttribute(typedArray, 1));
        }

        const { attributes } = json.data;

        for (const key in attributes) {
            const attribute = attributes[key];
            let bufferAttribute;

            if (attribute.isInterleavedBufferAttribute) {
                const interleavedBuffer = getInterleavedBuffer(
                    json.data,
                    attribute.data
                );

                bufferAttribute = new InterleavedBufferAttribute(
                    interleavedBuffer,
                    attribute.itemSize,
                    attribute.offset,
                    attribute.normalized
                );
            } else {
                const typedArray = getTypedArray(
                    attribute.type,
                    attribute.array
                );
                const BufferAttributeConstr
                    = attribute.isInstancedBufferAttribute
                        ? InstancedBufferAttribute
                        : BufferAttribute;

                bufferAttribute = new BufferAttributeConstr(
                    typedArray,
                    attribute.itemSize,
                    attribute.normalized
                );
            }

            if (attribute.name !== undefined) { bufferAttribute.name = attribute.name; }
            geometry.setAttribute(key, bufferAttribute);
        }

        const { morphAttributes } = json.data;

        if (morphAttributes) {
            for (const key in morphAttributes) {
                const attributeArray = morphAttributes[key];

                const array = [];

                for (let i = 0, il = attributeArray.length; i < il; i++) {
                    const attribute = attributeArray[i];
                    let bufferAttribute;

                    if (attribute.isInterleavedBufferAttribute) {
                        const interleavedBuffer = getInterleavedBuffer(
                            json.data,
                            attribute.data
                        );

                        bufferAttribute = new InterleavedBufferAttribute(
                            interleavedBuffer,
                            attribute.itemSize,
                            attribute.offset,
                            attribute.normalized
                        );
                    } else {
                        const typedArray = getTypedArray(
                            attribute.type,
                            attribute.array
                        );

                        bufferAttribute = new BufferAttribute(
                            typedArray,
                            attribute.itemSize,
                            attribute.normalized
                        );
                    }

                    if (attribute.name !== undefined) { bufferAttribute.name = attribute.name; }
                    array.push(bufferAttribute);
                }

                geometry.morphAttributes[key] = array;
            }
        }

        const { morphTargetsRelative } = json.data;

        if (morphTargetsRelative) {
            geometry.morphTargetsRelative = true;
        }

        const groups
            = json.data.groups || json.data.drawcalls || json.data.offsets;

        if (groups !== undefined) {
            for (let i = 0, n = groups.length; i !== n; ++i) {
                const group = groups[i];

                geometry.addGroup(
                    group.start,
                    group.count,
                    group.materialIndex
                );
            }
        }

        const { boundingSphere } = json.data;

        if (boundingSphere !== undefined) {
            const center = new Vector3();

            if (boundingSphere.center !== undefined) {
                center.fromArray(boundingSphere.center);
            }

            geometry.boundingSphere = new Sphere(center, boundingSphere.radius);
        }

        if (json.name) { geometry.name = json.name; }
        if (json.userData) { geometry.userData = json.userData; }

        return geometry;
    }

}

export { BufferGeometryLoader };
