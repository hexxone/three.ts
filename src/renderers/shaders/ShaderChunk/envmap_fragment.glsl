#ifdef USE_ENVMAP

	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG )

		vec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );

		// http://en.wikibooks.org/wiki/GLSL_Programming/Applying_Matrix_Transformations
		// Transforming Normal Vectors with the Inverse Transformation

		vec3 worldNormal = transformNormal( normal, viewMatrix );

		#ifdef ENVMAP_MODE_REFLECTION

			vec3 reflectVec = reflect( cameraToVertex, worldNormal );

		#else

			vec3 reflectVec = refract( cameraToVertex, worldNormal, refractionRatio );

		#endif

	#else

		vec3 reflectVec = vReflect;

	#endif

	#ifdef DOUBLE_SIDED
		float flipNormal = ( -1.0 + 2.0 * float( gl_FrontFacing ) );
	#else
		float flipNormal = 1.0;
	#endif

	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );

	#elif defined( ENVMAP_TYPE_EQUIREC )
		vec2 sampleUV;
		sampleUV.y = saturate( flipNormal * reflectVec.y * 0.5 + 0.5 );
		sampleUV.x = atan( flipNormal * reflectVec.z, flipNormal * reflectVec.x ) * RECIPROCAL_2PI + 0.5;
		vec4 envColor = texture2D( envMap, sampleUV );
		
	#elif defined( ENVMAP_TYPE_SPHERE )
		vec3 reflectView = flipNormal * ( transformNormal( reflectVec, viewMatrix ) + vec3(0.0,0.0,1.0) );
		vec4 envColor = texture2D( envMap, reflectView.xy * 0.5 + 0.5 );
	#endif

	#ifdef GAMMA_INPUT

		envColor.xyz *= envColor.xyz;

	#endif

	#ifdef ENVMAP_BLENDING_MULTIPLY

		gl_FragColor.xyz = mix( gl_FragColor.xyz, gl_FragColor.xyz * envColor.xyz, specularStrength * reflectivity );

	#elif defined( ENVMAP_BLENDING_MIX )

		gl_FragColor.xyz = mix( gl_FragColor.xyz, envColor.xyz, specularStrength * reflectivity );

	#elif defined( ENVMAP_BLENDING_ADD )

		gl_FragColor.xyz += envColor.xyz * specularStrength * reflectivity;

	#endif

#endif
