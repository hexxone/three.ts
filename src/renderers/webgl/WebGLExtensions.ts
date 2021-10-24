import { WebGLCapabilities } from './WebGLCapabilities';

class WebGLExtensions {
	gl: any;
	extensions = {};

	constructor( gl ) {
		this.gl = gl;
	}

	getExtension( name: string ) {
		if ( this.extensions[ name ] !== undefined ) {
			return this.extensions[ name ];
		}

		let extension = this.gl.getExtension( name );
		if ( ! extension ) {
			switch ( name ) {
			case 'WEBGL_depth_texture':
				extension = this.gl.getExtension( 'MOZ_WEBGL_depth_texture' ) || this.gl.getExtension( 'WEBKIT_WEBGL_depth_texture' );
				break;
			case 'EXT_texture_filter_anisotropic':
				extension = this.gl.getExtension( 'MOZ_EXT_texture_filter_anisotropic' ) || this.gl.getExtension( 'WEBKIT_EXT_texture_filter_anisotropic' );
				break;
			case 'WEBGL_compressed_texture_s3tc':
				extension = this.gl.getExtension( 'MOZ_WEBGL_compressed_texture_s3tc' ) || this.gl.getExtension( 'WEBKIT_WEBGL_compressed_texture_s3tc' );
				break;
			case 'WEBGL_compressed_texture_pvrtc':
				extension = this.gl.getExtension( 'WEBKIT_WEBGL_compressed_texture_pvrtc' );
				break;
			}
		}

		this.extensions[ name ] = extension;

		return extension;
	}

	has( name: string ) {
		return this.getExtension( name ) !== null;
	}

	init( capabilities: WebGLCapabilities ) {
		if ( capabilities.isWebGL2 ) {
			this.getExtension( 'EXT_color_buffer_float' );
		} else {
			this.getExtension( 'WEBGL_depth_texture' );
			this.getExtension( 'OES_texture_float' );
			this.getExtension( 'OES_texture_half_float' );
			this.getExtension( 'OES_texture_half_float_linear' );
			this.getExtension( 'OES_standard_derivatives' );
			this.getExtension( 'OES_element_index_uint' );
			this.getExtension( 'OES_vertex_array_object' );
			this.getExtension( 'ANGLE_instanced_arrays' );
		}

		this.getExtension( 'OES_texture_float_linear' );
		this.getExtension( 'EXT_color_buffer_half_float' );
	}

	get( name: string ) {
		const extension = this.getExtension( name );

		if ( extension === null ) {
			console.warn( 'THREE.WebGLRenderer: ' + name + ' extension not supported.' );
		}

		return extension;
	}
}

export { WebGLExtensions };
