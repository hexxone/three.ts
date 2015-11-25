/**
 * The way to use RaytracingWorkerRenderer is similar to RaytracingRenderer
 * except that it is simply a coordinator for workers. The workers compute
 * the pixel values and this renderer simply paints it to the Canvas. As such,
 * it is simply a renderer.
 *
 * TODO
 * - serialize scene and hand it to workers
 * - pass worker path as option
 *
 * @author zz85 / http://github.com/zz85
 */

THREE.RaytracingWorkerRenderer = function ( parameters ) {

	console.log( 'THREE.RaytracingWorkerRenderer', THREE.REVISION );

	parameters = parameters || {};

	var scope = this;
	var pool = [];
	var renderering = false;

	var canvas = document.createElement( 'canvas' );
	var context = canvas.getContext( '2d', {
		alpha: parameters.alpha === true
	} );

	var maxRecursionDepth = 3;

	var canvasWidth, canvasHeight;
	var canvasWidthHalf, canvasHeightHalf;

	var clearColor = new THREE.Color( 0x000000 );

	this.domElement = canvas;

	this.autoClear = true;

	var workers = parameters.workers;
	var blockSize = parameters.blockSize || 64;

	console.log( '%cSpinning off ' + workers + ' Workers ', 'font-size: 20px; background: black; color: white; font-family: monospace;' );

	this.setWorkers = function( w ) {

		workers = w || navigator.hardwareConcurrency || 4;

		while ( pool.length < workers ) {

			var i = pool.length;

			var worker = new Worker( 'js/renderers/RaytracingWorker.js' );

			worker.onmessage = function( e ) {

				var data = e.data;

				if ( ! data ) return;

				if ( data.blockSize ) {

					var d = data.data;
					var imagedata = new ImageData( new Uint8ClampedArray( d ), data.blockSize, data.blockSize );
					context.putImageData( imagedata, data.blockX, data.blockY );

				} else if ( data.type == 'complete' ) {

					console.log( 'Worker ' + data.worker, data.time / 1000, ( Date.now() - reallyThen ) / 1000 + ' s' );

					if ( pool.length > workers ) {

						pool.splice( pool.indexOf( this ), 1 )
						return this.terminate();

					}

					renderNext( this );

				}

			}

			worker.color = new THREE.Color().setHSL( i / workers, 0.8, 0.8 ).getHexString();
			pool.push( worker );

			if ( renderering ) {

				worker.postMessage( {

					init: [ canvasWidth, canvasHeight ],
					worker: i,
					workers: pool.length,
					blockSize: blockSize,
					initScene: initScene.toString()

				} );

				renderNext( worker );

			}

		}

		if ( ! renderering ) {

			while ( pool.length > workers ) {

				pool.pop().terminate();

			}

		}

	};

	this.setWorkers( workers );

	this.setClearColor = function ( color, alpha ) {

		clearColor.set( color );

	};

	this.setPixelRatio = function () {};

	this.setSize = function ( width, height ) {

		canvas.width = width;
		canvas.height = height;

		canvasWidth = canvas.width;
		canvasHeight = canvas.height;

		canvasWidthHalf = Math.floor( canvasWidth / 2 );
		canvasHeightHalf = Math.floor( canvasHeight / 2 );

		context.fillStyle = 'white';

		pool.forEach( function( p, i ) {

			p.postMessage( {

				init: [ width, height ],
				worker: i,
				workers: pool.length,
				blockSize: blockSize

			} );

		} );

	};

	this.setSize( canvas.width, canvas.height );

	this.clear = function () {

	};

	//

	var nextBlock, totalBlocks, xblocks, yblocks;

	function renderNext( worker ) {

		var current = nextBlock ++;
		if ( nextBlock > totalBlocks ) {

			renderering = false;
			return scope.dispatchEvent( { type: "complete" } );

		}

		var blockX = ( current % xblocks ) * blockSize;
		var blockY = ( current / xblocks | 0 ) * blockSize;

		worker.postMessage( {
			render: true,
			x: blockX,
			y: blockY
		} );

		context.fillStyle = '#' + worker.color;

		context.fillRect( blockX, blockY, blockSize, blockSize );

	}

	var materials = {};

	var _annex = {
		mirror: 1,
		reflectivity: 1,
		refractionRatio: 1,
		glass: 1,
		vertexColors: 1,
		shading: 1
	};

	function serializeObject( o ) {

		var mat = o.material;

		if ( ! mat || mat.uuid in materials ) return;

		var props = {};
		for ( var m in _annex ) {

			if ( mat[m] !== undefined ) {

				props[ m ] = mat[ m ];

			}

		}

		materials[ mat.uuid ] = props;
	}

	this.render = function ( scene, camera ) {

		renderering = true;

		// update scene graph

		if ( scene.autoUpdate === true ) scene.updateMatrixWorld();

		// update camera matrices

		if ( camera.parent === null ) camera.updateMatrixWorld();


		var sceneJSON = scene.toJSON();
		var cameraJSON = camera.toJSON();

		scene.traverse( serializeObject );

		pool.forEach(function(worker) {
			worker.postMessage({
				scene: sceneJSON,
				camera: cameraJSON,
				annex: materials
			});
		});

		context.clearRect( 0, 0, canvasWidth, canvasHeight );
		reallyThen = Date.now();

		xblocks = Math.ceil( canvasWidth / blockSize );
		yblocks = Math.ceil( canvasHeight / blockSize );
		nextBlock = 0;
		totalBlocks = xblocks * yblocks;

		pool.forEach( renderNext );

	};

};

THREE.EventDispatcher.prototype.apply( THREE.RaytracingWorkerRenderer.prototype );
