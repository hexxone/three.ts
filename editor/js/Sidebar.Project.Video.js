import { UIBreak, UIButton, UIInteger, UIPanel, UIProgress, UIRow, UIText } from './libs/ui.js';

import { APP } from './libs/app.js';

function SidebarProjectVideo( editor ) {

	var container = new UIPanel();
	container.setId( 'render' );

	// Video

	container.add( new UIText( 'Video' ).setTextTransform( 'uppercase' ) );
	container.add( new UIBreak(), new UIBreak() );

	// Resolution

	var resolutionRow = new UIRow();
	container.add( resolutionRow );

	resolutionRow.add( new UIText( 'Resolution' ).setWidth( '90px' ) );

	var videoWidth = new UIInteger( 600 ).setWidth( '28px' );
	resolutionRow.add( videoWidth );

	resolutionRow.add( new UIText( '×' ).setFontSize( '12px' ).setWidth( '14px' ) );

	var videoHeight = new UIInteger( 600 ).setWidth( '28px' );
	resolutionRow.add( videoHeight );

	var videoFPS = new UIInteger( 30 ).setTextAlign( 'center' ).setWidth( '20px' );
	resolutionRow.add( videoFPS );

	resolutionRow.add( new UIText( 'fps' ).setFontSize( '12px' ) );

	// Duration

	var videoDurationRow = new UIRow();
	videoDurationRow.add( new UIText( 'Duration' ).setWidth( '90px' ) );

	var videoDuration = new UIInteger( 10 );
	videoDurationRow.add( videoDuration );

	container.add( videoDurationRow );

	// Render

	container.add( new UIText( '' ).setWidth( '90px' ) );

	const progress = new UIProgress( 0 );
	progress.setDisplay( 'none' );
	progress.setWidth( '170px' );
	container.add( progress );

	const renderButton = new UIButton( 'RENDER' );
	renderButton.setWidth( '170px' );
	renderButton.onClick( async () => {

		renderButton.setDisplay( 'none' );
		progress.setDisplay( '' );
		progress.setValue( 0 );

		const player = new APP.Player();
		player.load( editor.toJSON() );
		player.setPixelRatio( 1 );
		player.setSize( videoWidth.getValue(), videoHeight.getValue() );

		const canvas = player.dom.firstElementChild;

		//

		const { createFFmpeg, fetchFile } = FFmpeg; // eslint-disable-line no-undef
		const ffmpeg = createFFmpeg( { log: true } );

		await ffmpeg.load();

		ffmpeg.setProgress( ( { ratio } ) => {

			progress.setValue( ratio );

		} );

		const fps = videoFPS.getValue();
		const duration = videoDuration.getValue();
		const frames = duration * fps;

		let currentTime = 0;

		for ( let i = 0; i < frames; i ++ ) {

			player.render( currentTime );

			const num = i.toString().padStart( 5, '0' );
			ffmpeg.FS( 'writeFile', `tmp.${num}.png`, await fetchFile( canvas.toDataURL() ) );
			currentTime += 1 / fps;

			progress.setValue( i / frames );

		}

		await ffmpeg.run( '-framerate', String( fps ), '-pattern_type', 'glob', '-i', '*.png', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-preset', 'slow', '-crf', String( 6 ), 'out.mp4' );

		const data = ffmpeg.FS( 'readFile', 'out.mp4' );

		for ( let i = 0; i < frames; i ++ ) {

			const num = i.toString().padStart( 5, '0' );
			ffmpeg.FS( 'unlink', `tmp.${num}.png` );

		}

		save( new Blob( [ data.buffer ], { type: 'video/mp4' } ), 'out.mp4' );

		player.dispose();

		renderButton.setDisplay( '' );
		progress.setDisplay( 'none' );

	} );
	container.add( renderButton );

	// SAVE

	const link = document.createElement( 'a' );

	function save( blob, filename ) {

		link.href = URL.createObjectURL( blob );
		link.download = filename;
		link.dispatchEvent( new MouseEvent( 'click' ) );

		// URL.revokeObjectURL( url ); breaks Firefox...

	}

	//

	return container;

}

export { SidebarProjectVideo };
