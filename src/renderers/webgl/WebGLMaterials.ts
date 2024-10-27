import { BackSide } from '../../constants';
import { Material } from '../../materials/Material';
import { MeshDistanceMaterial } from '../../materials/MeshDistanceMaterial';
import { MeshPhysicalMaterial } from '../../materials/MeshPhysicalMaterial';

/**
 * @public
 */
class WebGLMaterials {

    properties;

    constructor(properties) {
        this.properties = properties;
    }

    refreshFogUniforms(uniforms, fog) {
        uniforms.fogColor.value.copy(fog.color);

        if (fog.isFog) {
            uniforms.fogNear.value = fog.near;
            uniforms.fogFar.value = fog.far;
        } else if (fog.isFogExp2) {
            uniforms.fogDensity.value = fog.density;
        }
    }

    public refreshMaterialUniforms(
        uniforms,
        material: Material,
        pixelRatio,
        height
    ) {
        if (material.isMeshBasicMaterial) {
            this.refreshUniformsCommon(uniforms, material);
        } else if (material.isMeshLambertMaterial) {
            this.refreshUniformsCommon(uniforms, material);
            this.refreshUniformsLambert(uniforms, material);
        } else if (material.isMeshToonMaterial) {
            this.refreshUniformsCommon(uniforms, material);
            this.refreshUniformsToon(uniforms, material);
        } else if (material.isMeshPhongMaterial) {
            this.refreshUniformsCommon(uniforms, material);
            this.refreshUniformsPhong(uniforms, material);
        } else if (material.isMeshStandardMaterial) {
            this.refreshUniformsCommon(uniforms, material);
            if (material instanceof MeshPhysicalMaterial) {
                this.refreshUniformsPhysical(uniforms, material);
            } else {
                this.refreshUniformsStandard(uniforms, material);
            }
        } else if (material.isMeshMatcapMaterial) {
            this.refreshUniformsCommon(uniforms, material);
            this.refreshUniformsMatcap(uniforms, material);
        } else if (material.isMeshDepthMaterial) {
            this.refreshUniformsCommon(uniforms, material);
            this.refreshUniformsDepth(uniforms, material);
        } else if (material instanceof MeshDistanceMaterial) {
            this.refreshUniformsCommon(uniforms, material);
            this.refreshUniformsDistance(uniforms, material);
        } else if (material.isMeshNormalMaterial) {
            this.refreshUniformsCommon(uniforms, material);
            this.refreshUniformsNormal(uniforms, material);
        } else if (material.isLineBasicMaterial) {
            this.refreshUniformsLine(uniforms, material);
            if (material.isLineDashedMaterial) {
                this.refreshUniformsDash(uniforms, material);
            }
        } else if (material.isPointsMaterial) {
            this.refreshUniformsPoints(uniforms, material, pixelRatio, height);
        } else if (material.isSpriteMaterial) {
            this.refreshUniformsSprites(uniforms, material);
        } else if (material.isShadowMaterial) {
            uniforms.color.value.copy(material.color);
            uniforms.opacity.value = material.opacity;
        } else if (material.isShaderMaterial) {
            material.uniformsNeedUpdate = false; // #15581
        }
    }

    refreshUniformsCommon(uniforms, material: Material) {
        uniforms.opacity.value = material.opacity;

        if (material.color) {
            uniforms.diffuse.value.copy(material.color);
        }

        if (material.emissive) {
            uniforms.emissive.value
                .copy(material.emissive)
                .multiplyScalar(material.emissiveIntensity);
        }

        if (material.map) {
            uniforms.map.value = material.map;
        }

        if (material.alphaMap) {
            uniforms.alphaMap.value = material.alphaMap;
        }

        if (material.specularMap) {
            uniforms.specularMap.value = material.specularMap;
        }

        const { envMap } = this.properties.get(material);

        if (envMap) {
            uniforms.envMap.value = envMap;

            uniforms.flipEnvMap.value
                = envMap.isCubeTexture && envMap._needsFlipEnvMap ? -1 : 1;

            uniforms.reflectivity.value = material.reflectivity;
            uniforms.refractionRatio.value = material.refractionRatio;

            const maxMipLevel = this.properties.get(envMap).__maxMipLevel;

            if (maxMipLevel !== undefined) {
                uniforms.maxMipLevel.value = maxMipLevel;
            }
        }

        if (material.lightMap) {
            uniforms.lightMap.value = material.lightMap;
            uniforms.lightMapIntensity.value = material.lightMapIntensity;
        }

        if (material.aoMap) {
            uniforms.aoMap.value = material.aoMap;
            uniforms.aoMapIntensity.value = material.aoMapIntensity;
        }

        // uv repeat and offset setting priorities
        // 1. color map
        // 2. specular map
        // 3. displacementMap map
        // 4. normal map
        // 5. bump map
        // 6. roughnessMap map
        // 7. metalnessMap map
        // 8. alphaMap map
        // 9. emissiveMap map
        // 10. clearcoat map
        // 11. clearcoat normal map
        // 12. clearcoat roughnessMap map

        let uvScaleMap;

        if (material.map) {
            uvScaleMap = material.map;
        } else if (material.specularMap) {
            uvScaleMap = material.specularMap;
        } else if (material.displacementMap) {
            uvScaleMap = material.displacementMap;
        } else if (material.normalMap) {
            uvScaleMap = material.normalMap;
        } else if (material.bumpMap) {
            uvScaleMap = material.bumpMap;
        } else if (material.roughnessMap) {
            uvScaleMap = material.roughnessMap;
        } else if (material.metalnessMap) {
            uvScaleMap = material.metalnessMap;
        } else if (material.alphaMap) {
            uvScaleMap = material.alphaMap;
        } else if (material.emissiveMap) {
            uvScaleMap = material.emissiveMap;
        } else if (material.clearcoatMap) {
            uvScaleMap = material.clearcoatMap;
        } else if (material.clearcoatNormalMap) {
            uvScaleMap = material.clearcoatNormalMap;
        } else if (material.clearcoatRoughnessMap) {
            uvScaleMap = material.clearcoatRoughnessMap;
        }

        if (uvScaleMap !== undefined) {
            // backwards compatibility
            if (uvScaleMap.isWebGLRenderTarget) {
                uvScaleMap = uvScaleMap.texture;
            }

            if (uvScaleMap.matrixAutoUpdate === true) {
                uvScaleMap.updateMatrix();
            }

            uniforms.uvTransform.value.copy(uvScaleMap.matrix);
        }

        // uv repeat and offset setting priorities for uv2
        // 1. ao map
        // 2. light map

        let uv2ScaleMap;

        if (material.aoMap) {
            uv2ScaleMap = material.aoMap;
        } else if (material.lightMap) {
            uv2ScaleMap = material.lightMap;
        }

        if (uv2ScaleMap !== undefined) {
            // backwards compatibility
            if (uv2ScaleMap.isWebGLRenderTarget) {
                uv2ScaleMap = uv2ScaleMap.texture;
            }

            if (uv2ScaleMap.matrixAutoUpdate === true) {
                uv2ScaleMap.updateMatrix();
            }

            uniforms.uv2Transform.value.copy(uv2ScaleMap.matrix);
        }
    }

    refreshUniformsLine(uniforms, material: Material) {
        uniforms.diffuse.value.copy(material.color);
        uniforms.opacity.value = material.opacity;
    }

    refreshUniformsDash(uniforms, material: Material) {
        uniforms.dashSize.value = material.dashSize;
        uniforms.totalSize.value = material.dashSize + material.gapSize;
        uniforms.scale.value = material.scale;
    }

    refreshUniformsPoints(uniforms, material: Material, pixelRatio, height) {
        uniforms.diffuse.value.copy(material.color);
        uniforms.opacity.value = material.opacity;
        uniforms.size.value = material.size * pixelRatio;
        uniforms.scale.value = height * 0.5;

        if (material.map) {
            uniforms.map.value = material.map;
        }

        if (material.alphaMap) {
            uniforms.alphaMap.value = material.alphaMap;
        }

        // uv repeat and offset setting priorities
        // 1. color map
        // 2. alpha map

        let uvScaleMap;

        if (material.map) {
            uvScaleMap = material.map;
        } else if (material.alphaMap) {
            uvScaleMap = material.alphaMap;
        }

        if (uvScaleMap !== undefined) {
            if (uvScaleMap.matrixAutoUpdate === true) {
                uvScaleMap.updateMatrix();
            }

            uniforms.uvTransform.value.copy(uvScaleMap.matrix);
        }
    }

    refreshUniformsSprites(uniforms, material: Material) {
        uniforms.diffuse.value.copy(material.color);
        uniforms.opacity.value = material.opacity;
        uniforms.rotation.value = material.rotation;

        if (material.map) {
            uniforms.map.value = material.map;
        }

        if (material.alphaMap) {
            uniforms.alphaMap.value = material.alphaMap;
        }

        // uv repeat and offset setting priorities
        // 1. color map
        // 2. alpha map

        let uvScaleMap;

        if (material.map) {
            uvScaleMap = material.map;
        } else if (material.alphaMap) {
            uvScaleMap = material.alphaMap;
        }

        if (uvScaleMap !== undefined) {
            if (uvScaleMap.matrixAutoUpdate === true) {
                uvScaleMap.updateMatrix();
            }

            uniforms.uvTransform.value.copy(uvScaleMap.matrix);
        }
    }

    refreshUniformsLambert(uniforms, material: Material) {
        if (material.emissiveMap) {
            uniforms.emissiveMap.value = material.emissiveMap;
        }
    }

    refreshUniformsPhong(uniforms, material: Material) {
        uniforms.specular.value.copy(material.specular);
        uniforms.shininess.value = Math.max(material.shininess, 1e-4); // to prevent pow( 0.0, 0.0 )

        if (material.emissiveMap) {
            uniforms.emissiveMap.value = material.emissiveMap;
        }

        if (material.bumpMap) {
            uniforms.bumpMap.value = material.bumpMap;
            uniforms.bumpScale.value = material.bumpScale;
            if (material.side === BackSide) { uniforms.bumpScale.value *= -1; }
        }

        if (material.normalMap) {
            uniforms.normalMap.value = material.normalMap;
            uniforms.normalScale.value.copy(material.normalScale);
            if (material.side === BackSide) { uniforms.normalScale.value.negate(); }
        }

        if (material.displacementMap) {
            uniforms.displacementMap.value = material.displacementMap;
            uniforms.displacementScale.value = material.displacementScale;
            uniforms.displacementBias.value = material.displacementBias;
        }
    }

    refreshUniformsToon(uniforms, material: Material) {
        if (material.gradientMap) {
            uniforms.gradientMap.value = material.gradientMap;
        }

        if (material.emissiveMap) {
            uniforms.emissiveMap.value = material.emissiveMap;
        }

        if (material.bumpMap) {
            uniforms.bumpMap.value = material.bumpMap;
            uniforms.bumpScale.value = material.bumpScale;
            if (material.side === BackSide) { uniforms.bumpScale.value *= -1; }
        }

        if (material.normalMap) {
            uniforms.normalMap.value = material.normalMap;
            uniforms.normalScale.value.copy(material.normalScale);
            if (material.side === BackSide) { uniforms.normalScale.value.negate(); }
        }

        if (material.displacementMap) {
            uniforms.displacementMap.value = material.displacementMap;
            uniforms.displacementScale.value = material.displacementScale;
            uniforms.displacementBias.value = material.displacementBias;
        }
    }

    refreshUniformsStandard(uniforms, material: Material) {
        uniforms.roughness.value = material.roughness;
        uniforms.metalness.value = material.metalness;

        if (material.roughnessMap) {
            uniforms.roughnessMap.value = material.roughnessMap;
        }

        if (material.metalnessMap) {
            uniforms.metalnessMap.value = material.metalnessMap;
        }

        if (material.emissiveMap) {
            uniforms.emissiveMap.value = material.emissiveMap;
        }

        if (material.bumpMap) {
            uniforms.bumpMap.value = material.bumpMap;
            uniforms.bumpScale.value = material.bumpScale;
            if (material.side === BackSide) { uniforms.bumpScale.value *= -1; }
        }

        if (material.normalMap) {
            uniforms.normalMap.value = material.normalMap;
            uniforms.normalScale.value.copy(material.normalScale);
            if (material.side === BackSide) { uniforms.normalScale.value.negate(); }
        }

        if (material.displacementMap) {
            uniforms.displacementMap.value = material.displacementMap;
            uniforms.displacementScale.value = material.displacementScale;
            uniforms.displacementBias.value = material.displacementBias;
        }

        const { envMap } = this.properties.get(material);

        if (envMap) {
            // uniforms.envMap.value = material.envMap; // part of uniforms common
            uniforms.envMapIntensity.value = material.envMapIntensity;
        }
    }

    refreshUniformsPhysical(uniforms, material: MeshPhysicalMaterial) {
        this.refreshUniformsStandard(uniforms, material);

        uniforms.reflectivity.value = material.reflectivity; // also part of uniforms common

        uniforms.clearcoat.value = material.clearcoat;
        uniforms.clearcoatRoughness.value = material.clearcoatRoughness;
        if (material.sheen) { uniforms.sheen.value.copy(material.sheen); }

        if (material.clearcoatMap) {
            uniforms.clearcoatMap.value = material.clearcoatMap;
        }

        if (material.clearcoatRoughnessMap) {
            uniforms.clearcoatRoughnessMap.value
                = material.clearcoatRoughnessMap;
        }

        if (material.clearcoatNormalMap) {
            uniforms.clearcoatNormalScale.value.copy(
                material.clearcoatNormalScale
            );
            uniforms.clearcoatNormalMap.value = material.clearcoatNormalMap;

            if (material.side === BackSide) {
                uniforms.clearcoatNormalScale.value.negate();
            }
        }

        uniforms.transmission.value = material.transmission;

        if (material.transmissionMap) {
            uniforms.transmissionMap.value = material.transmissionMap;
        }
    }

    refreshUniformsMatcap(uniforms, material: Material) {
        if (material.matcap) {
            uniforms.matcap.value = material.matcap;
        }

        if (material.bumpMap) {
            uniforms.bumpMap.value = material.bumpMap;
            uniforms.bumpScale.value = material.bumpScale;
            if (material.side === BackSide) { uniforms.bumpScale.value *= -1; }
        }

        if (material.normalMap) {
            uniforms.normalMap.value = material.normalMap;
            uniforms.normalScale.value.copy(material.normalScale);
            if (material.side === BackSide) { uniforms.normalScale.value.negate(); }
        }

        if (material.displacementMap) {
            uniforms.displacementMap.value = material.displacementMap;
            uniforms.displacementScale.value = material.displacementScale;
            uniforms.displacementBias.value = material.displacementBias;
        }
    }

    refreshUniformsDepth(uniforms, material: Material) {
        if (material.displacementMap) {
            uniforms.displacementMap.value = material.displacementMap;
            uniforms.displacementScale.value = material.displacementScale;
            uniforms.displacementBias.value = material.displacementBias;
        }
    }

    refreshUniformsDistance(uniforms, material: MeshDistanceMaterial) {
        if (material.displacementMap) {
            uniforms.displacementMap.value = material.displacementMap;
            uniforms.displacementScale.value = material.displacementScale;
            uniforms.displacementBias.value = material.displacementBias;
        }

        uniforms.referencePosition.value.copy(material.referencePosition);
        uniforms.nearDistance.value = material.nearDistance;
        uniforms.farDistance.value = material.farDistance;
    }

    refreshUniformsNormal(uniforms, material: Material) {
        if (material.bumpMap) {
            uniforms.bumpMap.value = material.bumpMap;
            uniforms.bumpScale.value = material.bumpScale;
            if (material.side === BackSide) { uniforms.bumpScale.value *= -1; }
        }

        if (material.normalMap) {
            uniforms.normalMap.value = material.normalMap;
            uniforms.normalScale.value.copy(material.normalScale);
            if (material.side === BackSide) { uniforms.normalScale.value.negate(); }
        }

        if (material.displacementMap) {
            uniforms.displacementMap.value = material.displacementMap;
            uniforms.displacementScale.value = material.displacementScale;
            uniforms.displacementBias.value = material.displacementBias;
        }
    }

}

export { WebGLMaterials };