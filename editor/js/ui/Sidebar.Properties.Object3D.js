Sidebar.Properties.Object3D = function ( signals ) {

	var objects = {

		'PerspectiveCamera': THREE.PerspectiveCamera,
		'PointLight': THREE.PointLight,
		'DirectionalLight': THREE.DirectionalLight,
		'Mesh': THREE.Mesh,
		'Object3D': THREE.Object3D

	};

	var container = new UI.Panel();
	container.setDisplay( 'none' );

	var objectType = new UI.Text().setColor( '#666' );
	container.add( objectType );
	container.add( new UI.Break(), new UI.Break() );

	// name

	var objectNameRow = new UI.Panel();
	var objectName = new UI.Text( 'absolute' ).setLeft( '100px' ).setColor( '#444' );

	objectNameRow.add( new UI.Text().setValue( 'Name' ).setColor( '#666' ) );
	objectNameRow.add( objectName );

	container.add( objectNameRow );

	// position

	var objectPositionRow = new UI.Panel();
	var objectPositionX = new UI.Number( 'absolute' ).setLeft( '100px' ).setWidth( '50px' ).onChange( update );
	var objectPositionY = new UI.Number( 'absolute' ).setLeft( '160px' ).setWidth( '50px' ).onChange( update );
	var objectPositionZ = new UI.Number( 'absolute' ).setLeft( '220px' ).setWidth( '50px' ).onChange( update );

	objectPositionRow.add( new UI.Text().setValue( 'Position' ).setColor( '#666' ) );
	objectPositionRow.add( objectPositionX, objectPositionY, objectPositionZ );

	container.add( objectPositionRow );

	// rotation

	var objectRotationRow = new UI.Panel();
	var objectRotationX = new UI.Number( 'absolute' ).setLeft( '100px' ).setWidth( '50px' ).onChange( update );
	var objectRotationY = new UI.Number( 'absolute' ).setLeft( '160px' ).setWidth( '50px' ).onChange( update );
	var objectRotationZ = new UI.Number( 'absolute' ).setLeft( '220px' ).setWidth( '50px' ).onChange( update );

	objectRotationRow.add( new UI.Text().setValue( 'Rotation' ).setColor( '#666' ) );
	objectRotationRow.add( objectRotationX, objectRotationY, objectRotationZ );

	container.add( objectRotationRow );

	// scale

	var objectScaleRow = new UI.Panel();
	var objectScaleX = new UI.Number( 'absolute' ).setValue( 1 ).setLeft( '100px' ).setWidth( '50px' ).onChange( update );
	var objectScaleY = new UI.Number( 'absolute' ).setValue( 1 ).setLeft( '160px' ).setWidth( '50px' ).onChange( update );
	var objectScaleZ = new UI.Number( 'absolute' ).setValue( 1 ).setLeft( '220px' ).setWidth( '50px' ).onChange( update );

	objectScaleRow.add( new UI.Text().setValue( 'Scale' ).setColor( '#666' ) );
	objectScaleRow.add( objectScaleX, objectScaleY, objectScaleZ );

	container.add( objectScaleRow );

	// visible

	var objectVisibleRow = new UI.Panel();
	var objectVisible = new UI.Checkbox( 'absolute' ).setLeft( '100px' ).onChange( update );

	objectVisibleRow.add( new UI.Text().setValue( 'Visible' ).setColor( '#666' ) );
	objectVisibleRow.add( objectVisible );

	container.add( objectVisibleRow );


	// fov

	var objectFovRow = new UI.Panel();
	var objectFov = new UI.Number( 'absolute' ).setLeft( '100px' ).onChange( update );

	objectFovRow.add( new UI.Text().setValue( 'Fov' ).setColor( '#666' ) );
	objectFovRow.add( objectFov );

	container.add( objectFovRow );

	// near

	var objectNearRow = new UI.Panel();
	var objectNear = new UI.Number( 'absolute' ).setLeft( '100px' ).onChange( update );

	objectNearRow.add( new UI.Text().setValue( 'Near' ).setColor( '#666' ) );
	objectNearRow.add( objectNear );

	container.add( objectNearRow );

	// far

	var objectFarRow = new UI.Panel();
	var objectFar = new UI.Number( 'absolute' ).setLeft( '100px' ).onChange( update );

	objectFarRow.add( new UI.Text().setValue( 'Far' ).setColor( '#666' ) );
	objectFarRow.add( objectFar );

	container.add( objectFarRow );


	container.add( new UI.Break() );

	//

	var selected = null;

	function update() {

		if ( selected ) {

			selected.position.x = objectPositionX.getValue();
			selected.position.y = objectPositionY.getValue();
			selected.position.z = objectPositionZ.getValue();

			selected.rotation.x = objectRotationX.getValue();
			selected.rotation.y = objectRotationY.getValue();
			selected.rotation.z = objectRotationZ.getValue();

			selected.scale.x = objectScaleX.getValue();
			selected.scale.y = objectScaleY.getValue();
			selected.scale.z = objectScaleZ.getValue();

			selected.visible = objectVisible.getValue();

			if ( selected.fov !== undefined ) {

				selected.fov = objectFov.getValue();

			}

			if ( selected.near !== undefined ) {

				selected.near = objectNear.getValue();

			}

			if ( selected.far !== undefined ) {

				selected.far = objectFar.getValue();

			}

			signals.objectChanged.dispatch( selected );

		}

	}

	function updateRows() {

		var properties = {
			'fov': objectFovRow,
			'near': objectNearRow,
			'far': objectFarRow
		};

		for ( var property in properties ) {

			properties[ property ].setDisplay( selected[ property ] !== undefined ? '' : 'none' );

		}

	}

	function getObjectInstanceName( object ) {

		for ( var key in objects ) {

			if ( object instanceof objects[ key ] ) return key;

		}

	}

	// events

	signals.objectSelected.add( function ( object ) {

		selected = object;

		if ( object ) {

			container.setDisplay( 'block' );

			objectType.setValue( getObjectInstanceName( object ).toUpperCase() );

			objectName.setValue( object.name );

			objectPositionX.setValue( object.position.x );
			objectPositionY.setValue( object.position.y );
			objectPositionZ.setValue( object.position.z );

			objectRotationX.setValue( object.rotation.x );
			objectRotationY.setValue( object.rotation.y );
			objectRotationZ.setValue( object.rotation.z );

			objectScaleX.setValue( object.scale.x );
			objectScaleY.setValue( object.scale.y );
			objectScaleZ.setValue( object.scale.z );

			if ( object.fov !== undefined ) {

				objectFov.setValue( object.fov );

			}

			if ( object.near !== undefined ) {

				objectNear.setValue( object.near );

			}

			if ( object.far !== undefined ) {

				objectFar.setValue( object.far );

			}

			objectVisible.setValue( object.visible );

			updateRows();

		} else {

			container.setDisplay( 'none' );

		}

	} );

	return container;

}
