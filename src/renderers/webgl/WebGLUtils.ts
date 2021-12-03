import { RGBA_ASTC_4x4_Format, RGBA_ASTC_5x4_Format, RGBA_ASTC_5x5_Format, RGBA_ASTC_6x5_Format, RGBA_ASTC_6x6_Format, RGBA_ASTC_8x5_Format, RGBA_ASTC_8x6_Format, RGBA_ASTC_8x8_Format, RGBA_ASTC_10x5_Format, RGBA_ASTC_10x6_Format, RGBA_ASTC_10x8_Format, RGBA_ASTC_10x10_Format, RGBA_ASTC_12x10_Format, RGBA_ASTC_12x12_Format, RGB_ETC1_Format, RGB_ETC2_Format, RGBA_ETC2_EAC_Format, RGBA_PVRTC_2BPPV1_Format, RGBA_PVRTC_4BPPV1_Format, RGB_PVRTC_2BPPV1_Format, RGB_PVRTC_4BPPV1_Format, RGBA_S3TC_DXT5_Format, RGBA_S3TC_DXT3_Format, RGBA_S3TC_DXT1_Format, RGB_S3TC_DXT1_Format, DepthFormat, DepthStencilFormat, LuminanceAlphaFormat, LuminanceFormat, RedFormat, RGBAFormat, RGBFormat, AlphaFormat, RedIntegerFormat, RGFormat, RGIntegerFormat, RGBIntegerFormat, RGBAIntegerFormat, HalfFloatType, FloatType, UnsignedIntType, IntType, UnsignedShortType, ShortType, ByteType, UnsignedInt248Type, UnsignedShort565Type, UnsignedShort5551Type, UnsignedShort4444Type, UnsignedByteType, SRGB8_ALPHA8_ASTC_4x4_Format, SRGB8_ALPHA8_ASTC_5x4_Format, SRGB8_ALPHA8_ASTC_5x5_Format, SRGB8_ALPHA8_ASTC_6x5_Format, SRGB8_ALPHA8_ASTC_6x6_Format, SRGB8_ALPHA8_ASTC_8x5_Format, SRGB8_ALPHA8_ASTC_8x6_Format, SRGB8_ALPHA8_ASTC_8x8_Format, SRGB8_ALPHA8_ASTC_10x5_Format, SRGB8_ALPHA8_ASTC_10x6_Format, SRGB8_ALPHA8_ASTC_10x8_Format, SRGB8_ALPHA8_ASTC_10x10_Format, SRGB8_ALPHA8_ASTC_12x10_Format, SRGB8_ALPHA8_ASTC_12x12_Format, RGBA_BPTC_Format } from '../../constants';
import { WebGLCapabilities } from './WebGLCapabilities';
import { WebGLExtensions } from './WebGLExtensions';

class WebGLUtils {
	_gl: GLESRenderingContext;
	_extensions: WebGLExtensions;
	_capabilities: WebGLCapabilities;

	public isWebGL2: any;

	constructor( gl: GLESRenderingContext, extensions: WebGLExtensions, capabilities: WebGLCapabilities ) {
		this._gl = gl;
		this._extensions = extensions;
		this._capabilities = capabilities;

		this.isWebGL2 = capabilities.isWebGL2;
	}

	public convert( p: number ) {
		let extension;

		if ( p === UnsignedByteType ) return this._gl.UNSIGNED_BYTE;
		if ( p === UnsignedShort4444Type ) return this._gl.UNSIGNED_SHORT_4_4_4_4;
		if ( p === UnsignedShort5551Type ) return this._gl.UNSIGNED_SHORT_5_5_5_1;
		if ( p === UnsignedShort565Type ) return this._gl.UNSIGNED_SHORT_5_6_5;

		if ( p === ByteType ) return this._gl.BYTE;
		if ( p === ShortType ) return this._gl.SHORT;
		if ( p === UnsignedShortType ) return this._gl.UNSIGNED_SHORT;
		if ( p === IntType ) return this._gl.INT;
		if ( p === UnsignedIntType ) return this._gl.UNSIGNED_INT;
		if ( p === FloatType ) return this._gl.FLOAT;

		if ( p === HalfFloatType ) {
			if ( this.isWebGL2 ) return this._gl.HALF_FLOAT;

			extension = this._extensions.get( 'OES_texture_half_float' );

			if ( extension !== null ) {
				return extension.HALF_FLOAT_OES;
			} else {
				return null;
			}
		}

		if ( p === AlphaFormat ) return this._gl.ALPHA;
		if ( p === RGBFormat ) return this._gl.RGB;
		if ( p === RGBAFormat ) return this._gl.RGBA;
		if ( p === LuminanceFormat ) return this._gl.LUMINANCE;
		if ( p === LuminanceAlphaFormat ) return this._gl.LUMINANCE_ALPHA;
		if ( p === DepthFormat ) return this._gl.DEPTH_COMPONENT;
		if ( p === DepthStencilFormat ) return this._gl.DEPTH_STENCIL;
		if ( p === RedFormat ) return this._gl.RED;

		// WebGL2 formats.

		if ( p === RedIntegerFormat ) return this._gl.RED_INTEGER;
		if ( p === RGFormat ) return this._gl.RG;
		if ( p === RGIntegerFormat ) return this._gl.RG_INTEGER;
		if ( p === RGBIntegerFormat ) return this._gl.RGB_INTEGER;
		if ( p === RGBAIntegerFormat ) return this._gl.RGBA_INTEGER;

		if ( p === RGB_S3TC_DXT1_Format || p === RGBA_S3TC_DXT1_Format ||
			p === RGBA_S3TC_DXT3_Format || p === RGBA_S3TC_DXT5_Format ) {
			extension = this._extensions.get( 'WEBGL_compressed_texture_s3tc' );

			if ( extension !== null ) {
				if ( p === RGB_S3TC_DXT1_Format ) return extension.COMPRESSED_RGB_S3TC_DXT1_EXT;
				if ( p === RGBA_S3TC_DXT1_Format ) return extension.COMPRESSED_RGBA_S3TC_DXT1_EXT;
				if ( p === RGBA_S3TC_DXT3_Format ) return extension.COMPRESSED_RGBA_S3TC_DXT3_EXT;
				if ( p === RGBA_S3TC_DXT5_Format ) return extension.COMPRESSED_RGBA_S3TC_DXT5_EXT;
			} else {
				return null;
			}
		}

		if ( p === RGB_PVRTC_4BPPV1_Format || p === RGB_PVRTC_2BPPV1_Format ||
			p === RGBA_PVRTC_4BPPV1_Format || p === RGBA_PVRTC_2BPPV1_Format ) {
			extension = this._extensions.get( 'WEBGL_compressed_texture_pvrtc' );

			if ( extension !== null ) {
				if ( p === RGB_PVRTC_4BPPV1_Format ) return extension.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
				if ( p === RGB_PVRTC_2BPPV1_Format ) return extension.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
				if ( p === RGBA_PVRTC_4BPPV1_Format ) return extension.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
				if ( p === RGBA_PVRTC_2BPPV1_Format ) return extension.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
			} else {
				return null;
			}
		}

		if ( p === RGB_ETC1_Format ) {
			extension = this._extensions.get( 'WEBGL_compressed_texture_etc1' );

			if ( extension !== null ) {
				return extension.COMPRESSED_RGB_ETC1_WEBGL;
			} else {
				return null;
			}
		}

		if ( p === RGB_ETC2_Format || p === RGBA_ETC2_EAC_Format ) {
			extension = this._extensions.get( 'WEBGL_compressed_texture_etc' );

			if ( extension !== null ) {
				if ( p === RGB_ETC2_Format ) return extension.COMPRESSED_RGB8_ETC2;
				if ( p === RGBA_ETC2_EAC_Format ) return extension.COMPRESSED_RGBA8_ETC2_EAC;
			}
		}

		if ( p === RGBA_ASTC_4x4_Format || p === RGBA_ASTC_5x4_Format || p === RGBA_ASTC_5x5_Format ||
			p === RGBA_ASTC_6x5_Format || p === RGBA_ASTC_6x6_Format || p === RGBA_ASTC_8x5_Format ||
			p === RGBA_ASTC_8x6_Format || p === RGBA_ASTC_8x8_Format || p === RGBA_ASTC_10x5_Format ||
			p === RGBA_ASTC_10x6_Format || p === RGBA_ASTC_10x8_Format || p === RGBA_ASTC_10x10_Format ||
			p === RGBA_ASTC_12x10_Format || p === RGBA_ASTC_12x12_Format ||
			p === SRGB8_ALPHA8_ASTC_4x4_Format || p === SRGB8_ALPHA8_ASTC_5x4_Format || p === SRGB8_ALPHA8_ASTC_5x5_Format ||
			p === SRGB8_ALPHA8_ASTC_6x5_Format || p === SRGB8_ALPHA8_ASTC_6x6_Format || p === SRGB8_ALPHA8_ASTC_8x5_Format ||
			p === SRGB8_ALPHA8_ASTC_8x6_Format || p === SRGB8_ALPHA8_ASTC_8x8_Format || p === SRGB8_ALPHA8_ASTC_10x5_Format ||
			p === SRGB8_ALPHA8_ASTC_10x6_Format || p === SRGB8_ALPHA8_ASTC_10x8_Format || p === SRGB8_ALPHA8_ASTC_10x10_Format ||
			p === SRGB8_ALPHA8_ASTC_12x10_Format || p === SRGB8_ALPHA8_ASTC_12x12_Format ) {
			extension = this._extensions.get( 'WEBGL_compressed_texture_astc' );

			if ( extension !== null ) {
				// Complete?

				return p;
			} else {
				return null;
			}
		}

		if ( p === RGBA_BPTC_Format ) {
			extension = this._extensions.get( 'EXT_texture_compression_bptc' );

			if ( extension !== null ) {
				// Complete?

				return p;
			} else {
				return null;
			}
		}

		if ( p === UnsignedInt248Type ) {
			if ( this.isWebGL2 ) return this._gl.UNSIGNED_INT_24_8;

			extension = this._extensions.get( 'WEBGL_depth_texture' );

			if ( extension !== null ) {
				return extension.UNSIGNED_INT_24_8_WEBGL;
			} else {
				return null;
			}
		}
	}
}

export { WebGLUtils };
