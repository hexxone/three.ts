Sidebar.Animation = function ( editor ) {

	var signals = editor.signals;

	var options = {};
	var possibleAnimations = {};

	var container = new UI.CollapsiblePanel();
	container.setDisplay( 'none' );

	container.addStatic( new UI.Text( 'ANIMATION' ) );
	container.add( new UI.Break() );

	var AnimationsRow = new UI.Panel();
	var Animations = new UI.Select().setOptions( options ).setWidth( '130px' ).setColor( '#444' ).setFontSize( '12px' );
	AnimationsRow.add( new UI.Text( 'animations' ).setWidth( '90px' ) );
	AnimationsRow.add( Animations );

	container.add( AnimationsRow );
	container.add( new UI.Break() );

	var PlayRow = new UI.Panel();
	var playButton = new UI.Button().setLabel( 'Play' ).onClick( play );
	PlayRow.add( playButton );

	container.add( PlayRow );
	container.add( new UI.Break() );

	function play() {

		var value = Animations.getValue();

		if ( possibleAnimations[ value ] ) {

			var anims = possibleAnimations[value]

			for ( var i = 0; i < anims.length; i ++ ) {

				anims[ i ].play();

			}

			signals.playAnimations.dispatch( anims );

		};

	}

	signals.objectAdded.add( function ( object ) {

		if ( object instanceof THREE.SkinnedMesh ) {

			var geometry = object.geometry;
			var material = object.material;

			material.skinning = true;

			var name = geometry.animation.name;

			options[ name ] = name

			Animations.setOptions( options );

			THREE.AnimationHandler.add( geometry.animation );

			var animation = new THREE.Animation( object, name );

			if ( possibleAnimations[ name ] ){

				possibleAnimations[ name ].push( animation );

			} else {

				possibleAnimations[ name ] = [ animation ];

			}

		}

	} );

	signals.objectSelected.add( function ( object ) {

		if ( object && object.geometry && object.geometry.animation ) {

			container.setDisplay( 'block' );

		} else {

			container.setDisplay( 'none' );

		}

	} );

	return container;

}
