import { generateUUID } from "../../math/MathUtils";
import { Path } from "./Path";

class Shape extends Path {
	uuid: string;
	holes: any[];

	constructor(points?) {
		super(points);

		this.uuid = generateUUID();

		this.type = "Shape";

		this.holes = [];
	}

	getPointsHoles(divisions) {
		const holesPts = [];

		for (let i = 0, l = this.holes.length; i < l; i++) {
			holesPts[i] = this.holes[i].getPoints(divisions);
		}

		return holesPts;
	}

	// get points of shape and holes (keypoints based on segments parameter)

	extractPoints(divisions) {
		return {
			shape: this.getPoints(divisions),
			holes: this.getPointsHoles(divisions),
		};
	}

	copy(source: Shape) {
		super.copy(source);

		this.holes = [];
		for (let i = 0, l = source.holes.length; i < l; i++) {
			const hole = source.holes[i];
			this.holes.push(hole.clone());
		}

		return this;
	}

	fromJSON(json) {
		super.fromJSON(json);

		this.uuid = json.uuid;
		this.holes = [];

		for (let i = 0, l = json.holes.length; i < l; i++) {
			const hole = json.holes[i];
			this.holes.push(new Path().fromJSON(hole));
		}

		return this;
	}
}

export { Shape };
