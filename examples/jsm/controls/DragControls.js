import {
	EventDispatcher,
	Matrix4,
	Plane,
	Raycaster,
	Vector2,
	Vector3
} from '../../../build/three.module.js';

const _plane = new Plane();
const _raycaster = new Raycaster();

const _mouse = new Vector2();
const _offset = new Vector3();
const _intersection = new Vector3();
const _worldPosition = new Vector3();
const _inverseMatrix = new Matrix4();

class DragControls extends EventDispatcher {

	constructor( _objects, _camera, _domElement ) {

		super();

		let _selected = null, _hovered = null;

		const _intersections = [];

		//

		const scope = this;

		function activate() {

			_domElement.addEventListener( 'pointermove', onPointerMove );
			_domElement.addEventListener( 'pointerdown', onPointerDown );
			_domElement.addEventListener( 'pointerup', onPointerCancel );
			_domElement.addEventListener( 'pointerleave', onPointerCancel );
			_domElement.addEventListener( 'touchmove', onTouchMove, { passive: false } );
			_domElement.addEventListener( 'touchstart', onTouchStart, { passive: false } );
			_domElement.addEventListener( 'touchend', onTouchEnd );

		}

		function deactivate() {

			_domElement.removeEventListener( 'pointermove', onPointerMove );
			_domElement.removeEventListener( 'pointerdown', onPointerDown );
			_domElement.removeEventListener( 'pointerup', onPointerCancel );
			_domElement.removeEventListener( 'pointerleave', onPointerCancel );
			_domElement.removeEventListener( 'touchmove', onTouchMove );
			_domElement.removeEventListener( 'touchstart', onTouchStart );
			_domElement.removeEventListener( 'touchend', onTouchEnd );

			_domElement.style.cursor = '';

		}

		function dispose() {

			deactivate();

		}

		function getObjects() {

			return _objects;

		}

		function onPointerMove( event ) {

			switch ( event.pointerType ) {

				case 'mouse':
				case 'pen':
					onMouseMove( event );
					break;

				// TODO touch

			}

		}

		function onMouseMove( event ) {

			const rect = _domElement.getBoundingClientRect();

			_mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
			_mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;

			_raycaster.setFromCamera( _mouse, _camera );

			if ( _selected && scope.enabled ) {

				if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {

					_selected.position.copy( _intersection.sub( _offset ).applyMatrix4( _inverseMatrix ) );

				}

				scope.dispatchEvent( { type: 'drag', object: _selected } );

				return;

			}

			_intersections.length = 0;

			_raycaster.setFromCamera( _mouse, _camera );
			_raycaster.intersectObjects( _objects, true, _intersections );

			if ( _intersections.length > 0 ) {

				const object = _intersections[ 0 ].object;

				_plane.setFromNormalAndCoplanarPoint( _camera.getWorldDirection( _plane.normal ), _worldPosition.setFromMatrixPosition( object.matrixWorld ) );

				if ( _hovered !== object && _hovered !== null ) {

					scope.dispatchEvent( { type: 'hoveroff', object: _hovered } );

					_domElement.style.cursor = 'auto';
					_hovered = null;

				}

				if ( _hovered !== object ) {

					scope.dispatchEvent( { type: 'hoveron', object: object } );

					_domElement.style.cursor = 'pointer';
					_hovered = object;

				}

			} else {

				if ( _hovered !== null ) {

					scope.dispatchEvent( { type: 'hoveroff', object: _hovered } );

					_domElement.style.cursor = 'auto';
					_hovered = null;

				}

			}

		}

		function onPointerDown( event ) {

			switch ( event.pointerType ) {

				case 'mouse':
				case 'pen':
					onMouseDown();
					break;

				// TODO touch

			}

		}

		function onMouseDown() {

			_intersections.length = 0;

			_raycaster.setFromCamera( _mouse, _camera );
			_raycaster.intersectObjects( _objects, true, _intersections );

			if ( _intersections.length > 0 ) {

				_selected = ( scope.transformGroup === true ) ? _objects[ 0 ] : _intersections[ 0 ].object;

				if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {

					_inverseMatrix.copy( _selected.parent.matrixWorld ).invert();
					_offset.copy( _intersection ).sub( _worldPosition.setFromMatrixPosition( _selected.matrixWorld ) );

				}

				_domElement.style.cursor = 'move';

				scope.dispatchEvent( { type: 'dragstart', object: _selected } );

			}


		}

		function onPointerCancel( event ) {

			switch ( event.pointerType ) {

				case 'mouse':
				case 'pen':
					onMouseCancel();
					break;

				// TODO touch

			}

		}

		function onMouseCancel() {

			if ( _selected ) {

				scope.dispatchEvent( { type: 'dragend', object: _selected } );

				_selected = null;

			}

			_domElement.style.cursor = _hovered ? 'pointer' : 'auto';

		}

		function onTouchMove( event ) {

			event.preventDefault();
			event = event.changedTouches[ 0 ];

			const rect = _domElement.getBoundingClientRect();

			_mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
			_mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;

			_raycaster.setFromCamera( _mouse, _camera );

			if ( _selected && scope.enabled ) {

				if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {

					_selected.position.copy( _intersection.sub( _offset ).applyMatrix4( _inverseMatrix ) );

				}

				scope.dispatchEvent( { type: 'drag', object: _selected } );

				return;

			}

		}

		function onTouchStart( event ) {

			event.preventDefault();
			event = event.changedTouches[ 0 ];

			const rect = _domElement.getBoundingClientRect();

			_mouse.x = ( ( event.clientX - rect.left ) / rect.width ) * 2 - 1;
			_mouse.y = - ( ( event.clientY - rect.top ) / rect.height ) * 2 + 1;

			_intersections.length = 0;

			_raycaster.setFromCamera( _mouse, _camera );
			 _raycaster.intersectObjects( _objects, true, _intersections );

			if ( _intersections.length > 0 ) {

				_selected = ( scope.transformGroup === true ) ? _objects[ 0 ] : _intersections[ 0 ].object;

				_plane.setFromNormalAndCoplanarPoint( _camera.getWorldDirection( _plane.normal ), _worldPosition.setFromMatrixPosition( _selected.matrixWorld ) );

				if ( _raycaster.ray.intersectPlane( _plane, _intersection ) ) {

					_inverseMatrix.copy( _selected.parent.matrixWorld ).invert();
					_offset.copy( _intersection ).sub( _worldPosition.setFromMatrixPosition( _selected.matrixWorld ) );

				}

				_domElement.style.cursor = 'move';

				scope.dispatchEvent( { type: 'dragstart', object: _selected } );

			}


		}

		function onTouchEnd( event ) {

			event.preventDefault();

			if ( _selected ) {

				scope.dispatchEvent( { type: 'dragend', object: _selected } );

				_selected = null;

			}

			_domElement.style.cursor = 'auto';

		}

		activate();

		// API

		this.enabled = true;
		this.transformGroup = false;

		this.activate = activate;
		this.deactivate = deactivate;
		this.dispose = dispose;
		this.getObjects = getObjects;

	}

}

export { DragControls };
