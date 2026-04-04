#ifdef USE_ALPHAHASH

float alphaHashNoise = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
if(diffuseColor.a < alphaHashNoise) discard;

#endif

#ifdef ALPHATEST

if(diffuseColor.a < ALPHATEST) discard;

#endif
