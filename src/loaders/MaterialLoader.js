/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.MaterialLoader = function ( manager ) {

	this.manager = ( manager !== undefined ) ? manager : THREE.DefaultLoadingManager;

};

THREE.MaterialLoader.prototype = {

	constructor: THREE.MaterialLoader,

	load: function ( url, onLoad, onProgress, onError ) {

		var scope = this;

		var loader = new THREE.XHRLoader();
		loader.setCrossOrigin( this.crossOrigin );
		loader.load( url, function ( text ) {

			onLoad( scope.parse( JSON.parse( text ) ) );

		} );

	},

	setCrossOrigin: function ( value ) {

		this.crossOrigin = value;

	},

	parse: function ( json ) {

		var material = new THREE[ json.type ];

		if ( json.color !== undefined ) material.color.setHex( json.color );
		if ( json.ambient !== undefined ) material.ambient.setHex( json.ambient );
		if ( json.emissive !== undefined ) material.emissive.setHex( json.emissive );
		if ( json.specular !== undefined ) material.specular.setHex( json.specular );
		if ( json.shininess !== undefined ) material.shininess = json.shininess;
		if ( json.vertexColors !== undefined ) material.vertexColors = json.vertexColors;
		if ( json.blending !== undefined ) material.blending = json.blending;
		if ( json.opacity !== undefined ) material.opacity = json.opacity;
		if ( json.transparent !== undefined ) material.transparent = json.transparent;
		if ( json.wireframe !== undefined ) material.wireframe = json.wireframe;

		return material;

	}

};
