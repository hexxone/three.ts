import { Vector3 } from '../math/Vector3';
import { Object3D } from '../core/Object3D';
import { Line } from '../objects/Line';
import { Float32BufferAttribute } from '../core/BufferAttribute';
import { BufferGeometry } from '../core/BufferGeometry';
import { LineBasicMaterial } from '../materials/LineBasicMaterial';

/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
 */

function DirectionalLightHelper( light, size, overrideColor ) {

	Object3D.call( this );

	this.light = light;
	this.light.updateMatrixWorld();

	this.matrix = light.matrixWorld;
	this.matrixAutoUpdate = false;

	this.overrideColor = overrideColor;

	if ( size === undefined ) size = 1;

	var geometry = new BufferGeometry();
	geometry.addAttribute( 'position', new Float32BufferAttribute( [
		- size,   size, 0,
		  size,   size, 0,
		  size, - size, 0,
		- size, - size, 0,
		- size,   size, 0
	], 3 ) );

	var material = new LineBasicMaterial( { fog: false, color: this.overrideColor } );

	this.lightPlane = new Line( geometry, material );
	this.add( this.lightPlane );

	geometry = new BufferGeometry();
	geometry.addAttribute( 'position', new Float32BufferAttribute( [ 0, 0, 0, 0, 0, 1 ], 3 ) );

	this.targetLine = new Line( geometry, material );
	this.add( this.targetLine );

	this.update();

}

DirectionalLightHelper.prototype = Object.create( Object3D.prototype );
DirectionalLightHelper.prototype.constructor = DirectionalLightHelper;

DirectionalLightHelper.prototype.dispose = function () {

	this.lightPlane.geometry.dispose();
	this.lightPlane.material.dispose();
	this.targetLine.geometry.dispose();
	this.targetLine.material.dispose();

};

DirectionalLightHelper.prototype.update = function () {

	var v1 = new Vector3();
	var v2 = new Vector3();
	var v3 = new Vector3();

	return function update() {

		v1.setFromMatrixPosition( this.light.matrixWorld );
		v2.setFromMatrixPosition( this.light.target.matrixWorld );
		v3.subVectors( v2, v1 );

		this.lightPlane.lookAt( v3 );
		if ( ! this.overrideColor ) this.lightPlane.material.color.copy( this.light.color );
		else this.lightPlane.material.color.set( this.overrideColor );

		this.targetLine.lookAt( v3 );
		this.targetLine.scale.z = v3.length();
		if ( ! this.overrideColor ) this.targetLine.material.color.copy( this.light.color );
		else this.targetLine.material.color.set( this.overrideColor );

	};

}();


export { DirectionalLightHelper };
