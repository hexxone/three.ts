import { Color } from '../';

class FogExp2 {
	name: string;
	color: Color;
	density: number;
	isFogExp2 = true;

	constructor( color, density ) {
		this.name = '';

		this.color = new Color( color );
		this.density = ( density !== undefined ) ? density : 0.00025;
	}

	clone() {
		return new FogExp2( this.color, this.density );
	}

	toJSON( /* meta */ ) {
		return {
			type: 'FogExp2',
			color: this.color.getHex(),
			density: this.density,
		};
	}
}

export { FogExp2 };
