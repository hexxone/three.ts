import { InterpolateDiscrete, KeyframeTrack } from '../../';

/**
 * A Track that interpolates Strings
 */
class StringKeyframeTrack extends KeyframeTrack { }

StringKeyframeTrack.prototype.ValueTypeName = 'string';
StringKeyframeTrack.prototype.ValueBufferType = Array as any;
StringKeyframeTrack.prototype.DefaultInterpolation = InterpolateDiscrete;
StringKeyframeTrack.prototype.InterpolantFactoryMethodLinear = undefined;
StringKeyframeTrack.prototype.InterpolantFactoryMethodSmooth = undefined;

export { StringKeyframeTrack };
