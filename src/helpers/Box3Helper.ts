import { BufferAttribute,
    Float32BufferAttribute } from '../core/BufferAttribute';
import { BufferGeometry } from '../core/BufferGeometry';
import { LineBasicMaterial } from '../materials/LineBasicMaterial';
import { Color } from '../math/Color';
import { LineSegments } from '../objects/LineSegments';

class Box3Helper extends LineSegments {

    box: any;

    constructor(box, color = 0xffff00) {
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

        const positions = [
            1,
            1,
            1,
            -1,
            1,
            1,
            -1,
            -1,
            1,
            1,
            -1,
            1,
            1,
            1,
            -1,
            -1,
            1,
            -1,
            -1,
            -1,
            -1,
            1,
            -1,
            -1
        ];

        const geometry = new BufferGeometry();

        geometry.setIndex(new BufferAttribute(indices, 1));
        geometry.setAttribute(
            'position',
            new Float32BufferAttribute(positions, 3)
        );

        const material = new LineBasicMaterial();

        material.color = new Color(color);
        material.toneMapped = false;

        super(geometry, material);

        this.box = box;

        this.type = 'Box3Helper';

        this.geometry.computeBoundingSphere();
    }

    updateMatrixWorld(force) {
        const { box } = this;

        if (box.isEmpty()) { return; }

        box.getCenter(this.position);

        box.getSize(this.scale);

        this.scale.multiplyScalar(0.5);

        super.updateMatrixWorld(force);
    }

}

export { Box3Helper };
