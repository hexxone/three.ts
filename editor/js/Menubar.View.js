Menubar.View = function ( editor ) {

	var container = new UI.Panel();
	container.setClass( 'menu' );
	container.onMouseOver( function () { options.setDisplay( 'block' ) } );
	container.onMouseOut( function () { options.setDisplay( 'none' ) } );
	container.onClick( function () { options.setDisplay( 'block' ) } );

	var title = new UI.Panel();
	title.setTextContent( 'View' );
	title.setMargin( '0px' );
	title.setPadding( '8px' );
	container.add( title );

	//

	var options = new UI.Panel();
	options.setClass( 'options' );
	options.setDisplay( 'none' );
	container.add( options );

	// themes

	var themeLink = document.getElementById( 'theme' );

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Light theme' );
	option.onClick( function () {

		themeLink.href = 'css/light.css';

	} );
	options.add( option );

	// about

	var option = new UI.Panel();
	option.setClass( 'option' );
	option.setTextContent( 'Dark theme' );
	option.onClick( function () {

		themeLink.href = 'css/dark.css';

	} );
	options.add( option );

	//

	return container;

}
