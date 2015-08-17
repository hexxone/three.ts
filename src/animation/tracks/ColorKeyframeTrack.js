/**
 *
 * A Track that interpolates Color
 * 
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 */

THREE.ColorKeyframeTrack = function ( name, keys ) {

	THREE.KeyframeTrack.call( this, name, keys );

	// local cache of value type to avoid allocations during runtime.
	this.result = this.keys[0].value.clone();

};

THREE.ColorKeyframeTrack.prototype = {

	constructor: THREE.ColorKeyframeTrack,

	setResult: function( value ) {

		this.result.copy( value );

	},

	// memoization of the lerp function for speed.
	// NOTE: Do not optimize as a prototype initialization closure, as value0 will be different on a per class basis.
	lerpValues: function( value0, value1, alpha ) {

		return value0.slerp( value1, alpha );

	},

	compareValues: function( value0, value1 ) {

		return value0.equals( value1 );

	}

};