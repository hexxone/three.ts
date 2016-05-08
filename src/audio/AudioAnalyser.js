/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.AudioAnalyser = function ( audio, fftSize ) {

	this.analyser = audio.context.createAnalyser();
	this.analyser.fftSize = fftSize !== undefined ? fftSize : 2048;

	this.data = new Uint8Array( this.analyser.frequencyBinCount );

	audio.getOutput().connect( this.analyser );

};

Object.assign( THREE.AudioAnalyser.prototype, {

	getData: function () {

		this.analyser.getByteFrequencyData( this.data );
		return this.data;

	}

} );
