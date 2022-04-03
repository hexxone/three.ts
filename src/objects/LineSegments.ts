import { Vector3, Float32BufferAttribute, Line, Material } from "..";

const _start = new Vector3();
const _end = new Vector3();

export class LineSegments extends Line {
	constructor(geometry, material: Material) {
		super(geometry, material);

		this.isLineSegments = true;
		this.type = "LineSegments";
	}

	computeLineDistances() {
		const geometry = this.geometry;
		if (geometry.isBufferGeometry) {
			// we assume non-indexed geometry

			if (geometry.index === null) {
				const positionAttribute = geometry.attributes.position;
				const lineDistances = [];

				for (let i = 0, l = positionAttribute.count; i < l; i += 2) {
					_start.fromBufferAttribute(positionAttribute, i);
					_end.fromBufferAttribute(positionAttribute, i + 1);

					lineDistances[i] = i === 0 ? 0 : lineDistances[i - 1];
					lineDistances[i + 1] = lineDistances[i] + _start.distanceTo(_end);
				}

				geometry.setAttribute(
					"lineDistance",
					new Float32BufferAttribute(lineDistances, 1)
				);
			} else {
				console.warn(
					"LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry."
				);
			}
		}

		return this;
	}
}
