import { AudioContext } from '../audio/AudioContext.js';
import { FileLoader } from './FileLoader.js';
import { Loader } from './Loader.js';

/**
 * @author Reece Aaron Lecrivain / http://reecenotes.com/
 */

function AudioLoader( manager ) {

	Loader.call( this, manager );

}

AudioLoader.prototype = Object.assign( Object.create( Loader.prototype ), {

	constructor: AudioLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new FileLoader( scope.manager );
		loader.setResponseType( 'arraybuffer' );
		loader.setPath( scope.path );
		loader.load( url, function ( buffer ) {

			try {

				// Create a copy of the buffer. The `decodeAudioData` method
				// detaches the buffer when complete, preventing reuse.
				var bufferCopy = buffer.slice( 0 );

				var context = AudioContext.getContext();
				context.decodeAudioData( bufferCopy, function ( audioBuffer ) {

					onLoad( audioBuffer );

				} );

			} catch ( e ) {

				if ( onError ) {

					onError( e );

				} else {

					console.error( e );

				}

				scope.manager.itemError( url );

			}

		}, onProgress, onError );

	}

} );


export { AudioLoader };
