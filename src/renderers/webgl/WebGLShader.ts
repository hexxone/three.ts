function webGLShader(gl, type, string) {
	const shader = gl.createShader(type);

	gl.shaderSource(shader, string);
	gl.compileShader(shader);

	return shader;
}

export { webGLShader };
