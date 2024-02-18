import { Camera } from '../../cameras/Camera';
import { BackSide, CubeUVReflectionMapping, FrontSide } from '../../constants';
import { Object3D } from '../../core/Object3D';
import { BoxGeometry } from '../../geometries/BoxGeometry';
import { PlaneGeometry } from '../../geometries/PlaneGeometry';
import { ShaderMaterial } from '../../materials/ShaderMaterial';
import { Color } from '../../math/Color';
import { Mesh } from '../../objects/Mesh';
import { Scene } from '../../scenes/Scene';
import { CubeTexture } from '../../textures/CubeTexture';
import { Texture } from '../../textures/Texture';
import { ShaderLib } from '../shaders/ShaderLib';
import { cloneUniforms } from '../shaders/UniformsUtils';
import { WebGLCubeRenderTarget } from '../WebGLCubeRenderTarget';
import { WebGLRenderer } from '../WebGLRenderer';
import { WebGLCubeMaps } from './WebGLCubeMaps';
import { WebGLObjects } from './WebGLObjects';
import { WebGLRenderList } from './WebGLRenderLists';
import { WebGLState } from './WebGLState';

class WebGLBackground {

    _renderer: WebGLRenderer;
    _cubemaps: WebGLCubeMaps;
    _state: WebGLState;
    _objects: WebGLObjects;
    _premultipliedAlpha: boolean;

    clearColor = new Color(0x000000);
    clearAlpha = 0;

    planeMesh: Mesh;
    boxMesh: Mesh;

    currentBackground: Texture;
    currentTonemapping: number;
    currentBackgroundVersion = 0;

    constructor(
        renderer: WebGLRenderer,
        cubemaps: WebGLCubeMaps,
        state: WebGLState,
        objects: WebGLObjects,
        premultipliedAlpha: boolean
    ) {
        this._renderer = renderer;
        this._cubemaps = cubemaps;
        this._state = state;
        this._objects = objects;
        this._premultipliedAlpha = premultipliedAlpha;
    }

    render(
        renderList: WebGLRenderList,
        scene: Object3D,
        camera: Camera,
        forceClear = false
    ) {
        let background = scene.isScene ? (scene as Scene).background : null;

        if (background && background instanceof Texture) {
            background = this._cubemaps.get(background);
        }

        // Ignore background in AR
        // TODO: Reconsider this.

        const { xr } = this._renderer;
        const session = xr.getSession && xr.getSession();

        if (session && session.environmentBlendMode === 'additive') {
            background = null;
        }

        if (background === null) {
            this.setClear(this.clearColor, this.clearAlpha);
        } else if (background && background instanceof Color) {
            this.setClear(background, 1);
            forceClear = true;
        }

        if (this._renderer.autoClear || forceClear) {
            this._renderer.clear(
                this._renderer.autoClearColor,
                this._renderer.autoClearDepth,
                this._renderer.autoClearStencil
            );
        }

        if (
            background
            && (background instanceof CubeTexture
                || background instanceof WebGLCubeRenderTarget
                || (background instanceof Texture
                    && background.mapping === CubeUVReflectionMapping))
        ) {
            if (this.boxMesh === undefined) {
                const boxMat = new ShaderMaterial();

                boxMat.name = 'BackgroundCubeMaterial';
                boxMat.uniforms = cloneUniforms(ShaderLib.cube.uniforms);
                boxMat.vertexShader = ShaderLib.cube.vertexShader;
                boxMat.fragmentShader = ShaderLib.cube.fragmentShader;
                boxMat.side = BackSide;
                boxMat.depthTest = false;
                boxMat.depthWrite = false;
                boxMat.fog = false;

                this.boxMesh = new Mesh(new BoxGeometry(1, 1, 1), boxMat);

                (this.boxMesh.geometry as BoxGeometry).deleteAttribute(
                    'normal'
                );
                (this.boxMesh.geometry as BoxGeometry).deleteAttribute('uv');

                this.boxMesh.onBeforeRender = function(
                    renderer,
                    scene,
                    camera
                ) {
                    this.matrixWorld.copyPosition(camera.matrixWorld);
                };

                // enable code injection for non-built-in material
                Object.defineProperty(this.boxMesh.material, 'envMap', {
                    get() {
                        return this.uniforms.envMap.value;
                    }
                });

                this._objects.update(this.boxMesh);
            }

            if (background instanceof WebGLCubeRenderTarget) {
                // TODO Deprecate
                background = background.texture;
            }

            (this.boxMesh.material as ShaderMaterial).uniforms.envMap.value
                = background;

            (
                this.boxMesh.material as ShaderMaterial
            ).uniforms.flipEnvMap.value
                = background instanceof CubeTexture && background._needsFlipEnvMap
                    ? -1
                    : 1;

            if (
                this.currentBackground !== background
                || this.currentBackgroundVersion !== background.version
                || this.currentTonemapping !== this._renderer.toneMapping
            ) {
                this.boxMesh.material.needsUpdate = true;

                this.currentBackground = background;
                this.currentBackgroundVersion = background.version;
                this.currentTonemapping = this._renderer.toneMapping;
            }

            // push to the pre-sorted opaque render list
            renderList.unshift(
                this.boxMesh,
                this.boxMesh.geometry,
                this.boxMesh.material,
                0,
                0,
                null
            );
        } else if (background && background instanceof Texture) {
            if (this.planeMesh === undefined) {
                const shaderMat = new ShaderMaterial();

                shaderMat.name = 'BackgroundMaterial';
                shaderMat.uniforms = cloneUniforms(
                    ShaderLib.background.uniforms
                );
                shaderMat.vertexShader = ShaderLib.background.vertexShader;
                shaderMat.fragmentShader = ShaderLib.background.fragmentShader;
                shaderMat.side = FrontSide;
                shaderMat.depthTest = false;
                shaderMat.depthWrite = false;
                shaderMat.fog = false;

                this.planeMesh = new Mesh(new PlaneGeometry(2, 2), shaderMat);

                (this.planeMesh.geometry as PlaneGeometry).deleteAttribute(
                    'normal'
                );

                // enable code injection for non-built-in material
                Object.defineProperty(this.planeMesh.material, 'map', {
                    get() {
                        return this.uniforms.t2D.value;
                    }
                });

                this._objects.update(this.planeMesh);
            }

            (this.planeMesh.material as ShaderMaterial).uniforms.t2D.value
                = background;

            if (background.matrixAutoUpdate === true) {
                background.updateMatrix();
            }

            (
                this.boxMesh.material as ShaderMaterial
            ).uniforms.uvTransform.value.copy(background.matrix);

            if (
                this.currentBackground !== background
                || this.currentBackgroundVersion !== background.version
                || this.currentTonemapping !== this._renderer.toneMapping
            ) {
                this.planeMesh.material.needsUpdate = true;

                this.currentBackground = background;
                this.currentBackgroundVersion = background.version;
                this.currentTonemapping = this._renderer.toneMapping;
            }

            // push to the pre-sorted opaque render list
            renderList.unshift(
                this.planeMesh,
                this.planeMesh.geometry,
                this.planeMesh.material,
                0,
                0,
                null
            );
        }
    }

    setClear(color: Color, alpha: number) {
        this._state.colorBuffer.setClear(
            color.r,
            color.g,
            color.b,
            alpha,
            this._premultipliedAlpha
        );
    }

    getClearColor() {
        return this.clearColor;
    }

    setClearColor(color: Color, alpha = 1) {
        this.clearColor.set(color);
        this.clearAlpha = alpha;
        this.setClear(this.clearColor, this.clearAlpha);
    }

    getClearAlpha() {
        return this.clearAlpha;
    }

    setClearAlpha(alpha: number) {
        this.clearAlpha = alpha;
        this.setClear(this.clearColor, this.clearAlpha);
    }

}

export { WebGLBackground };
