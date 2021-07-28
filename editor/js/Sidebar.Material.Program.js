import { UIButton, UIRow, UIText } from './libs/ui.js';

function SidebarMaterialProgram( editor, property ) {

	const signals = editor.signals;
	const strings = editor.strings;

	let object = null;
	let material = null;

	const container = new UIRow();
	container.add( new UIText( strings.getKey( 'sidebar/material/program' ) ).setWidth( '90px' ) );

	const programInfo = new UIButton( strings.getKey( 'sidebar/material/info' ) );
	programInfo.setMarginRight( '4px' );
	programInfo.onClick( function () {

		signals.editScript.dispatch( object, 'programInfo' );

	} );
	container.add( programInfo );

	const programVertex = new UIButton( strings.getKey( 'sidebar/material/vertex' ) );
	programVertex.setMarginRight( '4px' );
	programVertex.onClick( function () {

		signals.editScript.dispatch( object, 'vertexShader' );

	} );
	container.add( programVertex );

	const programFragment = new UIButton( strings.getKey( 'sidebar/material/fragment' ) );
	programFragment.setMarginRight( '4px' );
	programFragment.onClick( function () {

		signals.editScript.dispatch( object, 'fragmentShader' );

	} );
	container.add( programFragment );

	function update() {

		if ( object === null ) return;
		if ( object.material === undefined ) return;

		material = object.material;

		if ( property in material ) {

			container.setDisplay( '' );

		} else {

			container.setDisplay( 'none' );

		}

	}

	//

	signals.objectSelected.add( function ( selected ) {

		object = selected;

		update();

	} );

	signals.materialChanged.add( update );

	return container;

}

export { SidebarMaterialProgram };
