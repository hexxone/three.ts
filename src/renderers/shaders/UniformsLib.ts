import { Color } from "../../math/Color";
import { Matrix3 } from "../../math/Matrix3";
import { Vector2 } from "../../math/Vector2";

/**
 * Uniforms library for shared webgl shaders
 * @public
 */
const UniformsLib = {
	// what is this and where does it come from?
	LTC_FLOAT_1: null,
	LTC_FLOAT_2: null,
	LTC_HALF_1: null,
	LTC_HALF_2: null,

	common: {
		diffuse: { value: new Color(0xffffff) },
		opacity: { value: 1.0 },

		map: { value: null },
		uvTransform: { value: new Matrix3() },
		uv2Transform: { value: new Matrix3() },

		alphaMap: { value: null },
		alphaTest: { value: 0 },
	},

	specularmap: {
		specularMap: { value: null },
	},

	envmap: {
		envMap: { value: null },
		flipEnvMap: { value: -1 },
		reflectivity: { value: 1.0 }, // basic, lambert, phong
		ior: { value: 1.5 }, // standard, physical
		refractionRatio: { value: 0.98 },
		maxMipLevel: { value: 0 },
	},

	aomap: {
		aoMap: { value: null },
		aoMapIntensity: { value: 1 },
	},

	lightmap: {
		lightMap: { value: null },
		lightMapIntensity: { value: 1 },
	},

	emissivemap: {
		emissiveMap: { value: null },
	},

	bumpmap: {
		bumpMap: { value: null },
		bumpScale: { value: 1 },
	},

	normalmap: {
		normalMap: { value: null },
		normalScale: { value: new Vector2(1, 1) },
	},

	displacementmap: {
		displacementMap: { value: null },
		displacementScale: { value: 1 },
		displacementBias: { value: 0 },
	},

	roughnessmap: {
		roughnessMap: { value: null },
	},

	metalnessmap: {
		metalnessMap: { value: null },
	},

	gradientmap: {
		gradientMap: { value: null },
	},

	fog: {
		fogDensity: { value: 0.00025 },
		fogNear: { value: 1 },
		fogFar: { value: 2000 },
		fogColor: { value: new Color(255, 255, 255) },
	},

	lights: {
		ambientLightColor: { value: [] },

		lightProbe: { value: [] },

		directionalLights: {
			value: [],
			properties: {
				direction: {},
				color: {},
			},
		},

		directionalLightShadows: {
			value: [],
			properties: {
				shadowBias: {},
				shadowNormalBias: {},
				shadowRadius: {},
				shadowMapSize: {},
			},
		},

		directionalShadowMap: { value: [] },
		directionalShadowMatrix: { value: [] },

		spotLights: {
			value: [],
			properties: {
				color: {},
				position: {},
				direction: {},
				distance: {},
				coneCos: {},
				penumbraCos: {},
				decay: {},
			},
		},

		spotLightShadows: {
			value: [],
			properties: {
				shadowBias: {},
				shadowNormalBias: {},
				shadowRadius: {},
				shadowMapSize: {},
			},
		},

		spotShadowMap: { value: [] },
		spotShadowMatrix: { value: [] },

		pointLights: {
			value: [],
			properties: {
				color: {},
				position: {},
				decay: {},
				distance: {},
			},
		},

		pointLightShadows: {
			value: [],
			properties: {
				shadowBias: {},
				shadowNormalBias: {},
				shadowRadius: {},
				shadowMapSize: {},
				shadowCameraNear: {},
				shadowCameraFar: {},
			},
		},

		pointShadowMap: { value: [] },
		pointShadowMatrix: { value: [] },

		hemisphereLights: {
			value: [],
			properties: {
				direction: {},
				skyColor: {},
				groundColor: {},
			},
		},

		// TODO (abelnation): RectAreaLight BRDF data needs to be moved from example to main src
		rectAreaLights: {
			value: [],
			properties: {
				color: {},
				position: {},
				width: {},
				height: {},
			},
		},

		ltc_1: { value: null },
		ltc_2: { value: null },
	},

	points: {
		diffuse: { value: new Color(238, 238, 238) },
		opacity: { value: 1.0 },
		size: { value: 1.0 },
		scale: { value: 1.0 },
		map: { value: null },
		alphaMap: { value: null },
		uvTransform: { value: new Matrix3() },
	},

	sprite: {
		diffuse: { value: new Color(238, 238, 238) },
		opacity: { value: 1.0 },
		center: { value: new Vector2(0.5, 0.5) },
		rotation: { value: 0.0 },
		map: { value: null },
		alphaMap: { value: null },
		uvTransform: { value: new Matrix3() },
	},

	line: {
		worldUnits: {
			value: 1
		},
		linewidth: {
			value: 1
		},
		resolution: {
			value: new Vector2(1, 1)
		},
		dashOffset: {
			value: 0
		},
		dashScale: {
			value: 1
		},
		dashSize: {
			value: 1
		},
		gapSize: {
			value: 1
		} // TODO FIX - maybe change to totalSize

	}
};

export { UniformsLib };
