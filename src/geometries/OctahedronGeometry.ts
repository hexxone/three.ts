import { PolyhedronGeometry } from './PolyhedronGeometry';

class OctahedronGeometry extends PolyhedronGeometry {

    constructor(radius = 1, detail = 0) {
        const vertices = [
            1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 1, 0, 0, -1
        ];

        const indices = [
            0,
            2,
            4,
            0,
            4,
            3,
            0,
            3,
            5,
            0,
            5,
            2,
            1,
            2,
            5,
            1,
            5,
            3,
            1,
            3,
            4,
            1,
            4,
            2
        ];

        super(vertices, indices, radius, detail);

        this.type = 'OctahedronGeometry';

        this.parameters = {
            radius,
            detail
        };
    }

}

export {
    OctahedronGeometry, OctahedronGeometry as OctahedronBufferGeometry
};
