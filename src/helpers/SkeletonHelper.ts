import { Float32BufferAttribute } from '../core/BufferAttribute';
import { BufferGeometry } from '../core/BufferGeometry';
import { Object3D } from '../core/Object3D';
import { LineBasicMaterial } from '../materials/LineBasicMaterial';
import { Color } from '../math/Color';
import { Vector3 } from '../math/Vector3';
import { Matrix4 } from '../math/Matrix4';
import { LineSegments } from '../objects/LineSegments';

const _vector = /* @__PURE__*/ new Vector3();
const _boneMatrix = /* @__PURE__*/ new Matrix4();
const _matrixWorldInv = /* @__PURE__*/ new Matrix4();

class SkeletonHelper extends LineSegments {

    root: any;
    bones: any[];

    constructor(object: Object3D) {
        const bones = getBoneList(object);

        const geometry = new BufferGeometry();

        const vertices = [];
        const colors = [];

        const color1 = new Color(0, 0, 1);
        const color2 = new Color(0, 1, 0);

        for (let i = 0; i < bones.length; i++) {
            const bone = bones[i];

            if (bone.parent && bone.parent.isBone) {
                vertices.push(0, 0, 0);
                vertices.push(0, 0, 0);
                colors.push(color1.r, color1.g, color1.b);
                colors.push(color2.r, color2.g, color2.b);
            }
        }

        geometry.setAttribute(
            'position',
            new Float32BufferAttribute(vertices, 3)
        );
        geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));

        const material = new LineBasicMaterial();

        material.vertexColors = true;
        material.depthTest = false;
        material.depthWrite = false;
        material.toneMapped = false;
        material.transparent = true;

        super(geometry, material);

        this.isSkeletonHelper = true;

        this.type = 'SkeletonHelper';

        this.root = object;
        this.bones = bones;

        this.matrix = object.matrixWorld;
        this.matrixAutoUpdate = false;
    }

    updateMatrixWorld(force) {
        const { bones } = this;

        const { geometry } = this;
        const position = geometry.getAttribute('position');

        _matrixWorldInv.copy(this.root.matrixWorld).invert();

        for (let i = 0, j = 0; i < bones.length; i++) {
            const bone = bones[i];

            if (bone.parent && bone.parent.isBone) {
                _boneMatrix.multiplyMatrices(_matrixWorldInv, bone.matrixWorld);
                _vector.setFromMatrixPosition(_boneMatrix);
                position.setXYZ(j, _vector.x, _vector.y, _vector.z);

                _boneMatrix.multiplyMatrices(
                    _matrixWorldInv,
                    bone.parent.matrixWorld
                );
                _vector.setFromMatrixPosition(_boneMatrix);
                position.setXYZ(j + 1, _vector.x, _vector.y, _vector.z);

                j += 2;
            }
        }

        geometry.getAttribute('position').needsUpdate = true;

        super.updateMatrixWorld(force);
    }

}

function getBoneList(object: Object3D) {
    const boneList = [];

    if (object && object.isBone) {
        boneList.push(object);
    }

    for (let i = 0; i < object.children.length; i++) {
        boneList.push(...getBoneList(object.children[i]));
    }

    return boneList;
}

export { SkeletonHelper };
