import { Light } from '../../lights/Light';
import { LightProbe } from '../../lights/LightProbe';
import { Color } from '../../math/Color';
import { Matrix4 } from '../../math/Matrix4';
import { Vector2 } from '../../math/Vector2';
import { Vector3 } from '../../math/Vector3';
import { Texture } from '../../textures/Texture';
import { UniformsLib } from '../shaders/UniformsLib';
import { WebGLCapabilities } from './WebGLCapabilities';
import { WebGLExtensions } from './WebGLExtensions';

/**
 * @public
 */
type GLUniform = {
    direction?: Vector3;
    color?: Color;
    position?: Vector3;
    distance?: number;
    coneCos?: number;
    penumbraCos?: number;
    decay?: number;
    skyColor?: Color;
    groundColor?: Color;
    halfWidth?: Vector3;
    halfHeight?: Vector3;
};

/**
 * @public
 */
class UniformsCache {

    lights: { [key: string]: GLUniform };

    constructor() {
        this.lights = {};
    }

    get(light: Light): GLUniform {
        if (this.lights[light.id] !== undefined) {
            return this.lights[light.id];
        }

        let uniforms: GLUniform;

        switch (light.type) {
            case 'DirectionalLight':
                uniforms = {
                    direction: new Vector3(),
                    color: new Color(0, 0, 0)
                };
                break;

            case 'SpotLight':
                uniforms = {
                    position: new Vector3(),
                    direction: new Vector3(),
                    color: new Color(0, 0, 0),
                    distance: 0,
                    coneCos: 0,
                    penumbraCos: 0,
                    decay: 0
                };
                break;

            case 'PointLight':
                uniforms = {
                    position: new Vector3(),
                    color: new Color(0, 0, 0),
                    distance: 0,
                    decay: 0
                };
                break;

            case 'HemisphereLight':
                uniforms = {
                    direction: new Vector3(),
                    skyColor: new Color(0, 0, 0),
                    groundColor: new Color(0, 0, 0)
                };
                break;

            case 'RectAreaLight':
                uniforms = {
                    color: new Color(0, 0, 0),
                    position: new Vector3(),
                    halfWidth: new Vector3(),
                    halfHeight: new Vector3()
                };
                break;
        }

        this.lights[light.id] = uniforms;

        return uniforms;
    }

}

/**
 * @public
 */
type GLShadowUniform = {
    shadowBias: number;
    shadowNormalBias: number;
    shadowRadius: number;
    shadowMapSize: Vector2;
    shadowCameraNear?: number;
    shadowCameraFar?: number;
};

/**
 * @public
 */
class ShadowUniformsCache {

    lights: { [key: string]: GLShadowUniform };

    constructor() {
        this.lights = {};
    }

    get(light: Light): GLShadowUniform {
        if (this.lights[light.id] !== undefined) {
            return this.lights[light.id];
        }

        let uniforms: GLShadowUniform;

        switch (light.type) {
            case 'DirectionalLight':
                uniforms = {
                    shadowBias: 0,
                    shadowNormalBias: 0,
                    shadowRadius: 1,
                    shadowMapSize: new Vector2()
                };
                break;

            case 'SpotLight':
                uniforms = {
                    shadowBias: 0,
                    shadowNormalBias: 0,
                    shadowRadius: 1,
                    shadowMapSize: new Vector2()
                };
                break;

            case 'PointLight':
                uniforms = {
                    shadowBias: 0,
                    shadowNormalBias: 0,
                    shadowRadius: 1,
                    shadowMapSize: new Vector2(),
                    shadowCameraNear: 1,
                    shadowCameraFar: 1000
                };
                break;

            // TODO (abelnation): set RectAreaLight shadow uniforms
        }

        this.lights[light.id] = uniforms;

        return uniforms;
    }

}

let nextVersion = 0;

function shadowCastingLightsFirst(lightA, lightB) {
    return (lightB.castShadow ? 1 : 0) - (lightA.castShadow ? 1 : 0);
}

/**
 * @public
 */
class WebGLLights {

    _extensions: WebGLExtensions;
    _capabilities: WebGLCapabilities;

    cache = new UniformsCache();

    shadowCache = new ShadowUniformsCache();

    // TODO typization
    state = {
        version: 0,

        hash: {
            directionalLength: -1,
            pointLength: -1,
            spotLength: -1,
            rectAreaLength: -1,
            hemiLength: -1,

            numDirectionalShadows: -1,
            numPointShadows: -1,
            numSpotShadows: -1
        },

        ambient: [] as number[],
        probe: [] as Vector3[],
        directional: [] as GLUniform[],
        directionalShadow: [] as GLShadowUniform[],
        directionalShadowMap: [] as Texture[],
        directionalShadowMatrix: [] as Matrix4[],
        spot: [] as GLUniform[],
        spotShadow: [] as GLShadowUniform[],
        spotShadowMap: [] as Texture[],
        spotShadowMatrix: [] as Matrix4[],
        rectArea: [] as GLUniform[],
        rectAreaLTC1: null,
        rectAreaLTC2: null,
        point: [] as GLUniform[],
        pointShadow: [] as GLShadowUniform[],
        pointShadowMap: [] as Texture[],
        pointShadowMatrix: [] as Matrix4[],
        hemi: [] as GLUniform[]
    };

    vector3 = new Vector3();
    matrix4 = new Matrix4();
    matrix42 = new Matrix4();

    constructor(extensions: WebGLExtensions, capabilities: WebGLCapabilities) {
        this._extensions = extensions;
        this._capabilities = capabilities;

        for (let i = 0; i < 9; i++) {
            this.state.probe.push(new Vector3());
        }
    }

    setup(lights: Light[]) {
        let r = 0;
        let g = 0;
        let b = 0;

        for (let i = 0; i < 9; i++) { this.state.probe[i].set(0, 0, 0); }

        let directionalLength = 0;
        let pointLength = 0;
        let spotLength = 0;
        let rectAreaLength = 0;
        let hemiLength = 0;

        let numDirectionalShadows = 0;
        let numPointShadows = 0;
        let numSpotShadows = 0;

        lights.sort(shadowCastingLightsFirst);

        for (let i = 0, l = lights.length; i < l; i++) {
            const light = lights[i];

            const { color } = light;
            const { intensity } = light;
            const { distance } = light;

            const shadowMap
                = light.shadow && light.shadow.map
                    ? light.shadow.map.texture
                    : null;

            if (light.isAmbientLight) {
                r += color.r * intensity;
                g += color.g * intensity;
                b += color.b * intensity;
            } else if (light.isLightProbe) {
                for (let j = 0; j < 9; j++) {
                    this.state.probe[j].addScaledVector(
                        (light as LightProbe).sh.coefficients[j],
                        intensity
                    );
                }
            } else if (light.isDirectionalLight) {
                const uniforms = this.cache.get(light);

                uniforms.color
                    .copy(light.color)
                    .multiplyScalar(light.intensity);

                if (light.castShadow) {
                    const { shadow } = light;

                    const shadowUniforms = this.shadowCache.get(light);

                    shadowUniforms.shadowBias = shadow.bias;
                    shadowUniforms.shadowNormalBias = shadow.normalBias;
                    shadowUniforms.shadowRadius = shadow.radius;
                    shadowUniforms.shadowMapSize = shadow.mapSize;

                    this.state.directionalShadow[directionalLength]
                        = shadowUniforms;
                    this.state.directionalShadowMap[directionalLength]
                        = shadowMap;
                    this.state.directionalShadowMatrix[directionalLength]
                        = light.shadow.matrix;

                    numDirectionalShadows++;
                }

                this.state.directional[directionalLength] = uniforms;

                directionalLength++;
            } else if (light.isSpotLight) {
                const uniforms = this.cache.get(light);

                uniforms.position.setFromMatrixPosition(light.matrixWorld);

                uniforms.color.copy(color).multiplyScalar(intensity);
                uniforms.distance = distance;

                uniforms.coneCos = Math.cos(light.angle);
                uniforms.penumbraCos = Math.cos(
                    light.angle * (1 - light.penumbra)
                );
                uniforms.decay = light.decay;

                if (light.castShadow) {
                    const { shadow } = light;

                    const shadowUniforms = this.shadowCache.get(light);

                    shadowUniforms.shadowBias = shadow.bias;
                    shadowUniforms.shadowNormalBias = shadow.normalBias;
                    shadowUniforms.shadowRadius = shadow.radius;
                    shadowUniforms.shadowMapSize = shadow.mapSize;

                    this.state.spotShadow[spotLength] = shadowUniforms;
                    this.state.spotShadowMap[spotLength] = shadowMap;
                    this.state.spotShadowMatrix[spotLength]
                        = light.shadow.matrix;

                    numSpotShadows++;
                }

                this.state.spot[spotLength] = uniforms;

                spotLength++;
            } else if (light.isRectAreaLight) {
                const uniforms = this.cache.get(light);

                // (a) intensity is the total visible light emitted
                // uniforms.color.copy( color ).multiplyScalar( intensity / ( light.width * light.height * Math.PI ) );

                // (b) intensity is the brightness of the light
                uniforms.color.copy(color).multiplyScalar(intensity);

                uniforms.halfWidth.set(light.width * 0.5, 0.0, 0.0);
                uniforms.halfHeight.set(0.0, light.height * 0.5, 0.0);

                this.state.rectArea[rectAreaLength] = uniforms;

                rectAreaLength++;
            } else if (light.isPointLight) {
                const uniforms = this.cache.get(light);

                uniforms.color
                    .copy(light.color)
                    .multiplyScalar(light.intensity);
                uniforms.distance = light.distance;
                uniforms.decay = light.decay;

                if (light.castShadow) {
                    const { shadow } = light;

                    const shadowUniforms = this.shadowCache.get(light);

                    shadowUniforms.shadowBias = shadow.bias;
                    shadowUniforms.shadowNormalBias = shadow.normalBias;
                    shadowUniforms.shadowRadius = shadow.radius;
                    shadowUniforms.shadowMapSize = shadow.mapSize;
                    shadowUniforms.shadowCameraNear = shadow.camera.near;
                    shadowUniforms.shadowCameraFar = shadow.camera.far;

                    this.state.pointShadow[pointLength] = shadowUniforms;
                    this.state.pointShadowMap[pointLength] = shadowMap;
                    this.state.pointShadowMatrix[pointLength]
                        = light.shadow.matrix;

                    numPointShadows++;
                }

                this.state.point[pointLength] = uniforms;

                pointLength++;
            } else if (light.isHemisphereLight) {
                const uniforms = this.cache.get(light);

                uniforms.skyColor.copy(light.color).multiplyScalar(intensity);
                uniforms.groundColor
                    .copy(light.groundColor)
                    .multiplyScalar(intensity);

                this.state.hemi[hemiLength] = uniforms;

                hemiLength++;
            }
        }

        if (rectAreaLength > 0) {
            if (this._capabilities.isWebGL2) {
                // WebGL 2

                this.state.rectAreaLTC1 = UniformsLib.LTC_FLOAT_1;
                this.state.rectAreaLTC2 = UniformsLib.LTC_FLOAT_2;
            } else if (this._extensions.has('OES_texture_float_linear')) {
                // WebGL 1
                this.state.rectAreaLTC1 = UniformsLib.LTC_FLOAT_1;
                this.state.rectAreaLTC2 = UniformsLib.LTC_FLOAT_2;
            } else if (
                this._extensions.has('OES_texture_half_float_linear')
            ) {
                // WebGL 1
                this.state.rectAreaLTC1 = UniformsLib.LTC_HALF_1;
                this.state.rectAreaLTC2 = UniformsLib.LTC_HALF_2;
            } else {
                console.error(
                    'WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.'
                );
            }
        }

        this.state.ambient[0] = r;
        this.state.ambient[1] = g;
        this.state.ambient[2] = b;

        const { hash } = this.state;

        if (
            hash.directionalLength !== directionalLength
            || hash.pointLength !== pointLength
            || hash.spotLength !== spotLength
            || hash.rectAreaLength !== rectAreaLength
            || hash.hemiLength !== hemiLength
            || hash.numDirectionalShadows !== numDirectionalShadows
            || hash.numPointShadows !== numPointShadows
            || hash.numSpotShadows !== numSpotShadows
        ) {
            this.state.directional.length = directionalLength;
            this.state.spot.length = spotLength;
            this.state.rectArea.length = rectAreaLength;
            this.state.point.length = pointLength;
            this.state.hemi.length = hemiLength;

            this.state.directionalShadow.length = numDirectionalShadows;
            this.state.directionalShadowMap.length = numDirectionalShadows;
            this.state.pointShadow.length = numPointShadows;
            this.state.pointShadowMap.length = numPointShadows;
            this.state.spotShadow.length = numSpotShadows;
            this.state.spotShadowMap.length = numSpotShadows;
            this.state.directionalShadowMatrix.length = numDirectionalShadows;
            this.state.pointShadowMatrix.length = numPointShadows;
            this.state.spotShadowMatrix.length = numSpotShadows;

            hash.directionalLength = directionalLength;
            hash.pointLength = pointLength;
            hash.spotLength = spotLength;
            hash.rectAreaLength = rectAreaLength;
            hash.hemiLength = hemiLength;

            hash.numDirectionalShadows = numDirectionalShadows;
            hash.numPointShadows = numPointShadows;
            hash.numSpotShadows = numSpotShadows;

            this.state.version = nextVersion++;
        }
    }

    setupView(lights, camera) {
        let directionalLength = 0;
        let pointLength = 0;
        let spotLength = 0;
        let rectAreaLength = 0;
        let hemiLength = 0;

        const viewMatrix = camera.matrixWorldInverse;

        for (let i = 0, l = lights.length; i < l; i++) {
            const light = lights[i];

            if (light.isDirectionalLight) {
                const uniforms = this.state.directional[directionalLength];

                uniforms.direction.setFromMatrixPosition(light.matrixWorld);
                this.vector3.setFromMatrixPosition(light.target.matrixWorld);
                uniforms.direction.sub(this.vector3);
                uniforms.direction.transformDirection(viewMatrix);

                directionalLength++;
            } else if (light.isSpotLight) {
                const uniforms = this.state.spot[spotLength];

                uniforms.position.setFromMatrixPosition(light.matrixWorld);
                uniforms.position.applyMatrix4(viewMatrix);

                uniforms.direction.setFromMatrixPosition(light.matrixWorld);
                this.vector3.setFromMatrixPosition(light.target.matrixWorld);
                uniforms.direction.sub(this.vector3);
                uniforms.direction.transformDirection(viewMatrix);

                spotLength++;
            } else if (light.isRectAreaLight) {
                const uniforms = this.state.rectArea[rectAreaLength];

                uniforms.position.setFromMatrixPosition(light.matrixWorld);
                uniforms.position.applyMatrix4(viewMatrix);

                // extract local rotation of light to derive width/height half vectors
                this.matrix42.identity();
                this.matrix4.copy(light.matrixWorld);
                this.matrix4.premultiply(viewMatrix);
                this.matrix42.extractRotation(this.matrix4);

                uniforms.halfWidth.set(light.width * 0.5, 0.0, 0.0);
                uniforms.halfHeight.set(0.0, light.height * 0.5, 0.0);

                uniforms.halfWidth.applyMatrix4(this.matrix42);
                uniforms.halfHeight.applyMatrix4(this.matrix42);

                rectAreaLength++;
            } else if (light.isPointLight) {
                const uniforms = this.state.point[pointLength];

                uniforms.position.setFromMatrixPosition(light.matrixWorld);
                uniforms.position.applyMatrix4(viewMatrix);

                pointLength++;
            } else if (light.isHemisphereLight) {
                const uniforms = this.state.hemi[hemiLength];

                uniforms.direction.setFromMatrixPosition(light.matrixWorld);
                uniforms.direction.transformDirection(viewMatrix);
                uniforms.direction.normalize();

                hemiLength++;
            }
        }
    }

}

export { WebGLLights };
