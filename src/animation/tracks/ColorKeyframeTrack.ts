import { KeyframeTrack } from "../";

/**
 * A Track of keyframe values that represent color.
 */
class ColorKeyframeTrack extends KeyframeTrack {
	constructor(name, times, values, interpol) {
		super(name, times, values, interpol);

		this.ValueTypeName = "color";
	}
}

// ValueBufferType is inherited
// DefaultInterpolation is inherited

// Note: Very basic implementation and nothing special yet.
// However, this is the place for color space parameterization.

export { ColorKeyframeTrack };
