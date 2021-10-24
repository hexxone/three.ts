import { Color } from '../math/Color';

class FogExp2 {

	name: string;
	color: Color;
	density: number;

	constructor(color, density) {
		this.name = '';

		this.color = new Color(color);
		this.density = (density !== undefined) ? density : 0.00025;
	}

	clone() {
		return new FogExp2(this.color, this.density);
	}

	toJSON( /* meta */) {
		return {
			type: 'FogExp2',
			color: this.color.getHex(),
			density: this.density,
		};
	}
}

FogExp2.prototype.isFogExp2 = true;

export { FogExp2 };
