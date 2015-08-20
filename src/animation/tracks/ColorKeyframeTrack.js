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

THREE.ColorKeyframeTrack.prototype = Object.create( THREE.KeyframeTrack.prototype );

THREE.ColorKeyframeTrack.prototype.constructor = THREE.ColorKeyframeTrack;

THREE.ColorKeyframeTrack.prototype.setResult = function( value ) {

	this.result.copy( value );

};

// memoization of the lerp function for speed.
// NOTE: Do not optimize as a prototype initialization closure, as value0 will be different on a per class basis.
THREE.ColorKeyframeTrack.prototype.lerpValues = function( value0, value1, alpha ) {

	return value0.lerp( value1, alpha );

};

THREE.ColorKeyframeTrack.prototype.compareValues = function( value0, value1 ) {

	return value0.equals( value1 );

};

THREE.ColorKeyframeTrack.parse = function( name, jsonKeys ) {

	var keys = [];

	for( var i = 0; i < jsonKeys.length; i ++ ) {
		var jsonKey = jsonKeys[i];
		var key = {
			value: new THREE.Color().fromArray( jsonKey.value ),
			time: jsonKey.time
		};
		keys.push( key );
	}

	return new THREE.ColorKeyframeTrack( name, keys );

};
 