/* global QUnit */

import * as Constants from '../../../src/constants';

export default QUnit.module( 'Constants', () => {

	QUnit.test( "default values", ( assert ) => {

		assert.propEqual( Constants.MOUSE, { LEFT: 0, MIDDLE: 1, RIGHT: 2, ROTATE: 0, DOLLY: 1, PAN: 2 }, 'MOUSE equal { LEFT: 0, MIDDLE: 1, RIGHT: 2, ROTATE: 0, DOLLY: 1, PAN: 2 }' );
		assert.propEqual( Constants.TOUCH, { ROTATE: 0, PAN: 1, DOLLY_PAN: 2, DOLLY_ROTATE: 3 }, 'TOUCH equal { ROTATE: 0, PAN: 1, DOLLY_PAN: 2, DOLLY_ROTATE: 3 }' );
		assert.equal( Constants.CullFaceNone, 0, 'CullFaceNone equal 0' );
		assert.equal( Constants.CullFaceBack, 1, 'CullFaceBack equal 1' );
		assert.equal( Constants.CullFaceFront, 2, 'CullFaceFront is equal to 2' );
		assert.equal( Constants.CullFaceFrontBack, 3, 'CullFaceFrontBack is equal to 3' );
		assert.equal( Constants.BasicShadowMap, 0, 'BasicShadowMap is equal to 0' );
		assert.equal( Constants.PCFShadowMap, 1, 'PCFShadowMap is equal to 1' );
		assert.equal( Constants.PCFSoftShadowMap, 2, 'PCFSoftShadowMap is equal to 2' );
		assert.equal( Constants.FrontSide, 0, 'FrontSide is equal to 0' );
		assert.equal( Constants.BackSide, 1, 'BackSide is equal to 1' );
		assert.equal( Constants.DoubleSide, 2, 'DoubleSide is equal to 2' );
		assert.equal( Constants.FlatShading, 1, 'FlatShading is equal to 1' );
		assert.equal( Constants.SmoothShading, 2, 'SmoothShading is equal to 2' );
		assert.equal( Constants.NoBlending, 0, 'NoBlending is equal to 0' );
		assert.equal( Constants.NormalBlending, 1, 'NormalBlending is equal to 1' );
		assert.equal( Constants.AdditiveBlending, 2, 'AdditiveBlending is equal to 2' );
		assert.equal( Constants.SubtractiveBlending, 3, 'SubtractiveBlending is equal to 3' );
		assert.equal( Constants.MultiplyBlending, 4, 'MultiplyBlending is equal to 4' );
		assert.equal( Constants.CustomBlending, 5, 'CustomBlending is equal to 5' );
		assert.equal( Constants.AddEquation, 100, 'AddEquation is equal to 100' );
		assert.equal( Constants.SubtractEquation, 101, 'SubtractEquation is equal to 101' );
		assert.equal( Constants.ReverseSubtractEquation, 102, 'ReverseSubtractEquation is equal to 102' );
		assert.equal( Constants.MinEquation, 103, 'MinEquation is equal to 103' );
		assert.equal( Constants.MaxEquation, 104, 'MaxEquation is equal to 104' );
		assert.equal( Constants.ZeroFactor, 200, 'ZeroFactor is equal to 200' );
		assert.equal( Constants.OneFactor, 201, 'OneFactor is equal to 201' );
		assert.equal( Constants.SrcColorFactor, 202, 'SrcColorFactor is equal to 202' );
		assert.equal( Constants.OneMinusSrcColorFactor, 203, 'OneMinusSrcColorFactor is equal to 203' );
		assert.equal( Constants.SrcAlphaFactor, 204, 'SrcAlphaFactor is equal to 204' );
		assert.equal( Constants.OneMinusSrcAlphaFactor, 205, 'OneMinusSrcAlphaFactor is equal to 205' );
		assert.equal( Constants.DstAlphaFactor, 206, 'DstAlphaFactor is equal to 206' );
		assert.equal( Constants.OneMinusDstAlphaFactor, 207, 'OneMinusDstAlphaFactor is equal to 207' );
		assert.equal( Constants.DstColorFactor, 208, 'DstColorFactor is equal to 208' );
		assert.equal( Constants.OneMinusDstColorFactor, 209, 'OneMinusDstColorFactor is equal to 209' );
		assert.equal( Constants.SrcAlphaSaturateFactor, 210, 'SrcAlphaSaturateFactor is equal to 210' );
		assert.equal( Constants.NeverDepth, 0, 'NeverDepth is equal to 0' );
		assert.equal( Constants.AlwaysDepth, 1, 'AlwaysDepth is equal to 1' );
		assert.equal( Constants.LessDepth, 2, 'LessDepth is equal to 2' );
		assert.equal( Constants.LessEqualDepth, 3, 'LessEqualDepth is equal to 3' );
		assert.equal( Constants.EqualDepth, 4, 'EqualDepth is equal to 4' );
		assert.equal( Constants.GreaterEqualDepth, 5, 'GreaterEqualDepth is equal to 5' );
		assert.equal( Constants.GreaterDepth, 6, 'GreaterDepth is equal to 6' );
		assert.equal( Constants.NotEqualDepth, 7, 'NotEqualDepth is equal to 7' );
		assert.equal( Constants.MultiplyOperation, 0, 'MultiplyOperation is equal to 0' );
		assert.equal( Constants.MixOperation, 1, 'MixOperation is equal to 1' );
		assert.equal( Constants.AddOperation, 2, 'AddOperation is equal to 2' );
		assert.equal( Constants.NoToneMapping, 0, 'NoToneMapping is equal to 0' );
		assert.equal( Constants.LinearToneMapping, 1, 'LinearToneMapping is equal to 1' );
		assert.equal( Constants.ReinhardToneMapping, 2, 'ReinhardToneMapping is equal to 2' );
		assert.equal( Constants.CineonToneMapping, 3, 'CineonToneMapping is equal to 3' );
		assert.equal( Constants.ACESFilmicToneMapping, 4, 'ACESFilmicToneMapping is equal to 4' );
		assert.equal( Constants.UVMapping, 300, 'UVMapping is equal to 300' );
		assert.equal( Constants.CubeReflectionMapping, 301, 'CubeReflectionMapping is equal to 301' );
		assert.equal( Constants.CubeRefractionMapping, 302, 'CubeRefractionMapping is equal to 302' );
		assert.equal( Constants.EquirectangularReflectionMapping, 303, 'EquirectangularReflectionMapping is equal to 303' );
		assert.equal( Constants.EquirectangularRefractionMapping, 304, 'EquirectangularRefractionMapping is equal to 304' );
		assert.equal( Constants.CubeUVReflectionMapping, 306, 'CubeUVReflectionMapping is equal to 306' );
		assert.equal( Constants.CubeUVRefractionMapping, 307, 'CubeUVRefractionMapping is equal to 307' );
		assert.equal( Constants.RepeatWrapping, 1000, 'RepeatWrapping is equal to 1000' );
		assert.equal( Constants.ClampToEdgeWrapping, 1001, 'ClampToEdgeWrapping is equal to 1001' );
		assert.equal( Constants.MirroredRepeatWrapping, 1002, 'MirroredRepeatWrapping is equal to 1002' );
		assert.equal( Constants.NearestFilter, 1003, 'NearestFilter is equal to 1003' );
		assert.equal( Constants.NearestMipMapNearestFilter, 1004, 'NearestMipMapNearestFilter is equal to 1004' );
		assert.equal( Constants.NearestMipMapLinearFilter, 1005, 'NearestMipMapLinearFilter is equal to 1005' );
		assert.equal( Constants.LinearFilter, 1006, 'LinearFilter is equal to 1006' );
		assert.equal( Constants.LinearMipMapNearestFilter, 1007, 'LinearMipMapNearestFilter is equal to 1007' );
		assert.equal( Constants.LinearMipMapLinearFilter, 1008, 'LinearMipMapLinearFilter is equal to 1008' );
		assert.equal( Constants.UnsignedByteType, 1009, 'UnsignedByteType is equal to 1009' );
		assert.equal( Constants.ByteType, 1010, 'ByteType is equal to 1010' );
		assert.equal( Constants.ShortType, 1011, 'ShortType is equal to 1011' );
		assert.equal( Constants.UnsignedShortType, 1012, 'UnsignedShortType is equal to 1012' );
		assert.equal( Constants.IntType, 1013, 'IntType is equal to 1013' );
		assert.equal( Constants.UnsignedIntType, 1014, 'UnsignedIntType is equal to 1014' );
		assert.equal( Constants.FloatType, 1015, 'FloatType is equal to 1015' );
		assert.equal( Constants.HalfFloatType, 1016, 'HalfFloatType is equal to 1016' );
		assert.equal( Constants.UnsignedShort4444Type, 1017, 'UnsignedShort4444Type is equal to 1017' );
		assert.equal( Constants.UnsignedShort5551Type, 1018, 'UnsignedShort5551Type is equal to 1018' );
		assert.equal( Constants.UnsignedShort565Type, 1019, 'UnsignedShort565Type is equal to 1019' );
		assert.equal( Constants.UnsignedInt248Type, 1020, 'UnsignedInt248Type is equal to 1020' );
		assert.equal( Constants.AlphaFormat, 1021, 'AlphaFormat is equal to 1021' );
		assert.equal( Constants.RGBFormat, 1022, 'RGBFormat is equal to 1022' );
		assert.equal( Constants.RGBAFormat, 1023, 'RGBAFormat is equal to 1023' );
		assert.equal( Constants.LuminanceFormat, 1024, 'LuminanceFormat is equal to 1024' );
		assert.equal( Constants.LuminanceAlphaFormat, 1025, 'LuminanceAlphaFormat is equal to 1025' );
		assert.equal( Constants.RGBEFormat, Constants.RGBAFormat, 'RGBEFormat is equal to RGBAFormat' );
		assert.equal( Constants.DepthFormat, 1026, 'DepthFormat is equal to 1026' );
		assert.equal( Constants.DepthStencilFormat, 1027, 'DepthStencilFormat is equal to 1027' );
		assert.equal( Constants.RGB_S3TC_DXT1_Format, 33776, 'RGB_S3TC_DXT1_Format is equal to 33776' );
		assert.equal( Constants.RGBA_S3TC_DXT1_Format, 33777, 'RGBA_S3TC_DXT1_Format is equal to 33777' );
		assert.equal( Constants.RGBA_S3TC_DXT3_Format, 33778, 'RGBA_S3TC_DXT3_Format is equal to 33778' );
		assert.equal( Constants.RGBA_S3TC_DXT5_Format, 33779, 'RGBA_S3TC_DXT5_Format is equal to 33779' );
		assert.equal( Constants.RGB_PVRTC_4BPPV1_Format, 35840, 'RGB_PVRTC_4BPPV1_Format is equal to 35840' );
		assert.equal( Constants.RGB_PVRTC_2BPPV1_Format, 35841, 'RGB_PVRTC_2BPPV1_Format is equal to 35841' );
		assert.equal( Constants.RGBA_PVRTC_4BPPV1_Format, 35842, 'RGBA_PVRTC_4BPPV1_Format is equal to 35842' );
		assert.equal( Constants.RGBA_PVRTC_2BPPV1_Format, 35843, 'RGBA_PVRTC_2BPPV1_Format is equal to 35843' );
		assert.equal( Constants.RGB_ETC1_Format, 36196, 'RGB_ETC1_Format is equal to 36196' );
		assert.equal( Constants.RGBA_ASTC_4x4_Format, 37808, "Constants.RGBA_ASTC_4x4_Format is equal to 37808" );
		assert.equal( Constants.RGBA_ASTC_5x4_Format, 37809, "Constants.RGBA_ASTC_5x4_Format is equal to 37809" );
		assert.equal( Constants.RGBA_ASTC_5x5_Format, 37810, "Constants.RGBA_ASTC_5x5_Format is equal to 37810" );
		assert.equal( Constants.RGBA_ASTC_6x5_Format, 37811, "Constants.RGBA_ASTC_6x5_Format is equal to 37811" );
		assert.equal( Constants.RGBA_ASTC_6x6_Format, 37812, "Constants.RGBA_ASTC_6x6_Format is equal to 37812" );
		assert.equal( Constants.RGBA_ASTC_8x5_Format, 37813, "Constants.RGBA_ASTC_8x5_Format is equal to 37813" );
		assert.equal( Constants.RGBA_ASTC_8x6_Format, 37814, "Constants.RGBA_ASTC_8x6_Format is equal to 37814" );
		assert.equal( Constants.RGBA_ASTC_8x8_Format, 37815, "Constants.RGBA_ASTC_8x8_Format is equal to 37815" );
		assert.equal( Constants.RGBA_ASTC_10x5_Format, 37816, "Constants.RGBA_ASTC_10x5_Format is equal to 37816" );
		assert.equal( Constants.RGBA_ASTC_10x6_Format, 37817, "Constants.RGBA_ASTC_10x6_Format is equal to 37817" );
		assert.equal( Constants.RGBA_ASTC_10x8_Format, 37818, "Constants.RGBA_ASTC_10x8_Format is equal to 37818" );
		assert.equal( Constants.RGBA_ASTC_10x10_Format, 37819, "Constants.RGBA_ASTC_10x10_Format is equal to 37819" );
		assert.equal( Constants.RGBA_ASTC_12x10_Format, 37820, "Constants.RGBA_ASTC_12x10_Format is equal to 37820" );
		assert.equal( Constants.RGBA_ASTC_12x12_Format, 37821, "Constants.RGBA_ASTC_12x12_Format is equal to 37821" );
		assert.equal( Constants.LoopOnce, 2200, 'LoopOnce is equal to 2200' );
		assert.equal( Constants.LoopRepeat, 2201, 'LoopRepeat is equal to 2201' );
		assert.equal( Constants.LoopPingPong, 2202, 'LoopPingPong is equal to 2202' );
		assert.equal( Constants.InterpolateDiscrete, 2300, 'InterpolateDiscrete is equal to 2300' );
		assert.equal( Constants.InterpolateLinear, 2301, 'InterpolateLinear is equal to 2301' );
		assert.equal( Constants.InterpolateSmooth, 2302, 'InterpolateSmooth is equal to 2302' );
		assert.equal( Constants.ZeroCurvatureEnding, 2400, 'ZeroCurvatureEnding is equal to 2400' );
		assert.equal( Constants.ZeroSlopeEnding, 2401, 'ZeroSlopeEnding is equal to 2401' );
		assert.equal( Constants.WrapAroundEnding, 2402, 'WrapAroundEnding is equal to 2402' );
		assert.equal( Constants.TrianglesDrawMode, 0, 'TrianglesDrawMode is equal to 0' );
		assert.equal( Constants.TriangleStripDrawMode, 1, 'TriangleStripDrawMode is equal to 1' );
		assert.equal( Constants.TriangleFanDrawMode, 2, 'TriangleFanDrawMode is equal to 2' );
		assert.equal( Constants.LinearEncoding, 3000, 'LinearEncoding is equal to 3000' );
		assert.equal( Constants.sRGBEncoding, 3001, 'sRGBEncoding is equal to 3001' );
		assert.equal( Constants.GammaEncoding, 3007, 'GammaEncoding is equal to 3007' );
		assert.equal( Constants.RGBEEncoding, 3002, 'RGBEEncoding is equal to 3002' );
		assert.equal( Constants.LogLuvEncoding, 3003, 'LogLuvEncoding is equal to 3003' );
		assert.equal( Constants.RGBM7Encoding, 3004, 'RGBM7Encoding is equal to 3004' );
		assert.equal( Constants.RGBM16Encoding, 3005, 'RGBM16Encoding is equal to 3005' );
		assert.equal( Constants.RGBDEncoding, 3006, 'RGBDEncoding is equal to 3006' );
		assert.equal( Constants.BasicDepthPacking, 3200, 'BasicDepthPacking is equal to 3200' );
		assert.equal( Constants.RGBADepthPacking, 3201, 'RGBADepthPacking is equal to 3201' );

	} );

} );
