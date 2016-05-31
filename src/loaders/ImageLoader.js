/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.ImageLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

Object.assign( THREE.ImageLoader.prototype, {

	load: function ( url, onLoad, onProgress, onError ) {

		var image = document.createElement( 'img' );
		image.onload = function () {

			URL.revokeObjectURL( image.src );
			if ( onLoad ) onLoad( image );

		};

		if ( url.indexOf( 'data:' ) === 0 ) {

			image.src = url;

		} else {

			var loader = new THREE.XHRLoader( this.manager );
			loader.setPath( this.path );
			loader.setResponseType( 'blob' );
			loader.load( url, function ( blob ) {

				image.src = URL.createObjectURL( blob );

			}, onProgress, onError );

		}

		return image;

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	},

	setPath: function ( value ) {

		this.path = value;

	}

} );
