import { WebGLCapabilities } from './WebGLCapabilities';
import { WebGLExtensions } from './WebGLExtensions';
import { WebGLInfo } from './WebGLInfo';

class WebGLBufferRenderer {

    setMode: (value: any) => void;
    render: (start: any, count: any) => void;
    renderInstances: (start: any, count: any, primcount: any) => void;

    constructor(
        gl: GLESRenderingContext,
        extensions: WebGLExtensions,
        info: WebGLInfo,
        capabilities: WebGLCapabilities
    ) {
        const { isWebGL2 } = capabilities;

        let mode;

        function setMode(value) {
            mode = value;
        }

        function render(start, count) {
            gl.drawArrays(mode, start, count);

            info.update(count, mode, 1);
        }

        function renderInstances(start, count, primcount) {
            if (primcount === 0) { return; }

            let extension;
            let methodName;

            if (isWebGL2) {
                extension = gl;
                methodName = 'drawArraysInstanced';
            } else {
                extension = extensions.get('ANGLE_instanced_arrays');
                methodName = 'drawArraysInstancedANGLE';

                if (extension === null) {
                    console.error(
                        'WebGLBufferRenderer: using InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.'
                    );

                    return;
                }
            }

            extension[methodName](mode, start, count, primcount);

            info.update(count, mode, primcount);
        }

        //

        this.setMode = setMode;
        this.render = render;
        this.renderInstances = renderInstances;
    }

}

export { WebGLBufferRenderer };
