import { InterpolateLinear } from '../../constants';
import { KeyframeTrack } from '../KeyframeTrack';
import { QuaternionLinearInterpolant } from '../../math/interpolants/QuaternionLinearInterpolant';

/**
 * A Track of quaternion keyframe values.
 */
class QuaternionKeyframeTrack extends KeyframeTrack {
	InterpolantFactoryMethodLinear(result) {
		return new QuaternionLinearInterpolant(this.times, this.values, this.getValueSize(), result);
	}
}

QuaternionKeyframeTrack.prototype.ValueTypeName = 'quaternion';
// ValueBufferType is inherited
QuaternionKeyframeTrack.prototype.DefaultInterpolation = InterpolateLinear;
QuaternionKeyframeTrack.prototype.InterpolantFactoryMethodSmooth = undefined;

export { QuaternionKeyframeTrack };
