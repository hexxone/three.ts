import { Line } from './Line';

class LineLoop extends Line {
	constructor( geometry, material ) {
		super( geometry, material );

		Object.defineProperty(this, 'isLineLoop', true);

		this.type = 'LineLoop';
	}
}

export { LineLoop };
