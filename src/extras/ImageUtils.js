/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author szimek / https://github.com/szimek/
 */

let _canvas;

const ImageUtils = {

	getDataURL: function ( image ) {

		let canvas;

		var src = image.src;
		if ( src[ 0 ] === "d" && src[ 1 ] === "a" && src[ 2 ] === "t" && src[ 3 ] === "a" && src[ 4 ] === ":" ) {

			return image.src;

		} else if ( typeof HTMLCanvasElement == 'undefined' ) {

			return image.src;

		} else if ( image instanceof HTMLCanvasElement ) {

			canvas = image;

		} else {

			if ( _canvas === undefined ) _canvas = document.createElementNS( 'http://www.w3.org/1999/xhtml', 'canvas' );

			_canvas.width = image.width;
			_canvas.height = image.height;

			const context = _canvas.getContext( '2d' );

			if ( image instanceof ImageData ) {

				context.putImageData( image, 0, 0 );

			} else {

				context.drawImage( image, 0, 0, image.width, image.height );

			}

			canvas = _canvas;

		}

		if ( canvas.width > 2048 || canvas.height > 2048 ) {

			return canvas.toDataURL( 'image/jpeg', 0.6 );

		} else {

			return canvas.toDataURL( 'image/png' );

		}

	}

};

export { ImageUtils };
