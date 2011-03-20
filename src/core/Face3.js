/**
 * @author mr.doob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

THREE.Face3 = function ( a, b, c, normal, color, materials ) {

	this.a = a; 
	this.b = b;
	this.c = c;

	this.normal = normal instanceof THREE.Vector3 ? normal : new THREE.Vector3();
	this.vertexNormals = normal instanceof Array ? normal : [ new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3() ];

	this.color = color instanceof THREE.Color ? color : new THREE.Color();
	this.vertexColors = color instanceof Array ? color : [];

	this.materials = materials instanceof Array ? materials : [ materials ];

	this.centroid = new THREE.Vector3();

};
