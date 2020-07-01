/**
 * @author Mugen87 / https://github.com/Mugen87
 */

import * as THREE from '../../build/three.module.js';

function ViewHelper() {

	THREE.Object3D.call( this );

	var camera = new THREE.OrthographicCamera( - 2, 2, 2, - 2, 0, 4 );
	camera.position.set( 0, 0, 2 );

	var axesHelper = new THREE.AxesHelper();
	this.add( axesHelper );

	var posXAxisHelper = new THREE.Sprite( new THREE.SpriteMaterial( { map: generateTexture( '#ff0000', 'X' ) } ) );
	var posYAxisHelper = new THREE.Sprite( new THREE.SpriteMaterial( { map: generateTexture( '#00ff00', 'Y' ) } ) );
	var posZAxisHelper = new THREE.Sprite( new THREE.SpriteMaterial( { map: generateTexture( '#0000ff', 'Z' ) } ) );
	var negXAxisHelper = new THREE.Sprite( new THREE.SpriteMaterial( { map: generateTexture( '#ff0000' ) } ) );
	var negYAxisHelper = new THREE.Sprite( new THREE.SpriteMaterial( { map: generateTexture( '#00ff00' ) } ) );
	var negZAxisHelper = new THREE.Sprite( new THREE.SpriteMaterial( { map: generateTexture( '#0000ff' ) } ) );

	posXAxisHelper.position.x = 1;
	posYAxisHelper.position.y = 1;
	posZAxisHelper.position.z = 1;
	negXAxisHelper.position.x = - 1;
	negXAxisHelper.scale.setScalar( 0.8 );
	negYAxisHelper.position.y = - 1;
	negYAxisHelper.scale.setScalar( 0.8 );
	negZAxisHelper.position.z = - 1;
	negZAxisHelper.scale.setScalar( 0.8 );

	axesHelper.add( posXAxisHelper );
	axesHelper.add( posYAxisHelper );
	axesHelper.add( posZAxisHelper );
	axesHelper.add( negXAxisHelper );
	axesHelper.add( negYAxisHelper );
	axesHelper.add( negZAxisHelper );

	var point = new THREE.Vector3();
	var dim = 128;

	this.render = function ( renderer, editorCamera, container ) {

		this.quaternion.copy( editorCamera.quaternion ).inverse();
		this.updateMatrixWorld();

		point.set( 0, 0, 1 );
		point.applyQuaternion( editorCamera.quaternion );

		if ( point.x >= 0 ) {

			posXAxisHelper.material.opacity = 1;
			negXAxisHelper.material.opacity = 0.5;

		} else {

			posXAxisHelper.material.opacity = 0.5;
			negXAxisHelper.material.opacity = 1;

		}

		if ( point.y >= 0 ) {

			posYAxisHelper.material.opacity = 1;
			negYAxisHelper.material.opacity = 0.5;

		} else {

			posYAxisHelper.material.opacity = 0.5;
			negYAxisHelper.material.opacity = 1;

		}

		if ( point.z >= 0 ) {

			posZAxisHelper.material.opacity = 1;
			negZAxisHelper.material.opacity = 0.5;

		} else {

			posZAxisHelper.material.opacity = 0.5;
			negZAxisHelper.material.opacity = 1;

		}

		//

		var x = container.dom.offsetWidth - dim;
		var y = container.dom.offsetHeight - dim;

		renderer.clearDepth();
		renderer.setScissorTest( true );
		renderer.setScissor( x, y, dim, dim );
		renderer.setViewport( x, y, dim, dim );
		renderer.render( this, camera );
		renderer.setScissorTest( false );

	};

	function generateTexture( color, text = null ) {

		var canvas = document.createElement( 'canvas' );
		canvas.width = 128;
		canvas.height = 128;

		var context = canvas.getContext( '2d' );
		context.beginPath();
		context.arc( 64, 64, 32, 0, 2 * Math.PI );
		context.closePath();
		context.fillStyle = color;
		context.fill();

		if ( text !== null ) {

			context.font = '48px Arial';
			context.textAlign = 'center';
			context.fillStyle = '#000000';
			context.fillText( text, 64, 84 );

		}

		return new THREE.CanvasTexture( canvas );

	}

}

ViewHelper.prototype = Object.assign( Object.create( THREE.Object3D.prototype ), {

	constructor: ViewHelper,

	isViewHelper: true

} );

export { ViewHelper };
