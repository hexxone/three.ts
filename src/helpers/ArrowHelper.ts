import { Float32BufferAttribute } from '../core/BufferAttribute';
import { BufferGeometry } from '../core/BufferGeometry';
import { Object3D } from '../core/Object3D';
import { CylinderGeometry } from '../geometries/CylinderGeometry';
import { LineBasicMaterial } from '../materials/LineBasicMaterial';
import { MeshBasicMaterial } from '../materials/MeshBasicMaterial';
import { Color } from '../math/Color';
import { Vector3 } from '../math/Vector3';
import { Line } from '../objects/Line';
import { Mesh } from '../objects/Mesh';

const _axis = /* @__PURE__*/ new Vector3();
let _lineGeometry;
let _coneGeometry;

/**
 * @public
 */
class ArrowHelper extends Object3D {

    line: Line;
    cone: Mesh;

    // dir is assumed to be normalized
    constructor(
        dir = new Vector3(0, 0, 1),
        origin = new Vector3(0, 0, 0),
        length = 1,
        color = 0xffff00,
        headLength = length * 0.2,
        headWidth = headLength * 0.2
    ) {
        super();

        this.type = 'ArrowHelper';

        if (_lineGeometry === undefined) {
            _lineGeometry = new BufferGeometry();
            _lineGeometry.setAttribute(
                'position',
                new Float32BufferAttribute([0, 0, 0, 0, 1, 0], 3)
            );

            _coneGeometry = new CylinderGeometry(0, 0.5, 1, 5, 1);
            _coneGeometry.translate(0, -0.5, 0);
        }

        this.position.copy(origin);

        const lineMat = new LineBasicMaterial();

        lineMat.color = new Color(color);
        lineMat.toneMapped = false;
        this.line = new Line(_lineGeometry, lineMat);
        this.line.matrixAutoUpdate = false;
        this.add(this.line);

        const coneMat = new MeshBasicMaterial();

        coneMat.color = new Color(color);
        coneMat.toneMapped = false;
        this.cone = new Mesh(_coneGeometry, coneMat);
        this.cone.matrixAutoUpdate = false;
        this.add(this.cone);

        this.setDirection(dir);
        this.setLength(length, headLength, headWidth);
    }

    setDirection(dir) {
        // dir is assumed to be normalized

        if (dir.y > 0.99999) {
            this.quaternion.set(0, 0, 0, 1);
        } else if (dir.y < -0.99999) {
            this.quaternion.set(1, 0, 0, 0);
        } else {
            _axis.set(dir.z, 0, -dir.x).normalize();

            const radians = Math.acos(dir.y);

            this.quaternion.setFromAxisAngle(_axis, radians);
        }
    }

    setLength(length, headLength = length * 0.2, headWidth = headLength * 0.2) {
        this.line.scale.set(1, Math.max(0.0001, length - headLength), 1); // see #17458
        this.line.updateMatrix();

        this.cone.scale.set(headWidth, headLength, headWidth);
        this.cone.position.y = length;
        this.cone.updateMatrix();
    }

    setColor(color) {
        this.line.material.color.set(color);
        this.cone.material.color.set(color);
    }

    copy(source: ArrowHelper) {
        super.copy(source, false);

        this.line.copy(source.line);
        this.cone.copy(source.cone);

        return this;
    }

}

export { ArrowHelper };
