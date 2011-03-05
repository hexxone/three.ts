/**
 * @author mr.doob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 */

THREE.Camera = function ( fov, aspect, near, far, target ) {

	THREE.Object3D.call( this );

	this.fov = fov || 50;
	this.aspect = aspect || 1;
	this.near = near || 0.1;
	this.far = far || 2000;

	this.target = target || new THREE.Object3D();
	this.useTarget = true;

	this.matrixWorldInverse = new THREE.Matrix4();
	this.projectionMatrix   = null;

	this.updateProjectionMatrix();

	// movement

	var vector = new THREE.Vector3();

	this.translateX = function ( amount, noFly ) {

		vector.sub( this.target.position, this.position ).normalize().multiplyScalar( amount );
		vector.crossSelf( this.up );

		if ( noFly ) vector.y = 0;

		this.position.addSelf( vector );
		this.target.position.addSelf( vector );

	};

	this.translateZ = function ( amount, noFly ) {

		vector.sub( this.target.position, this.position ).normalize().multiplyScalar( amount );

		if ( noFly ) vector.y = 0;

		this.position.subSelf( vector );
		this.target.position.subSelf( vector );

	};

}

THREE.Camera.prototype = new THREE.Object3D();
THREE.Camera.prototype.constructor = THREE.Camera;
THREE.Camera.prototype.supr = THREE.Object3D.prototype;


THREE.Camera.prototype.updateProjectionMatrix = function () {

	this.projectionMatrix = THREE.Matrix4.makePerspective( this.fov, this.aspect, this.near, this.far );

}


THREE.Camera.prototype.update = function( parentMatrixWorld, forceUpdate, camera ) {

	if ( this.useTarget ) {

		// local

		this.matrix.lookAt( this.position, this.target.position, this.up );
		this.matrix.setPosition( this.position );


		// global

		if( parentMatrixWorld ) {

			this.matrixWorld.multiply( parentMatrixWorld, this.matrix );

		} else {

			this.matrixWorld.copy( this.matrix );

		}

		THREE.Matrix4.makeInvert( this.matrixWorld, this.matrixWorldInverse );

		forceUpdate = true;

	} else {

		if ( this.matrixAutoUpdate ) {

			forceUpdate |= this.updateMatrix();

		}

		if ( forceUpdate || this.matrixWorldNeedsUpdate ) {

			if ( parentMatrixWorld ) {

				this.matrixWorld.multiply( parentMatrixWorld, this.matrix );

			} else {

				this.matrixWorld.copy( this.matrix );

			}

			this.matrixWorldNeedsUpdate = false;
			forceUpdate = true;

			THREE.Matrix4.makeInvert( this.matrixWorld, this.matrixWorldInverse );

		}

	}

	// update children

	for ( var i = 0; i < this.children.length; i ++ ) {

		this.children[ i ].update( this.matrixWorld, forceUpdate, camera );

	}

};
