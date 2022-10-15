import { Line } from "../objects";
import { LineSegmentsGeometry } from "./LineSegmentsGeometry";

export class LineGeometry extends LineSegmentsGeometry {
	isLineGeometry: boolean;

	constructor() {

		super();
		this.isLineGeometry = true;
		this.type = 'LineGeometry';

	}

	setPositions(array: NumberTypedArray | number[]) {

		// converts [ x1, y1, z1,  x2, y2, z2, ... ] to pairs format
		const length = array.length - 3;
		const points = new Float32Array(2 * length);

		for (let i = 0; i < length; i += 3) {

			points[2 * i] = array[i];
			points[2 * i + 1] = array[i + 1];
			points[2 * i + 2] = array[i + 2];
			points[2 * i + 3] = array[i + 3];
			points[2 * i + 4] = array[i + 4];
			points[2 * i + 5] = array[i + 5];

		}

		super.setPositions(points);
		return this;

	}

	setColors(array: NumberTypedArray | number[]) {

		// converts [ r1, g1, b1,  r2, g2, b2, ... ] to pairs format
		const length = array.length - 3;
		const colors = new Float32Array(2 * length);

		for (let i = 0; i < length; i += 3) {

			colors[2 * i] = array[i];
			colors[2 * i + 1] = array[i + 1];
			colors[2 * i + 2] = array[i + 2];
			colors[2 * i + 3] = array[i + 3];
			colors[2 * i + 4] = array[i + 4];
			colors[2 * i + 5] = array[i + 5];

		}

		super.setColors(colors);
		return this;

	}

	fromLine(line: Line) {

		const geometry = line.geometry;
		this.setPositions(geometry.attributes.position.array as NumberTypedArray); // assumes non-indexed
		// set colors, maybe

		return this;

	}

}
