import {
	BufferGeometry,
	Float32BufferAttribute,
	LineBasicMaterial,
	LineSegments,
} from "../";

class AxesHelper extends LineSegments {
	constructor(size = 1) {
		const vertices = [
			0,
			0,
			0,
			size,
			0,
			0,
			0,
			0,
			0,
			0,
			size,
			0,
			0,
			0,
			0,
			0,
			0,
			size,
		];

		const colors = [1, 0, 0, 1, 0.6, 0, 0, 1, 0, 0.6, 1, 0, 0, 0, 1, 0, 0.6, 1];

		const geometry = new BufferGeometry();
		geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
		geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));

		const material = new LineBasicMaterial({
			vertexColors: true,
			toneMapped: false,
		});

		super(geometry, material);

		this.type = "AxesHelper";
	}
}

export { AxesHelper };
