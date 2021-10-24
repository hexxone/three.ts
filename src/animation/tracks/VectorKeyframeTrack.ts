import { KeyframeTrack } from '../KeyframeTrack';

/**
 * A Track of vectored keyframe values.
 */
class VectorKeyframeTrack extends KeyframeTrack { }

VectorKeyframeTrack.prototype.ValueTypeName = 'vector';
// ValueBufferType is inherited
// DefaultInterpolation is inherited

export { VectorKeyframeTrack };
