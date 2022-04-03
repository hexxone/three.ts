import { Line } from "..";

export class LineLoop extends Line {
	constructor(geometry, material) {
		super(geometry, material);

		this.isLineLoop = true;
		this.type = "LineLoop";
	}
}
