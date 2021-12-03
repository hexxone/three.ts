import { REVISION } from './constants';

export * from './objects';

export * from './animation';
export * from './audio';
export * from './cameras';
export * from './core';
export * from './extras';
export * from './geometries';
export * from './helpers';
export * from './lights';
export * from './loaders';
export * from './materials';
export * from './math';

export * from './renderers';
export * from './scenes';
export * from './textures';
export * from './constants';
export * from './utils';

if ( typeof window !== 'undefined' ) {
	if ( typeof window[ '__THREE_DEVTOOLS__' ] !== 'undefined' ) {
		window[ '__THREE_DEVTOOLS__' ].dispatchEvent( new CustomEvent( 'register', {
			detail: {
				revision: REVISION,
			},
		} ) );
	}

	if ( window[ '__THREE__' ] ) {
		console.warn( 'WARNING: Multiple instances of Three.js being imported.' );
	} else {
		window[ '__THREE__' ] = REVISION;
	}
}
