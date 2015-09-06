// module( "CommonUtilities" );

function mergeParams( defaults, customParams ) {

	if ( typeof customParams == "undefined" ) return defaults;

	var defaultKeys = Object.keys( defaults );
	var params = {};

	defaultKeys.map( function( key ) {
		params[ key ] = customParams[ key ] || defaultKeys[ key ];
	});

	return params;

}


function getParams( type, customParams ) {

	var defaults = {};

	switch ( type ) {

		case "Box":

			defaults = { width: 100, height: 100, depth: 100, widthSegments: 1, heightSegments: 1, depthSegments: 1 };
			break;

		case "Sphere":

			defaults = { radius: 75, widthSegments: 32, heightSegments: 16, phiStart: 0, phiLength: 6.28, thetaStart: 0.00, thetaLength: 3.14 };
			break;

		default:

			console.error( "Type '" + type + "' is not known while creating params" );
			return false;

	}

	return mergeParams( defaults, customParams );

}

function getGeometry( type, customParams ) {

	var params = getParams( type, customParams );

	switch ( type ) {

		case "Box":

			return new THREE.BoxGeometry(
				params['width'],
				params['height'],
				params['depth'],
				params['widthSegments'],
				params['heightSegments'],
				params['depthSegments']
			);

		case "Sphere":

			return new THREE.SphereGeometry(
				params['radius'],
				params['widthSegments'],
				params['heightSegments'],
				params['phiStart'],
				params['phiLength'],
				params['thetaStart'],
				params['thetaLength']
			);

		default:

			console.error( "Type '" + type + "' is not known while creating geometry " );
			return false;

	}

}

function getObject( name, type, customParams ) {

	var geometry = getGeometry( type, customParams );

	var object = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial() );
	object.name = name || type + " 1";

	return object;

}


function aBox( name, customParams ) {

	return getObject( name, "Box", customParams );
}

function aSphere( name, customParams ) {

	return getObject( name, "Sphere", customParams );

}

function aPointlight( name ) {

	var object = new THREE.PointLight( 54321, 1.0, 0.0, 1.0 );
	object.name = name || "PointLight 1";

	return object;

}

function aPerspectiveCamera( name ) {

	var object = new THREE.PerspectiveCamera( 50.1, 0.4, 1.03, 999.05 );
	object.name = name || "PerspectiveCamera 1";

	return object;

}

function getScriptCount( editor ) {

	var scriptsKeys = Object.keys( editor.scripts );
	var scriptCount = 0;

	for ( var i = 0; i < scriptsKeys.length; i++ ) {

		scriptCount += editor.scripts[ scriptsKeys[i] ].length;

	}

	return scriptCount;
}
