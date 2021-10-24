import { InterpolateDiscrete } from '../../constants';
import { KeyframeTrack } from '../KeyframeTrack';

/**
 * A Track that interpolates Strings
 */
class StringKeyframeTrack extends KeyframeTrack { }

StringKeyframeTrack.prototype.ValueTypeName = 'string';
StringKeyframeTrack.prototype.ValueBufferType = Array;
StringKeyframeTrack.prototype.DefaultInterpolation = InterpolateDiscrete;
StringKeyframeTrack.prototype.InterpolantFactoryMethodLinear = undefined;
StringKeyframeTrack.prototype.InterpolantFactoryMethodSmooth = undefined;

export { StringKeyframeTrack };
