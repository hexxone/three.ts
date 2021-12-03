import { Interpolant, Quaternion } from '../';

/**
 * Spherical linear unit quaternion interpolant.
 */

class QuaternionLinearInterpolant extends Interpolant {
	constructor( parameterPositions, sampleValues, sampleSize, resultBuffer ) {
		super( parameterPositions, sampleValues, sampleSize, resultBuffer );
	}

	interpolate_( i1, t0, t, t1 ) {
		const result = this.resultBuffer;
		const values = this.sampleValues;
		const stride = this.valueSize;

		const alpha = ( t - t0 ) / ( t1 - t0 );

		let offset = i1 * stride;

		for ( let end = offset + stride; offset !== end; offset += 4 ) {
			Quaternion.slerpFlat( result, 0, values, offset - stride, values, offset, alpha );
		}

		return result;
	}
}

export { QuaternionLinearInterpolant };
