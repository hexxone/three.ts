import { Uint16BufferAttribute,
    Uint32BufferAttribute } from '../../core/BufferAttribute';
import { BufferGeometry } from '../../core/BufferGeometry';
import { Object3D } from '../../core/Object3D';
import { arrayMax } from '../../utils';
import { WebGLAttributes } from './WebGLAttributes';
import { WebGLBindingStates } from './WebGLBindingStates';
import { WebGLInfo } from './WebGLInfo';

/**
 * @public
 */
class WebGLGeometries {

    _gl: GLESRenderingContext;
    _attributes: WebGLAttributes;
    _info: WebGLInfo;
    _bindingStates: WebGLBindingStates;

    geometries: boolean[] = [];
    wireframeAttributes = new WeakMap();

    constructor(
        gl: GLESRenderingContext,
        attributes: WebGLAttributes,
        info: WebGLInfo,
        bindingStates: WebGLBindingStates
    ) {
        this._gl = gl;
        this._attributes = attributes;
        this._info = info;
        this._bindingStates = bindingStates;
    }

    // TODO what event
    onGeometryDispose(event) {
        const geometry = event.target as BufferGeometry;

        if (geometry.index !== null) {
            this._attributes.remove(geometry.index);
        }

        for (const name in geometry.attributes) {
            this._attributes.remove(geometry.attributes[name]);
        }

        geometry.removeEventListener('dispose', this.onGeometryDispose);

        delete this.geometries[geometry.id];

        const attribute = this.wireframeAttributes.get(geometry);

        if (attribute) {
            this._attributes.remove(attribute);
            this.wireframeAttributes.delete(geometry);
        }

        this._bindingStates.releaseStatesOfGeometry(geometry);

        if (geometry.isInstancedBufferGeometry === true) {
            delete geometry._maxInstanceCount;
        }

        //

        this._info.memory.geometries--;
    }

    get(object: Object3D, geometry: BufferGeometry) {
        if (this.geometries[geometry.id] === true) { return geometry; }

        geometry.addEventListener('dispose', (e) => { return this.onGeometryDispose(e); });

        this.geometries[geometry.id] = true;

        this._info.memory.geometries++;

        return geometry;
    }

    update(geometry: BufferGeometry) {
        const geometryAttributes = geometry.attributes;

        // Updating index buffer in VAO now. See WebGLBindingStates.

        for (const name in geometryAttributes) {
            this._attributes.update(
                geometryAttributes[name],
                this._gl.ARRAY_BUFFER
            );
        }

        // morph targets

        const { morphAttributes } = geometry;

        for (const name in morphAttributes) {
            const array = morphAttributes[name];

            for (let i = 0, l = array.length; i < l; i++) {
                this._attributes.update(array[i], this._gl.ARRAY_BUFFER);
            }
        }
    }

    updateWireframeAttribute(geometry: BufferGeometry) {
        const indices = [];

        const geometryIndex = geometry.index;
        const geometryPosition = geometry.attributes.position;
        let version = 0;

        if (geometryIndex !== null) {
            const { array } = geometryIndex;

            ({ version } = geometryIndex);

            for (let i = 0, l = array.length; i < l; i += 3) {
                const a = array[i + 0];
                const b = array[i + 1];
                const c = array[i + 2];

                indices.push(a, b, b, c, c, a);
            }
        } else {
            const { array } = geometryPosition;

            ({ version } = geometryPosition);

            for (let i = 0, l = array.length / 3 - 1; i < l; i += 3) {
                const a = i + 0;
                const b = i + 1;
                const c = i + 2;

                indices.push(a, b, b, c, c, a);
            }
        }

        const attribute = new (
            arrayMax(indices) > 65535
                ? Uint32BufferAttribute
                : Uint16BufferAttribute
        )(indices, 1);

        attribute.version = version;

        // Updating index buffer in VAO now. See WebGLBindingStates

        //

        const previousAttribute = this.wireframeAttributes.get(geometry);

        if (previousAttribute) { this._attributes.remove(previousAttribute); }

        //

        this.wireframeAttributes.set(geometry, attribute);
    }

    getWireframeAttribute(geometry: BufferGeometry) {
        const currentAttribute = this.wireframeAttributes.get(geometry);

        if (currentAttribute) {
            const geometryIndex = geometry.index;

            if (geometryIndex !== null) {
                // if the attribute is obsolete, create a new one

                if (currentAttribute.version < geometryIndex.version) {
                    this.updateWireframeAttribute(geometry);
                }
            }
        } else {
            this.updateWireframeAttribute(geometry);
        }

        return this.wireframeAttributes.get(geometry);
    }

}

export { WebGLGeometries };
