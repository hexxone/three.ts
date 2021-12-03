import { InterpolateDiscrete, KeyframeTrack } from '../../';

/**
 * A Track of Boolean keyframe values.
 */
class BooleanKeyframeTrack extends KeyframeTrack { }

BooleanKeyframeTrack.prototype.ValueTypeName = 'bool';
BooleanKeyframeTrack.prototype.ValueBufferType = Array as any;
BooleanKeyframeTrack.prototype.DefaultInterpolation = InterpolateDiscrete;
BooleanKeyframeTrack.prototype.InterpolantFactoryMethodLinear = undefined;
BooleanKeyframeTrack.prototype.InterpolantFactoryMethodSmooth = undefined;

// Note: Actually this track could have a optimized / compressed
// representation of a single value and a custom interpolant that
// computes "firstValue ^ isOdd( index )".

export { BooleanKeyframeTrack };
