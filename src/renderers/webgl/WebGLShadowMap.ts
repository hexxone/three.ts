import { Camera } from '../../cameras/Camera';
import { BackSide,
    DoubleSide,
    FrontSide,
    LinearFilter,
    NearestFilter,
    NoBlending,
    PCFShadowMap,
    RGBADepthPacking,
    RGBAFormat,
    VSMShadowMap } from '../../constants';
import { BufferAttribute } from '../../core/BufferAttribute';
import { BufferGeometry } from '../../core/BufferGeometry';
import { Object3D } from '../../core/Object3D';
import { Light } from '../../lights/Light';
import { LightShadow } from '../../lights/LightShadow';
import { Material } from '../../materials/Material';
import { MeshDepthMaterial } from '../../materials/MeshDepthMaterial';
import { MeshDistanceMaterial } from '../../materials/MeshDistanceMaterial';
import { ShaderMaterial } from '../../materials/ShaderMaterial';
import { Frustum } from '../../math/Frustum';
import { Vector2 } from '../../math/Vector2';
import { Vector4 } from '../../math/Vector4';
import { Mesh } from '../../objects/Mesh';
import vsm_frag from '../shaders/ShaderLib/vsm_frag.glsl';
import vsm_vert from '../shaders/ShaderLib/vsm_vert.glsl';
import { WebGLRenderer } from '../WebGLRenderer';
import { WebGLRenderTarget } from '../WebGLRenderTarget';
import { WebGLObjects } from './WebGLObjects';

class WebGLShadowMap {

    _renderer: WebGLRenderer;
    _objects: WebGLObjects;
    _maxTextureSize: number;

    _frustum = new Frustum();

    _shadowMapSize = new Vector2();
    _viewportSize = new Vector2();

    _viewport = new Vector4();

    _depthMaterials: MeshDepthMaterial[] = [];
    _distanceMaterials: MeshDistanceMaterial[] = [];

    _materialCache: { [uuid: string]: { [key: string]: Material } } = {};

    shadowSide = {
        0: BackSide,
        1: FrontSide,
        2: DoubleSide
    };

    shadowMaterialVertical: ShaderMaterial;
    shadowMaterialHorizontal: ShaderMaterial;

    fullScreenMesh: Mesh;
    enabled = false;
    autoUpdate = true;
    needsUpdate = false;
    type = PCFShadowMap;

    constructor(
        _renderer: WebGLRenderer,
        _objects: WebGLObjects,
        maxTextureSize: number
    ) {
        this._renderer = _renderer;
        this._objects = _objects;
        this._maxTextureSize = maxTextureSize;

        this.shadowMaterialVertical = new ShaderMaterial();
        this.shadowMaterialVertical.defines = {
            SAMPLE_RATE: 2.0 / 8.0,
            HALF_SAMPLE_RATE: 1.0 / 8.0
        };
        this.shadowMaterialVertical.uniforms = {
            shadow_pass: {
                value: null
            },
            resolution: {
                value: new Vector2()
            },
            radius: {
                value: 4.0
            }
        };
        this.shadowMaterialVertical.vertexShader = vsm_vert;
        this.shadowMaterialVertical.fragmentShader = vsm_frag;

        this.shadowMaterialHorizontal
            = this.shadowMaterialVertical.clone() as ShaderMaterial;
        this.shadowMaterialHorizontal.defines.HORIZONTAL_PASS = 1;

        const fullScreenTri = new BufferGeometry();

        fullScreenTri.setAttribute(
            'position',
            new BufferAttribute(
                new Float32Array([-1, -1, 0.5, 3, -1, 0.5, -1, 3, 0.5]),
                3
            )
        );

        this.fullScreenMesh = new Mesh(
            fullScreenTri,
            this.shadowMaterialVertical
        );
    }

    render(lights: Light[], scene: Object3D, camera: Camera) {
        if (this.enabled === false) { return; }
        if (this.autoUpdate === false && this.needsUpdate === false) { return; }

        if (lights.length === 0) { return; }

        const currentRenderTarget = this._renderer.getRenderTarget();
        const activeCubeFace = this._renderer.getActiveCubeFace();
        const activeMipmapLevel = this._renderer.getActiveMipmapLevel();

        const _state = this._renderer.state;

        // Set GL state for depth map.
        _state.setBlending(NoBlending);
        _state.colorBuffer.setClear(1, 1, 1, 1);
        _state.depthBuffer.setTest(true);
        _state.setScissorTest(false);

        // render depth map

        for (let i = 0, il = lights.length; i < il; i++) {
            const light = lights[i];
            const { shadow } = light;

            if (shadow === undefined) {
                console.warn('WebGLShadowMap:', light, 'has no shadow.');
                continue;
            }

            if (shadow.autoUpdate === false && shadow.needsUpdate === false) { continue; }

            this._shadowMapSize.copy(shadow.mapSize);

            const shadowFrameExtents = shadow.getFrameExtents();

            this._shadowMapSize.multiply(shadowFrameExtents);

            this._viewportSize.copy(shadow.mapSize);

            if (
                this._shadowMapSize.x > this._maxTextureSize
                || this._shadowMapSize.y > this._maxTextureSize
            ) {
                if (this._shadowMapSize.x > this._maxTextureSize) {
                    this._viewportSize.x = Math.floor(
                        this._maxTextureSize / shadowFrameExtents.x
                    );
                    this._shadowMapSize.x
                        = this._viewportSize.x * shadowFrameExtents.x;
                    shadow.mapSize.x = this._viewportSize.x;
                }

                if (this._shadowMapSize.y > this._maxTextureSize) {
                    this._viewportSize.y = Math.floor(
                        this._maxTextureSize / shadowFrameExtents.y
                    );
                    this._shadowMapSize.y
                        = this._viewportSize.y * shadowFrameExtents.y;
                    shadow.mapSize.y = this._viewportSize.y;
                }
            }

            if (
                shadow.map === null
                && !shadow.isPointLightShadow
                && this.type === VSMShadowMap
            ) {
                const pars = {
                    minFilter: LinearFilter,
                    magFilter: LinearFilter,
                    format: RGBAFormat
                };

                shadow.map = new WebGLRenderTarget(
                    this._shadowMapSize.x,
                    this._shadowMapSize.y,
                    pars
                );
                shadow.map.texture.name = `${light.name}.shadowMap`;

                shadow.mapPass = new WebGLRenderTarget(
                    this._shadowMapSize.x,
                    this._shadowMapSize.y,
                    pars
                );

                shadow.camera.updateProjectionMatrix();
            }

            if (shadow.map === null) {
                const pars = {
                    minFilter: NearestFilter,
                    magFilter: NearestFilter,
                    format: RGBAFormat
                };

                shadow.map = new WebGLRenderTarget(
                    this._shadowMapSize.x,
                    this._shadowMapSize.y,
                    pars
                );
                shadow.map.texture.name = `${light.name}.shadowMap`;

                shadow.camera.updateProjectionMatrix();
            }

            this._renderer.setRenderTarget(shadow.map);
            this._renderer.clear();

            const viewportCount = shadow.getViewportCount();

            for (let vp = 0; vp < viewportCount; vp++) {
                const viewport = shadow.getViewport(vp);

                this._viewport.set(
                    this._viewportSize.x * viewport.x,
                    this._viewportSize.y * viewport.y,
                    this._viewportSize.x * viewport.z,
                    this._viewportSize.y * viewport.w
                );

                _state.viewport(this._viewport);

                shadow.updateMatrices(light, vp);

                this._frustum = shadow.getFrustum();

                this.renderObject(
                    scene,
                    camera,
                    shadow.camera,
                    light,
                    this.type
                );
            }

            // do blur pass for VSM

            if (!shadow.isPointLightShadow && this.type === VSMShadowMap) {
                this.vsmPass(shadow, camera);
            }

            shadow.needsUpdate = false;
        }

        this.needsUpdate = false;

        this._renderer.setRenderTarget(
            currentRenderTarget,
            activeCubeFace,
            activeMipmapLevel
        );
    }

    vsmPass(shadow: LightShadow, camera: Camera) {
        const geometry = this._objects.update(this.fullScreenMesh);

        // vertical pass

        this.shadowMaterialVertical.uniforms.shadow_pass.value
            = shadow.map.texture;
        this.shadowMaterialVertical.uniforms.resolution.value = shadow.mapSize;
        this.shadowMaterialVertical.uniforms.radius.value = shadow.radius;
        this._renderer.setRenderTarget(shadow.mapPass);
        this._renderer.clear();
        this._renderer.renderBufferDirect(
            camera,
            null,
            geometry,
            this.shadowMaterialVertical as any,
            this.fullScreenMesh,
            null
        );

        // horizontal pass

        this.shadowMaterialHorizontal.uniforms.shadow_pass.value
            = shadow.mapPass.texture;
        this.shadowMaterialHorizontal.uniforms.resolution.value
            = shadow.mapSize;
        this.shadowMaterialHorizontal.uniforms.radius.value = shadow.radius;
        this._renderer.setRenderTarget(shadow.map);
        this._renderer.clear();
        this._renderer.renderBufferDirect(
            camera,
            null,
            geometry,
            this.shadowMaterialHorizontal as any,
            this.fullScreenMesh,
            null
        );
    }

    // TODO fix bruh
    getDepthMaterialVariant(
        useMorphing: boolean,
        useSkinning: boolean,
        useInstancing: boolean
    ): Material {
        const index
            = (useMorphing ? 1 : 0 << 0)
            | (useSkinning ? 1 : 0 << 1)
            | (useInstancing ? 1 : 0 << 2);

        let material = this._depthMaterials[index];

        if (material === undefined) {
            material = new MeshDepthMaterial();
            material.depthPacking = RGBADepthPacking;
            material.morphTargets = useMorphing;
            material.skinning = useSkinning;

            this._depthMaterials[index] = material;
        }

        return material as any;
    }

    getDistanceMaterialVariant(
        useMorphing: boolean,
        useSkinning: boolean,
        useInstancing: boolean
    ): Material {
        const index
            = (useMorphing ? 1 : 0 << 0)
            | (useSkinning ? 1 : 0 << 1)
            | (useInstancing ? 1 : 0 << 2);

        let material = this._distanceMaterials[index];

        if (material === undefined) {
            material = new MeshDistanceMaterial();
            material.morphTargets = useMorphing;
            material.skinning = useSkinning;

            this._distanceMaterials[index] = material;
        }

        return material as any;
    }

    getDepthMaterial(
        object: Object3D,
        geometry: BufferGeometry,
        material: Material,
        light: Light,
        shadowCameraNear: number,
        shadowCameraFar: number,
        type: number
    ) {
        let result = null;

        let getMaterialVariant = this.getDepthMaterialVariant;
        let customMaterial = object.customDepthMaterial;

        if (light.isPointLight === true) {
            getMaterialVariant = this.getDistanceMaterialVariant;
            customMaterial = object.customDistanceMaterial;
        }

        if (customMaterial === undefined) {
            let useMorphing = false;

            if (material.morphTargets === true) {
                useMorphing
                    = geometry.morphAttributes
                    && geometry.morphAttributes.position
                    && geometry.morphAttributes.position.length > 0;
            }

            let useSkinning = false;

            if (object.isSkinnedMesh === true) {
                if (material.skinning === true) {
                    useSkinning = true;
                } else {
                    console.warn(
                        'WebGLShadowMap: SkinnedMesh with material.skinning set to false:',
                        object
                    );
                }
            }

            const useInstancing = object.isInstancedMesh === true;

            result = getMaterialVariant(
                useMorphing,
                useSkinning,
                useInstancing
            );
        } else {
            result = customMaterial;
        }

        if (
            this._renderer.localClippingEnabled
            && material.clipShadows === true
            && material.clippingPlanes.length !== 0
        ) {
            // in this case we need a unique material instance reflecting the
            // appropriate state

            const keyA = result.uuid;
            const keyB = material.uuid;

            let materialsForVariant = this._materialCache[keyA];

            if (materialsForVariant === undefined) {
                materialsForVariant = {};
                this._materialCache[keyA] = materialsForVariant;
            }

            let cachedMaterial = materialsForVariant[keyB];

            if (cachedMaterial === undefined) {
                cachedMaterial = result.clone();
                materialsForVariant[keyB] = cachedMaterial;
            }

            result = cachedMaterial;
        }

        result.visible = material.visible;
        result.wireframe = material.wireframe;

        if (type === VSMShadowMap) {
            result.side
                = material.shadowSide !== null
                    ? material.shadowSide
                    : material.side;
        } else {
            result.side
                = material.shadowSide !== null
                    ? material.shadowSide
                    : this.shadowSide[material.side];
        }

        result.clipShadows = material.clipShadows;
        result.clippingPlanes = material.clippingPlanes;
        result.clipIntersection = material.clipIntersection;

        result.wireframeLinewidth = material.wireframeLinewidth;
        result.linewidth = material.linewidth;

        if (
            light.isPointLight === true
            && result.isMeshDistanceMaterial === true
        ) {
            result.referencePosition.setFromMatrixPosition(light.matrixWorld);
            result.nearDistance = shadowCameraNear;
            result.farDistance = shadowCameraFar;
        }

        return result;
    }

    renderObject(
        object: Object3D,
        camera: Camera,
        shadowCamera: Camera,
        light: Light,
        type: number
    ) {
        if (object.visible === false) { return; }

        const visible = object.layers.test(camera.layers);

        if (visible && (object.isMesh || object.isLine || object.isPoints)) {
            if (
                (object.castShadow
                    || (object.receiveShadow && type === VSMShadowMap))
                && (!object.frustumCulled
                    || this._frustum.intersectsObject(object))
            ) {
                object.modelViewMatrix.multiplyMatrices(
                    shadowCamera.matrixWorldInverse,
                    object.matrixWorld
                );

                const geometry = this._objects.update(object);
                const { material } = object;

                if (Array.isArray(material)) {
                    const materialArray = material as Material[];
                    const { groups } = geometry;

                    for (let k = 0, kl = groups.length; k < kl; k++) {
                        const group = groups[k];
                        const groupMaterial
                            = materialArray[group.materialIndex];

                        if (groupMaterial && groupMaterial.visible) {
                            const depthMaterial = this.getDepthMaterial(
                                object,
                                geometry,
                                groupMaterial,
                                light,
                                shadowCamera.near,
                                shadowCamera.far,
                                type
                            );

                            this._renderer.renderBufferDirect(
                                shadowCamera,
                                null,
                                geometry,
                                depthMaterial,
                                object,
                                group
                            );
                        }
                    }
                } else if (material.visible) {
                    const depthMaterial = this.getDepthMaterial(
                        object,
                        geometry,
                        material,
                        light,
                        shadowCamera.near,
                        shadowCamera.far,
                        type
                    );

                    this._renderer.renderBufferDirect(
                        shadowCamera,
                        null,
                        geometry,
                        depthMaterial,
                        object,
                        null
                    );
                }
            }
        }

        const { children } = object;

        for (let i = 0, l = children.length; i < l; i++) {
            this.renderObject(children[i], camera, shadowCamera, light, type);
        }
    }

}

export { WebGLShadowMap };
