( function () {

	/**
 * Luminosity
 * http://en.wikipedia.org/wiki/Luminosity
 */
	const LuminosityShader = {
		uniforms: {
			'tDiffuse': {
				value: null
			}
		},
		vertexShader: `varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,
		fragmentShader: `#include <common>

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float l = linearToRelativeLuminance( texel.rgb );

			gl_FragColor = vec4( l, l, l, texel.w );

		}`
	};

	THREE.LuminosityShader = LuminosityShader;

} )();
