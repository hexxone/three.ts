Sidebar.Geometry.TorusGeometry = function ( signals, geometry ) {

	var container = new UI.Panel();
	container.setBorderTop( '1px solid #ccc' );
	container.setPaddingTop( '10px' );

	// radius

	var radiusRow = new UI.Panel();
	var radius = new UI.Number( geometry.radius ).onChange( update );

	radiusRow.add( new UI.Text( 'Radius' ).setWidth( '90px' ).setColor( '#666' ) );
	radiusRow.add( radius );

	container.add( radiusRow );

	// tube

	var tubeRow = new UI.Panel();
	var tube = new UI.Number( geometry.tube ).onChange( update );

	tubeRow.add( new UI.Text( 'Tube' ).setWidth( '90px' ).setColor( '#666' ) );
	tubeRow.add( tube );

	container.add( tubeRow );

	// radialSegments

	var radialSegmentsRow = new UI.Panel();
	var radialSegments = new UI.Integer( geometry.radialSegments ).setRange( 1, Infinity ).onChange( update );

	radialSegmentsRow.add( new UI.Text( 'Radial segments' ).setWidth( '90px' ).setColor( '#666' ) );
	radialSegmentsRow.add( radialSegments );

	container.add( radialSegmentsRow );

	// tubularSegments

	var tubularSegmentsRow = new UI.Panel();
	var tubularSegments = new UI.Integer( geometry.tubularSegments ).setRange( 1, Infinity ).onChange( update );

	tubularSegmentsRow.add( new UI.Text( 'Tubular segments' ).setWidth( '90px' ).setColor( '#666' ) );
	tubularSegmentsRow.add( tubularSegments );

	container.add( tubularSegmentsRow );

	// arc

	var arcRow = new UI.Panel();
	var arc = new UI.Number( geometry.arc ).onChange( update );

	arcRow.add( new UI.Text( 'Arc' ).setWidth( '90px' ).setColor( '#666' ) );
	arcRow.add( arc );

	container.add( arcRow );

	//

	function update() {

		var uuid = geometry.uuid;
		var name = geometry.name;
		var object;

		editor.geometries[uuid] = new THREE.TorusGeometry(
			radius.getValue(),
			tube.getValue(),
			radialSegments.getValue(),
			tubularSegments.getValue(),
			arc.getValue()
		);

		editor.geometries[uuid].computeBoundingSphere();
		editor.geometries[uuid].uuid = uuid;
		editor.geometries[uuid].name = name;

		for ( var i in editor.objects ) {

			object = editor.objects[i];

			if ( object.geometry && object.geometry.uuid == uuid ) {

				delete object.__webglInit; // TODO: Remove hack (WebGLRenderer refactoring)
				object.geometry.dispose();

				object.geometry = editor.geometries[uuid];

				signals.objectChanged.dispatch( object );

			}

		}

	}

	return container;

}
