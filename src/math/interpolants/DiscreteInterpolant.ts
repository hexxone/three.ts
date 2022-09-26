import { Interpolant } from "../Interpolant";

/**
 * Interpolant that evaluates to the sample value at the position preceeding
 * the parameter.
 */
class DiscreteInterpolant extends Interpolant {
	constructor(parameterPositions: number[], sampleValues: Float32Array | number[], sampleSize: number, resultBuffer?: Float32Array) {
		super(parameterPositions, sampleValues, sampleSize, resultBuffer);
	}

	interpolate_(i1: number , t0: number, t: number, t1: number) {
		return this.copySampleValue_(i1 - 1);
	}
}

export { DiscreteInterpolant };
