import { RGBFormat, LinearFilter } from '../';
import { Texture } from './Texture';

class VideoTexture extends Texture {
	constructor( video, mapping?, wrapS?, wrapT?, magFilter?, minFilter?, format?, type?, anisotropy? ) {
		super( video, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy );

		this.isVideoTexture = true;

		this.format = format !== undefined ? format : RGBFormat;

		this.minFilter = minFilter !== undefined ? minFilter : LinearFilter;
		this.magFilter = magFilter !== undefined ? magFilter : LinearFilter;

		this.generateMipmaps = false;

		const scope = this;

		function updateVideo() {
			scope.needsUpdate = true;
			video.requestVideoFrameCallback( updateVideo );
		}

		if ( typeof video[ 'requestVideoFrameCallback' ] !== 'undefined' ) {
			video.requestVideoFrameCallback( updateVideo );
		}
	}

	clone() {
		return new VideoTexture( this.image ).copy( this );
	}

	update() {
		const video = this.image;
		const hasVideoFrameCallback = 'requestVideoFrameCallback' in video;

		if ( hasVideoFrameCallback === false && video.readyState >= video.HAVE_CURRENT_DATA ) {
			this.needsUpdate = true;
		}
	}
}

export { VideoTexture };
