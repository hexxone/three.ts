import { Float32BufferAttribute } from '../core/BufferAttribute';
import { BufferGeometry } from '../core/BufferGeometry';
import { ShapeUtils } from '../extras/ShapeUtils';

class ShapeGeometry extends BufferGeometry {

    constructor(shapes, curveSegments = 12) {
        super();
        this.type = 'ShapeGeometry';

        this.parameters = {
            shapes,
            curveSegments
        };

        // buffers

        const indices = [];
        const vertices = [];
        const normals = [];
        const uvs = [];

        // helper variables

        let groupStart = 0;
        let groupCount = 0;

        // allow single and array values for "shapes" parameter

        if (Array.isArray(shapes) === false) {
            addShape(shapes);
        } else {
            for (let i = 0; i < shapes.length; i++) {
                addShape(shapes[i]);

                this.addGroup(groupStart, groupCount, i); // enables MultiMaterial support

                groupStart += groupCount;
                groupCount = 0;
            }
        }

        // build geometry

        this.setIndex(indices);
        this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        this.setAttribute('normal', new Float32BufferAttribute(normals, 3));
        this.setAttribute('uv', new Float32BufferAttribute(uvs, 2));

        // helper functions

        function addShape(shape) {
            const indexOffset = vertices.length / 3;
            const points = shape.extractPoints(curveSegments);

            let shapeVertices = points.shape;
            const shapeHoles = points.holes;

            // check direction of vertices

            if (ShapeUtils.isClockWise(shapeVertices) === false) {
                shapeVertices = shapeVertices.reverse();
            }

            for (let i = 0, l = shapeHoles.length; i < l; i++) {
                const shapeHole = shapeHoles[i];

                if (ShapeUtils.isClockWise(shapeHole) === true) {
                    shapeHoles[i] = shapeHole.reverse();
                }
            }

            const faces = ShapeUtils.triangulateShape(
                shapeVertices,
                shapeHoles
            );

            // join vertices of inner and outer paths to a single array

            for (let i = 0, l = shapeHoles.length; i < l; i++) {
                const shapeHole = shapeHoles[i];

                shapeVertices = shapeVertices.concat(shapeHole);
            }

            // vertices, normals, uvs

            for (let i = 0, l = shapeVertices.length; i < l; i++) {
                const vertex = shapeVertices[i];

                vertices.push(vertex.x, vertex.y, 0);
                normals.push(0, 0, 1);
                uvs.push(vertex.x, vertex.y); // world uvs
            }

            // incides

            for (let i = 0, l = faces.length; i < l; i++) {
                const face = faces[i];

                const a = face[0] + indexOffset;
                const b = face[1] + indexOffset;
                const c = face[2] + indexOffset;

                indices.push(a, b, c);
                groupCount += 3;
            }
        }
    }

}

export {
    ShapeGeometry, ShapeGeometry as ShapeBufferGeometry
};