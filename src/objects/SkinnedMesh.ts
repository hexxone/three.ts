import { Matrix4 } from '../math/Matrix4';
import { Vector3 } from '../math/Vector3';
import { Vector4 } from '../math/Vector4';
import { Mesh } from './Mesh';
import { Skeleton } from './Skeleton';

const _basePosition = new Vector3();

const _skinIndex = new Vector4();
const _skinWeight = new Vector4();

const _vector = new Vector3();
const _matrix = new Matrix4();

/**
 * @public
 */
export class SkinnedMesh extends Mesh {

    bindMatrixInverse: Matrix4;

    constructor(geometry, material) {
        super(geometry, material);

        this.isSkinnedMesh = true;
        this.type = 'SkinnedMesh';

        this.bindMode = 'attached';
        this.bindMatrix = new Matrix4();
        this.bindMatrixInverse = new Matrix4();
    }

    copy(source: SkinnedMesh) {
        super.copy(source);

        this.bindMode = source.bindMode;
        this.bindMatrix.copy(source.bindMatrix);
        this.bindMatrixInverse.copy(source.bindMatrixInverse);

        this.skeleton = source.skeleton;

        return this;
    }

    bind(skeleton: Skeleton, bindMatrix) {
        this.skeleton = skeleton;

        if (bindMatrix === undefined) {
            this.updateMatrixWorld(true);

            this.skeleton.calculateInverses();

            bindMatrix = this.matrixWorld;
        }

        this.bindMatrix.copy(bindMatrix);
        this.bindMatrixInverse.copy(bindMatrix).invert();
    }

    pose() {
        this.skeleton.pose();
    }

    normalizeSkinWeights() {
        const vector = new Vector4();

        const { skinWeight } = this.geometry.attributes;

        for (let i = 0, l = skinWeight.count; i < l; i++) {
            vector.x = Number(skinWeight.getX(i));
            vector.y = Number(skinWeight.getY(i));
            vector.z = Number(skinWeight.getZ(i));
            vector.w = Number(skinWeight.getW(i));

            const scale = 1.0 / vector.manhattanLength();

            if (scale !== Infinity) {
                vector.multiplyScalar(scale);
            } else {
                vector.set(1, 0, 0, 0); // do something reasonable
            }

            skinWeight.setXYZW(i, vector.x, vector.y, vector.z, vector.w);
        }
    }

    updateMatrixWorld(force) {
        super.updateMatrixWorld(force);

        if (this.bindMode === 'attached') {
            this.bindMatrixInverse.copy(this.matrixWorld).invert();
        } else if (this.bindMode === 'detached') {
            this.bindMatrixInverse.copy(this.bindMatrix).invert();
        } else {
            console.warn(
                `SkinnedMesh: Unrecognized bindMode: ${this.bindMode}`
            );
        }
    }

    boneTransform(index, target) {
        const { skeleton } = this;
        const { geometry } = this;

        _skinIndex.fromBufferAttribute(geometry.attributes.skinIndex, index);
        _skinWeight.fromBufferAttribute(geometry.attributes.skinWeight, index);

        _basePosition
            .fromBufferAttribute(geometry.attributes.position, index)
            .applyMatrix4(this.bindMatrix);

        target.set(0, 0, 0);

        for (let i = 0; i < 4; i++) {
            const weight = _skinWeight.getComponent(i);

            if (weight !== 0) {
                const boneIndex = _skinIndex.getComponent(i);

                _matrix.multiplyMatrices(
                    skeleton.bones[boneIndex].matrixWorld,
                    skeleton.boneInverses[boneIndex]
                );

                target.addScaledVector(
                    _vector.copy(_basePosition).applyMatrix4(_matrix),
                    weight
                );
            }
        }

        return target.applyMatrix4(this.bindMatrixInverse);
    }

}
