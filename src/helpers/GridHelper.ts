import { Float32BufferAttribute } from '../core/BufferAttribute';
import { BufferGeometry } from '../core/BufferGeometry';
import { LineBasicMaterial } from '../materials/LineBasicMaterial';
import { Color } from '../math/Color';
import { LineSegments } from '../objects/LineSegments';

class GridHelper extends LineSegments {

    constructor(
        size = 10,
        divisions = 10,
        color1 = 0x444444 as any,
        color2 = 0x888888 as any
    ) {
        color1 = new Color(color1);
        color2 = new Color(color2);

        const center = divisions / 2;
        const step = size / divisions;
        const halfSize = size / 2;

        const vertices = [];
        const colors = [];

        for (let i = 0, j = 0, k = -halfSize; i <= divisions; i++, k += step) {
            vertices.push(-halfSize, 0, k, halfSize, 0, k);
            vertices.push(k, 0, -halfSize, k, 0, halfSize);

            const color = i === center ? color1 : color2;

            color.toArray(colors, j);
            j += 3;
            color.toArray(colors, j);
            j += 3;
            color.toArray(colors, j);
            j += 3;
            color.toArray(colors, j);
            j += 3;
        }

        const geometry = new BufferGeometry();

        geometry.setAttribute(
            'position',
            new Float32BufferAttribute(vertices, 3)
        );
        geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));

        const material = new LineBasicMaterial();

        material.vertexColors = true;
        material.toneMapped = false;

        super(geometry, material);

        this.type = 'GridHelper';
    }

}

export { GridHelper };
