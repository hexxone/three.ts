Sidebar.Properties = function ( signals ) {

	var selected = null;

	var container = new UI.Panel();
	container.setDisplay( 'none' );
	container.setPadding( '8px' );
	container.setBorderTop( '1px solid #ccc' );

	container.add( new UI.Text().setText( 'OBJECT' ).setColor( '#666' ) );

	container.add( new UI.Break(), new UI.Break() );

	container.add( new UI.Text().setText( 'Name' ).setColor( '#666' ) );

	var objectName = new UI.Text( 'absolute' ).setLeft( '90px' ).setColor( '#444' ).setFontSize( '12px' );

	container.add( objectName );

	container.add( new UI.HorizontalRule() );

	container.add( new UI.Text().setText( 'Position' ).setColor( '#666' ) );

	var positionX = new UI.FloatNumber( 'absolute' ).setLeft( '90px' ).onChanged( update );
	var positionY = new UI.FloatNumber( 'absolute' ).setLeft( '160px' ).onChanged( update );
	var positionZ = new UI.FloatNumber( 'absolute' ).setLeft( '230px' ).onChanged( update );

	container.add( positionX, positionY, positionZ );

	container.add( new UI.HorizontalRule() );

	container.add( new UI.Text().setText( 'Rotation' ).setColor( '#666' ) );

	var rotationX = new UI.FloatNumber( 'absolute' ).setLeft( '90px' ).onChanged( update );
	var rotationY = new UI.FloatNumber( 'absolute' ).setLeft( '160px' ).onChanged( update );
	var rotationZ = new UI.FloatNumber( 'absolute' ).setLeft( '230px' ).onChanged( update );

	container.add( rotationX, rotationY, rotationZ );

	container.add( new UI.HorizontalRule() );

	container.add( new UI.Text().setText( 'Scale' ).setColor( '#666' ) );

	var scaleX = new UI.FloatNumber( 'absolute' ).setValue( 1 ).setLeft( '90px' ).onChanged( update );
	var scaleY = new UI.FloatNumber( 'absolute' ).setValue( 1 ).setLeft( '160px' ).onChanged( update );
	var scaleZ = new UI.FloatNumber( 'absolute' ).setValue( 1 ).setLeft( '230px' ).onChanged( update );

	container.add( scaleX, scaleY, scaleZ );

	container.add( new UI.Break(), new UI.Break(), new UI.Break() );


	// Geometry

	container.add( new UI.Text().setText( 'GEOMETRY' ).setColor( '#666' ) );

	container.add( new UI.Break(), new UI.Break() );

	container.add( new UI.Text().setText( 'Name' ).setColor( '#666' ) );

	var geometryName = new UI.Text( 'absolute' ).setLeft( '90px' ).setColor( '#444' ).setFontSize( '12px' );

	container.add( geometryName );

	container.add( new UI.HorizontalRule() );

	container.add( new UI.Text().setText( 'Class' ).setColor( '#666' ) );

	var geometryClass = new UI.Text( 'absolute' ).setLeft( '90px' ).setColor( '#444' ).setFontSize( '12px' );
	container.add( geometryClass );

	container.add( new UI.HorizontalRule() );

	container.add( new UI.Text().setText( 'Vertices' ).setColor( '#666' ) );
	
	var verticesCount = new UI.Text( 'absolute' ).setLeft( '90px' ).setColor( '#444' ).setFontSize( '12px' );
	container.add( verticesCount );

	container.add( new UI.HorizontalRule() );

	container.add( new UI.Text().setText( 'Faces' ).setColor( '#666' ) );

	var facesCount = new UI.Text( 'absolute' ).setLeft( '90px' ).setColor( '#444' ).setFontSize( '12px' );
	container.add( facesCount );


	container.add( new UI.Break(), new UI.Break(), new UI.Break() );

	// Material

	container.add( new UI.Text().setText( 'MATERIAL' ).setColor( '#666' ) );

	container.add( new UI.Break(), new UI.Break() );

	container.add( new UI.Text().setText( 'Name' ).setColor( '#666' ) );

	var materialName = new UI.Text( 'absolute' ).setLeft( '90px' ).setColor( '#444' ).setFontSize( '12px' );

	container.add( materialName );

	container.add( new UI.HorizontalRule() );

	container.add( new UI.Text().setText( 'Class' ).setColor( '#666' ) );

	var materialClass = new UI.Text( 'absolute' ).setLeft( '90px' ).setColor( '#444' ).setFontSize( '12px' );

	container.add( materialClass );

	container.add( new UI.HorizontalRule() );

	container.add( new UI.Text().setText( 'Color' ).setColor( '#666' ) );

	var materialColor = new UI.Text( 'absolute' ).setLeft( '90px' ).setColor( '#444' ).setFontSize( '12px' );

	container.add( materialColor );


	// Events

	function update() {

		if ( selected ) {

			selected.position.x = positionX.getValue();
			selected.position.y = positionY.getValue();
			selected.position.z = positionZ.getValue();

			selected.rotation.x = rotationX.getValue();
			selected.rotation.y = rotationY.getValue();
			selected.rotation.z = rotationZ.getValue();

			selected.scale.x = scaleX.getValue();
			selected.scale.y = scaleY.getValue();
			selected.scale.z = scaleZ.getValue();

			signals.objectChanged.dispatch( selected );

		}

	}

	signals.objectSelected.add( function ( object ) {

		selected = object;

		if ( object ) {

			container.setDisplay( 'block' );

			objectName.setText( object.name );

			positionX.setValue( object.position.x );
			positionY.setValue( object.position.y );
			positionZ.setValue( object.position.z );

			rotationX.setValue( object.rotation.x );
			rotationY.setValue( object.rotation.y );
			rotationZ.setValue( object.rotation.z );

			scaleX.setValue( object.scale.x );
			scaleY.setValue( object.scale.y );
			scaleZ.setValue( object.scale.z );

			if ( object.geometry ) {

				geometryName.setText( object.geometry.name );
				geometryClass.setText( getGeometryInstanceName( object.geometry ) );
				verticesCount.setText( object.geometry.vertices.length );
				facesCount.setText( object.geometry.faces.length );

			}

			if ( object.material ) {

				materialName.setText( object.material.name );
				materialClass.setText( getMaterialInstanceName( object.material ) );
				materialColor.setText( '#' + object.material.color.getHex().toString(16) );

			}

		} else {

			container.setDisplay( 'none' );

		}

	} );

	function getGeometryInstanceName( geometry ) {

		// TODO: Is there a way of doing this automatically?

		if ( geometry instanceof THREE.ConvexGeometry ) return "ConvexGeometry";
		if ( geometry instanceof THREE.CubeGeometry ) return "CubeGeometry";
		if ( geometry instanceof THREE.CylinderGeometry ) return "CylinderGeometry";
		if ( geometry instanceof THREE.ExtrudeGeometry ) return "ExtrudeGeometry";
		if ( geometry instanceof THREE.IcosahedronGeometry ) return "IcosahedronGeometry";
		if ( geometry instanceof THREE.LatheGeometry ) return "LatheGeometry";
		if ( geometry instanceof THREE.OctahedronGeometry ) return "OctahedronGeometry";
		if ( geometry instanceof THREE.ParametricGeometry ) return "ParametricGeometry";
		if ( geometry instanceof THREE.PlaneGeometry ) return "PlaneGeometry";
		if ( geometry instanceof THREE.PolyhedronGeometry ) return "PolyhedronGeometry";
		if ( geometry instanceof THREE.SphereGeometry ) return "SphereGeometry";
		if ( geometry instanceof THREE.TetrahedronGeometry ) return "TetrahedronGeometry";
		if ( geometry instanceof THREE.TextGeometry ) return "TextGeometry";
		if ( geometry instanceof THREE.TorusGeometry ) return "TorusGeometry";
		if ( geometry instanceof THREE.TorusKnotGeometry ) return "TorusKnotGeometry";
		if ( geometry instanceof THREE.TubeGeometry ) return "TubeGeometry";
		if ( geometry instanceof THREE.Geometry ) return "Geometry";

	}

	function getMaterialInstanceName( material ) {

		// TODO: Is there a way of doing this automatically?

		if ( material instanceof THREE.LineBasicMaterial ) return "LineBasicMaterial";
		if ( material instanceof THREE.MeshBasicMaterial ) return "MeshBasicMaterial";
		if ( material instanceof THREE.MeshDepthMaterial ) return "MeshDepthMaterial";
		if ( material instanceof THREE.MeshFaceMaterial ) return "MeshFaceMaterial";
		if ( material instanceof THREE.MeshLambertMaterial ) return "MeshLambertMaterial";
		if ( material instanceof THREE.MeshNormalMaterial ) return "MeshNormalMaterial";
		if ( material instanceof THREE.MeshPhongMaterial ) return "MeshPhongMaterial";
		if ( material instanceof THREE.ParticleBasicMaterial ) return "ParticleBasicMaterial";
		if ( material instanceof THREE.ParticleCanvasMaterial ) return "ParticleCanvasMaterial";
		if ( material instanceof THREE.ParticleDOMMaterial ) return "ParticleDOMMaterial";
		if ( material instanceof THREE.ShaderMaterial ) return "ShaderMaterial";
		if ( material instanceof THREE.Material ) return "Material";

	}


	return container;

}
