import { Float32BufferAttribute } from '../core/BufferAttribute';
import { InstancedBufferGeometry } from '../core/InstancedBufferGeometry';
import { InstancedInterleavedBuffer } from '../core/InstancedInterleavedBuffer';
import { InterleavedBufferAttribute } from '../core/InterleavedBufferAttribute';
import { Matrix4 } from '../math/Matrix4';
import { Box3 } from '../math/Box3';
import { Sphere } from '../math/Sphere';
import { Vector3 } from '../math/Vector3';
import { WireframeGeometry } from './WireframeGeometry';
import { BufferGeometry } from '../core';
import { Mesh } from '../objects/Mesh';
import { LineSegments } from '../objects/LineSegments';

const _box = new Box3();
const _vector = new Vector3();

export class LineSegmentsGeometry extends InstancedBufferGeometry {

    isLineSegmentsGeometry: boolean;

    constructor() {
        super();
        this.isLineSegmentsGeometry = true;
        this.type = 'LineSegmentsGeometry';

        const positions = [
            -1,
            2,
            0,
            1,
            2,
            0,
            -1,
            1,
            0,
            1,
            1,
            0,
            -1,
            0,
            0,
            1,
            0,
            0,
            -1,
            -1,
            0,
            1,
            -1,
            0
        ];

        const uvs = [-1, 2, 1, 2, -1, 1, 1, 1, -1, -1, 1, -1, -1, -2, 1, -2];

        const index = [0, 2, 1, 2, 3, 1, 2, 4, 3, 4, 5, 3, 4, 6, 5, 6, 7, 5];

        this.setIndex(index);
        this.setAttribute('position', new Float32BufferAttribute(positions, 3));
        this.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
    }

    applyMatrix4(matrix: Matrix4) {
        const start = this.attributes.instanceStart;
        const end = this.attributes.instanceEnd;

        if (start !== undefined) {
            start.applyMatrix4(matrix);
            end.applyMatrix4(matrix);
            start.needsUpdate = true;
        }

        if (this.boundingBox !== null) {
            this.computeBoundingBox();
        }

        if (this.boundingSphere !== null) {
            this.computeBoundingSphere();
        }

        return this;
    }

    setPositions(array: AnyTypedArray | number[]) {
        let lineSegments;

        if (array instanceof Float32Array) {
            lineSegments = array;
        } else if (Array.isArray(array)) {
            lineSegments = new Float32Array(array);
        }

        const instanceBuffer = new InstancedInterleavedBuffer(
            lineSegments,
            6,
            1
        ); // xyz, xyz

        this.setAttribute(
            'instanceStart',
            new InterleavedBufferAttribute(instanceBuffer, 3, 0)
        ); // xyz

        this.setAttribute(
            'instanceEnd',
            new InterleavedBufferAttribute(instanceBuffer, 3, 3)
        ); // xyz
        //

        this.computeBoundingBox();
        this.computeBoundingSphere();

        return this;
    }

    setColors(array: AnyTypedArray | number[]) {
        let colors;

        if (array instanceof Float32Array) {
            colors = array;
        } else if (Array.isArray(array)) {
            colors = new Float32Array(array);
        }

        const instanceColorBuffer = new InstancedInterleavedBuffer(
            colors,
            6,
            1
        ); // rgb, rgb

        this.setAttribute(
            'instanceColorStart',
            new InterleavedBufferAttribute(instanceColorBuffer, 3, 0)
        ); // rgb

        this.setAttribute(
            'instanceColorEnd',
            new InterleavedBufferAttribute(instanceColorBuffer, 3, 3)
        ); // rgb

        return this;
    }

    fromWireframeGeometry(geometry: BufferGeometry) {
        this.setPositions(geometry.attributes.position.array);

        return this;
    }

    fromEdgesGeometry(geometry: BufferGeometry) {
        this.setPositions(geometry.attributes.position.array);

        return this;
    }

    fromMesh(mesh: Mesh) {
        this.fromWireframeGeometry(new WireframeGeometry(mesh.geometry)); // set colors, maybe

        return this;
    }

    fromLineSegments(lineSegments: LineSegments) {
        const { geometry } = lineSegments;

        this.setPositions(geometry.attributes.position.array); // assumes non-indexed
        // set colors, maybe

        return this;
    }

    computeBoundingBox() {
        if (this.boundingBox === null) {
            this.boundingBox = new Box3();
        }

        const start = this.attributes.instanceStart;
        const end = this.attributes.instanceEnd;

        if (start !== undefined && end !== undefined) {
            this.boundingBox.setFromBufferAttribute(start);

            _box.setFromBufferAttribute(end);

            this.boundingBox.union(_box);
        }
    }

    computeBoundingSphere() {
        if (this.boundingSphere === null) {
            this.boundingSphere = new Sphere();
        }

        if (this.boundingBox === null) {
            this.computeBoundingBox();
        }

        const start = this.attributes.instanceStart;
        const end = this.attributes.instanceEnd;

        if (start !== undefined && end !== undefined) {
            const { center } = this.boundingSphere;

            this.boundingBox.getCenter(center);
            let maxRadiusSq = 0;

            for (let i = 0, il = start.count; i < il; i++) {
                _vector.fromBufferAttribute(start, i);

                maxRadiusSq = Math.max(
                    maxRadiusSq,
                    center.distanceToSquared(_vector)
                );

                _vector.fromBufferAttribute(end, i);

                maxRadiusSq = Math.max(
                    maxRadiusSq,
                    center.distanceToSquared(_vector)
                );
            }

            this.boundingSphere.radius = Math.sqrt(maxRadiusSq);

            if (isNaN(this.boundingSphere.radius)) {
                console.error(
                    'LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.',
                    this
                );
            }
        }
    }

    toJSON() {
        // todo
    }

    applyMatrix(matrix: Matrix4) {
        console.warn(
            'LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4().'
        );

        return this.applyMatrix4(matrix);
    }

}
