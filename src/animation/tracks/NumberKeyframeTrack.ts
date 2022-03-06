import { KeyframeTrack } from "..";

/**
 * A Track of numeric keyframe values.
 */
class NumberKeyframeTrack extends KeyframeTrack {
	static parse: any;
}

NumberKeyframeTrack.prototype.ValueTypeName = "number";
// ValueBufferType is inherited
// DefaultInterpolation is inherited

export { NumberKeyframeTrack };
