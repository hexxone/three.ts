/**
 * Intermediate helper function
 */
function webGLShader(gl: GLESRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    return shader;
}

export { webGLShader };
