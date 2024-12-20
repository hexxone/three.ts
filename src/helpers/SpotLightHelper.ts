import { Float32BufferAttribute } from '../core/BufferAttribute';
import { BufferGeometry } from '../core/BufferGeometry';
import { Object3D } from '../core/Object3D';
import { LineBasicMaterial } from '../materials/LineBasicMaterial';
import { Vector3 } from '../math/Vector3';
import { LineSegments } from '../objects/LineSegments';

const _vector = /* @__PURE__*/ new Vector3();

/**
 * @public
 */
class SpotLightHelper extends Object3D {

    light: any;
    color: any;
    cone: LineSegments;

    constructor(light, color) {
        super();
        this.light = light;
        this.light.updateMatrixWorld();

        this.matrix = light.matrixWorld;
        this.matrixAutoUpdate = false;

        this.color = color;

        const geometry = new BufferGeometry();

        const positions = [
            0,
            0,
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            1,
            0,
            1,
            0,
            0,
            0,
            -1,
            0,
            1,
            0,
            0,
            0,
            0,
            1,
            1,
            0,
            0,
            0,
            0,
            -1,
            1
        ];

        for (let i = 0, j = 1, l = 32; i < l; i++, j++) {
            const p1 = (i / l) * Math.PI * 2;
            const p2 = (j / l) * Math.PI * 2;

            positions.push(
                Math.cos(p1),
                Math.sin(p1),
                1,
                Math.cos(p2),
                Math.sin(p2),
                1
            );
        }

        geometry.setAttribute(
            'position',
            new Float32BufferAttribute(positions, 3)
        );

        const material = new LineBasicMaterial();

        material.fog = false;
        material.toneMapped = false;

        this.cone = new LineSegments(geometry, material);
        this.add(this.cone);

        this.update();
    }

    dispose() {
        this.cone.geometry.dispose();
        this.cone.material.dispose();
    }

    update() {
        this.light.updateMatrixWorld();

        const coneLength = this.light.distance ? this.light.distance : 1000;
        const coneWidth = coneLength * Math.tan(this.light.angle);

        this.cone.scale.set(coneWidth, coneWidth, coneLength);

        _vector.setFromMatrixPosition(this.light.target.matrixWorld);

        this.cone.lookAt(_vector);

        if (this.color !== undefined) {
            this.cone.material.color.set(this.color);
        } else {
            this.cone.material.color.copy(this.light.color);
        }
    }

}

export { SpotLightHelper };
