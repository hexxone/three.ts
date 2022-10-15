/**
 * Text = 3D Text
 *
 * parameters = {
 *  font: <Font>, // font
 *
 *  size: <float>, // size of the text
 *  depth: <float>, // thickness to extrude text
 *  curveSegments: <int>, // number of points on the curves
 *
 *  bevelEnabled: <bool>, // turn on bevel
 *  bevelThickness: <float>, // how deep into text bevel goes
 *  bevelSize: <float>, // how far from text outline (including bevelOffset) is bevel
 *  bevelOffset: <float> // how far from text outline does bevel start
 * }
 */

import { BufferGeometry } from "../core/BufferGeometry";
import { Font } from "../extras/core/Font";
import { ExtrudeGeometry } from "./ExtrudeGeometry";

/**
 * @public
 */
export type TextGeometryParameters = {
	font?: Font;

	size?: number;
	depth?: number;
	curveSegments?: number;

	bevelThickness?: number;
	bevelSize?: number;
	bevelEnabled?: boolean;
	bevelOffset?: number;
};

class TextGeometry extends ExtrudeGeometry {
	constructor(text, parameters: TextGeometryParameters = {}) {
		const font = parameters.font as Font;

		if (!(font && font.isFont)) {
			console.error("TextGeometry: font parameter is not an instance of Font.");
			return new BufferGeometry();
		}

		const shapes = font.generateShapes(text, parameters.size);

		// translate parameters to ExtrudeGeometry API

		parameters.depth = parameters.depth !== undefined ? parameters.depth : 50;

		// defaults

		if (parameters.bevelThickness === undefined) parameters.bevelThickness = 10;
		if (parameters.bevelSize === undefined) parameters.bevelSize = 8;
		if (parameters.bevelEnabled === undefined) parameters.bevelEnabled = false;

		super(shapes, parameters);

		this.type = "TextGeometry";
	}
}

export { TextGeometry, TextGeometry as TextBufferGeometry };
