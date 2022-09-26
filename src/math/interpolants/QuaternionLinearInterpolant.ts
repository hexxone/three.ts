
/**
 * Spherical linear unit quaternion interpolant.
 */

import { Interpolant } from "../Interpolant";
import { Quaternion } from "../Quaternion";

class QuaternionLinearInterpolant extends Interpolant {
	constructor(parameterPositions: Float32Array | number[], sampleValues: Float32Array | number[], sampleSize: number, resultBuffer?: Float32Array) {
		super(parameterPositions, sampleValues, sampleSize, resultBuffer);
	}

	interpolate_(i1: number , t0: number, t: number, t1: number) {
		const result = this.resultBuffer;
		const values = this.sampleValues;
		const stride = this.valueSize;

		const alpha = (t - t0) / (t1 - t0);

		let offset = i1 * stride;

		for (let end = offset + stride; offset !== end; offset += 4) {
			Quaternion.slerpFlat(
				result,
				0,
				values,
				offset - stride,
				values,
				offset,
				alpha
			);
		}

		return result;
	}
}

export { QuaternionLinearInterpolant };
