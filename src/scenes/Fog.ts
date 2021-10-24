import { Color } from '../math/Color';

class Fog {

	name: string;
	color: Color;
	near: any;
	far: any;
	isFog: boolean;

	constructor(color, near, far) {
		this.name = '';

		this.color = new Color(color);

		this.near = (near !== undefined) ? near : 1;
		this.far = (far !== undefined) ? far : 1000;

		Object.defineProperty(this, 'isFog', { value: true });
	}

	clone() {
		return new Fog(this.color, this.near, this.far);
	}

	toJSON( /* meta */) {
		return {
			type: 'Fog',
			color: this.color.getHex(),
			near: this.near,
			far: this.far,
		};
	}
}

export { Fog };
