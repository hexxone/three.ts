#define PI 3.14159
#define PI2 6.28318
#define RECIPROCAL_PI 0.31830988618
#define RECIPROCAL_PI2 0.15915494
#define LOG2 1.442695
#define EPSILON 1e-6
#define PHYSICALLY_BASED_RENDERING
#define saturate(a) clamp( a, 0.0, 1.0 )
#define whiteCompliment(a) ( 1.0 - saturate( a ) )

vec3 transformDirection( in vec3 normal, in mat4 matrix ) {

	return normalize( ( matrix * vec4( normal, 0.0 ) ).xyz );

}

// http://en.wikibooks.org/wiki/GLSL_Programming/Applying_Matrix_Transformations
vec3 inverseTransformDirection( in vec3 normal, in mat4 matrix ) {

	return normalize( ( vec4( normal, 0.0 ) * matrix ).xyz );

}

vec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {

	float distance = dot( planeNormal, point - pointOnPlane );

	return - distance * planeNormal + point;

}

float sideOfPlane( in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal ) {

	return sign( dot( point - pointOnPlane, planeNormal ) );

}

vec3 linePlaneIntersect( in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal ) {

	return lineDirection * ( dot( planeNormal, pointOnPlane - pointOnLine ) / dot( planeNormal, lineDirection ) ) + pointOnLine;

}

float calcLightAttenuation( float lightDistance, float cutoffDistance, float decayExponent ) {

	if ( decayExponent > 0.0 ) {

	  return pow( saturate( -lightDistance / cutoffDistance + 1.0 ), decayExponent );

	}

	return 1.0;

}

vec3 inputToLinear( in vec3 a ) {

	#ifdef GAMMA_INPUT

		return pow( a, vec3( float( GAMMA_FACTOR ) ) );

	#else

		return a;

	#endif

}

vec3 linearToOutput( in vec3 a ) {

	#ifdef GAMMA_OUTPUT

		return pow( a, vec3( 1.0 / float( GAMMA_FACTOR ) ) );

	#else

		return a;

	#endif

}


struct IncidentLight {
 	vec3 color;
 	vec3 direction;
};

struct ReflectedLight {
 	vec3 specular;
 	vec3 diffuse;
};

vec3 BRDF_Lambert( const in IncidentLight incidentLight, const in vec3 normal, const in vec3 diffuseColor ) {

	return incidentLight.color * diffuseColor * ( saturate( dot( normal, incidentLight.direction ) ) );

	// the above should be scaled by '' * RECIPROCAL_PI'
}

vec3 F_Schlick( const in vec3 F0, const in float dotLH ) {

	// Original approximation by Christophe Schlick '94
	//;float fresnel = pow( 1.0 - dotLH, 5.0 );

	// Optimized variant (presented by Epic at SIGGRAPH '13)
	float fresnel = exp2( ( -5.55437 * dotLH - 6.98316 ) * dotLH );

	return F0 + ( 1.0 - F0 ) * fresnel;

}

float G_BlinnPhong_Implicit( /* in float dotNL, in float dotNV */ ) {

	// geometry term is (n dot l)(n dot v) / 4(n dot l)(n dot v)

	return 0.25;

}

float D_BlinnPhong( const in float shininess, const in float dotNH ) {

	// factor of 1/PI in distribution term omitted

	return ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );

}

vec3 BRDF_BlinnPhong( const in IncidentLight incidentLight, const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float shininess ) {

	vec3 halfDir = normalize( incidentLight.direction + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotLH = saturate( dot( incidentLight.direction, halfDir ) );

	vec3 F = F_Schlick( specularColor, dotLH );
	float G = G_BlinnPhong_Implicit( /* dotNL, dotNV */ );
	float D = D_BlinnPhong( shininess, dotNH );

	return incidentLight.color * F * ( G * D );

}

#if MAX_DIR_LIGHTS > 0

	struct DirectionalLight {
	  vec3 direction;
	  vec3 color;
	};

	uniform DirectionalLight directionalLights[ MAX_DIR_LIGHTS ];

	void getDirLightDirect( const in DirectionalLight directionalLight, out IncidentLight incidentLight ) { 
	
		incidentLight.color = directionalLight.color;
		incidentLight.direction = directionalLight.direction; 

	}

#endif

#if MAX_POINT_LIGHTS > 0

	struct PointLight {
	  vec3 position;
	  vec3 color;
	  float distance;
	  float decay;
	};

	uniform PointLight pointLights[ MAX_POINT_LIGHTS ];

	void getPointLightDirect( const in PointLight pointLight, const in vec3 position, out IncidentLight incidentLight ) { 
	
		vec3 lightPosition = pointLight.position; 
	
		vec3 lVector = lightPosition - position; 
		incidentLight.direction = normalize( lVector ); 
	
		incidentLight.color = pointLight.color; 
		incidentLight.color *= calcLightAttenuation( length( lVector ), pointLight.distance, pointLight.decay ); 
	
	}

#endif

#if MAX_SPOT_LIGHTS > 0

	struct SpotLight {
	  vec3 position;
	  vec3 direction;
	  vec3 color;
	  float distance;
	  float decay;
	  float angleCos;
	  float exponent;
	};

	uniform SpotLight spotLights[ MAX_SPOT_LIGHTS ];

	void getSpotLightDirect( const in SpotLight spotLight, const in vec3 position, out IncidentLight incidentLight ) {
	
		vec3 lightPosition = spotLight.position;
	
		vec3 lVector = lightPosition - position;
		incidentLight.direction = normalize( lVector );
	
		float spotEffect = dot( spotLight.direction, incidentLight.direction );
		spotEffect = saturate( pow( saturate( spotEffect ), spotLight.exponent ) );
	
		incidentLight.color = spotLight.color;
		incidentLight.color *= ( spotEffect * calcLightAttenuation( length( lVector ), spotLight.distance, spotLight.decay ) );

	}

#endif


#if MAX_HEMI_LIGHTS > 0

	struct HemisphereLight {
	  vec3 direction;
	  vec3 skyColor;
	  vec3 groundColor;
	};

	layout(packed)uniform HemisphereLight hemisphereLights[ MAX_HEMI_LIGHTS ];

	void getHemisphereLightIndirect( const in HemisphereLight hemiLight, const in vec3 normal, out IncidentLight incidentLight ) { 
	
		float dotNL = dot( normal, hemiLight.direction );

		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;

		incidentLight.color = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );

		incidentLight.direction = normal;

	}

#endif
