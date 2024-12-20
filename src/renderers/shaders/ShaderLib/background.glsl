export const vertex = /* glsl */`
varying vec2 vUv;
uniform mat3 uvTransform;

void main() {

vUv = (uvTransform * vec3(uv, 1)).xy;

gl_Position = vec4(position.xy, 1.0, 1.0);

};

export const fragment = /* glsl */`
uniform sampler2D t2D;

varying vec2 vUv;

void main() {

vec4 texColor = texture2D(t2D, vUv);

gl_FragColor = mapTexelToLinear(texColor);

	#include <tonemapping_fragment>
	#include <encodings_fragment>

};
