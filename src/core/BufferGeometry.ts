import { Path } from '../extras/core/Path';
import { Shape } from '../extras/core/Shape';
import { Box3 } from '../math/Box3';
import { generateUUID } from '../math/MathUtils';
import { Matrix3 } from '../math/Matrix3';
import { Matrix4 } from '../math/Matrix4';
import { Sphere } from '../math/Sphere';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { arrayMax } from '../utils';
import { BufferAttribute,
    Float32BufferAttribute,
    Uint16BufferAttribute,
    Uint32BufferAttribute } from './BufferAttribute';
import { EventDispatcher } from './EventDispatcher';
import { GLBufferAttribute } from './GLBufferAttribute';
import { Object3D } from './Object3D';

let _id = 0;

const _m1 = new Matrix4();
const _obj = new Object3D();
const _offset = new Vector3();
const _box = new Box3();
const _boxMorphTargets = new Box3();
const _vector = new Vector3();

export type HSL = {
    h: number;
    s: number;
    l: number;
};

export type BufferGroup = {
    start: number;
    count: number;
    materialIndex?: number;
};

export type GeometryParameters = {
    width?: number;
    height?: number;
    depth?: number;

    radius?: number;
    innerRadius?: number;
    outerRadius?: number;

    detail?: number;
    points?: number;
    segments?: number;
    tube?: number;
    arc?: number;
    p?: number;
    q?: number;

    widthSegments?: number;
    heightSegments?: number;
    depthSegments?: number;
    radialSegments?: number;
    curveSegments?: number;
    tubularSegments?: number;

    thetaStart?: number;
    thetaLength?: number;
    thetaSegments?: number;

    phiStart?: number;
    phiLength?: number;
    phiSegments?: number;

    shapes?: Shape[];
    options?: any; // TODO
    path?: Path;

    openEnded?: boolean;
    closed?: boolean;

    radiusTop?: number;
    radiusBottom?: number;
    thresholdAngle?: number;

    // parametric geomtry  https://prideout.net/blog/old/blog/index.html@p=44.html
    func?: (u, v, target) => void;
    slices?: number;
    stacks?: number;

    vertices?: number[];
    indices?: number[];
};

/**
 * @public
 */
export class BufferGeometry extends EventDispatcher {

    isBufferGeometry = true;
    isInstancedBufferGeometry: boolean;

    id: number;
    uuid: string;
    name: string;
    type: string;
    index: BufferAttribute;

    attributes: {
        [name: string]: BufferAttribute;
    };

    morphAttributes: {
        [name: string]: BufferAttribute[];
    };

    morphTargetsRelative: boolean;

    groups: BufferGroup[] = [];

    boundingBox: Box3;
    boundingSphere: Sphere;
    drawRange: { start: number; count: number };

    userData: any;
    parameters: GeometryParameters;

    _maxInstanceCount: number;

    constructor() {
        super();

        this.id = _id++;

        this.uuid = generateUUID();

        this.name = '';
        this.type = 'BufferGeometry';

        this.index = null;
        this.attributes = {};

        this.morphAttributes = {};
        this.morphTargetsRelative = false;

        this.boundingBox = null;
        this.boundingSphere = null;

        this.drawRange = {
            start: 0,
            count: Infinity
        };

        this.userData = {};
    }

    getIndex() {
        return this.index;
    }

    setIndex(index: number[] | BufferAttribute) {
        if (Array.isArray(index)) {
            this.index = new (
                arrayMax(index) > 65535
                    ? Uint32BufferAttribute
                    : Uint16BufferAttribute
            )(index, 1);
        } else {
            this.index = index;
        }

        return this;
    }

    getAttribute(name) {
        return this.attributes[name];
    }

    setAttribute(name, attribute) {
        this.attributes[name] = attribute;

        return this;
    }

    deleteAttribute(name) {
        delete this.attributes[name];

        return this;
    }

    hasAttribute(name) {
        return this.attributes[name] !== undefined;
    }

    addGroup(start, count, materialIndex = 0) {
        this.groups.push({
            start,
            count,
            materialIndex
        });
    }

    clearGroups() {
        this.groups = [];
    }

    setDrawRange(start, count) {
        this.drawRange.start = start;
        this.drawRange.count = count;
    }

    applyMatrix4(matrix) {
        const { position } = this.attributes;

        if (position !== undefined) {
            position.applyMatrix4(matrix);

            position.needsUpdate = true;
        }

        const { normal } = this.attributes;

        if (normal !== undefined) {
            const normalMatrix = new Matrix3().getNormalMatrix(matrix);

            (normal as BufferAttribute).applyNormalMatrix(normalMatrix);

            normal.needsUpdate = true;
        }

        const { tangent } = this.attributes;

        if (tangent !== undefined) {
            (tangent as BufferAttribute).transformDirection(matrix);

            tangent.needsUpdate = true;
        }

        if (this.boundingBox !== null) {
            this.computeBoundingBox();
        }

        if (this.boundingSphere !== null) {
            this.computeBoundingSphere();
        }

        return this;
    }

    rotateX(angle) {
        // rotate geometry around world x-axis

        _m1.makeRotationX(angle);

        this.applyMatrix4(_m1);

        return this;
    }

    rotateY(angle) {
        // rotate geometry around world y-axis

        _m1.makeRotationY(angle);

        this.applyMatrix4(_m1);

        return this;
    }

    rotateZ(angle) {
        // rotate geometry around world z-axis

        _m1.makeRotationZ(angle);

        this.applyMatrix4(_m1);

        return this;
    }

    translate(x, y, z) {
        // translate geometry

        _m1.makeTranslation(x, y, z);

        this.applyMatrix4(_m1);

        return this;
    }

    scale(x, y, z) {
        // scale geometry

        _m1.makeScale(x, y, z);

        this.applyMatrix4(_m1);

        return this;
    }

    lookAt(vector) {
        _obj.lookAt(vector);

        _obj.updateMatrix();

        this.applyMatrix4(_obj.matrix);

        return this;
    }

    center() {
        this.computeBoundingBox();

        this.boundingBox.getCenter(_offset).negate();

        this.translate(_offset.x, _offset.y, _offset.z);

        return this;
    }

    setFromPoints(points: Vector3[]) {
        const position = [];

        for (let i = 0, l = points.length; i < l; i++) {
            const point = points[i];

            position.push(point.x, point.y, point.z || 0);
        }

        this.setAttribute('position', new Float32BufferAttribute(position, 3));

        return this;
    }

    computeBoundingBox() {
        if (this.boundingBox === null) {
            this.boundingBox = new Box3();
        }

        const { position } = this.attributes;
        const morphAttributesPosition = this.morphAttributes.position;

        if (position && position instanceof GLBufferAttribute) {
            console.error(
                'BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',
                this
            );

            this.boundingBox.set(
                new Vector3(-Infinity, -Infinity, -Infinity),
                new Vector3(+Infinity, +Infinity, +Infinity)
            );

            return;
        }

        if (position !== undefined) {
            this.boundingBox.setFromBufferAttribute(position);

            // process morph attributes if present

            if (morphAttributesPosition) {
                for (
                    let i = 0, il = morphAttributesPosition.length;
                    i < il;
                    i++
                ) {
                    const morphAttribute = morphAttributesPosition[i];

                    _box.setFromBufferAttribute(morphAttribute);

                    if (this.morphTargetsRelative) {
                        _vector.addVectors(this.boundingBox.min, _box.min);
                        this.boundingBox.expandByPoint(_vector);

                        _vector.addVectors(this.boundingBox.max, _box.max);
                        this.boundingBox.expandByPoint(_vector);
                    } else {
                        this.boundingBox.expandByPoint(_box.min);
                        this.boundingBox.expandByPoint(_box.max);
                    }
                }
            }
        } else {
            this.boundingBox.makeEmpty();
        }

        if (
            isNaN(this.boundingBox.min.x)
            || isNaN(this.boundingBox.min.y)
            || isNaN(this.boundingBox.min.z)
        ) {
            console.error(
                'BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',
                this
            );
        }
    }

    computeBoundingSphere() {
        if (this.boundingSphere === null) {
            this.boundingSphere = new Sphere();
        }

        const { position } = this.attributes;
        const morphAttributesPosition = this.morphAttributes.position;

        if (position && position instanceof GLBufferAttribute) {
            console.error(
                'BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',
                this
            );

            this.boundingSphere.set(new Vector3(), Infinity);

            return;
        }

        if (position) {
            // first, find the center of the bounding sphere

            const { center } = this.boundingSphere;

            _box.setFromBufferAttribute(position);

            // process morph attributes if present

            if (morphAttributesPosition) {
                for (
                    let i = 0, il = morphAttributesPosition.length;
                    i < il;
                    i++
                ) {
                    const morphAttribute = morphAttributesPosition[i];

                    _boxMorphTargets.setFromBufferAttribute(morphAttribute);

                    if (this.morphTargetsRelative) {
                        _vector.addVectors(_box.min, _boxMorphTargets.min);
                        _box.expandByPoint(_vector);

                        _vector.addVectors(_box.max, _boxMorphTargets.max);
                        _box.expandByPoint(_vector);
                    } else {
                        _box.expandByPoint(_boxMorphTargets.min);
                        _box.expandByPoint(_boxMorphTargets.max);
                    }
                }
            }

            _box.getCenter(center);

            // second, try to find a boundingSphere with a radius smaller than the
            // boundingSphere of the boundingBox: sqrt(3) smaller in the best case

            let maxRadiusSq = 0;

            for (let i = 0, il = position.count; i < il; i++) {
                _vector.fromBufferAttribute(position, i);

                maxRadiusSq = Math.max(
                    maxRadiusSq,
                    center.distanceToSquared(_vector)
                );
            }

            // process morph attributes if present

            if (morphAttributesPosition) {
                for (
                    let i = 0, il = morphAttributesPosition.length;
                    i < il;
                    i++
                ) {
                    const morphAttribute = morphAttributesPosition[i];
                    const { morphTargetsRelative } = this;

                    for (let j = 0, jl = morphAttribute.count; j < jl; j++) {
                        _vector.fromBufferAttribute(morphAttribute, j);

                        if (morphTargetsRelative) {
                            _offset.fromBufferAttribute(position, j);
                            _vector.add(_offset);
                        }

                        maxRadiusSq = Math.max(
                            maxRadiusSq,
                            center.distanceToSquared(_vector)
                        );
                    }
                }
            }

            this.boundingSphere.radius = Math.sqrt(maxRadiusSq);

            if (isNaN(this.boundingSphere.radius)) {
                console.error(
                    'BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',
                    this
                );
            }
        }
    }

    computeFaceNormals() {
        // backwards compatibility
    }

    computeTangents() {
        const { index } = this;
        const { attributes } = this;

        // based on http://www.terathon.com/code/tangent.html
        // (per vertex tangents)

        if (
            index === null
            || attributes.position === undefined
            || attributes.normal === undefined
            || attributes.uv === undefined
        ) {
            console.error(
                'BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)'
            );

            return;
        }

        const indices = index.array;
        const positions = attributes.position.array;
        const normals = attributes.normal.array;
        const uvs = attributes.uv.array;

        const nVertices = positions.length / 3;

        if (attributes.tangent === undefined) {
            this.setAttribute(
                'tangent',
                new BufferAttribute(new Float32Array(4 * nVertices), 4, null)
            );
        }

        const tangents = attributes.tangent.array;

        const tan1 = [];
        const tan2 = [];

        for (let i = 0; i < nVertices; i++) {
            tan1[i] = new Vector3();
            tan2[i] = new Vector3();
        }

        const vA = new Vector3();
        const vB = new Vector3();
        const vC = new Vector3();

        const uvA = new Vector2();
        const uvB = new Vector2();
        const uvC = new Vector2();

        const sdir = new Vector3();
        const tdir = new Vector3();

        function handleTriangle(a, b, c) {
            vA.fromArray(positions, a * 3);
            vB.fromArray(positions, b * 3);
            vC.fromArray(positions, c * 3);

            uvA.fromArray(uvs, a * 2);
            uvB.fromArray(uvs, b * 2);
            uvC.fromArray(uvs, c * 2);

            vB.sub(vA);
            vC.sub(vA);

            uvB.sub(uvA);
            uvC.sub(uvA);

            const r = 1.0 / (uvB.x * uvC.y - uvC.x * uvB.y);

            // silently ignore degenerate uv triangles having coincident or colinear vertices

            if (!isFinite(r)) {
                return;
            }

            sdir.copy(vB)
                .multiplyScalar(uvC.y)
                .addScaledVector(vC, -uvB.y)
                .multiplyScalar(r);
            tdir.copy(vC)
                .multiplyScalar(uvB.x)
                .addScaledVector(vB, -uvC.x)
                .multiplyScalar(r);

            tan1[a].add(sdir);
            tan1[b].add(sdir);
            tan1[c].add(sdir);

            tan2[a].add(tdir);
            tan2[b].add(tdir);
            tan2[c].add(tdir);
        }

        let { groups } = this;

        if (groups.length === 0) {
            groups = [
                {
                    start: 0,
                    count: indices.length
                }
            ];
        }

        for (let i = 0, il = groups.length; i < il; ++i) {
            const group = groups[i];

            const { start } = group;
            const { count } = group;

            for (let j = start, jl = start + count; j < jl; j += 3) {
                handleTriangle(indices[j + 0], indices[j + 1], indices[j + 2]);
            }
        }

        const tmp = new Vector3();
        const tmp2 = new Vector3();
        const n = new Vector3();
        const n2 = new Vector3();

        function handleVertex(v) {
            n.fromArray(normals, v * 3);
            n2.copy(n);

            const t = tan1[v];

            // Gram-Schmidt orthogonalize

            tmp.copy(t);
            tmp.sub(n.multiplyScalar(n.dot(t))).normalize();

            // Calculate handedness

            tmp2.crossVectors(n2, t);
            const test = tmp2.dot(tan2[v]);
            const w = test < 0.0 ? -1.0 : 1.0;

            tangents[v * 4] = tmp.x;
            tangents[v * 4 + 1] = tmp.y;
            tangents[v * 4 + 2] = tmp.z;
            tangents[v * 4 + 3] = w;
        }

        for (let i = 0, il = groups.length; i < il; ++i) {
            const group = groups[i];

            const { start } = group;
            const { count } = group;

            for (let j = start, jl = start + count; j < jl; j += 3) {
                handleVertex(indices[j + 0]);
                handleVertex(indices[j + 1]);
                handleVertex(indices[j + 2]);
            }
        }
    }

    computeVertexNormals() {
        const { index } = this;
        const positionAttribute = this.getAttribute('position');

        if (positionAttribute !== undefined) {
            let normalAttribute = this.getAttribute('normal');

            if (normalAttribute === undefined) {
                normalAttribute = new BufferAttribute(
                    new Float32Array(positionAttribute.count * 3),
                    3
                );
                this.setAttribute('normal', normalAttribute);
            } else {
                // reset existing normals to zero

                for (let i = 0, il = normalAttribute.count; i < il; i++) {
                    normalAttribute.setXYZ(i, 0, 0, 0);
                }
            }

            const pA = new Vector3();
            const pB = new Vector3();
            const pC = new Vector3();
            const nA = new Vector3();
            const nB = new Vector3();
            const nC = new Vector3();
            const cb = new Vector3();
            const ab = new Vector3();

            // indexed elements

            if (index) {
                for (let i = 0, il = index.count; i < il; i += 3) {
                    const vA = index.getX(i + 0);
                    const vB = index.getX(i + 1);
                    const vC = index.getX(i + 2);

                    pA.fromBufferAttribute(positionAttribute, Number(vA));
                    pB.fromBufferAttribute(positionAttribute, Number(vB));
                    pC.fromBufferAttribute(positionAttribute, Number(vC));

                    cb.subVectors(pC, pB);
                    ab.subVectors(pA, pB);
                    cb.cross(ab);

                    nA.fromBufferAttribute(normalAttribute, Number(vA));
                    nB.fromBufferAttribute(normalAttribute, Number(vB));
                    nC.fromBufferAttribute(normalAttribute, Number(vC));

                    nA.add(cb);
                    nB.add(cb);
                    nC.add(cb);

                    normalAttribute.setXYZ(vA, nA.x, nA.y, nA.z);
                    normalAttribute.setXYZ(vB, nB.x, nB.y, nB.z);
                    normalAttribute.setXYZ(vC, nC.x, nC.y, nC.z);
                }
            } else {
                // non-indexed elements (unconnected triangle soup)

                for (let i = 0, il = positionAttribute.count; i < il; i += 3) {
                    pA.fromBufferAttribute(positionAttribute, i + 0);
                    pB.fromBufferAttribute(positionAttribute, i + 1);
                    pC.fromBufferAttribute(positionAttribute, i + 2);

                    cb.subVectors(pC, pB);
                    ab.subVectors(pA, pB);
                    cb.cross(ab);

                    normalAttribute.setXYZ(i + 0, cb.x, cb.y, cb.z);
                    normalAttribute.setXYZ(i + 1, cb.x, cb.y, cb.z);
                    normalAttribute.setXYZ(i + 2, cb.x, cb.y, cb.z);
                }
            }

            this.normalizeNormals();

            normalAttribute.needsUpdate = true;
        }
    }

    merge(geometry, offset) {
        if (!(geometry && geometry.isBufferGeometry)) {
            console.error(
                'BufferGeometry.merge(): geometry not an instance of BufferGeometry.',
                geometry
            );

            return;
        }

        if (offset === undefined) {
            offset = 0;

            console.warn(
                'BufferGeometry.merge(): Overwriting original geometry, starting at offset=0. '
                    + 'Use BufferGeometryUtils.mergeBufferGeometries() for lossless merge.'
            );
        }

        const { attributes } = this;

        for (const key in attributes) {
            if (geometry.attributes[key] === undefined) {
                continue;
            }

            const attribute1 = attributes[key];
            const attributeArray1 = attribute1.array;

            const attribute2 = geometry.attributes[key];
            const attributeArray2 = attribute2.array;

            const attributeOffset = attribute2.itemSize * offset;
            const length = Math.min(
                attributeArray2.length,
                attributeArray1.length - attributeOffset
            );

            for (let i = 0, j = attributeOffset; i < length; i++, j++) {
                attributeArray1[j] = attributeArray2[i];
            }
        }

        return this;
    }

    normalizeNormals() {
        const normals = this.attributes.normal;

        for (let i = 0, il = normals.count; i < il; i++) {
            _vector.fromBufferAttribute(normals, i);

            _vector.normalize();

            normals.setXYZ(i, _vector.x, _vector.y, _vector.z);
        }
    }

    toNonIndexed() {
        function convertBufferAttribute(attribute, indices) {
            const { array } = attribute;
            const { itemSize } = attribute;
            const { normalized } = attribute;

            const array2 = new array.constructor(indices.length * itemSize);

            let index = 0;
            let index2 = 0;

            for (let i = 0, l = indices.length; i < l; i++) {
                index = indices[i] * itemSize;

                for (let j = 0; j < itemSize; j++) {
                    array2[index2++] = array[index++];
                }
            }

            return new BufferAttribute(array2, itemSize, normalized);
        }

        //

        if (this.index === null) {
            console.warn(
                'BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.'
            );

            return this;
        }

        const geometry2 = new BufferGeometry();

        const indices = this.index.array;
        const { attributes } = this;

        // attributes

        for (const name in attributes) {
            const attribute = attributes[name];

            const newAttribute = convertBufferAttribute(attribute, indices);

            geometry2.setAttribute(name, newAttribute);
        }

        // morph attributes

        const { morphAttributes } = this;

        for (const name in morphAttributes) {
            const morphArray = [];
            const morphAttribute = morphAttributes[name]; // morphAttribute: array of Float32BufferAttributes

            for (let i = 0, il = morphAttribute.length; i < il; i++) {
                const attribute = morphAttribute[i];

                const newAttribute = convertBufferAttribute(attribute, indices);

                morphArray.push(newAttribute);
            }

            geometry2.morphAttributes[name] = morphArray;
        }

        geometry2.morphTargetsRelative = this.morphTargetsRelative;

        // groups

        const { groups } = this;

        for (let i = 0, l = groups.length; i < l; i++) {
            const group = groups[i];

            geometry2.addGroup(group.start, group.count, group.materialIndex);
        }

        return geometry2;
    }

    clone() {
        return new BufferGeometry().copy(this);
    }

    copy(source: BufferGeometry) {
        // reset

        this.index = null;
        this.attributes = {};
        this.morphAttributes = {};
        this.groups = [];
        this.boundingBox = null;
        this.boundingSphere = null;

        // used for storing cloned, shared data

        const data = {};

        // name

        this.name = source.name;

        // index

        const { index } = source;

        if (index !== null) {
            this.setIndex(index.clone(data));
        }

        // attributes

        const { attributes } = source;

        for (const name in attributes) {
            const attribute = attributes[name];

            this.setAttribute(name, attribute.clone(data));
        }

        // morph attributes

        const { morphAttributes } = source;

        for (const name in morphAttributes) {
            const array = [];
            const morphAttribute = morphAttributes[name]; // morphAttribute: array of Float32BufferAttributes

            for (let i = 0, l = morphAttribute.length; i < l; i++) {
                array.push(morphAttribute[i].clone(data));
            }

            this.morphAttributes[name] = array;
        }

        this.morphTargetsRelative = source.morphTargetsRelative;

        // groups

        const { groups } = source;

        for (let i = 0, l = groups.length; i < l; i++) {
            const group = groups[i];

            this.addGroup(group.start, group.count, group.materialIndex);
        }

        // bounding box

        const { boundingBox } = source;

        if (boundingBox !== null) {
            this.boundingBox = boundingBox.clone();
        }

        // bounding sphere

        const { boundingSphere } = source;

        if (boundingSphere !== null) {
            this.boundingSphere = boundingSphere.clone();
        }

        // draw range

        this.drawRange.start = source.drawRange.start;
        this.drawRange.count = source.drawRange.count;

        // user data

        this.userData = source.userData;

        return this;
    }

    dispose() {
        this.dispatchEvent({
            type: 'dispose'
        });
    }

    dispatchEvent(_arg0: { type: string }) {
        throw new Error('Method not implemented.');
    }

}
