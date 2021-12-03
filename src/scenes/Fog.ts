import { Color } from '../';

class Fog {
	name: string;
	color: Color;
	near: any;
	far: any;
	isFog = true;

	constructor( color: Color, near: number, far: number ) {
		this.name = '';

		this.color = new Color( color );

		this.near = ( near !== undefined ) ? near : 1;
		this.far = ( far !== undefined ) ? far : 1000;
	}

	clone() {
		return new Fog( this.color, this.near, this.far );
	}

	toJSON( /* meta */ ) {
		return {
			type: 'Fog',
			color: this.color.getHex(),
			near: this.near,
			far: this.far,
		};
	}
}

export { Fog };
