console.warn( "THREE.LuminosityShader: As part of the transition to ES6 Modules, the files in 'examples/js' have been deprecated in r117 (May 2020) and will be deleted in r124 (December 2020). You can find more information about developing using ES6 Modules in https://threejs.org/docs/index.html#manual/en/introduction/Import-via-modules." );
/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Luminosity
 * http://en.wikipedia.org/wiki/Luminosity
 */

THREE.LuminosityShader = {

	uniforms: {

		"tDiffuse": { value: null }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

		"	vUv = uv;",

		"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"#include <common>",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

		"	vec4 texel = texture2D( tDiffuse, vUv );",

		"	float l = linearToRelativeLuminance( texel.rgb );",

		"	gl_FragColor = vec4( l, l, l, texel.w );",

		"}"

	].join( "\n" )

};
