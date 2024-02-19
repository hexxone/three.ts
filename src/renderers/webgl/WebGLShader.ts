/**
 * Intermediate helper function
 * @param {GLESRenderingContext} gl context
 * @param {number} type shader program id
 * @param {string} source shader script source
 * @returns {GLESShader} result
 */
function webGLShader(gl: GLESRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    return shader;
}

export { webGLShader };
