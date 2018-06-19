//
//	Luma
//

THREE.NodeLib.add( new THREE.ConstNode( "vec3 LUMA vec3(0.2125, 0.7154, 0.0721)" ) );

//
//	NormalMap
//

THREE.NodeLib.add( new THREE.FunctionNode( [

	// Per-Pixel Tangent Space Normal Mapping
	// http://hacksoflife.blogspot.ch/2009/11/per-pixel-tangent-space-normal-mapping.html

	"vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm, vec3 map, vec2 mUv, vec2 normalScale ) {",

	// Workaround for Adreno 3XX dFd*( vec3 ) bug. See #9988
	
	"	vec3 q0 = vec3( dFdx( eye_pos.x ), dFdx( eye_pos.y ), dFdx( eye_pos.z ) );",
	"	vec3 q1 = vec3( dFdy( eye_pos.x ), dFdy( eye_pos.y ), dFdy( eye_pos.z ) );",
	"	vec2 st0 = dFdx( mUv.st );",
	"	vec2 st1 = dFdy( mUv.st );",
	
	"	float scale = sign( st1.t * st0.s - st0.t * st1.s );", // we do not care about the magnitude
	
	"	vec3 S = normalize( ( q0 * st1.t - q1 * st0.t ) * scale );",
	"	vec3 T = normalize( ( - q0 * st1.s + q1 * st0.s ) * scale );",
	"	vec3 N = normalize( surf_norm );",
	"	mat3 tsn = mat3( S, T, N );",
	
	"	vec3 mapN = map * 2.0 - 1.0;",
	
	"	mapN.xy *= normalScale;",
	"	mapN.xy *= ( float( gl_FrontFacing ) * 2.0 - 1.0 );",
	
	"	return normalize( tsn * mapN );",

	"}"

].join( "\n" ), null, { derivatives: true } ) );

//
//	BumpMap
//

THREE.NodeLib.add( new THREE.FunctionNode( [

	// Bump Mapping Unparametrized Surfaces on the GPU by Morten S. Mikkelsen
	// http://api.unrealengine.com/attachments/Engine/Rendering/LightingAndShadows/BumpMappingWithoutTangentSpace/mm_sfgrad_bump.pdf
	
	// Evaluate the derivative of the height w.r.t. screen-space using forward differencing (listing 2)

	"vec2 dHdxy_fwd( sampler2D bumpMap, vec2 vUv, float bumpScale ) {",

	// Workaround for Adreno 3XX dFd*( vec3 ) bug. See #9988
	
	"	vec2 dSTdx = dFdx( vUv );",
	"	vec2 dSTdy = dFdy( vUv );",
	
	"	float Hll = bumpScale * texture2D( bumpMap, vUv ).x;",
	"	float dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;",
	"	float dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;",
	
	"	return vec2( dBx, dBy );",
	
	"}"

].join( "\n" ), null, { derivatives: true } ) );

THREE.NodeLib.add( new THREE.FunctionNode( [

	"vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy ) {",

	// Workaround for Adreno 3XX dFd*( vec3 ) bug. See #9988
	
	"	vec3 vSigmaX = vec3( dFdx( surf_pos.x ), dFdx( surf_pos.y ), dFdx( surf_pos.z ) );",
	"	vec3 vSigmaY = vec3( dFdy( surf_pos.x ), dFdy( surf_pos.y ), dFdy( surf_pos.z ) );",
	"	vec3 vN = surf_norm;", // normalized
	
	"	vec3 R1 = cross( vSigmaY, vN );",
	"	vec3 R2 = cross( vN, vSigmaX );",

	"	float fDet = dot( vSigmaX, R1 );",
	
	"	fDet *= ( float( gl_FrontFacing ) * 2.0 - 1.0 );",
	
	"	vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );",
	
	"	return normalize( abs( fDet ) * surf_norm - vGrad );",

	"}"

].join( "\n" ), null, { derivatives: true } ) );

//
//	Noise
//

THREE.NodeLib.add( new THREE.FunctionNode( [
	"float snoise(vec2 co) {",
	"	return fract( sin( dot(co.xy, vec2(12.9898,78.233) ) ) * 43758.5453 );",
	"}"
].join( "\n" ) ) );

//
//	Hue
//

THREE.NodeLib.add( new THREE.FunctionNode( [
	"vec3 hue_rgb(vec3 rgb, float adjustment) {",
	"	const mat3 RGBtoYIQ = mat3(0.299, 0.587, 0.114, 0.595716, -0.274453, -0.321263, 0.211456, -0.522591, 0.311135);",
	"	const mat3 YIQtoRGB = mat3(1.0, 0.9563, 0.6210, 1.0, -0.2721, -0.6474, 1.0, -1.107, 1.7046);",
	"	vec3 yiq = RGBtoYIQ * rgb;",
	"	float hue = atan(yiq.z, yiq.y) + adjustment;",
	"	float chroma = sqrt(yiq.z * yiq.z + yiq.y * yiq.y);",
	"	return YIQtoRGB * vec3(yiq.x, chroma * cos(hue), chroma * sin(hue));",
	"}"
].join( "\n" ) ) );

//
//	Saturation
//

THREE.NodeLib.add( new THREE.FunctionNode( [
// Algorithm from Chapter 16 of OpenGL Shading Language
	"vec3 saturation_rgb(vec3 rgb, float adjustment) {",
	"	vec3 intensity = vec3(dot(rgb, LUMA));",
	"	return mix(intensity, rgb, adjustment);",
	"}"
].join( "\n" ) ) );

//
//	Luminance
//

THREE.NodeLib.add( new THREE.FunctionNode( [
// Algorithm from Chapter 10 of Graphics Shaders
	"float luminance_rgb(vec3 rgb) {",
	"	return dot(rgb, LUMA);",
	"}"
].join( "\n" ) ) );

//
//	Vibrance
//

THREE.NodeLib.add( new THREE.FunctionNode( [
// Shader by Evan Wallace adapted by @lo-th
	"vec3 vibrance_rgb(vec3 rgb, float adjustment) {",
	"	float average = (rgb.r + rgb.g + rgb.b) / 3.0;",
	"	float mx = max(rgb.r, max(rgb.g, rgb.b));",
	"	float amt = (mx - average) * (-3.0 * adjustment);",
	"	return mix(rgb.rgb, vec3(mx), amt);",
	"}"
].join( "\n" ) ) );
