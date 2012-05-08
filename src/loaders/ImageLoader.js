/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.ImageLoader = function () {

	THREE.EventTarget.call( this );

};

THREE.ImageLoader.prototype = {

	constructor: THREE.ImageLoader,

	crossOrigin: 'anonymous',

	load: function ( url ) {

		var scope = this;
		var image = new Image();
		
		image.addEventListener( 'load', function () {

			scope.dispatchEvent( { type: 'load', content: image } );

		}, false );

		image.addEventListener( 'error', function () {
		
			scope.dispatchEvent( { type: 'error', message: 'Couldn\'t load URL [' + url + ']' } );
		
		}, false );

		image.crossOrigin = this.crossOrigin;
		image.src = url;

	}

}
