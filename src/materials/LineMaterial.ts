import { ShaderLib } from '../renderers/shaders/ShaderLib';
import { cloneUniforms } from '../renderers/shaders/UniformsUtils';
import { ShaderMaterial } from './ShaderMaterial';

/**
 * parameters = {
 *  color: <hex>,
 *  linewidth: <float>,
 *  dashed: <boolean>,
 *  dashScale: <float>,
 *  dashSize: <float>,
 *  dashOffset: <float>,
 *  gapSize: <float>,
 *  resolution: <Vector2>, // to be set by renderer
 * }
 */
export class LineMaterial extends ShaderMaterial {

    isLineMaterial = true;

    dashed: boolean;
    dashScale: number;
    dashOffset: number;

    constructor() {
        super();

        (this.type = 'LineMaterial'),
        (this.uniforms = cloneUniforms(ShaderLib.line.uniforms)),
        (this.vertexShader = ShaderLib.line.vertexShader),
        (this.fragmentShader = ShaderLib.line.fragmentShader),
        (this.clipping = true); // required for clipping support

        Object.defineProperties(this, {
            color: {
                enumerable: true,
                get() {
                    return this.uniforms.diffuse.value;
                },
                set(value) {
                    this.uniforms.diffuse.value = value;
                }
            },
            worldUnits: {
                enumerable: true,
                get() {
                    return 'WORLD_UNITS' in this.defines;
                },
                set(value) {
                    if (value === true) {
                        this.defines.WORLD_UNITS = '';
                    } else {
                        delete this.defines.WORLD_UNITS;
                    }
                }
            },
            linewidth: {
                enumerable: true,
                get() {
                    return this.uniforms.linewidth.value;
                },
                set(value) {
                    this.uniforms.linewidth.value = value;
                }
            },
            dashed: {
                enumerable: true,
                get() {
                    return Boolean('USE_DASH' in this.defines);
                },

                set(value) {
                    if (
                        Boolean(value) !== Boolean('USE_DASH' in this.defines)
                    ) {
                        this.needsUpdate = true;
                    }

                    if (value === true) {
                        this.defines.USE_DASH = '';
                    } else {
                        delete this.defines.USE_DASH;
                    }
                }
            },
            dashScale: {
                enumerable: true,
                get() {
                    return this.uniforms.dashScale.value;
                },
                set(value) {
                    this.uniforms.dashScale.value = value;
                }
            },
            dashSize: {
                enumerable: true,
                get() {
                    return this.uniforms.dashSize.value;
                },
                set(value) {
                    this.uniforms.dashSize.value = value;
                }
            },
            dashOffset: {
                enumerable: true,
                get() {
                    return this.uniforms.dashOffset.value;
                },
                set(value) {
                    this.uniforms.dashOffset.value = value;
                }
            },
            gapSize: {
                enumerable: true,
                get() {
                    return this.uniforms.gapSize.value;
                },
                set(value) {
                    this.uniforms.gapSize.value = value;
                }
            },
            opacity: {
                enumerable: true,
                get() {
                    return this.uniforms.opacity.value;
                },
                set(value) {
                    this.uniforms.opacity.value = value;
                }
            },
            resolution: {
                enumerable: true,
                get() {
                    return this.uniforms.resolution.value;
                },
                set(value) {
                    this.uniforms.resolution.value.copy(value);
                }
            },
            alphaToCoverage: {
                enumerable: true,
                get() {
                    return Boolean('USE_ALPHA_TO_COVERAGE' in this.defines);
                },
                set(value) {
                    if (
                        Boolean(value)
                        !== Boolean('USE_ALPHA_TO_COVERAGE' in this.defines)
                    ) {
                        this.needsUpdate = true;
                    }

                    if (value === true) {
                        this.defines.USE_ALPHA_TO_COVERAGE = '';
                        this.extensions.derivatives = true;
                    } else {
                        delete this.defines.USE_ALPHA_TO_COVERAGE;
                        this.extensions.derivatives = false;
                    }
                }
            }
        });
    }

}
