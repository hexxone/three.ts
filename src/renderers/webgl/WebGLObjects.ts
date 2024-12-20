import { Object3D } from '../../core/Object3D';
import { InstancedMesh } from '../../objects/InstancedMesh';
import { WebGLAttributes } from './WebGLAttributes';
import { WebGLGeometries } from './WebGLGeometries';
import { WebGLInfo } from './WebGLInfo';

/**
 * @public
 */
class WebGLObjects {

    _gl: GLESRenderingContext;
    _geometries: WebGLGeometries;
    _attributes: WebGLAttributes;
    _info: WebGLInfo;

    updateMap = new WeakMap();

    constructor(
        gl: GLESRenderingContext,
        geometries: WebGLGeometries,
        attributes: WebGLAttributes,
        info: WebGLInfo
    ) {
        this._gl = gl;
        this._geometries = geometries;
        this._attributes = attributes;
        this._info = info;
    }

    update(object: Object3D) {
        const { frame } = this._info.render;

        const { geometry } = object;
        const buffergeometry = this._geometries.get(object, geometry);

        // Update once per frame

        if (this.updateMap.get(buffergeometry) !== frame) {
            this._geometries.update(buffergeometry);

            this.updateMap.set(buffergeometry, frame);
        }

        if (object instanceof InstancedMesh) {
            if (
                object.hasEventListener(
                    'dispose',
                    this.onInstancedMeshDispose
                ) === false
            ) {
                object.addEventListener('dispose', (e) => { return this.onInstancedMeshDispose(e); }
                );
            }

            this._attributes.update(
                object.instanceMatrix,
                this._gl.ARRAY_BUFFER
            );

            if (object.instanceColor !== null) {
                this._attributes.update(
                    object.instanceColor,
                    this._gl.ARRAY_BUFFER
                );
            }
        }

        return buffergeometry;
    }

    dispose() {
        this.updateMap = new WeakMap();
    }

    onInstancedMeshDispose(event) {
        const instancedMesh = event.target;

        instancedMesh.removeEventListener(
            'dispose',
            this.onInstancedMeshDispose
        );

        this._attributes.remove(instancedMesh.instanceMatrix);

        if (instancedMesh.instanceColor !== null) { this._attributes.remove(instancedMesh.instanceColor); }
    }

}

export { WebGLObjects };
