import { BackSide, FrontSide } from '../constants';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { BufferGeometry } from '../core/BufferGeometry';
import { LineBasicMaterial } from '../materials/LineBasicMaterial';
import { MeshBasicMaterial } from '../materials/MeshBasicMaterial';
import { Color } from '../math/Color';
import { Plane } from '../math/Plane';
import { Line } from '../objects/Line';
import { Mesh } from '../objects/Mesh';

class PlaneHelper extends Line {

    plane: Plane;
    size: number;

    constructor(plane: Plane, size = 1, hex = 0xffff00) {
        const color = hex;

        const positions = [
            1,
            -1,
            1,
            -1,
            1,
            1,
            -1,
            -1,
            1,
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
            1,
            0,
            0,
            1,
            0,
            0,
            0
        ];

        const geometry = new BufferGeometry();

        geometry.setAttribute(
            'position',
            new Float32BufferAttribute(positions, 3)
        );
        geometry.computeBoundingSphere();

        const material = new LineBasicMaterial();

        material.color = new Color(color);
        material.toneMapped = false;

        super(geometry, material);

        this.type = 'PlaneHelper';

        this.plane = plane;

        this.size = size;

        const positions2 = [
            1, 1, 1, -1, 1, 1, -1, -1, 1, 1, 1, 1, -1, -1, 1, 1, -1, 1
        ];

        const geometry2 = new BufferGeometry();

        geometry2.setAttribute(
            'position',
            new Float32BufferAttribute(positions2, 3)
        );
        geometry2.computeBoundingSphere();

        const meshBasic = new MeshBasicMaterial();

        meshBasic.color = new Color(color);
        meshBasic.opacity = 0.2;
        meshBasic.transparent = true;
        meshBasic.depthWrite = false;
        meshBasic.toneMapped = false;

        this.add(new Mesh(geometry2));
    }

    updateMatrixWorld(force) {
        let scale = -this.plane.constant;

        if (Math.abs(scale) < 1e-8) { scale = 1e-8; } // sign does not matter

        this.scale.set(0.5 * this.size, 0.5 * this.size, scale);

        this.children[0].material.side = scale < 0 ? BackSide : FrontSide; // renderer flips side when determinant < 0; flipping not wanted here

        this.lookAt(this.plane.normal);

        super.updateMatrixWorld(force);
    }

}

export { PlaneHelper };
