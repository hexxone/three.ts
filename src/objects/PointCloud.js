/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.PointCloud = function ( geometry, material ) {

	THREE.Object3D.call( this );

	this.geometry = geometry !== undefined ? geometry : new THREE.Geometry();
	this.material = material !== undefined ? material : new THREE.PointCloudMaterial( { color: Math.random() * 0xffffff } );

	this.sortParticles = false;

};

THREE.PointCloud.prototype = Object.create( THREE.Object3D.prototype );

THREE.PointCloud.prototype.raycast = ( function () {

	var ray = new THREE.Ray();
	var inverseMatrix = new THREE.Matrix4();

	return function ( raycaster, intersects ) {

		var geometry = this.geometry;
		var threshold = raycaster.params.PointCloud.threshold;

		inverseMatrix.getInverse( this.matrixWorld );
		ray.copy( raycaster.ray ).applyMatrix4( inverseMatrix );

		if ( geometry.boundingBox !== null ) {
	
			if ( ray.isIntersectionBox( geometry.boundingBox ) === false ) {

				return;

			}

		}
	
		var localThreshold = threshold / ( ( this.scale.x + this.scale.y + this.scale.z ) / 3 );
		var pos = new THREE.Vector3();

		if ( geometry instanceof THREE.BufferGeometry ) {
	
			var attributes = geometry.attributes;
			var positions = attributes.position.array;

			if ( attributes.index !== undefined ) {

				var indices = attributes.index.array;
				var offsets = geometry.offsets;

				if ( offsets.length === 0 ) {

					var offset = {
						start: 0,
						count: indices.length,
						index: 0
					};

					offsets = [ offset ];

				}

				for ( var oi = 0, ol = offsets.length; oi < ol; ++oi ) {

					var start = offsets[ oi ].start;
					var count = offsets[ oi ].count;
					var index = offsets[ oi ].index;

					for ( var i = start, il = start + count; i < il; i++ ) {

						var a = index + indices[ i ];

						pos.set(
							positions[ a * 3 ],
							positions[ a * 3 + 1 ],
							positions[ a * 3 + 2 ]
						);

						var rayPointDistance = ray.distanceToPoint( pos );

						if ( rayPointDistance < localThreshold ) {

							var intersectPoint = ray.closestPointToPoint( pos );
							intersectPoint.applyMatrix4( this.matrixWorld );

							var distance = raycaster.ray.origin.distanceTo( intersectPoint );

							intersects.push( {

								distance: distance,
								distanceToRay: rayPointDistance,
								point: intersectPoint.clone(),
								index: a,
								face: null,
								object: this

							} );

						}

					}

				}

			} else {

				var pointCount = positions.length / 3;

				for ( var i = 0; i < pointCount; i ++ ) {

					pos.set(
						positions[ 3 * i ],
						positions[ 3 * i + 1 ],
						positions[ 3 * i + 2 ]
					);

					var rayPointDistance = ray.distanceToPoint( pos );

					if ( rayPointDistance < localThreshold ) {

						var intersectPoint = ray.closestPointToPoint( pos );
						intersectPoint.applyMatrix4( this.matrixWorld );

						var distance = raycaster.ray.origin.distanceTo( intersectPoint );

						intersects.push( {

							distance: distance,
							distanceToRay: rayPointDistance,
							point: intersectPoint,
							index: i,
							face: null,
							object: this

						} );

					}

				}

			}

		} else {

			var vertices = this.geometry.vertices;

			for ( var i = 0; i < vertices.length; i ++ ) {

				pos = vertices[ i ];

				var rayPointDistance = ray.distanceToPoint( pos );

				if ( rayPointDistance < localThreshold ) {

					var intersectPoint = ray.closestPointToPoint( pos );
					intersectPoint.applyMatrix4( this.matrixWorld );

					var distance = raycaster.ray.origin.distanceTo( intersectPoint );

					intersects.push( {

						distance: distance,
						distanceToRay: rayPointDistance,
						point: intersectPoint.clone(),
						index: i,
						face: null,
						object: this

					} );

				}

			}

		}

	};

}() );

THREE.PointCloud.prototype.clone = function ( object ) {

	if ( object === undefined ) object = new THREE.PointCloud( this.geometry, this.material );

	object.sortParticles = this.sortParticles;

	THREE.Object3D.prototype.clone.call( this, object );

	return object;

};

// Backwards compatibility

THREE.ParticleSystem = function ( geometry, material ) {

	console.warn( 'THREE.ParticleSystem has been renamed to THREE.PointCloud.' );
	return new THREE.PointCloud( geometry, material );

};
