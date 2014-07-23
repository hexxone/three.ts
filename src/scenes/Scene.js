/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.Scene = function () {

	THREE.Object3D.call( this );

	this.fog = null;
	this.overrideMaterial = null;

	this.autoUpdate = true; // checked by the renderer
	this.matrixAutoUpdate = false;

};

THREE.Scene.prototype = Object.create( THREE.Object3D.prototype );

THREE.Scene.prototype.clone = function ( object ) {

	if ( object === undefined ) object = new THREE.Scene();

	THREE.Object3D.prototype.clone.call( this, object );

	if ( this.fog !== null ) object.fog = this.fog.clone();
	if ( this.overrideMaterial !== null ) object.overrideMaterial = this.overrideMaterial.clone();

	object.autoUpdate = this.autoUpdate;
	object.matrixAutoUpdate = this.matrixAutoUpdate;

	return object;

};
