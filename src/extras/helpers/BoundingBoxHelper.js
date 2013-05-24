/**
 * @author WestLangley / http://github.com/WestLangley
 */

// a helper to show the world-axis-aligned bounding box for an object

THREE.BoundingBoxHelper = function ( object, hex ) {

	var color = hex || 0x888888;

	this.object = object;

	this.box = new THREE.Box3();

	THREE.Mesh.call( this, new THREE.CubeGeometry( 1, 1, 1 ), new THREE.MeshBasicMaterial( { color: color, wireframe: true } ) );

};

THREE.BoundingBoxHelper.prototype = Object.create( THREE.Mesh.prototype );

THREE.BoundingBoxHelper.prototype.update = function () {

	this.object.computeBoundingBox();

	this.object.boundingBox.size( this.scale );

	this.object.boundingBox.center( this.position );

};
