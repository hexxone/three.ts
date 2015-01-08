/**
 * @author mrdoob / http://mrdoob.com/
 */

UI.ScriptEditor = function () {

	UI.Panel.call( this );

	var scope = this;

	var timeout;

	var event = new UI.Text( '' );
	this.add( event );

	var remove = new UI.Text( 'x' );
	remove.setPosition( 'absolute' );
	remove.setRight( '8px' );
	remove.setCursor( 'pointer' );
	remove.onClick( function () {

		if ( confirm( 'Are you sure?' ) ) {

			scope.parent.remove( scope );

			if ( scope.onChangeCallback !== undefined ) {

				scope.onChangeCallback();

			}

		}

	} );
	this.add( remove );

	this.add( new UI.Break() );

	var textarea = new UI.TextArea();
	textarea.setWidth( '100%' );
	textarea.setHeight( '100px' );
	textarea.setMarginTop( '8px' );
	textarea.onKeyUp( function () {

		clearTimeout( timeout );

		timeout = setTimeout( function () {

			var object = editor.selected;
			var source = textarea.getValue();

			try {

				( new Function( 'scene', 'event', source ).bind( object.clone() ) )( new THREE.Scene(), {} );

				textarea.dom.classList.add( 'success' );
				textarea.dom.classList.remove( 'fail' );

			} catch ( error ) {

				console.error( error );

				textarea.dom.classList.remove( 'success' );
				textarea.dom.classList.add( 'fail' );

				return;

			}

			if ( scope.onChangeCallback !== undefined ) {

				scope.onChangeCallback();

			}

		}, 500 );

	} );
	this.add( textarea );

	this.event = event;
	this.textarea = textarea;

};

UI.ScriptEditor.prototype = Object.create( UI.Panel.prototype );
UI.ScriptEditor.prototype.constructor = UI.ScriptEditor;

UI.ScriptEditor.prototype.getValue = function () {

	return { event: this.event.getValue(), source: this.textarea.getValue() };

};

UI.ScriptEditor.prototype.setValue = function ( value ) {

	this.event.setValue( value.event );
	this.textarea.setValue( value.source );

	return this;

};

UI.ScriptEditor.prototype.onChange = function ( callback ) {

	this.onChangeCallback = callback;

	return this;

};
