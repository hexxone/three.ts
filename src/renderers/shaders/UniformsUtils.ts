/**
 * Uniform Utilities
 */

import { IUniformType } from '../../materials/ShaderMaterial';
import { Color } from '../../math/Color';
import { Matrix3 } from '../../math/Matrix3';
import { Matrix4 } from '../../math/Matrix4';
import { Quaternion } from '../../math/Quaternion';
import { Vector2 } from '../../math/Vector2';
import { Vector3 } from '../../math/Vector3';
import { Vector4 } from '../../math/Vector4';

export function cloneUniforms(src: IUniformType) {
    const dst: IUniformType = {};

    for (const u in src) {
        dst[u] = {
            value: null
        };

        for (const p in src[u]) {
            const property = src[u][p];

            if (property instanceof Color) {
                dst[u][p] = (property as Color).clone();
            } else if (property instanceof Matrix3) {
                dst[u][p] = (property as Matrix3).clone();
            } else if (property instanceof Matrix4) {
                dst[u][p] = (property as Matrix4).clone();
            } else if (property instanceof Vector2) {
                dst[u][p] = (property as Vector2).clone();
            } else if (property instanceof Vector3) {
                dst[u][p] = (property as Vector3).clone();
            } else if (property instanceof Vector4) {
                dst[u][p] = (property as Vector4).clone();
            } else if (property instanceof Quaternion) {
                dst[u][p] = (property as Quaternion).clone();
            } else if (Array.isArray(property)) {
                dst[u][p] = property.slice();
            } else {
                dst[u][p] = property;
            }
        }
    }

    return dst;
}

export function mergeUniforms(uniforms: IUniformType[]) {
    const merged = {};

    for (let u = 0; u < uniforms.length; u++) {
        const tmp = cloneUniforms(uniforms[u]);

        for (const p in tmp) {
            merged[p] = tmp[p];
        }
    }

    return merged;
}

// Legacy

const UniformsUtils = {
    clone: cloneUniforms,
    merge: mergeUniforms
};

export { UniformsUtils };
