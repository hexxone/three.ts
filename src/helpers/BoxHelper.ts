import { Object3D } from '../core/Object3D';
import { BufferAttribute } from '../core/BufferAttribute';
import { BufferGeometry } from '../core/BufferGeometry';
import { LineBasicMaterial } from '../materials/LineBasicMaterial';
import { Box3 } from '../math/Box3';
import { Color } from '../math/Color';
import { LineSegments } from '../objects/LineSegments';

const _box = /* @__PURE__*/ new Box3();

class BoxHelper extends LineSegments {

    object: Object3D;

    constructor(object: Object3D, color = 0xffff00) {
        const indices = new Uint16Array([
            0,
            1,
            1,
            2,
            2,
            3,
            3,
            0,
            4,
            5,
            5,
            6,
            6,
            7,
            7,
            4,
            0,
            4,
            1,
            5,
            2,
            6,
            3,
            7
        ]);
        const positions = new Float32Array(8 * 3);

        const geometry = new BufferGeometry();

        geometry.setIndex(new BufferAttribute(indices, 1));
        geometry.setAttribute('position', new BufferAttribute(positions, 3));

        const material = new LineBasicMaterial();

        material.color = new Color(color);
        material.toneMapped = false;

        super(geometry, material);

        this.object = object;
        this.type = 'BoxHelper';

        this.matrixAutoUpdate = false;

        this.update();
    }

    update() {
        if (_box.isEmpty()) { return; }

        const { min } = _box;
        const { max } = _box;

        /*
           5____4
        1/___0/ |
        | 6__|_7
        2/___3/

        0: max.x, max.y, max.z
        1: min.x, max.y, max.z
        2: min.x, min.y, max.z
        3: max.x, min.y, max.z
        4: max.x, max.y, min.z
        5: min.x, max.y, min.z
        6: min.x, min.y, min.z
        7: max.x, min.y, min.z
        */

        const { position } = this.geometry.attributes;
        const { array } = position;

        array[0] = max.x;
        array[1] = max.y;
        array[2] = max.z;
        array[3] = min.x;
        array[4] = max.y;
        array[5] = max.z;
        array[6] = min.x;
        array[7] = min.y;
        array[8] = max.z;
        array[9] = max.x;
        array[10] = min.y;
        array[11] = max.z;
        array[12] = max.x;
        array[13] = max.y;
        array[14] = min.z;
        array[15] = min.x;
        array[16] = max.y;
        array[17] = min.z;
        array[18] = min.x;
        array[19] = min.y;
        array[20] = min.z;
        array[21] = max.x;
        array[22] = min.y;
        array[23] = min.z;

        position.needsUpdate = true;

        this.geometry.computeBoundingSphere();
    }

    setFromObject(object) {
        this.object = object;
        this.update();

        return this;
    }

    copy(source: BoxHelper) {
        super.copy(source);

        this.object = source.object;

        return this;
    }

}

export { BoxHelper };
