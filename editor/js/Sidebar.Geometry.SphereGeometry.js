Sidebar.Geometry.SphereGeometry = function ( signals, geometry ) {

	var container = new UI.Panel();
	container.setBorderTop( '1px solid #ccc' );
	container.setPaddingTop( '10px' );

	// radius

	var radiusRow = new UI.Panel();
	var radius = new UI.Number( geometry.radius ).onChange( update );

	radiusRow.add( new UI.Text( 'Radius' ).setWidth( '90px' ).setColor( '#666' ) );
	radiusRow.add( radius );

	container.add( radiusRow );

	// widthSegments

	var widthSegmentsRow = new UI.Panel();
	var widthSegments = new UI.Integer( geometry.widthSegments ).setRange( 1, Infinity ).onChange( update );

	widthSegmentsRow.add( new UI.Text( 'Width segments' ).setWidth( '90px' ).setColor( '#666' ) );
	widthSegmentsRow.add( widthSegments );

	container.add( widthSegmentsRow );

	// heightSegments

	var heightSegmentsRow = new UI.Panel();
	var heightSegments = new UI.Integer( geometry.heightSegments ).setRange( 1, Infinity ).onChange( update );

	heightSegmentsRow.add( new UI.Text( 'Height segments' ).setWidth( '90px' ).setColor( '#666' ) );
	heightSegmentsRow.add( heightSegments );

	container.add( heightSegmentsRow );

	// phiStart

	var phiStartRow = new UI.Panel();
	var phiStart = new UI.Number( geometry.phiStart ).onChange( update );

	phiStartRow.add( new UI.Text( 'Phi start' ).setWidth( '90px' ).setColor( '#666' ) );
	phiStartRow.add( phiStart );

	container.add( phiStartRow );

	// phiLength

	var phiLengthRow = new UI.Panel();
	var phiLength = new UI.Number( geometry.phiLength ).onChange( update );

	phiLengthRow.add( new UI.Text( 'Phi length' ).setWidth( '90px' ).setColor( '#666' ) );
	phiLengthRow.add( phiLength );

	container.add( phiLengthRow );

	// thetaStart

	var thetaStartRow = new UI.Panel();
	var thetaStart = new UI.Number( geometry.thetaStart ).onChange( update );

	thetaStartRow.add( new UI.Text( 'Theta start' ).setWidth( '90px' ).setColor( '#666' ) );
	thetaStartRow.add( thetaStart );

	container.add( thetaStartRow );

	// thetaLength

	var thetaLengthRow = new UI.Panel();
	var thetaLength = new UI.Number( geometry.thetaLength ).onChange( update );

	thetaLengthRow.add( new UI.Text( 'Theta length' ).setWidth( '90px' ).setColor( '#666' ) );
	thetaLengthRow.add( thetaLength );

	container.add( thetaLengthRow );


	//

	function update() {

		editor.remakeGeometry( geometry,
			{
				radius: radius.getValue(),
				widthSegments: widthSegments.getValue(),
				heightSegments: heightSegments.getValue(),
				phiStart: phiStart.getValue(),
				phiLength: phiLength.getValue(),
				thetaStart: thetaStart.getValue(),
				thetaLength: thetaLength.getValue()
			}
		);

	}

	return container;

}
