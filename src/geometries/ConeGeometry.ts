import { CylinderGeometry } from './CylinderGeometry';

class ConeGeometry extends CylinderGeometry {

    constructor(
        radius = 1,
        height = 1,
        radialSegments = 8,
        heightSegments = 1,
        openEnded = false,
        thetaStart = 0,
        thetaLength = Math.PI * 2
    ) {
        super(
            0,
            radius,
            height,
            radialSegments,
            heightSegments,
            openEnded,
            thetaStart,
            thetaLength
        );

        this.type = 'ConeGeometry';

        this.parameters = {
            radius,
            height,
            radialSegments,
            heightSegments,
            openEnded,
            thetaStart,
            thetaLength
        };
    }

}

export {
    ConeGeometry, ConeGeometry as ConeBufferGeometry
};
