import { Camera } from '../cameras/Camera';
import { Frustum } from '../math/Frustum';
import { Matrix4 } from '../math/Matrix4';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { Vector4 } from '../math/Vector4';
import { WebGLRenderTarget } from '../renderers/WebGLRenderTarget';

const _projScreenMatrix = /* @__PURE__*/ new Matrix4();
const _lightPositionWorld = /* @__PURE__*/ new Vector3();
const _lookTarget = /* @__PURE__*/ new Vector3();

class LightShadow {

    camera: Camera;
    bias: number;
    normalBias: number;
    radius: number;
    mapSize: Vector2;
    map: WebGLRenderTarget;
    mapPass: WebGLRenderTarget;
    matrix: Matrix4;
    autoUpdate: boolean;
    needsUpdate: boolean;

    _frustum: Frustum;
    _frameExtents: Vector2;
    _viewportCount: number;
    _viewports: Vector4[];

    isDirectionalLightShadow: boolean;
    isPointLightShadow: boolean;
    isSpotLightShadow: boolean;

    constructor(camera) {
        this.camera = camera;

        this.bias = 0;
        this.normalBias = 0;
        this.radius = 1;

        this.mapSize = new Vector2(512, 512);

        this.map = null;
        this.mapPass = null;
        this.matrix = new Matrix4();

        this.autoUpdate = true;
        this.needsUpdate = false;

        this._frustum = new Frustum();
        this._frameExtents = new Vector2(1, 1);

        this._viewportCount = 1;

        this._viewports = [new Vector4(0, 0, 1, 1)];
    }

    getViewportCount() {
        return this._viewportCount;
    }

    getFrustum() {
        return this._frustum;
    }

    updateMatrices(light, _viewportIndex?: number) {
        const shadowCamera = this.camera;
        const shadowMatrix = this.matrix;

        _lightPositionWorld.setFromMatrixPosition(light.matrixWorld);
        shadowCamera.position.copy(_lightPositionWorld);

        _lookTarget.setFromMatrixPosition(light.target.matrixWorld);
        shadowCamera.lookAt(_lookTarget);
        shadowCamera.updateMatrixWorld();

        _projScreenMatrix.multiplyMatrices(
            shadowCamera.projectionMatrix,
            shadowCamera.matrixWorldInverse
        );
        this._frustum.setFromProjectionMatrix(_projScreenMatrix);

        shadowMatrix.set(
            0.5,
            0.0,
            0.0,
            0.5,
            0.0,
            0.5,
            0.0,
            0.5,
            0.0,
            0.0,
            0.5,
            0.5,
            0.0,
            0.0,
            0.0,
            1.0
        );

        shadowMatrix.multiply(shadowCamera.projectionMatrix);
        shadowMatrix.multiply(shadowCamera.matrixWorldInverse);
    }

    getViewport(viewportIndex) {
        return this._viewports[viewportIndex];
    }

    getFrameExtents() {
        return this._frameExtents;
    }

    copy(source: LightShadow) {
        this.camera = source.camera.clone();

        this.bias = source.bias;
        this.radius = source.radius;

        this.mapSize.copy(source.mapSize);

        return this;
    }

    clone() {
        return new LightShadow(null).copy(this);
    }

}

export { LightShadow };
