import { IBuffered } from './WebGLAttributes';
import { WebGLCapabilities } from './WebGLCapabilities';
import { WebGLExtensions } from './WebGLExtensions';
import { WebGLInfo } from './WebGLInfo';

/**
 * @public
 */
class WebGLIndexedBufferRenderer {

    gl: GLESRenderingContext;
    extensions: WebGLExtensions;
    info: WebGLInfo;
    capabilities: WebGLCapabilities;

    mode: number;
    type: number;
    bytesPerElement: number;

    constructor(
        gl: GLESRenderingContext,
        extensions: WebGLExtensions,
        info: WebGLInfo,
        capabilities: WebGLCapabilities
    ) {
        this.gl = gl;
        this.extensions = extensions;
        this.info = info;
        this.capabilities = capabilities;
    }

    setMode(value) {
        this.mode = value;
    }

    setIndex(value: IBuffered) {
        this.type = value.type;
        this.bytesPerElement = value.bytesPerElement;
    }

    render(start, count) {
        this.gl.drawElements(
            this.mode,
            count,
            this.type,
            start * this.bytesPerElement
        );

        this.info.update(count, this.mode, 1);
    }

    renderInstances(start, count, primcount) {
        if (primcount === 0) { return; }

        let extension;
        let methodName;

        if (this.capabilities.isWebGL2) {
            extension = this.gl;
            methodName = 'drawElementsInstanced';
        } else {
            extension = this.extensions.get('ANGLE_instanced_arrays');
            methodName = 'drawElementsInstancedANGLE';

            if (extension === null) {
                console.error(
                    'WebGLIndexedBufferRenderer: using InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.'
                );

                return;
            }
        }

        extension[methodName](
            this.mode,
            count,
            this.type,
            start * this.bytesPerElement,
            primcount
        );

        this.info.update(count, this.mode, primcount);
    }

}

export { WebGLIndexedBufferRenderer };
