var Editor = function () {

	var SIGNALS = signals;

	this.signals = {

		// actions

		playAnimations: new SIGNALS.Signal(),

		// notifications

		transformModeChanged: new SIGNALS.Signal(),
		snapChanged: new SIGNALS.Signal(),
		rendererChanged: new SIGNALS.Signal(),

		sceneGraphChanged: new SIGNALS.Signal(),

		objectSelected: new SIGNALS.Signal(),
		objectAdded: new SIGNALS.Signal(),
		objectChanged: new SIGNALS.Signal(),
		objectRemoved: new SIGNALS.Signal(),

		helperAdded: new SIGNALS.Signal(),
		helperRemoved: new SIGNALS.Signal(),

		materialChanged: new SIGNALS.Signal(),
		clearColorChanged: new SIGNALS.Signal(),
		fogTypeChanged: new SIGNALS.Signal(),
		fogColorChanged: new SIGNALS.Signal(),
		fogParametersChanged: new SIGNALS.Signal(),
		windowResize: new SIGNALS.Signal()

	};

	this.scene = new THREE.Scene();
	this.sceneHelpers = new THREE.Scene();

	this.object = {};
	this.geometries = {};
	this.materials = {};
	this.textures = {};

	this.selected = null;
	this.helpers = {};

};

Editor.prototype = {

	setScene: function ( scene ) {

		this.scene.name = scene.name;
		this.scene.userData = JSON.parse( JSON.stringify( scene.userData ) );

		while ( scene.children.length > 0 ) {

			this.addObject( scene.children[ 0 ] );

		}

	},

	//

	addObject: function ( object ) {

		this.scene.add( object );
		this.addHelper( object );

		this.signals.objectAdded.dispatch( object );
		this.signals.sceneGraphChanged.dispatch();

	},

	removeObject: function ( object ) {

		if ( object.parent === undefined ) return; // avoid deleting the camera or scene

		if ( confirm( 'Delete ' + object.name + '?' ) === false ) return;

		object.parent.remove( object );
		this.removeHelper( object );

		this.signals.objectRemoved.dispatch( object );
		this.signals.sceneGraphChanged.dispatch();

	},

	addGeometry: function ( geometry  ) {

	},

	removeGeometry: function ( geometry  ) {

	},

	addMaterial: function ( material ) {

	},

	removeMaterial: function ( material ) {

	},

	addTexture: function ( texture ) {

	},

	removeTexture: function ( texture ) {

	},

	//

	addHelper: function ( object ) {

		if ( object instanceof THREE.PointLight ) {

			var helper = new THREE.PointLightHelper( object, 10 );
			helper.lightSphere.id = object.id;
			this.sceneHelpers.add( helper );
			this.helpers[ object.id ] = helper;

			this.signals.helperAdded.dispatch( helper );

		} else if ( object instanceof THREE.DirectionalLight ) {

			var helper = new THREE.DirectionalLightHelper( object, 10 );
			helper.lightSphere.id = object.id;
			this.sceneHelpers.add( helper );
			this.helpers[ object.id ] = helper;

			this.signals.helperAdded.dispatch( helper );

		} else if ( object instanceof THREE.SpotLight ) {

			var helper = new THREE.SpotLightHelper( object, 10 );
			helper.lightSphere.id = object.id;
			this.sceneHelpers.add( helper );
			this.helpers[ object.id ] = helper;

			this.signals.helperAdded.dispatch( helper );

		} else if ( object instanceof THREE.HemisphereLight ) {

			var helper = new THREE.HemisphereLightHelper( object, 10 );
			helper.lightSphere.id = object.id;
			this.sceneHelpers.add( helper );
			this.helpers[ object.id ] = helper;

			this.signals.helperAdded.dispatch( helper );

		}

	},

	removeHelper: function ( object ) {

		if ( this.helpers[ object.id ] !== undefined ) {

			this.helpers[ object.id ].parent.remove( this.helpers[ object.id ] );
			delete this.helpers[ object.id ];

			this.signals.helperRemoved.dispatch( helper );

		}

	},

	//

	parent: function ( object, parent ) {

		if ( parent === undefined ) {

			parent = this.scene;

		}

		parent.add( object );

		this.signals.sceneGraphChanged.dispatch();

	},

	//

	select: function ( object ) {

		this.selected = object;
		this.signals.objectSelected.dispatch( object );

	},

	selectById: function ( id ) {

		var scope = this;

		this.scene.traverse( function ( node ) {

			if ( node.id === id ) {

				scope.select( node );

			}

		} );

	},

	deselect: function () {

		this.select( null );

	}

}
